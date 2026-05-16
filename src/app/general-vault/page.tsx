"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  Trophy,
  Vote,
  Info,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { mockVotingCampaigns, mockVaultBalance } from "@/data/mockData";
import { CATEGORY_LABELS } from "@/types";

export default function GeneralVaultPage() {
  const [votedCampaigns, setVotedCampaigns] = useState<Set<string>>(new Set());
  const [isVoting, setIsVoting] = useState<string | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const leadingCampaign = mockVotingCampaigns.find((c) => c.isLeading);
  const totalVotes = mockVotingCampaigns.reduce((sum, c) => sum + c.voteCount, 0);

  const handleVote = async (campaignId: string) => {
    setIsVoting(campaignId);
    // TODO: Connect to contract voteForGeneralVaultAllocation(campaignId)
    setTimeout(() => {
      setIsVoting(null);
      setVotedCampaigns((prev) => new Set([...prev, campaignId]));
    }, 1500);
  };

  const handleTransfer = async () => {
    if (!leadingCampaign) return;
    setIsTransferring(true);
    setTxHash(null);
    // TODO: Connect to contract executeGeneralVaultAllocation(campaignId)
    setTimeout(() => {
      setIsTransferring(false);
      setTxHash("0x" + Math.random().toString(16).slice(2) + "..." + Math.random().toString(16).slice(2));
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Genel Yardım Kasası</h1>
            <p className="text-muted-foreground">
              Hedefe ulaşmayan kampanyalardan gelen bağışların yönetimi
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Wallet className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {mockVaultBalance.mon.toLocaleString("tr-TR")}
                      </p>
                      <p className="text-sm text-muted-foreground">MON Bakiye</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-success/10">
                      <TrendingUp className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {mockVaultBalance.musdc.toLocaleString("tr-TR")}
                      </p>
                      <p className="text-sm text-muted-foreground">mUSDC Bakiye</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-warning/10">
                      <Vote className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalVotes}</p>
                      <p className="text-sm text-muted-foreground">Toplam Oy</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Alert className="bg-secondary/30 border-secondary">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Hedefe ulaşmayan kampanyalardaki bağışlar kaybolmaz.</strong> AçıkKasa Genel Yardım Kasası&apos;na aktarılır ve bağışçılar bu fonun hangi doğrulanmış kampanyaya aktarılacağına oy verir.
              </AlertDescription>
            </Alert>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Topluluk Oylaması</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {mockVotingCampaigns.map((campaign) => {
                const votePercentage = Math.round(
                  (campaign.voteCount / totalVotes) * 100
                );
                return (
                  <Card
                    key={campaign.campaignId}
                    className={`relative ${
                      campaign.isLeading
                        ? "border-primary shadow-lg shadow-primary/10"
                        : ""
                    }`}
                  >
                    {campaign.isLeading && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge variant="warning" className="gap-1">
                          <Trophy className="h-3 w-3" />
                          Lider
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="muted" className="text-xs">
                              {CATEGORY_LABELS[campaign.category]}
                            </Badge>
                            {campaign.verified && (
                              <Badge variant="success" className="text-xs">
                                Doğrulanmış
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg leading-tight">
                            {campaign.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {campaign.province}, {campaign.district}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Oy</span>
                          <span className="font-medium">
                            {campaign.voteCount} (%{votePercentage})
                          </span>
                        </div>
                        <Progress value={votePercentage} className="h-2" />
                      </div>

                      <Button
                        onClick={() => handleVote(campaign.campaignId)}
                        disabled={
                          isVoting !== null ||
                          votedCampaigns.has(campaign.campaignId)
                        }
                        variant={votedCampaigns.has(campaign.campaignId) ? "secondary" : "outline"}
                        className="w-full gap-2"
                      >
                        {votedCampaigns.has(campaign.campaignId) ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Oy Verildi
                          </>
                        ) : (
                          <>
                            <Vote className="h-4 w-4" />
                            {isVoting === campaign.campaignId
                              ? "İşleniyor..."
                              : "Oy Ver"}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {leadingCampaign && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Genel Kasadan Aktarım
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Bu işlem Genel Yardım Kasası fonlarını topluluk oylamasında lider olan doğrulanmış kampanyaya aktarır.
                      </p>
                    </div>
                    <Button
                      onClick={handleTransfer}
                      disabled={isTransferring}
                      className="gap-2"
                    >
                      {isTransferring ? (
                        "Aktarılıyor..."
                      ) : (
                        <>
                          <TrendingUp className="h-4 w-4" />
                          Fonu Aktar
                        </>
                      )}
                    </Button>
                  </div>

                  {txHash && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 bg-success/10 border border-success/20 rounded-lg p-4"
                    >
                      <p className="text-sm font-medium text-success mb-2">Aktarım başarılı!</p>
                      <p className="text-xs text-muted-foreground break-all">
                        İşlem Hash: {txHash}
                      </p>
                      <a
                        href={`https://testnet.monadelabs.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Explorer&apos;da Görüntüle →
                      </a>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}