// src/app/App.tsx
import Calculator from "../pages/Calculator"

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="mx-auto max-w-3xl p-6">
        <h1 className="text-3xl font-bold">Mortgage Calculator</h1>
        <p className="text-gray-600">Fast, simple, and reliable.</p>
      </header>

      <main className="mx-auto max-w-3xl p-6">
        <Calculator />
      </main>
    </div>
  )
}
