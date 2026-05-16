import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const MONAD_TESTNET_USDC = "0x534b2f3A21130d7a60830c2Df862319e593943A3";

const DEMO_VERIFIED_ORGANIZATIONS: string[] = [
  // Buraya demo verified organization adresleri eklenebilir
  // "0x1234...abcd",
];

const deployAcikKasaVault: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const result = await deploy("AcikKasaVault", {
    from: deployer,
    args: [MONAD_TESTNET_USDC],
    log: true,
    autoMine: true,
  });

  console.log("✅ AcikKasaVault deployed at:", result.address);
  console.log("   └─ USDC address (Monad Testnet):", MONAD_TESTNET_USDC);

  if (DEMO_VERIFIED_ORGANIZATIONS.length > 0) {
    const acikKasaVault = await hre.ethers.getContractAt("AcikKasaVault", result.address);

    for (const org of DEMO_VERIFIED_ORGANIZATIONS) {
      const tx = await acikKasaVault.verifyOrganization(org);
      await tx.wait();
      console.log("   └─ Verified organization:", org);
    }
  }
};

export default deployAcikKasaVault;

deployAcikKasaVault.tags = ["AcikKasaVault"];
