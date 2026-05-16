-- ============================================================
-- AçıkKasa — Demo Data Seed
-- NOT: Bu proje hackathon demosudur.
-- Kurum isimleri temsilidir; gerçek entegrasyon yoktur.
-- ============================================================

-- Demo Kurumlar
insert into public.organizations (id, name, wallet_address, type, logo_url, is_verified) values
  ('a1000000-0000-0000-0000-000000000001', 'AFAD',    '0xafad000000000000000000000000000000000001', 'kamu',   null, true),
  ('a1000000-0000-0000-0000-000000000002', 'Kızılay', '0xk1z1lay0000000000000000000000000000000002', 'dernek', null, true),
  ('a1000000-0000-0000-0000-000000000003', 'Ahbap',   '0xahbap00000000000000000000000000000000003', 'dernek', null, true),
  ('a1000000-0000-0000-0000-000000000004', 'AKUT',    '0xakut000000000000000000000000000000000004', 'dernek', null, true)
on conflict (id) do nothing;

-- Demo Kampanyalar
insert into public.campaigns (
  id, chain_campaign_id, title, description, category, campaign_type,
  city, district, organization_name,
  official_reference_type, official_reference_no,
  recipient_address, creator_address,
  target_musdc, deadline, status, image_url
) values
(
  'c1000000-0000-0000-0000-000000000001',
  1,
  'Hatay Barınma Desteği',
  'Hatay Antakya''da depremden etkilenen aileler için barınma desteği kampanyası. Konteyner ev ve çadır kent ihtiyaçları karşılanacaktır.',
  'Barınma',
  'Kurumsal',
  'Hatay',
  'Antakya',
  'AFAD',
  'valilik_izin',
  'HTY-2025-001',
  '0xafad000000000000000000000000000000000001',
  '0xafad000000000000000000000000000000000001',
  50000,
  '2025-12-31T23:59:59Z',
  'active',
  null
),
(
  'c1000000-0000-0000-0000-000000000002',
  2,
  'Kahramanmaraş Gıda ve Su Desteği',
  'Kahramanmaraş Onikişubat ilçesinde afetzedelere gıda paketi ve temiz su dağıtımı.',
  'Gıda',
  'Kurumsal',
  'Kahramanmaraş',
  'Onikişubat',
  'Kızılay',
  'valilik_izin',
  'KMR-2025-042',
  '0xk1z1lay0000000000000000000000000000000002',
  '0xk1z1lay0000000000000000000000000000000002',
  30000,
  '2025-12-31T23:59:59Z',
  'active',
  null
),
(
  'c1000000-0000-0000-0000-000000000003',
  3,
  'Malatya İlaç ve Sağlık Desteği',
  'Malatya Battalgazi''de kronik hastalığı olan depremzedelere ilaç ve sağlık malzemesi desteği.',
  'Sağlık',
  'Bireysel',
  'Malatya',
  'Battalgazi',
  null,
  'valilik_izin',
  'MLT-2025-018',
  '0xbireysel00000000000000000000000000000005',
  '0xbireysel00000000000000000000000000000005',
  15000,
  '2025-12-31T23:59:59Z',
  'active',
  null
),
(
  'c1000000-0000-0000-0000-000000000004',
  4,
  'Çocuk Tedavi Desteği',
  'İstanbul Fatih''te tedavi sürecindeki çocuklar için sağlık giderlerinin karşılanması.',
  'Tedavi desteği',
  'Bireysel',
  'İstanbul',
  'Fatih',
  null,
  'kaymakamlık_izin',
  'IST-FTH-2025-DEMO',
  '0xbireysel00000000000000000000000000000006',
  '0xbireysel00000000000000000000000000000006',
  20000,
  '2025-12-31T23:59:59Z',
  'active',
  null
)
on conflict (id) do nothing;
