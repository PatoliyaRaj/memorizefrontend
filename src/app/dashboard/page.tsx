import AuthGuard from '@/components/common/AuthGuard'

export default function DashboardPage() {
  return (
    <AuthGuard>
      <section className="rounded-xl border border-border-default bg-surface-overlay/70 p-5 shadow-sm">
        <h1 className="font-display text-2xl text-text-primary">Welcome back</h1>
        <p className="mt-2 font-body text-sm text-text-secondary">
          Dashboard content area is ready. Next step is adding cards and widgets.
          temp
        </p>
      </section>
    </AuthGuard>
  )
}
