# ViceOS Business Ledger

A first read-only dealership ledger prototype for Dacity Capital. This is a **sample-data MVP**, not a live FiveM integration or a financial service. All currency is fictional in-game currency. No GTA VI compatibility is claimed.

## Run

Requires Node.js 20 or later. No third-party packages or install step.

```sh
npm test
npm start
```

Open http://127.0.0.1:4173. The server binds to localhost deliberately. Do not expose it publicly as a production service.

## Working features

- Inclusive date and salesperson filters, reset, empty/error states
- Revenue, cost of vehicles sold, commissions and operating expenses
- Gross profit, dealership net profit and salesperson contribution
- End-date inventory quantities and acquisition value
- Sales CSV export with sample-data labeling and formula neutralization
- Responsive keyboard-accessible interface and restricted static server

Money is stored in integer minor units (100 minor units per fictional currency unit). Inventory uses the specific acquired unit cost per sold vehicle. Acquisition spending for unsold inventory is not charged to period profit. Inventory is a dealership-wide end-date snapshot. Expense records are dealership-wide and are not allocated to salespeople; selecting a salesperson replaces net profit with contribution after commission.

## Boundaries

This prototype has no database, authentication, tenant isolation, live connector or ingestion endpoint. Sample records live in `sample.js`. It cannot change balances, inventory or payouts on a server. No secrets, player identities or live data are included. It models completed sales only; refunds, cancellations, financing, taxes, depreciation, commission settlement and audited reconciliation are not implemented. The business ledger must not be treated as accounting advice or an actual bank.

## Next integration gate

Agree on one supported server framework and a read-only event contract, then validate against a controlled test server. Use authenticated server-to-server ingestion, idempotent event IDs, tenant authorization, immutable source events, decimal-safe money rules and reconciliation before real customers. UI demo success is not in-game integration validation. GTA VI adapters depend on official platform access and supported integrations.

`ledger.js` contains the validated calculation boundary; `app.js` renders the sample interface. Tests cover calculations, filters, validation, CSV handling and non-mutation. Product code only; no conversation transcripts.
