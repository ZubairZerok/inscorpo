"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Search, Filter, Sparkles, Check, ChevronRight, 
  Bookmark, Award, Star, BookOpen, AlertCircle, Building2, ShieldCheck, Zap,
  Gift, CreditCard, Smartphone, Building, X, FileText, CheckCircle2, Download, Printer
} from "lucide-react";
import { useUser } from "@/components/providers/user-context";
import { cn } from "@/lib/utils";
import { triggerFileDownload, SAMPLE_CASE_PLAYBOOK_TEXT } from "@/lib/utils/download-helper";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface MarketplaceItem {
  id: string;
  title: string;
  category: "B2B Enterprise" | "XP Swag & Rewards" | "Templates & Books" | "Exam Vouchers";
  description: string;
  price: string;
  numericPriceBDT: number;
  xpCost: number;
  rating: number;
  badge: string;
  icon: string;
}

const marketplaceItems: MarketplaceItem[] = [
  {
    id: "b2b-tier-1",
    title: "Applied AI & Automation (Public Seat)",
    category: "B2B Enterprise",
    description: "4-week executive intensive covering n8n, Bangla OCR, bKash webhooks, NGOAB FD-7 reporting, and Power BI control towers.",
    price: "৳25,000",
    numericPriceBDT: 25000,
    xpCost: 25000,
    rating: 5.0,
    badge: "Executive Seat",
    icon: "⚡"
  },
  {
    id: "b2b-tier-2",
    title: "Corporate Batch (Up to 15 Seats)",
    category: "B2B Enterprise",
    description: "Private NDA-protected corporate cohort for your finance, RMG, or M&E team using your company's live anonymized workflow data.",
    price: "৳250,000",
    numericPriceBDT: 250000,
    xpCost: 150000,
    rating: 5.0,
    badge: "Private Batch",
    icon: "🏢"
  },
  {
    id: "insyt-tech-swag-pack",
    title: "Official INSYT Tech Swag Pack (T-Shirt + Stickers)",
    category: "XP Swag & Rewards",
    description: "Premium cotton tech t-shirt with custom printed INSYT Operator decals + laptop sticker pack.",
    price: "৳1,200",
    numericPriceBDT: 1200,
    xpCost: 15000,
    rating: 4.9,
    badge: "Popular Swag",
    icon: "👕"
  },
  {
    id: "mnc-mentoring-session",
    title: "1-on-1 CV Review & Mock Interview with MNC Director",
    category: "XP Swag & Rewards",
    description: "Private 45-minute coaching session with a Management Trainee alumnus or HR Lead from top FMCG/Telco companies.",
    price: "৳3,500",
    numericPriceBDT: 3500,
    xpCost: 25000,
    rating: 5.0,
    badge: "Exclusive Mentoring",
    icon: "🤝"
  },
  {
    id: "premium-resume-pack",
    title: "Executive Resume & CV Templates",
    category: "Templates & Books",
    description: "Premium, ATS-optimized Word and PDF templates designed specifically for management trainee and banking jobs.",
    price: "৳450",
    numericPriceBDT: 450,
    xpCost: 2000,
    rating: 4.8,
    badge: "Best Seller",
    icon: "📄"
  },
  {
    id: "bangladesh-bank-guidebook",
    title: "Bangladesh Bank AD Blueprint Guidebook",
    category: "Templates & Books",
    description: "The complete guidebook outlining syllabus weightages, focus writing topics, and monetary formulas.",
    price: "৳350",
    numericPriceBDT: 350,
    xpCost: 1500,
    rating: 4.9,
    badge: "Guidebook",
    icon: "📘"
  },
  {
    id: "ielts-voucher-discount",
    title: "British Council IELTS Exam Voucher",
    category: "Exam Vouchers",
    description: "Get 10% off your official IELTS registration fee at British Council with this exam voucher code.",
    price: "৳1,500",
    numericPriceBDT: 1500,
    xpCost: 8000,
    rating: 4.9,
    badge: "Limited Voucher",
    icon: "🎫"
  }
];

