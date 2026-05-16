"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp } from "lucide-react";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { CampaignFilters } from "@/components/campaigns/CampaignFilters";
import { mockCampaigns } from "@/data/mockData";
import type { CampaignCategory } from "@/types";

interface FilterState {
  search: string;
  category: CampaignCategory | "all";
  province: string | "all";
  campaignType: "all" | "institutional" | "individual";
  verified: "all" | "verified" | "pending";
}

export default function CampaignsPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    province: "all",
    campaignType: "all",
    verified: "all",
  });

  const uniqueCategories = useMemo(() => {
    return [...new Set(mockCampaigns.map((c) => c.category))];
  }, []);

  const uniqueProvinces = useMemo(() => {
    return [...new Set(mockCampaigns.map((c) => c.province))].sort();
  }, []);

  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter((campaign) => {
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
  }, [filters]);

  const totalCollected = mockCampaigns.reduce(
    (sum, c) => sum + c.collectedMUSDC,
    0
  );
  const totalTarget = mockCampaigns.reduce((sum, c) => sum + c.targetMUSDC, 0);
  const overallProgress = Math.round((totalCollected / totalTarget) * 100);

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
                  <p className="text-2xl font-bold">{mockCampaigns.length}</p>
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