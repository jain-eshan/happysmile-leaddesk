# Claude Code build prompt: HappySmile Lead Desk

Paste everything below the line into Claude Code, run from the root of `jain-eshan/happysmile-leaddesk` (to extend the existing build) or from an empty folder (to rebuild from scratch). It is written to be self-contained.

---

## 0. Your role and the goal

You are a senior product engineer and product designer. Build (or extend) **HappySmile Lead Desk**, a polished, clickable product prototype for a Product Manager case submission to **Twenty2 by Shiprocket**, an AI voice-calling platform for Indian businesses. The reviewer is Twenty2's product leadership. The prototype must look like a real product, run on Vercel, and make the case's reasoning visible on screen.

Work in this order: read this whole prompt, inspect the repo if one exists, write a short plan, build, run `npm run build`, screenshot every route at 1440 px and 390 px wide with Playwright, fix what looks wrong, then commit and push. Do not stop at a plan.

## 1. The case (source of truth)

- Case page: https://claude.ai/artifact/Ljsy96SLuJXqoeqiYZ8S6E
- Submission form: https://docs.google.com/forms/d/e/1FAIpQLSdY4ON5tdkq5HM_nDW-r1FmNF-qZznhkd6ngpeFuarwJwdERA/viewform

HappySmile is a fictional chain of **12 dental clinics in India**. About **300 people a day** enquire online about braces, whitening, implants and similar treatments. Front-desk staff call back **4 to 6 hours later**. About **30%** become booked appointments. HappySmile wants an **AI voice assistant** that reaches each enquirer within minutes, qualifies them, and books an appointment or hands over to staff.

Three stakeholder quotes the product must answer:
- **Operations head:** "Leads we happen to call within 5 minutes convert 3x better. So the fix is simple: call everyone faster."
- **Founder:** "The AI should sound so human that nobody realises it's AI."
- **Front-desk lead:** "Every lead should still go to my team. I don't trust a bot with patients."

The form asks for at most **two screens**: **#1 the moment a person asks to be contacted** and **#2 what HappySmile sees afterwards**, plus a 300-word brief (4-week scope, what is not being built, one success metric, one deliberately ignored metric, handling of the founder and front-desk lead), three questions for HappySmile, the most likely failure in month one, and one rejected AI suggestion.

## 2. Product thesis (keep every screen consistent with this)

Speed alone does not convert. The call has to be **answered, trusted and useful**, and someone has to **own the lead** afterwards. Lead Desk is an **AI first responder plus a front-desk queue**:
- The agent makes first contact within 5 minutes during calling hours and books routine consults.
- High-value, clinical and price-negotiation leads go to the front desk with a summary, so the patient never repeats themselves.
- Bookings are credited to the clinic's coordinator, so the front desk is not competing with the bot.
- 20% of enquiries are randomly kept on today's process as a control, so the lift is measured, not assumed.

Positions on the three quotes:
- **Ops head:** agree on speed. 3x on a 30% base would be 90%, so part of the 3x is which leads got called fast (daytime, warmer). The control group measures the true effect.
- **Founder:** agree with the goal (a call that feels like his own team), achieved through fast replies, natural turn-taking and Hinglish. The agent **never denies being AI when asked**, and the pilot A/B tests an upfront disclosure. No fake background noise.
- **Front-desk lead:** leads cannot wait for her team because the wait is the leak, but her team owns the patient: every lead visible in her queue, high-value ones handed over with context, bookings credited to her coordinators, and her team writes the test calls and signs off the scripts.

**Success metric:** consults that actually happened per 100 enquiries, against the control group.
**Deliberately ignored:** share of calls the AI completes without a human (chasing it cuts the handoffs that close implant leads).

**4-week scope (2 pilot clinics in Gurugram: Sector 29 and Golf Course Road):** WhatsApp heads-up then a call within 5 minutes; after 9 pm, WhatsApp now and a call at the patient's chosen time; Hindi, English, Hinglish; returning patients recognised by phone; playbooks for aligners and braces, implants, tooth pain (cleaning is WhatsApp only); clinic-approved price bands and EMI, never medical advice; two real slots across nearby branches on the right specialist's days; reply-to-confirm on WhatsApp, reminders the day before and 2 hours before, at-risk flags; front-desk queue with summaries and coordinator credit; control group; TRAI A2P declaration; consent on the form.
**Not doing yet:** a general workflow builder (rules live in one settings panel), personas guessed from age or gender, all 12 clinics, inbound calls, payments, writing back to patient records.

