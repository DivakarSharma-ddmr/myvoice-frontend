// Starter queries offered under the Help Center search box when it is empty.
// They are pressable, not decorative, so every one of them must return
// results — tests/faqSearch.test.mjs asserts that against the real FAQ.
//
// Kept in its own dependency-free module (no `@/` imports) so the test runner
// can load it directly, and so editing the wording never means touching a
// component.
// Kept short on purpose: at a 390px viewport every extra word pushes the row
// onto another line, and this sits directly above the search box.
export const FAQ_SUGGESTIONS = [
  'balance',
  'password',
  'delete account',
  'survey closed',
  'invitations',
];
