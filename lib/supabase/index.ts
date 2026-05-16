export { supabase } from "./client";
export type {
  Campaign, CampaignInsert,
  Organization, OrganizationInsert,
  Transaction, TransactionInsert,
  User, UserInsert,
  GeneralVaultVote, GeneralVaultVoteInsert,
  GeneralVaultMovement, GeneralVaultMovementInsert,
} from "./types";
export { getCampaigns, getCampaignByChainId, createCampaignMetadata, updateCampaignStatus } from "./campaigns";
export { getOrganizations, getOrganizationByWallet, seedDemoOrganizations } from "./organizations";
export { getTransactions, getTransactionsByCampaign, recordTransaction } from "./transactions";
export { getGeneralVaultVotes, recordGeneralVaultVote } from "./votes";
