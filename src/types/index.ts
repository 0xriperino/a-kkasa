export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: CampaignCategory;
  province: string;
  district: string;
  campaignType: "institutional" | "individual";
  officialReference?: string;
  targetMUSDC: number;
  collectedMUSDC: number;
  collectedMON: number;
  deadline: string;
  status: CampaignStatus;
  verified: boolean;
  creatorWallet: string;
  recipientWallet: string;
  createdAt: string;
  transactions: Transaction[];
}

export type CampaignCategory =
  | "deprem"
  | "sel"
  | "yangin"
  | "acil-tibbi"
  | "gida"
  | "barinma"
  | "diger";

export type CampaignStatus =
  | "active"
  | "completed"
  | "expired"
  | "cancelled";

export interface Transaction {
  id: string;
  campaignId: string;
  campaignTitle: string;
  type: TransactionType;
  token: "MUSDC" | "MON";
  amount: number;
  sender: string;
  receiver: string;
  txHash: string;
  timestamp: string;
  status: "pending" | "confirmed" | "failed";
}

export type TransactionType =
  | "donation"
  | "campaign_verification"
  | "fund_transfer"
  | "transfer_to_general_vault"
  | "transfer_from_general_vault";

export interface VaultBalance {
  mon: number;
  musdc: number;
}

export interface Vote {
  campaignId: string;
  voteCount: number;
  voter: string;
  timestamp: string;
}

export interface VotingCampaign {
  campaignId: string;
  title: string;
  province: string;
  district: string;
  category: CampaignCategory;
  voteCount: number;
  isLeading: boolean;
  verified: boolean;
}

export interface PendingCampaign {
  id: string;
  title: string;
  campaignType: "institutional" | "individual";
  province: string;
  district: string;
  officialReference?: string;
  creatorWallet: string;
  recipientWallet: string;
  createdAt: string;
}

export interface SummaryStats {
  totalDonations: number;
  totalDistributed: number;
  numberOfDonors: number;
  recentTransactions: number;
}

export const CATEGORY_LABELS: Record<CampaignCategory, string> = {
  deprem: "Deprem",
  sel: "Sel",
  yangin: "Yangın",
  "acil-tibbi": "Acil Tıbbi",
  gida: "Gıda",
  barinma: "Barınma",
  diger: "Diğer",
};

export const STATUS_LABELS: Record<CampaignStatus, string> = {
  active: "Aktif",
  completed: "Tamamlandı",
  expired: "Süresi Doldu",
  cancelled: "İptal Edildi",
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  donation: "Bağış",
  campaign_verification: "Kampanya Doğrulama",
  fund_transfer: "Fon Transferi",
  transfer_to_general_vault: "Genel Kasaya Aktarım",
  transfer_from_general_vault: "Genel Kasadan Aktarım",
};