export function monthlyPayment(principal: number, apr: number, years: number, n = 12, extra = 0) {
  const r = apr / 100 / n
  const total = years * n
  if (r === 0) return principal / total + extra
  return principal * (r * (1 + r) ** total) / ((1 + r) ** total - 1) + extra
}
