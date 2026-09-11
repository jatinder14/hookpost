/**
 * Automated Test Suite: Autonomous Growth Poster Agent & Formatting Verifier
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GROWTH_TOPICS, sanitizeAndAssertContent, runGrowthPoster } = require('./run-growth-poster.js');

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    process.exit(1);
  }
  console.log(`  [PASS] ${message}`);
}

async function runTests() {
  console.log('================================================================');
  console.log('HOOKPOST GROWTH POSTER AGENT TEST SUITE');
  console.log('================================================================\n');

  // Test 1: Content Library Double Dash Audit
  console.log('--> Test 1: Zero Double Dashes Across ALL Topics');
  assert(GROWTH_TOPICS.length >= 8, `Topic library contains ${GROWTH_TOPICS.length} topics (>= 8 required)`);
  for (const topic of GROWTH_TOPICS) {
    assert(!topic.content.includes('--'), `Topic "${topic.id}" contains no double dash "--"`);
    assert(!topic.content.includes('—'), `Topic "${topic.id}" contains no em-dash "—"`);
    assert(!topic.content.includes('–-'), `Topic "${topic.id}" contains no en-dash sequence`);
    assert(topic.content.length > 80, `Topic "${topic.id}" has substantive content (${topic.content.length} chars)`);
  }

  // Test 2: Sanitizer Assertion on Forbidden Formatting
  console.log('\n--> Test 2: Sanitizer Throws on Double Dash Violation');
  let threwDoubleDash = false;
  try {
    sanitizeAndAssertContent('Here is a tip -- with bad formatting');
  } catch (e: any) {
    threwDoubleDash = true;
  }
  assert(threwDoubleDash, 'Sanitizer successfully rejected double dash "--"');

  let threwEmDash = false;
  try {
    sanitizeAndAssertContent('Here is a tip — with bad em-dash');
  } catch (e: any) {
    threwEmDash = true;
  }
  assert(threwEmDash, 'Sanitizer successfully rejected em-dash "—"');

  // Test 3: Valid Bullet Point Formatting
  console.log('\n--> Test 3: Valid Bullet Point Formatting Support');
  const validContent = sanitizeAndAssertContent('Feature highlight:\n• Visual calendar\n• Native MCP\n• 1-click scheduling');
  assert(validContent.includes('• Visual calendar'), 'Clean bullet points are preserved');

  // Test 4: Dry-Run Execution
  console.log('\n--> Test 4: Growth Poster Dry-Run Execution');
  const dryRunResult = await runGrowthPoster({ dryRun: true });
  assert(dryRunResult.success === true, 'Dry-run executed successfully');
  assert(dryRunResult.isDryRun === true, 'Dry-run flag confirmed');
  assert(dryRunResult.topic && dryRunResult.topic.id, 'Topic selected during dry run');

  console.log('\n================================================================');
  console.log('ALL GROWTH POSTER AGENT TESTS PASSED! [4/4]');
  console.log('================================================================\n');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
