import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { PremiumBanner } from "@/components/layout/premium-banner";
import { AuthGuard } from "@/components/auth-guard";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { PageTransition } from "@/components/ui/page-transition";
import { FloatingChatAssistant } from "@/components/ai/floating-chat-assistant";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personalized career development command center. Track XP, courses, leaderboard rank, and upcoming workshops.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      {/* #28: Scroll progress indicator */}
      <ScrollProgress />
      <div className="flex flex-col h-screen overflow-hidden" style={{ background: "var(--corp-bg)" }}>
        <PremiumBanner />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardTopbar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-6">
              {/* #27: Page-level fade transition on route changes */}
              <PageTransition>
                {children}
              </PageTransition>
            </main>
          </div>
          <MobileBottomNav />
        </div>

        {/* ── Floating AI Chatbot Helper ── */}
        <FloatingChatAssistant />
      </div>
    </AuthGuard>
  );
}

