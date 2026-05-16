"use client";

import { useChainId } from "wagmi";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { monadTestnet } from "wagmi/chains";

const WRONG_NETWORK_ERROR = "Yanlış Ağ";
const MONAD_TESTNET_NAME = "Monad Testnet";

export function NetworkWarning() {
  const chainId = useChainId();
  const isWrongNetwork = chainId !== monadTestnet.id;

  if (!isWrongNetwork) return null;

  return (
    <Alert variant="warning" className="mx-4 mt-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <div>
          <strong>{WRONG_NETWORK_ERROR}:</strong> Lütfen{" "}
          <strong>{MONAD_TESTNET_NAME}</strong> ağına geçin.
        </div>
        <Button size="sm" variant="outline" className="shrink-0">
          Ağı Değiştir
        </Button>
      </AlertDescription>
    </Alert>
  );
}