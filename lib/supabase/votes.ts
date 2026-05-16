// ============================================================
// AçıkKasa — General Vault Votes Helper
// ============================================================
import { supabase } from "./client";
import type { GeneralVaultVote, GeneralVaultVoteInsert } from "./types";

/**
 * Tüm genel kasa oylarını getirir.
 */
export async function getGeneralVaultVotes(): Promise<GeneralVaultVote[]> {
  try {
    const { data, error } = await supabase
      .from("general_vault_votes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getGeneralVaultVotes] Supabase hatası:", error.message);
      return [];
    }

    return (data as GeneralVaultVote[]) ?? [];
  } catch (err) {
    console.error("[getGeneralVaultVotes] Beklenmeyen hata:", err);
    return [];
  }
}

/**
 * Yeni bir genel kasa oyu kaydeder.
 * Aynı cüzdan + kampanya çifti için tekrar oy atılamaz (unique index).
 */
export async function recordGeneralVaultVote(
  voteData: GeneralVaultVoteInsert
): Promise<GeneralVaultVote | null> {
  try {
    const { data, error } = await supabase
      .from("general_vault_votes")
      .insert(voteData)
      .select()
      .single();

    if (error) {
      // Duplicate vote durumunda özel mesaj
      if (error.code === "23505") {
        console.error(
          "[recordGeneralVaultVote] Bu cüzdan bu kampanyaya zaten oy vermiş."
        );
        return null;
      }
      console.error("[recordGeneralVaultVote] Supabase hatası:", error.message);
      return null;
    }

    return (data as GeneralVaultVote) ?? null;
  } catch (err) {
    console.error("[recordGeneralVaultVote] Beklenmeyen hata:", err);
    return null;
  }
}
