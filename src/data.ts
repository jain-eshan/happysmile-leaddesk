// All data here is illustrative. HappySmile is the fictional clinic chain from the Twenty2 PM case.

export type Who = 'agent' | 'patient' | 'family' | 'staff' | 'system';

export interface ChatLine {
  who: Who;
  name?: string;
  text: string;
  note?: string;
}

export interface WaMessage {
  from: 'clinic' | 'patient';
  text: string;
  buttons?: string[];
  picked?: string;
  time: string;
}

export type PhoneView =
  | { kind: 'form'; treatment: string; name: string; phone: string; clinic: string; note: string; time: string }
  | { kind: 'thanks'; agent: string; number: string; eta: string; options: string[]; picked: string }
  | { kind: 'whatsapp'; messages: WaMessage[] }
  | { kind: 'incoming'; label: string; reason: string; time: string }
  | { kind: 'call'; title: string; duration: string; lines: ChatLine[] };

export interface Step {
  at: string;
  label: string;
  phone: PhoneView;
  events: string[];
  why: string;
  solves: string;
}

export interface Scenario {
  id: string;
  tab: string;
  persona: string;
  summary: string;
  playbook: string;
  steps: Step[];
}

const AGENT = 'Meera';
const NUMBER = '+91 124 400 2200';

