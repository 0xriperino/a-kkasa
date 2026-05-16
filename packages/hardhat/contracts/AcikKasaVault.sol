// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AcikKasaVault is ReentrancyGuard, Ownable {
    IERC20 public immutable mUSDC;

    enum CampaignStatus {
        Pending,
        Verified,
        Rejected,
        PaidOut,
        MovedToGeneralVault
    }

    struct Campaign {
        uint256 id;
        address creator;
        address recipient;
        uint256 targetMUSDC;
        uint256 donatedMUSDC;
        uint256 donatedMON;
        uint256 deadline;
        CampaignStatus status;
        bool finalized;
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;
    mapping(address => bool) public verifiedOrganizations;
    mapping(uint256 => mapping(address => bool)) public hasDonated;

    uint256 public generalVaultMON;
    uint256 public generalVaultMUSDC;

    mapping(address => bool) public isDonor;
    mapping(address => uint256) public voterChoice;
    mapping(address => bool) public hasVoted;
    mapping(uint256 => uint256) public generalVaultVotes;
    uint256 public leadingCampaignId;
    uint256 public leadingVotes;

    event CampaignCreated(uint256 indexed campaignId, address indexed creator, address recipient, uint256 targetMUSDC, uint256 deadline);
    event CampaignVerified(uint256 indexed campaignId);
    event CampaignRejected(uint256 indexed campaignId);
    event OrganizationVerified(address indexed organization);
    event DonationReceived(uint256 indexed campaignId, address indexed donor, uint256 amountMON, uint256 amountMUSDC);
    event CampaignPaidOut(uint256 indexed campaignId, address indexed recipient, uint256 amountMON, uint256 amountMUSDC);
    event CampaignMovedToGeneralVault(uint256 indexed campaignId, uint256 amountMON, uint256 amountMUSDC);
    event GeneralVaultVoteCast(address indexed voter, uint256 indexed campaignId);
    event GeneralVaultAllocated(uint256 indexed campaignId, address indexed recipient, uint256 amountMON, uint256 amountMUSDC);

    constructor(address _mUSDC) Ownable(msg.sender) {
        require(_mUSDC != address(0), "Invalid mUSDC address");
        mUSDC = IERC20(_mUSDC);
    }

    function createCampaign(address recipient, uint256 targetMUSDC, uint256 deadline) external returns (uint256) {
        require(recipient != address(0), "Recipient cannot be zero address");
        require(targetMUSDC > 0, "Target must be greater than zero");
        require(deadline > block.timestamp, "Deadline must be in the future");

        uint256 campaignId = campaignCount;
        campaignCount++;

        CampaignStatus initialStatus = verifiedOrganizations[msg.sender]
            ? CampaignStatus.Verified
            : CampaignStatus.Pending;

        campaigns[campaignId] = Campaign({
            id: campaignId,
            creator: msg.sender,
            recipient: recipient,
            targetMUSDC: targetMUSDC,
            donatedMUSDC: 0,
            donatedMON: 0,
            deadline: deadline,
            status: initialStatus,
            finalized: false
        });

        emit CampaignCreated(campaignId, msg.sender, recipient, targetMUSDC, deadline);

        if (initialStatus == CampaignStatus.Verified) {
            emit CampaignVerified(campaignId);
        }

        return campaignId;
    }

    function verifyCampaign(uint256 campaignId) external onlyOwner {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.status == CampaignStatus.Pending, "Campaign is not pending");

        campaign.status = CampaignStatus.Verified;
        emit CampaignVerified(campaignId);
    }

    function rejectCampaign(uint256 campaignId) external onlyOwner {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.status == CampaignStatus.Pending, "Campaign is not pending");

        campaign.status = CampaignStatus.Rejected;
        emit CampaignRejected(campaignId);
    }

    function verifyOrganization(address organization) external onlyOwner {
        require(organization != address(0), "Invalid organization address");
        verifiedOrganizations[organization] = true;
        emit OrganizationVerified(organization);
    }

    function donateWithMON(uint256 campaignId) external payable nonReentrant {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.status == CampaignStatus.Verified, "Campaign is not verified");
        require(block.timestamp < campaign.deadline, "Campaign deadline passed");
        require(msg.value > 0, "Donation must be greater than zero");

        campaign.donatedMON += msg.value;
        hasDonated[campaignId][msg.sender] = true;
        isDonor[msg.sender] = true;

        emit DonationReceived(campaignId, msg.sender, msg.value, 0);
    }

    function donateWithMUSDC(uint256 campaignId, uint256 amount) external nonReentrant {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.status == CampaignStatus.Verified, "Campaign is not verified");
        require(block.timestamp < campaign.deadline, "Campaign deadline passed");
        require(amount > 0, "Donation must be greater than zero");

        mUSDC.transferFrom(msg.sender, address(this), amount);
        campaign.donatedMUSDC += amount;
        hasDonated[campaignId][msg.sender] = true;
        isDonor[msg.sender] = true;

        emit DonationReceived(campaignId, msg.sender, 0, amount);
    }

    function finalizeCampaign(uint256 campaignId) external nonReentrant {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.status == CampaignStatus.Verified, "Campaign is not verified");
        require(!campaign.finalized, "Campaign already finalized");

        if (campaign.donatedMUSDC >= campaign.targetMUSDC) {
            campaign.finalized = true;
            campaign.status = CampaignStatus.PaidOut;

            uint256 monAmount = campaign.donatedMON;
            uint256 usdcAmount = campaign.donatedMUSDC;
            address recipient = campaign.recipient;

            if (usdcAmount > 0) {
                mUSDC.transfer(recipient, usdcAmount);
            }

            if (monAmount > 0) {
                (bool success, ) = recipient.call{value: monAmount}("");
                require(success, "MON transfer failed");
            }

            emit CampaignPaidOut(campaignId, recipient, monAmount, usdcAmount);
        } else if (block.timestamp >= campaign.deadline) {
            campaign.finalized = true;
            campaign.status = CampaignStatus.MovedToGeneralVault;

            generalVaultMON += campaign.donatedMON;
            generalVaultMUSDC += campaign.donatedMUSDC;

            emit CampaignMovedToGeneralVault(campaignId, campaign.donatedMON, campaign.donatedMUSDC);
        } else {
            revert("Target not met and deadline not passed");
        }
    }

    function voteForGeneralVaultAllocation(uint256 campaignId) external {
        require(isDonor[msg.sender], "Only donors can vote");
        require(campaigns[campaignId].status == CampaignStatus.Verified, "Campaign is not verified");

        if (hasVoted[msg.sender]) {
            uint256 previousChoice = voterChoice[msg.sender];
            generalVaultVotes[previousChoice]--;

            if (previousChoice == leadingCampaignId && generalVaultVotes[previousChoice] < leadingVotes) {
                leadingVotes = generalVaultVotes[previousChoice];
            }
        }

        voterChoice[msg.sender] = campaignId;
        hasVoted[msg.sender] = true;
        generalVaultVotes[campaignId]++;

        if (generalVaultVotes[campaignId] > leadingVotes) {
            leadingVotes = generalVaultVotes[campaignId];
            leadingCampaignId = campaignId;
        }

        emit GeneralVaultVoteCast(msg.sender, campaignId);
    }

    function executeGeneralVaultAllocation(uint256 campaignId) external nonReentrant {
        require(campaigns[campaignId].status == CampaignStatus.Verified, "Campaign is not verified");
        require(campaignId == leadingCampaignId, "Not the leading campaign");
        require(generalVaultMON > 0 || generalVaultMUSDC > 0, "General vault is empty");

        uint256 monAmount = generalVaultMON;
        uint256 usdcAmount = generalVaultMUSDC;
        address recipient = campaigns[campaignId].recipient;

        generalVaultMON = 0;
        generalVaultMUSDC = 0;

        if (usdcAmount > 0) {
            mUSDC.transfer(recipient, usdcAmount);
        }

        if (monAmount > 0) {
            (bool success, ) = recipient.call{value: monAmount}("");
            require(success, "MON transfer failed");
        }

        emit GeneralVaultAllocated(campaignId, recipient, monAmount, usdcAmount);
    }
}
