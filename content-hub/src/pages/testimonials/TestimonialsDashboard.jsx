import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Link2, Eye, Trash2, MessageSquare, Video, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { getCampaigns, deleteCampaign, getTestimonials } from '../../lib/db';
import { seedIfNeeded } from '../../lib/seed';

export default function TestimonialsDashboard() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [testimonialCounts, setTestimonialCounts] = useState({});
  const [copied, setCopied] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    await seedIfNeeded();
    const c = await getCampaigns();
    setCampaigns(c.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    const counts = {};
    for (const campaign of c) {
      const t = await getTestimonials(campaign.id);
      counts[campaign.id] = t.length;
    }
    setTestimonialCounts(counts);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    await deleteCampaign(id);
    load();
  };

  const copyLink = (id) => {
    const url = `${window.location.origin}/respond/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Testimonials</h1>
          <p className="text-sm text-ink-muted mt-1">Collect and showcase client stories</p>
        </div>
        <button
          onClick={() => navigate('/testimonials/new')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-brand-50 flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-9 h-9 text-brand-400" />
          </div>
          <h2 className="text-lg font-bold text-ink mb-2">No campaigns yet</h2>
          <p className="text-sm text-ink-muted mb-6 max-w-sm mx-auto">Create your first campaign to start collecting video and text testimonials from your clients.</p>
          <button
            onClick={() => navigate('/testimonials/new')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Campaign
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-surface-raised rounded-2xl border border-gray-200/60 p-5 sm:p-6 hover:shadow-lg hover:border-brand-200/60 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: campaign.brandColor }} />
                    <h3 className="text-base font-bold text-ink truncate">{campaign.title}</h3>
                  </div>
                  {campaign.description && (
                    <p className="text-sm text-ink-muted line-clamp-2 mb-3 ml-6">{campaign.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 ml-6 text-xs text-ink-faint">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {testimonialCounts[campaign.id] || 0} responses
                    </span>
                    <span className="flex items-center gap-1">
                      {campaign.allowVideo && <Video className="w-3 h-3" />}
                      {campaign.allowVideo && 'Video'}
                      {campaign.allowVideo && campaign.allowText && ' + '}
                      {campaign.allowText && 'Text'}
                    </span>
                    <span>
                      Created {format(new Date(campaign.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => copyLink(campaign.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-ink-muted hover:text-brand-600 transition-colors cursor-pointer"
                    title="Copy share link"
                  >
                    {copied === campaign.id ? <Check className="w-4 h-4 text-emerald" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={`/respond/${campaign.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-gray-100 text-ink-muted hover:text-brand-600 transition-colors"
                    title="Preview response page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <Link
                    to={`/testimonials/${campaign.id}`}
                    className="p-2 rounded-lg hover:bg-gray-100 text-ink-muted hover:text-brand-600 transition-colors"
                    title="View responses"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(campaign.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-ink-muted hover:text-coral transition-colors cursor-pointer"
                    title="Delete campaign"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick share bar */}
              <div className="mt-4 ml-6 flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <Link2 className="w-3.5 h-3.5 text-ink-faint flex-shrink-0" />
                <code className="text-xs text-ink-muted truncate flex-1">
                  {window.location.origin}/respond/{campaign.id}
                </code>
                <button
                  onClick={() => copyLink(campaign.id)}
                  className="flex-shrink-0 text-[10px] font-semibold text-brand-600 hover:text-brand-700 uppercase tracking-wider cursor-pointer"
                >
                  {copied === campaign.id ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
