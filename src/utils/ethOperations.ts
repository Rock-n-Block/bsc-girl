import BigNumber from 'bignumber.js/bignumber';

export const ethToWei = (amount: number | string, decimals: number | string): string => {
  return new BigNumber(amount).dividedBy(new BigNumber(10).pow(decimals)).toString(10);
};

export const weiToEth = (amount: number | string, decimals: number | string): string => {
  return new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString(10);
};

export const roundToFixed = (amount: number | string, decimal: number): string => {
  return new BigNumber(amount).toString(decimal);
};
