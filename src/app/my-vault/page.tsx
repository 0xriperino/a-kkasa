"use client";

import { motion } from "framer-motion";
import { Wallet, History, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCampaigns } from "@/data/mockData";
import { formatDate } from "@/lib/utils";

export default function MyVaultPage() {
  const myDonations = [
    {
      id: "don1",
      campaign: mockCampaigns[0],
      amount: 500,
      token: "MUSDC",
      date: "2026-03-10",
    },
    {
      id: "don2",
      campaign: mockCampaigns[1],
      amount: 1.5,
      token: "MON",
      date: "2026-03-08",
    },
  ];

  const totalDonatedMUSDC = myDonations
    .filter((d) => d.token === "MUSDC")
    .reduce((sum, d) => sum + d.amount, 0);
  const totalDonatedMON = myDonations
    .filter((d) => d.token === "MON")
    .reduce((sum, d) => sum + d.amount, 0);

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
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Kasa Hesabım</h1>
              <p className="text-muted-foreground">
                Bağışlarınızı ve işlem geçmişinizi görüntüleyin
              </p>
            </div>
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
                        {totalDonatedMUSDC.toLocaleString("tr-TR")}
                      </p>
                      <p className="text-sm text-muted-foreground">mUSDC Bağışlandı</p>
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
                      <Heart className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalDonatedMON}</p>
                      <p className="text-sm text-muted-foreground">MON Bağışlandı</p>
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
                      <History className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{myDonations.length}</p>
                      <p className="text-sm text-muted-foreground">Toplam Bağış</p>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Bağış Geçmişi
                </CardTitle>
              </CardHeader>
              <CardContent>
                {myDonations.length > 0 ? (
                  <div className="space-y-4">
                    {myDonations.map((donation) => (
                      <div
                        key={donation.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-primary/10">
                            <Heart className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              {donation.campaign.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(donation.date)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {donation.token === "MUSDC"
                              ? `${donation.amount.toLocaleString("tr-TR")} ${donation.token}`
                              : `${donation.amount} ${donation.token}`}
                          </p>
                          <Badge variant="success" className="text-xs">
                            Başarılı
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz bağış yapmadınız.</p>
                    <p className="text-sm mt-2">
                      Kampanyalar sayfasından bağış yapabilirsiniz.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}