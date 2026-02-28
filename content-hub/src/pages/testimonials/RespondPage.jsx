import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, Video, MessageSquare, ChevronRight, ChevronLeft, Send, CheckCircle2, Star } from 'lucide-react';
import VideoRecorder from '../../components/testimonials/VideoRecorder';
import StarRating from '../../components/testimonials/StarRating';
import { getCampaign, saveTestimonial, saveVideo } from '../../lib/db';

const STEPS = { WELCOME: 'welcome', MODE: 'mode', RECORD: 'record', TEXT: 'text', DETAILS: 'details', DONE: 'done' };

export default function RespondPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [step, setStep] = useState(STEPS.WELCOME);
  const [mode, setMode] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [videoBlob, setVideoBlob] = useState(null);
  const [textResponse, setTextResponse] = useState('');
  const [details, setDetails] = useState({ name: '', email: '', company: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getCampaign(id).then((c) => {
      if (c) setCampaign(c);
      else setNotFound(true);
    });
  }, [id]);

  const handleVideoComplete = (blob) => {
    setVideoBlob(blob);
    setStep(STEPS.DETAILS);
  };

  const handleTextNext = () => {
    if (textResponse.trim()) setStep(STEPS.DETAILS);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let videoUrl = null;
      let videoKey = null;
      if (mode === 'video' && videoBlob) {
        const result = await saveVideo(videoBlob);
        videoUrl = result.url;
        videoKey = result.key;
      }
      const testimonial = {
        _isNew: true,
        campaignId: id,
        type: mode,
        text: mode === 'text' ? textResponse : '',
        name: details.name,
        email: details.email,
        company: details.company,
        rating: details.rating,
        status: 'pending',
        videoUrl,
        videoKey,
      };
      await saveTestimonial(testimonial);
      setStep(STEPS.DONE);
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const bc = campaign?.brandColor || '#9333ea';

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-white/30" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Campaign not found</h1>
          <p className="text-sm text-white/40">This link may have expired or been removed.</p>
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

  const inputClass = 'w-full px-4 py-3.5 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder-white/25 focus:outline-none focus:ring-2 transition-all backdrop-blur-sm';

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px] pointer-events-none" style={{ backgroundColor: bc }} />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[100px] pointer-events-none" style={{ backgroundColor: bc }} />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Progress indicator */}
        {step !== STEPS.DONE && (
          <div className="px-6 pt-6 sm:pt-8">
            <div className="max-w-2xl mx-auto flex items-center gap-1.5">
              {['welcome', 'mode', mode === 'video' ? 'record' : 'text', 'details'].map((s, i) => (
                <div
                  key={s}
                  className="h-1 flex-1 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: ['welcome', 'mode', mode === 'video' ? 'record' : 'text', 'details'].indexOf(step) >= i
                      ? bc
                      : 'rgba(255,255,255,0.08)',
                    boxShadow: ['welcome', 'mode', mode === 'video' ? 'record' : 'text', 'details'].indexOf(step) >= i
                      ? `0 0 8px ${bc}60`
                      : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-2xl animate-fade-in">
            {/* WELCOME */}
            {step === STEPS.WELCOME && (
              <div className="text-center px-4">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${bc}, ${bc}99)`, boxShadow: `0 8px 40px ${bc}40` }}
                >
                  <Sparkles className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                  {campaign.title}
                </h1>
                {campaign.welcomeMessage && (
                  <p className="text-sm sm:text-base text-white/50 leading-relaxed max-w-md mx-auto mb-8 sm:mb-10 font-light">
                    {campaign.welcomeMessage}
                  </p>
                )}
                <button
                  onClick={() => setStep(STEPS.MODE)}
                  className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-white text-sm sm:text-base font-semibold shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${bc}, ${bc}cc)`, boxShadow: `0 8px 40px ${bc}40` }}
                >
                  Get Started
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}

            {/* MODE SELECTION */}
            {step === STEPS.MODE && (
              <div className="text-center px-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">How would you like to share?</h2>
                <p className="text-sm text-white/40 mb-8 sm:mb-10">Choose whichever feels most comfortable</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                  {campaign.allowVideo && (
                    <button
                      onClick={() => { setMode('video'); setStep(STEPS.RECORD); }}
                      className="group p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 cursor-pointer text-center"
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${bc}30, ${bc}10)` }}
                      >
                        <Video className="w-6 h-6" style={{ color: bc }} />
                      </div>
                      <h3 className="text-base font-semibold text-white mb-1">Record Video</h3>
                      <p className="text-xs text-white/30">Share your story on camera</p>
                    </button>
                  )}
                  {campaign.allowText && (
                    <button
                      onClick={() => { setMode('text'); setStep(STEPS.TEXT); }}
                      className="group p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 cursor-pointer text-center"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.06] flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110">
                        <MessageSquare className="w-6 h-6 text-white/50" />
                      </div>
                      <h3 className="text-base font-semibold text-white mb-1">Write Text</h3>
                      <p className="text-xs text-white/30">Type out your testimonial</p>
                    </button>
                  )}
                </div>
                <button onClick={() => setStep(STEPS.WELCOME)} className="mt-6 text-xs text-white/25 hover:text-white/40 transition-colors cursor-pointer">
                  <ChevronLeft className="w-3 h-3 inline mr-1" /> Back
                </button>
              </div>
            )}

            {/* VIDEO RECORDING */}
            {step === STEPS.RECORD && (
              <div>
                <VideoRecorder
                  maxDuration={campaign.maxDuration}
                  onComplete={handleVideoComplete}
                  brandColor={bc}
                  prompt={campaign.prompts?.[currentPrompt]}
                />
                {campaign.prompts?.length > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {campaign.prompts.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPrompt(i)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          i === currentPrompt ? 'scale-125' : 'opacity-30 hover:opacity-60'
                        }`}
                        style={{ backgroundColor: i === currentPrompt ? bc : 'white' }}
                      />
                    ))}
                  </div>
                )}
                <div className="text-center mt-4">
                  <button onClick={() => setStep(STEPS.MODE)} className="text-xs text-white/25 hover:text-white/40 transition-colors cursor-pointer">
                    <ChevronLeft className="w-3 h-3 inline mr-1" /> Choose different format
                  </button>
                </div>
              </div>
            )}

            {/* TEXT INPUT */}
            {step === STEPS.TEXT && (
              <div className="px-2">
                {campaign.prompts?.[0] && (
                  <div className="mb-6 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                    <p className="text-xs uppercase tracking-widest text-white/30 mb-1.5 font-medium">Prompt</p>
                    <p className="text-sm text-white/70 font-light">{campaign.prompts[currentPrompt]}</p>
                    {campaign.prompts.length > 1 && (
                      <div className="flex items-center gap-2 mt-3">
                        {campaign.prompts.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPrompt(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                              i === currentPrompt ? '' : 'opacity-20'
                            }`}
                            style={{ backgroundColor: i === currentPrompt ? bc : 'white' }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <textarea
                  value={textResponse}
                  onChange={(e) => setTextResponse(e.target.value)}
                  rows={6}
                  className={`${inputClass} resize-none text-base`}
                  style={{ '--tw-ring-color': `${bc}60` }}
                  placeholder="Share your experience..."
                  autoFocus
                />
                <div className="flex items-center justify-between mt-5">
                  <button onClick={() => setStep(STEPS.MODE)} className="text-xs text-white/25 hover:text-white/40 transition-colors cursor-pointer">
                    <ChevronLeft className="w-3 h-3 inline mr-1" /> Back
                  </button>
                  <button
                    onClick={handleTextNext}
                    disabled={!textResponse.trim()}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100 cursor-pointer"
                    style={{ background: `linear-gradient(135deg, ${bc}, ${bc}cc)`, boxShadow: `0 8px 32px ${bc}40` }}
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* DETAILS */}
            {step === STEPS.DETAILS && (
              <div className="px-2">
                <div className="text-center mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">Almost there!</h2>
                  <p className="text-sm text-white/40">Just a few details about you</p>
                </div>
                <div className="space-y-4 max-w-md mx-auto">
                  {campaign.collectRating && (
                    <div className="text-center mb-6">
                      <p className="text-xs uppercase tracking-widest text-white/30 mb-3 font-medium">Your Rating</p>
                      <StarRating value={details.rating} onChange={(v) => setDetails((d) => ({ ...d, rating: v }))} size="lg" />
                    </div>
                  )}
                  {campaign.collectName && (
                    <input
                      type="text"
                      value={details.name}
                      onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))}
                      className={inputClass}
                      style={{ '--tw-ring-color': `${bc}60` }}
                      placeholder="Your name"
                    />
                  )}
                  {campaign.collectEmail && (
                    <input
                      type="email"
                      value={details.email}
                      onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))}
                      className={inputClass}
                      style={{ '--tw-ring-color': `${bc}60` }}
                      placeholder="Your email"
                    />
                  )}
                  {campaign.collectCompany && (
                    <input
                      type="text"
                      value={details.company}
                      onChange={(e) => setDetails((d) => ({ ...d, company: e.target.value }))}
                      className={inputClass}
                      style={{ '--tw-ring-color': `${bc}60` }}
                      placeholder="Your company"
                    />
                  )}
                </div>
                <div className="flex items-center justify-between mt-8 max-w-md mx-auto">
                  <button onClick={() => setStep(mode === 'video' ? STEPS.RECORD : STEPS.TEXT)} className="text-xs text-white/25 hover:text-white/40 transition-colors cursor-pointer">
                    <ChevronLeft className="w-3 h-3 inline mr-1" /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                    style={{ background: `linear-gradient(135deg, ${bc}, ${bc}cc)`, boxShadow: `0 8px 32px ${bc}40` }}
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* THANK YOU */}
            {step === STEPS.DONE && (
              <div className="text-center px-4 animate-fade-in">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8"
                  style={{ background: `linear-gradient(135deg, ${bc}20, ${bc}08)`, boxShadow: `0 0 60px ${bc}20` }}
                >
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: bc }} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                  Thank you!
                </h2>
                <p className="text-sm sm:text-base text-white/40 leading-relaxed max-w-sm mx-auto font-light">
                  {campaign.thankYouMessage}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 text-center">
          <p className="text-[10px] text-white/15 tracking-wider uppercase">Powered by Aki Content Hub</p>
        </div>
      </div>
    </div>
  );
}