## 3. Research to reflect (cite in copy only where shown)

Patient personas and what loses the lead:
| Persona | Who decides | What loses the lead |
|---|---|---|
| Aligners, 22 to 32 | Self, often on EMI | Ignores unknown numbers at work; wants price and evening slots |
| Implants, 50+ | Adult child researches and pays | Decider not on the call; surprise extras like the 3D (CBCT) scan |
| Tooth pain | Self, today | Any delay; nearest local dentist sees them first |
| Teen braces | Both parents | School and office hours; other parent not in the loop |
| Wedding smile | Patient and family | Slow first contact; fixed date |
| Cleaning | Self, price-shopping | Calls feel like spam; WhatsApp only |

Facts used in copy:
- 79% of Indians avoid business calls from unknown numbers; 49% would answer more if they could schedule the call; 76% still prefer voice. Truecaller x Tata Tele Business Services, July 2026: https://www.businesstoday.in/technology/news/story/79-of-indians-avoid-unknown-business-calls-creating-new-challenge-for-brands-report-541499-2026-07-08
- Meta lead cost for healthcare and clinics in India is roughly ₹100 to ₹300, so 300 enquiries is about ₹30k to ₹90k a day in ad spend (treat as approximate).
- Price bands modelled on Clove Dental list prices: aligners ₹55,000 to ₹1,45,000 (retainers ₹6,000 to ₹12,000), metal braces ₹25,000 to ₹53,000, ceramic ₹48,000 to ₹60,000 (retainers ₹8,000 to ₹10,000), single implant ₹25,000 to ₹65,000 (3D scan ₹2,000 to ₹4,000), root canal ₹4,800 to ₹10,500 (crown ₹2,700 to ₹7,500), scaling from ₹1,690. Sources: https://clovedental.in/cost/aligners-cost, https://clovedental.in/cost/teeth-braces-cost, https://clovedental.in/dental-implant-cost-in-india, https://clovedental.in/root-canal-treatment-cost, https://clovedental.in/cost/teeth-cleaning-cost
- TRAI TCCCPR Third Amendment (18 Sep 2026): AI or artificial-voice calls are A2P calls that must be declared to the operator with their numbers; undeclared ones count as spam. https://www.trai.gov.in/sites/default/files/2026-09/PR_No119of2026.pdf
- National Dental Commission advisory (Oct 2026) on solicitation and misleading claims: the agent never pushes treatments or makes outcome promises. https://medicaldialogues.in/amp/news/health/doctors/national-dental-commission-warns-dentists-against-unethical-social-media-advertising-181335

Patterns borrowed from other products (do not name them on screen unless useful):
- Twenty2 healthcare agent: booking with calendar check, missed-call and web-enquiry callbacks, day-before confirmation, waitlist fill, never gives medical advice. https://www.twentytwo.in/use-cases/healthcare/
- Weave: AI and human conversations in one inbox, tasks with summaries. https://www.getweave.com/ai-receptionist/
- Retell: warm transfer with full context. https://www.retellai.com/use-cases/ai-medical-receptionist
- SevenRooms Voice AI: deposits by link, call categories feeding FAQ fixes. https://sevenrooms.com/platform/VoiceAI/
- Practo no-show policy and reconfirmation. https://www.practo.com/company/pns-policy
- August AI: discloses it is AI when asked, lets the patient choose among offered slots, asks clinics each question once. https://www.meetaugust.ai/blog/why-august-makes-the-phone-call-for-you
- Gaps no vendor covers well (our differentiation): a WhatsApp heads-up before the call, nearest-branch routing with two options, show-up rate as the outcome, a control group.

## 4. Design system (Twenty2-like, not Twenty2-branded)

Reference: https://www.twentytwo.in/ . Match the feel, not the brand.
- Background `#F9FAFB`, cards `#FFFFFF`, ink `#111111`, secondary text `#374151`, muted `#6B7280`, lines `#E5E7EB`.
- Headings: **Miriam Libre** (serif, weight 400). Body: **Inter** as a stand-in for Aeonik. Load both from Google Fonts.
- Black pill buttons (`border-radius: 9999px`), ghost and white pill variants. Cards with 12 px radius and 1 px border, no heavy shadows. Large serif headlines, generous whitespace, low-energy professional tone.
- Status tags: green (booked), amber (at risk), red (needs you), blue (scheduled, WhatsApp only), grey (no answer, control).
- **Do not** use the Twenty2 or Shiprocket logo, wordmark or the name as if this were their product. Brand the app "HappySmile Lead Desk" with a simple black "H" mark, subtitle "Concept on a Twenty2-style voice agent". Footer on every page: "Concept prototype by Eshan Jain (ISB PGP 2027) for the Twenty2 Product Manager case. HappySmile is fictional and all data is illustrative. Not an official Twenty2 or Shiprocket product. Price bands are modelled on public list prices from Indian dental chains."

