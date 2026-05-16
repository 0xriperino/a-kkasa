"use client";

import { useAccount } from "wagmi";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WalletConnect } from "./WalletConnect";

export function WalletWarning() {
  const { isConnected } = useAccount();

  if (isConnected) return null;

  return (
    <Alert variant="warning" className="mx-4 mt-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <div>
          <strong>Cüzdan Bağlı Değil:</strong> Bağış yapabilmek için cüzdanınızı bağlayın.
        </div>
        <WalletConnect />
      </AlertDescription>
    </Alert>
  );
}