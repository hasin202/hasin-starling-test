import { SavingsGoals } from "@/pages/api/savings/[accountUid]";

export const newSavingsGoal = {
  savingsGoalUid: "5301c816-4613-4a7f-8d28-9ba156c7821b",
  name: "retirment",
  target: {
    currency: "GBP",
    minorUnits: 100000000,
  },
  totalSaved: {
    currency: "GBP",
    minorUnits: 15000000,
  },
  savedPercentage: 15,
  state: "ACTIVE",
};

export const mockSavingsGoals: SavingsGoals[] = [
  {
    savingsGoalUid: "7f7b3cec-dfdc-483d-a748-3a185423aad4",
    name: "new car",
    target: {
      currency: "GBP",
      minorUnits: 123456,
    },
    totalSaved: {
      currency: "GBP",
      minorUnits: 150000,
    },
    savedPercentage: 121,
    state: "ACTIVE",
  },
  {
    savingsGoalUid: "91570bc5-cd6e-4f01-a02e-383277bd27fa",
    name: "Holiday",
    target: {
      currency: "GBP",
      minorUnits: 250000,
    },
    totalSaved: {
      currency: "GBP",
      minorUnits: 0,
    },
    savedPercentage: 0,
    state: "ACTIVE",
  },
  {
    savingsGoalUid: "2c16d4f2-159e-4528-b51b-da3c41b6dc20",
    name: "emergency fund",
    target: {
      currency: "GBP",
      minorUnits: 500000,
    },
    totalSaved: {
      currency: "GBP",
      minorUnits: 10000,
    },
    savedPercentage: 20,
    state: "ACTIVE",
  },
];
