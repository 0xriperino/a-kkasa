"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateCampaignPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Implement campaign creation with contract
    setTimeout(() => setIsSubmitting(false), 2000);
  };

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
              <PlusCircle className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Kampanya Oluştur</h1>
              <p className="text-muted-foreground">
                Yeni bir bağış kampanyası başlatın
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Kampanya Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Kampanya Başlığı
                    </label>
                    <Input placeholder="Kampanya başlığını girin" required />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Açıklama
                    </label>
                    <textarea
                      className="flex min-h-[120px] w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-sm shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Kampanyonuzu detaylı bir şekilde açıklayın..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">İl</label>
                      <Input placeholder="İl seçin" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">İlçe</label>
                      <Input placeholder="İlçe seçin" required />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Kategori</label>
                    <select
                      className="flex h-11 w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-sm shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Kategori seçin</option>
                      <option value="deprem">Deprem</option>
                      <option value="sel">Sel</option>
                      <option value="yangin">Yangın</option>
                      <option value="acil-tibbi">Acil Tıbbi</option>
                      <option value="gida">Gıda</option>
                      <option value="barinma">Barınma</option>
                      <option value="diger">Diğer</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Hedef Miktar (mUSDC)
                    </label>
                    <Input
                      type="number"
                      placeholder="100000"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Bitiş Tarihi
                    </label>
                    <Input type="date" required />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full gap-2"
                      size="lg"
                    >
                      {isSubmitting ? (
                        "Gönderiliyor..."
                      ) : (
                        <>
                          <PlusCircle className="h-5 w-5" />
                          Kampanya Oluştur
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Kampanyanız doğrulama için incelenecektir. Kurumsal kampanyalar için resmi referans numarası gereklidir.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}