export const scenarios: Scenario[] = [
  {
    id: 'aligners',
    tab: 'Aligners · working adult',
    persona: 'Riya Mehta, 27, product analyst in Gurugram',
    summary:
      'Saw an Instagram ad for invisible aligners during a work break. Will not pick up an unknown number at her desk. Price and EMI decide it.',
    playbook: 'Aligners and braces',
    steps: [
      {
        at: '1:12 pm',
        label: 'Enquiry',
        phone: {
          kind: 'form',
          treatment: 'Clear aligners',
          name: 'Riya Mehta',
          phone: '+91 98110 4xxxx',
          clinic: 'Nearest to Sector 49',
          note: 'Thinking of aligners, want to know cost',
          time: '1:12 pm',
        },
        events: [
          '1:12:04  Enquiry received from Instagram lead form',
          '1:12:04  Phone matched: new patient, no history',
          '1:12:05  Playbook: Aligners and braces · Language guess: Hinglish',
          '1:12:05  Consent captured with form submit (purpose: this enquiry only)',
        ],
        why: 'Lead capture stays exactly as it is today. The system starts the moment the form is submitted.',
        solves: 'Ops head: no lead waits in a list',
      },
      {
        at: '1:12 pm',
        label: 'Thank-you page',
        phone: {
          kind: 'thanks',
          agent: AGENT,
          number: NUMBER,
          eta: 'in about 2 minutes',
          options: ['Call me now', 'Pick a time', 'WhatsApp me instead'],
          picked: 'Pick a time',
        },
        events: ['1:12:20  Thank-you page shows caller name, number and choices', '1:12:31  Riya picks "Pick a time": 7:30 pm today'],
        why: 'The patient sees who will call and from which number, and can choose when. 49% of Indians say they would answer more if they could schedule the call themselves.',
        solves: 'Patient: distrust of unknown numbers',
      },
      {
        at: '1:12 pm',
        label: 'WhatsApp heads-up',
        phone: {
          kind: 'whatsapp',
          messages: [
            {
              from: 'clinic',
              time: '1:12 pm',
              text: `Hi Riya, this is HappySmile Dental. Thanks for asking about clear aligners. ${AGENT} from our team will call you at 7:30 pm today from ${NUMBER}. Save this number so you know it is us.`,
              buttons: ['Call me now instead', 'Change time'],
            },
          ],
        },
        events: ['1:12:33  WhatsApp heads-up sent from verified HappySmile business number', '1:12:33  Call scheduled 7:30 pm · reminder to agent queue'],
        why: 'A message before the call, from a name she recognises. None of the clinic voice products we looked at do this today.',
        solves: 'Patient: pickup rate',
      },
      {
        at: '7:30 pm',
        label: 'Incoming call',
        phone: { kind: 'incoming', label: 'HappySmile Dental', reason: 'Your aligner enquiry', time: '7:30 pm' },
        events: ['7:30:00  Outbound call from declared number (TRAI A2P declared)', '7:30:00  Caller ID shows verified business name and call reason', '7:30:06  Answered'],
        why: 'A declared, branded number with a call reason. Spam-flagged numbers are the fastest way to waste a 2-minute response.',
        solves: 'Owner: number does not get flagged',
      },
      {
        at: '7:30 pm',
        label: 'The call',
        phone: {
          kind: 'call',
          title: `${AGENT} · HappySmile`,
          duration: '3:42',
          lines: [
            { who: 'agent', text: `Hi Riya, ${AGENT} here from HappySmile Dental, as promised on WhatsApp. Abhi 3 minute baat kar sakte hain?` },
            { who: 'patient', text: 'Haan, bolo. Mujhe bas cost samajhna tha aligners ka.' },
            { who: 'agent', text: 'Sure. Aligners usually come to ₹55,000 to ₹1,45,000, depending on how much movement you need. The exact plan is set after a free scan with our orthodontist. EMI is available on 6, 9 or 12 months.', note: 'Only clinic-approved price bands' },
            { who: 'patient', text: 'Office ke time pe visits possible nahi hain.' },
            { who: 'agent', text: 'Understood. Our orthodontist is at Sector 29 on Thursday till 8 pm, and at Golf Course Road on Saturday morning. Thursday 7:30 pm at Sector 29, or Saturday 11 am at Golf Course Road?', note: 'Two real options, nearest branches, orthodontist days only' },
            { who: 'patient', text: 'Thursday 7:30 works.' },
            { who: 'agent', text: 'Done. Thursday 7:30 pm, Sector 29, free scan and consult, about 40 minutes. I will send the details on WhatsApp. Please reply 1 there to confirm.' },
          ],
        },
        events: [
          '7:31:10  Price band shared (aligners · approved band)',
          '7:32:02  Slots fetched: orthodontist calendar, Sector 29 + Golf Course Rd',
          '7:33:20  Riya chose Thu 7:30 pm · Sector 29',
          '7:33:21  Booked · credited to Sector 29 coordinator (Pooja)',
        ],
        why: 'The call is unhurried. It answers the two things she cares about, price and timing, and makes her choose between two real options, which is a stronger commitment than a "yes".',
        solves: 'Patient: unclear prices · Dentist: right specialist slot',
      },
      {
        at: '7:34 pm',
        label: 'Confirmation',
        phone: {
          kind: 'whatsapp',
          messages: [
            {
              from: 'clinic',
              time: '7:34 pm',
              text: 'Your free aligner scan is booked.\nThu, 7:30 pm · HappySmile Sector 29\nWith: Orthodontist\nBring: nothing, the scan takes 15 min\nReply 1 to confirm, 2 to change.',
              buttons: ['1 Confirm', '2 Change'],
              picked: '1 Confirm',
            },
            { from: 'patient', time: '7:35 pm', text: '1' },
          ],
        },
        events: ['7:35:02  Confirmed by reply · status: Booked (confirmed)', 'Reminders queued: Wed 7 pm (WhatsApp), Thu 5:30 pm (WhatsApp)'],
        why: 'No reply means at-risk, and the front desk calls them the day before. Slots are released only on an explicit cancel.',
        solves: 'Ops head: no-shows',
      },
    ],
  },
  {
    id: 'implants',
    tab: 'Implants · family decides',
    persona: 'Suresh Sharma, 61, Gurugram. Enquiry filled by his son Karan, who lives in Pune',
    summary:
      'High-ticket and anxious. Karan researches and pays, the father has to agree and travel. Diabetes is a worry. This is the lead the front desk should close.',
    playbook: 'Implants (high value: human closes)',
    steps: [
      {
        at: '11:05 am',
        label: 'Enquiry',
        phone: {
          kind: 'form',
          treatment: 'Dental implants',
          name: 'Karan Sharma (for father)',
          phone: '+91 98201 7xxxx',
          clinic: 'Sector 29, Gurugram',
          note: 'For my father, 61. Loose teeth, wants fixed teeth',
          time: '11:05 am',
        },
        events: [
          '11:05:12  Enquiry from Google search landing page',
          '11:05:12  Phone matched: new · Value band: high (implants)',
          '11:05:13  Playbook: Implants · Decider likely the son',
        ],
        why: 'The person filling the form is often not the patient. The implant playbook plans for both.',
        solves: 'Patient: decider not on the call',
      },
      {
        at: '11:05 am',
        label: 'Thank-you page',
        phone: {
          kind: 'thanks',
          agent: AGENT,
          number: NUMBER,
          eta: 'in about 2 minutes',
          options: ['Call me now', 'Pick a time', 'WhatsApp me instead'],
          picked: 'Call me now',
        },
        events: ['11:05:30  Karan picks "Call me now"'],
        why: 'Inside calling hours and the user asked for a call, so the agent dials right away.',
        solves: 'Ops head: speed when the patient wants it',
      },
      {
        at: '11:06 am',
        label: 'The call',
        phone: {
          kind: 'call',
          title: `${AGENT} · HappySmile`,
          duration: '4:15',
          lines: [
            { who: 'agent', text: `Hello Karan, ${AGENT} from HappySmile Dental, about the implant enquiry for your father.` },
            { who: 'family', name: 'Karan', text: 'Haan. Ek baat, aap AI ho kya?' },
            { who: 'agent', text: 'Haan, main HappySmile ki AI assistant hoon. Aap chahen toh main abhi hamari team se baat karwa sakti hoon, ya pehle basic details le loon?', note: 'Never denies being AI when asked' },
            { who: 'family', name: 'Karan', text: 'Theek hai, details le lo. Papa ko diabetes hai, implant ho sakta hai?' },
            { who: 'agent', text: 'That is a question for our implant specialist after an exam, I cannot advise on it. What I can do is book a consult where Dr. Nair checks this first, along with a 3D scan.', note: 'No medical advice · clinical question flagged' },
            { who: 'agent', text: 'Single implants usually come to ₹25,000 to ₹65,000 per tooth. The 3D scan is ₹2,000 to ₹4,000 and is adjusted if you go ahead. The final quote comes after the exam.', note: 'Approved bands · extras said upfront' },
            { who: 'family', name: 'Karan', text: 'Main Saturday ko Gurugram aa raha hoon.' },
            { who: 'agent', text: 'Dr. Nair is at Sector 29 on Saturday. 10:30 am or 12 noon? Our coordinator Pooja will also call you before then to walk you through the plan.' },
            { who: 'family', name: 'Karan', text: '10:30.' },
            { who: 'system', text: 'High-value lead with a clinical question: handed to Pooja (Sector 29) with summary. Booking held.' },
          ],
        },
        events: [
          '11:07:02  Asked "are you AI?" → disclosed',
          '11:08:15  Clinical question (diabetes) → no advice, flagged',
          '11:09:40  Booked Sat 10:30 am · Dr. Nair (implants) · Sector 29',
          '11:10:05  Handoff card to Pooja: priority 1, SLA 30 min',
        ],
        why: 'The agent does the fast, routine part: first contact, price band, a slot the decider can attend. The front desk gets the high-value conversation, with everything already written down.',
        solves: 'Front-desk lead: her team owns the patient',
      },
      {
        at: '11:10 am',
        label: 'Family summary',
        phone: {
          kind: 'whatsapp',
          messages: [
            {
              from: 'clinic',
              time: '11:10 am',
              text: 'Implant consult booked for Mr. Suresh Sharma.\nSat, 10:30 am · HappySmile Sector 29\nWith: Dr. Nair (implant specialist)\nIncludes: 3D scan (₹2,000 to ₹4,000, adjusted in treatment)\nBring: current medicines list and any sugar reports\nForward this to family. Reply 1 to confirm.',
              buttons: ['1 Confirm', 'Share with family'],
              picked: '1 Confirm',
            },
            { from: 'patient', time: '11:12 am', text: '1. Forwarded to Papa.' },
          ],
        },
        events: ['11:12:20  Confirmed · summary forwarded by Karan', '11:31:00  Pooja called Karan, explained plan stages (logged)'],
        why: 'A message the family can forward, saying what happens, what it costs and what to bring. The decider is now in the loop.',
        solves: 'Patient: family not aligned on budget',
      },
    ],
  },
  {
    id: 'pain',
    tab: 'Tooth pain · same day',
    persona: 'Arjun Rao, 34, sales manager, woke up with severe tooth pain',
    summary: 'Needs a slot today, not a qualification call. Will go to whichever dentist sees him first.',
    playbook: 'Pain and emergency (book first, ask later)',
    steps: [
      {
        at: '8:41 am',
        label: 'Enquiry',
        phone: {
          kind: 'form',
          treatment: 'Tooth pain / root canal',
          name: 'Arjun Rao',
          phone: '+91 99580 2xxxx',
          clinic: 'Any near Sohna Road',
          note: 'Severe pain since night, swelling',
          time: '8:41 am',
        },
        events: ['8:41:03  Enquiry from website', '8:41:03  Playbook: Pain · urgency high', '8:41:04  Clinics open at 9:00 · call allowed (patient-requested, service call)'],
        why: 'Pain changes everything: the agent skips qualification and goes straight to the earliest slot.',
        solves: 'Patient: needs relief today',
      },
      {
        at: '8:42 am',
        label: 'The call',
        phone: {
          kind: 'call',
          title: `${AGENT} · HappySmile`,
          duration: '1:48',
          lines: [
            { who: 'agent', text: `Hi Arjun, ${AGENT} from HappySmile. Sorry you are in pain. Let me get you seen today. Which is closer, Sohna Road or Sector 49?` },
            { who: 'patient', text: 'Sohna Road.' },
            { who: 'agent', text: 'Sohna Road has 10:15 am today, or Sector 49 at 9:45 am. Which one?', note: 'Earliest two slots, nearest branches' },
            { who: 'patient', text: '9:45, Sector 49.' },
            { who: 'agent', text: 'Booked. Swelling ke saath fever ho ya saans lene mein dikkat ho, toh seedha emergency jaiye. Directions aa rahe hain WhatsApp pe.', note: 'Safety line approved by dentists, no diagnosis' },
          ],
        },
        events: ['8:42:30  Slots: Sector 49 9:45, Sohna Rd 10:15', '8:43:10  Booked 9:45 · Sector 49', '8:43:11  Clinic notified: pain patient, arriving 9:45'],
        why: 'Under two minutes, two options, booked. Price talk waits for the dentist.',
        solves: 'Owner: lost to the local dentist first',
      },
      {
        at: '8:43 am',
        label: 'Directions',
        phone: {
          kind: 'whatsapp',
          messages: [
            {
              from: 'clinic',
              time: '8:43 am',
              text: 'Booked: today 9:45 am · HappySmile Sector 49\nMaps: happysmile.in/s49\nConsult fee ₹500, adjusted in treatment.\nRunning late? Reply LATE and we will hold the chair.',
              buttons: ['Open map', 'LATE'],
            },
          ],
        },
        events: ['9:47:00  Checked in (front desk)'],
        why: 'Same-day bookings do not need reminders, they need directions and a way to say "running late".',
        solves: 'Ops head: chair held, not lost',
      },
    ],
  },
  {
    id: 'braces',
    tab: 'Braces · parent, after hours',
    persona: 'Neha Gupta, mother of Ananya (14). Enquired at 10:05 pm',
    summary: 'Both parents decide. The child is in school all day. The enquiry came in after calling hours.',
    playbook: 'Aligners and braces (teen)',
    steps: [
      {
        at: '10:05 pm',
        label: 'Enquiry',
        phone: {
          kind: 'form',
          treatment: 'Braces for child',
          name: 'Neha Gupta',
          phone: '+91 98711 3xxxx',
          clinic: 'Golf Course Road',
          note: 'Daughter 14, crooked teeth, options and cost?',
          time: '10:05 pm',
        },
        events: ['22:05:40  Enquiry from website', '22:05:40  Outside calling hours (9 am to 9 pm) · no call', '22:05:41  After-hours rule: WhatsApp now, call at chosen time'],
        why: 'No calls late at night. The patient still hears from us in seconds.',
        solves: 'Owner: no spam complaints, no late calls',
      },
      {
        at: '10:05 pm',
        label: 'WhatsApp now',
        phone: {
          kind: 'whatsapp',
          messages: [
            {
              from: 'clinic',
              time: '10:05 pm',
              text: `Hi Neha, thanks for asking about braces for Ananya. It is late, so we will not call now. When can ${AGENT} from HappySmile call you? It takes about 5 minutes.`,
              buttons: ['Tomorrow 10 am', 'Tomorrow 5:30 pm', 'Other time'],
              picked: 'Tomorrow 5:30 pm',
            },
          ],
        },
        events: ['22:06:12  Neha picks tomorrow 5:30 pm'],
        why: 'She chooses a time when she is free and can loop in her husband.',
        solves: 'Patient: timing friction',
      },
      {
        at: '5:30 pm',
        label: 'The call',
        phone: {
          kind: 'call',
          title: `${AGENT} · HappySmile`,
          duration: '5:02',
          lines: [
            { who: 'agent', text: `Hi Neha, ${AGENT} from HappySmile, calling at 5:30 as you asked.` },
            { who: 'patient', text: 'Haan. Metal, ceramic, aligners, sab mein kya farak hai? Aur kitna lagega?' },
            { who: 'agent', text: 'Metal braces usually come to ₹25,000 to ₹53,000, ceramic ₹48,000 to ₹60,000, and aligners more. Retainers after treatment are extra, about ₹8,000 to ₹10,000. Our orthodontist recommends the type after checking Ananya.', note: 'Includes the extra families get surprised by' },
            { who: 'patient', text: 'Ananya ka school hai, aur unke papa bhi aana chahenge.' },
            { who: 'agent', text: 'Then a Saturday works best so both of you can come. Golf Course Road, Saturday 11 am or 12:30 pm?' },
            { who: 'patient', text: '12:30.' },
            { who: 'agent', text: 'Booked for Saturday 12:30. I am sending a summary on WhatsApp that you can forward to your husband.' },
          ],
        },
        events: ['17:33:50  Booked Sat 12:30 pm · Orthodontist · Golf Course Rd', '17:34:00  Note: both parents attending'],
        why: 'A slot the deciders can attend, and a message they can share. That is what turns a booking into a show-up.',
        solves: 'Patient: decider not on the call',
      },
      {
        at: 'Fri 7 pm',
        label: 'Reminder',
        phone: {
          kind: 'whatsapp',
          messages: [
            {
              from: 'clinic',
              time: 'Fri 7:00 pm',
              text: 'Reminder: Ananya\'s braces consult is tomorrow, 12:30 pm, HappySmile Golf Course Road.\nWhat happens: check-up, X-ray, options explained (about 45 min).\nNeed to change? Reply 2. We will offer the next Saturday.',
              buttons: ['See you tomorrow', '2 Change'],
              picked: 'See you tomorrow',
            },
          ],
        },
        events: ['Fri 19:02  Reply received · status Confirmed'],
        why: 'The reminder says what happens, how long it takes and how to change it. Rescheduling beats a silent no-show.',
        solves: 'Ops head: no-shows',
      },
    ],
  },
];

