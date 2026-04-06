import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle"
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const { error } = await supabase.from("contact_submissions").insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });
    if (error) {
      console.error(error);
      setStatus("err");
      return;
    }
    setStatus("ok");
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-maroon">
        Contact
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold text-brand-blue">
        Contact us
      </h1>
      <p className="mt-4 text-brand-blue/85">
        Reach the Old Boys’ Association secretariat. Replace the placeholder
        details below with your official contacts in production.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="rounded-2xl border border-brand-gray bg-brand-gray/40 p-6">
          <h2 className="font-display text-lg font-bold text-brand-blue">
            Secretariat
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-brand-blue/90">
            <li>Zahira College Mawanella</li>
            <li>
              Email:{" "}
              <span className="text-brand-maroon">oba@zahiramawanella.example</span>
            </li>
            <li>Phone: +94 XX XXX XXXX</li>
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-brand-gray bg-white p-6 shadow-sm"
        >
          <h2 className="font-display text-lg font-bold text-brand-blue">
            Send a message
          </h2>
          <label className="mt-4 block text-xs font-bold uppercase text-brand-blue/70">
            Name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-gray px-3 py-2 text-sm"
            />
          </label>
          <label className="mt-3 block text-xs font-bold uppercase text-brand-blue/70">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-gray px-3 py-2 text-sm"
            />
          </label>
          <label className="mt-3 block text-xs font-bold uppercase text-brand-blue/70">
            Message
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-gray px-3 py-2 text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-6 w-full rounded-full bg-brand-maroon py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-blue disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Submit"}
          </button>
          {status === "ok" && (
            <p className="mt-3 text-sm text-green-700">Thank you — we’ll be in touch.</p>
          )}
          {status === "err" && (
            <p className="mt-3 text-sm text-red-700">
              Could not send. Check your connection and Supabase configuration.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
