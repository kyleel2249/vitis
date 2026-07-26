'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Download, Mail, RefreshCw, Search, Send, UserCheck, UserX } from 'lucide-react';

type Subscriber = {
  id: string;
  email: string;
  is_active: boolean;
  source: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
};

type Campaign = {
  id: string;
  subject: string;
  status: string;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
};

const statusStyles: Record<string, string> = {
  sent: 'bg-green-100 text-green-700',
  partial: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
  sending: 'bg-blue-100 text-blue-700',
};

export default function MarketingPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState({ total: '0', active: '0', inactive: '0' });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [audienceResponse, historyResponse] = await Promise.all([
        fetch(`/api/admin/newsletter/subscribers?search=${encodeURIComponent(search)}&status=${status}`),
        fetch('/api/admin/newsletter/campaigns/history'),
      ]);
      const audience = await audienceResponse.json();
      const history = await historyResponse.json();
      if (!audienceResponse.ok) throw new Error(audience.error || 'Could not load subscribers.');
      setSubscribers(audience.subscribers || []);
      setStats(audience.stats || { total: '0', active: '0', inactive: '0' });
      if (historyResponse.ok) setCampaigns(history.campaigns || []);
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Could not load marketing data.' });
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = window.setTimeout(loadData, 250);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  async function toggleSubscriber(subscriber: Subscriber) {
    const response = await fetch(`/api/admin/newsletter/subscribers/${subscriber.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !subscriber.is_active }),
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage({ type: 'error', text: result.error || 'Could not update subscriber.' });
      return;
    }
    await loadData();
  }

  async function sendCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/newsletter/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not send campaign.');
      setMessage({ type: 'success', text: result.message });
      setSubject('');
      setContent('');
      await loadData();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Could not send campaign.' });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your newsletter audience and send updates.</p>
        </div>
        <a href="/api/admin/newsletter/export" className="btn-secondary text-sm">
          <Download className="w-4 h-4" /> Export active subscribers
        </a>
      </div>

      {message && (
        <div role="status" className={`rounded-xl px-4 py-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total subscribers', value: stats.total, icon: Mail, color: 'text-primary-600', bg: 'bg-primary-100' },
          { label: 'Active audience', value: stats.active, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Unsubscribed', value: stats.inactive, icon: UserX, color: 'text-gray-600', bg: 'bg-gray-100' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div className="card p-5" key={label}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}><Icon className={`w-5 h-5 ${color}`} /></div>
              <div><p className="text-2xl font-bold text-gray-900">{value}</p><p className="text-xs text-gray-500">{label}</p></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <section className="card p-5 xl:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center"><Send className="w-5 h-5 text-primary-600" /></div>
            <div><h2 className="font-bold text-gray-900">Send a campaign</h2><p className="text-xs text-gray-500">Delivered to active subscribers only.</p></div>
          </div>
          <form onSubmit={sendCampaign} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Subject<input className="input mt-1.5" value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={160} required placeholder="A fresh update from Vitis" /></label>
            <label className="block text-sm font-medium text-gray-700">Message<textarea className="input mt-1.5 min-h-48 resize-y" value={content} onChange={(event) => setContent(event.target.value)} maxLength={10000} required placeholder="Share a new arrival, promotion, or helpful story..." /></label>
            <p className="text-xs text-gray-400">Every email includes a one-click unsubscribe link.</p>
            <button className="btn-primary w-full" type="submit" disabled={sending || stats.active === '0'}>{sending ? 'Sending campaign…' : `Send to ${stats.active} active subscribers`}</button>
          </form>
        </section>

        <section className="card xl:col-span-3 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div><h2 className="font-bold text-gray-900">Audience</h2><p className="text-xs text-gray-500">Search and manage subscription status.</p></div>
            <button className="btn-icon" onClick={loadData} aria-label="Refresh audience"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
          </div>
          <div className="px-5 py-3 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
            <label className="relative flex-1"><Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" /><input className="input pl-9 py-2.5" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search email..." /></label>
            <select className="input sm:w-36 py-2.5" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All status</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider"><tr><th className="px-5 py-3 text-left">Email</th><th className="px-5 py-3 text-left">Status</th><th className="px-5 py-3 text-left">Subscribed</th><th className="px-5 py-3 text-right">Action</th></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{subscriber.email}</td>
                    <td className="px-5 py-3.5"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${subscriber.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{subscriber.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{new Date(subscriber.subscribed_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5 text-right"><button onClick={() => toggleSubscriber(subscriber)} className="text-xs font-semibold text-primary-600 hover:underline">{subscriber.is_active ? 'Deactivate' : 'Reactivate'}</button></td>
                  </tr>
                ))}
                {!loading && subscribers.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-500">No subscribers found.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-900">Campaign history</h2><p className="text-xs text-gray-500">Recent delivery results.</p></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]"><thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider"><tr><th className="px-5 py-3 text-left">Subject</th><th className="px-5 py-3 text-left">Status</th><th className="px-5 py-3 text-left">Recipients</th><th className="px-5 py-3 text-left">Sent</th><th className="px-5 py-3 text-left">Date</th></tr></thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map((campaign) => <tr key={campaign.id}><td className="px-5 py-3.5 text-sm font-medium text-gray-900">{campaign.subject}</td><td className="px-5 py-3.5"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[campaign.status] || 'bg-gray-100 text-gray-600'}`}>{campaign.status}</span></td><td className="px-5 py-3.5 text-sm text-gray-500">{campaign.recipient_count}</td><td className="px-5 py-3.5 text-sm text-gray-500">{campaign.sent_count} <span className="text-gray-400">/ {campaign.failed_count} failed</span></td><td className="px-5 py-3.5 text-sm text-gray-500">{new Date(campaign.created_at).toLocaleDateString()}</td></tr>)}
              {campaigns.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-500">No campaigns sent yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}