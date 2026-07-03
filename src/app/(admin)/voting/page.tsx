"use client";

import { useState } from "react";
import { Plus, Lock } from "lucide-react";
import {
  useAdminVoting,
  useCreateVotingRound,
  useCloseVotingRound,
  useAdminListings,
} from "@/lib/hooks/api/useAdmin";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function VotingPage() {
  const { data } = useAdminVoting({ perPage: 50 });
  const listings = useAdminListings({ perPage: 100 });
  const create = useCreateVotingRound();
  const close = useCloseVotingRound();

  const [open, setOpen] = useState(false);
  const [listingId, setListingId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const rounds = data?.data ?? [];

  const onCreate = () => {
    setErr(null);
    if (!listingId || title.trim().length < 3 || description.trim().length < 10) {
      setErr("Pick a listing and enter a title + description.");
      return;
    }
    create.mutate(
      { listingId, title: title.trim(), description: description.trim() },
      {
        onSuccess: () => {
          setOpen(false);
          setListingId("");
          setTitle("");
          setDescription("");
        },
        onError: (e) =>
          setErr((e as { message?: string })?.message ?? "Failed to create."),
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            Voting
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Governance rounds. Only investors in a listing may vote.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" /> New round
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {rounds.map((r) => (
          <div
            key={r.id}
            className="rounded-xl border border-neutral-200 bg-surface p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-neutral-900">{r.title}</p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {r.listing.title} · {formatDate(r.createdAt)}
                </p>
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium px-2 py-0.5 rounded-full",
                  r.status === "OPEN"
                    ? "bg-success-50 text-success-600"
                    : "bg-neutral-100 text-neutral-500",
                )}
              >
                {r.status}
              </span>
            </div>
            <p className="text-sm text-neutral-600 mt-2 line-clamp-2">
              {r.description}
            </p>
            {r.tally && (
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="text-success-600">Yes {r.tally.YES}</span>
                <span className="text-danger-600">No {r.tally.NO}</span>
                <span className="text-neutral-500">Abstain {r.tally.ABSTAIN}</span>
                <span className="text-neutral-400 ml-auto">
                  {r.tally.total} votes
                </span>
              </div>
            )}
            {r.status === "OPEN" && (
              <button
                onClick={() => close.mutate(r.id)}
                disabled={close.isPending}
                className="mt-4 inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
              >
                <Lock className="h-4 w-4" /> Close round
              </button>
            )}
          </div>
        ))}
      </div>

      {rounds.length === 0 && (
        <div className="py-12 text-center text-sm text-neutral-500">
          No voting rounds yet. Create one against a listing.
        </div>
      )}

      {/* Create modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              New voting round
            </h2>
            <select
              value={listingId}
              onChange={(e) => setListingId(e.target.value)}
              className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm"
            >
              <option value="">Select a listing…</option>
              {(listings.data?.data ?? []).map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title} ({l.company.name})
                </option>
              ))}
            </select>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Question / title"
              className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what investors are voting on…"
              rows={3}
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm"
            />
            {err && <p className="text-xs text-danger-600">{err}</p>}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="h-10 px-4 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={onCreate}
                disabled={create.isPending}
                className="h-10 px-4 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-50"
              >
                {create.isPending ? "Creating…" : "Create round"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
