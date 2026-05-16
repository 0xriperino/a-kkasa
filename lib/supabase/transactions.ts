// ============================================================
// AçıkKasa — Transactions Helper
// ============================================================
import { supabase } from "./client";
import type { Transaction, TransactionInsert } from "./types";

/**
 * Tüm işlemleri getirir (en yeni önce).
 */
export async function getTransactions(): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getTransactions] Supabase hatası:", error.message);
      return [];
    }

    return (data as Transaction[]) ?? [];
  } catch (err) {
    console.error("[getTransactions] Beklenmeyen hata:", err);
    return [];
  }
}

/**
 * On-chain kampanya ID'sine göre işlemleri getirir.
 */
export async function getTransactionsByCampaign(
  chainCampaignId: number
): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("chain_campaign_id", chainCampaignId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getTransactionsByCampaign] Supabase hatası:", error.message);
      return [];
    }

    return (data as Transaction[]) ?? [];
  } catch (err) {
    console.error("[getTransactionsByCampaign] Beklenmeyen hata:", err);
    return [];
  }
}

/**
 * Yeni bir işlem kaydı oluşturur.
 */
export async function recordTransaction(
  txData: TransactionInsert
): Promise<Transaction | null> {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .insert(txData)
      .select()
      .single();

    if (error) {
      console.error("[recordTransaction] Supabase hatası:", error.message);
      return null;
    }

    return (data as Transaction) ?? null;
  } catch (err) {
    console.error("[recordTransaction] Beklenmeyen hata:", err);
    return null;
  }
}
