import type { AIReviewReport } from "@/lib/zod/ai";

export const mockAIReports: AIReviewReport[] = [
  {
    id: "ai-01",
    fundingRequestId: "fr-aaaa-bbbb-cccc-dddddddddd02",
    companyId: "c001-aaaa-bbbb-cccc-dddddddddd01",
    overallScore: 82,
    sections: {
      documentQuality: {
        score: 95,
        status: "LOW_RISK",
        findings: ["All 12 required documents present", "High-resolution scans", "No signs of digital manipulation detected"],
        recommendation: "Documents are verified and clear."
      },
      historicalPatterns: {
        score: 78,
        status: "MEDIUM_RISK",
        findings: ["Seasonal revenue fluctuations noted in Q3", "Strong repayment history on previous 2 rounds"],
        recommendation: "Monitor cash flow during agricultural off-season."
      },
      cacCompliance: {
        score: 100,
        status: "LOW_RISK",
        findings: ["RC number validated", "Directors match current registry", "Annual returns filed up to date"],
        recommendation: "Fully compliant."
      },
      financialSanity: {
        score: 72,
        status: "MEDIUM_RISK",
        findings: ["Debt-to-equity ratio at 0.6", "Current ratio is 1.8", "OpEx increased by 15% in last 6 months"],
        recommendation: "Reasonable financial health but warrants closer look at OpEx growth."
      },
      anomalyDetection: {
        score: 88,
        status: "LOW_RISK",
        findings: ["No suspicious transaction patterns", "IP logins consistent with company location", "No negative media mentions found"],
        recommendation: "No anomalies detected."
      }
    },
    generatedAt: "2026-04-25T09:00:00.000Z",
    version: "v2.4.0-pro"
  },
  {
    id: "ai-02",
    fundingRequestId: "fr-aaaa-bbbb-cccc-dddddddddd09",
    companyId: "c001-aaaa-bbbb-cccc-dddddddddd13",
    overallScore: 68,
    sections: {
      documentQuality: {
        score: 45,
        status: "HIGH_RISK",
        findings: ["Mining permits appear to be expired", "Bank statements missing 2 months (Dec-Jan)", "Low-quality scans"],
        recommendation: "Request updated permits and high-quality bank statements."
      },
      historicalPatterns: {
        score: 60,
        status: "MEDIUM_RISK",
        findings: ["Inconsistent production volumes reported", "One late repayment in 2024 (12 days)"],
        recommendation: "Verify current production capacity."
      },
      cacCompliance: {
        score: 85,
        status: "LOW_RISK",
        findings: ["RC validated", "Directors confirmed"],
        recommendation: "Compliance is satisfactory."
      },
      financialSanity: {
        score: 55,
        status: "HIGH_RISK",
        findings: ["High short-term leverage", "Significant related-party transactions noted"],
        recommendation: "Analyze related-party debts."
      },
      anomalyDetection: {
        score: 65,
        status: "MEDIUM_RISK",
        findings: ["Multiple large cash withdrawals noted", "IP logins from outside Nigeria (VPN detected)"],
        recommendation: "Investigate cash usage and login security."
      }
    },
    generatedAt: "2026-04-01T09:00:00.000Z",
    version: "v2.4.0-pro"
  }
];
