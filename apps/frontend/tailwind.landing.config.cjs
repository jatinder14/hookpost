// Tailwind config for the MARKETING pages only.
//
// The base config scans './src/**' and '../../libraries/**', so one stylesheet
// was generated for the entire monorepo and then inlined into every landing
// page. Measured on the built sheet: 41,805 raw bytes of it were rules whose
// selectors appear nowhere under (landing) - animate-newMessages from the
// notifications component, scrollbar-thumb-* and !grayscale from the launches
// calendar, z-[199] from launches, -start-[50px] from the post editor. A
// marketing visitor downloaded all of it before the page could paint.
//
// Spreading the base config keeps theme, plugins, darkMode and screens
// byte-identical, so the two sheets cannot drift visually - only the content
// scan differs.
//
// Safe because the (landing) tree is self-contained: it imports exactly two
// modules from outside itself (UtmSaver and ViewContentTracker) and both render
// nothing. If you ever import an app component into a marketing page, add its
// path here or it will render unstyled.
const base = require('./tailwind.config.cjs');

module.exports = {
  ...base,
  content: [
    './src/app/(landing)/**/*.{ts,tsx}',
    // home-v1 is the archived previous homepage: noindexed, absent from the
    // sitemap, and 168KB of source. Its classes alone accounted for 13,676
    // bytes of the sheet that every live marketing page was inlining.
    '!./src/app/(landing)/home-v1/**',
  ],
};
