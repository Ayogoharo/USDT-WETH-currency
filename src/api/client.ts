import { ethers } from 'ethers';

const USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7';
const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

const factoryAdress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const ABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) internal view returns (uint[] memory amounts)',
  'function getAmountsIn(uint amountOut, address[] memory path) public view returns (uint[] memory amounts)',
];
const apiKey = '9pbUd0CgLIhYb3Z_3kyeaMfjOqMvCuxj';
const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${apiKey}`);

const router = new ethers.Contract(
  factoryAdress,
  ABI,
  provider,
);

export const fetchUSDT = async (quantity: string) => {
  try {
    const amountIn = ethers.parseEther(quantity);
    const amounts = await router.getAmountsOut(amountIn, [WETH, USDT]);
    const price = ethers.formatUnits(amounts[1].toString(), 6);
    return parseFloat(price).toFixed(2);
  } catch (error) {
    console.error("Error fetching USDT price:", error);
  }
}

export const fetchWETH = async (quantity: string) => {
  try {
    const amountOut = ethers.parseUnits(quantity, 2);
    const amounts = await router.getAmountsIn(amountOut, [WETH, USDT]);
    const price = ethers.formatUnits(amounts[0].toString(), 14);
    return price;
  } catch (error) {
    console.error("Error fetching WETH price:", error);
  }
}
