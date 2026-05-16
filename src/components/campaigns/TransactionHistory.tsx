"use client";

import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Transaction, TRANSACTION_TYPE_LABELS } from "@/types";
import { formatDate, formatAddress } from "@/lib/utils";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">İşlem Geçmişi</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {tx.token === "MUSDC" ? "USDC" : "MON"}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={getTransactionColor(tx.type)}
                        className="text-xs"
                      >
                        {TRANSACTION_TYPE_LABELS[tx.type]}
                      </Badge>
                      <Badge
                        variant={tx.status === "confirmed" ? "success" : "secondary"}
                        className="text-xs"
                      >
                        {tx.status === "confirmed" ? "Onaylandı" : "Beklemede"}
                      </Badge>
                    </div>
                    <p className="text-sm">
                      {tx.amount > 0 && (
                        <>
                          <span className="font-medium">
                            {tx.amount.toLocaleString("tr-TR")} {tx.token}
                          </span>
                          <span className="text-muted-foreground"> bağışladı</span>
                        </>
                      )}
                      {tx.amount === 0 && (
                        <span className="text-muted-foreground">
                          {TRANSACTION_TYPE_LABELS[tx.type]}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(tx.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-muted-foreground">
                    {formatAddress(tx.sender)}
                  </p>
                  <a
                    href={`https://testnet.monadscan.com/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Explorer
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Henüz işlem bulunmuyor.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}