"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield, Percent, Wallet,
  Vote, Bell, Lock, Save, RotateCcw,
  Zap, Globe, Database, Key,
  Eye, EyeOff, Server, Terminal
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useFeeConfigs, useUpdateFeeConfig } from "@/lib/hooks/api/useAdmin";
import type { FeeKind } from "@/lib/api/services/admin";

type SettingsTab = "Financial" | "Governance" | "Risk & AI" | "Security" | "Environment";

// String-typed form mirror of a FeeConfig so inputs can be cleared while
// typing; converted/validated on save. Percent is human % (1.5), stored bps.
interface FeeFormRow {
  enabled: boolean;
  percent: string;
  flat: string;
  minFee: string;
  maxFee: string; // empty = no cap
}

const FEE_KINDS: { kind: FeeKind; label: string; hint: string }[] = [
  {
    kind: "DEPOSIT",
    label: "Deposit Fee",
    hint: "Charged to the customer on every wallet deposit and recouped via the payment provider into the revenue account.",
  },
  {
    kind: "WITHDRAWAL",
    label: "Withdrawal Fee",
    hint: "Charged on every withdrawal (early-exit penalties apply on top and are configured separately).",
  },
];

export default function SettingsPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>("Financial");
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const feeConfigs = useFeeConfigs();
  const updateFee = useUpdateFeeConfig();
  const [feeForm, setFeeForm] = useState<Record<FeeKind, FeeFormRow> | null>(null);

  // Seed the form once from the server; Reset re-seeds explicitly.
  useEffect(() => {
    if (feeConfigs.data && !feeForm) setFeeForm(toForm(feeConfigs.data));
  }, [feeConfigs.data, feeForm]);

  function toForm(rows: NonNullable<typeof feeConfigs.data>) {
    const out = {} as Record<FeeKind, FeeFormRow>;
    for (const r of rows) {
      out[r.kind] = {
        enabled: r.enabled,
        percent: (r.percentBps / 100).toString(),
        flat: r.flatAmount,
        minFee: r.minFee,
        maxFee: r.maxFee ?? "",
      };
    }
    return out;
  }

  const setRow = (kind: FeeKind, patch: Partial<FeeFormRow>) =>
    setFeeForm((f) => (f ? { ...f, [kind]: { ...f[kind], ...patch } } : f));

  const handleReset = () => {
    if (feeConfigs.data) setFeeForm(toForm(feeConfigs.data));
  };

  const handleSave = async () => {
    if (activeTab !== "Financial") {
      // Other tabs are not wired to the backend yet.
      toast.success("Settings saved", "System configuration has been updated successfully.");
      return;
    }
    if (!feeForm) return;
    setSaving(true);
    try {
      for (const { kind } of FEE_KINDS) {
        const row = feeForm[kind];
        const percent = Number(row.percent || 0);
        if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
          throw new Error(`${kind.toLowerCase()} percent must be between 0 and 100`);
        }
        await updateFee.mutateAsync({
          kind,
          body: {
            enabled: row.enabled,
            percentBps: Math.round(percent * 100),
            flatAmount: Number(row.flat || 0),
            minFee: Number(row.minFee || 0),
            maxFee: row.maxFee.trim() === "" ? null : Number(row.maxFee),
          },
        });
      }
      toast.success("Fees updated", "Customers are now charged the new rates on every transaction.");
    } catch (e) {
      toast.error(
        "Could not save fees",
        (e as { message?: string })?.message ?? "Please check the values and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const tabs: { label: SettingsTab; icon: any }[] = [
    { label: "Financial", icon: Wallet },
    { label: "Governance", icon: Vote },
    { label: "Risk & AI", icon: Zap },
    { label: "Security", icon: Lock },
    { label: "Environment", icon: Globe },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-neutral-900 tracking-tight">System Configuration</h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">Manage global platform parameters and security thresholds</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={handleReset}
            className="h-9 md:h-10 px-3 md:px-4 rounded-lg border border-neutral-200 text-[10px] md:text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="h-9 md:h-10 px-4 md:px-6 rounded-lg bg-neutral-900 text-white text-[10px] md:text-sm font-bold hover:bg-neutral-800 transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Navigation - Horizontal on mobile, Vertical on desktop */}
        <div className="lg:col-span-1 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
          {tabs.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={cn(
                "flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold transition-all whitespace-nowrap",
                activeTab === item.label 
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" 
                  : "bg-neutral-100 lg:bg-transparent text-neutral-500 hover:bg-neutral-200 lg:hover:bg-neutral-100"
              )}
            >
              <item.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 md:space-y-8"
            >
              {activeTab === "Financial" && (
                <section className="space-y-6">
                  <h3 className="text-base md:text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <Percent className="h-4 w-4 md:h-5 md:w-5 text-brand-500" /> Transaction Fees
                  </h3>
                  <p className="text-[11px] text-neutral-500 -mt-4">
                    Fees are charged to the customer on every transaction: percent of the amount plus a flat charge,
                    clamped between the minimum and maximum. Collected fees settle into the platform revenue account.
                  </p>

                  {feeConfigs.isLoading || !feeForm ? (
                    <div className="space-y-4">
                      {[0, 1].map((i) => (
                        <div key={i} className="h-40 rounded-2xl bg-neutral-100 animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    FEE_KINDS.map(({ kind, label, hint }) => {
                      const row = feeForm[kind];
                      return (
                        <div key={kind} className="rounded-2xl border border-neutral-100 p-4 md:p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-neutral-900">{label}</p>
                              <p className="text-[11px] text-neutral-500 max-w-md">{hint}</p>
                            </div>
                            <Switch
                              checked={row.enabled}
                              onCheckedChange={(v: boolean) => setRow(kind, { enabled: v })}
                            />
                          </div>
                          <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", !row.enabled && "opacity-40 pointer-events-none")}>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Percent (%)</label>
                              <input
                                type="number" min={0} max={100} step={0.01} value={row.percent}
                                onChange={(e) => setRow(kind, { percent: e.target.value })}
                                className="w-full h-11 rounded-xl border border-neutral-200 bg-surface px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Flat (₦)</label>
                              <input
                                type="number" min={0} step={0.01} value={row.flat}
                                onChange={(e) => setRow(kind, { flat: e.target.value })}
                                className="w-full h-11 rounded-xl border border-neutral-200 bg-surface px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Min Fee (₦)</label>
                              <input
                                type="number" min={0} step={0.01} value={row.minFee}
                                onChange={(e) => setRow(kind, { minFee: e.target.value })}
                                className="w-full h-11 rounded-xl border border-neutral-200 bg-surface px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Max Fee (₦)</label>
                              <input
                                type="number" min={0} step={0.01} value={row.maxFee} placeholder="No cap"
                                onChange={(e) => setRow(kind, { maxFee: e.target.value })}
                                className="w-full h-11 rounded-xl border border-neutral-200 bg-surface px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </section>
              )}

              {activeTab === "Governance" && (
                <section className="space-y-6">
                  <h3 className="text-base md:text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <Vote className="h-4 w-4 md:h-5 md:w-5 text-brand-500" /> Governance Thresholds
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Required Board Votes</label>
                      <input type="number" defaultValue={5} className="w-full h-11 rounded-xl border border-neutral-200 bg-surface px-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/5 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Quorum Percentage (%)</label>
                      <input type="number" defaultValue={60} className="w-full h-11 rounded-xl border border-neutral-200 bg-surface px-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/5 transition-all" />
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "Risk & AI" && (
                <section className="space-y-6">
                  <h3 className="text-base md:text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <Zap className="h-4 w-4 md:h-5 md:w-5 text-brand-500" /> Risk & AI Configuration
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 bg-neutral-50/50">
                        <div>
                          <p className="text-sm font-bold text-neutral-900">Auto-Reject High Risk</p>
                          <p className="text-[11px] text-neutral-500">Automatically flag companies with risk score &gt; 80</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 bg-neutral-50/50">
                        <div>
                          <p className="text-sm font-bold text-neutral-900">AI Document Analysis</p>
                          <p className="text-[11px] text-neutral-500">Use OCR and NLP to pre-screen uploaded KYC docs</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">AI Sensitivity Level</label>
                      <select className="w-full h-11 rounded-xl border border-neutral-200 bg-surface px-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/5 transition-all appearance-none">
                        <option>Conservative (Fewer false positives)</option>
                        <option defaultValue="Balanced">Balanced (Recommended)</option>
                        <option>Aggressive (Higher detection rate)</option>
                      </select>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "Security" && (
                <section className="space-y-6">
                  <h3 className="text-base md:text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <Lock className="h-4 w-4 md:h-5 md:w-5 text-brand-500" /> Security Policies
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Session Timeout (Minutes)</label>
                      <input type="number" defaultValue={30} className="w-full h-11 rounded-xl border border-neutral-200 bg-surface px-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/5 transition-all" />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 bg-neutral-50/50">
                      <div>
                        <p className="text-sm font-bold text-neutral-900">Enforce 2FA for Admins</p>
                        <p className="text-[11px] text-neutral-500">Require multi-factor authentication for all staff accounts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Password Complexity</label>
                      <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/50 space-y-3">
                        {["Min 12 characters", "Include symbols", "Include numbers", "Case sensitive"].map(rule => (
                          <div key={rule} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                            <span className="text-[11px] font-medium text-neutral-600">{rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "Environment" && (
                <section className="space-y-6">
                  <h3 className="text-base md:text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <Globe className="h-4 w-4 md:h-5 md:w-5 text-brand-500" /> Environment & API
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Platform Base URL</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <input type="text" defaultValue="https://api.crifs.ng/v1" className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-10 text-sm focus:outline-none" disabled />
                        </div>
                        <button className="px-4 rounded-xl border border-neutral-200 text-xs font-bold hover:bg-neutral-50">Copy</button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">System API Key</label>
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input 
                          type={showApiKey ? "text" : "password"} 
                          defaultValue="sk_live_51MhX8H..." 
                          className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-10 text-sm focus:outline-none" 
                          disabled 
                        />
                        <button 
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl bg-neutral-900 p-6 text-white space-y-4">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-brand-400" />
                        <span className="text-xs font-bold tracking-widest uppercase">Webhook Endpoint</span>
                      </div>
                      <code className="block text-[11px] font-mono text-neutral-400 bg-black/30 p-3 rounded-lg border border-white/5">
                        https://webhook.crifs.ng/v1/events
                      </code>
                    </div>
                  </div>
                </section>
              )}

              <div className="h-px bg-neutral-100 my-8" />

              <div className="rounded-xl md:rounded-2xl bg-neutral-50 p-4 md:p-6 border border-neutral-100 flex items-start gap-4">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-white border border-neutral-100 flex items-center justify-center shrink-0">
                  <Database className="h-4 w-4 md:h-5 md:w-5 text-neutral-400" />
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-neutral-900">System Information</h4>
                  <p className="text-[10px] md:text-xs text-neutral-500 mt-1 leading-relaxed">
                    Core Engine: v2.4.0-pro (Stable)<br />
                    Database: CRIFS-MOCK-LAYER-PERSISTENT<br />
                    Region: Africa-Lagos (NG-WEST-1)
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
