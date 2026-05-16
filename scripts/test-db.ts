// ============================================================
// AçıkKasa — Database Test Script
// Tüm Supabase helperlarını sırayla test eder.
//
// Çalıştır:  npm run test:db
// Gerekli:   .env.local dosyasında NEXT_PUBLIC_SUPABASE_URL
//            ve NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlı olmalı.
// ============================================================

import { supabase } from "../lib/supabase/client";
import {
  getCampaigns,
  getCampaignByChainId,
  createCampaignMetadata,
  updateCampaignStatus,
} from "../lib/supabase/campaigns";
import {
  getOrganizations,
  getOrganizationByWallet,
  seedDemoOrganizations,
} from "../lib/supabase/organizations";
import {
  getTransactions,
  getTransactionsByCampaign,
  recordTransaction,
} from "../lib/supabase/transactions";
import {
  getGeneralVaultVotes,
  recordGeneralVaultVote,
} from "../lib/supabase/votes";

// ── Helpers ──────────────────────────────────────────────────

const passed: string[] = [];
const failed: string[] = [];

function log(icon: string, msg: string) {
  console.log(`${icon}  ${msg}`);
}

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    passed.push(name);
    log("✅", name);
  } catch (err: any) {
    failed.push(name);
    log("❌", `${name} — ${err.message ?? err}`);
  }
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`);
}

// ── Tests ────────────────────────────────────────────────────

async function main() {
  console.log("\n══════════════════════════════════════════════");
  console.log("  AçıkKasa — Database Test Suite");
  console.log("══════════════════════════════════════════════\n");

  // ── 0. Connection ──
  await test("Supabase bağlantı testi", async () => {
    const { error } = await supabase.from("organizations").select("id").limit(1);
    assert(!error, `Bağlantı hatası: ${error?.message}`);
  });

  // ── 1. Organizations ──
  console.log("\n── Organizations ──");

  await test("seedDemoOrganizations()", async () => {
    const orgs = await seedDemoOrganizations();
    assert(orgs.length > 0, "Seed sonrası kurum listesi boş");
  });

  await test("getOrganizations()", async () => {
    const orgs = await getOrganizations();
    assert(orgs.length >= 4, `Beklenen >= 4 kurum, gelen: ${orgs.length}`);
  });

  await test("getOrganizationByWallet()", async () => {
    const org = await getOrganizationByWallet(
      "0xafad000000000000000000000000000000000001"
    );
    assert(org !== null, "AFAD cüzdanı ile kurum bulunamadı");
    assert(org!.name === "AFAD", `Beklenen: AFAD, gelen: ${org!.name}`);
  });

  // ── 2. Campaigns ──
  console.log("\n── Campaigns ──");

  let testCampaignChainId = 9999;

  await test("createCampaignMetadata()", async () => {
    const campaign = await createCampaignMetadata({
      chain_campaign_id: testCampaignChainId,
      title: "Test Kampanyası",
      description: "Otomatik test tarafından oluşturuldu",
      category: "Test",
      campaign_type: "Bireysel",
      city: "Ankara",
      district: "Çankaya",
      organization_name: null,
      official_reference_type: "test",
      official_reference_no: "TEST-001",
      recipient_address: "0xtest000000000000000000000000000000000099",
      creator_address: "0xtest000000000000000000000000000000000099",
      target_musdc: 1000,
      deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
      status: "active",
      image_url: null,
    });
    assert(campaign !== null, "Kampanya oluşturulamadı");
    assert(campaign!.title === "Test Kampanyası", "Title eşleşmedi");
  });

  await test("getCampaigns()", async () => {
    const campaigns = await getCampaigns();
    assert(campaigns.length > 0, "Kampanya listesi boş");
  });

  await test("getCampaignByChainId()", async () => {
    const c = await getCampaignByChainId(testCampaignChainId);
    assert(c !== null, `chain_campaign_id=${testCampaignChainId} bulunamadı`);
    assert(c!.city === "Ankara", `Beklenen şehir: Ankara, gelen: ${c!.city}`);
  });

  await test("updateCampaignStatus()", async () => {
    const c = await updateCampaignStatus(testCampaignChainId, "completed");
    assert(c !== null, "Status güncelleme başarısız");
    assert(c!.status === "completed", `Beklenen: completed, gelen: ${c!.status}`);
  });

  // ── 3. Transactions ──
  console.log("\n── Transactions ──");

  await test("recordTransaction()", async () => {
    const campaign = await getCampaignByChainId(testCampaignChainId);
    const tx = await recordTransaction({
      campaign_id: campaign?.id ?? null,
      chain_campaign_id: testCampaignChainId,
      tx_hash: "0xtesthash000000000000000000000000000000000000000001",
      type: "donation",
      token: "MUSDC",
      amount: 100,
      from_address: "0xdonor0000000000000000000000000000000001",
      to_address: "0xtest000000000000000000000000000000000099",
      explorer_url: "https://explorer.monad.xyz/tx/0xtesthash",
    });
    assert(tx !== null, "Transaction kaydedilemedi");
    assert(tx!.amount === 100, `Beklenen: 100, gelen: ${tx!.amount}`);
  });

  await test("getTransactions()", async () => {
    const txs = await getTransactions();
    assert(txs.length > 0, "Transaction listesi boş");
  });

  await test("getTransactionsByCampaign()", async () => {
    const txs = await getTransactionsByCampaign(testCampaignChainId);
    assert(txs.length > 0, "Kampanya bazlı transaction bulunamadı");
  });

  // ── 4. Votes ──
  console.log("\n── Votes ──");

  await test("recordGeneralVaultVote()", async () => {
    const campaign = await getCampaignByChainId(testCampaignChainId);
    assert(campaign !== null, "Vote testi için kampanya bulunamadı");

    const vote = await recordGeneralVaultVote({
      wallet_address: "0xvoter0000000000000000000000000000000001",
      campaign_id: campaign!.id,
      chain_campaign_id: testCampaignChainId,
    });
    assert(vote !== null, "Oy kaydedilemedi");
  });

  await test("recordGeneralVaultVote() — duplicate koruması", async () => {
    const campaign = await getCampaignByChainId(testCampaignChainId);
    // Aynı cüzdan + kampanya ile tekrar oy — null dönmeli
    const vote = await recordGeneralVaultVote({
      wallet_address: "0xvoter0000000000000000000000000000000001",
      campaign_id: campaign!.id,
      chain_campaign_id: testCampaignChainId,
    });
    assert(vote === null, "Duplicate oy engellenmedi!");
  });

  await test("getGeneralVaultVotes()", async () => {
    const votes = await getGeneralVaultVotes();
    assert(votes.length > 0, "Vote listesi boş");
  });

  // ── Cleanup ──
  console.log("\n── Cleanup ──");

  await test("Test verilerini temizle", async () => {
    // Votes
    await supabase
      .from("general_vault_votes")
      .delete()
      .eq("chain_campaign_id", testCampaignChainId);

    // Transactions
    await supabase
      .from("transactions")
      .delete()
      .eq("chain_campaign_id", testCampaignChainId);

    // Campaign
    await supabase
      .from("campaigns")
      .delete()
      .eq("chain_campaign_id", testCampaignChainId);

    log("🧹", "Test verileri temizlendi");
  });

  // ── Results ──
  console.log("\n══════════════════════════════════════════════");
  console.log(`  Sonuç:  ${passed.length} geçti  /  ${failed.length} kaldı`);
  console.log("══════════════════════════════════════════════\n");

  if (failed.length > 0) {
    console.log("Başarısız testler:");
    failed.forEach((f) => console.log(`  ❌ ${f}`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test suite çöktü:", err);
  process.exit(1);
});
