import { useState } from 'react';
import {
  ComposedChart, Bar, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';
import { useSocket } from '../context/SocketContext';
import {
  Hotel, Gift, TrendingUp, Users, IndianRupee, Zap, CheckCircle,
  Clock, Tag, Star, Send, Loader2, RefreshCw, BarChart2, AlertCircle, Percent, FileText, Download
} from 'lucide-react';

const SEVEN_DAY_DATA = [
  { day: 'Mon', baseline: 420,  balanced: 380,  revenue: 38000 },
  { day: 'Tue', baseline: 380,  balanced: 420,  revenue: 42000 },
  { day: 'Wed', baseline: 510,  balanced: 590,  revenue: 59000 },
  { day: 'Thu', baseline: 470,  balanced: 530,  revenue: 53000 },
  { day: 'Fri', baseline: 680,  balanced: 810,  revenue: 81000 },
  { day: 'Sat', baseline: 920,  balanced: 1140, revenue: 114000 },
  { day: 'Sun', baseline: 1050, balanced: 1290, revenue: 129000 },
];

const SEED_VOUCHERS = [
  { id: 'V-001', invoiceId: 'INV-2026-901', code: 'JAIGARH20',     tourist: 'Visitor #A8F2', time: '16:39:30', status: 'Settled', perk: '20% off + Complimentary Refreshment' },
  { id: 'V-002', invoiceId: 'INV-2026-902', code: 'MEHTAB25',      tourist: 'Visitor #B3C7', time: '16:35:14', status: 'Pending', perk: '25% off Sunset View' },
  { id: 'V-003', invoiceId: 'INV-2026-903', code: 'ASSIGHAT15',    tourist: 'Visitor #D9E1', time: '16:31:52', status: 'Settled', perk: '15% off Boat Tour' },
  { id: 'V-004', invoiceId: 'INV-2026-904', code: 'HERITAGEDELHI', tourist: 'Visitor #F4A2', time: '16:28:09', status: 'Pending', perk: '20% off + Audio Guide Included' },
  { id: 'V-005', invoiceId: 'INV-2026-905', code: 'MORJIMPERK',    tourist: 'Visitor #K2M9', time: '16:22:44', status: 'Settled', perk: 'Complimentary Welcome Perk' },
];

function MetricCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-2 shadow-xs">
      <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
        <Icon size={18} className="text-emerald-800" />
      </div>
      <div>
        <div className="text-xs text-slate-500 font-semibold">{label}</div>
        <div className="text-xl font-bold text-slate-900 mt-0.5 leading-none">{value}</div>
        {sub && <div className="text-[11px] text-slate-500 mt-1 font-medium">{sub}</div>}
      </div>
    </div>
  );
}

