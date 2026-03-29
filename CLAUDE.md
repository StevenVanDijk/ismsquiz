# CLAUDE.md — NEN 7510 Quiz Development Rules

## ⚠️ MANDATORY TESTING REQUIREMENT

**Every single change to this codebase requires tests. No exceptions. Ever.**

This is not optional. This is not negotiable. This is not skippable under any circumstance — not for "small fixes", not for "just a style change", not for "it's obvious it works". If you change code, you write or update tests. If tests don't pass, the change is not done.

---

## The Rule

> **Before pushing any change: all existing tests must pass AND new tests must exist for any new behaviour.**

---

## What This Means In Practice

### When you ADD a feature
1. Write tests covering every acceptance criterion in `spec.md` for that feature.
2. Run `ng test --watch=false --browsers=ChromeHeadless` and verify all tests pass.
3. Only then commit.

### When you FIX a bug
1. Write a failing test that reproduces the bug first.
2. Fix the bug.
3. Verify the test now passes along with all other tests.
4. Commit.

### When you REFACTOR code
1. Run the full test suite before refactoring to establish the baseline.
2. Refactor.
3. Run the full test suite again — all tests must still pass.
4. If behaviour changed, update the relevant tests.

### When you change a template, style, or configuration
1. Check whether any existing test covers the affected behaviour.
2. If yes — run those tests.
3. If no — add a test before committing.

---

## Test Commands

```bash
# Run all tests once (CI mode)
ng test --watch=false --browsers=ChromeHeadless

# Run tests in watch mode during development
ng test --browsers=ChromeHeadless
```

**All tests must show `TOTAL: X SUCCESS` with 0 failures before any commit.**

---

## Test File Locations

Each source file has a co-located spec file:

| Source | Spec |
|--------|------|
| `src/app/services/progress.ts` | `src/app/services/progress.service.spec.ts` |
| `src/app/services/badge.ts` | `src/app/services/badge.service.spec.ts` |
| `src/app/services/quiz-state.ts` | `src/app/services/quiz-state.service.spec.ts` |
| `src/app/services/content.ts` | `src/app/services/content.service.spec.ts` |
| `src/app/pipes/find-option-pipe.ts` | `src/app/pipes/find-option-pipe.spec.ts` |
| `src/app/components/shell/` | `shell.spec.ts` |
| `src/app/components/dashboard/` | `dashboard.spec.ts` |
| `src/app/components/chapter-list/` | `chapter-list.spec.ts` |
| `src/app/components/chapter-detail/` | `chapter-detail.spec.ts` |
| `src/app/components/quiz/` | `quiz.spec.ts` |
| `src/app/components/question-card/` | `question-card.spec.ts` |
| `src/app/components/results/` | `results.spec.ts` |
| `src/app/components/badge-card/` | `badge-card.spec.ts` |
| `src/app/components/badge-collection/` | `badge-collection.spec.ts` |
| `src/app/components/progress-bar/` | `progress-bar.spec.ts` |

---

## User Story Coverage

Every user story in `spec.md` (US-001 through US-060) has at least one test. Tests are labelled with their story ID (e.g., `// US-005`). When adding new functionality:

1. Add a user story to `spec.md` with acceptance criteria.
2. Write a test for each acceptance criterion.
3. Reference the story ID in the test description.

---

## What Counts As Cheating

The following are **explicitly forbidden**:

- Skipping a test with `xit(...)` or `xdescribe(...)` without a written explanation and a tracking issue.
- Writing a test that always passes regardless of implementation (e.g., `expect(true).toBeTrue()`).
- Deleting a failing test instead of fixing the code.
- Commenting out test assertions.
- Adding `// TODO: add test later` without immediately adding a failing test.
- Merging/pushing while `ng test` reports failures.
- Mocking a function in a way that makes the test not actually test the real behaviour.

---

## No Shortcuts

There is no situation in which it is acceptable to push code without passing tests.

- "It's a hotfix" — write the test, it takes 2 minutes.
- "The test is hard to write" — that means the code is hard to test; refactor the code.
- "I'll add tests in a follow-up PR" — no. Tests come first or at the same time. Never after.
- "It worked when I tested manually" — manual testing does not replace automated tests.

**If you are about to push without running `ng test`, stop. Run the tests. Fix the failures. Then push.**

---

## Summary Checklist Before Every Commit

- [ ] `ng test --watch=false --browsers=ChromeHeadless` passes with 0 failures
- [ ] New behaviour has new tests referencing the relevant US-XXX story
- [ ] No tests were deleted or disabled
- [ ] `spec.md` updated if new user stories were added
