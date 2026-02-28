import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Trash2, Video, MessageSquare, Eye, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { getCampaign, getTestimonials, deleteTestimonial, saveTestimonial, getVideo } from '../../lib/db';
import StarRating from '../../components/testimonials/StarRating';

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [videoUrls, setVideoUrls] = useState({});
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    const c = await getCampaign(id);
    if (!c) return navigate('/testimonials');
    setCampaign(c);
    const t = await getTestimonials(id);
    setTestimonials(t.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

    const urls = {};
    for (const item of t) {
      if (item.type === 'video') {
        const blob = await getVideo(item.id);
        if (blob) urls[item.id] = URL.createObjectURL(blob);
      }
    }
    setVideoUrls(urls);
  }, [id, navigate]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (filter === 'all') return testimonials;
    if (filter === 'video') return testimonials.filter((t) => t.type === 'video');
    if (filter === 'text') return testimonials.filter((t) => t.type === 'text');
    if (filter === 'featured') return testimonials.filter((t) => t.status === 'featured');
    return testimonials;
  }, [testimonials, filter]);

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/respond/${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleFeatured = async (testimonial) => {
    const next = testimonial.status === 'featured' ? 'approved' : 'featured';
    await saveTestimonial({ ...testimonial, status: next });
    load();
  };

  const handleDelete = async (tId) => {
    await deleteTestimonial(tId);
    load();
  };

  if (!campaign) return null;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <button onClick={() => navigate('/testimonials')} className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer mt-0.5">
          <ArrowLeft className="w-4 h-4 text-ink-muted" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: campaign.brandColor }} />
            <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight truncate">{campaign.title}</h1>
          </div>
          <p className="text-sm text-ink-muted ml-6">{testimonials.length} responses collected</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={copyLink} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-medium text-ink-muted transition-colors cursor-pointer">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <Link
            to={`/wall/${id}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white transition-colors"
            style={{ backgroundColor: campaign.brandColor }}
          >
            <Eye className="w-3.5 h-3.5" /> Wall of Love
          </Link>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {[
          ['all', 'All'],
          ['video', 'Video'],
          ['text', 'Text'],
          ['featured', 'Featured'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === key ? 'bg-brand-600 text-white shadow-sm' : 'bg-gray-100 text-ink-muted hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Testimonials Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="w-10 h-10 text-ink-faint mx-auto mb-3" />
          <p className="text-sm text-ink-muted">
            {testimonials.length === 0
              ? 'No responses yet. Share your campaign link to start collecting testimonials.'
              : 'No testimonials match this filter.'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <div key={t.id} className="bg-surface-raised rounded-2xl border border-gray-200/60 overflow-hidden hover:shadow-lg transition-all group">
              {/* Video */}
              {t.type === 'video' && videoUrls[t.id] && (
                <div className="aspect-video bg-black">
                  <video src={videoUrls[t.id]} controls className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-4 sm:p-5">
                {/* Rating */}
                {t.rating > 0 && (
                  <div className="mb-2">
                    <StarRating value={t.rating} readonly size="sm" />
                  </div>
                )}

                {/* Text */}
                {t.text && (
                  <p className="text-sm text-ink leading-relaxed mb-3 line-clamp-4">&ldquo;{t.text}&rdquo;</p>
                )}

                {/* Author */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: campaign.brandColor }}>
                    {(t.name || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name || 'Anonymous'}</p>
                    {t.company && <p className="text-[11px] text-ink-muted">{t.company}</p>}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-[11px] text-ink-faint">
                    {format(new Date(t.createdAt), 'MMM d, yyyy')}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFeatured(t)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        t.status === 'featured' ? 'bg-amber-50 text-amber-500' : 'hover:bg-gray-100 text-ink-faint hover:text-amber-400'
                      }`}
                      title={t.status === 'featured' ? 'Remove from featured' : 'Feature this testimonial'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${t.status === 'featured' ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-ink-faint hover:text-coral transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
