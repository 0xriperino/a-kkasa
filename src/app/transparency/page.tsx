"use client";

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
import { mockTransactions, mockSummaryStats } from "@/data/mockData";
import { TRANSACTION_TYPE_LABELS, Transaction } from "@/types";
import { formatDate, formatAddress, formatExplorerUrl } from "@/lib/utils";
import { ExternalLink, Heart, Users, TrendingUp, Activity } from "lucide-react";

export default function TransparencyPage() {
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
              AçıkKasa&apos;daki tüm önemli hareketleri şeffaf bir şekilde görüntüleyin
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                        {mockSummaryStats.totalDonations.toLocaleString("tr-TR")}
                      </p>
                      <p className="text-sm text-muted-foreground">Toplam Bağış</p>
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
                        {mockSummaryStats.totalDistributed.toLocaleString("tr-TR")}
                      </p>
                      <p className="text-sm text-muted-foreground">Dağıtılan Fon</p>
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
                    <div className="p-3 rounded-xl bg-secondary/20">
                      <Users className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {mockSummaryStats.numberOfDonors.toLocaleString("tr-TR")}
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
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-warning/10">
                      <Activity className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {mockSummaryStats.recentTransactions}
                      </p>
                      <p className="text-sm text-muted-foreground">Son İşlemler</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>İşlem Tablosu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">İşlem Türü</TableHead>
                        <TableHead>Kampanya</TableHead>
                        <TableHead>Token</TableHead>
                        <TableHead className="text-right">Miktar</TableHead>
                        <TableHead>Gönderen</TableHead>
                        <TableHead>Alan</TableHead>
                        <TableHead className="w-[180px]">Tarih</TableHead>
                        <TableHead className="w-[100px]">Explorer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            <Badge
                              variant={getTransactionColor(tx.type)}
                              className="text-xs"
                            >
                              {TRANSACTION_TYPE_LABELS[tx.type]}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {tx.campaignTitle}
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
                              href={formatExplorerUrl(tx.txHash)}
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
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}