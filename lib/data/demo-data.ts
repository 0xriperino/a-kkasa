// ============================================================
// AçıkKasa — Demo Data (TypeScript)
// Frontend mock / fallback olarak kullanılabilir.
//
// NOT: Bu proje hackathon demosudur.
// Kurum isimleri temsilidir; gerçek entegrasyon yoktur.
// ============================================================

import type { Campaign, Organization } from "../supabase/types";

// --------------- Demo Kurumlar ---------------
export const demoOrganizations: Organization[] = [
  {
    id: "a1000000-0000-0000-0000-000000000001",
    name: "AFAD",
    wallet_address: "0xafad000000000000000000000000000000000001",
    type: "kamu",
    logo_url: null,
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "a1000000-0000-0000-0000-000000000002",
    name: "Kızılay",
    wallet_address: "0xk1z1lay0000000000000000000000000000000002",
    type: "dernek",
    logo_url: null,
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "a1000000-0000-0000-0000-000000000003",
    name: "Ahbap",
    wallet_address: "0xahbap00000000000000000000000000000000003",
    type: "dernek",
    logo_url: null,
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "a1000000-0000-0000-0000-000000000004",
    name: "AKUT",
    wallet_address: "0xakut000000000000000000000000000000000004",
    type: "dernek",
    logo_url: null,
    is_verified: true,
    created_at: new Date().toISOString(),
  },
];

// --------------- Demo Kampanyalar ---------------
export const demoCampaigns: Campaign[] = [
  {
    id: "c1000000-0000-0000-0000-000000000001",
    chain_campaign_id: 1,
    title: "Hatay Barınma Desteği",
    description:
      "Hatay Antakya'da depremden etkilenen aileler için barınma desteği kampanyası. Konteyner ev ve çadır kent ihtiyaçları karşılanacaktır.",
    category: "Barınma",
    campaign_type: "Kurumsal",
    city: "Hatay",
    district: "Antakya",
    organization_name: "AFAD",
    official_reference_type: "valilik_izin",
    official_reference_no: "HTY-2025-001",
    recipient_address: "0xafad000000000000000000000000000000000001",
    creator_address: "0xafad000000000000000000000000000000000001",
    target_musdc: 50000,
    deadline: "2025-12-31T23:59:59Z",
    status: "active",
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c1000000-0000-0000-0000-000000000002",
    chain_campaign_id: 2,
    title: "Kahramanmaraş Gıda ve Su Desteği",
    description:
      "Kahramanmaraş Onikişubat ilçesinde afetzedelere gıda paketi ve temiz su dağıtımı.",
    category: "Gıda",
    campaign_type: "Kurumsal",
    city: "Kahramanmaraş",
    district: "Onikişubat",
    organization_name: "Kızılay",
    official_reference_type: "valilik_izin",
    official_reference_no: "KMR-2025-042",
    recipient_address: "0xk1z1lay0000000000000000000000000000000002",
    creator_address: "0xk1z1lay0000000000000000000000000000000002",
    target_musdc: 30000,
    deadline: "2025-12-31T23:59:59Z",
    status: "active",
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c1000000-0000-0000-0000-000000000003",
    chain_campaign_id: 3,
    title: "Malatya İlaç ve Sağlık Desteği",
    description:
      "Malatya Battalgazi'de kronik hastalığı olan depremzedelere ilaç ve sağlık malzemesi desteği.",
    category: "Sağlık",
    campaign_type: "Bireysel",
    city: "Malatya",
    district: "Battalgazi",
    organization_name: null,
    official_reference_type: "valilik_izin",
    official_reference_no: "MLT-2025-018",
    recipient_address: "0xbireysel00000000000000000000000000000005",
    creator_address: "0xbireysel00000000000000000000000000000005",
    target_musdc: 15000,
    deadline: "2025-12-31T23:59:59Z",
    status: "active",
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c1000000-0000-0000-0000-000000000004",
    chain_campaign_id: 4,
    title: "Çocuk Tedavi Desteği",
    description:
      "İstanbul Fatih'te tedavi sürecindeki çocuklar için sağlık giderlerinin karşılanması.",
    category: "Tedavi desteği",
    campaign_type: "Bireysel",
    city: "İstanbul",
    district: "Fatih",
    organization_name: null,
    official_reference_type: "kaymakamlık_izin",
    official_reference_no: "IST-FTH-2025-DEMO",
    recipient_address: "0xbireysel00000000000000000000000000000006",
    creator_address: "0xbireysel00000000000000000000000000000006",
    target_musdc: 20000,
    deadline: "2025-12-31T23:59:59Z",
    status: "active",
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
