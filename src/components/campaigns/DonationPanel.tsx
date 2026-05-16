"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Zap, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { parseEther, parseUnits } from "viem";
import {
  MOCK_USDC_ADDRESS,
  MOCK_USDC_ABI,
  ACIKKASA_VAULT_ADDRESS,
  ACIKKASA_VAULT_ABI,
} from "@/lib/contracts";
import { supabase } from "@/../lib/supabase/client";

interface DonationPanelProps {
  targetMUSDC: number;
  collectedMUSDC: number;
  campaignId?: number;
  campaignDbId?: string;
  onDonationSuccess?: () => void;
}

export function DonationPanel({
  targetMUSDC,
  collectedMUSDC,
  campaignId = 0,
  campaignDbId,
  onDonationSuccess,
}: DonationPanelProps) {
  const { isConnected, address } = useAccount();
  const [monAmount, setMonAmount] = useState("");
  const [musdcAmount, setMusdcAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"idle" | "approving" | "donating-musdc" | "donating-mon">("idle");
  const savedTxRef = useRef<string | null>(null);

  const {
    writeContract: writeFaucet,
    data: faucetHash,
    isPending: faucetPending,
  } = useWriteContract();

  const { isSuccess: faucetConfirmed } = useWaitForTransactionReceipt({
    hash: faucetHash,
  });

  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: approvePending,
  } = useWriteContract();

  const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const {
    writeContract: writeDonation,
    data: donationHash,
    isPending: donationPending,
  } = useWriteContract();

  const { isSuccess: donationConfirmed } = useWaitForTransactionReceipt({
    hash: donationHash,
  });

  // Step 2 of mUSDC: after approve confirmed, send donation
  useEffect(() => {
    if (approveConfirmed && step === "approving") {
      setStep("donating-musdc");
      writeDonation({
        address: ACIKKASA_VAULT_ADDRESS,
        abi: ACIKKASA_VAULT_ABI,
        functionName: "donateWithMUSDC",
        args: [BigInt(campaignId), parseUnits(musdcAmount, 6)],
      });
    }
  }, [approveConfirmed, step]);

  // Save tx to Supabase after donation confirmed
  useEffect(() => {
    if (donationConfirmed && donationHash && address && donationHash !== savedTxRef.current) {
      savedTxRef.current = donationHash;

      const token = step === "donating-musdc" ? "MUSDC" : "MON";
      const amount = step === "donating-musdc" ? parseFloat(musdcAmount) : parseFloat(monAmount);

      saveTxToSupabase(donationHash, token, amount);
      setStep("idle");
      onDonationSuccess?.();
    }
  }, [donationConfirmed, donationHash]);

  async function saveTxToSupabase(txHash: string, token: string, amount: number) {
    if (!address) return;
    await supabase.from("transactions").insert({
      campaign_id: campaignDbId || null,
      chain_campaign_id: campaignId,
      tx_hash: txHash,
      type: "donation",
      token,
      amount,
      from_address: address,
      to_address: ACIKKASA_VAULT_ADDRESS,
      explorer_url: `https://testnet.monadscan.com/tx/${txHash}`,
    });
  }

  const handleFaucet = () => {
    if (!isConnected) {
      setError("Lütfen önce cüzdanınızı bağlayın.");
      return;
    }
    setError(null);
    writeFaucet({
      address: MOCK_USDC_ADDRESS,
      abi: MOCK_USDC_ABI,
      functionName: "faucet",
    });
  };

  const handleMONDonation = () => {
    if (!isConnected) {
      setError("Lütfen önce cüzdanınızı bağlayın.");
      return;
    }
    if (!monAmount || parseFloat(monAmount) <= 0) {
      setError("Geçerli bir MON miktarı girin.");
      return;
    }
    setError(null);
    setStep("donating-mon");
    writeDonation({
      address: ACIKKASA_VAULT_ADDRESS,
      abi: ACIKKASA_VAULT_ABI,
      functionName: "donateWithMON",
      args: [BigInt(campaignId)],
      value: parseEther(monAmount),
    });
  };

  const handleMUSDCDonation = () => {
    if (!isConnected) {
      setError("Lütfen önce cüzdanınızı bağlayın.");
      return;
    }
    if (!musdcAmount || parseFloat(musdcAmount) <= 0) {
      setError("Geçerli bir mUSDC miktarı girin.");
      return;
    }
    setError(null);
    setStep("approving");
    writeApprove({
      address: MOCK_USDC_ADDRESS,
      abi: MOCK_USDC_ABI,
      functionName: "approve",
      args: [ACIKKASA_VAULT_ADDRESS, parseUnits(musdcAmount, 6)],
    });
  };

  const rawPct = targetMUSDC > 0 ? (collectedMUSDC / targetMUSDC) * 100 : 0;
  const progress = rawPct > 0 && rawPct < 1 ? 1 : Math.min(Math.round(rawPct), 100);
  const isPending = donationPending || faucetPending || approvePending;

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
                {donationPending && step === "donating-mon" ? "İşleniyor..." : "Bağışla"}
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
                {approvePending ? "Onay..." : donationPending && step === "donating-musdc" ? "Bağış..." : "Bağışla"}
              </Button>
            </div>
            {step === "approving" && (
              <p className="text-xs text-muted-foreground mt-1">
                Adım 1/2: Token onayı bekleniyor...
              </p>
            )}
            {step === "donating-musdc" && (
              <p className="text-xs text-muted-foreground mt-1">
                Adım 2/2: Bağış işlemi gönderiliyor...
              </p>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={handleFaucet}
          disabled={faucetPending}
        >
          <Zap className="h-4 w-4" />
          {faucetPending ? "Talep ediliyor..." : faucetConfirmed ? "1000 mUSDC alındı!" : "Test mUSDC Al"}
        </Button>

        <Alert variant="warning" className="bg-warning/10 border-warning/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Kampanya hedefe ulaşmazsa bağışlar Mon Bağış Genel Yardım Kasası&apos;na aktarılır.
          </AlertDescription>
        </Alert>

        {donationConfirmed && donationHash && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-success/10 border border-success/20 rounded-lg p-4"
          >
            <p className="text-sm font-medium text-success mb-2">Bağış başarılı!</p>
            <p className="text-xs text-muted-foreground break-all">
              İşlem Hash: {donationHash}
            </p>
            <a
              href={`https://testnet.monadscan.com/tx/${donationHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Explorer&apos;da Görüntüle →
            </a>
          </motion.div>
        )}

        {faucetConfirmed && faucetHash && !donationHash && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-success/10 border border-success/20 rounded-lg p-4"
          >
            <p className="text-sm font-medium text-success mb-2">1000 mUSDC cüzdanınıza eklendi!</p>
            <p className="text-xs text-muted-foreground break-all">
              İşlem Hash: {faucetHash}
            </p>
            <a
              href={`https://testnet.monadscan.com/tx/${faucetHash}`}
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
