# Vibe Code Pioneers - Sessions 10-13 Combined Transcript

## Key Participants
- **Aki (Host)** - @sirakinb
- **Nicholas** - Sales background (high-ticket fitness), real estate wholesaling, wants to niche into property management AI
- **Mary** - Working with Python, LangChain, Claude Code, building a legal assistant app
- **Asson** - QA/Testing background
- Other community members

---

## Session Content

### Nicholas Introduction & Property Management Discussion

Nicholas joins. Sales background, 100% commission, high-ticket fitness sales. Real estate wholesaling background. Wants to niche into property management with AI.

**Nicholas's situation:**
- No tech background, comes from sales
- Been doing YouTube rabbit holes on agentic workflows
- Taken NaN courses, Nick Sariah's and Jack Roberts' anti-gravity courses
- Familiar with the DOUGH framework
- Built basic workflows (Gmail, etc.)
- Interested in SaaS component for property management
- Wants to target property management firms with less than 2,000 units (midsize)
- Currently in analysis paralysis phase
- Working full-time in high-ticket fitness sales (100% commission, controls schedule)
- Hit Q4 bonus, has financial cushion to devote more time
- Based in Philadelphia area

**Aki's advice on property management AI:**
- Two approaches: service-based (working with companies) or product-based (building SaaS)
- Often works well to start service-based, then identify pain points for SaaS
- Shared his own property management case study work
- Built a voice agent dashboard in Anti-Gravity connected to Supabase
- Used Make.com for the workflow path
- After call conversation, analysis goes through Make workflow to their CRM (Zoho)
- Property management companies also use Buildium (project management-like tool)
- Go High Level is clunky for real estate - "love hate relationship"

**Property Management Voice Agent Case Study:**
- One company had ~100 calls/day but small team
- Only 15-20 calls were being answered daily
- 80 calls going unanswered (after hours + during work hours)
- Voice agent now answers everything
- All calls have transcripts attached
- Leads to identifying next bottleneck: application process
- Opens doors for recommending additional automation

**Client acquisition advice for Nicholas:**
- Reach out to existing network in real estate/property management
- Give presentations (underrated strategy)
- Pick 1-2 digital channels and be consistent
- Cold calling is fine
- Content/documenting the journey
- Stick to fewer channels early, be aggressive with consistency
- In-person networking + presentations as the expert

### Mary's Update - Legal Assistant App & Claude Code

**Mary's situation:**
- Working through Python and LangChain
- Learning about API key security - discovered env files, secret folders
- API keys can be exposed in browser or GitHub
- Building a legal assistant app (has URL, shared with friends)
- Didn't realize that every time someone uses the app, it hits her OpenAI API key
- Needs to consider cost structure and model selection
- Getting comfortable with Claude Code
- Using agents to break down code, understand frameworks
- Claude Code as a mentor tool
- Had an issue with Lovable billing going from $25 to $100 to $200/month
- Switched focus to Claude Code

**Key takeaway from Mary:** "How have you been finding Claude Code? I'm getting pretty comfortable with it... using the different agents. What I'm doing is asking the agents to break down the code for me."

### Aki's Deep Dive: RALPH Loop (Autonomous Building)

**What is RALPH:**
- Named after Ralph Wiggum from The Simpsons
- Concept of building software autonomously
- Uses cursor/anti-gravity with a loop that runs on its own
- Creates a PRD with user stories, then triggers the loop
- Mirrors how an engineering team works: take user story → implement → push to GitHub → next story → repeat

**Why RALPH is powerful:**
1. **Context management** - Each new user story gets a fresh context window (avoids context rot)
2. **Autonomous looping** - Runs through all user stories automatically

**Aki's Bitcoin app example:**
- Someone gave him the idea: "Bitcoin for beginners"
- Built an app teaching zero-to-proficient Bitcoin understanding
- Created PRD with ~28 user stories (initialize Insports database, create schema, seed curriculum, lesson modules, etc.)
- Set up the PRD and Ralph script before bed
- **Woke up to the completed app**
- Included authentication and payments (Stripe)
- Total build time: ~2.5 hours autonomous
- Setup time once familiar: ~1-1.5 hours for PRD + user stories

**Tech stack used:**
- Cursor (IDE)
- Claude Code (installed in Cursor terminal)
- Insports (database - similar to Supabase, has MCP connection)
- Stripe (payments - also has MCP connection)
- PRD skill (Claude Code skill for building PRDs)
- RALPH skill (Claude Code skill for autonomous looping)

**Anthropic adopted RALPH:**
- Created a RALPH plugin after seeing the trend
- Some issues with the plugin
- Important to understand WHY certain things work (fresh instances, etc.)
- "Learning how to use the screwdriver before you take the jackhammer"

### Claude Code Deep Dive

**Three ways to use Claude Code:**
1. **In Cursor** - Install via terminal, type "Claude" to spin it up
2. **Computer terminal** - Raw terminal usage
3. **In Claude itself** - Claude Code within Claude (Claude Workspace/Cowork)

**Key concepts explained:**
- **Skills** - Specific capabilities (PRD skill, RALPH skill, front-end aesthetics, etc.)
  - Anthropic has a marketplace with thousands of skills
  - Anti-gravity just announced skills too
  - Codex has skills
- **Sub-agents** - Like team members with specific roles (email marketer, ops manager)
  - Help divide context window
  - Prevent context degradation
- **Hooks** - More like workflows
- **Extensions** - Can install OpenAI Codex, Claude Code, etc. in Cursor
- **MCP connections** - One-line connections (Insports, Stripe, deployment platforms)

**Analogy:** Skills = specific skill sets a person has. Agents = the person themselves. Sub-agents = team members. Like a business org chart / chain of command.

### Agent-Native Apps (2026 Theme)

**Aki's prediction:**
- 2025 was GPT wrappers (chat interface + specific vertical)
- 2026 will be Agent-native apps (apps powered by AI agents, not just chat)
- Claude Cowork was built in 1.5 weeks using Claude Code
- Built on the Claude Agent SDK
- Agent SDK originated from Anthropic building internal agents repeatedly
- More straightforward to build than expected
- Will be putting resources in the community section

**Claude Agent SDK:**
- Originally called "Cloud Code SDK"
- SDK has the core elements that Claude Code was built from
- Can build all sorts of agents from it
- Agent SDK → build agent apps → new category emerging

### Key Quotes

**On the speed of change:**
- "The gap is widening... those who are staying on the pulse just move away quicker. It's almost like a different reality."
- "Our world just flipped upside down real quick"

**On Aki:**
- "I don't even know what to say about Akeem. I don't know when he sleeps. I'm beginning to think he's an AI agent."
- "He's from a different galaxy... came from a different planet"

**On the opportunity:**
- "Everyone's kind of on an even playing field because it's also all new"
- "The early adopters are definitely going to reap the benefits"
- "I need to get involved in this as soon as possible... the window..."

**Aki on identity:**
- "I'm completely AI native. I started with vibe coding. Even my background, I don't identify as technical. I feel like if I've been able to learn certain things, anybody can."
- "It's all through prompting, and it's really just understanding how things plug in to each other."
