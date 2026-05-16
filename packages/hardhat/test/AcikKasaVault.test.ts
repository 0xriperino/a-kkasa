import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { AcikKasaVault, MockUSDC } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("AcikKasaVault", function () {
  let vault: AcikKasaVault;
  let usdc: MockUSDC;
  let owner: SignerWithAddress;
  let donor: SignerWithAddress;
  let recipient: SignerWithAddress;
  let voter2: SignerWithAddress;

  const TARGET = 1000n * 10n ** 6n; // 1000 USDC
  const FAUCET_AMOUNT = 1000n * 10n ** 6n;

  beforeEach(async function () {
    [owner, donor, recipient, voter2] = await ethers.getSigners();

    const MockUSDCFactory = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDCFactory.deploy();

    const VaultFactory = await ethers.getContractFactory("AcikKasaVault");
    vault = await VaultFactory.deploy(await usdc.getAddress());
  });

  describe("MockUSDC Faucet", function () {
    it("1. Kullanici faucet ile 1000 mUSDC alabiliyor", async function () {
      await usdc.connect(donor).faucet();
      expect(await usdc.balanceOf(donor.address)).to.equal(FAUCET_AMOUNT);
    });
  });

  describe("Campaign Creation", function () {
    it("2. Kullanici kampanya olusturabiliyor", async function () {
      const deadline = (await time.latest()) + 86400;
      await vault.connect(donor).createCampaign(recipient.address, TARGET, deadline);

      const campaign = await vault.campaigns(0);
      expect(campaign.creator).to.equal(donor.address);
      expect(campaign.recipient).to.equal(recipient.address);
      expect(campaign.targetMUSDC).to.equal(TARGET);
    });
  });

  describe("Donation Rules", function () {
    it("3. Verified olmayan kampanyaya bagis yapilamiyor", async function () {
      const deadline = (await time.latest()) + 86400;
      await vault.connect(donor).createCampaign(recipient.address, TARGET, deadline);

      await usdc.connect(donor).faucet();
      await usdc.connect(donor).approve(await vault.getAddress(), FAUCET_AMOUNT);

      await expect(
        vault.connect(donor).donateWithMUSDC(0, FAUCET_AMOUNT)
      ).to.be.revertedWith("Campaign is not verified");
    });

    it("4. Owner kampanyayi verify edebiliyor", async function () {
      const deadline = (await time.latest()) + 86400;
      await vault.connect(donor).createCampaign(recipient.address, TARGET, deadline);

      await vault.connect(owner).verifyCampaign(0);
      const campaign = await vault.campaigns(0);
      expect(campaign.status).to.equal(1); // Verified
    });

    it("5. Kullanici mUSDC approve + donate yapabiliyor", async function () {
      const deadline = (await time.latest()) + 86400;
      await vault.connect(donor).createCampaign(recipient.address, TARGET, deadline);
      await vault.connect(owner).verifyCampaign(0);

      await usdc.connect(donor).faucet();
      await usdc.connect(donor).approve(await vault.getAddress(), FAUCET_AMOUNT);
      await vault.connect(donor).donateWithMUSDC(0, FAUCET_AMOUNT);

      const campaign = await vault.campaigns(0);
      expect(campaign.donatedMUSDC).to.equal(FAUCET_AMOUNT);
    });

    it("6. Kullanici MON donate yapabiliyor", async function () {
      const deadline = (await time.latest()) + 86400;
      await vault.connect(donor).createCampaign(recipient.address, TARGET, deadline);
      await vault.connect(owner).verifyCampaign(0);

      const donateAmount = ethers.parseEther("1");
      await vault.connect(donor).donateWithMON(0, { value: donateAmount });

      const campaign = await vault.campaigns(0);
      expect(campaign.donatedMON).to.equal(donateAmount);
    });
  });

  describe("Finalize", function () {
    it("7. Hedefe ulasan kampanya finalize edilince fon recipient'a gidiyor", async function () {
      const deadline = (await time.latest()) + 86400;
      await vault.connect(donor).createCampaign(recipient.address, TARGET, deadline);
      await vault.connect(owner).verifyCampaign(0);

      await usdc.connect(donor).faucet();
      await usdc.connect(donor).approve(await vault.getAddress(), TARGET);
      await vault.connect(donor).donateWithMUSDC(0, TARGET);

      const balanceBefore = await usdc.balanceOf(recipient.address);
      await vault.finalizeCampaign(0);
      const balanceAfter = await usdc.balanceOf(recipient.address);

      expect(balanceAfter - balanceBefore).to.equal(TARGET);
    });

    it("8. Hedefe ulasmayan ve deadline gecen kampanya finalize edilince fon Genel Kasaya gidiyor", async function () {
      const deadline = (await time.latest()) + 86400;
      await vault.connect(donor).createCampaign(recipient.address, TARGET, deadline);
      await vault.connect(owner).verifyCampaign(0);

      const partialAmount = 500n * 10n ** 6n;
      await usdc.connect(donor).faucet();
      await usdc.connect(donor).approve(await vault.getAddress(), partialAmount);
      await vault.connect(donor).donateWithMUSDC(0, partialAmount);

      await time.increase(86401);
      await vault.finalizeCampaign(0);

      expect(await vault.generalVaultMUSDC()).to.equal(partialAmount);
      const campaign = await vault.campaigns(0);
      expect(campaign.status).to.equal(4); // MovedToGeneralVault
    });
  });

  describe("General Vault Voting", function () {
    let campaignA: number;
    let campaignB: number;

    beforeEach(async function () {
      const deadline = (await time.latest()) + 86400 * 30;

      // Kampanya A (oy alacak)
      await vault.connect(donor).createCampaign(recipient.address, TARGET, deadline);
      await vault.connect(owner).verifyCampaign(0);
      campaignA = 0;

      // Kampanya B
      await vault.connect(donor).createCampaign(recipient.address, TARGET, deadline);
      await vault.connect(owner).verifyCampaign(1);
      campaignB = 1;

      // Donor bagis yapsin (oy hakki icin)
      await usdc.connect(donor).faucet();
      await usdc.connect(donor).approve(await vault.getAddress(), FAUCET_AMOUNT);
      await vault.connect(donor).donateWithMUSDC(campaignA, 100n * 10n ** 6n);

      // voter2 de bagis yapsin
      await usdc.connect(voter2).faucet();
      await usdc.connect(voter2).approve(await vault.getAddress(), FAUCET_AMOUNT);
      await vault.connect(voter2).donateWithMUSDC(campaignA, 100n * 10n ** 6n);
    });

    it("9. Bagisci Genel Yardim Kasasi icin oy verebiliyor", async function () {
      await vault.connect(donor).voteForGeneralVaultAllocation(campaignA);
      expect(await vault.generalVaultVotes(campaignA)).to.equal(1);
      expect(await vault.leadingCampaignId()).to.equal(campaignA);
    });

    it("10. En cok oy alan verified kampanyaya Genel Kasadan fon aktarilabiliyor", async function () {
      // Suresi dolmus bir kampanya olustur ve finalize et → Genel Kasaya fon aktar
      const shortDeadline = (await time.latest()) + 100;
      await vault.connect(donor).createCampaign(recipient.address, TARGET, shortDeadline);
      await vault.connect(owner).verifyCampaign(2);

      await vault.connect(donor).donateWithMON(2, { value: ethers.parseEther("5") });

      await time.increase(101);
      await vault.finalizeCampaign(2);

      expect(await vault.generalVaultMON()).to.equal(ethers.parseEther("5"));

      // Oy ver
      await vault.connect(donor).voteForGeneralVaultAllocation(campaignA);
      await vault.connect(voter2).voteForGeneralVaultAllocation(campaignA);

      // Execute allocation
      const balanceBefore = await ethers.provider.getBalance(recipient.address);
      await vault.executeGeneralVaultAllocation(campaignA);
      const balanceAfter = await ethers.provider.getBalance(recipient.address);

      expect(balanceAfter - balanceBefore).to.equal(ethers.parseEther("5"));
      expect(await vault.generalVaultMON()).to.equal(0);
    });
  });
});
