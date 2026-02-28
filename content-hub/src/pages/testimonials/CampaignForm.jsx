import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Sparkles, Save } from 'lucide-react';
import { saveCampaign } from '../../lib/db';

const defaultForm = {
  title: '',
  description: '',
  prompts: [''],
  welcomeMessage: '',
  thankYouMessage: 'Thank you for sharing your story! Your response means the world to us.',
  brandColor: '#9333ea',
  allowVideo: true,
  allowText: true,
  maxDuration: 120,
  collectName: true,
  collectEmail: true,
  collectCompany: false,
  collectRating: true,
};

const colorPresets = ['#9333ea', '#6366f1', '#ec4899', '#f97316', '#10b981', '#06b6d4', '#f43f5e', '#8b5cf6'];

export default function CampaignForm({ existingCampaign }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(existingCampaign ? { ...defaultForm, ...existingCampaign } : defaultForm);
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const setPrompt = (idx, value) => {
    setForm((f) => {
      const prompts = [...f.prompts];
      prompts[idx] = value;
      return { ...f, prompts };
    });
  };

  const addPrompt = () => setForm((f) => ({ ...f, prompts: [...f.prompts, ''] }));

  const removePrompt = (idx) => setForm((f) => ({ ...f, prompts: f.prompts.filter((_, i) => i !== idx) }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const campaign = {
      ...form,
      id: existingCampaign?.id || `campaign-${Date.now()}`,
      prompts: form.prompts.filter((p) => p.trim()),
      createdAt: existingCampaign?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveCampaign(campaign);
    setSaving(false);
    navigate('/testimonials');
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40 transition-all backdrop-blur-sm';
  const labelClass = 'block text-[11px] uppercase tracking-widest text-white/40 font-semibold mb-2';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 sm:mb-10">
          <button
            onClick={() => navigate('/testimonials')}
            className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-white/60" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {existingCampaign ? 'Edit Campaign' : 'New Campaign'}
            </h1>
            <p className="text-sm text-white/40 mt-0.5">Create a link to collect testimonials</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
          {/* Basic Info */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Campaign Details</h2>
            </div>

            <div>
              <label className={labelClass}>Campaign Name</label>
              <input type="text" required value={form.title} onChange={set('title')} className={inputClass} placeholder="e.g. Customer Success Stories" />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea value={form.description} onChange={set('description')} rows={3} className={`${inputClass} resize-none`} placeholder="Brief context your clients will see before recording..." />
            </div>

            <div>
              <label className={labelClass}>Welcome Message</label>
              <textarea value={form.welcomeMessage} onChange={set('welcomeMessage')} rows={2} className={`${inputClass} resize-none`} placeholder="A warm intro message shown before recording..." />
            </div>

            <div>
              <label className={labelClass}>Thank You Message</label>
              <textarea value={form.thankYouMessage} onChange={set('thankYouMessage')} rows={2} className={`${inputClass} resize-none`} placeholder="Shown after they submit their testimonial..." />
            </div>
          </section>

          {/* Prompts */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Guided Prompts</h2>
              </div>
              <button
                type="button"
                onClick={addPrompt}
                className="flex items-center gap-1.5 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Prompt
              </button>
            </div>
            <p className="text-xs text-white/30">Questions shown to guide your client through their testimonial</p>

            <div className="space-y-3">
              {form.prompts.map((prompt, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-10 flex items-center justify-center text-xs text-white/20 font-mono">{idx + 1}</span>
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(idx, e.target.value)}
                    className={`${inputClass} flex-1`}
                    placeholder="e.g. What was your biggest challenge before working with us?"
                  />
                  {form.prompts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePrompt(idx)}
                      className="flex-shrink-0 p-2.5 rounded-xl hover:bg-white/[0.06] text-white/20 hover:text-white/50 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Settings */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Settings</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Max Video Duration</label>
                <select
                  value={form.maxDuration}
                  onChange={(e) => setForm((f) => ({ ...f, maxDuration: Number(e.target.value) }))}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value={30}>30 seconds</option>
                  <option value={60}>1 minute</option>
                  <option value={120}>2 minutes</option>
                  <option value={180}>3 minutes</option>
                  <option value={300}>5 minutes</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Brand Color</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {colorPresets.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, brandColor: c }))}
                      className={`w-8 h-8 rounded-full transition-all cursor-pointer ${
                        form.brandColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-950 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                ['allowVideo', 'Allow Video'],
                ['allowText', 'Allow Text'],
                ['collectName', 'Collect Name'],
                ['collectEmail', 'Collect Email'],
                ['collectCompany', 'Collect Company'],
                ['collectRating', 'Collect Rating'],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:bg-white/[0.06] transition-all">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={set(key)}
                    className="accent-brand-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-white/60 font-medium">{label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => navigate('/testimonials')}
              className="px-5 py-2.5 rounded-xl text-sm text-white/50 hover:text-white/70 hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${form.brandColor}, ${form.brandColor}cc)`,
                boxShadow: `0 8px 32px ${form.brandColor}40`,
              }}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : existingCampaign ? 'Save Changes' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
