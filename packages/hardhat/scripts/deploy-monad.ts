import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz");
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);

  console.log("Deployer:", wallet.address);
  console.log("Balance:", ethers.formatEther(await provider.getBalance(wallet.address)), "MON");
  console.log("");

  // Load compiled artifacts
  const mockUSDCArtifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../artifacts/contracts/MockUSDC.sol/MockUSDC.json"), "utf8")
  );
  const vaultArtifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../artifacts/contracts/AcikKasaVault.sol/AcikKasaVault.json"), "utf8")
  );

  // Deploy MockUSDC
  console.log("Deploying MockUSDC...");
  const MockUSDCFactory = new ethers.ContractFactory(mockUSDCArtifact.abi, mockUSDCArtifact.bytecode, wallet);
  const mockUSDC = await MockUSDCFactory.deploy();
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("✅ MockUSDC deployed at:", mockUSDCAddress);
  console.log("");

  // Deploy AcikKasaVault
  console.log("Deploying AcikKasaVault...");
  const VaultFactory = new ethers.ContractFactory(vaultArtifact.abi, vaultArtifact.bytecode, wallet);
  const vault = await VaultFactory.deploy(mockUSDCAddress);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("✅ AcikKasaVault deployed at:", vaultAddress);
  console.log("");

  // Summary
  console.log("═══════════════════════════════════════════════");
  console.log("  DEPLOYMENT COMPLETE - Monad Testnet");
  console.log("═══════════════════════════════════════════════");
  console.log(`  NEXT_PUBLIC_MOCK_USDC_ADDRESS=${mockUSDCAddress}`);
  console.log(`  NEXT_PUBLIC_ACIKKASA_VAULT_ADDRESS=${vaultAddress}`);
  console.log("═══════════════════════════════════════════════");
  console.log("");
  console.log("Owner (admin):", wallet.address);
  console.log("Remaining balance:", ethers.formatEther(await provider.getBalance(wallet.address)), "MON");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
