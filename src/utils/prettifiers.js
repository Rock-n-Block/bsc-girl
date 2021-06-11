import config from '../config';

export const formatNumberWithDots = (value) => {
  if (!value) return '';
  let parts = value.toString().split('.');
  const number = 4;
  const numberSum = 8;
  if (parts[0] && parts[0].length > number)
    parts[0] = `${parts[0].slice(0, number)}...${parts[0].slice(
      number,
      numberSum,
    )}`;
  if (parts[1] && parts[1].length > number)
    parts[1] = `${parts[1].slice(1, number)}...${parts[1].slice(
      number,
      numberSum,
    )}`;
  return parts.join('.');
};

export const formatNumberWithSpace = (value) => {
  if (!value) return '';
  let parts = value.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const n = value > 1 ? 2 : 4;
  if (parts[1]) parts[1] = parts[1].slice(0, n);
  return parts.join('.');
};

export const formatNumberWithSpaceBack = (value) => {
  if (!value) return '';
  return value.replace(' ', '');
};

export const getTokenLink = (network, tokenAddress) => {
  const isNetworkBinanceChain = network === 'Binance-Chain';
  const isNetworkBinanceSmartChain = network === 'Binance-Smart-Chain';
  const isNetworkEthereum = network === 'Ethereum';
  return isNetworkBinanceChain
    ? 'https://explorer.binance.org/asset/WISH-2D5'
    : config.tokenLinks()[
        isNetworkEthereum
          ? 'ethereum'
          : isNetworkBinanceChain
          ? 'binanceChain'
          : 'binanceSmartChain'
      ] + `/token/${tokenAddress}`;
};

export const getTokenSymbol = (network) => {
  return network === 'Binance-Chain'
    ? 'DDS'
    : network === 'Binance-Smart-Chain'
    ? 'bscscan kyp'
    : 'etherscan KYP';
};