type PaymentGateway = "bkash" | "nagad" | "rocket" | "upay" | "bank" | "stripe" | "xp";

export default function MarketplacePage() {
  const { state, addXP, buyItem } = useUser();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);

  // Custom Alert Dialogue state
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    type?: "error" | "warning" | "info" | "success" | "xp";
    requiredXP?: number;
    currentXP?: number;
    actionText?: string;
    onAction?: () => void;
  }>({
    isOpen: false,
    message: "",
  });

  // Checkout State
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>("bkash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<{ invoiceId: string; gateway: string } | null>(null);

  // Form Inputs for Payment
  const [mfsPhone, setMfsPhone] = useState("");
  const [mfsTrxId, setMfsTrxId] = useState("");
  const [bankRef, setBankRef] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const categories = ["All", "B2B Enterprise", "XP Swag & Rewards", "Templates & Books", "Exam Vouchers"];

  const filteredItems = marketplaceItems.filter((item) => {
    const matchesCat = activeCategory === "All" ? true : item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenCheckout = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setPaymentSuccess(null);
    setSelectedGateway("bkash");
    setMfsPhone("");
    setMfsTrxId("");
    setBankRef("");
    setCardNumber("");
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (selectedGateway === "xp") {
      if (state.xp < selectedItem.xpCost) {
        const shortfall = selectedItem.xpCost - state.xp;
        setAlertDialog({
          isOpen: true,
          title: "Insufficient XP!",
          message: `Insufficient XP! You need ${shortfall.toLocaleString()} more XP to unlock "${selectedItem.title}".`,
          type: "xp",
          requiredXP: selectedItem.xpCost,
          currentXP: state.xp,
          actionText: "Earn XP in Drills",
          onAction: () => router.push("/mock-tests"),
        });
        return;
      }
      addXP(-selectedItem.xpCost, `XP Store Purchase: ${selectedItem.title}`);
    }

    setIsProcessing(true);

    setTimeout(() => {
      const invoiceId = `INV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const gatewayName = selectedGateway.toUpperCase();

      buyItem(selectedItem.id, selectedItem.title, gatewayName);
      setIsProcessing(false);
      setPaymentSuccess({ invoiceId, gateway: gatewayName });
    }, 1500);
  };

  const handleDownloadAsset = () => {
    if (!selectedItem) return;
    triggerFileDownload(
      `${selectedItem.id}_asset.txt`,
      `===================================================\nINSYT CORPORATE MARKETPLACE ASSET\nItem: ${selectedItem.title}\nInvoice: ${paymentSuccess?.invoiceId}\n===================================================\n\nThank you for your purchase!\nAccess Token: SECURE-ASSET-${Date.now()}\n\n${SAMPLE_CASE_PLAYBOOK_TEXT}`,
      "text/plain"
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-corp-accent/10 text-corp-accent mb-4 border border-corp-accent/20">
            <ShoppingBag size={14} />
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Merged Marketplace & XP Rewards Store</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: "var(--corp-text)" }}>
            Marketplace & Operator Store
          </h1>
          <p className="text-[15px] max-w-2xl" style={{ color: "var(--corp-text-secondary)" }}>
            Purchase B2B corporate cohorts, ATS resume packs, and exam vouchers using bKash, Nagad, Cards, Bank Transfer, or your accumulated XP points.
          </p>
        </div>

        {/* XP Balance Badge */}
        <div className="p-4 rounded-2xl border flex items-center gap-3" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Zap size={20} className="fill-amber-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-corp-text-tertiary">Available XP</p>
            <p className="text-xl font-black font-mono text-amber-500">{state.xp.toLocaleString()} XP</p>
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                activeCategory === cat ? "bg-corp-accent text-white shadow-sm" : "hover:bg-corp-bg-secondary"
              )}
              style={activeCategory !== cat ? { color: "var(--corp-text-secondary)", background: "var(--corp-surface)", border: "1px solid var(--corp-border)" } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--corp-text-tertiary)" }} />
          <input
            type="text"
            placeholder="Search assets, vouchers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-corp-accent/20"
            style={{ background: "var(--corp-surface)", border: "1px solid var(--corp-border)", color: "var(--corp-text)" }}
          />
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isPurchased = state.purchasedItemIds.includes(item.id);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div 
                className="flex flex-col h-full rounded-3xl p-6 border justify-between group hover:shadow-xl transition-all relative"
                style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{item.icon}</span>
                    {item.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-corp-accent/10 text-corp-accent border border-corp-accent/20">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base leading-snug group-hover:text-corp-accent transition-colors" style={{ color: "var(--corp-text)" }}>
                      {item.title}
                    </h3>
                    <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--corp-text-secondary)" }}>
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--corp-border)" }}>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "var(--corp-text)" }}>{item.price}</p>
                    <p className="text-[10px] font-bold text-amber-500 font-mono">or {item.xpCost.toLocaleString()} XP</p>
                  </div>

                  <button
                    onClick={() => handleOpenCheckout(item)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                      isPurchased 
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-corp-accent hover:bg-corp-accent-hover text-white shadow-md"
                    )}
                  >
                    {isPurchased ? "Unlocked ✓" : item.category === "B2B Enterprise" ? "Checkout B2B" : "Buy / Claim"}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Multi-Gateway Checkout Modal ── */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              className="max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative border overflow-hidden"
              style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-corp-bg-secondary"
                style={{ color: "var(--corp-text-tertiary)" }}
              >
                <X size={18} />
              </button>

              {!paymentSuccess ? (
                <form onSubmit={handleExecutePayment} className="space-y-6">
                  <div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-corp-accent/10 text-corp-accent">
                      Secure Multi-Gateway Checkout
                    </span>
                    <h2 className="text-xl font-bold mt-2" style={{ color: "var(--corp-text)" }}>
                      {selectedItem.title}
                    </h2>
                    <p className="text-xs text-corp-text-secondary mt-1">
                      Total: <span className="font-bold text-corp-accent">{selectedItem.price}</span> (or {selectedItem.xpCost.toLocaleString()} XP)
                    </p>
                  </div>

                  {/* Gateway Selector Tabs */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "var(--corp-text-tertiary)" }}>
                      Select Payment Gateway
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: "bkash", label: "bKash", color: "bg-pink-600 text-white" },
                        { id: "nagad", label: "Nagad", color: "bg-orange-600 text-white" },
                        { id: "rocket", label: "Rocket", color: "bg-purple-600 text-white" },
                        { id: "upay", label: "Upay", color: "bg-blue-600 text-white" },
                        { id: "bank", label: "Bank", color: "bg-slate-700 text-white" },
                        { id: "stripe", label: "Card", color: "bg-indigo-600 text-white" },
                        { id: "xp", label: "XP Points", color: "bg-amber-500 text-white" },
                      ].map((gw) => (
                        <button
                          key={gw.id}
                          type="button"
                          onClick={() => setSelectedGateway(gw.id as PaymentGateway)}
                          className={cn(
                            "py-2 rounded-xl text-xs font-bold transition-all border text-center",
                            selectedGateway === gw.id ? gw.color : "bg-corp-bg-secondary border-transparent"
                          )}
                          style={selectedGateway !== gw.id ? { color: "var(--corp-text)" } : {}}
                        >
                          {gw.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gateway Specific Input Fields */}
                  <div className="p-4 rounded-2xl bg-corp-bg-secondary space-y-3 border text-xs" style={{ borderColor: "var(--corp-border)" }}>
                    {["bkash", "nagad", "rocket", "upay"].includes(selectedGateway) && (
                      <div className="space-y-3">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] space-y-1">
                          <p className="font-bold text-corp-accent">Official Merchant Number: 01700-000000</p>
                          <p className="text-corp-text-secondary">Please send {selectedItem.price} to our merchant number and paste your Transaction ID below.</p>
                        </div>
                        <div>
                          <label className="block font-bold mb-1" style={{ color: "var(--corp-text)" }}>Your {selectedGateway.toUpperCase()} Mobile Number *</label>
                          <input
                            required
                            type="tel"
                            placeholder="01700000000"
                            value={mfsPhone}
                            onChange={(e) => setMfsPhone(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border outline-none"
                            style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)", color: "var(--corp-text)" }}
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1" style={{ color: "var(--corp-text)" }}>Transaction ID (TrxID) *</label>
                          <input
                            required
                            placeholder="e.g. BXA90218X"
                            value={mfsTrxId}
                            onChange={(e) => setMfsTrxId(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border outline-none font-mono uppercase"
                            style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)", color: "var(--corp-text)" }}
                          />
                        </div>
                      </div>
                    )}

                    {selectedGateway === "bank" && (
                      <div className="space-y-3">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] space-y-1">
                          <p className="font-bold text-corp-accent">Bank: City Bank PLC (Gulshan Branch)</p>
                          <p className="text-corp-text-secondary">Account: 1102938475001 | Routing: 090261943</p>
                        </div>
                        <div>
                          <label className="block font-bold mb-1" style={{ color: "var(--corp-text)" }}>Deposit Reference / Slip ID *</label>
                          <input
                            required
                            placeholder="e.g. DEP-901823"
                            value={bankRef}
                            onChange={(e) => setBankRef(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border outline-none font-mono"
                            style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)", color: "var(--corp-text)" }}
                          />
                        </div>
                      </div>
                    )}

                    {selectedGateway === "stripe" && (
                      <div className="space-y-3">
                        <div>
                          <label className="block font-bold mb-1" style={{ color: "var(--corp-text)" }}>Card Number *</label>
                          <input
                            required
                            placeholder="4444 4444 4444 4444"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border outline-none font-mono"
                            style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)", color: "var(--corp-text)" }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            required
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border outline-none font-mono"
                            style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)", color: "var(--corp-text)" }}
                          />
                          <input
                            required
                            placeholder="CVC"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border outline-none font-mono"
                            style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)", color: "var(--corp-text)" }}
                          />
                        </div>
                      </div>
                    )}

                    {selectedGateway === "xp" && (
                      <div className="text-center py-3 space-y-1">
                        <p className="font-bold text-amber-500">XP Balance Redemption</p>
                        <p className="text-xs text-corp-text-secondary">Current Balance: {state.xp.toLocaleString()} XP</p>
                        <p className="text-xs font-bold text-emerald-600">Remaining after claim: {(state.xp - selectedItem.xpCost).toLocaleString()} XP</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-corp-bg-secondary"
                      style={{ color: "var(--corp-text-secondary)" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-corp-accent hover:bg-corp-accent-hover disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {isProcessing ? "Processing Gateway..." : `Pay & Unlock ${selectedItem.price}`}
                    </button>
                  </div>
                </form>
              ) : (
                /* Invoice & Purchase Confirmation */
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: "var(--corp-text)" }}>Payment Successful!</h3>

                  <div className="p-4 rounded-2xl bg-corp-bg-secondary space-y-2 text-xs border font-mono text-left" style={{ borderColor: "var(--corp-border)" }}>
                    <div className="flex justify-between border-b pb-2" style={{ borderColor: "var(--corp-border)" }}>
                      <span className="text-corp-text-tertiary">Invoice ID:</span>
                      <span className="font-bold text-corp-accent">{paymentSuccess.invoiceId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-corp-text-tertiary">Item:</span>
                      <span className="font-semibold" style={{ color: "var(--corp-text)" }}>{selectedItem.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-corp-text-tertiary">Payment Gateway:</span>
                      <span className="font-bold text-emerald-600">{paymentSuccess.gateway}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadAsset}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-corp-accent hover:bg-corp-accent-hover flex items-center justify-center gap-2"
                    >
                      <Download size={14} /> Download Asset
                    </button>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-corp-bg-secondary text-corp-text-secondary"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insufficient XP & System Alert Dialogue Modal */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => setAlertDialog((prev) => ({ ...prev, isOpen: false }))}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
        requiredXP={alertDialog.requiredXP}
        currentXP={alertDialog.currentXP}
        actionText={alertDialog.actionText}
        onAction={alertDialog.onAction}
      />
    </div>
  );
}
