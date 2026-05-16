export const MOCK_USDC_ADDRESS = process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS as `0x${string}`;

export const ACIKKASA_VAULT_ADDRESS = process.env.NEXT_PUBLIC_ACIKKASA_VAULT_ADDRESS as `0x${string}`;

export const MOCK_USDC_ABI = [
  {
    inputs: [],
    name: "faucet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "FAUCET_AMOUNT",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const ACIKKASA_VAULT_ABI = [
  {
    inputs: [{ name: "campaignId", type: "uint256" }],
    name: "donateWithMON",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "campaignId", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    name: "donateWithMUSDC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
