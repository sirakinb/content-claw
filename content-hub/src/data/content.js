const TODAY = new Date();
const day = (offset) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + offset);
  return d.toISOString();
};

export const CATEGORIES = [
  { id: 'ai-tools', label: 'AI Tools', color: 'bg-brand-500 text-white' },
  { id: 'business', label: 'Business', color: 'bg-amber text-white' },
  { id: 'business-strategy', label: 'Business Strategy', color: 'bg-coral text-white' },
  { id: 'technical', label: 'Technical', color: 'bg-sky text-white' },
  { id: 'deep-dives', label: 'Deep Dives', color: 'bg-emerald text-white' },
  { id: 'vcp', label: 'VCP', color: 'bg-brand-700 text-white' },
];

export const STATUSES = [
  { id: 'draft', label: 'Draft', color: 'bg-gray-200 text-gray-700' },
  { id: 'scheduled', label: 'Scheduled', color: 'bg-brand-100 text-brand-700' },
  { id: 'published', label: 'Published', color: 'bg-emerald/10 text-emerald' },
];

export const PLATFORMS = [
  { id: 'tiktok', label: 'TikTok' },
  { id: 'instagram', label: 'Instagram Reels' },
  { id: 'youtube', label: 'YouTube Shorts' },
];

let _nextId = 100;
const id = () => String(_nextId++);

