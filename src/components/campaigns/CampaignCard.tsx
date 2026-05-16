"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Building2, User, BadgeCheck, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Campaign, CATEGORY_LABELS } from "@/types";
import { cn, calculateProgress } from "@/lib/utils";

interface CampaignCardProps {
  campaign: Campaign;
}

function getDaysLeft(deadline: string): number {
  return Math.max(
    0,
    Math.ceil(
      (new Date(deadline).getTime() - new Date("2026-05-16").getTime()) / (1000 * 60 * 60 * 24)
    )
  );
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = calculateProgress(campaign.collectedMUSDC, campaign.targetMUSDC);
  const daysLeft = getDaysLeft(campaign.deadline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col hover:shadow-lg hover:border-primary/30 transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="muted" className="text-xs">
                  {CATEGORY_LABELS[campaign.category]}
                </Badge>
                {campaign.verified && (
                  <Badge variant="success" className="gap-1 text-xs">
                    <BadgeCheck className="h-3 w-3" />
                    Doğrulanmış
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                {campaign.title}
              </h3>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {campaign.province}, {campaign.district}
              </span>
              <span className="flex items-center gap-1">
                {campaign.campaignType === "institutional" ? (
                  <>
                    <Building2 className="h-4 w-4" />
                    Kurumsal
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4" />
                    Bireysel
                  </>
                )}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Toplanan</span>
                <span className="font-medium">
                  {campaign.collectedMUSDC.toLocaleString("tr-TR")} mUSDC
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>%{progress}</span>
                <span>
                  Hedef: {campaign.targetMUSDC.toLocaleString("tr-TR")} mUSDC
                </span>
              </div>
            </div>

            {campaign.collectedMON > 0 && (
              <div className="flex justify-between text-sm bg-secondary/30 rounded-lg p-2">
                <span className="text-muted-foreground">MON ile bağış</span>
                <span className="font-medium">{campaign.collectedMON} MON</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0 flex gap-2">
          <Link href={`/campaigns/${campaign.id}`} className="flex-1">
            <Button className="w-full gap-2">
              Detayları Gör
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
          <Badge
            variant={campaign.status === "active" ? "default" : "secondary"}
            className={cn(
              "flex items-center gap-1",
              daysLeft <= 7 && campaign.status === "active" && "bg-warning"
            )}
          >
            <Clock className="h-3 w-3" />
            {daysLeft === 0 ? "Son gün" : `${daysLeft} gün`}
          </Badge>
        </CardFooter>
      </Card>
    </motion.div>
  );
}