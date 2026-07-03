import { ComingSoon } from "@/components/molecules/ComingSoon";

/**
 * AI review now lives inside each funding request (the AI risk analysis runs
 * automatically on submission). This standalone hub is deferred; use the
 * Funding Requests pages to see AI analysis per raise.
 */
export default function AiReviewPage() {
  return (
    <ComingSoon
      title="AI Review"
      description="AI risk analysis runs automatically on each funding request — open Funding Requests to review it. A dedicated AI hub is coming later."
    />
  );
}
