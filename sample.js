export const sample = {
  inventory: [
    { id: "V001", model: "Comet S2", acquired: "2026-11-01", cost: 8200000 },
    { id: "V002", model: "Sultan RS", acquired: "2026-11-02", cost: 4600000 },
    {
      id: "V003",
      model: "Schafter V12",
      acquired: "2026-11-03",
      cost: 5800000,
    },
    { id: "V004", model: "Elegy Retro", acquired: "2026-11-07", cost: 6400000 },
    { id: "V005", model: "Banshee", acquired: "2026-11-10", cost: 7200000 },
    {
      id: "V006",
      model: "Jester Classic",
      acquired: "2026-11-12",
      cost: 5400000,
    },
  ],
  sales: [
    {
      id: "S001",
      inventoryId: "V001",
      date: "2026-11-05",
      amount: 10500000,
      commission: 525000,
      agent: "Morgan",
    },
    {
      id: "S002",
      inventoryId: "V002",
      date: "2026-11-08",
      amount: 6200000,
      commission: 310000,
      agent: "Alex",
    },
    {
      id: "S003",
      inventoryId: "V003",
      date: "2026-11-11",
      amount: 7400000,
      commission: 370000,
      agent: "Morgan",
    },
    {
      id: "S004",
      inventoryId: "V004",
      date: "2026-11-16",
      amount: 8100000,
      commission: 405000,
      agent: "Alex",
    },
  ],
  expenses: [
    {
      id: "E001",
      date: "2026-11-03",
      category: "Showroom rent",
      amount: 350000,
    },
    { id: "E002", date: "2026-11-09", category: "Marketing", amount: 120000 },
    { id: "E003", date: "2026-11-15", category: "Utilities", amount: 65000 },
  ],
};
