import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { FormalFooter } from "@/components/layout/formal-footer";
import { OrganizationSchema } from "@/components/seo/structured-data";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark bg-corp-bg text-corp-text min-h-screen selection:bg-corp-accent/30 selection:text-corp-accent">
      <OrganizationSchema />
      <MarketingNavbar />
      <main>{children}</main>
      <FormalFooter />
    </div>
  );
}