## 5. Tech

- Vite + React + TypeScript, `react-router-dom` v6, plain CSS in one `styles.css` (no UI library). No backend.
- `vercel.json` with an SPA rewrite of every path to `/index.html`.
- All data in `src/data.ts`, typed. Pages in `src/pages/`.
- Must pass `tsc -b` with `noUnusedLocals` and `noUnusedParameters`.
- Responsive down to 390 px. Keyboard: left and right arrows step through the patient journey.

## 6. Routes and screens

### `/` Overview
1. Hero: eyebrow "Twenty2 PM case · HappySmile Dental"; headline "Every enquiry gets a trusted, useful conversation in 5 minutes."; a short paragraph with the problem and the thesis; two pills to Screen 1 and Screen 2. Right column: four stat cards (300 enquiries a day at ₹100 to ₹300 each; 4 to 6 h callback; 30% book, about 210 paid enquiries a day do not; 79% avoid unknown business numbers).
2. How it works: five numbered cards (Enquiry lands, Heads-up first, Call in 5 minutes, Useful unhurried call, Handoff or booking).
3. Who is on the other end: the six personas from section 3.
4. The first 4 weeks: Shipping list, Not doing list, How we measure it.
5. Three people, three answers: one card per stakeholder with the quote and our position.
6. Dark CTA band linking to both screens.

### `/patient` Screen 1: What the patient sees
Layout: scenario tabs on top, a persona bar (who, summary, playbook tag), then a two-column layout: a **phone mock** (360 x 720, notch, status bar) on the left with Back, step dots and Next below; on the right a **step card** (step n of N, time, "solves" tag, title, why), a **Behind the scenes** card (timestamped monospace system events) and a **This journey** timeline (clickable).

Phone view kinds: `form` (HappySmile booking form with a consent checkbox that mentions calls, WhatsApp and the AI assistant), `thanks` (caller name, number, ETA, options Call me now / Pick a time / WhatsApp me instead, picked one highlighted), `whatsapp` (business chat with bubbles, quick-reply buttons, picked one ticked), `incoming` (verified business caller ID with call reason), `call` (dark header with waveform, transcript with labelled turns, green "✓" notes on lines that show a design rule, amber system line for handoffs).

Four scenarios (agent name **Meera**, number +91 124 400 2200):
1. **Aligners · working adult** (Riya Mehta, 27, Instagram ad, 1:12 pm). Picks a 7:30 pm call on the thank-you page, gets a WhatsApp heads-up, verified incoming call, unhurried Hinglish call with the approved price band and EMI, two options (Thu 7:30 pm Sector 29 or Sat 11 am Golf Course Rd), books Thursday, confirms with reply "1", reminders queued.
2. **Implants · family decides** (Suresh Sharma, 61; form filled by son Karan in Pune). Karan asks "aap AI ho kya?" and the agent says yes and offers a person. He asks if diabetes rules out implants: no advice, flagged. Price band plus 3D scan cost said upfront, "final quote after exam". Saturday slot the son can attend with Dr. Nair. Handed to Pooja (Sector 29) with a summary; family-forwardable WhatsApp summary listing what to bring.
3. **Tooth pain · same day** (Arjun Rao, 8:41 am). Pain playbook skips qualification: two earliest slots at the nearest branches, booked in under 2 minutes, an approved safety line, WhatsApp directions with a LATE reply option.
4. **Braces · parent, after hours** (Neha Gupta for Ananya, 14, 10:05 pm). No call after 9 pm: WhatsApp now with time choices, she picks 5:30 pm next day; call explains types, bands and retainers; Saturday slot so both parents and the child can come; a shareable summary; a reminder that says what happens, how long, and how to change.

