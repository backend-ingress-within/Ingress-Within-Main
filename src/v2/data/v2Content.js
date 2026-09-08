// Ingress Within V2 Content Architecture

export const V2_NAV_LINKS = [
  { label: 'Home', path: '/v2' },
  { label: 'What It Is', path: '/v2/what-it-is' },
  { label: 'How It Works', path: '/v2/how-it-works' },
  { label: 'About Us', path: '/v2/about' },
  { label: 'Pricing', path: '/v2/pricing' },
  { label: 'Resources', path: '/v2/guided-journaling' },
  { label: 'FAQ', path: '/v2/faq' },
  { label: 'Contact', path: '/v2/contact' },
];

export const V2_JOURNEY_STAGES = [
  { step: '01', title: 'REFLECT', subtitle: 'Notice what is present right now' },
  { step: '02', title: 'UNDERSTAND', subtitle: 'Give words to unnamed feelings' },
  { step: '03', title: 'NOTICE', subtitle: 'Observe recurring emotional loops' },
  { step: '04', title: 'GROW', subtitle: 'Align choices with core values' },
  { step: '05', title: 'CONTINUE', subtitle: 'Build sustainable self-clarity' },
];

export const V2_PATHWAYS = [
  {
    step: '01',
    category: 'INDEPENDENT INQUIRY',
    title: 'Work on yourself',
    description: 'Understand what is happening within you with structured learning, reflective prompts, and longitudinal pattern recognition.',
    linkText: 'Learn more',
    path: '/v2/what-it-is',
    accent: '#758D7E', // Muted Sage
    accentSoft: '#EBF1ED',
  },
  {
    step: '02',
    category: 'GUIDED COLLABORATION',
    title: 'Work with a therapist',
    description: 'Bring continuity to your care with between-session reflections, shared milestones, and clear thematic recaps.',
    linkText: 'Learn more',
    path: '/v2/how-it-works',
    accent: '#B69186', // Warm Clay
    accentSoft: '#F6EFEB',
  },
  {
    step: '03',
    category: 'INTEGRATED RHYTHM',
    title: 'Move between the two',
    description: 'Your journey doesn’t have to follow one route. Switch, combine or explore—whatever works for you.',
    linkText: 'Learn more',
    path: '/v2/about',
    accent: '#8FA0AF', // Soft Blue-Grey
    accentSoft: '#EEF3F7',
  },
];

export const V2_STARTING_POINTS = [
  {
    quote: "I'm overthinking small interactions after they finish.",
    theme: "Anticipation & Rumination",
    color: "#E2EBE5"
  },
  {
    quote: "I keep having the same argument with my partner.",
    theme: "Relational Dynamics",
    color: "#EFE3DE"
  },
  {
    quote: "I don't know why that comment affected me so deeply.",
    theme: "Emotional Granularity",
    color: "#E4EBF0"
  },
  {
    quote: "I want to understand myself without feeling judged.",
    theme: "Safe Sanctuary",
    color: "#EFE4D0"
  },
  {
    quote: "Something feels subtly off, but I can't explain it.",
    theme: "Somatic Signals",
    color: "#E9E3EA"
  },
  {
    quote: "I find myself saying yes when everything in me wants to say no.",
    theme: "Boundaries & Autonomy",
    color: "#E3E9E8"
  }
];

export const V2_DOMAINS = [
  {
    id: 'thoughts',
    number: '01',
    title: 'Thoughts',
    subtitle: 'Cognitive Observation',
    desc: 'Notice what repeatedly occupies your mind, the assumptions you make under uncertainty, and the narratives you tell yourself.',
  },
  {
    id: 'emotions',
    number: '02',
    title: 'Emotions',
    subtitle: 'Granular Registration',
    desc: 'Explore the nuance behind how experiences affect you. Move beyond simple labels toward exact emotional vocabulary.',
  },
  {
    id: 'reactions',
    number: '03',
    title: 'Reactions',
    subtitle: 'Behavioral Triggers',
    desc: 'Understand how you instinctively respond in high-friction, conflict, or vulnerable moments before automatic habits take over.',
  },
  {
    id: 'patterns',
    number: '04',
    title: 'Patterns',
    subtitle: 'Thematic Connections',
    desc: 'See the recurring loops that connect disparate events across weeks and months, revealing unseen behavioral costs.',
  },
  {
    id: 'values',
    number: '05',
    title: 'Values',
    subtitle: 'Internal Compass',
    desc: 'Clarify what genuinely matters to you and distinguish authentic principles from inherited obligations or social expectations.',
  },
  {
    id: 'self_understanding',
    number: '06',
    title: 'Self-Understanding',
    subtitle: 'Integrated Wisdom',
    desc: 'Bring these observations together over time into a calm, coherent sense of identity that withstands daily volatility.',
  },
];