export const initialContent = [
  {
    id: id(),
    title: 'Stop satisfying customers — start transforming them',
    category: 'business',
    status: 'published',
    platform: 'tiktok',
    scheduledDate: day(-5),
    hook: "Here's the thing nobody tells you about customer satisfaction…",
    script: "Stop trying to satisfy your customers. I know that sounds crazy, but hear me out. Customer satisfaction is the MINIMUM. It's table stakes. You know what actually builds a business? Customer TRANSFORMATION. There's a huge difference between \"yeah, that was fine\" and \"oh my God, this changed everything.\" When you focus on transformation, you don't need to chase clients — they come back. They tell everyone. They become your marketing team. So stop asking \"how do I make them happy?\" Start asking \"how do I change their life?\" That's the real game.",
  },
  {
    id: id(),
    title: 'The real reason your app idea hasn\'t launched',
    category: 'ai-tools',
    status: 'published',
    platform: 'tiktok',
    scheduledDate: day(-3),
    hook: 'You\'ve had that app idea for how long now?',
    script: "You've been sitting on that app idea for months. Maybe years. And every time you think about it, the same wall comes up: \"I don't know how to code.\" Here's the secret: you don't need to. Vibe coding with tools like Lovable, Cursor, and Replit means you can describe what you want and AI builds it. I've helped people with ZERO tech background launch real apps in weeks. The gap isn't skill — it's starting. So what are you waiting for?",
  },
  {
    id: id(),
    title: 'How I use Cursor to build full apps in a weekend',
    category: 'technical',
    status: 'scheduled',
    platform: 'tiktok',
    scheduledDate: day(1),
    hook: 'I built a complete SaaS app this weekend. Here\'s exactly how.',
    script: "People always ask me how I build apps so fast. The answer is Cursor + a clear plan. Step 1: I outline every screen and feature in plain English. Step 2: I feed it to Cursor and let AI scaffold the project. Step 3: I iterate — tweak the prompts, adjust the output, test as I go. The key is NOT trying to be perfect on the first pass. Let the AI do 80%, then you refine the 20%. That's how I shipped a full SaaS with auth, payments, and a dashboard — in one weekend.",
  },
  {
    id: id(),
    title: 'The 3-step framework for pricing your AI-built app',
    category: 'business-strategy',
    status: 'scheduled',
    platform: 'instagram',
    scheduledDate: day(2),
    hook: 'Your app is built. Now how do you price it without leaving money on the table?',
    script: "You built the app — congrats. Now comes the part that trips everyone up: pricing. Here's my 3-step framework. Step 1: Research. Look at 5 competitors and note their pricing tiers. Step 2: Value anchor. What transformation does your app provide? Price based on the VALUE, not the features. Step 3: Test. Start higher than you think. You can always come down. You can't easily go up. Most vibe coders underprice because they think \"I didn't write real code.\" Stop that. The value is the same whether you wrote it or AI did.",
  },
  {
    id: id(),
    title: 'Why Lovable is the best tool for non-technical founders',
    category: 'ai-tools',
    status: 'scheduled',
    platform: 'tiktok',
    scheduledDate: day(3),
    hook: 'If you\'re not technical and you want to build an app — use this tool.',
    script: "If I had to pick ONE tool for someone with zero coding experience to build their first app, it's Lovable. Here's why. The interface is basically a conversation. You describe what you want — \"I need a landing page with a waitlist form\" — and it builds it. Real code. Real app. You can deploy it instantly. And when you need changes? Just ask. \"Make the button bigger.\" \"Add a dark mode.\" It's like having a developer on call 24/7. The game has changed. Stop waiting for a technical co-founder.",
  },
  {
    id: id(),
    title: 'Vibe coding vs traditional development — the honest comparison',
    category: 'deep-dives',
    status: 'scheduled',
    platform: 'youtube',
    scheduledDate: day(5),
    hook: 'Is vibe coding actually legit? Let\'s do a real comparison.',
    script: "Everyone's talking about vibe coding but is it actually as good as traditional development? Let's be real. For MVPs and prototypes? Vibe coding wins. Speed, cost, accessibility — it's not even close. For complex enterprise systems? Traditional dev still has the edge. But here's the thing 90% of people don't need enterprise architecture. They need version 1. They need to test the idea. They need to get it in front of users. And for THAT, vibe coding is revolutionary. Know what you're building and pick the right tool.",
  },
  {
    id: id(),
    title: 'The Vibe Code Pioneers community — what we\'re building',
    category: 'vcp',
    status: 'draft',
    platform: 'tiktok',
    scheduledDate: null,
    hook: 'I started a community of non-technical builders who are shipping real apps.',
    script: "6 months ago I started the Vibe Code Pioneers — a community for people who want to build apps without writing code. We've got entrepreneurs, coaches, and creators all building real products using AI tools. Every week we do live builds, troubleshoot together, and celebrate launches. The best part? Everyone started from zero. No CS degree. No bootcamp. Just an idea and the willingness to learn. If that sounds like you, the link is in my bio.",
  },
  {
    id: id(),
    title: 'How to validate your app idea in 48 hours',
    category: 'business-strategy',
    status: 'draft',
    platform: 'tiktok',
    scheduledDate: null,
    hook: 'Before you build ANYTHING, do this first.',
    script: "The biggest mistake I see new builders make is spending weeks building something nobody wants. Here's how to validate in 48 hours. Hour 1-4: Create a simple landing page describing the app. Use Lovable or Carrd. Hour 5-12: Share it in 5 communities where your target users hang out. Hour 13-24: Run a small ad — $20 on Instagram or TikTok. Hour 25-48: Check the data. Did people sign up? Did they click? Did they DM you asking when it launches? If yes: build. If no: pivot. Don't fall in love with your idea. Fall in love with solving the problem.",
  },
  {
    id: id(),
    title: 'Top 5 AI coding mistakes beginners make',
    category: 'technical',
    status: 'draft',
    platform: 'instagram',
    scheduledDate: null,
    hook: 'I review hundreds of AI-built apps. These mistakes show up every single time.',
    script: "After reviewing hundreds of AI-built apps, here are the top 5 mistakes I see. #1: Prompts that are too vague. \"Build me a good app\" gets you garbage. Be specific. #2: No planning. Just because AI is fast doesn't mean you skip the blueprint. #3: Never testing. Test on mobile. Test with real users. Test the edge cases. #4: Ignoring design. AI gives you functional, not beautiful. Spend time on polish. #5: Building alone. Get feedback early. Join a community. Share your progress. Fix these five things and you're ahead of 90% of vibe coders out there.",
  },
  {
    id: id(),
    title: 'What I learned from 50 coaching calls this month',
    category: 'business',
    status: 'draft',
    platform: 'tiktok',
    scheduledDate: null,
    hook: 'I did 50 coaching calls this month. Here\'s the pattern I noticed.',
    script: "50 coaching calls. All different people, different ideas, different backgrounds. But you know what? The same thing held almost everyone back. It wasn't skill. It wasn't money. It wasn't time. It was PERMISSION. They were waiting for someone to tell them they were ready. That their idea was good enough. That they were \"allowed\" to build this. Listen — nobody is coming to give you permission. The market will tell you if your idea works. But first you have to ship it. Stop waiting. Start building. That's your permission slip right there.",
  },
];

export function getContentStats(items) {
  return {
    total: items.length,
    draft: items.filter(i => i.status === 'draft').length,
    scheduled: items.filter(i => i.status === 'scheduled').length,
    published: items.filter(i => i.status === 'published').length,
  };
}
