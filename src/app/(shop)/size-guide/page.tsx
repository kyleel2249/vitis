'use client';
import { useState } from 'react';
import { Ruler, RefreshCw, Info, ChevronDown } from 'lucide-react';

const TABS = ['Women\'s', 'Men\'s', 'Kids\'', 'Shoes', 'Accessories'];

type SizeRow = { size: string; us: string; uk: string; eu: string; chest?: string; waist?: string; hips?: string; inseam?: string };

const WOMENS_CLOTHING: SizeRow[] = [
  { size: 'XS', us: '0–2', uk: '4–6', eu: '32–34', chest: '31–32"', waist: '23–24"', hips: '33–34"' },
  { size: 'S', us: '4–6', uk: '8–10', eu: '36–38', chest: '33–34"', waist: '25–26"', hips: '35–36"' },
  { size: 'M', us: '8–10', uk: '12–14', eu: '40–42', chest: '35–36"', waist: '27–28"', hips: '37–38"' },
  { size: 'L', us: '12–14', uk: '16–18', eu: '44–46', chest: '37–39"', waist: '29–31"', hips: '39–41"' },
  { size: 'XL', us: '16–18', uk: '20–22', eu: '48–50', chest: '40–42"', waist: '32–34"', hips: '42–44"' },
  { size: 'XXL', us: '20–22', uk: '24–26', eu: '52–54', chest: '43–45"', waist: '35–37"', hips: '45–47"' },
];

const MENS_CLOTHING: SizeRow[] = [
  { size: 'XS', us: '32', uk: '32', eu: '42', chest: '33–34"', waist: '27–28"', hips: '33–34"' },
  { size: 'S', us: '34', uk: '34', eu: '44', chest: '35–36"', waist: '29–30"', hips: '35–36"' },
  { size: 'M', us: '36–38', uk: '36–38', eu: '46–48', chest: '37–40"', waist: '31–33"', hips: '37–40"' },
  { size: 'L', us: '40–42', uk: '40–42', eu: '50–52', chest: '41–44"', waist: '34–36"', hips: '41–44"' },
  { size: 'XL', us: '44–46', uk: '44–46', eu: '54–56', chest: '45–48"', waist: '37–40"', hips: '45–48"' },
  { size: 'XXL', us: '48–50', uk: '48–50', eu: '58–60', chest: '49–52"', waist: '41–44"', hips: '49–52"' },
];

const KIDS_CLOTHING: SizeRow[] = [
  { size: '2T', us: '2T', uk: '1–2 yrs', eu: '92', chest: '20–21"', waist: '19–20"', hips: '21–22"' },
  { size: '3T', us: '3T', uk: '2–3 yrs', eu: '98', chest: '21–22"', waist: '20–21"', hips: '22–23"' },
  { size: '4T', us: '4T', uk: '3–4 yrs', eu: '104', chest: '22–23"', waist: '21–22"', hips: '23–24"' },
  { size: 'S (5–6)', us: 'S', uk: '5–6 yrs', eu: '110–116', chest: '23–24"', waist: '22–22.5"', hips: '25–26"' },
  { size: 'M (7–8)', us: 'M', uk: '7–8 yrs', eu: '122–128', chest: '25–26"', waist: '23–23.5"', hips: '27–28"' },
  { size: 'L (10–12)', us: 'L', uk: '9–11 yrs', eu: '134–146', chest: '27–29"', waist: '24–25"', hips: '29–31"' },
  { size: 'XL (14–16)', us: 'XL', uk: '12–13 yrs', eu: '152–158', chest: '30–32"', waist: '25.5–27"', hips: '32–34"' },
];

type ShoeRow = { us_w: string; us_m: string; uk: string; eu: string; cm: string };

const SHOES: ShoeRow[] = [
  { us_w: '5', us_m: '3.5', uk: '2.5', eu: '35', cm: '22.0' },
  { us_w: '6', us_m: '4.5', uk: '3.5', eu: '36', cm: '22.9' },
  { us_w: '7', us_m: '5.5', uk: '4.5', eu: '37–38', cm: '23.8' },
  { us_w: '8', us_m: '6.5', uk: '5.5', eu: '38–39', cm: '24.6' },
  { us_w: '9', us_m: '7.5', uk: '6.5', eu: '39–40', cm: '25.4' },
  { us_w: '10', us_m: '8.5', uk: '7.5', eu: '40–41', cm: '26.2' },
  { us_w: '11', us_m: '9.5', uk: '8.5', eu: '41–42', cm: '27.1' },
  { us_w: '12', us_m: '10.5', uk: '9.5', eu: '43', cm: '27.9' },
];