export const V2_FRAMEWORK_STEPS = [
  {
    number: '01',
    stage: 'EXPERIENCE',
    headline: 'Something happens.',
    detail: 'An unexpected reaction, a difficult conversation, a moment of fatigue, or an unexplained spark of clarity in your daily life.'
  },
  {
    number: '02',
    stage: 'REFLECT',
    headline: 'You write it down.',
    detail: 'Using five gentle prompts, you untangle what took place, why it resonated, and what bodily signals arose without judgment.'
  },
  {
    number: '03',
    stage: 'NOTICE',
    headline: 'Connections emerge.',
    detail: 'Over weeks of practice, subtle themes, recurring triggers, and behavioral costs become unmistakably visible in longitudinal reports.'
  },
  {
    number: '04',
    stage: 'UNDERSTAND',
    headline: 'Clarity builds over time.',
    detail: 'Rather than fighting habitual reactions, you gain the quiet composure to choose conscious, values-aligned responses.'
  }
];

export const V2_FAQS = [
  {
    q: "How is Ingress Within different from regular journaling apps?",
    a: "Most journaling apps present a blank text box or surface generic daily motivation quotes. Ingress Within is built on structured psychological inquiry. It uses evidence-informed prompt sequences, emotional granularity frameworks, and longitudinal pattern recognition to help you connect dots across months rather than just accumulating isolated notes."
  },
  {
    q: "Is this therapy, or does it replace a therapist?",
    a: "No. Ingress Within is a psychoeducational and self-reflection platform, not a medical or clinical diagnosis tool. It is designed to complement professional therapy by giving you a place to do between-session reflection, or to serve as an independent practice for personal growth and self-understanding."
  },
  {
    q: "Who can see what I write in my journal?",
    a: "Your reflections are completely private by default. No family members, employers, or third parties have access. If you choose to work with a verified therapist, you explicitly decide which specific entries or milestone summaries to share with them."
  },
  {
    q: "How does AI operate within Ingress Within?",
    a: "AI functions strictly as an organizational synthesizer and linguistic mirror. It tags themes, surfaces longitudinal connections, and organizes reflection data. It NEVER diagnoses, prescribes treatment, or makes psychological judgments. The interpretation and authority always remain with you."
  },
  {
    q: "What if I miss several days or weeks of writing?",
    a: "There are no punitive streak counters, guilt notifications, or algorithmic penalties. Ingress Within is a calm sanctuary. Your history waits for you exactly where you left off, and your reports adapt seamlessly to your natural rhythm."
  },
  {
    q: "Can I switch between self-work and therapy?",
    a: "Yes. The platform is designed around seamless continuity. You can practice independently, connect with a licensed practitioner when you want structured support, and return to independent self-work with all your milestones and reflections preserved."
  }
];

