import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hookpost OAuth Apps — Let Other People Connect Their Account',
  description:
    'Build an integration that connects to other people’s Hookpost accounts. Authorization Code flow with PKCE, scoped access tokens, and no shared API keys.',
  keywords: [
    'hookpost oauth',
    'social media scheduler oauth',
    'oauth authorization code pkce',
    'hookpost integration',
    'connect hookpost account',
  ],
  alternates: {
    canonical: 'https://hookpost.hookstep.in/docs/oauth',
  },
};

const BASE = 'https://hookpost.hookstep.in/api';

const Code = ({ children }: { children: string }) => (
  <pre className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed font-mono text-white/90">
    {children}
  </pre>
);

const Step = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF4CE2] text-black text-sm font-black">
        {n}
      </span>
      <h3 className="text-lg font-bold text-white">{title}</h3>
    </div>
    <div className="space-y-3 pl-10">{children}</div>
  </div>
);

export default function OAuthDocsPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hookpost.hookstep.in' },
      { '@type': 'ListItem', position: 2, name: 'Docs', item: 'https://hookpost.hookstep.in/docs/public-api' },
      { '@type': 'ListItem', position: 3, name: 'OAuth Apps', item: 'https://hookpost.hookstep.in/docs/oauth' },
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Build a Hookpost OAuth Integration',
    description:
      'Register an OAuth application, send users through the authorization screen, exchange the code for an access token, and call the Hookpost Public API on their behalf.',
    step: [
      { '@type': 'HowToStep', name: 'Register your application', text: 'Create an OAuth app in Settings and record the client id, client secret and redirect URI.' },
      { '@type': 'HowToStep', name: 'Send the user to authorize', text: 'Redirect the user to /oauth/authorize with your client id, redirect URI and a PKCE code challenge.' },
      { '@type': 'HowToStep', name: 'Exchange the code for a token', text: 'POST the returned code to /oauth/token together with your code verifier to receive an access token.' },
      { '@type': 'HowToStep', name: 'Call the API', text: 'Send the access token in the Authorization header of any Public API request.' },
    ],
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#FF4CE2] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <div className="w-full bg-[#FF4CE2] text-black text-center font-medium text-sm py-1.5 px-4 font-sans">
        ⚡ Developer Docs — Let other people connect their Hookpost account to your product
      </div>

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <img alt="Hookpost" src="/brand-logo-96.png" width="96" height="96" className="h-8 md:h-10 w-auto max-h-[38px] object-contain" />
          <span className="text-2xl font-black tracking-tight text-white">
            Hook<span className="text-[#FF4CE2]">post</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-white hover:text-[#FF4CE2] transition-colors px-4 py-2 border border-white/20 rounded-full hover:border-[#FF4CE2]"
          >
            Log In
          </Link>
          <Link
            href="/auth"
            className="text-sm font-medium bg-white text-black hover:bg-[#FF4CE2] hover:text-white transition-all px-5 py-2 rounded-full font-semibold"
          >
            Start Free for $0
          </Link>
        </div>
      </header>

      <main className="max-w-[860px] mx-auto px-6 pt-10 pb-24 space-y-12">
        <nav aria-label="Breadcrumb" className="text-sm text-white/50">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/docs/public-api" className="hover:text-white transition-colors">Docs</Link></li>
            <li>/</li>
            <li className="text-[#FF4CE2] font-semibold">OAuth Apps</li>
          </ol>
        </nav>

        <div className="space-y-4">
          <div className="inline-block bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            OAuth 2.0 · Authorization Code + PKCE
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Hookpost <span className="text-[#FF4CE2]">OAuth Apps</span>
          </h1>
          <p className="text-[#aaa] text-lg leading-relaxed article-summary">
            An API key works for your own account. An OAuth app is what you build when other people need to connect
            <em> their </em> Hookpost account to your product — they approve access on a Hookpost screen and you never
            handle their credentials.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Which one do I need?</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm min-w-[520px]">
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4 align-top font-semibold text-white w-[190px]">Your own account only</td>
                  <td className="py-3 px-4 text-[#aaa]">
                    Use an API key —{' '}
                    <Link href="/docs/public-api" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">Public API docs</Link>.
                    Simpler, no flow to implement.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 align-top font-semibold text-white">Other people&apos;s accounts</td>
                  <td className="py-3 px-4 text-[#aaa]">Use OAuth — this page. Never ask a user for their API key.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-white">The flow</h2>

          <Step n={1} title="Register your application">
            <p className="text-[#aaa] leading-relaxed">
              In Hookpost, open <strong className="text-white">Settings → Developer</strong> and create an OAuth
              application. You will get a client id beginning{' '}
              <code className="text-white font-mono text-sm">pca_</code> and a client secret. Store the secret
              server-side — it is shown once.
            </p>
            <p className="text-[#aaa] leading-relaxed">
              Register every redirect URI you will use. The authorize step rejects any redirect that is not an exact
              match.
            </p>
          </Step>

          <Step n={2} title="Send the user to authorize">
            <p className="text-[#aaa] leading-relaxed">
              Redirect the user to the authorize screen. Generate a PKCE{' '}
              <code className="text-white font-mono text-sm">code_verifier</code>, hash it with SHA-256 and send the
              base64url result as the <code className="text-white font-mono text-sm">code_challenge</code>. Only{' '}
              <code className="text-white font-mono text-sm">S256</code> is supported.
            </p>
            <Code>{`GET ${BASE}/oauth/authorize
  ?client_id=pca_YOUR_CLIENT_ID
  &redirect_uri=https://yourapp.com/callback
  &response_type=code
  &scope=mcp:read%20mcp:write
  &state=RANDOM_STRING
  &code_challenge=BASE64URL_SHA256_OF_VERIFIER
  &code_challenge_method=S256`}</Code>
            <p className="text-[#aaa] leading-relaxed">
              The user approves, and Hookpost redirects back to your{' '}
              <code className="text-white font-mono text-sm">redirect_uri</code> with{' '}
              <code className="text-white font-mono text-sm">?code=…&amp;state=…</code>. Check that{' '}
              <code className="text-white font-mono text-sm">state</code> matches what you sent.
            </p>
          </Step>

          <Step n={3} title="Exchange the code for a token">
            <Code>{`curl -X POST "${BASE}/oauth/token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "authorization_code",
    "code": "CODE_FROM_REDIRECT",
    "client_id": "pca_YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "redirect_uri": "https://yourapp.com/callback",
    "code_verifier": "YOUR_ORIGINAL_VERIFIER"
  }'`}</Code>
            <p className="text-[#aaa] leading-relaxed">You get back a bearer token:</p>
            <Code>{`{
  "access_token": "pos_...",
  "token_type": "bearer"
}`}</Code>
          </Step>

          <Step n={4} title="Call the API as that user">
            <p className="text-[#aaa] leading-relaxed">
              Send the token in the <code className="text-white font-mono text-sm">Authorization</code> header of any{' '}
              <Link href="/docs/public-api" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">Public API</Link> request — same
              header as an API key, no <code className="text-white font-mono text-sm">Bearer</code> prefix.
            </p>
            <Code>{`curl "${BASE}/public/v1/integrations" \\
  -H "Authorization: pos_YOUR_ACCESS_TOKEN"`}</Code>
            <p className="text-[#aaa] leading-relaxed">
              Requests run against the account that granted access — their channels, their posts.
            </p>
          </Step>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Scopes</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm min-w-[460px]">
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4 font-mono text-xs text-[#FF4CE2] w-[130px]">mcp:read</td>
                  <td className="py-3 px-4 text-[#aaa]">Read channels, posts and analytics</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-xs text-[#FF4CE2]">mcp:write</td>
                  <td className="py-3 px-4 text-[#aaa]">Create, update and delete posts</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[#aaa] leading-relaxed">
            Request only what you use. An integration that just reads analytics should not ask for{' '}
            <code className="text-white font-mono text-sm">mcp:write</code>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Userinfo</h2>
          <p className="text-[#aaa] leading-relaxed">
            To identify the account behind a token:
          </p>
          <Code>{`curl "${BASE}/oauth/userinfo" \\
  -H "Authorization: pos_YOUR_ACCESS_TOKEN"`}</Code>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Dynamic client registration</h2>
          <p className="text-[#aaa] leading-relaxed">
            Hookpost supports OAuth Dynamic Client Registration at{' '}
            <code className="text-white font-mono text-sm">/oauth/register</code>, used mainly by AI clients that
            register themselves. Those clients get a{' '}
            <code className="text-white font-mono text-sm">pcd_</code> client id and{' '}
            <strong className="text-white">must</strong> use PKCE.
          </p>
          <p className="text-[#aaa] leading-relaxed">
            Registration is restricted to an allowlist of domains, so it is not open to the public internet. If you are
            building a normal integration, register in the dashboard instead — step 1 above.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Notes worth reading twice</h2>
          <ul className="space-y-2 text-[#aaa] leading-relaxed list-disc pl-5">
            <li>The <code className="text-white font-mono text-sm">Authorization</code> header takes the raw token — there is no <code className="text-white font-mono text-sm">Bearer</code> prefix.</li>
            <li>Redirect URIs must match exactly, including scheme, host, port and path.</li>
            <li>If a token returns <code className="text-white font-mono text-sm">401 No subscription found</code>, that account needs an active plan — a new token will not help.</li>
            <li>Client secrets belong on your server. A public client (mobile, browser) should rely on PKCE alone.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Related</h2>
          <p className="text-[#aaa] leading-relaxed">
            <Link href="/docs/public-api" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">Public API reference</Link> ·{' '}
            <Link href="/mcp" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">MCP connector</Link> ·{' '}
            <Link href="/guides/claude-mcp-social-media" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">Claude setup guide</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