const ACCESS: { type: string; size: string; measurement: string }[] = [
  { type: 'Hat / Cap', size: 'S/M', measurement: '54–56 cm (21.3–22.0")' },
  { type: 'Hat / Cap', size: 'L/XL', measurement: '57–59 cm (22.4–23.2")' },
  { type: 'Gloves', size: 'S', measurement: '17–18 cm hand circumference' },
  { type: 'Gloves', size: 'M', measurement: '19–20 cm hand circumference' },
  { type: 'Gloves', size: 'L', measurement: '21–22 cm hand circumference' },
  { type: 'Belt', size: 'S (28–32")', measurement: 'Waist 71–81 cm' },
  { type: 'Belt', size: 'M (32–36")', measurement: 'Waist 81–91 cm' },
  { type: 'Belt', size: 'L (36–40")', measurement: 'Waist 91–102 cm' },
];

const HOW_TO = [
  { step: 'Chest / Bust', desc: 'Measure around the fullest part of your chest, keeping the tape level.' },
  { step: 'Waist', desc: 'Measure around your natural waist, the narrowest part of your torso.' },
  { step: 'Hips', desc: 'Measure around the fullest part of your hips, about 7–9 inches below your waist.' },
  { step: 'Inseam', desc: 'Measure from your crotch to the bottom of your ankle bone along the inside of your leg.' },
  { step: 'Foot length', desc: 'Stand on paper, trace your foot, then measure from heel to longest toe.' },
];

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  const ClothingTable = ({ rows }: { rows: SizeRow[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {['Size', 'US', 'UK', 'EU', 'Chest', 'Waist', 'Hips'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((r) => (
            <tr key={r.size} className="hover:bg-gray-50/50">
              <td className="px-4 py-3 font-bold text-gray-900">{r.size}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{r.us}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{r.uk}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{r.eu}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{r.chest}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{r.waist}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{r.hips}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sm font-semibold px-3 py-1.5 rounded-full mb-5">
              <Ruler className="w-3.5 h-3.5 text-yellow-400" />
              Find your perfect fit
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Size Guide</h1>
            <p className="text-white/70 text-lg">
              Use our comprehensive size charts to find your perfect fit across clothing, footwear, and accessories.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Tabs */}
        <div className="card overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`flex-shrink-0 px-5 py-4 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === i
                    ? 'border-primary-500 text-primary-600 bg-primary-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-2 sm:p-0">
            {activeTab === 0 && <ClothingTable rows={WOMENS_CLOTHING} />}
            {activeTab === 1 && <ClothingTable rows={MENS_CLOTHING} />}
            {activeTab === 2 && <ClothingTable rows={KIDS_CLOTHING} />}

            {activeTab === 3 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['US Women\'s', 'US Men\'s', 'UK', 'EU', 'Length (cm)'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {SHOES.map((r) => (
                      <tr key={r.us_w} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-bold text-gray-900">{r.us_w}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.us_m}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.uk}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.eu}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.cm} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 4 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Type', 'Size', 'Measurement'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {ACCESS.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900 text-sm">{r.type}</td>
                        <td className="px-4 py-3 font-bold text-gray-900 text-sm">{r.size}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.measurement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* How to measure */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Ruler className="w-6 h-6 text-primary-500" /> How to Measure
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOW_TO.map(({ step, desc }, i) => (
              <div key={step} className="card p-5">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-700 font-black text-sm mb-3">
                  {i + 1}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <div className="card p-6 bg-primary-50 border-primary-100">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Fitting tips</h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li>• Use a flexible tape measure — not a rigid ruler — for accuracy.</li>
                <li>• Measure in your underwear or fitted clothing for the most accurate results.</li>
                <li>• Between two sizes? We recommend sizing up for a more comfortable fit.</li>
                <li>• Different vendors may have slight size variations — check individual product notes where available.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
