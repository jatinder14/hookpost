/**
 * Turn anything that was thrown into a string worth storing.
 *
 * `JSON.stringify(err)` does not work on errors, and it fails in two different
 * ways that both showed up in production:
 *
 *   JSON.stringify(new Error('Pinterest rejected the pin'))  ->  '{}'
 *
 * `message` and `stack` are non-enumerable own properties, so stringify skips
 * them and returns an empty object. Every real failure written through
 * posts.repository.changeState landed in the post's `error` column and in the
 * Errors table as the literal two characters `{}` - so a customer asking "why
 * did my post fail?" got nothing, and neither did we. An error carrying extra
 * properties is worse than useless rather than merely useless:
 *
 *   JSON.stringify(Object.assign(new Error('HTTP 401'), {statusCode: 401}))
 *     ->  '{"statusCode":401}'
 *
 * which looks like real information while having silently dropped the only part
 * a human needed.
 *
 * The second failure is louder. stringify THROWS on a circular structure, and
 * in changeState the call sat inside the object literal passed to
 * `prisma.post.update` - evaluated before the update ran. A provider throwing
 * anything self-referencing (fetch/undici responses and Axios errors both
 * qualify) therefore made changeState itself throw, the post never transitioned
 * to ERROR, and it stayed stuck in its previous state forever.
 *
 * So: read message/stack explicitly, keep any extra enumerable properties,
 * never throw, and cap the length.
 */

/** Errors.message and Post.error are unbounded text columns; a provider that
 *  hands back an HTML error page should not become a megabyte-wide row. */
const MAX_LENGTH = 4000;

const truncate = (s: string): string =>
  s.length <= MAX_LENGTH ? s : `${s.slice(0, MAX_LENGTH - 14)}… [truncated]`;

/** JSON.stringify that yields a string for every input instead of throwing or
 *  returning undefined. Handles circular references and BigInt. */
function safeJson(value: unknown): string {
  const seen = new WeakSet();
  try {
    const out = JSON.stringify(value, (_key, val) => {
      if (typeof val === 'bigint') return `${val}n`;
      if (val && typeof val === 'object') {
        if (seen.has(val as object)) return '[Circular]';
        seen.add(val as object);
      }
      return val;
    });
    return out === undefined ? String(value) : out;
  } catch {
    // A getter that throws, a Proxy that refuses inspection, etc.
    try {
      return String(value);
    } catch {
      return '[unserializable]';
    }
  }
}

export function serializeError(err: unknown): string {
  if (err === null || err === undefined) return String(err);
  if (typeof err === 'string') return truncate(err);
  if (typeof err !== 'object') return truncate(String(err));

  if (err instanceof Error) {
    const name = err.name || 'Error';
    const message = err.message || '(no message)';
    let out = `${name}: ${message}`;

    // Temporal's ApplicationFailure carries the useful part in `details`, and
    // provider errors routinely attach statusCode/body. These ARE enumerable,
    // so keep them - they were the only thing the old code preserved.
    // `cause` is printed separately below, so keep it out of here or it shows
    // up twice - once as an empty {} and once usefully.
    const { cause: _cause, ...extras } = err as unknown as Record<string, unknown>;
    if (Object.keys(extras).length) out += ` ${safeJson(extras)}`;

    // `cause` is non-enumerable too, so it needs naming explicitly.
    const cause = (err as { cause?: unknown }).cause;
    if (cause !== undefined) {
      out += ` [cause: ${
        cause instanceof Error ? `${cause.name}: ${cause.message}` : safeJson(cause)
      }]`;
    }

    if (err.stack) {
      // First two frames are enough to locate it without storing a novel.
      const frames = err.stack.split('\n').slice(1, 3).map((l) => l.trim()).join(' ');
      if (frames) out += `\n    at ${frames}`;
    }
    return truncate(out);
  }

  // Plain object, array, or an error-shaped thing that is not an Error.
  const shaped = err as { message?: unknown; error?: unknown };
  if (typeof shaped.message === 'string' && shaped.message) {
    // Drop `message` from the remainder so it is not printed twice.
    const { message: _m, ...rest } = err as Record<string, unknown>;
    const restJson = Object.keys(rest).length ? ` ${safeJson(rest)}` : '';
    return truncate(`${shaped.message}${restJson}`);
  }
  if (typeof shaped.error === 'string' && shaped.error) return truncate(shaped.error);

  const json = safeJson(err);
  // An empty object really is all the information there was; say so rather than
  // storing `{}` and leaving the reader wondering whether it is a bug.
  return truncate(json === '{}' ? '[empty error object]' : json);
}
