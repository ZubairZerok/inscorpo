"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Bell, Laptop, Check, Save
} from "lucide-react";
import { useUser } from "@/components/providers/user-context";

type SettingsTab = "profile" | "platform" | "devices";

export default function SettingsPage() {
  const { state, updateProfileName } = useUser();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [profileSaved, setProfileSaved] = useState(false);
  const [fullName, setFullName] = useState(state.name);
  const [email, setEmail] = useState(state.email || "");
  const [sector, setSector] = useState("Banking & Finance");

  useEffect(() => {
    setFullName(state.name);
    setEmail(state.email || "");
  }, [state.name, state.email]);
  
  const [notifToggle, setNotifToggle] = useState(true);
  const [publicToggle, setPublicToggle] = useState(true);
  const [dataToggle, setDataToggle] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileName(fullName);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { id: "profile" as SettingsTab, label: "Profile Information", icon: User },
    { id: "platform" as SettingsTab, label: "Platform Configurations", icon: Bell },
    { id: "devices" as SettingsTab, label: "Device Sessions", icon: Laptop }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black" style={{ color: "var(--corp-text)" }}>
          ⚙️ Settings
        </h1>
        <p className="text-sm font-medium" style={{ color: "var(--corp-text-secondary)" }}>
          Manage your personal profile, notifications, and device sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Links */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const tabColors = ["var(--game-blue)", "var(--game-amber)", "var(--game-rose)"];
            const tabColor = tabColors[menuItems.findIndex(m => m.id === item.id) % tabColors.length];
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-left transition-all"
                style={{
                  background: isActive ? tabColor : "var(--corp-surface)",
                  color: isActive ? "#fff" : "var(--corp-text-secondary)",
                  border: isActive ? `1.5px solid ${tabColor}` : "1.5px solid var(--corp-border)",
                  boxShadow: isActive ? `0 4px 14px ${tabColor}44` : "none",
                }}
              >
                <div style={{ color: isActive ? "#fff" : tabColor }}>
                  <item.icon size={16} />
                </div>
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Forms pane */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              className="rounded-3xl p-6 space-y-4"
              style={{ background: "var(--corp-surface)", border: "1.5px solid var(--corp-border)", boxShadow: "var(--shadow-soft-ui)" }}
              >
                <h3 className="text-xs font-extrabold uppercase tracking-tight flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
                  <User size={15} className="text-[#2563eb]" />
                  Profile Details
                </h3>

                <form onSubmit={handleSaveProfile} className="space-y-4 font-mono">
                  <div>
                    <label className="block text-xs font-extrabold uppercase mb-1.5" style={{ color: "var(--corp-text)" }}>Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-xs font-extrabold outline-none border-2 border-corp-border focus:border-[#2563eb] bg-corp-bg-secondary text-corp-text"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase mb-1.5" style={{ color: "var(--corp-text)" }}>Email</label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg text-xs font-mono font-bold bg-corp-bg-secondary opacity-60 border-2 border-corp-border text-corp-text-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase mb-1.5" style={{ color: "var(--corp-text)" }}>Industry Sector Focus</label>
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-xs font-extrabold outline-none border-2 border-corp-border bg-corp-bg-secondary text-corp-text uppercase"
                    >
                      <option>Banking &amp; Finance</option>
                      <option>Corporate Management</option>
                      <option>E-Commerce &amp; Tech</option>
                      <option>RMG Merchandising</option>
                      <option>NGO Monitoring &amp; Evaluation</option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <AnimatePresence>
                      {profileSaved && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[#2563eb] text-xs font-extrabold flex items-center gap-1 uppercase"
                        >
                          <Check size={14} /> Profile Saved
                        </motion.span>
                      )}
                    </AnimatePresence>

                    <button type="submit" className="px-5 py-2.5 rounded-lg text-xs font-extrabold text-white bg-[#2563eb] hover:bg-blue-600 transition-all shadow-[3px_3px_0px_0px_#1e3a8a] border border-blue-300 uppercase flex items-center gap-1.5 ml-auto">
                      <Save size={14} /> Save Profile
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === "platform" && (
              <motion.div
                key="platform"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-5 rounded-xl border-2 border-corp-border shadow-[5px_5px_0px_0px_#2563eb] space-y-4 font-mono" 
                style={{ background: "var(--corp-surface)" }}
              >
                <h3 className="text-xs font-extrabold uppercase tracking-tight flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
                  <Bell size={15} className="text-[#2563eb]" />
                  Platform Configurations
                </h3>

                <div className="space-y-4">
                  {[
                    { title: "Enable Email Notifications", desc: "Receive weekly study updates and reminders.", state: notifToggle, setter: setNotifToggle },
                    { title: "Public Career Passport", desc: "Allow employers to verify certificates via unique URLs.", state: publicToggle, setter: setPublicToggle },
                    { title: "Share Performance Analytics", desc: "Send anonymous grades to improve model training speeds.", state: dataToggle, setter: setDataToggle }
                  ].map((config, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-extrabold uppercase" style={{ color: "var(--corp-text)" }}>{config.title}</h4>
                        <p className="text-[10px] font-sans font-medium text-corp-text-tertiary">{config.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.state}
                        onChange={(e) => config.setter(e.target.checked)}
                        className="w-4 h-4 rounded border-2 border-corp-border accent-[#2563eb]"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "devices" && (
              <motion.div
                key="devices"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-5 rounded-xl border-2 border-corp-border shadow-[5px_5px_0px_0px_#2563eb] space-y-4 font-mono" 
                style={{ background: "var(--corp-surface)" }}
              >
                <h3 className="text-xs font-extrabold uppercase tracking-tight flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
                  <Laptop size={15} className="text-[#2563eb]" />
                  Device Sessions
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-corp-bg-secondary border-2 border-corp-border flex justify-between items-center">
                    <div>
                      <p className="font-extrabold uppercase" style={{ color: "var(--corp-text)" }}>Windows PC · Dhaka, Bangladesh</p>
                      <p className="text-[10px] text-corp-text-tertiary">Chrome Browser · Active Session</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-[#2563eb] text-white font-extrabold uppercase text-[9px] border border-blue-300">Current</span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

