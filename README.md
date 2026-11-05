# Cube — Composable Services Research

> **Experimental project — design and prototype stage.** This is not a production-ready SDK. No cryptographic authentication, secure network authorization, or sandbox for untrusted modules has been implemented.

Cube explores a simple question:

**Can independent developers combine services and modules more easily and safely by sharing a small set of contracts for identity, events, authorization and module integration?**

Cube aims to enable users to choose and connect functionality while keeping unwanted identities and relationships separate. It is **not** an attempt to replace existing event buses, authentication libraries, Discord or device protocols.

## Three long-term goals

- **A — Interoperability:** Connect people, devices and services.
- **B — Personal digital environments:** Let users manage identity, data and permissions with optional separation between contexts.
- **C — Composability:** Make it easier to build new services by reusing modules and common contracts.

## First experiment (E1)

A small session-based game publishes events. Separate score and notification modules consume them under declared permissions. We compare:

- **X:** Conventional application built with mature libraries and plugin patterns.
- **Y:** The same libraries plus a Cube-style common contract and lightweight TypeScript SDK.

We will measure developer effort, independently written module compatibility, security checks, user choice and complexity. A 30% time reduction is an exploratory goal, **not** a pass/fail rule.

Later experiments examine shared groups (E2), separate and voluntarily linked identities (E4), and optional group portability (E3).

## What is not implemented

Cross-origin identity, verified signatures, production authorization, multi-service networking, sandboxed third-party plugins and real group portability remain open research questions. Do not use real personal data or secrets in experiments.

## Feedback wanted

We especially welcome **critical feedback**:

1. What existing projects already solve this?
2. Have you had to integrate separately maintained services or plugins? Which parts were painful?
3. Could CloudEvents, OAuth/OIDC, OpenFGA and existing plugin frameworks already suffice?
4. What is the most important privacy or authorization flaw in this plan?
5. What tiny demonstration would convince you this helps?

Please [open an Issue](../../issues). Code, APIs, license and compatibility guarantees are not yet settled.

**Status:** Research prototype, seeking human design reviews.
