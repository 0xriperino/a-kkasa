// ============================================================
// AçıkKasa — Campaigns Helper
// ============================================================
import { supabase } from "./client";
import type { Campaign, CampaignInsert } from "./types";

/**
 * Tüm kampanyaları getirir.
 * Varsayılan sıralama: oluşturulma tarihine göre (en yeni önce).
 */
export async function getCampaigns(): Promise<Campaign[]> {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getCampaigns] Supabase hatası:", error.message);
      return [];
    }

    return (data as Campaign[]) ?? [];
  } catch (err) {
    console.error("[getCampaigns] Beklenmeyen hata:", err);
    return [];
  }
}

/**
 * On-chain kampanya ID'sine göre tek kampanya getirir.
 */
export async function getCampaignByChainId(
  chainCampaignId: number
): Promise<Campaign | null> {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("chain_campaign_id", chainCampaignId)
      .single();

    if (error) {
      console.error("[getCampaignByChainId] Supabase hatası:", error.message);
      return null;
    }

    return (data as Campaign) ?? null;
  } catch (err) {
    console.error("[getCampaignByChainId] Beklenmeyen hata:", err);
    return null;
  }
}

/**
 * Yeni kampanya metadata'sı oluşturur.
 */
export async function createCampaignMetadata(
  campaignData: CampaignInsert
): Promise<Campaign | null> {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .insert(campaignData)
      .select()
      .single();

    if (error) {
      console.error("[createCampaignMetadata] Supabase hatası:", error.message);
      return null;
    }

    return (data as Campaign) ?? null;
  } catch (err) {
    console.error("[createCampaignMetadata] Beklenmeyen hata:", err);
    return null;
  }
}

/**
 * On-chain kampanya ID'sine göre kampanya durumunu günceller.
 */
export async function updateCampaignStatus(
  chainCampaignId: number,
  status: string
): Promise<Campaign | null> {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .update({ status })
      .eq("chain_campaign_id", chainCampaignId)
      .select()
      .single();

    if (error) {
      console.error("[updateCampaignStatus] Supabase hatası:", error.message);
      return null;
    }

    return (data as Campaign) ?? null;
  } catch (err) {
    console.error("[updateCampaignStatus] Beklenmeyen hata:", err);
    return null;
  }
}