export type LeadStatus = 'needs_you' | 'booked' | 'at_risk' | 'no_answer' | 'scheduled' | 'whatsapp_only' | 'control';

export interface Lead {
  id: string;
  name: string;
  treatment: string;
  value: 'High' | 'Medium' | 'Low';
  clinic: 'Sector 29' | 'Golf Course Rd';
  source: string;
  enquired: string;
  firstContact: string;
  status: LeadStatus;
  group: 'AI-first' | 'Control';
  priority: number;
  reason: string;
  summary: string;
  decider: string;
  worry: string;
  slot?: string;
  credited: string;
  language: string;
  next: string;
  transcript: ChatLine[];
}

export const statusMeta: Record<LeadStatus, { label: string; tone: string }> = {
  needs_you: { label: 'Needs you', tone: 'red' },
  booked: { label: 'Booked', tone: 'green' },
  at_risk: { label: 'At risk', tone: 'amber' },
  no_answer: { label: 'No answer yet', tone: 'grey' },
  scheduled: { label: 'Call scheduled', tone: 'blue' },
  whatsapp_only: { label: 'WhatsApp only', tone: 'blue' },
  control: { label: 'Control group', tone: 'grey' },
};

export const leads: Lead[] = [
  {
    id: 'L-2041',
    name: 'Suresh Sharma (via son Karan)',
    treatment: 'Implants',
    value: 'High',
    clinic: 'Sector 29',
    source: 'Google search',
    enquired: '11:05 am',
    firstContact: '1m 12s',
    status: 'needs_you',
    group: 'AI-first',
    priority: 98,
    reason: 'High value · clinical question (diabetes)',
    summary: 'Son booked father (61) for implant consult Sat 10:30 with Dr. Nair. Asked if diabetes rules out implants. Price band and 3D scan cost shared, no objection. Son will travel from Pune for the visit.',
    decider: 'Son (pays) and patient',
    worry: 'Safety with diabetes',
    slot: 'Sat 10:30 am · Dr. Nair',
    credited: 'Pooja (Sector 29)',
    language: 'Hinglish',
    next: 'Call Karan before 12 pm. Explain plan stages and that Dr. Nair will review sugar reports first.',
    transcript: [
      { who: 'family', name: 'Karan', text: 'Papa ko diabetes hai, implant ho sakta hai?' },
      { who: 'agent', text: 'That is for our implant specialist after an exam. I can book a consult where Dr. Nair checks this first.' },
    ],
  },
  {
    id: 'L-2047',
    name: 'Kavita Menon',
    treatment: 'Full-arch implants',
    value: 'High',
    clinic: 'Golf Course Rd',
    source: 'Meta ad',
    enquired: '12:20 pm',
    firstContact: '1m 40s',
    status: 'needs_you',
    group: 'AI-first',
    priority: 95,
    reason: 'Asked for a discount · price negotiation',
    summary: 'Wears dentures, wants fixed teeth. Has a quote of ₹2.8L elsewhere and asked if we can match. Agent did not negotiate, offered a consult. Interested but undecided.',
    decider: 'Patient',
    worry: 'Price vs other quote',
    credited: 'Simran (Golf Course Rd)',
    language: 'English',
    next: 'Live transfer offered at 12:24, she preferred a callback after 2 pm.',
    transcript: [
      { who: 'patient', text: 'I have a quote of 2.8 lakh from another clinic. Can you do better?' },
      { who: 'agent', text: 'Pricing for full-arch is decided by our team after the exam. Shall I have Simran call you to discuss?' },
    ],
  },
  {
    id: 'L-2052',
    name: 'Rohit Bansal',
    treatment: 'Aligners',
    value: 'Medium',
    clinic: 'Sector 29',
    source: 'Instagram',
    enquired: '1:40 pm',
    firstContact: '2m 05s',
    status: 'at_risk',
    group: 'AI-first',
    priority: 81,
    reason: 'Booked but no reply to confirmation in 3 h',
    summary: 'Booked Thu 7 pm while driving. Said "haan theek hai" quickly. Has not replied 1 to the WhatsApp confirmation.',
    decider: 'Patient',
    worry: 'Not clear (short call)',
    slot: 'Thu 7:00 pm · Orthodontist',
    credited: 'Pooja (Sector 29)',
    language: 'Hinglish',
    next: 'Human call Wed evening to reconfirm. Release slot only if he cancels.',
    transcript: [
      { who: 'agent', text: 'Thursday 7 pm at Sector 29, or Saturday 11 am at Golf Course Road?' },
      { who: 'patient', text: 'Haan haan theek hai, Thursday.' },
    ],
  },
  {
    id: 'L-2038',
    name: 'Riya Mehta',
    treatment: 'Aligners',
    value: 'Medium',
    clinic: 'Sector 29',
    source: 'Instagram',
    enquired: '1:12 pm',
    firstContact: 'Scheduled 7:30 pm',
    status: 'booked',
    group: 'AI-first',
    priority: 60,
    reason: 'Booked and confirmed',
    summary: 'Wanted cost and EMI. Office hours clash, picked Thu 7:30 pm at Sector 29. Confirmed on WhatsApp.',
    decider: 'Patient',
    worry: 'Price, timing',
    slot: 'Thu 7:30 pm · Orthodontist',
    credited: 'Pooja (Sector 29)',
    language: 'Hinglish',
    next: 'None. Reminders queued.',
    transcript: [
      { who: 'patient', text: 'Office ke time pe visits possible nahi hain.' },
      { who: 'agent', text: 'Thursday 7:30 pm at Sector 29, or Saturday 11 am at Golf Course Road?' },
    ],
  },
  {
    id: 'L-2035',
    name: 'Arjun Rao',
    treatment: 'Tooth pain',
    value: 'Medium',
    clinic: 'Sector 29',
    source: 'Website',
    enquired: '8:41 am',
    firstContact: '58s',
    status: 'booked',
    group: 'AI-first',
    priority: 55,
    reason: 'Same-day booked · checked in',
    summary: 'Severe pain with swelling. Booked 9:45 at Sector 49 overflow. Checked in 9:47.',
    decider: 'Patient',
    worry: 'Pain',
    slot: 'Today 9:45 am · checked in',
    credited: 'Pooja (Sector 29)',
    language: 'English',
    next: 'Root canal plan discussed by dentist.',
    transcript: [{ who: 'agent', text: 'Sohna Road has 10:15 am today, or Sector 49 at 9:45 am. Which one?' }],
  },
  {
    id: 'L-2049',
    name: 'Neha Gupta (for Ananya, 14)',
    treatment: 'Braces',
    value: 'Medium',
    clinic: 'Golf Course Rd',
    source: 'Website',
    enquired: 'Yesterday 10:05 pm',
    firstContact: 'WhatsApp 20s · call 5:30 pm',
    status: 'scheduled',
    group: 'AI-first',
    priority: 58,
    reason: 'After-hours enquiry · call at 5:30 pm as chosen',
    summary: 'Asked about types and cost for daughter. Picked a 5:30 pm call slot on WhatsApp.',
    decider: 'Both parents',
    worry: 'Cost, school timing',
    credited: 'Simran (Golf Course Rd)',
    language: 'Hinglish',
    next: 'Agent calls at 5:30 pm.',
    transcript: [{ who: 'patient', text: '(WhatsApp) Tomorrow 5:30 pm' }],
  },
  {
    id: 'L-2055',
    name: 'Mohit Arora',
    treatment: 'Whitening',
    value: 'Low',
    clinic: 'Golf Course Rd',
    source: 'Meta ad',
    enquired: '2:02 pm',
    firstContact: '1m 50s · not answered',
    status: 'no_answer',
    group: 'AI-first',
    priority: 40,
    reason: '2 attempts · WhatsApp sent',
    summary: 'Did not pick up at 2:04 and 2:34. WhatsApp heads-up delivered and read, no reply.',
    decider: 'Patient',
    worry: 'Unknown',
    credited: 'Simran (Golf Course Rd)',
    language: 'Unknown',
    next: 'Third attempt 6:30 pm. Then stop and keep WhatsApp open.',
    transcript: [],
  },
  {
    id: 'L-2058',
    name: 'Aditi Kapoor',
    treatment: 'Veneers (wedding Dec 14)',
    value: 'High',
    clinic: 'Sector 29',
    source: 'Instagram',
    enquired: '3:15 pm',
    firstContact: '1m 30s',
    status: 'needs_you',
    group: 'AI-first',
    priority: 90,
    reason: 'Date-bound · asked for before/after photos',
    summary: 'Wedding on 14 Dec, wants veneers on 6 teeth. Asked for before/after photos and whether 2 visits are enough. Agent booked a consult Sat 4 pm and passed the photo request to staff.',
    decider: 'Patient and mother',
    worry: 'Ready in time, natural look',
    slot: 'Sat 4:00 pm · Cosmetic dentist',
    credited: 'Pooja (Sector 29)',
    language: 'English',
    next: 'Send clinic-approved case photos (consent on file) and confirm timeline with dentist.',
    transcript: [{ who: 'patient', text: 'Can you send before and after pictures? My wedding is on the 14th.' }],
  },
  {
    id: 'L-2060',
    name: 'Sunil Verma',
    treatment: 'Cleaning',
    value: 'Low',
    clinic: 'Sector 29',
    source: 'Google Maps',
    enquired: '3:40 pm',
    firstContact: 'WhatsApp 15s',
    status: 'whatsapp_only',
    group: 'AI-first',
    priority: 30,
    reason: 'Cleaning: WhatsApp-only playbook',
    summary: 'Got price (scaling from ₹1,690) and weekend slots on WhatsApp. Picked Sun 10 am.',
    decider: 'Patient',
    worry: 'Price',
    slot: 'Sun 10:00 am',
    credited: 'Pooja (Sector 29)',
    language: 'English',
    next: 'None.',
    transcript: [],
  },
  {
    id: 'L-2044',
    name: 'Farah Siddiqui',
    treatment: 'Aligners',
    value: 'Medium',
    clinic: 'Golf Course Rd',
    source: 'Meta ad',
    enquired: '11:50 am',
    firstContact: '4h 35m (front desk)',
    status: 'control',
    group: 'Control',
    priority: 35,
    reason: 'Control group: today\'s callback process',
    summary: 'Handled the current way for comparison. Front desk called at 4:25 pm. Not reached.',
    decider: 'Patient',
    worry: 'Unknown',
    credited: 'Simran (Golf Course Rd)',
    language: 'Unknown',
    next: 'Front desk follows current process.',
    transcript: [],
  },
  {
    id: 'L-2050',
    name: 'Prakash Iyer',
    treatment: 'Root canal',
    value: 'Medium',
    clinic: 'Sector 29',
    source: 'Website',
    enquired: '1:30 pm',
    firstContact: '5h 10m (front desk)',
    status: 'control',
    group: 'Control',
    priority: 33,
    reason: 'Control group: today\'s callback process',
    summary: 'Handled the current way for comparison. Booked Fri 11 am at 6:40 pm callback.',
    decider: 'Patient',
    worry: 'Pain',
    slot: 'Fri 11:00 am',
    credited: 'Pooja (Sector 29)',
    language: 'English',
    next: 'Front desk follows current process.',
    transcript: [],
  },
];

