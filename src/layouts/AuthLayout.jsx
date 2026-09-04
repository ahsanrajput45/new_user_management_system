import { Outlet } from "react-router-dom";
import { CheckCircle2, ShieldCheck, Users } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen overflow-hidden bg-card lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[28px] border-white/10" />
          <div className="relative flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Merlin</span>
          </div>
          <div className="relative">
            <p className="text-sm font-medium text-white/70">User management, simplified</p>
            <h2 className="mt-3 max-w-md text-4xl font-semibold leading-tight tracking-tight">A clearer way to manage your team.</h2>
            <div className="mt-10 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {['AL', 'JM', 'SK'].map((initials) => <span key={initials} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-white text-xs font-semibold text-primary">{initials}</span>)}
                </div>
                <ShieldCheck className="h-5 w-5 text-white/80" />
              </div>
              <div className="mt-5 flex items-center gap-3 text-sm"><CheckCircle2 className="h-4 w-4" /> Everything your team needs, in one place.</div>
            </div>
          </div>
          <p className="relative text-sm text-white/65">Built for thoughtful teams.</p>
        </section>

        <section className="flex min-h-screen items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary"><Users className="h-5 w-5 text-primary-foreground" /></div>
              <span className="text-lg font-semibold tracking-tight">Merlin</span>
            </div>
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}