Every step has: `at`, `label`, `phone`, `events[]`, `why`, `solves` (which persona's pain it solves).

### `/desk` Screen 2: What HappySmile sees afterwards
- Header: "Front-desk queue · Today", clinic segmented control (All, Sector 29, Golf Course Rd), Rules button, amber "Pilot · illustrative data" tag.
- KPI strip (5 cards): enquiries today (52; 42 AI-first, 10 control), median time to first contact (1m 48s vs control 4h 40m), calls answered (71%, with heads-up and verified ID), booked a consult (45% vs control 30%), handoff wait (18 min, target under 30).
- Two columns: **queue** (tabs Needs you, At risk, Scheduled, No answer, Booked, All with counts; lead cards sorted by priority with name, status tag, reason, treatment, clinic, time, priority P-score) and **lead detail** (status, group, id, name, meta line; actions Call now, WhatsApp, Mark done; a black "Next best action" box; facts grid: decider, main worry, value, first contact, booking, credited to; "What the patient already told us" summary with language; snippet "From the call").
- **Experiment card:** AI-first vs control bars for reached within 1 hour (82 vs 20), booked a consult (45 vs 30), consults that happened per 100 enquiries 7-day (34 vs 22), with the note that the last row is the success metric and AI-only completion is deliberately not shown.
- **Rules drawer** (owned by the front-desk lead; "No workflow builder in the pilot"): calling hours (9 am to 9 pm, after hours WhatsApp now and call at chosen time, 3 attempts over 24 h); handoff toggles (clinical question, price negotiation, implant or full-arch, asks for a person, misunderstands twice); playbooks (three live, teen-braces rule, cleaning WhatsApp only, wedding "Next"); AI disclosure (never deny always on; test upfront disclosure on 50% of calls); approved price bands table with extras and EMI; "Final price always after the exam. Signed off by the clinical lead."
- Leads (11): Suresh Sharma via Karan (implants, needs you, P98), Kavita Menon (full-arch, price negotiation, needs you), Aditi Kapoor (veneers before a 14 Dec wedding, photos request, needs you), Rohit Bansal (aligners, polite "haan" while driving, no reply to confirmation, at risk), Riya Mehta (booked), Arjun Rao (same-day, checked in), Neha Gupta (scheduled 5:30 pm), Mohit Arora (whitening, no answer after 2 attempts), Sunil Verma (cleaning, WhatsApp only, booked), Farah Siddiqui and Prakash Iyer (control group, called back after 4 to 6 hours).

## 7. Writing rules for all copy

- No em dashes or en dashes anywhere. Use commas, colons, "to" for ranges, or new sentences.
- Plain, direct sentences. No hype words (seamless, leverage, robust, cutting-edge, empower, revolutionize).
- Indian context: ₹ with Indian digit grouping (₹1,45,000), Hinglish in transcripts written naturally in Latin script.
- Every number on screen is either from section 3 or clearly labelled illustrative.

## 8. Acceptance checks (run them, do not just claim them)

1. `npm run build` passes with zero TypeScript errors.
2. Playwright screenshots at 1440x900 (full page) and 390x844 for `/`, `/patient` (every step of every scenario), `/desk` (each queue tab, Rules drawer open). Fix any overflow, clipped text, overlapping elements or class-name collisions.
3. Clicking every tab, dot, Next/Back, queue card and Rules toggle works; arrow keys step the journey; the drawer closes on backdrop click.
4. Deep links `/patient` and `/desk` load directly on Vercel (SPA rewrite works).
5. Search the source for "—" and "–" and remove them.
6. The footer disclaimer is present on every route; no Twenty2 or Shiprocket logo files are used.

## 9. Ship

- Commit with a clear message, push to `main` on `jain-eshan/happysmile-leaddesk`. Vercel builds from GitHub automatically (framework Vite, build `npm run build`, output `dist`).
- If the Vercel project does not exist yet: import the repo at https://vercel.com/new/import?s=https%3A%2F%2Fgithub.com%2Fjain-eshan%2Fhappysmile-leaddesk and deploy.

## 10. Stretch ideas (only if asked)

- **Hear the call:** play each transcript line with a Hindi/English TTS voice (for example Sarvam Bulbul or ElevenLabs) behind a "Play call" button, captions synced.
- **Autoplay journey:** a play button that advances steps on a timer, for screen recording into the submission.
- **Live demo agent:** a real outbound demo call to the reviewer's number using a voice-agent framework (Pipecat or LiveKit) with a Hinglish STT and TTS, restricted to the HappySmile script.
- **Owner view:** cost per show-up, paid-lead leakage in ₹, branch comparison.
- **Wedding playbook** (date-backwards scheduling) and a refundable UPI token for high-value consults, both marked as next phase.
