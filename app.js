import { sample } from "./sample.js";
import { summarize, csv } from "./ledger.js";
const $ = (id) => document.getElementById(id),
  money = (n) =>
    "¤" +
    (n / 100).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
for (const a of [...new Set(sample.sales.map((s) => s.agent))]) {
  const o = document.createElement("option");
  o.value = a;
  o.textContent = a;
  $("agent").append(o);
}
let result;
function cell(tag, value) {
  const el = document.createElement(tag);
  el.textContent = value;
  return el;
}
function row(parent, values) {
  const tr = document.createElement("tr");
  values.forEach((v) => tr.append(cell("td", v)));
  parent.append(tr);
}
function list(id, items) {
  $(id).replaceChildren();
  for (const [name, value] of items) {
    const line = document.createElement("div");
    line.className = "line";
    line.append(cell("span", name), cell("strong", money(value)));
    $(id).append(line);
  }
  if (!items.length) $(id).append(cell("p", "No records for this selection."));
}
function render() {
  try {
    result = summarize(
      sample,
      $("from").value,
      $("to").value || "9999-12-31",
      $("agent").value,
    );
    $("error").textContent = "";
    $("export").disabled = false;
  } catch (e) {
    result = null;
    $("error").textContent = e.message;
    $("export").disabled = true;
    for (const id of ["stats", "sales", "inventory", "expenses", "count"])
      $(id).replaceChildren();
    return;
  }
  $("stats").replaceChildren();
  for (const [title, value, note] of [
    ["Revenue", result.revenue, "Completed sales"],
    ["Gross profit", result.gross, "Revenue less acquisition cost"],
    [
      $("agent").value ? "Sales contribution" : "Net profit",
      result.net ?? result.contribution,
      $("agent").value
        ? "After commission; overhead excluded"
        : "After commissions and overhead",
    ],
    [
      "Inventory value",
      result.inventoryCost,
      `${result.inventory.length} vehicles on hand`,
    ],
  ]) {
    const c = document.createElement("article");
    c.className = "stat";
    c.append(
      cell("p", title),
      cell("strong", money(value)),
      cell("small", note),
    );
    $("stats").append(c);
  }
  $("count").textContent =
    `${result.sales.length} completed sales · in-game currency`;
  $("sales").replaceChildren();
  for (const s of result.sales)
    row($("sales"), [
      s.date,
      s.model,
      s.agent,
      money(s.amount),
      money(s.cost),
      money(s.commission),
      money(s.amount - s.cost - s.commission),
    ]);
  if (!result.sales.length) {
    const tr = document.createElement("tr"),
      td = cell("td", "No sales for this selection.");
    td.colSpan = 7;
    tr.append(td);
    $("sales").append(tr);
  }
  list(
    "inventory",
    result.inventory.map((i) => [i.model, i.cost]),
  );
  list(
    "expenses",
    result.expenses.map((e) => [e.category + " · " + e.date, e.amount]),
  );
}
for (const id of ["from", "to", "agent"])
  $(id).addEventListener("change", render);
$("reset").onclick = () => {
  $("from").value = "2026-11-01";
  $("to").value = "2026-11-30";
  $("agent").value = "";
  render();
};
$("export").onclick = () => {
  if (!result) return;
  const rows = [
    ["SAMPLE DATA / IN-GAME CURRENCY"],
    [
      "Sale ID",
      "Date",
      "Vehicle",
      "Salesperson",
      "Revenue",
      "Cost",
      "Commission",
      "Contribution",
    ],
    ...result.sales.map((s) => [
      s.id,
      s.date,
      s.model,
      s.agent,
      s.amount / 100,
      s.cost / 100,
      s.commission / 100,
      (s.amount - s.cost - s.commission) / 100,
    ]),
  ];
  const url = URL.createObjectURL(
    new Blob([csv(rows)], { type: "text/csv;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "viceos-sample-sales.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
render();
