"use client";

import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Building2,
  User,
  BadgeCheck,
  Clock,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DonationPanel } from "@/components/campaigns/DonationPanel";
import { TransactionHistory } from "@/components/campaigns/TransactionHistory";
import { mockCampaigns, mockTransactions } from "@/data/mockData";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/types";
import { calculateProgress, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function getDaysLeft(deadline: string): number {
  return Math.max(
    0,
    Math.ceil(
      (new Date(deadline).getTime() - new Date("2026-05-16").getTime()) / (1000 * 60 * 60 * 24)
    )
  );
}

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const campaign = mockCampaigns.find((c) => c.id === campaignId);

  if (!campaign) {
    notFound();
  }

  const campaignTransactions = mockTransactions.filter(
    (tx) => tx.campaignId === campaignId
  );
  const progress = calculateProgress(campaign.collectedMUSDC, campaign.targetMUSDC);
  const daysLeft = getDaysLeft(campaign.deadline);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary/5 to-background py-8">
        <div className="container mx-auto px-4">
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Kampanyalara Dön
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-8"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="muted">{CATEGORY_LABELS[campaign.category]}</Badge>
                {campaign.verified && (
                  <Badge variant="success" className="gap-1">
                    <BadgeCheck className="h-3 w-3" />
                    Doğrulanmış
                  </Badge>
                )}
                <Badge
                  variant={campaign.status === "active" ? "default" : "secondary"}
                >
                  {STATUS_LABELS[campaign.status]}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{campaign.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
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
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {daysLeft === 0 ? "Son gün" : `${daysLeft} gün kaldı`}
                </span>
              </div>

              <p className="text-lg text-muted-foreground">{campaign.description}</p>

              {campaign.officialReference && (
                <div className="mt-6 flex items-center gap-2 p-4 rounded-lg bg-secondary/30">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Resmi Referans Numarası</p>
                    <p className="text-sm text-muted-foreground">
                      {campaign.officialReference}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Finansal Durum</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-2xl font-bold text-primary">
                        {campaign.collectedMUSDC.toLocaleString("tr-TR")}
                      </p>
                      <p className="text-sm text-muted-foreground">Toplanan mUSDC</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-2xl font-bold">
                        {campaign.collectedMON}
                      </p>
                      <p className="text-sm text-muted-foreground">Toplanan MON</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-2xl font-bold">
                        {campaign.targetMUSDC.toLocaleString("tr-TR")}
                      </p>
                      <p className="text-sm text-muted-foreground">Hedef mUSDC</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-2xl font-bold">%{progress}</p>
                      <p className="text-sm text-muted-foreground">İlerleme</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kampanya İlerlemesi</span>
                    <span className="font-medium">%{progress}</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Kampanya Detayları</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground mb-1">Oluşturulma Tarihi</p>
                    <p className="font-medium">{formatDate(campaign.createdAt)}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground mb-1">Bitiş Tarihi</p>
                    <p className="font-medium">{formatDate(campaign.deadline)}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground mb-1">Oluşturan Cüzdan</p>
                    <p className="font-mono text-sm">{campaign.creatorWallet}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground mb-1">Alıcı Cüzdan</p>
                    <p className="font-mono text-sm">{campaign.recipientWallet}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <TransactionHistory transactions={campaignTransactions} />
              </div>
            </div>

            <div className="lg:w-96">
              <DonationPanel
                targetMUSDC={campaign.targetMUSDC}
                collectedMUSDC={campaign.collectedMUSDC}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}