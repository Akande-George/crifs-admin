import { Construction } from "lucide-react";

/**
 * Honest placeholder for admin pages whose backend hasn't shipped yet. We
 * prefer this to fabricated data — a truthful empty state beats a fake chart.
 */
export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
        {title}
      </h1>
      <div className="rounded-xl border border-dashed border-neutral-300 bg-surface p-12 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center">
          <Construction className="h-6 w-6 text-brand-500" />
        </div>
        <p className="text-sm font-medium text-neutral-900">Coming soon</p>
        <p className="text-sm text-neutral-500 max-w-md">
          {description ??
            "This area isn't live yet. It'll light up here once the backend for it ships."}
        </p>
      </div>
    </div>
  );
}

export default ComingSoon;
