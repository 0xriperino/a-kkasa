import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const DEMO_VERIFIED_ORGANIZATIONS: string[] = [
  // Buraya demo verified organization adresleri eklenebilir
  // "0x1234...abcd",
];

const deployAcikKasaVault: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;

  const mockUSDC = await get("MockUSDC");

  const result = await deploy("AcikKasaVault", {
    from: deployer,
    args: [mockUSDC.address],
    log: true,
    autoMine: true,
  });

  console.log("✅ AcikKasaVault deployed at:", result.address);
  console.log("   └─ MockUSDC address:", mockUSDC.address);

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
deployAcikKasaVault.dependencies = ["MockUSDC"];
