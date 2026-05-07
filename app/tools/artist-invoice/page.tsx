"use client";
import { useState, useRef } from "react";
import Link from "next/link";

interface LineItem {
  id: number;
  description: string;
  type: string;
  qty: string;
  rate: string;
}

const ITEM_TYPES = [
  "Session Fee",
  "Beat License (Non-Exclusive)",
  "Beat License (Exclusive)",
  "Beat Purchase (Exclusive Rights)",
  "Sync License",
  "Gig / Performance",
  "Producer Points (%)",
  "Mix & Master",
  "Co-Write Fee",
  "Vocal Feature",
  "Custom",
];

let nextId = 3;

export default function ArtistInvoicePage() {
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toName, setToName] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [invoiceNum, setInvoiceNum] = useState(`INV-${new Date().getFullYear()}-001`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: "", type: "Session Fee", qty: "1", rate: "" },
    { id: 2, description: "", type: "Beat License (Non-Exclusive)", qty: "1", rate: "" },
  ]);

  const printRef = useRef<HTMLDivElement>(null);

  const addItem = () => setItems(i => [...i, { id: nextId++, description: "", type: "Session Fee", qty: "1", rate: "" }]);
  const removeItem = (id: number) => setItems(i => i.filter(x => x.id !== id));
  const updateItem = (id: number, field: keyof LineItem, value: string) =>
    setItems(i => i.map(x => x.id === id ? { ...x, [field]: value } : x));

  const lineTotal = (item: LineItem) => (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
  const subtotal = items.reduce((s, i) => s + lineTotal(i), 0);

  const canDownload = fromName && toName && items.some(i => i.rate);

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Invoice ${invoiceNum}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, sans-serif; padding: 48px; color: #111; max-width: 760px; margin: 0 auto; font-size: 14px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 2px solid #eee; }
        .brand { font-size: 28px; font-weight: 900; letter-spacing: -0.5px; }
        .invoice-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 4px; }
        .invoice-num { font-size: 20px; font-weight: 700; }
        .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
        .party-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #888; margin-bottom: 6px; font-weight: 700; }
        .party-name { font-weight: 700; font-size: 15px; margin-bottom: 2px; }
        .party-detail { color: #666; font-size: 13px; line-height: 1.5; }
        .dates { display: flex; gap: 32px; margin-bottom: 32px; padding: 16px; background: #f9f9f9; border-radius: 8px; }
        .date-item label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; display: block; margin-bottom: 3px; }
        .date-item span { font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; padding: 10px 12px; border-bottom: 2px solid #eee; font-weight: 700; }
        th.right, td.right { text-align: right; }
        td { padding: 12px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
        .item-desc { font-weight: 600; font-size: 14px; }
        .item-type { font-size: 11px; color: #888; margin-top: 2px; }
        .totals { margin-left: auto; width: 280px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
        .grand-total { display: flex; justify-content: space-between; padding: 14px 0 0; font-size: 18px; font-weight: 900; }
        .notes-section { margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee; }
        .notes-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 8px; font-weight: 700; }
        .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #eee; font-size: 11px; color: #aaa; text-align: center; }
        @media print { body { padding: 24px; } }
      </style></head><body>
      <div class="header">
        <div>
          <div class="brand">${fromName || "Your Name"}</div>
          <div style="color:#888;font-size:13px;margin-top:4px;">${fromEmail || ""}</div>
          <div style="color:#888;font-size:13px;margin-top:2px;white-space:pre-line;">${fromAddress || ""}</div>
        </div>
        <div style="text-align:right;">
          <div class="invoice-label">Invoice</div>
          <div class="invoice-num">${invoiceNum}</div>
        </div>
      </div>
      <div class="parties">
        <div>
          <div class="party-label">From</div>
          <div class="party-name">${fromName || "—"}</div>
          <div class="party-detail">${fromEmail || ""}</div>
        </div>
        <div>
          <div class="party-label">Bill To</div>
          <div class="party-name">${toName || "—"}</div>
          <div class="party-detail">${toEmail || ""}</div>
        </div>
      </div>
      <div class="dates">
        <div class="date-item"><label>Invoice Date</label><span>${invoiceDate ? new Date(invoiceDate + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}</span></div>
        ${dueDate ? `<div class="date-item"><label>Due Date</label><span>${new Date(dueDate + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span></div>` : ""}
      </div>
      <table>
        <thead><tr><th>Description</th><th class="right">Qty</th><th class="right">Rate</th><th class="right">Amount</th></tr></thead>
        <tbody>
          ${items.filter(i => i.rate).map(i => `
            <tr>
              <td><div class="item-desc">${i.description || i.type}</div><div class="item-type">${i.type}</div></td>
              <td class="right">${i.qty}</td>
              <td class="right">${fmt(parseFloat(i.rate) || 0)}</td>
              <td class="right"><strong>${fmt(lineTotal(i))}</strong></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <div class="totals">
        <div class="total-row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
        <div class="grand-total"><span>Total Due</span><span>${fmt(subtotal)}</span></div>
      </div>
      ${notes ? `<div class="notes-section"><div class="notes-label">Notes</div><p style="color:#444;line-height:1.6;">${notes}</p></div>` : ""}
      <div class="footer">Generated by MusicRight.AI — musicright.ai &nbsp;·&nbsp; This is not a contract. For licensing agreements, consult an attorney.</div>
      </body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  const inputClass = "w-full h-10 bg-[#111] border border-[#2e2e2e] rounded-lg px-3 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#00d4aa]/50 transition-colors";

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
            <span className="font-bold text-sm">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-[#555] text-sm hover:text-white transition-colors">← All Tools</Link>
            <button onClick={handlePrint} disabled={!canDownload}
              className="h-8 px-4 rounded-lg bg-[#00d4aa] text-[#080808] text-xs font-bold hover:bg-[#00b894] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Download PDF
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        <div className="mb-8">
          <Link href="/tools" className="text-[#555] text-sm hover:text-[#a0a0a0] mb-4 block">← All Tools</Link>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Artist Invoice Generator</h1>
          <p className="text-[#a0a0a0] text-base">
            Music-native invoicing for session fees, beat licenses, sync deals, gigs, and producer points.
            Download a clean PDF ready to send.
          </p>
        </div>

        {/* From / To */}
        <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-6 mb-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Invoice Details</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <div className="text-[#555] text-[10px] font-bold uppercase tracking-wider">From (You)</div>
              <div>
                <label className="text-[#555] text-[10px] uppercase tracking-wider mb-1 block">Your name *</label>
                <input value={fromName} onChange={e => setFromName(e.target.value)} placeholder="DJ Khaled / Studio Name" className={inputClass} />
              </div>
              <div>
                <label className="text-[#555] text-[10px] uppercase tracking-wider mb-1 block">Email</label>
                <input value={fromEmail} onChange={e => setFromEmail(e.target.value)} placeholder="you@email.com" className={inputClass} />
              </div>
              <div>
                <label className="text-[#555] text-[10px] uppercase tracking-wider mb-1 block">Address / Business info</label>
                <textarea value={fromAddress} onChange={e => setFromAddress(e.target.value)} placeholder="City, State&#10;Tax ID (optional)" rows={2}
                  className="w-full bg-[#111] border border-[#2e2e2e] rounded-lg px-3 py-2 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#00d4aa]/50 transition-colors resize-none" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-[#555] text-[10px] font-bold uppercase tracking-wider">Bill To (Client)</div>
              <div>
                <label className="text-[#555] text-[10px] uppercase tracking-wider mb-1 block">Client name *</label>
                <input value={toName} onChange={e => setToName(e.target.value)} placeholder="Label / Artist / Manager" className={inputClass} />
              </div>
              <div>
                <label className="text-[#555] text-[10px] uppercase tracking-wider mb-1 block">Client email</label>
                <input value={toEmail} onChange={e => setToEmail(e.target.value)} placeholder="client@email.com" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#555] text-[10px] uppercase tracking-wider mb-1 block">Invoice #</label>
                  <input value={invoiceNum} onChange={e => setInvoiceNum(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-[#555] text-[10px] uppercase tracking-wider mb-1 block">Due date</label>
                  <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Line Items</h2>
            <button onClick={addItem} className="text-[#00d4aa] text-xs font-semibold hover:underline">+ Add item</button>
          </div>

          <div className="flex flex-col gap-3">
            {items.map((item, i) => (
              <div key={item.id} className="rounded-xl border border-[#1a1a1a] bg-[#111] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#555] text-xs font-semibold">Item {i + 1}</span>
                  {items.length > 1 && (
                    <button onClick={() => removeItem(item.id)} className="text-[#555] text-xs hover:text-[#ff4757]">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="col-span-2">
                    <label className="text-[#555] text-[10px] uppercase tracking-wider mb-1 block">Type</label>
                    <select value={item.type} onChange={e => updateItem(item.id, "type", e.target.value)}
                      className="w-full h-9 bg-[#0e0e0e] border border-[#2e2e2e] rounded-lg px-3 text-white text-sm focus:outline-none focus:border-[#00d4aa]/50">
                      {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[#555] text-[10px] uppercase tracking-wider mb-1 block">Qty</label>
                    <input type="number" min="0" step="0.5" value={item.qty} onChange={e => updateItem(item.id, "qty", e.target.value)}
                      className="w-full h-9 bg-[#0e0e0e] border border-[#2e2e2e] rounded-lg px-3 text-white text-sm focus:outline-none focus:border-[#00d4aa]/50" />
                  </div>
                  <div>
                    <label className="text-[#555] text-[10px] uppercase tracking-wider mb-1 block">Rate ($) *</label>
                    <input type="number" min="0" step="0.01" value={item.rate} onChange={e => updateItem(item.id, "rate", e.target.value)} placeholder="0.00"
                      className="w-full h-9 bg-[#0e0e0e] border border-[#2e2e2e] rounded-lg px-3 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#00d4aa]/50" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[#555] text-[10px] uppercase tracking-wider mb-1 block">Description (optional)</label>
                    <input value={item.description} onChange={e => updateItem(item.id, "description", e.target.value)} placeholder="e.g. 3-hour studio session, track name, project…"
                      className="w-full h-9 bg-[#0e0e0e] border border-[#2e2e2e] rounded-lg px-3 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#00d4aa]/50" />
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <span className="text-[#a0a0a0] text-sm font-bold">{fmt(lineTotal(item))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <div className="rounded-xl border border-[#1a1a1a] bg-[#111] px-5 py-3 text-right">
              <div className="text-[#555] text-xs mb-1">Total Due</div>
              <div className="text-white text-2xl font-black">{fmt(subtotal)}</div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-6 mb-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Notes (optional)</h2>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            placeholder="Payment terms, bank info, licensing restrictions, credit language..."
            className="w-full bg-[#111] border border-[#2e2e2e] rounded-lg px-3 py-2 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#00d4aa]/50 transition-colors resize-none" />
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <button onClick={handlePrint} disabled={!canDownload}
            className="h-12 px-8 rounded-xl bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Download Invoice PDF
          </button>
          <Link href="/start"
            className="h-12 px-6 rounded-xl border border-[#00d4aa]/20 bg-[#00d4aa]/5 text-[#00d4aa] font-semibold text-sm flex items-center hover:bg-[#00d4aa]/10 transition-colors">
            Check Song Royalties →
          </Link>
        </div>

        <div className="mt-6 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-4 text-[#555] text-xs leading-relaxed">
          <strong className="text-[#a0a0a0]">Pro tip:</strong> For beat licenses, always specify exclusive vs. non-exclusive in the description.
          Non-exclusive beats can be resold — exclusive means only you own it. Include that language in your invoice notes or attach a formal license agreement.
        </div>
      </div>
    </div>
  );
}
