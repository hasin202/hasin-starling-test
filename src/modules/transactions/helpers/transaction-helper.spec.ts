import { mockFeedItems } from "./mocks";
import {
  calculateTotalRoundUpAmount,
  individualRoundUp,
} from "./transaction-helpers";

describe("individualRoundUp", () => {
  it("should work as expected", () => {
    expect(individualRoundUp(273)).toBe(27);
  });

  it("should work with an extreme value", () => {
    expect(individualRoundUp(2734533)).toBe(67);
  });

  it("should return 0 if no roundup is needed", () => {
    expect(individualRoundUp(0)).toBe(0);
  });
});

describe("calculateTotalRoundUpAmount", () => {
  it("should work as expected", () => {
    expect(calculateTotalRoundUpAmount(mockFeedItems)).toBe(785);
  });

  it("should handle no outgoing transactions", () => {
    const incomingTransactions = mockFeedItems.filter(
      (feedItem) => feedItem.direction === "IN"
    );
    expect(calculateTotalRoundUpAmount(incomingTransactions)).toBe(0);
  });

  it("should handle an empty array", () => {
    expect(calculateTotalRoundUpAmount([])).toBe(0);
  });
});
