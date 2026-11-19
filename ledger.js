export function validate(data) {
  if (
    !data ||
    !Array.isArray(data.inventory) ||
    !Array.isArray(data.sales) ||
    !Array.isArray(data.expenses)
  )
    throw Error("Expected inventory, sales and expenses arrays.");
  const ids = new Set(),
    sold = new Set();
  const money = (n) => Number.isSafeInteger(n) && n >= 0;
  const date = (s) =>
    typeof s === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(s) &&
    !Number.isNaN(Date.parse(s + "T00:00:00Z")) &&
    new Date(s + "T00:00:00Z").toISOString().slice(0, 10) === s;
  for (const i of data.inventory) {
    if (
      typeof i.id !== "string" ||
      !i.id ||
      ids.has(i.id) ||
      typeof i.model !== "string" ||
      !date(i.acquired) ||
      !money(i.cost)
    )
      throw Error("Invalid or duplicate inventory record.");
    ids.add(i.id);
  }
  const saleIds = new Set();
  for (const s of data.sales) {
    const item = data.inventory.find((i) => i.id === s.inventoryId);
    if (
      !item ||
      sold.has(s.inventoryId) ||
      typeof s.id !== "string" ||
      saleIds.has(s.id) ||
      !date(s.date) ||
      s.date < item.acquired ||
      !money(s.amount) ||
      !money(s.commission) ||
      typeof s.agent !== "string"
    )
      throw Error("Invalid or duplicate sale record.");
    sold.add(s.inventoryId);
    saleIds.add(s.id);
  }
  const expenseIds = new Set();
  for (const e of data.expenses) {
    if (
      typeof e.id !== "string" ||
      expenseIds.has(e.id) ||
      typeof e.category !== "string" ||
      !date(e.date) ||
      !money(e.amount)
    )
      throw Error("Invalid expense record.");
    expenseIds.add(e.id);
  }
  return data;
}
export function summarize(data, from = "", to = "9999-12-31", agent = "") {
  validate(data);
  if (from > to) throw Error("Start date must precede end date.");
  const inPeriod = (d) => d >= from && d <= to;
  const sales = data.sales
    .filter((s) => inPeriod(s.date) && (!agent || s.agent === agent))
    .map((s) => ({
      ...s,
      model: data.inventory.find((i) => i.id === s.inventoryId).model,
      cost: data.inventory.find((i) => i.id === s.inventoryId).cost,
    }));
  const expenses = data.expenses.filter((e) => inPeriod(e.date));
  const sum = (xs, k) => {
    const n = xs.reduce((t, x) => t + x[k], 0);
    if (!Number.isSafeInteger(n)) throw Error("Amount exceeds safe range.");
    return n;
  };
  const revenue = sum(sales, "amount"),
    cogs = sum(sales, "cost"),
    commissions = sum(sales, "commission"),
    operating = sum(expenses, "amount");
  const sold = new Set(
    data.sales.filter((s) => s.date <= to).map((s) => s.inventoryId),
  );
  const inventory = data.inventory.filter(
    (i) => i.acquired <= to && !sold.has(i.id),
  );
  return {
    sales,
    expenses,
    inventory,
    revenue,
    cogs,
    commissions,
    operating,
    gross: revenue - cogs,
    contribution: revenue - cogs - commissions,
    net: agent ? null : revenue - cogs - commissions - operating,
    inventoryCost: sum(inventory, "cost"),
  };
}
export function csv(rows) {
  return rows
    .map((row) =>
      row
        .map((v) => {
          let s = String(v ?? "");
          if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
          return '"' + s.replaceAll('"', '""') + '"';
        })
        .join(","),
    )
    .join("\r\n");
}
