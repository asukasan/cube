# E1 baseline experiment — 2026-11-05

## Scope
First comparable **in-memory** tests for X (Node.js EventEmitter with app-specific permission logic) and Y (the current Cube MockBus). Both use trusted principal strings, local synchronous delivery, a declared event-version rule, subscription revocation and duplicate ID suppression. **Neither is secure authentication.**

## Result
The four paired tests (two per implementation) were run locally with Node.js v22.16.0. **4 passed, 0 failed.** The .ts source was transpiled with a locally installed TypeScript compiler and executed with `node --test`. The project's full `npm install` and `npm run check` were not successfully completed in that environment; CI and dependency-based type checking remain to be done.

| Check | X | Y |
|---|---|---|
| Authorized delivery | Passed | Passed |
| Duplicate event ignored | Passed | Passed |
| Revoke stops later delivery | Passed | Passed |
| Unauthorized publication/subscription | Passed | Passed |
| Reject unsupported event version | Passed | Passed |

## Interpretation
**No Cube advantage established.** An ordinary Node.js event emitter plus comparable glue is sufficient for these basic behaviors. This comparison tests behavior, not total developer cost, interoperability across independently built services, cryptographic identity, user choices or networked deployment.

## Next falsification
1. Have an independent author build a third module without seeing game internals.
2. In X, allow mature plug-in conventions or a reusable adapter rather than deliberately repetitive code.
3. Measure changed existing files, setup steps, implementation/learning time and confusion.
4. Test schema/data incompatibility, not just a `.v1` suffix; and test real authorization separately.
5. Include SDK authoring and maintenance costs in the comparison.
