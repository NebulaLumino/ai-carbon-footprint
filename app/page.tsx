"use client";

import { useState } from "react";

const INPUTS_3871 = [
  { id: "household_size", label: "Household Size", placeholder: "e.g., 4", type: "text" },
  { id: "location", label: "Country / Region", placeholder: "e.g., United States, California", type: "text" },
  { id: "home_type", label: "Home Type", placeholder: "e.g., Single-family house, Apartment", type: "text" },
  { id: "electricity_kwh", label: "Monthly Electricity Usage (kWh)", placeholder: "e.g., 800", type: "text" },
  { id: "gas_bill", label: "Monthly Gas Bill ($)", placeholder: "e.g., 120", type: "text" },
  { id: "car_miles", label: "Annual Car Miles Driven", placeholder: "e.g., 12000", type: "text" },
  { id: "diet", label: "Diet Type", placeholder: "e.g., Omnivore, Vegetarian, Vegan", type: "text" },
  { id: "flights_per_year", label: "Number of Flights per Year", placeholder: "e.g., 6", type: "text" },
  { id: "waste_weekly_lbs", label: "Weekly Waste (lbs)", placeholder: "e.g., 30", type: "text" },
  { id: "recycling_percentage", label: "Recycling Percentage (%)", placeholder: "e.g., 40", type: "text" },
];

export default function CarbonFootprintPage() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChange = (id: string, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult("");
    const inputsStr = INPUTS_3871.map((f) => `${f.label}: ${form[f.id] || "Not provided"}`).join("\n");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: inputsStr }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-emerald-900/50 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl">
            🌿
          </div>
          <div>
            <h1 className="text-xl font-bold text-emerald-400">AI Carbon Footprint Tracker</h1>
            <p className="text-xs text-gray-400">Estimate your carbon footprint & get reduction advice</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 grid md:grid-cols-2 gap-8">
        {/* Input Form */}
        <section>
          <div className="bg-gray-900/60 border border-emerald-900/40 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">
              📋 Your Information
            </h2>
            <div className="space-y-4">
              {INPUTS_3871.map((field) => (
                <div key={field.id} className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400 font-medium" htmlFor={field.id}>
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="bg-gray-800/80 border border-emerald-900/50 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                </div>
              ))}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:text-emerald-200 text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm tracking-wide shadow-lg shadow-emerald-900/30"
              >
                {loading ? "⏳ Analyzing..." : "🌍 Analyze My Footprint"}
              </button>
            </div>
          </div>
        </section>

        {/* Output */}
        <section>
          <div className="bg-gray-900/60 border border-emerald-900/40 rounded-2xl p-6 h-full flex flex-col">
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">
              📊 Analysis Report
            </h2>
            <div className="flex-1 overflow-auto">
              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 border border-red-800/50 rounded-lg p-4">
                  ❌ {error}
                </div>
              )}
              {loading && !result && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm">Calculating your carbon footprint...</p>
                </div>
              )}
              {!loading && !result && !error && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                  <span className="text-4xl mb-3">🌍</span>
                  <p className="text-sm text-center">Fill in your information and click<br />&ldquo;Analyze My Footprint&rdquo; to get started</p>
                </div>
              )}
              {result && (
                <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {result}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-emerald-900/30 px-6 py-4 text-center text-xs text-gray-600">
        Powered by DeepSeek AI · Cycle 127 Environmental AI
      </footer>
    </div>
  );
}
