-- ============================================================
-- AçıkKasa — Supabase Initial Migration
-- Monad üzerinde çalışan şeffaf bağış platformu
-- ============================================================

-- UUID oluşturucu
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. organizations
-- ============================================================
create table public.organizations (
  id              uuid        primary key default uuid_generate_v4(),
  name            text        not null,
  wallet_address  text        not null,
  type            text        not null,          -- 'dernek' | 'vakif' | 'kamu'
  logo_url        text,
  is_verified     boolean     not null default false,
  created_at      timestamptz not null default now()
);

comment on table public.organizations is 'Bağış toplayan kurum / STK kayıtları';

-- ============================================================
-- 2. campaigns
-- ============================================================
create table public.campaigns (
  id                      uuid        primary key default uuid_generate_v4(),
  chain_campaign_id       bigint,                 -- on-chain kampanya ID
  title                   text        not null,
  description             text        not null,
  category                text        not null,    -- 'Barınma' | 'Gıda' | 'Sağlık' | …
  campaign_type           text        not null,    -- 'Kurumsal' | 'Bireysel'
  city                    text        not null,
  district                text        not null,
  organization_name       text,                    -- nullable, bireysel ise boş
  official_reference_type text        not null,    -- 'valilik_izin' | 'kaymakamlık_izin' | …
  official_reference_no   text        not null,
  recipient_address       text        not null,    -- bağışı alacak cüzdan
  creator_address         text        not null,    -- kampanyayı oluşturan cüzdan
  target_musdc            numeric     not null,    -- hedef miktar (MUSDC)
  deadline                timestamptz not null,
  status                  text        not null default 'active',  -- 'active' | 'completed' | 'expired' | 'cancelled'
  image_url               text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

comment on table public.campaigns is 'Bağış kampanyaları — on-chain ve off-chain metadata';

-- updated_at otomatik güncelleme
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_campaigns_updated_at
  before update on public.campaigns
  for each row
  execute function public.handle_updated_at();

-- ============================================================
-- 3. users
-- ============================================================
create table public.users (
  id              uuid        primary key default uuid_generate_v4(),
  wallet_address  text        not null unique,
  role            text        not null default 'donor',  -- 'donor' | 'creator' | 'admin'
  created_at      timestamptz not null default now()
);

comment on table public.users is 'Cüzdan bazlı kullanıcı kayıtları';

-- ============================================================
-- 4. transactions
-- ============================================================
create table public.transactions (
  id                  uuid        primary key default uuid_generate_v4(),
  campaign_id         uuid        references public.campaigns(id) on delete set null,
  chain_campaign_id   bigint,
  tx_hash             text        not null,
  type                text        not null,        -- 'donation' | 'withdrawal' | 'vault_distribution'
  token               text        not null,        -- 'MUSDC' | 'MON'
  amount              numeric     not null,
  from_address        text        not null,
  to_address          text        not null,
  explorer_url        text        not null,
  created_at          timestamptz not null default now()
);

comment on table public.transactions is 'Tüm on-chain işlem kayıtları';

-- ============================================================
-- 5. general_vault_votes
-- ============================================================
create table public.general_vault_votes (
  id                  uuid        primary key default uuid_generate_v4(),
  wallet_address      text        not null,
  campaign_id         uuid        not null references public.campaigns(id) on delete cascade,
  chain_campaign_id   bigint      not null,
  created_at          timestamptz not null default now()
);

comment on table public.general_vault_votes is 'Genel kasa dağıtımı için topluluk oyları';

-- Her cüzdan her kampanyaya yalnızca bir kez oy verebilir
create unique index idx_vault_vote_unique
  on public.general_vault_votes (wallet_address, campaign_id);

-- ============================================================
-- 6. general_vault_movements
-- ============================================================
create table public.general_vault_movements (
  id                  uuid        primary key default uuid_generate_v4(),
  tx_hash             text        not null,
  type                text        not null,        -- 'deposit' | 'distribution'
  token               text        not null,
  amount              numeric     not null,
  source_campaign_id  uuid        references public.campaigns(id) on delete set null,
  target_campaign_id  uuid        references public.campaigns(id) on delete set null,
  created_at          timestamptz not null default now()
);

comment on table public.general_vault_movements is 'Genel kasa giriş/çıkış hareketleri';

-- ============================================================
-- İndeksler
-- ============================================================
create index idx_campaigns_chain_id     on public.campaigns (chain_campaign_id);
create index idx_campaigns_status       on public.campaigns (status);
create index idx_campaigns_category     on public.campaigns (category);
create index idx_campaigns_city         on public.campaigns (city);
create index idx_transactions_campaign  on public.transactions (campaign_id);
create index idx_transactions_chain_id  on public.transactions (chain_campaign_id);
create index idx_transactions_tx_hash   on public.transactions (tx_hash);
create index idx_users_wallet           on public.users (wallet_address);
create index idx_vault_votes_campaign   on public.general_vault_votes (campaign_id);

-- ============================================================
-- RLS — Hackathon / Development modu
-- Tüm tablolarda RLS açık, ama tüm işlemlere izin veriliyor.
-- Production'da bu politikalar sıkılaştırılmalıdır.
-- ============================================================

alter table public.organizations          enable row level security;
alter table public.campaigns              enable row level security;
alter table public.users                  enable row level security;
alter table public.transactions           enable row level security;
alter table public.general_vault_votes    enable row level security;
alter table public.general_vault_movements enable row level security;

-- Hackathon: herkese okuma + yazma izni
create policy "Allow all for organizations"          on public.organizations          for all using (true) with check (true);
create policy "Allow all for campaigns"              on public.campaigns              for all using (true) with check (true);
create policy "Allow all for users"                  on public.users                  for all using (true) with check (true);
create policy "Allow all for transactions"           on public.transactions           for all using (true) with check (true);
create policy "Allow all for general_vault_votes"    on public.general_vault_votes    for all using (true) with check (true);
create policy "Allow all for general_vault_movements" on public.general_vault_movements for all using (true) with check (true);
