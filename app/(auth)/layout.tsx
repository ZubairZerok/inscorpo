export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex" style={{ background: "var(--corp-bg)" }}>
      {children}
    </div>
  );
}
