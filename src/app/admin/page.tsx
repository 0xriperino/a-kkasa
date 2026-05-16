"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Building2,
  User,
  FileText,
  CheckCircle,
  XCircle,
  BadgeCheck,
  AlertTriangle,
  Wallet,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { mockPendingCampaigns } from "@/data/mockData";
import { formatDate } from "@/lib/utils";

export default function AdminPage() {
  const [pendingCampaigns, setPendingCampaigns] = useState(mockPendingCampaigns);
  const [verifiedOrganizations, setVerifiedOrganizations] = useState<string[]>([]);
  const [walletInput, setWalletInput] = useState("");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const handleVerifyCampaign = async (campaignId: string) => {
    setActionInProgress(campaignId);
    // TODO: Connect to contract verifyCampaign(campaignId)
    setTimeout(() => {
      setPendingCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      setActionInProgress(null);
    }, 1500);
  };

  const handleRejectCampaign = async (campaignId: string) => {
    setActionInProgress(campaignId);
    // TODO: Connect to contract rejectCampaign(campaignId)
    setTimeout(() => {
      setPendingCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      setActionInProgress(null);
    }, 1500);
  };

  const handleVerifyOrganization = async () => {
    if (!walletInput.trim()) return;
    setActionInProgress("org_verify");
    // TODO: Connect to contract verifyOrganization(address)
    setTimeout(() => {
      setVerifiedOrganizations((prev) => [...prev, walletInput]);
      setWalletInput("");
      setActionInProgress(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-3 rounded-xl bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Yönetim Paneli</h1>
              <p className="text-muted-foreground">
                Kampanya doğrulama ve kurumsal onay yönetimi
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <Alert className="bg-secondary/30 border-secondary mb-8">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Yönetici notu:</strong> Bu panel fon yönetimi yapmaz. Yalnızca kampanyaları doğrular ve kurumsal cüzdanları onaylar.
            </AlertDescription>
          </Alert>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Doğrulama Bekleyen Kampanyalar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingCampaigns.length > 0 ? (
                    <div className="space-y-4">
                      {pendingCampaigns.map((campaign) => (
                        <div
                          key={campaign.id}
                          className="p-4 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="muted" className="text-xs">
                                  {campaign.campaignType === "institutional" ? (
                                    <>
                                      <Building2 className="h-3 w-3 mr-1" />
                                      Kurumsal
                                    </>
                                  ) : (
                                    <>
                                      <User className="h-3 w-3 mr-1" />
                                      Bireysel
                                    </>
                                  )}
                                </Badge>
                                <Badge variant="warning" className="text-xs">
                                  Beklemede
                                </Badge>
                              </div>
                              <h4 className="font-semibold mb-1">{campaign.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {campaign.province}, {campaign.district}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Resmi Referans</p>
                              <p className="font-mono">
                                {campaign.officialReference || "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Oluşturulma</p>
                              <p>{formatDate(campaign.createdAt)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Oluşturan Cüzdan</p>
                              <p className="font-mono text-xs break-all">
                                {campaign.creatorWallet}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Alıcı Cüzdan</p>
                              <p className="font-mono text-xs break-all">
                                {campaign.recipientWallet}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleVerifyCampaign(campaign.id)}
                              disabled={actionInProgress !== null}
                              size="sm"
                              variant="success"
                              className="flex-1 gap-2"
                            >
                              {actionInProgress === campaign.id ? (
                                "İşleniyor..."
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  Onayla
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => handleRejectCampaign(campaign.id)}
                              disabled={actionInProgress !== null}
                              size="sm"
                              variant="destructive"
                              className="flex-1 gap-2"
                            >
                              <XCircle className="h-4 w-4" />
                              Reddet
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Doğrulama bekleyen kampanya yok.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-primary" />
                    Kurumsal Cüzdan Doğrulama
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Cüzdan Adresi
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="0x..."
                        value={walletInput}
                        onChange={(e) => setWalletInput(e.target.value)}
                        className="font-mono"
                      />
                      <Button
                        onClick={handleVerifyOrganization}
                        disabled={
                          actionInProgress !== null || !walletInput.trim()
                        }
                        className="shrink-0 gap-2"
                      >
                        {actionInProgress === "org_verify" ? (
                          "İşleniyor..."
                        ) : (
                          <>
                            <Shield className="h-4 w-4" />
                            Doğrula
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {verifiedOrganizations.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-3">
                        Doğrulanmış Kurumlar
                      </p>
                      <div className="space-y-2">
                        {verifiedOrganizations.map((address) => (
                          <div
                            key={address}
                            className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-success/20">
                                <Wallet className="h-4 w-4 text-success" />
                              </div>
                              <span className="font-mono text-sm">{address}</span>
                            </div>
                            <Badge variant="success" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Doğrulandı
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Alert variant="warning" className="bg-warning/10 border-warning/20">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Yalnızca resmi kurumlara ait doğrulanmış cüzdanları onaylayın. Yanlış doğrulama platform güvenilirliğini zedeleyebilir.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}