export const V2_SEO_PAGES = [
  {
    slug: 'guided-journaling',
    title: 'Guided Journaling for Self-Discovery & Mental Clarity',
    shortTitle: 'Guided Journaling',
    description: 'A structured, evidence-informed guide on how guided journaling prompts foster emotional granularity and lasting personal insight.',
    category: 'Core Pillar',
    readTime: '9 min read',
    intro: 'Journaling is often recommended as a path to peace of mind, yet staring at a blank page frequently produces hesitation or superficial recaps. Guided journaling provides a structured scaffolding that helps you access deeper psychological layers with ease and psychological safety.',
    sections: [
      {
        heading: 'Why the Blank Page Fails Us',
        content: 'When we sit down with an unstructured blank notebook, our default cognitive defense mechanisms often take control. We write about what we did—our schedules, tasks, and surface events—while avoiding the emotional undercurrents that caused subtle stress throughout the day. Structured prompts gently bypass this avoidance by directing attention to somatic signals, implicit beliefs, and emotional triggers.'
      },
      {
        heading: 'The 5-Prompt Framework of Guided Inquiry',
        content: 'A thoughtful reflection does not require hours of writing. By moving through a 5-step sequence—Context (What happened?), Appraisal (Why did it feel significant?), Somatic Signal (Where did tension register?), Reaction (How did I behave?), and Compassionate Perspective (What would I tell a close friend?)—we transform a momentary reaction into an opportunity for emotional maturity.'
      },
      {
        heading: 'Moving from Venting to Integration',
        content: 'Unstructured journaling can occasionally turn into rumination, reinforcing feelings of grievance or powerlessness. Guided journaling acts as an intentional containment vessel: it gives emotions room to breathe while grounding them in constructive observation, helping you close the journal with a sense of completion rather than unresolved agitation.'
      }
    ]
  },
  {
    slug: 'self-reflection',
    title: 'How to Practice Psychological Self-Reflection in Daily Life',
    shortTitle: 'Self-Reflection',
    description: 'Explore the principles of psychological self-reflection, metacognition, and how to observe your internal dynamics without self-criticism.',
    category: 'Core Pillar',
    readTime: '8 min read',
    intro: 'Self-reflection is the deliberate practice of stepping back to witness your own thoughts, emotions, and reactions. When practiced with curiosity rather than self-judgment, it transforms reactive habits into conscious choices.',
    sections: [
      {
        heading: 'The Difference Between Reflection and Rumination',
        content: 'Rumination asks "Why is this always happening to me?" and traps the mind in repetitive distress loops. True self-reflection asks "What belief was activated in that moment?" and creates space between the trigger and your response. The distinction lies in intentionality and emotional neutrality.'
      },
      {
        heading: 'Cultivating the Observer Self',
        content: 'Psychological health expands when we realize we are not our thoughts; we are the conscious observer who experiences them. Developing this metacognitive vantage point allows you to feel anger, grief, or hesitation without allowing those transient states to define your identity.'
      },
      {
        heading: 'Building a Sustainable Daily Cadence',
        content: 'Reflection is not an emergency tool reserved exclusively for crises. Spending five minutes in quiet inquiry at the end of the day builds an internal reservoir of self-trust, ensuring you navigate unexpected challenges with steady perspective.'
      }
    ]
  },
  {
    slug: 'emotional-patterns',
    title: 'Recognizing Recurring Emotional & Behavioral Patterns',
    shortTitle: 'Emotional Patterns',
    description: 'Learn how to identify unconscious emotional cycles, defense mechanisms, and behavioral loops across your relationships and career.',
    category: 'Core Pillar',
    readTime: '10 min read',
    intro: 'Most of our daily friction does not come from novel events; it comes from familiar scripts rehearsed over years. Identifying these patterns is the first step toward reclaiming your agency.',
    sections: [
      {
        heading: 'How Emotional Scripts Are Formed',
        content: 'In early life and formative relationships, we develop adaptive behaviors to preserve safety, approval, and connection. While people-pleasing, avoidance, or emotional withdrawal may have served as crucial shields in the past, they often become expensive liabilities in adult life.'
      },
      {
        heading: 'The Anatomy of a Behavioral Loop',
        content: 'Every recurring pattern has four consistent components: the Context (the situation), the Interpretation (the internal story), the Somatic Urge (the physical reflex), and the Default Action (the habitual response). Tracking these elements across multiple days reveals the underlying mechanism of the loop.'
      },
      {
        heading: 'Interrupting the Cycle at the Point of Decision',
        content: 'You do not have to eradicate an instinct to change its outcome. Simply noticing the gap between the urge and the reaction gives you the critical seconds needed to choose a new, values-aligned response.'
      }
    ]
  },
  {
    slug: 'self-awareness',
    title: 'The Architecture of Authentic Self-Awareness',
    shortTitle: 'Self-Awareness',
    description: 'A deep exploration into internal and external self-awareness, emotional vocabulary, and cognitive congruence.',
    category: 'Core Pillar',
    readTime: '8 min read',
    intro: 'Self-awareness is not an innate trait that you either possess or lack; it is a trainable psychological skill cultivated through quiet, honest observation.',
    sections: [
      {
        heading: 'Internal vs. External Self-Awareness',
        content: 'Internal self-awareness represents how clearly we perceive our own values, passions, aspirations, and reactions. External self-awareness is understanding how others view us. True psychological balance exists when these two perspectives are harmonized without sacrificing personal integrity.'
      },
      {
        heading: 'The Power of Emotional Granularity',
        content: 'When we only describe our inner state as "fine" or "bad", our nervous system has limited options for regulation. Naming a feeling with precision—distinguishing resentment from disappointment, or apprehension from exhaustion—immediately activates prefrontal regulation mechanisms.'
      },
      {
        heading: 'From Self-Awareness to Meaningful Action',
        content: 'Awareness without application can lead to intellectualized paralysis. Genuine insight proves its worth when it translates into clearer boundaries, more candid communication, and greater compassion for yourself and others.'
      }
    ]
  },
  {
    slug: 'journaling-prompts-for-self-discovery',
    title: '50 Deep Journaling Prompts for Self-Discovery & Inner Truth',
    shortTitle: 'Journaling Prompts',
    description: 'Curated psychological prompts organized by theme: identity, values, relational boundaries, emotional triggers, and future horizons.',
    category: 'Supporting Guide',
    readTime: '12 min read',
    intro: 'The quality of your self-understanding is shaped by the quality of the questions you dare to ask yourself. Explore these carefully crafted inquiry prompts.',
    sections: [
      {
        heading: 'Identity & Self-Perception Prompts',
        content: '• What rules about how I "should" behave am I ready to question?\n• Which part of my personality do I feel most pressured to perform for others?\n• If I did not have to prove anything to anyone, what would I stop doing immediately?'
      },
      {
        heading: 'Emotional Triggers & Boundary Prompts',
        content: '• In which recurring situation do I feel my body tighten before my mind understands why?\n• Where am I currently giving away my energy out of habit or obligation rather than genuine desire?\n• What difficult truth have I been holding at arm’s length this month?'
      },
      {
        heading: 'Values & Forward Trajectory Prompts',
        content: '• What mattered deeply to me a year ago that has quietly lost its urgency?\n• What is one small boundary that would immediately bring peace to my upcoming week?\n• What would the most grounded, self-compassionate version of myself do next?'
      }
    ]
  },
  {
    slug: 'how-to-start-journaling',
    title: 'How to Start Journaling for Beginners: A Mindful Approach',
    shortTitle: 'How to Start Journaling',
    description: 'A step-by-step practical guide to starting a reflective journaling habit without burnout, perfectionism, or intimidation.',
    category: 'Supporting Guide',
    readTime: '7 min read',
    intro: 'Starting a journaling practice does not require fancy notebooks, elaborate rituals, or poetic prose. It begins with the willingness to spend three minutes listening to yourself.',
    sections: [
      {
        heading: 'Release the Myth of Perfect Writing',
        content: 'Your journal is not a performance piece for an invisible audience. It is an unvarnished scratchpad for your raw thoughts. Misspellings, fragmented sentences, and abrupt shifts in topic are not mistakes—they are proof of authentic expression.'
      },
      {
        heading: 'Start with Low Friction Anchors',
        content: 'Rather than committing to an ambitious hour-long daily session, begin with a two-minute evening reflection. Anchor the habit to an existing routine, such as after brewing your morning tea or before turning off your bedside lamp.'
      },
      {
        heading: 'Use Micro-Prompts When Feeling Stuck',
        content: 'If your mind goes blank, do not force a grand essay. Complete simple starter stems: "Right now my body feels...", "The heaviest thing I carried today was...", or "One thing I needed to hear today was...".'
      }
    ]
  },
  {
    slug: 'how-to-practice-self-reflection',
    title: 'How to Practice Self-Reflection: Methods, Questions & Rituals',
    shortTitle: 'How to Practice Self-Reflection',
    description: 'Actionable techniques, psychological rituals, and structural tools to make self-reflection a natural and restorative part of life.',
    category: 'Supporting Guide',
    readTime: '8 min read',
    intro: 'Self-reflection becomes powerful when it is supported by clear methods. Here is how to create a grounding reflection ritual tailored to your life.',
    sections: [
      {
        heading: 'The 3-Phase Reflection Ritual',
        content: 'Phase 1: Grounding (Take three deep breaths and check in with your physical body). Phase 2: Inquiry (Answer one focused question about an event or reaction from your day). Phase 3: Integration (Identify one small adjustment or insight to carry into tomorrow).'
      },
      {
        heading: 'Weekly Pattern Check-Ins',
        content: 'At the end of each week, review your short entries to notice repeating emotional words or friction points. Looking across seven days reveals patterns that are invisible within any single isolated 24-hour cycle.'
      },
      {
        heading: 'Protecting the Psychological Sanctuary',
        content: 'Treat your reflection time as sacred personal terrain. Disconnect from digital notifications, avoid rushing through answers, and approach your feelings with unconditional curiosity.'
      }
    ]
  }
];
