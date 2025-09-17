// src/pages/Calculator.tsx
import { useState } from "react"
import { monthlyPayment } from "../lib/calc"

export default function Calculator() {
  const [principal, setPrincipal] = useState(6500000) // example
  const [rate, setRate] = useState(8.5)
  const [years, setYears] = useState(20)
  const [extra, setExtra] = useState(0)

  const est = monthlyPayment(principal, rate, years, 12, extra)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input className="input" type="number" value={principal} onChange={e=>setPrincipal(+e.target.value)} placeholder="Principal" />
        <input className="input" type="number" step="0.01" value={rate} onChange={e=>setRate(+e.target.value)} placeholder="Annual Interest (%)" />
        <input className="input" type="number" value={years} onChange={e=>setYears(+e.target.value)} placeholder="Years" />
        <input className="input" type="number" value={extra} onChange={e=>setExtra(+e.target.value)} placeholder="Extra Payment / month" />
      </div>

      <div className="rounded-xl border p-4">
        <div className="text-sm text-gray-500">Estimated monthly payment</div>
        <div className="text-3xl font-bold">₹ {est.toFixed(2)}</div>
      </div>
    </div>
  )
}
