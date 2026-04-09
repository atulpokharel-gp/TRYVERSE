"use client";

import { useState } from "react";
import BodyAvatar from "@/components/body/BodyAvatar";
import { Upload, Ruler, CheckCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "upload" | "measurements";
type Step = "input" | "result";

interface BodyProfile {
  shape: string;
  sizeCategory: string;
  fitSuggestions: string[];
  avatarType: string;
}

export default function BodyScanPage() {
  const [tab, setTab] = useState<Tab>("measurements");
  const [step, setStep] = useState<Step>("input");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<BodyProfile | null>(null);

  // Measurement form state
  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    inseam: "",
  });

  // Photo upload state
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [sidePhoto, setSidePhoto] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "side") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (side === "front") setFrontPhoto(url);
    else setSidePhoto(url);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const body = {
        measurements: {
          height: measurements.height ? Number(measurements.height) : undefined,
          weight: measurements.weight ? Number(measurements.weight) : undefined,
          chest: measurements.chest ? Number(measurements.chest) : undefined,
          waist: measurements.waist ? Number(measurements.waist) : undefined,
          hips: measurements.hips ? Number(measurements.hips) : undefined,
          inseam: measurements.inseam ? Number(measurements.inseam) : undefined,
        },
      };
      const res = await fetch("/api/body-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setProfile(data);
      setStep("result");
    } finally {
      setLoading(false);
    }
  };

  if (step === "result" && profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            <CheckCircle className="h-4 w-4" /> Body Profile Generated
          </div>
          <h1 className="mt-4 text-3xl font-black text-gray-900">Your Body Profile</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Avatar */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
            <BodyAvatar shape={profile.avatarType} size="lg" />
            <p className="mt-4 text-lg font-bold text-gray-900 capitalize">{profile.shape} Shape</p>
            <p className="text-sm text-gray-500">Size Category: {profile.sizeCategory}</p>
          </div>

          {/* Fit suggestions */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Fit Recommendations</h2>
            <div className="space-y-3">
              {profile.fitSuggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">{s}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-xs text-gray-500">Top Size</p>
                <p className="text-lg font-black text-gray-900">{profile.sizeCategory}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-xs text-gray-500">Body Shape</p>
                <p className="text-sm font-black text-gray-900 capitalize">{profile.shape}</p>
              </div>
            </div>

            <button
              onClick={() => setStep("input")}
              className="mt-4 w-full rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Update Measurements
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-900">AI Body Scan</h1>
        <p className="mt-2 text-gray-500">
          Generate your personal body profile for size-perfect recommendations.
        </p>
      </div>

      {/* Tab toggle */}
      <div className="mb-8 flex rounded-2xl bg-gray-100 p-1">
        <button
          onClick={() => setTab("measurements")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all",
            tab === "measurements" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Ruler className="h-4 w-4" /> Enter Measurements
        </button>
        <button
          onClick={() => setTab("upload")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all",
            tab === "upload" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Upload className="h-4 w-4" /> Upload Photos
        </button>
      </div>

      {tab === "measurements" ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "height", label: "Height (cm)", placeholder: "e.g. 165" },
              { key: "weight", label: "Weight (kg)", placeholder: "e.g. 60" },
              { key: "chest", label: "Chest / Bust (cm)", placeholder: "e.g. 88" },
              { key: "waist", label: "Waist (cm)", placeholder: "e.g. 70" },
              { key: "hips", label: "Hips (cm)", placeholder: "e.g. 95" },
              { key: "inseam", label: "Inseam (cm)", placeholder: "e.g. 75" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{field.label}</label>
                <input
                  type="number"
                  placeholder={field.placeholder}
                  value={measurements[field.key as keyof typeof measurements]}
                  onChange={(e) => setMeasurements((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Front View", value: frontPhoto, side: "front" as const },
              { label: "Side View", value: sidePhoto, side: "side" as const },
            ].map((upload) => (
              <div key={upload.side}>
                <p className="mb-2 text-xs font-semibold text-gray-700">{upload.label}</p>
                <label className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors overflow-hidden">
                  {upload.value ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={upload.value} alt={upload.label} className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-300" />
                      <p className="mt-2 text-xs text-gray-400">Click to upload</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, upload.side)}
                  />
                </label>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-400 text-center">
            Photos are processed locally and never stored on our servers.
          </p>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 text-sm font-bold text-white shadow-lg hover:opacity-90 disabled:opacity-60 transition-opacity"
      >
        {loading ? "Analysing…" : "Generate Body Profile"}
        {!loading && <ChevronRight className="h-4 w-4" />}
      </button>
    </div>
  );
}
