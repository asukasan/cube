# Cube Common Contract — Draft 0.1

**Status:** Unapproved research proposal; interoperability and security not established.

## Scope and vocabulary
A Cube is an independent logical identity/state/permissions environment. A Runtime/Host executes Cubes but no dedicated always-on daemon is required. Modules provide optional capabilities; Services combine them. Group lifetimes and governance are chosen by each Service or Group policy, not fixed by Core. Transport connection identifiers are not independent Node IDs.

## 1. Identity
Cube, Service and Module are separate identifiers. The same human may use distinct Cubes or pseudonyms; linking is voluntary, and shared Cube IDs must not automatically leak across services. Key management, origin separation, key rotation, identity recovery and linking protocols remain undecided.

- **X:** app-specific IDs + OAuth/OIDC and existing identity providers.
- **Y:** same building blocks with a reusable subject/linking contract.
- **Test:** two independent web origins and privacy-preserving optional identity linkage.

## 2. Events
CloudEvents 1.0 is a candidate envelope: specversion, id, source, type; optional subject/time/data. Signature verification, sender/recipient authorization, replay/duplicate handling, schema semantics and versions are additional requirements, not provided automatically by CloudEvents.

```json
{"specversion":"1.0","id":"evt-1","source":"urn:cube-demo:game","type":"org.cube-demo.game.finished.v1","subject":"session-1","data":{"winner":"player-2"}}
```
Illustration only: **not a signed authenticated event**.

- **X:** CloudEvents + established messaging framework.
- **Y:** same stack plus a common verifiable cross-Service semantic contract.
- **Test:** incompatible versions, forged producers, duplicate events, forbidden subscription and replay.

## 3. Authorization
Membership and permissions are distinct. Publishing, subscribing, modifying a Group and controlling a device need independently checked authorizations; validation must happen at the action executor. Cryptographic signature alone does not grant permission. Delegation, revocation freshness, offline operation and authority to grant access are undecided.

- **X:** OAuth/OIDC and RBAC/ABAC or tools such as OpenFGA.
- **Y:** reuse these engines with common subject/action/resource/scope representation.
- **Test:** revoked access, stale credentials, unauthorized management changes, no permission escalation.

## 4. Module / Service contract
Proposed manifest: module ID/version, provided capabilities, produced/consumed event types and required permissions. No untrusted code isolation in Stage 0; only trusted test modules.

- **X:** established plugin APIs and app events.
- **Y:** interoperable manifest and integration rules for separate developers.
- **Test:** independent module installs without app-specific changes; detect incompatible API versions and unauthorized operations.

## Experiments
E1 first (module combination), then E2 (same group across services), E4 (pseudonymous separation/linking), E3 later (optional group portability). Don't assume a new Runtime is justified. Compare honest X and Y, counting SDK creation, maintenance, learning, security, user choice and interoperability alongside the exploratory 30% speed target.

## Open questions
Self-certifying IDs versus existing ID frameworks; how to safely share identity across browser origins; proper revocation; Module discovery; Group authoritative storage and reference discovery; schema versioning; first adopter incentive.

**References:** https://github.com/cloudevents/spec · https://openfga.dev/ · https://www.rfc-editor.org/rfc/rfc9700
