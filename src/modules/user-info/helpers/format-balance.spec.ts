import formatBalance, { currencyToSymbol } from "./format-balance";

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

describe("currencyToSymbol", () => {
  it("should return £ if currency is GBP", () => {
    const symbol = currencyToSymbol("GBP");
    expect(symbol).toBe("£");
  });
  it("should return $ if currency is USD", () => {
    const symbol = currencyToSymbol("USD");
    expect(symbol).toBe("$");
  });
  it("should return € if currency is EUR", () => {
    const symbol = currencyToSymbol("EUR");
    expect(symbol).toBe("€");
  });
});
