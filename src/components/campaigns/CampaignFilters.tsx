"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CampaignCategory } from "@/types";

interface CampaignFiltersProps {
  categories: CampaignCategory[];
  provinces: string[];
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  search: string;
  category: CampaignCategory | "all";
  province: string | "all";
  campaignType: "all" | "institutional" | "individual";
  verified: "all" | "verified" | "pending";
}

export function CampaignFilters({
  categories,
  provinces,
  onFilterChange,
}: CampaignFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    province: "all",
    campaignType: "all",
    verified: "all",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters: FilterState = {
      search: "",
      category: "all",
      province: "all",
      campaignType: "all",
      verified: "all",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "search" && value !== "all"
  ).length;

  const categoryLabels: Record<CampaignCategory, string> = {
    deprem: "Deprem",
    sel: "Sel",
    yangin: "Yangın",
    "acil-tibbi": "Acil Tıbbi",
    gida: "Gıda",
    barinma: "Barınma",
    diger: "Diğer",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Kampanya ara..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="hidden md:flex gap-2">
          <Select
            value={filters.category}
            onValueChange={(value) =>
              handleFilterChange("category", value as CampaignCategory | "all")
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {categoryLabels[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.province}
            onValueChange={(value) => handleFilterChange("province", value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="İl" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm İller</SelectItem>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.campaignType}
            onValueChange={(value) =>
              handleFilterChange(
                "campaignType",
                value as "all" | "institutional" | "individual"
              )
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tür" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Türler</SelectItem>
              <SelectItem value="institutional">Kurumsal</SelectItem>
              <SelectItem value="individual">Bireysel</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.verified}
            onValueChange={(value) =>
              handleFilterChange(
                "verified",
                value as "all" | "verified" | "pending"
              )
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="verified">Doğrulanmış</SelectItem>
              <SelectItem value="pending">Beklemede</SelectItem>
            </SelectContent>
          </Select>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-2 text-muted-foreground"
            >
              <X className="h-4 w-4" />
              Temizle
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          className="md:hidden gap-2"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Filter className="h-4 w-4" />
          Filtreler
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-1 h-5 w-5 p-0 justify-center">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {showMobileFilters && (
        <div className="grid grid-cols-2 gap-3 p-4 bg-card rounded-xl border border-border">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Kategori</label>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                handleFilterChange("category", value as CampaignCategory | "all")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">İl</label>
            <Select
              value={filters.province}
              onValueChange={(value) => handleFilterChange("province", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="İl" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm İller</SelectItem>
                {provinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Tür</label>
            <Select
              value={filters.campaignType}
              onValueChange={(value) =>
                handleFilterChange(
                  "campaignType",
                  value as "all" | "institutional" | "individual"
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tür" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Türler</SelectItem>
                <SelectItem value="institutional">Kurumsal</SelectItem>
                <SelectItem value="individual">Bireysel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Durum</label>
            <Select
              value={filters.verified}
              onValueChange={(value) =>
                handleFilterChange(
                  "verified",
                  value as "all" | "verified" | "pending"
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="verified">Doğrulanmış</SelectItem>
                <SelectItem value="pending">Beklemede</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 flex gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={clearFilters} className="flex-1">
              Temizle
            </Button>
            <Button size="sm" onClick={() => setShowMobileFilters(false)} className="flex-1">
              Uygula
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}