"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Users,
  Wallet,
  Shield,
  BarChart3,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { WalletConnect } from "@/components/web3/WalletConnect";

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase();

const publicNavLinks = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/campaigns", label: "Kampanyalar", icon: Users },
  { href: "/general-vault", label: "Genel Kasa", icon: Wallet },
  { href: "/transparency", label: "Şeffaflık", icon: BarChart3 },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { address } = useAccount();
  const isAdmin = address?.toLowerCase() === ADMIN_WALLET;

  const navLinks = isAdmin
    ? [...publicNavLinks, { href: "/admin", label: "Yönetim", icon: Shield }]
    : publicNavLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/logo.svg"
              alt="Mon Bağış"
              className="h-10 w-10 group-hover:scale-105 transition-transform duration-200"
            />
            <span className="text-xl font-bold tracking-tight text-foreground">
              Mon Bağış
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2",
                      isActive && "bg-primary/10 text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link href="/create-campaign" className="hidden md:block">
              <Button size="sm" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Kampanya Oluştur
              </Button>
            </Link>

            <div className="hidden md:block">
              <WalletConnect />
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border/50 bg-background"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2",
                      isActive && "bg-primary/10 text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
            <Link href="/create-campaign" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-start gap-2 mt-2">
                <PlusCircle className="h-4 w-4" />
                Kampanya Oluştur
              </Button>
            </Link>
            <div className="mt-2">
              <WalletConnect />
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
}