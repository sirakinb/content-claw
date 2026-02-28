import { getCampaigns, saveCampaign } from './db';

const SEED_KEY = 'aki-testimonials-seeded';

const demoCampaign = {
  id: 'demo-campaign',
  title: 'Share Your Vibe Coding Story',
  description: 'Tell us how vibe coding has changed the way you build apps. Your story could inspire the next wave of non-technical founders.',
  prompts: [
    'What were you struggling with before you discovered vibe coding?',
    'What was your "aha moment" — when did everything click?',
    'What have you been able to build since learning these tools?',
  ],
  welcomeMessage: "Hey! I'd love to hear your story. This will only take a couple of minutes — just be yourself and speak from the heart.",
  thankYouMessage: "You're amazing — thank you! Your story is going to inspire so many people. 🙏",
  brandColor: '#9333ea',
  allowVideo: true,
  allowText: true,
  maxDuration: 120,
  collectName: true,
  collectEmail: true,
  collectCompany: true,
  collectRating: true,
  createdAt: new Date().toISOString(),
};

export async function seedIfNeeded() {
  if (localStorage.getItem(SEED_KEY)) return;
  const existing = await getCampaigns();
  if (existing.length === 0) {
    await saveCampaign(demoCampaign);
  }
  localStorage.setItem(SEED_KEY, 'true');
}
