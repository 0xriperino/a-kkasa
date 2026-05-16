// ============================================================
// AçıkKasa — Supabase TypeScript Tipleri
// ============================================================

export interface Campaign {
  id: string;
  chain_campaign_id: number | null;
  title: string;
  description: string;
  category: string;
  campaign_type: string;
  city: string;
  district: string;
  organization_name: string | null;
  official_reference_type: string;
  official_reference_no: string;
  recipient_address: string;
  creator_address: string;
  target_musdc: number;
  deadline: string;
  status: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  wallet_address: string;
  type: string;
  logo_url: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  campaign_id: string | null;
  chain_campaign_id: number | null;
  tx_hash: string;
  type: string;
  token: string;
  amount: number;
  from_address: string;
  to_address: string;
  explorer_url: string;
  created_at: string;
}

export interface User {
  id: string;
  wallet_address: string;
  role: string;
  created_at: string;
}

export interface GeneralVaultVote {
  id: string;
  wallet_address: string;
  campaign_id: string;
  chain_campaign_id: number;
  created_at: string;
}

export interface GeneralVaultMovement {
  id: string;
  tx_hash: string;
  type: string;
  token: string;
  amount: number;
  source_campaign_id: string | null;
  target_campaign_id: string | null;
  created_at: string;
}

// Insert / Upsert tipleri (id ve created_at opsiyonel)
export type CampaignInsert = Omit<Campaign, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type OrganizationInsert = Omit<Organization, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type TransactionInsert = Omit<Transaction, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type UserInsert = Omit<User, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type GeneralVaultVoteInsert = Omit<GeneralVaultVote, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type GeneralVaultMovementInsert = Omit<GeneralVaultMovement, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};
