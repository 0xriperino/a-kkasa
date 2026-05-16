"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TRANSACTION_TYPE_LABELS, Transaction } from "@/types";
import { formatDate, formatAddress } from "@/lib/utils";
import { ExternalLink, Heart, Users, TrendingUp, Activity } from "lucide-react";
import { supabase } from "@/../lib/supabase/client";

interface DbTransaction {
  id: string;
  campaign_id: string | null;
  chain_campaign_id: number | null;
  tx_hash: string;
  type: string;
  token: string;
  amount: string;
  from_address: string;
  to_address: string;
  explorer_url: string;
  created_at: string;
}

export default function TransparencyPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({ totalDonations: 0, uniqueDonors: 0, txCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error || !data) {
        setLoading(false);
        return;
      }

      const mapped: Transaction[] = (data as DbTransaction[]).map((row) => ({
        id: row.id,
        campaignId: row.campaign_id || "",
        campaignTitle: "",
        type: row.type as Transaction["type"],
        token: row.token as "MUSDC" | "MON",
        amount: Number(row.amount),
        sender: row.from_address,
        receiver: row.to_address,
        txHash: row.tx_hash,
        timestamp: row.created_at,
        status: "confirmed" as const,
      }));

      setTransactions(mapped);

      const totalDonations = mapped
        .filter((tx) => tx.type === "donation")
        .reduce((sum, tx) => sum + tx.amount, 0);
      const uniqueDonors = new Set(mapped.filter((tx) => tx.type === "donation").map((tx) => tx.sender)).size;

      setStats({
        totalDonations,
        uniqueDonors,
        txCount: mapped.length,
      });

      setLoading(false);
    }
    fetchData();
  }, []);

  const getTransactionColor = (type: Transaction["type"]) => {
    switch (type) {
      case "donation":
        return "default";
      case "campaign_verification":
        return "success";
      case "fund_transfer":
        return "secondary";
      case "transfer_to_general_vault":
        return "warning";
      case "transfer_from_general_vault":
        return "default";
      default:
        return "muted";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Veriler yükleniyor...</p>
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
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Şeffaflık</h1>
            <p className="text-muted-foreground">
              Mon Bağış&apos;daki tüm önemli hareketleri şeffaf bir şekilde görüntüleyin
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {stats.totalDonations.toLocaleString("tr-TR")}
                      </p>
                      <p className="text-sm text-muted-foreground">Toplam Bağış (mUSDC + MON)</p>
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
                      <Users className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {stats.uniqueDonors}
                      </p>
                      <p className="text-sm text-muted-foreground">Bağışçı Sayısı</p>
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
                      <Activity className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {stats.txCount}
                      </p>
                      <p className="text-sm text-muted-foreground">Toplam İşlem</p>
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
                <CardTitle>İşlem Geçmişi</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz işlem kaydı bulunmuyor.</p>
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>İşlem Türü</TableHead>
                          <TableHead>Token</TableHead>
                          <TableHead className="text-right">Miktar</TableHead>
                          <TableHead>Gönderen</TableHead>
                          <TableHead>Alan</TableHead>
                          <TableHead>Tarih</TableHead>
                          <TableHead>Explorer</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell>
                              <Badge
                                variant={getTransactionColor(tx.type)}
                                className="text-xs"
                              >
                                {TRANSACTION_TYPE_LABELS[tx.type] || tx.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{tx.token}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {tx.amount > 0
                                ? tx.amount.toLocaleString("tr-TR")
                                : "-"}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {formatAddress(tx.sender)}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {formatAddress(tx.receiver)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(tx.timestamp)}
                            </TableCell>
                            <TableCell>
                              <a
                                href={`https://testnet.monadscan.com/tx/${tx.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                              >
                                Görüntüle
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
