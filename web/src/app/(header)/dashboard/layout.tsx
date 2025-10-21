import AuthWrapper from "@/components/AuthGuard"

export default function DashboardLayout({
    children,
}: {
  children: React.ReactNode
}) {
    return (
        <AuthWrapper>
            {children}
        </AuthWrapper>
    )
}
