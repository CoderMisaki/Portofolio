## 2026-05-15 - Added Global Keyboard Focus Indicator
**Learning:** The existing design system relied on generic browser outlines, which can have inconsistent visibility. Explicitly defining `:focus-visible` with the primary accent color (`--sage`) drastically improves keyboard navigation accessibility without compromising the aesthetic for mouse users.
**Action:** Always verify keyboard navigation and proactively add explicit `:focus-visible` styles tied to the project's design system tokens.
