"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useBroadcasts, useSendBroadcast } from "@/lib/hooks/api/useAdmin";
import { formatDateTime } from "@/lib/format";

const ROLE_OPTIONS = [
  { label: "Everyone", value: "" },
  { label: "Investors", value: "INVESTOR" },
  { label: "Companies", value: "COMPANY" },
];

export default function AdminNotificationsPage() {
  const { data } = useBroadcasts({ perPage: 20 });
  const send = useSendBroadcast();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [role, setRole] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const onSend = () => {
    setErr(null);
    if (title.trim().length < 2 || body.trim().length < 2) {
      setErr("Title and message are required.");
      return;
    }
    send.mutate(
      {
        title: title.trim(),
        body: body.trim(),
        role: role ? (role as "INVESTOR" | "COMPANY") : undefined,
      },
      {
        onSuccess: () => {
          setTitle("");
          setBody("");
          setRole("");
        },
        onError: (e) =>
          setErr((e as { message?: string })?.message ?? "Failed to send."),
      },
    );
  };

  const history = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
          Broadcasts
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Send an in-app notification to all users or a segment.
        </p>
      </div>

      {/* Composer */}
      <div className="rounded-xl border border-neutral-200 bg-surface p-5 space-y-4 max-w-2xl">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Message…"
          rows={3}
          className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        <div className="flex items-center gap-3">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-10 rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm"
          >
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={onSend}
            disabled={send.isPending}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {send.isPending ? "Sending…" : "Send broadcast"}
          </button>
        </div>
        {err && <p className="text-xs text-danger-600">{err}</p>}
      </div>

      {/* History */}
      <div className="rounded-xl border border-neutral-200 bg-surface overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900">Recent broadcasts</h2>
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-neutral-400 p-6 text-center">
            No broadcasts sent yet.
          </p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {history.map((b) => (
              <div key={b.id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-900">
                    {b.title}
                  </p>
                  <span className="text-xs text-neutral-400">
                    {formatDateTime(b.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mt-0.5">{b.body}</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {b.role ?? "Everyone"} · {b.recipientCount} recipients
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
