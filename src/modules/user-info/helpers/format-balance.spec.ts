import formatBalance from "./format-balance";

describe("format user balance", () => {
  it("should prepend balance with £ if currency GBP", () => {
    const formattedBalance = formatBalance(1234, "GBP");
    expect(formattedBalance).toEqual("£12.34");
  });
  it("should prepend balance with $ if currency USD", () => {
    const formattedBalance = formatBalance(1234, "USD");
    expect(formattedBalance).toEqual("$12.34");
  });
  it("should prepend balance with € if currency EUR", () => {
    const formattedBalance = formatBalance(1234, "EUR");
    expect(formattedBalance).toEqual("€12.34");
  });
  it("should return 0 for a balance of 0", () => {
    const formattedBalance = formatBalance(0, "GBP");
    expect(formattedBalance).toEqual("£0.00");
  });
  it("should return a negative balance for overdraft", () => {
    const formattedBalance = formatBalance(-200, "GBP");
    expect(formattedBalance).toEqual("£-2.00");
  });
  it("should return a single digit minor units correctly", () => {
    const formattedBalance = formatBalance(1, "GBP");
    expect(formattedBalance).toEqual("£0.01");
  });
});
