// ============================================================
// AçıkKasa — Organizations Helper
// ============================================================
import { supabase } from "./client";
import type { Organization, OrganizationInsert } from "./types";

/**
 * Tüm kurumları getirir.
 */
export async function getOrganizations(): Promise<Organization[]> {
  try {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("[getOrganizations] Supabase hatası:", error.message);
      return [];
    }

    return (data as Organization[]) ?? [];
  } catch (err) {
    console.error("[getOrganizations] Beklenmeyen hata:", err);
    return [];
  }
}

/**
 * Cüzdan adresine göre kurum getirir.
 */
export async function getOrganizationByWallet(
  wallet: string
): Promise<Organization | null> {
  try {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("wallet_address", wallet.toLowerCase())
      .single();

    if (error) {
      console.error("[getOrganizationByWallet] Supabase hatası:", error.message);
      return null;
    }

    return (data as Organization) ?? null;
  } catch (err) {
    console.error("[getOrganizationByWallet] Beklenmeyen hata:", err);
    return null;
  }
}

/**
 * Demo kurumları seed eder.
 * Hackathon amaçlıdır — gerçek entegrasyon yoktur.
 */
export async function seedDemoOrganizations(): Promise<Organization[]> {
  const demoOrgs: OrganizationInsert[] = [
    {
      name: "AFAD",
      wallet_address: "0xafad000000000000000000000000000000000001",
      type: "kamu",
      logo_url: null,
      is_verified: true,
    },
    {
      name: "Kızılay",
      wallet_address: "0xk1z1lay0000000000000000000000000000000002",
      type: "dernek",
      logo_url: null,
      is_verified: true,
    },
    {
      name: "Ahbap",
      wallet_address: "0xahbap00000000000000000000000000000000003",
      type: "dernek",
      logo_url: null,
      is_verified: true,
    },
    {
      name: "AKUT",
      wallet_address: "0xakut000000000000000000000000000000000004",
      type: "dernek",
      logo_url: null,
      is_verified: true,
    },
  ];

  try {
    const { data, error } = await supabase
      .from("organizations")
      .upsert(demoOrgs, { onConflict: "id" })
      .select();

    if (error) {
      console.error("[seedDemoOrganizations] Supabase hatası:", error.message);
      return [];
    }

    console.log(`[seedDemoOrganizations] ${data?.length ?? 0} kurum seed edildi.`);
    return (data as Organization[]) ?? [];
  } catch (err) {
    console.error("[seedDemoOrganizations] Beklenmeyen hata:", err);
    return [];
  }
}
