import test from "node:test";
import assert from "node:assert/strict";
import { sample } from "./sample.js";
import { summarize, validate, csv } from "./ledger.js";
test("reconciles revenue, commissions and profit without expensing unsold stock", () => {
  const s = summarize(sample);
  assert.equal(s.revenue, 32200000);
  assert.equal(s.cogs, 25000000);
  assert.equal(s.commissions, 1610000);
  assert.equal(s.operating, 535000);
  assert.equal(s.net, 5055000);
  assert.equal(s.inventoryCost, 12600000);
});
test("date range inclusive; inventory reflects end date", () => {
  const s = summarize(sample, "2026-11-05", "2026-11-08");
  assert.equal(s.sales.length, 2);
  assert.equal(s.expenses.length, 0);
  assert.equal(s.inventory.length, 2);
  assert.equal(s.inventoryCost, 12200000);
});
test("salesperson contribution never masquerades as net profit", () => {
  const s = summarize(sample, "", "9999-12-31", "Morgan");
  assert.equal(s.sales.length, 2);
  assert.equal(s.net, null);
  assert.equal(s.contribution, 3005000);
  assert.equal(s.inventory.length, 2);
});
test("empty period and reversed dates", () => {
  assert.equal(summarize(sample, "2027-01-01", "2027-02-01").net, 0);
  assert.throws(() => summarize(sample, "2027-01-01", "2026-01-01"));
});
test("reject duplicate sale of stock", () => {
  const d = structuredClone(sample);
  d.sales.push({ ...d.sales[0], id: "S999" });
  assert.throws(() => validate(d));
});
test("reject invalid date, negative and fractional minor-unit amounts", () => {
  for (const amount of [-1, 1.5, NaN]) {
    const d = structuredClone(sample);
    d.sales[0].amount = amount;
    assert.throws(() => validate(d));
  }
  const d = structuredClone(sample);
  d.sales[0].date = "2026-02-30";
  assert.throws(() => validate(d));
});
test("CSV neutralizes formulas and escapes quotes", () => {
  assert.equal(csv([["=CMD()", 'a"b']]), '"\'=CMD()","a""b"');
});
test("does not mutate source data", () => {
  const before = JSON.stringify(sample);
  summarize(sample);
  assert.equal(JSON.stringify(sample), before);
});
