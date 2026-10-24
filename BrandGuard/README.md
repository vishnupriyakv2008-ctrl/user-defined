# BrandGuard

A brand-governance workspace for reviewing content before publication. The interface contains 17 sections for content review, campaigns, approvals, brand guidelines, approved facts, assets, guideline conflicts, audience simulation, risk routing, override learning, insights, content passports, revision history, team roles, integrations, and settings.

## Live demo
https://brandguard-zjjirc.v2.appdeploy.ai/

## Source
- `src/App.tsx` — full React application UI and demo interactions
- `src/index.css` — complete UI styling
- `package.json` — package and build scripts

## Run locally
The deployed application uses AppDeploy's `@appdeploy/client` integration for its review endpoint. For a standalone Vite build, configure or replace that integration and provide the corresponding backend endpoint.

```bash
npm install
npm run dev
```

Build with `npm run build`.

## Demo / production notes
This is a demonstration workspace. Several records are persisted in browser local storage; the rule-check fallback is heuristic. Do not treat AI review as factual verification or legal approval. Production deployment should add authenticated role enforcement, durable database storage, secure file handling, actual image/accessibility analysis, audit-log signing, and privacy-reviewed model integrations. Passport export currently declares that it is not cryptographically tamper-proof.
