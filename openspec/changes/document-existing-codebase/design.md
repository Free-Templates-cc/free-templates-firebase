## Context

The free-templates.cc project is a React + TypeScript template marketplace with Firebase backend. The codebase has been built iteratively and now needs comprehensive OpenSpec documentation to serve as a single source of truth for architecture, component contracts, and data flow. See proposal.md for motivation.

18 source files across 8 spec categories already have requirement-level specs generated. This design covers the approach for completing, validating, and integrating the full spec suite.

## Goals / Non-Goals

**Goals:**
- Create OpenSpec specs for all source files (frontend, backend, config, tests)
- Validate generated specs against actual implementation
- Establish CI/docs workflow for spec maintenance
- Enable spec-driven development going forward

**Non-Goals:**
- Not refactoring or changing implementation code
- Not converting mock data to Firestore (separate change)
- Not deploying or configuring production infrastructure

## Decisions

**Decision 1: Spec granularity — one spec per logical module, not per file**
- *Rationale:* Grouping related files (e.g., all 8 Cloud Functions in one `backend` spec, all 4 utility modules in `core-lib`) keeps specs manageable and avoids fragmentation.
- *Alternatives considered:* One spec per source file (too many files to maintain); one monolithic spec (too large to review).

**Decision 2: Gherkin-style requirements (Given/When/Then)**
- *Rationale:* Gherkin scenarios map directly to test cases, enabling automated validation. Existing Vitest tests can be traced back to spec requirements.
- *Alternatives considered:* Free-form prose (less precise); TypeScript interfaces only (no behavioral contracts).

**Decision 3: Spec categories mirror src/ directory structure**
- *Rationale:* Organizing specs by ui-components, hooks, stores, etc. keeps them discoverable and aligned with the project's mental model.
- *Added categories for non-src assets:* backend, security-rules, ci-cd, seed-script, e2e-tests — because these are critical parts of the system that live outside src/.

**Decision 4: No automated spec generation from code**
- *Rationale:* AI-assisted spec writing (current approach) produces higher-quality behavioral specs than naive AST analysis. Generated specs should be reviewed by a developer who understands the system.
- *Risk:* Manual creation is slower — mitigated by writing specs in focused batches.

## Risks / Trade-offs

- **[Risk]** Specs may drift from implementation as the codebase evolves
  - *Mitigation:* Integrate `openspec validate` into the CI pipeline; PR reviews should include spec updates for changed files
- **[Risk]** Gherkin scenarios may miss edge cases
  - *Mitigation:* Co-locate spec files with tests; test coverage reports can identify untested scenarios that need spec entries
- **[Risk]** OpenSpec tooling maturity
  - *Mitigation:* Keep specs in plain markdown files — they remain readable and useful even if the tooling changes

## Migration Plan

1. ✅ Create change proposal (`proposal.md`)
2. ✅ Generate initial specs for all 8 frontend categories (core-lib, hooks, layout, pages, route-guards, stores, types, ui-components)
3. ✅ Generate specs for uncovered areas (backend, security-rules, ci-cd, seed-script, e2e-tests)
4. ⬜ Validate specs — cross-reference each scenario against actual component behavior
5. ⬜ Create design document (this file)
6. ⬜ Archive change — moves specs to main spec tree
7. ⬜ Update CI to include `openspec validate` step (optional — deferred if tooling doesn't support headless validation)

## Open Questions

- Should E2E test specs be maintained separately or folded into page specs? Current approach keeps them separate for clarity, but they could merge later if the schema evolves.
