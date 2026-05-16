"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp } from "lucide-react";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { CampaignFilters } from "@/components/campaigns/CampaignFilters";
import { supabase } from "@/../lib/supabase/client";
import type { Campaign, CampaignCategory } from "@/types";

interface FilterState {
  search: string;
  category: CampaignCategory | "all";
  province: string | "all";
  campaignType: "all" | "institutional" | "individual";
  verified: "all" | "verified" | "pending";
}

function mapDbCampaign(row: Record<string, unknown>): Campaign {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    category: (row.category as string).toLowerCase().replace(/\s+/g, "-") as CampaignCategory,
    province: row.city as string,
    district: row.district as string,
    campaignType: (row.campaign_type as string) === "Kurumsal" ? "institutional" : "individual",
    officialReference: row.official_reference_no as string,
    targetMUSDC: Number(row.target_musdc),
    collectedMUSDC: 0,
    collectedMON: 0,
    deadline: row.deadline as string,
    status: row.status as Campaign["status"],
    verified: true,
    creatorWallet: row.creator_address as string,
    recipientWallet: row.recipient_address as string,
    createdAt: row.created_at as string,
    transactions: [],
  };
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    province: "all",
    campaignType: "all",
    verified: "all",
  });

  useEffect(() => {
    async function fetchCampaigns() {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Kampanyalar yüklenemedi:", error);
        setCampaigns([]);
        setLoading(false);
        return;
      }

      const campaignList = (data || []).map(mapDbCampaign);

      const { data: txData } = await supabase
        .from("transactions")
        .select("campaign_id, token, amount")
        .eq("type", "donation");

      if (txData) {
        const musdcByCampaign: Record<string, number> = {};
        const monByCampaign: Record<string, number> = {};

        for (const tx of txData) {
          const cid = tx.campaign_id as string;
          if (!cid) continue;
          if (tx.token === "MUSDC") {
            musdcByCampaign[cid] = (musdcByCampaign[cid] || 0) + Number(tx.amount);
          } else if (tx.token === "MON") {
            monByCampaign[cid] = (monByCampaign[cid] || 0) + Number(tx.amount);
          }
        }

        for (const c of campaignList) {
          c.collectedMUSDC = musdcByCampaign[c.id] || 0;
          c.collectedMON = monByCampaign[c.id] || 0;
        }
      }

      setCampaigns(campaignList);
      setLoading(false);
    }
    fetchCampaigns();
  }, []);

  const uniqueCategories = useMemo(() => {
    return [...new Set(campaigns.map((c) => c.category))];
  }, [campaigns]);

  const uniqueProvinces = useMemo(() => {
    return [...new Set(campaigns.map((c) => c.province))].sort();
  }, [campaigns]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      if (
        filters.search &&
        !campaign.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !campaign.province.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.category !== "all" && campaign.category !== filters.category) {
        return false;
      }
      if (filters.province !== "all" && campaign.province !== filters.province) {
        return false;
      }
      if (
        filters.campaignType !== "all" &&
        campaign.campaignType !== filters.campaignType
      ) {
        return false;
      }
      if (filters.verified === "verified" && !campaign.verified) {
        return false;
      }
      if (filters.verified === "pending" && campaign.verified) {
        return false;
      }
      return true;
    });
  }, [filters, campaigns]);

  const totalCollected = campaigns.reduce(
    (sum, c) => sum + c.collectedMUSDC,
    0
  );
  const totalTarget = campaigns.reduce((sum, c) => sum + c.targetMUSDC, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Kampanyalar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Bağış İlanları</h1>
              <p className="text-muted-foreground">
                İhtiyaç sahiplerine yardım etmek için kampanyaları inceleyin
              </p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{campaigns.length}</p>
                  <p className="text-xs text-muted-foreground">Aktif Kampanya</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-success/10">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">%{overallProgress}</p>
                  <p className="text-xs text-muted-foreground">Toplam Hedef</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <CampaignFilters
            categories={uniqueCategories}
            provinces={uniqueProvinces}
            onFilterChange={setFilters}
          />

          <div className="mt-8">
            {filteredCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-secondary/20 rounded-2xl">
                <p className="text-lg text-muted-foreground">
                  Aradığınız kriterlere uygun kampanya bulunamadı.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Filtreleri temizleyip tekrar deneyin.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
