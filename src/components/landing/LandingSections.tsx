"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Eye, Globe } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/20" />
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Monad Testnet Üzerinde Çalışıyor
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-foreground">Afet bağışları</span>
            <br />
            <span className="text-primary">artık kara kutu değil.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            AçıkKasa, afet ve acil ihtiyaç bağışlarını Monad üzerinde
            izlenebilir, şeffaf ve güvenli hale getirir. Her kuruşun
            nerede olduğunu anında görün.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/campaigns">
              <Button size="lg" className="gap-2 text-base px-8">
                Bağış Kampanyalarını Gör
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/campaigns">
              <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                <Zap className="h-5 w-5" />
                Test mUSDC Al
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none h-20 bottom-0 top-auto" />
          <div className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center"
                  >
                    <span className="text-xs font-medium">+{i}</span>
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-medium">15.420+ Bağışçı Katkı Sağladı</p>
                <p className="text-muted-foreground text-xs">Toplam 2.8M+ mUSDC bağışlandı</p>
              </div>
            </div>
            <div className="h-3 w-full bg-secondary/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 1.5, delay: 0.8 }}
                className="h-full bg-gradient-to-r from-primary to-secondary"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">65% fon hedefe ulaştı</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Eye,
    title: "Tam Şeffaflık",
    description: "Her bağış ve fon hareketi blockchain üzerinde takip edilebilir. Kara kutulara son.",
  },
  {
    icon: Shield,
    title: "Güvenli ve Doğrulanmış",
    description: "Tüm kampanyalar resmi kurumlar tarafından doğrulanır. Cüzdan doğrulaması zorunlu.",
  },
  {
    icon: Globe,
    title: "Monad Entegrasyonu",
    description: "Hızlı, düşük maliyetli ve EVM uyumlu işlem deneyimi.",
  },
];

const steps = [
  { number: "01", title: "Kampanya Oluşturulur", description: "Kurum veya birey yeni bir bağış kampanyası başlatır" },
  { number: "02", title: "Doğrulanır", description: "Kampanya yetkililer tarafından incelenir ve onaylanır" },
  { number: "03", title: "Bağış Yapılır", description: "Bağışçılar MON veya mUSDC ile destek olur" },
  { number: "04", title: "Tamamlanır", description: "Akıllı sözleşme kuralları ile fonlar aktarılır" },
];

export function ProblemSolutionSection() {
  return (
    <section className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bağışlarınızın <span className="text-primary">nerede</span> olduğunu hiç bilemiyordunuz
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Geleneksel bağış sistemlerinde, bağışlarınızın hedefe ulaşıp ulaşmadığını takip etmek
              neredeyse imkansızdı. AçıkKasa bu sorunu çözüyor.
            </p>
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6">
              <p className="text-destructive font-medium">
                ❌ Bağışların %40&apos;ı hedefe ulaşmıyordu
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Kayıtlar tutulmuyor, raporlar geç açıklanıyor, denetim yetersiz kalıyordu.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl p-8 shadow-lg border border-border"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              AçıkKasa Çözümü
            </div>
            <h3 className="text-2xl font-bold mb-6">
              Her bağış ve fon hareketi zincirde takip edilebilir
            </h3>
            <div className="space-y-4">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-background/50">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nasıl Çalışır?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AçıkKasa, bağış sürecini şeffaf ve güvenli hale getirmek için akıllı sözleşmeler kullanır
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border h-full">
                <div className="text-4xl font-bold text-primary/20 mb-4">{step.number}</div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustLayerSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            Güven Katmanı
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Neden AçıkKasa?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kurumsal doğrulama, şeffaf işlem geçmişi ve güvenli akıllı sözleşmeler ile bağışlarınız güvende
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Kurumsal Cüzdan Doğrulama</h3>
            <p className="text-muted-foreground">
              Tüm kurumsal kampanyalar, resmi kurumlara ait doğrulanmış cüzdanlar üzerinden yürütülür.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Eye className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Resmi Kayıt Referansı</h3>
            <p className="text-muted-foreground">
              Her kampanya, resmi izin ve referans numarası ile ilişkilendirilir ve doğrulanır.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Şeffaf İşlem Geçmişi</h3>
            <p className="text-muted-foreground">
              Tüm bağış ve transferler blockchain üzerinde herkes tarafından görüntülenebilir.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function MonadIntegrationSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/20 rounded-3xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                Monad Entegrasyonu
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Hızlı, Düşük Maliyetli, EVM Uyumlu
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Monad, modern blockchain teknolojisi ile bağış deneyimini yeniden tanımlıyor.
                Düşük işlem ücretleri ve yüksek hız ile bağışlarınız anında işleme girer.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 backdrop-blur rounded-xl p-4">
                  <p className="text-2xl font-bold text-primary">&lt;1₿</p>
                  <p className="text-sm text-muted-foreground">İşlem Ücreti</p>
                </div>
                <div className="bg-background/50 backdrop-blur rounded-xl p-4">
                  <p className="text-2xl font-bold text-primary">2000+</p>
                  <p className="text-sm text-muted-foreground">TPS Kapasitesi</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-card/80 backdrop-blur rounded-2xl p-6 shadow-xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary animate-pulse-glow" />
                  <div>
                    <p className="font-semibold">Blok Zinciri</p>
                    <p className="text-xs text-muted-foreground">Monad Testnet</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {["Bağış Alındı", "Doğrulandı", "Transfer Edildi"].map((status, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${i === 0 ? "bg-primary animate-pulse" : "bg-success"}`} />
                      <div className="flex-1 h-2 rounded-full bg-background" />
                      <span className="text-xs text-muted-foreground">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 md:p-12 text-center text-primary-foreground"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Şeffaf Bağış Yapmaya Bugün Başlayın
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            AçıkKasa ile bağışlarınızın her kuruşunu takip edin. Hemen bir kampanyaya destek olun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/campaigns">
              <Button size="lg" variant="secondary" className="gap-2">
                Kampanyaları İncele
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/create-campaign">
              <Button size="lg" variant="outline" className="gap-2 border-white/30 hover:bg-white/10">
                Kendi Kampanyanı Oluştur
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}