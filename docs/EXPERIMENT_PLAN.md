# Cube Value Experiment 01

## Purpose
Fairly compare **X: conventional application with mature libraries** versus **Y: Cube common contract + lightweight TypeScript SDK**. X must not be artificially handicapped. Both can use CloudEvents, OAuth/OIDC, existing event buses and authorization tools. Count initial SDK development and maintenance in Y.

## Experiment order
1. **E1:** A temporary session with a game, score recorder and notification module. Later add a third-party module without modifying existing service-specific logic.
2. **E2:** Reuse a group across services; membership must not imply blanket authorization.
3. **E4:** Test separate identities, pseudonyms, different browser origins and optional linking.
4. **E3 (deferred):** Optional group portability. Administrator Cube + backup/export is a provisional test model, not a required permanent architecture.

## Measure
Setup time, third-module implementation time, changed service-specific files, developer learning effort, compatibility of third-party modules, unauthorized action rejection, access revocation, user ability to add/replace/disable modules, cross-service integration, maintenance costs.

A 30% reduction in module-addition time is an **exploratory target only**. A security or privacy failure cannot be offset by productivity gains.

## Falsification cases
Duplicate event IDs, invalid event versions, spoofed publisher, unauthorized subscriber, changed permissions, duplicate delivery, incorrect group scope, unwanted link between pseudonymous identities. Compare with genuine mature plugin mechanisms, not a deliberately poor baseline.

## Gate
Continue only if independently authored components can be combined with a meaningful improvement in security, choice or development experience. An always-on custom Runtime is not presumed necessary.
