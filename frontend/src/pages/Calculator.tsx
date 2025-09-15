import { useState, Suspense } from 'react'
import { useMutation } from '@tanstack/react-query'
import { calculateMortgage } from '../api/mortgage'
import { monthlyPayment } from '../lib/calc'

export default function Calculator() {
  const [principal, setPrincipal] = useState(6500000) // example INR default?
  const [rate, setRate] = useState(8.5)
  const [years, setYears] = useState(20)
  const [extra, setExtra] = useState(0)

  const est = monthlyPayment(principal, rate, years)

  const mutation = useMutation({
    mutationFn: () => calculateMortgage({ principal, annual_interest_rate: rate, term_years: years, extra_payment: extra })
  })

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Mortgage Calculator</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <input className="input" type="number" value={principal} onChange={e=>setPrincipal(+e.target.value)} placeholder="Principal" />
        <input className="input" type="number" step="0.01" value={rate} onChange={e=>setRate(+e.target.value)} placeholder="Annual Interest (%)" />
        <input className="input" type="number" value={years} onChange={e=>setYears(+e.target.value)} placeholder="Years" />
        <input className="input" type="number" value={extra} onChange={e=>setExtra(+e.target.value)} placeholder="Extra Payment (monthly)" />
      </div>

      <div className="mt-4 rounded-xl border p-4">
        <div className="text-sm text-gray-500">Instant estimate</div>
        <div className="text-3xl font-bold">₹ {est.toFixed(2)}</div>
      </div>

      <button
        className="mt-6 w-full rounded-xl border px-4 py-3 hover:bg-gray-50"
        onClick={()=>mutation.mutate()}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Calculating...' : 'Get full schedule'}
      </button>

      {mutation.isSuccess && (
        <div className="mt-6 rounded-xl border p-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Monthly payment</div><div className="text-right font-semibold">₹ {mutation.data.monthly_payment.toFixed(2)}</div>
            <div>Total interest</div><div className="text-right">₹ {mutation.data.total_interest.toFixed(2)}</div>
            <div>Payoff months</div><div className="text-right">{mutation.data.payoff_months}</div>
          </div>
          <div className="mt-4 max-h-72 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr><th className="text-left">Month</th><th className="text-right">Interest</th><th className="text-right">Principal</th><th className="text-right">Balance</th></tr>
              </thead>
              <tbody>
                {mutation.data.schedule.map(r=>(
                  <tr key={r.month} className="border-t">
                    <td>{r.month}</td>
                    <td className="text-right">₹ {r.interest.toFixed(2)}</td>
                    <td className="text-right">₹ {r.principal.toFixed(2)}</td>
                    <td className="text-right">₹ {r.balance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
