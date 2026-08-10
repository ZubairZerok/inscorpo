import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { LeadMagnetModal } from "@/components/landing/lead-magnet-modal";
import { OrganizationSchema } from "@/components/seo/structured-data";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrganizationSchema />
      <MarketingNavbar />
      <main>{children}</main>
      <SiteFooter />
      <LeadMagnetModal />
    </>
  );
}
