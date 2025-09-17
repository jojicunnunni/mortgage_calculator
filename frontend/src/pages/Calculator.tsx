// src/pages/Calculator.tsx
import React, { useMemo } from "react"
import { monthlyPayment } from "../lib/calc"

/* ===================== Local persistence (localStorage) ===================== */
function useLocalState<T>(key: string, initial: T) {
  const read = () => {
    if (typeof window === "undefined") return initial
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  }

  const [state, setState] = React.useState<T>(read)

  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      /* ignore quota errors */
    }
  }, [key, state])

  return [state, setState] as const
}

/* ============================== Helpers / UI =============================== */
const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(Number.isFinite(n) ? n : 0)

const fmtNum = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0
  )

function Field({
  id,
  label,
  help,
  children
}: {
  id: string
  label: string
  help?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <label htmlFor={id} className="text-sm font-medium text-gray-800">
          {label}
        </label>
        {help && <Tooltip text={help} />}
      </div>
      {children}
    </div>
  )
}

function Tooltip({ text }: { text: string }) {
  return (
    <span className="relative inline-block select-none group" aria-label={text}>
      <svg
        aria-hidden="true"
        className="h-4 w-4 text-gray-400 group-hover:text-gray-700"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm-.75-5.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-.75v-2a.75.75 0 0 0-1.5 0v2H9.25Zm.75-6a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
      </svg>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 z-10 hidden w-64 -translate-x-1/2 translate-y-2 rounded-md border bg-white p-2 text-xs text-gray-700 shadow-md ring-1 ring-black/5 group-hover:block"
      >
        {text}
      </span>
    </span>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  )
}

/* ================================== Page ================================== */

type FormState = {
  principal: number
  rate: number
  years: number
  extra: number
}

const DEFAULTS: FormState = {
  principal: 6500000,
  rate: 8.5,
  years: 20,
  extra: 0
}

export default function Calculator() {
  // Version the key so future changes don’t break older saved data
  const [form, setForm] = useLocalState<FormState>("mc:form:v1", DEFAULTS)
  const { principal, rate, years, extra } = form
  const set = (patch: Partial<FormState>) => setForm({ ...form, ...patch })

  const monthly = useMemo(
    () => monthlyPayment(principal, rate, years, 12, extra),
    [principal, rate, years, extra]
  )
  const totalMonths = years * 12
  const totalPaid = monthly * totalMonths
  const totalInterest = Math.max(0, totalPaid - principal)
  const principalShare = principal / Math.max(1, principal + totalInterest)

  function reset() {
    setForm(DEFAULTS)
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mortgage Calculator</h1>
          <p className="mt-1 text-gray-600">Fast, simple, and reliable. Your inputs are saved for next time.</p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
          title="Reset all fields to default values"
        >
          Reset
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="grid gap-4 p-6 md:grid-cols-3">
          <Stat label="Monthly Payment" value={fmtINR(monthly)} />
          <Stat label="Total Interest" value={fmtINR(totalInterest)} />
          <Stat label="Total Paid" value={fmtINR(totalPaid)} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Inputs */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="mb-4 text-lg font-semibold">Loan Details</h2>

          {/* Principal */}
          <Field
            id="principal"
            label="Principal"
            help="The total loan amount you are borrowing from the lender."
          >
            <div className="flex">
              <span className="inline-flex items-center rounded-l-xl border border-r-0 bg-gray-50 px-3 text-sm text-gray-500">₹</span>
              <input
                id="principal"
                className="input w-full rounded-l-none"
                type="number"
                min={10000}
                step={5000}
                value={principal}
                onChange={(e) => set({ principal: Number(e.target.value) })}
                placeholder="Enter loan amount"
              />
            </div>
            <input
              className="mt-2 w-full"
              type="range"
              min={500000}
              max={10000000}
              step={50000}
              value={principal}
              onChange={(e) => set({ principal: Number(e.target.value) })}
            />
            <div className="mt-1 text-right text-xs text-gray-500">{fmtINR(principal)}</div>
          </Field>

          {/* Interest Rate */}
          <Field
            id="rate"
            label="Interest rate (APR %)"
            help="The annual percentage rate charged by your lender. Use the slider for quick tweaks."
          >
            <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
              <input
                id="rate"
                className="input w-full"
                type="number"
                min={0}
                max={30}
                step={0.05}
                value={rate}
                onChange={(e) => set({ rate: Number(e.target.value) })}
                placeholder="Annual interest rate"
              />
              <div className="text-sm text-gray-500 md:text-right">{rate.toFixed(2)}%</div>
            </div>
            <input
              className="mt-2 w-full"
              type="range"
              min={0}
              max={20}
              step={0.05}
              value={rate}
              onChange={(e) => set({ rate: Number(e.target.value) })}
            />
          </Field>

          {/* Term (Years) */}
          <Field
            id="years"
            label="Term (years)"
            help="How long you’ll take to repay the loan in full."
          >
            <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
              <input
                id="years"
                className="input w-full"
                type="number"
                min={1}
                max={40}
                step={1}
                value={years}
                onChange={(e) => set({ years: Number(e.target.value) })}
                placeholder="Loan term in years"
              />
              <div className="text-sm text-gray-500 md:text-right">{years} yrs</div>
            </div>
            <input
              className="mt-2 w-full"
              type="range"
              min={1}
              max={40}
              step={1}
              value={years}
              onChange={(e) => set({ years: Number(e.target.value) })}
            />
            <div className="mt-1 text-right text-xs text-gray-500">{fmtNum(totalMonths)} months total</div>
          </Field>

          {/* Extra Payment */}
          <Field
            id="extra"
            label="Extra payment / month"
            help="Optional additional monthly amount to shorten your payoff time and reduce interest."
          >
            <div className="flex">
              <span className="inline-flex items-center rounded-l-xl border border-r-0 bg-gray-50 px-3 text-sm text-gray-500">₹</span>
              <input
                id="extra"
                className="input w-full rounded-l-none"
                type="number"
                min={0}
                step={500}
                value={extra}
                onChange={(e) => set({ extra: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </Field>

          <p className="mt-3 text-xs text-gray-500">
            Estimates only; not financial advice. Values are saved locally in your browser.
          </p>
        </div>

        {/* Visualization */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="mb-4 text-lg font-semibold">Breakdown</h2>

          <div className="space-y-3">
            <Legend colorClass="bg-emerald-500" label="Principal" value={fmtINR(principal)} />
            <Legend colorClass="bg-indigo-500" label="Interest" value={fmtINR(totalInterest)} />
          </div>

          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${principalShare * 100}%` }}
              title="Principal"
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">Green ≈ Principal; remaining ≈ Interest</div>

          <div className="mt-6 rounded-xl border p-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-500">Est. Monthly</div>
              <div className="text-right font-semibold">{fmtINR(monthly)}</div>
              <div className="text-gray-500">Total Interest</div>
              <div className="text-right">{fmtINR(totalInterest)}</div>
              <div className="text-gray-500">Total Paid</div>
              <div className="text-right">{fmtINR(totalPaid)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Legend({ colorClass, label, value }: { colorClass: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`h-3 w-3 rounded-sm ${colorClass}`}></span>
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-sm text-gray-700">{value}</div>
    </div>
  )
}