export default function HotelPortal() {
  const { selectedCity, isConnected } = useSocket();

  const [formData, setFormData] = useState({
    businessName: 'Rajputana Heritage Café & Dining',
    category: 'Restaurant',
    couponCode: 'RAJPUTANA20',
    discountPercent: 20,
    perk: '20% Off Heritage Dining + Complimentary Tea',
    monumentName: 'Amber Fort',
  });

  const [publishing, setPublishing] = useState(false);
  const [pubSuccess, setPubSuccess] = useState(false);

  const handlePublish = (e) => {
    e.preventDefault();
    setPublishing(true);

    setTimeout(() => {
      setPublishing(false);
      setPubSuccess(true);
      setTimeout(() => setPubSuccess(false), 3500);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-6">

        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-md">
                MERCHANT PORTAL
              </span>
              <span className="text-xs text-slate-500 font-mono">Local Business Exchange</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
              Partner Shops & Restaurant Deals
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-0.5">
              Publish discount deals for redirected tourists, verify tourist coupons, and track earnings.
            </p>
          </div>
        </div>

        {/* Partner Hospitality & Artisan Showcase Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col group">
            <div className="relative w-full h-48 sm:h-52 overflow-hidden rounded-t-xl bg-slate-900 shrink-0">
              <img
                src="https://i.pinimg.com/1200x/a2/bb/d5/a2bbd55e26b31e5157b770d5e5292c0d.jpg"
                alt="Heritage Dining & Thali Cafés"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80";
                }}
              />
            </div>
            <div className="p-4 flex flex-col justify-between space-y-2 flex-1">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase font-mono bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Category Showcase
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">Heritage Dining & Thali Cafés</h3>
                <p className="text-xs text-slate-500 font-medium">Partner restaurants receive automatic footfall vouchers during peak monument rush hours.</p>
              </div>
              <div className="text-[11px] font-bold text-emerald-800 font-mono pt-1 border-t border-slate-100">
                Average +32% Meal Vouchers Claimed
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col group">
            <div className="h-36 relative overflow-hidden bg-slate-900 shrink-0">
              <img
                src="https://lh3.googleusercontent.com/grass-cs/ACvplmOG2_X-jHM_3MMlz_BS6pVTObyS5C9HZUis9RnQZopRCmNzrHPnJX0lKcp4S6ItqzhwqZ3hxVaEm5ZiMf9LfuyBYmDE0FIKWkn9i0MaKPm8he2OLg7VQhcyqN6Kv_ZiP4RgGLgLBQYUqoh9=s294-w294-h220-n-k-no"
                alt="Local Merchant Showcase"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div className="p-4 flex flex-col justify-between space-y-2 flex-1">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase font-mono bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Category Showcase
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">Artisan Craft & Handloom Boutiques</h3>
                <p className="text-xs text-slate-500 font-medium">Support local craft economy by accepting municipal eco-reward discount tokens.</p>
              </div>
              <div className="text-[11px] font-bold text-emerald-800 font-mono pt-1 border-t border-slate-100">
                100% Instant Digital Verification
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col group">
            <div className="h-36 relative overflow-hidden bg-slate-900 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80"
                alt="Guided Eco-Heritage Walking Tours"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div className="p-4 flex flex-col justify-between space-y-2 flex-1">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase font-mono bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Category Showcase
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">Guided Eco-Heritage Walking Tours</h3>
                <p className="text-xs text-slate-500 font-medium">Certified local heritage guides absorbing overflow groups for sustainable walking trails.</p>
              </div>
              <div className="text-[11px] font-bold text-emerald-800 font-mono pt-1 border-t border-slate-100">
                Verified Eco Tour Guides
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={Users}
            label="Tourists Received"
            value="1,290"
            sub="↑ 28% from redirected passes"
          />
          <MetricCard
            icon={Tag}
            label="Deals Redeemed"
            value="482"
            sub="94.2% verification success"
          />
          <MetricCard
            icon={IndianRupee}
            label="Extra Earnings"
            value="₹1,29,000"
            sub="7-day gross extra yield"
          />
          <MetricCard
            icon={TrendingUp}
            label="Conversion Rate"
            value="37.4%"
            sub="Redirect pass conversion"
          />
        </div>

        {/* Main Grid: Offer Builder & Chart */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Offer Builder Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Gift size={14} className="text-emerald-700" /> Create Discount Deal
            </h3>

            <form onSubmit={handlePublish} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600">Shop / Restaurant Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Coupon Code</label>
                  <input
                    type="text"
                    value={formData.couponCode}
                    onChange={e => setFormData({ ...formData, couponCode: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Discount %</label>
                  <input
                    type="number"
                    value={formData.discountPercent}
                    onChange={e => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600">Deal Perk Description</label>
                <input
                  type="text"
                  value={formData.perk}
                  onChange={e => setFormData({ ...formData, perk: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600">Target Busy Spot</label>
                <input
                  type="text"
                  value={formData.monumentName}
                  onChange={e => setFormData({ ...formData, monumentName: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={publishing}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Send size={14} /> Publish Discount Deal
              </button>

              {pubSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs p-2.5 rounded-lg flex items-center gap-2 font-bold">
                  <CheckCircle size={14} /> Deal Active — Live on Tourist Itinerary Planner
                </div>
              )}
            </form>
          </div>

          {/* Revenue & Footfall Chart */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <BarChart2 size={14} className="text-emerald-700" /> 7-Day Tourist Inflow & Earnings
              </h3>
              <span className="text-xs text-slate-500 font-mono">{selectedCity} Area</span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={SEVEN_DAY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="balanced" fill="#047857" radius={[4, 4, 0, 0]} name="Redirected Tourists" />
                  <Line type="monotone" dataKey="baseline" stroke="#d97706" strokeWidth={2} name="Regular Visitors" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ── Transaction Audit Table ───────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm space-y-0">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-mono">
              <FileText size={15} className="text-emerald-700" /> Redeemed Voucher & Earnings Ledger
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500">{SEED_VOUCHERS.length} Verified Claims</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-mono font-bold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Invoice ID</th>
                  <th className="py-3 px-4">Voucher Code</th>
                  <th className="py-3 px-4">Tourist ID</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Claimed Deal</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {SEED_VOUCHERS.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors even:bg-slate-50/40">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{v.invoiceId}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">{v.code}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{v.tourist}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{v.time}</td>
                    <td className="py-3 px-4 text-slate-700">{v.perk}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        v.status === 'Settled'
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
