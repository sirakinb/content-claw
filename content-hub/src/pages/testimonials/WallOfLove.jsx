import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, Sparkles, Quote } from 'lucide-react';
import { getCampaign, getTestimonials, getVideo } from '../../lib/db';
import StarRating from '../../components/testimonials/StarRating';

export default function WallOfLove() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [videoUrls, setVideoUrls] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const c = await getCampaign(id);
      if (!c) { setNotFound(true); return; }
      setCampaign(c);
      const all = await getTestimonials(id);
      const featured = all.filter((t) => t.status === 'featured');
      const display = featured.length > 0 ? featured : all;
      setTestimonials(display.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

      const urls = {};
      for (const t of display) {
        if (t.type === 'video') {
          const blob = await getVideo(t.id);
          if (blob) urls[t.id] = URL.createObjectURL(blob);
        }
      }
      setVideoUrls(urls);
    })();
  }, [id]);

  const bc = campaign?.brandColor || '#9333ea';

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-white/20 mx-auto mb-3" />
          <h1 className="text-lg font-bold text-white/60">Not found</h1>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full opacity-[0.04] blur-[150px] pointer-events-none" style={{ backgroundColor: bc }} />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.03] blur-[120px] pointer-events-none" style={{ backgroundColor: bc }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center pt-12 sm:pt-20 pb-10 sm:pb-16 px-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: `linear-gradient(135deg, ${bc}30, ${bc}10)` }}
          >
            <Heart className="w-5 h-5" style={{ color: bc }} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Wall of Love
          </h1>
          <p className="text-sm sm:text-base text-white/30 max-w-md mx-auto font-light">
            {campaign.description || 'See what our community has to say'}
          </p>
        </div>

        {/* Masonry Grid */}
        {testimonials.length === 0 ? (
          <div className="text-center py-20 px-6">
            <p className="text-sm text-white/30">No testimonials to display yet.</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5">
            {testimonials.map((t, idx) => (
              <div
                key={t.id}
                className="break-inside-avoid mb-4 sm:mb-5 rounded-3xl overflow-hidden bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-300 group"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Video */}
                {t.type === 'video' && videoUrls[t.id] && (
                  <div className="aspect-video bg-black">
                    <video src={videoUrls[t.id]} controls className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  {/* Rating */}
                  {t.rating > 0 && (
                    <div className="mb-3">
                      <StarRating value={t.rating} readonly size="sm" />
                    </div>
                  )}

                  {/* Quote */}
                  {t.text && (
                    <div className="relative">
                      <Quote className="w-5 h-5 text-white/[0.06] absolute -top-1 -left-1" />
                      <p className="text-sm text-white/70 leading-relaxed font-light pl-2">
                        {t.text}
                      </p>
                    </div>
                  )}

                  {/* Author */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/[0.06]">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${bc}, ${bc}aa)` }}
                    >
                      {(t.name || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/80">{t.name || 'Anonymous'}</p>
                      {t.company && <p className="text-[11px] text-white/30">{t.company}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center pb-8">
          <p className="text-[10px] text-white/10 tracking-wider uppercase">Powered by Aki Content Hub</p>
        </div>
      </div>
    </div>
  );
}
