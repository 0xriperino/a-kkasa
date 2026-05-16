import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const VAULT_ADDRESS = "0x8cBc65CE9012ABe7a0568529BE9156f628E2ee30";

const VAULT_ABI = [
  "function createCampaign(address recipient, uint256 targetMUSDC, uint256 deadline) external returns (uint256)",
  "function verifyCampaign(uint256 campaignId) external",
  "function campaignCount() view returns (uint256)",
  "function campaigns(uint256) view returns (uint256 id, address creator, address recipient, uint256 targetMUSDC, uint256 donatedMUSDC, uint256 donatedMON, uint256 deadline, uint8 status, bool finalized)",
];

const CAMPAIGNS = [
  {
    title: "Hatay Barınma Desteği",
    recipient: "0xAFAD000000000000000000000000000000000001",
    targetMUSDC: 50000,
    deadlineDays: 230,
  },
  {
    title: "Kahramanmaraş Gıda ve Su Desteği",
    recipient: "0x00000000000000000000000000000000000A0002",
    targetMUSDC: 30000,
    deadlineDays: 230,
  },
  {
    title: "Malatya İlaç ve Sağlık Desteği",
    recipient: "0x00000000000000000000000000000000000B0005",
    targetMUSDC: 15000,
    deadlineDays: 230,
  },
  {
    title: "Çocuk Tedavi Desteği",
    recipient: "0x00000000000000000000000000000000000B0006",
    targetMUSDC: 20000,
    deadlineDays: 230,
  },
];

async function main() {
  const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz");
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);
  const vault = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, wallet);

  console.log("Owner:", wallet.address);
  const currentCount = await vault.campaignCount();
  console.log("Current campaign count on-chain:", currentCount.toString());
  console.log("");

  for (let i = 0; i < CAMPAIGNS.length; i++) {
    const c = CAMPAIGNS[i];
    const deadline = Math.floor(Date.now() / 1000) + c.deadlineDays * 24 * 60 * 60;
    const targetMUSDC6 = BigInt(c.targetMUSDC) * BigInt(10 ** 6);

    console.log(`Creating campaign ${i}: ${c.title}`);
    const tx = await vault.createCampaign(c.recipient, targetMUSDC6, deadline);
    const receipt = await tx.wait();
    console.log(`  ✅ Created (tx: ${receipt.hash})`);

    const campaignId = Number(currentCount) + i;
    const campaign = await vault.campaigns(campaignId);

    if (campaign.status === 0n) {
      console.log(`  Verifying campaign ${campaignId}...`);
      const vtx = await vault.verifyCampaign(campaignId);
      await vtx.wait();
      console.log(`  ✅ Verified`);
    } else {
      console.log(`  Already verified (status: ${campaign.status})`);
    }
    console.log("");
  }

  const finalCount = await vault.campaignCount();
  console.log("═══════════════════════════════════════════════");
  console.log(`  ${CAMPAIGNS.length} campaigns created & verified`);
  console.log(`  Total campaigns on-chain: ${finalCount}`);
  console.log("═══════════════════════════════════════════════");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
