type Req = {
  principal: number
  annual_interest_rate: number
  term_years: number
  extra_payment?: number
  compounding_per_year?: number
}

export type Payment = { month: number; interest: number; principal: number; balance: number }
export type Resp = {
  monthly_payment: number
  total_interest: number
  total_paid: number
  payoff_months: number
  schedule: Payment[]
}

import { api } from './client'
export const calculateMortgage = async (payload: Req) => {
  const { data } = await api.post<Resp>('/api/mortgage/calculate', payload)
  return data
}