export const kpis = {
  enquiries: 52,
  aiGroup: 42,
  control: 10,
  medianFirstContact: '1m 48s',
  controlFirstContact: '4h 40m',
  answered: '71%',
  bookedAi: '45%',
  bookedControl: '30%',
  queueWait: '18 min',
};

export const experiment = [
  { metric: 'Reached within 1 hour', ai: 82, control: 20, unit: '%' },
  { metric: 'Booked a consult', ai: 45, control: 30, unit: '%' },
  { metric: 'Consults that happened (per 100 enquiries, 7-day)', ai: 34, control: 22, unit: '' },
];

export const priceBands = [
  { treatment: 'Clear aligners', band: '₹55,000 to ₹1,45,000', extras: 'Retainers ₹6,000 to ₹12,000', emi: '6, 9, 12 months' },
  { treatment: 'Metal braces', band: '₹25,000 to ₹53,000', extras: 'Retainers ₹8,000 to ₹10,000', emi: '6, 9, 12 months' },
  { treatment: 'Ceramic braces', band: '₹48,000 to ₹60,000', extras: 'Retainers ₹8,000 to ₹10,000', emi: '6, 9, 12 months' },
  { treatment: 'Single implant', band: '₹25,000 to ₹65,000', extras: '3D scan ₹2,000 to ₹4,000 · bone graft if needed', emi: '6, 12 months' },
  { treatment: 'Root canal', band: '₹4,800 to ₹10,500', extras: 'Crown ₹2,700 to ₹7,500', emi: 'No' },
  { treatment: 'Scaling and polishing', band: 'From ₹1,690', extras: 'None', emi: 'No' },
];
