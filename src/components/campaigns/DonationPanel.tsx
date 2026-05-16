"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Zap, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DonationPanelProps {
  targetMUSDC: number;
  collectedMUSDC: number;
}

export function DonationPanel({
  targetMUSDC,
  collectedMUSDC,
}: DonationPanelProps) {
  const [monAmount, setMonAmount] = useState("");
  const [musdcAmount, setMusdcAmount] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMONDonation = async () => {
    if (!monAmount || parseFloat(monAmount) <= 0) {
      setError("Geçerli bir MON miktarı girin.");
      return;
    }
    setIsPending(true);
    setError(null);
    setTxHash(null);
    // TODO: Connect to contract donateWithMON(campaignId)
    // Simulating transaction
    setTimeout(() => {
      setIsPending(false);
      setTxHash("0x" + Math.random().toString(16).slice(2) + "..." + Math.random().toString(16).slice(2));
    }, 2000);
  };

  const handleMUSDCDonation = async () => {
    if (!musdcAmount || parseFloat(musdcAmount) <= 0) {
      setError("Geçerli bir mUSDC miktarı girin.");
      return;
    }
    setIsPending(true);
    setError(null);
    setTxHash(null);
    // TODO: Connect to MockUSDC approve first, then donateWithMUSDC(campaignId, amount)
    setTimeout(() => {
      setIsPending(false);
      setTxHash("0x" + Math.random().toString(16).slice(2) + "..." + Math.random().toString(16).slice(2));
    }, 2000);
  };

  const progress = Math.round((collectedMUSDC / targetMUSDC) * 100);

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Bağış Yap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Toplanan (mUSDC)</span>
            <span className="font-medium">{collectedMUSDC.toLocaleString("tr-TR")}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Hedef: {targetMUSDC.toLocaleString("tr-TR")} mUSDC (%{progress})
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">MON ile Bağış</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.00"
                value={monAmount}
                onChange={(e) => setMonAmount(e.target.value)}
                min="0"
                step="0.01"
              />
              <Button
                onClick={handleMONDonation}
                disabled={isPending}
                className="shrink-0"
              >
                {isPending ? "İşleniyor..." : "Bağışla"}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">veya</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">mUSDC ile Bağış</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.00"
                value={musdcAmount}
                onChange={(e) => setMusdcAmount(e.target.value)}
                min="0"
                step="1"
              />
              <Button
                onClick={handleMUSDCDonation}
                disabled={isPending}
                className="shrink-0"
              >
                {isPending ? "İşleniyor..." : "Bağışla"}
              </Button>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full gap-2" onClick={() => {}}>
          <Zap className="h-4 w-4" />
          Test mUSDC Al
        </Button>

        <Alert variant="warning" className="bg-warning/10 border-warning/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Kampanya hedefe ulaşmazsa bağışlar AçıkKasa Genel Yardım Kasası&apos;na aktarılır.
          </AlertDescription>
        </Alert>

        {txHash && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-success/10 border border-success/20 rounded-lg p-4"
          >
            <p className="text-sm font-medium text-success mb-2">Bağış başarılı!</p>
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

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}