"use client";
import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, Clock, MessageSquarePlus } from "lucide-react";
import RatingStars from "./RatingStars";

const VERIFICATION_LABELS = {
  university_email: "Verified university email",
  student_id: "Verified student ID",
  document: "Verified document",
  none: "Unverified",
};

const LOCAL_KEY = "hamro-my-reviews";

function average(list, key) {
  if (!list.length) return 0;
  return list.reduce((s, r) => s + r[key], 0) / list.length;
}

export default function ReviewSection({ collegeSlug, collegeName, initialReviews }) {
  const [myReviews, setMyReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Reviews this browser submitted (shown as "pending" until a moderator approves them)
  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
      setMyReviews(all.filter((r) => r.collegeSlug === collegeSlug));
    } catch {}
  }, [collegeSlug]);

  const verified = initialReviews.filter((r) => r.verified);
  const stats = useMemo(
    () => ({
      academic: average(verified, "academic"),
      housing: average(verified, "housing"),
      placement: average(verified, "placement"),
    }),
    [verified]
  );

  function handleSubmitted(review) {
    const all = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    localStorage.setItem(LOCAL_KEY, JSON.stringify([review, ...all]));
    setMyReviews((prev) => [review, ...prev]);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Academics", stats.academic],
          ["Food & housing", stats.housing],
          ["Placements", stats.placement],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold">{value ? value.toFixed(1) : "—"}</p>
            <RatingStars value={value} />
          </div>
        ))}
      </div>
      <p className="flex items-center gap-2 text-xs text-slate-500">
        <ShieldCheck size={14} className="text-emerald-600" />
        Averages only include reviews from verified students. Every review is moderated before it appears publicly.
      </p>

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <MessageSquarePlus size={16} /> Write a review
        </button>
      )}
      {showForm && <ReviewForm collegeSlug={collegeSlug} collegeName={collegeName} onCancel={() => setShowForm(false)} onSubmitted={handleSubmitted} />}

      <ul className="space-y-4">
        {myReviews.map((r) => <ReviewItem key={r.id} review={r} pending />)}
        {initialReviews.map((r) => <ReviewItem key={r.id} review={r} />)}
        {initialReviews.length === 0 && myReviews.length === 0 && (
          <li className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            No reviews yet. Be the first verified student to review {collegeName}.
          </li>
        )}
      </ul>
    </div>
  );
}

function ReviewItem({ review, pending = false }) {
  return (
    <li className="rounded-xl border border-slate-200 p-5">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-50 text-sm font-bold text-navy-700">
            {review.author?.[0] || "?"}
          </span>
          <span className="font-semibold">{review.author}</span>
          {pending ? (
            <span className="badge bg-amber-50 text-amber-700"><Clock size={12} /> Pending moderation</span>
          ) : review.verified ? (
            <span className="badge bg-emerald-50 text-emerald-700"><ShieldCheck size={12} /> {VERIFICATION_LABELS[review.verification]}</span>
          ) : (
            <span className="badge bg-slate-100 text-slate-600">Unverified</span>
          )}
        </div>
        <span className="text-xs text-slate-400">{review.date}</span>
      </div>
      <div className="mb-2 flex flex-wrap gap-4 text-xs text-slate-600">
        <span>Academics <RatingStars value={review.academic} size={12} /></span>
        <span>Housing <RatingStars value={review.housing} size={12} /></span>
        <span>Placements <RatingStars value={review.placement} size={12} /></span>
      </div>
      <p className="text-sm leading-relaxed text-slate-700">{review.text}</p>
    </li>
  );
}

function ReviewForm({ collegeSlug, collegeName, onCancel, onSubmitted }) {
  const [form, setForm] = useState({ author: "", email: "", verification: "university_email", academic: 4, housing: 4, placement: 4, text: "" });
  const [status, setStatus] = useState({ loading: false, error: "" });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.type === "range" ? Number(e.target.value) : e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (form.text.trim().length < 30) return setStatus({ loading: false, error: "Please write at least 30 characters so your review is useful." });
    setStatus({ loading: true, error: "" });
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, collegeSlug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit review");
      onSubmitted({
        id: data.id || `local-${Date.now()}`,
        collegeSlug,
        author: form.author,
        verification: form.verification,
        verified: false,
        academic: form.academic,
        housing: form.housing,
        placement: form.placement,
        text: form.text.trim(),
        date: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-4 border-brand-100 p-5">
      <p className="font-semibold">Review {collegeName}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="author">Display name</label>
          <input id="author" required className="input" value={form.author} onChange={set("author")} placeholder="e.g. Aarati S." />
        </div>
        <div>
          <label className="label" htmlFor="email">University email (never shown)</label>
          <input id="email" required type="email" className="input" value={form.email} onChange={set("email")} placeholder="you@college.edu" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="verification">How can we verify you?</label>
        <select id="verification" className="input" value={form.verification} onChange={set("verification")}>
          <option value="university_email">University email link</option>
          <option value="student_id">Student ID (we'll email you to upload it)</option>
          <option value="document">Admission letter / fee receipt</option>
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[["academic", "Academics"], ["housing", "Food & housing"], ["placement", "Placements"]].map(([key, label]) => (
          <div key={key}>
            <label className="label">{label}: <span className="font-bold">{form[key]}/5</span></label>
            <input type="range" min={1} max={5} className="range" value={form[key]} onChange={set(key)} />
          </div>
        ))}
      </div>
      <div>
        <label className="label" htmlFor="text">Your experience</label>
        <textarea id="text" rows={4} className="input" value={form.text} onChange={set("text")} placeholder="Teaching, hostel/PG, food, safety, placements, advice for juniors…" />
        <p className="mt-1 text-xs text-slate-400">{form.text.trim().length}/30 characters minimum</p>
      </div>
      {status.error && <p className="text-sm text-brand-600">{status.error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={status.loading} className="btn-primary">{status.loading ? "Submitting…" : "Submit for verification"}</button>
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
      </div>
    </form>
  );
}
