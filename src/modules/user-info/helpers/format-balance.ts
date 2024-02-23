//function to display currency symbol along side balance in major unit
//as this isn't a production app I have only written logic to display the symbols for 3 currencies.
//if you wanted to add more you would simply add more if statements with the corresponding symbols.
const formatBalance = (minorUnits: number, currency: string): string => {
  const majorAmount = minorUnits / 100;
  const decimalValue = majorAmount.toFixed(2);
  if (currency === "GBP") return `£${decimalValue}`;
  else if (currency === "USD") return `$${decimalValue}`;
  else if (currency === "EUR") return `€${decimalValue}`;
  return "$0.00";
};

export default formatBalance;
