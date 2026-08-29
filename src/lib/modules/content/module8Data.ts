import { ModuleContent } from '../../../types/moduleContent';

function opt(label: string, isTarget: boolean, explain: string) {
  return { label, isTarget, explain };
}

export const MODULE_8_CONTENT: ModuleContent = {
  moduleId: 'M8',
  slug: 'neurodivergence-adult-diagnosis',
  name: "Neurodivergence & Adult Diagnosis",
  duration_weeks: 2,
  tier: "Specialized - 599 rupees - Self domain",
  brief: {
  "moduleName": "Neurodivergence & Adult Diagnosis",
  "tier": "Specialized - 599 rupees - Self domain",
  "mechanisms": [
    {
      "key": "A",
      "name": "Neurodivergence & Adult Diagnosis",
      "short": "Neurodivergence",
      "def": "Living with a neurodevelopmental difference - most often ADHD, sometimes autism - that was never identified in childhood, showing up as long-standing patterns (chronic lateness, disorganization, difficulty starting or finishing tasks, forgetting things others seem to remember easily) that get misread, by oneself and others, as laziness or carelessness rather than recognized as a different way the brain is wired.",
      "need": "Accurate self-understanding, self-acceptance beyond a 'personal failing' narrative",
      "contrast": {
        "who": "Neha",
        "text": "has similar patterns to Aakash - she's also chronically disorganized, loses track of time easily - but she was formally assessed a few years ago. She uses external structure (alarms, written lists, calendar reminders) matter-of-factly, the way someone might wear glasses, rather than treating the need for it as evidence of some personal failing."
      },
      "techniques": [
        {
          "code": "A1",
          "approach": "Psychoeducation",
          "format": "A",
          "name": "Reframing 'Laziness' Narratives as Neurodevelopmental",
          "source": "Russell Barkley's ADHD model",
          "what": "Learning the actual mechanics behind patterns often labelled 'laziness' - specifically, differences in executive function (the brain's systems for planning, starting tasks, and managing time) that are well-documented in ADHD, rather than a matter of willpower or character.",
          "how": "Years of being told - by others, or by oneself - that a pattern reflects laziness or not trying hard enough can become a deeply held belief about identity, long before anyone considers a neurodevelopmental explanation. Understanding the actual mechanism doesn't erase the years of that belief, but it gives a different, more accurate story to test it against.",
          "why": "The foundational tool for this mechanism - the reframe from 'laziness' to 'neurodevelopmental difference' has to happen before skills-based work can land as support rather than as one more attempt to just try harder."
        },
        {
          "code": "A2",
          "approach": "CBT, ND-adapted",
          "format": "B",
          "guardrail": true,
          "name": "ND-Adapted CBT with External Structure & Explicit Skills Scaffolding",
          "source": "Steven Safren's CBT for adult ADHD protocol",
          "what": "Standard CBT techniques (like planning and organizing tasks), specifically adapted for how ADHD affects executive function - built-in external structure (written steps, reminders, checklists) rather than relying on memory alone, paced more slowly than typical CBT, and skills taught explicitly rather than assumed.",
          "how": "Un-adapted advice to 'just make a to-do list' or 'just plan ahead' often doesn't work for ADHD-related executive function differences, not because the person isn't trying, but because the advice doesn't account for how the difficulty actually works. Building in external structure from the start, rather than as a last resort, is what makes the skills actually usable.",
          "why": "Because this asks you to try a real skill on a real, current task - not just reflect on the idea of it - it ships with the same guardrails as any [B] technique: a choice of intensity, and a check-in afterward."
        },
        {
          "code": "A3",
          "approach": "ACT",
          "format": "A",
          "name": "Self-Acceptance & Values Work Beyond Diagnostic Labels",
          "source": "Steven Hayes, ACT",
          "what": "Building a sense of identity that isn't defined purely by a diagnosis (formal or suspected) or by years of 'laziness' narratives - naming values that matter independent of either story, and identifying ways of acting on them that work with how your brain actually operates, rather than against it.",
          "how": "A late-recognized pattern can become the whole story about who someone is, in either direction - either 'I'm just lazy' or, later, 'I'm just my diagnosis.' This tool works with values that sit underneath both stories, which don't depend on resolving the diagnostic question to still be real and actionable.",
          "why": "The consolidating tool - takes the reframe from A1 and the skills from A2, and builds an actual sense of identity around them, rather than leaving the reframe as just new information."
        },
        {
          "code": "A4",
          "approach": "Psychiatric / Assessment Referral",
          "format": "C",
          "name": "Structured Assessment Using Standardized Batteries",
          "source": "Standardized diagnostic tools including Conners' Rating Scales (ADHD) and the ADOS (Autism Diagnostic Observation Schedule)",
          "what": "A formal evaluation conducted by a licensed professional (a psychiatrist, clinical psychologist, or specialist diagnostician), using standardized, validated assessment tools - Conners' scales for ADHD, the ADOS for autism spectrum presentations - to reach an actual diagnosis, which this module deliberately does not attempt to do.",
          "how": "Self-recognition of a pattern, even a strong one, is not the same as a diagnosis. A formal assessment considers developmental history, rules out other explanations, and uses tools validated for exactly this purpose - something no amount of self-reflection or an app can substitute for.",
          "why": "The only way to move from 'this pattern sounds like me' to an actual answer. Genuinely worth pursuing if the patterns in this module feel like a strong, recurring match - not a last resort, and not something to be talked out of by uncertainty about whether it's 'serious enough' to warrant an assessment.",
          "professionalNote": "Look for a psychiatrist, clinical psychologist, or diagnostician experienced specifically in adult ADHD or autism assessment - presentation and assessment can differ meaningfully from childhood cases, and not every general practitioner is equipped for this. A formal diagnosis, if one is reached, can also open access to accommodations and treatment options that self-management alone can't provide."
        }
      ]
    }
  ],
  "scenarioSource": "Pan-India, English-medium context (per product decision) - school and family narratives around discipline and effort, workplace deadlines and organization, everyday forgetfulness and lateness. Language is English-medium throughout; content has not yet been reviewed for phrasing that reads as metro-specific.",
  "escalation": {
    "tier1": "Any statement connecting these patterns, or years of related self-criticism, to intent or a plan to end one's life or self-harm (\"I can't take this anymore, I want it to just stop for good\", \"I have a way to end it\").",
    "tier2": "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary discomfort of revisiting years of 'laziness' narratives, which is what this module is specifically designed to invite and reframe.",
    "neurodivergenceClassifierNote": "MODERATE PRIORITY: years of being told - by family, teachers, employers, or oneself - that a neurodevelopmental difference is actually a character flaw is a well-documented contributor to low self-worth and depressive symptoms in adults later recognized as ADHD or autistic. This module may surface real, longstanding shame or self-criticism that reads as more severe than a typical Week 1 recognition exercise in other modules - that's expected here, and is the pattern this module exists to address, not automatically a risk signal. As in Module 4's low-mood note, the key distinction is between accurately describing painful history ('I've been called lazy my whole life and I believed it') and current, unresolved hopelessness extending beyond this specific pattern into life broadly. Only the latter should escalate."
  }
},
  introScreens: [
  {
    "eyebrow": "Before we begin",
    "title": "What's stored, and who can see it",
    "body": [
      "Your open-text answers in this module are saved to your journal.",
      "The only person who can ever see them is your assigned practitioner, if you've connected one - never other users, never shown anywhere public.",
      "If something you write suggests you might be in real danger, we show you support resources right away. That's the only thing that happens automatically - nothing gets sent anywhere without you knowing.",
      "Your answers stay saved and reviewable by you for 12 months from purchase, extended automatically if you renew.",
      "You can turn this module off in Settings at any time."
    ],
    "cta": "I understand - continue",
    "consent": true
  },
  {
    "eyebrow": "What this module does, and doesn't, do",
    "title": "This module does not diagnose you",
    "body": [
      "This is important, so we're stating it plainly: nothing in this module can tell you whether you have ADHD, autism, or anything else. Only a licensed professional, using structured assessment tools, can actually reach a diagnosis.",
      "What this module can do is help you consider whether a long-standing pattern - one you might have spent years calling laziness or carelessness - might actually reflect something neurodevelopmental, and give you real tools either way, along with a clear picture of what getting an actual answer would involve.",
      "If you're in crisis right now, don't wait for this module to help. Reach out immediately - the button below is always here if you need it."
    ],
    "cta": "Continue",
    "crisisButton": true
  },
  {
    "eyebrow": "What this is - and isn't",
    "title": "Between-session support, not a replacement",
    "body": [
      "This module is designed to sit between therapy sessions, or to be useful on its own - either way, it isn't therapy, and, as stated on the last screen, it doesn't diagnose you with anything.",
      "One technique asks you to actually try a real skill on a real, current task - it ships with a built-in choice of intensity and a check-in, on purpose."
    ],
    "cta": "Continue"
  },
  {
    "eyebrow": "Why this module",
    "title": "Why we're suggesting this one",
    "body": [
      "You told us you're dealing with patterns - chronic lateness, disorganization, trouble starting or finishing things, being told for years that you just need to try harder - that haven't responded to the usual advice, no matter how much you've genuinely tried.",
      "This module is built for exactly that - a specific pattern, with real, evidence-based tools behind it, and an honest path toward an actual answer if you want one."
    ],
    "cta": "Continue"
  },
  {
    "eyebrow": "What to expect",
    "title": "The next 2 weeks",
    "body": [
      "Week 1 is entirely about recognizing the pattern - what it actually is, versus what it's often mistaken for. No tools yet.",
      "Week 2 brings three tools, one at a time, plus a clear explanation of what a formal assessment involves and why it's worth considering.",
      "Honestly: this module can't tell you whether you're neurodivergent, and it can't replace the years of narrative you might be carrying about it either. What it can realistically offer is a more accurate story to test the old one against, three specific tools, and a clear next step if you want an actual answer. That's the actual promise here, not more than that."
    ],
    "cta": "Continue"
  },
  {
    "eyebrow": "Theory grounding",
    "title": "The tools ahead, and the one that needs a professional",
    "body": [
      "Three tools are delivered directly in this module: a psychoeducation reframe, a skills-based technique adapted specifically for how ADHD affects executive function, and an identity and values-based tool.",
      "A fourth item - formal assessment - is explained rather than delivered as an exercise here, since only a licensed professional using standardized tools can actually reach a diagnosis. You'll see exactly what that involves in Week 2."
    ],
    "theory": true,
    "cta": "Start Week 1"
  }
],
  weeks: [
  {
    "num": 1,
    "title": "Recognising the pattern",
    "mechanism": "A",
    "kind": "blocked",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w1t1",
        "title": "Recognition - the missed deadline",
        "role": "Recognition #1",
        "noDelayed": true,
        "relate": {
          "text": [
            "Quick note before we start: this week isn't about any tools yet - none show up. First, this is about being able to recognise the pattern clearly. All three tools come next week.",
            "This week's pattern has a name: <b>a neurodevelopmental difference recognized in adulthood</b> - most often ADHD, sometimes autism - that was never identified earlier in life. In simple terms: long-standing patterns, often around attention, time, and organization, that get misread as laziness or carelessness rather than recognized as a different way the brain is wired.",
            "Here's what that looks like. <b class='who'>Aakash</b> genuinely cared about a work deadline and fully intended to start early. He didn't. He missed it, the way he's missed similar deadlines for as long as he can remember, despite caring every single time. Afterward, he tells himself the same thing he's told himself for years: that he's just lazy, that he doesn't try hard enough."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "Which of these actually explains what's happening? More than one will sound reasonable.",
          "options": [
            {
              "label": "A genuine, repeated gap between caring about something and being able to act on it in time points to something more specific than a simple lack of effort",
              "isTarget": true,
              "explain": "Right - the tell isn't whether he cared, which he clearly did, it's that the same gap between caring and doing has repeated for years despite real, genuine effort each time."
            },
            {
              "label": "He's being lazy and needs to try harder, the way he's always told himself",
              "isTarget": false,
              "explain": "This is the story Aakash has told himself for years, and it might feel obviously true - but notice it doesn't actually explain why genuine, repeated caring hasn't translated into action, which a simple effort explanation would predict it should."
            },
            {
              "label": "He just doesn't actually value punctuality or deadlines that much",
              "isTarget": false,
              "explain": "The scenario is explicit that he genuinely cared and intended to start early - this option quietly rewrites the story to make the outcome match a simpler explanation than what's actually described."
            }
          ],
          "whyPrompt": "In a few words - what's the giveaway that this is about something more specific than simple effort or laziness?"
        },
        "apply": {
          "scenario": "Same pattern, a different person: Simran has genuinely wanted to reply to an important email for three days, thinks about it constantly, and still hasn't opened her laptop to actually do it, despite nothing stopping her.",
          "prompt": "Same thing happening here. In two or three sentences: what would you actually say to Simran right now?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"The gap between thinking about it constantly and actually starting isn't about not caring - something specific is getting in the way of starting, even when the caring is clearly there.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of a real moment this applies to you - what's a gap between genuinely caring and being able to act that's shown up more than once?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t2",
        "title": "Recognition - the pattern across years",
        "role": "Recognition #2",
        "delayedRef": "w1t1_apply",
        "delayedPrompt": "Last touch, on Simran, you wrote this:",
        "relate": {
          "text": [
            "Same Aakash, thinking back further. It isn't just this one deadline. He's been losing keys, forgetting appointments, and running late for as long as he can remember - through school, through every job since. Teachers called him careless. Family called him lazy. He's called himself both, for years, without ever really questioning it.",
            "Notice what's carried over: this isn't a recent slip. It's a pattern that's been consistent for most of his life, across completely different settings and completely different people around him."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What's actually significant about the pattern spanning years and settings? Read all three carefully.",
          "options": [
            {
              "label": "A pattern this consistent, across so many different settings and years, points to something more stable and structural than a series of unrelated personal failings",
              "isTarget": true,
              "explain": "Right - the consistency itself is the signal. Isolated slip-ups happen to everyone; a pattern this stable across decades and contexts suggests something more consistent underneath it."
            },
            {
              "label": "He's just never had the right systems in place to get organized",
              "isTarget": false,
              "explain": "This is worth considering, but notice the pattern has persisted across many different attempts at systems and settings over many years - which points to something more consistent than simply never having tried the right approach yet."
            },
            {
              "label": "Different teachers and family members all happened to be unusually harsh judges of his character",
              "isTarget": false,
              "explain": "This assumes the judgments were wrong on their own terms rather than considering what's actually being judged - the more relevant question is whether 'laziness' is even the right explanation for the pattern they were responding to."
            }
          ],
          "whyPrompt": "In a few words - why does consistency across years and settings matter more than any single instance?"
        },
        "apply": {
          "scenario": "A different person, same shape of pattern: Devika has been the person who's late to everything, forgets plans, and misplaces things since childhood - it's been true at every school, every job, with every group of friends she's ever had.",
          "prompt": "In two or three sentences: what's actually going on for Devika, and what would you point out about the pattern spanning her whole life?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"A pattern this consistent, across every context she's ever been in, suggests something more stable than just not having found the right system yet - it's worth considering what's actually underneath it.\""
        },
        "remember": {
          "prompt": "In a sentence or two: has a pattern like this been consistent for you across different periods of your life, not just recently?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t3",
        "title": "What 'laziness' actually leaves out",
        "role": "Functional logic",
        "delayedRef": "w1t2_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Between the missed deadline and the years of the same pattern, there's something worth naming honestly: 'lazy' is a simple, available explanation - it fits without needing to look any further.",
            "What it actually leaves out is a well-documented difference in executive function - the brain's systems for planning, starting tasks, and managing time - that shows up consistently in ADHD, among other neurodevelopmental differences, and doesn't respond to 'just try harder' the way a simple motivation problem would."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does 'laziness' as an explanation actually leave out? These are close - think it through.",
          "options": [
            {
              "label": "A specific, well-documented difference in how executive function works - the brain's systems for starting and managing tasks - which doesn't resolve with more effort the way a simple motivation gap would",
              "isTarget": true,
              "explain": "That's what the label leaves out - a real, mechanistic explanation, not just a harsher or kinder way of describing the same thing."
            },
            {
              "label": "Nothing really - laziness is just a blunter way of describing the same underlying issue",
              "isTarget": false,
              "explain": "If that were true, more effort would be expected to close the gap over time, the way it does for an ordinary motivation problem - but the pattern described has persisted despite repeated, genuine effort, which points to something the effort itself doesn't reach."
            },
            {
              "label": "The specific circumstances that made trying harder difficult in each instance",
              "isTarget": false,
              "explain": "This still frames the core problem as circumstantial and effort-based, when the pattern's consistency across many different circumstances is exactly what points toward something more structural."
            }
          ],
          "whyPrompt": "In a few words - why doesn't 'just try harder' work on an executive-function difference the way it might on ordinary motivation?"
        },
        "apply": {
          "scenario": "A friend, hearing about Aakash's missed deadline, says: \"You've tried harder at this than almost anything else in your life, for years. If trying harder actually worked, don't you think it would have by now?\"",
          "prompt": "In two or three sentences: think of something you've genuinely tried hard at, repeatedly, without it actually closing the gap - what does that suggest about what the actual obstacle might be?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the pattern to notice is whether repeated, genuine effort has actually closed the gap over time, or whether the same gap keeps showing up regardless of how much effort gets applied."
        },
        "remember": {
          "prompt": "In a sentence or two: had you considered, before this week, that a pattern like this might not be about effort at all?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t4",
        "title": "What working with it can look like",
        "role": "Contrast / boundary case",
        "delayedRef": "w1t3_apply",
        "delayedPrompt": "Last touch, you named this:",
        "relate": {
          "text": [
            "Here's what a similar pattern can look like for someone with a different relationship to it.",
            "<b class='who'>Neha</b> has similar patterns to Aakash - she's also chronically disorganized, loses track of time easily. But she was formally assessed a few years ago. She uses external structure - alarms, written lists, calendar reminders - matter-of-factly, the way someone might wear glasses, rather than treating the need for it as evidence of some personal failing.",
            "This is the module's contrast case for this pattern: the same underlying tendencies, still genuinely present - not the absence of the pattern, but a different relationship to it, and real tools used without shame attached to needing them."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What actually makes Neha's relationship to the pattern different from Aakash's? All three can look similar in the moment.",
          "options": [
            {
              "label": "She still has the same underlying tendencies, but relates to needing external structure as ordinary support rather than as proof of a personal failing",
              "isTarget": true,
              "explain": "That's the real difference - not that her executive function works differently from Aakash's, but what the need for structure is taken to mean about her."
            },
            {
              "label": "Her version of the pattern is simply milder than his",
              "isTarget": false,
              "explain": "The scenario describes her as similarly chronically disorganized - there's no basis for calling her version milder. The difference is in her relationship to it, not its severity."
            },
            {
              "label": "She's naturally more organized than Aakash",
              "isTarget": false,
              "explain": "This contradicts what's actually described - she's not naturally more organized, she uses external tools deliberately. The difference is the tool use and what it means to her, not innate organization."
            }
          ],
          "whyPrompt": "In a few words - how would using external structure feel different depending on what you believe it means about you?"
        },
        "apply": {
          "scenario": "A colleague asks Neha why she has so many alarms and reminders set. She says: \"My brain just doesn't track time the same way some people's do. This isn't a workaround for a flaw - it's just how I make sure things happen.\"",
          "prompt": "In two or three sentences: think of something you currently use, or avoid using, to manage a pattern like this - does using it feel like ordinary support, or like an admission of failure? What would it look like to see it the way Neha does?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the useful pattern is noticing whether needing structure gets read as ordinary and matter-of-fact, or as evidence of some deeper personal shortfall."
        },
        "remember": {
          "prompt": "In a sentence or two: is there a tool or structure you've avoided using because of what it might mean about you?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t5",
        "title": "What actually happened",
        "role": "Reinforcing rep",
        "delayedRef": "w1t4_apply",
        "delayedPrompt": "Last touch, your idea was:",
        "relate": {
          "text": [
            "One more, and then a small piece of what actually happened with Aakash.",
            "A few weeks later, scrolling through something unrelated, he came across a description of ADHD in adults - chronic lateness, difficulty starting tasks despite caring about them, losing track of time and objects - and felt a genuine jolt of recognition. Not a diagnosis, just a real, specific 'this describes me' moment, for the first time connecting the pattern to something other than a character flaw.",
            "That's not a coincidence, and it previews what's ahead next week: recognizing a pattern isn't the same as having an answer, but it's often the first real step toward one. Next week's tools work with exactly that - reframing the pattern accurately, building real skills that work with it, and a clear path toward an actual answer if you want one."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does that moment of recognition actually represent for Aakash?",
          "options": [
            {
              "label": "A real, specific connection between his own long-standing pattern and a described, documented explanation - not a diagnosis, but a genuinely different starting point than 'I'm just lazy'",
              "isTarget": true,
              "explain": "Right - recognition isn't a diagnosis, but it's a real shift from an unexamined, years-old belief to an actual, specific alternative worth considering further."
            },
            {
              "label": "Confirmation that he definitely has ADHD",
              "isTarget": false,
              "explain": "A moment of recognition, however strong, isn't the same as an actual diagnosis - that requires the kind of formal assessment described later in this module, not a single moment of resonance with a description."
            },
            {
              "label": "Not much, really, since lots of people relate to descriptions like that",
              "isTarget": false,
              "explain": "This underplays what's actually significant here - the specificity and consistency of Aakash's own multi-year pattern, not just a passing resonance with a general description."
            }
          ],
          "whyPrompt": "In a few words - why is recognition a meaningful first step, even though it isn't the same as a diagnosis?"
        },
        "apply": {
          "scenario": "A different person, same shape of moment: after years of being told she was 'scattered,' Ritika reads about executive function differences and finds herself recognizing almost every example listed, feeling both relieved and a little unsettled by how specifically it seems to describe her.",
          "prompt": "In two or three sentences: what would you say to Ritika about that mix of relief and unsettled feeling?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"Both feelings make sense - relief at finally having a more accurate story, and something unsettled about years spent believing a different one. Neither feeling means anything is confirmed yet, but the recognition itself is worth taking seriously.\""
        },
        "remember": {
          "prompt": "In a sentence or two: has anything in this week's content produced a moment of recognition for you, even a small one?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: recognizing a long-standing pattern often mistaken for laziness or carelessness as possibly reflecting a neurodevelopmental difference instead - not a diagnosis, but a more accurate story worth testing. Next week: three tools, and a clear picture of what an actual answer would involve."
  },
  {
    "num": 2,
    "title": "Three tools, and what an actual answer looks like",
    "mechanism": "A",
    "kind": "technique",
    "retrievalCheck": null,
    "hasReferenceCard": true,
    "touches": [
      {
        "id": "w2t1",
        "title": "Reframing 'Laziness' as Neurodevelopmental",
        "role": "Technique A1 - Psychoeducation (Barkley)",
        "delayedRef": "w1t5_apply",
        "delayedPrompt": "Last week, your answer was:",
        "relate": {
          "text": [
            "This is the first of the three tools for this pattern: <b>reframing 'laziness' narratives as neurodevelopmental</b>.",
            "Remember Aakash's moment of recognition, scrolling through a description that finally matched years of his own pattern? This tool makes that reframe deliberate: learning the actual mechanics behind patterns often labelled laziness - specifically, differences in executive function, the brain's systems for planning, starting tasks, and managing time - well-documented in ADHD, rather than a matter of character or willpower."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might understanding the actual mechanism behind a pattern matter, even before anything is formally diagnosed?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a specific pattern of your own - or someone you know well - that's long been labelled laziness or carelessness.",
          "prompt": "In two or three sentences: describe the pattern, and try writing the neurodevelopmental version of the explanation alongside the 'laziness' one you've likely heard for years.",
          "placeholder": "The pattern: ... / The old explanation, and the new one: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the new explanation is genuinely specific to executive function (planning, starting, time management), not just a softer restatement of the same judgment."
        },
        "remember": {
          "prompt": "In a sentence or two: did writing both explanations side by side change how the pattern feels to think about?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t2",
        "title": "ND-Adapted CBT with External Structure & Skills Scaffolding",
        "role": "Technique A2 - CBT, ND-adapted (Safren) - guided",
        "guardrail": true,
        "delayedRef": "w2t1_apply",
        "delayedPrompt": "Last touch, your explanations were:",
        "relate": {
          "text": [
            "The second tool: <b>ND-adapted CBT with external structure and explicit skills scaffolding</b>.",
            "Standard advice like 'just make a to-do list' often doesn't work for ADHD-related executive function differences - not because the advice is wrong in general, but because it doesn't build in enough external structure. This version does: written steps instead of relying on memory, paced more slowly, with each skill taught explicitly rather than assumed.",
            "Because this asks you to try a real skill on a real, current task, this touch checks in with you directly partway through."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might building in external structure from the start work better than treating it as a fallback for when willpower alone isn't enough?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of one real task you're currently avoiding or struggling to start, even a small one.",
          "intensityPrompt": "First, choose how much structure you want to try building in:",
          "intensityOptions": [
            "Smaller version - just write the very first physical step, in detail",
            "Bigger version - break the whole task into written steps, with a specific time for each"
          ],
          "prompt": "In two or three sentences: name the task, and the external structure you actually built for it.",
          "placeholder": "The task: ... / The structure I built: ..."
        },
        "distressPrompt": "You've just tried a real skill on a real task. Before we continue - how are you feeling right now?",
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the structure is genuinely external and written down (not just a mental plan), and specific enough to actually follow."
        },
        "remember": {
          "prompt": "In a sentence or two: did having it written down change how doable the task felt?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t3",
        "title": "Self-Acceptance & Values Work Beyond Diagnostic Labels",
        "role": "Technique A3 - ACT (Hayes)",
        "delayedRef": "w2t2_apply",
        "delayedPrompt": "Last touch, your structure was:",
        "relate": {
          "text": [
            "The third tool: <b>self-acceptance and values work beyond diagnostic labels</b>.",
            "A late-recognized pattern can end up defining the whole story about who someone is, in either direction - 'I'm just lazy,' or later, 'I'm just my diagnosis.' This tool works with values that sit underneath both stories: what actually matters to you, independent of either label, and what acting on it looks like given how your brain actually works."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might building identity around values, rather than around either the old label or a new one, matter here?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a value that genuinely matters to you - separate from questions of productivity, organization, or diagnosis.",
          "prompt": "In two or three sentences: name the value, and one way of acting on it that works with how your brain actually operates, rather than against it.",
          "placeholder": "The value: ... / A way of acting on it that works with me, not against me: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the value named is genuinely yours, not defined by either the old 'lazy' story or a new diagnostic one."
        },
        "remember": {
          "prompt": "In a sentence or two: does thinking about identity this way feel different from either of the two stories you've been carrying?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t4",
        "title": "How did it go",
        "role": "Check-in",
        "delayedRef": "w2t3_apply",
        "delayedPrompt": "Last touch, your value was:",
        "relate": {
          "text": [
            "No new idea this touch - just a real check-in on the three tools from this week, the same three that trace back to Aakash's missed deadline back in Week 1."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Which of the three did you actually try this week, if any - and what happened?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think back over the week's attempts, however small.",
          "prompt": "In two or three sentences: what actually happened when you tried one of these, compared to what you expected going in?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether you're comparing the real outcome honestly to what you expected, not skipping past what actually happened."
        },
        "remember": {
          "prompt": "In a sentence or two: what surprised you most, if anything?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t5",
        "title": "Where this leaves you",
        "role": "Closing",
        "delayedRef": "w2t4_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "This is the last touch in this module, so it's worth being direct about where that leaves things, and about the one item this module hasn't delivered as a touch: formal assessment.",
            "A structured assessment - using standardized, validated tools like Conners' scales for ADHD or the ADOS for autism spectrum presentations - is the only way to move from 'this pattern sounds like me' to an actual answer. It's genuinely worth pursuing if what you've recognized this week feels like a strong, recurring match - not a last resort, and not something to talk yourself out of because it doesn't feel 'serious enough' yet. Open the reference card from this week's list if you want the full picture of what that process involves.",
            "Whatever you decide to do next, the reframe from this week and the two tools are yours to keep using regardless."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Looking back over the two weeks: what's one thing you understand about this pattern now that you didn't as clearly two weeks ago?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "With nothing pre-walked this time: think of a real situation you're actually facing right now, where some version of this pattern is showing up.",
          "prompt": "In two or three sentences: what's your actual next move, and why that one - which of the three tools, or the assessment referral, and why not one of the others?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single right answer here - this was deliberately left without a signalled answer. What matters is whether your reasoning traces back to this week's content, not whether it matches anyone else's."
        },
        "remember": {
          "prompt": "In a sentence or two - what do you actually want to remember from these two weeks, in your own words?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": null
  }
],
  reinforcementBank: [
  {
    "code": "A1",
    "rep": 1,
    "type": "reflection",
    "scenario": "You catch yourself thinking, once again, that you're just lazy or careless after missing something small.",
    "prompt": "In two or three sentences: write the old explanation, and the neurodevelopmental one, side by side again.",
    "reveal": "There's no single model answer here - the tell is whether the new explanation stays specific to executive function, not a vague reassurance."
  },
  {
    "code": "A1",
    "rep": 2,
    "type": "reflection",
    "scenario": "A new example of the pattern shows up - something you hadn't specifically connected to this before.",
    "prompt": "In two or three sentences: describe the new example, and whether the reframe still feels like it fits.",
    "reveal": "There's no single model answer here - the tell is genuine engagement with whether it fits this specific new example, not an automatic yes."
  }
],
  toolsData: {
  "values_reframe_log": {
    "code": "A3",
    "title": "Catch & Reframe",
    "mechShort": "Neurodivergence",
    "kind": "log_single",
    "intro": "Catch a self-critical 'lazy' or 'careless' thought in the moment, and swap in a values-consistent reframe instead. Log it each time you actually catch one.",
    "logLabel": "What was the self-critical thought, and what did you swap it for?",
    "firstPlaceholder": "e.g. ‘I’m so lazy for forgetting that’ - swapped to ‘my brain manages time differently, and I care about getting this right’",
    "placeholder": "Your answer..."
  }
},
  mhpiConfig: {
    baselineQuestions: [
  {
    "id": "q1",
    "label": "Problem Severity",
    "prompt": "Overall, how much is this issue affecting you right now?",
    "min": 0,
    "max": 10,
    "minLabel": "Not at all",
    "maxLabel": "Extremely",
    "reverse": false
  },
  {
    "id": "q2",
    "label": "Functional Impact",
    "prompt": "How much is this issue interfering with your daily life (work, studies, relationships, or routine)?",
    "min": 0,
    "max": 10,
    "minLabel": "Not at all",
    "maxLabel": "Extremely",
    "reverse": false
  },
  {
    "id": "q3",
    "label": "Avoidance",
    "prompt": "Because of this issue, how often do you avoid situations you would otherwise want to face?",
    "min": 0,
    "max": 10,
    "minLabel": "Never",
    "maxLabel": "Always",
    "reverse": false
  },
  {
    "id": "q4",
    "label": "Self-Efficacy",
    "prompt": "How confident are you that you can manage this issue effectively?",
    "min": 0,
    "max": 10,
    "minLabel": "Not confident",
    "maxLabel": "Extremely confident",
    "reverse": true
  },
  {
    "id": "q5",
    "label": "Hope",
    "prompt": "How hopeful are you that this issue can improve?",
    "min": 0,
    "max": 10,
    "minLabel": "Not hopeful",
    "maxLabel": "Extremely hopeful",
    "reverse": true
  }
],
    weeklyQuestions: [
  {
    "id": "w1",
    "prompt": "How much has this issue affected you this week?",
    "min": 0,
    "max": 10,
    "minLabel": "Not at all",
    "maxLabel": "Extremely"
  },
  {
    "id": "w2",
    "prompt": "How confident do you feel managing this issue this week?",
    "min": 0,
    "max": 10,
    "minLabel": "Not confident",
    "maxLabel": "Extremely confident"
  },
  {
    "id": "w3",
    "prompt": "On how many days did you practice this week's activities?",
    "min": 0,
    "max": 7,
    "minLabel": "0 days",
    "maxLabel": "7 days"
  }
],
    endExtraQuestions: [
  {
    "id": "e6",
    "prompt": "Overall, how helpful was this program?",
    "min": 1,
    "max": 5,
    "minLabel": "Not at all helpful",
    "maxLabel": "Extremely helpful"
  }
],
    endChoice: {
  "id": "e7",
  "prompt": "What would you like to do next?",
  "options": [
    "Finish here",
    "Continue with another program",
    "Talk to a therapist"
  ]
}
  },
  escalationConfig: {
    tier1: "Any statement connecting these patterns, or years of related self-criticism, to intent or a plan to end one's life or self-harm (\"I can't take this anymore, I want it to just stop for good\", \"I have a way to end it\").",
    tier2: "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary discomfort of revisiting years of 'laziness' narratives, which is what this module is specifically designed to invite and reframe.",
    neurodivergenceClassifierNote: "MODERATE PRIORITY: years of being told - by family, teachers, employers, or oneself - that a neurodevelopmental difference is actually a character flaw is a well-documented contributor to low self-worth and depressive symptoms in adults later recognized as ADHD or autistic. This module may surface real, longstanding shame or self-criticism that reads as more severe than a typical Week 1 recognition exercise in other modules - that's expected here, and is the pattern this module exists to address, not automatically a risk signal. As in Module 4's low-mood note, the key distinction is between accurately describing painful history ('I've been called lazy my whole life and I believed it') and current, unresolved hopelessness extending beyond this specific pattern into life broadly. Only the latter should escalate.",
    systemPrompt: "You are a safety classifier inside a mental-health support app used in India. Classify the user's message into exactly one of: NONE, TIER1, TIER2.\n\nTIER1 definition: Any statement connecting these patterns, or years of related self-criticism, to intent or a plan to end one's life or self-harm (\"I can't take this anymore, I want it to just stop for good\", \"I have a way to end it\").\nTIER2 definition: Persistent hopelessness about life broadly, or real functional collapse - not the ordinary discomfort of revisiting years of 'laziness' narratives, which is what this module is specifically designed to invite and reframe.\n\nCritical context 1: many people, especially in Indian English, use hyperbolic or idiomatic self-deprecating language that is NOT a genuine risk signal - for example \"I could kill myself for forgetting that\", \"this deadline is literally killing me\". Do NOT classify ordinary hyperbole, jokes, or figures of speech as TIER1 or TIER2, even if they contain words like \"kill\", \"die\", or \"worthless\".\n\nCritical context 2 (specific to this module): this module is about recognizing a neurodevelopmental pattern often misread for years as laziness or personal failure. Users may describe real, longstanding shame or harsh self-criticism accumulated over years of being told this - \"I've believed I was lazy and broken my whole life\", \"everyone always said I just didn't try hard enough\" - this is the module working as intended, describing painful history, and should be classified as NONE. Only escalate to TIER2 if there is current, ongoing hopelessness extending beyond this specific pattern into life broadly, or real functional collapse - not an accurate account of a difficult history.\n\nOnly classify as TIER1 if there is a genuine indication of intent, a plan, or serious risk to the person's life or safety. Only classify as TIER2 if there is genuine persistent hopelessness about life broadly, or real functional collapse - not the ordinary discomfort of revisiting years of internalized criticism, which is what this module is designed to invite and reframe.\n\nWhen genuinely uncertain, prefer the lower tier (or NONE) rather than over-triggering - but never downgrade language that includes a specific plan, method, or timeframe.\n\nRespond with ONLY a raw JSON object, no markdown fences, no other text: {\"tier\": \"NONE\" | \"TIER1\" | \"TIER2\", \"reason\": \"one short clause\"}",
    tier1FallbackWords: [
  "going to kill myself",
  "planning to end my life",
  "don't want to wake up tomorrow",
  "have a plan to end my life",
  "going to end it all tonight"
],
    tier2FallbackWords: [
  "i am worthless",
  "i feel like a burden to everyone",
  "i hate who i am",
  "there is no point in trying anymore",
  "i can't live like this"
]
  },
  openQuestions: [
  {
    "area": "Clinical, highest priority in this module",
    "text": "This module walks a genuinely careful line: helping someone recognize a possible pattern without functioning as an unlicensed diagnostic tool. Every touch was written to keep language provisional ('many people with this pattern find...', never 'you have ADHD') and to consistently point toward A4 (professional assessment) as the only source of an actual answer - but this framing needs direct clinical review specifically for whether it succeeds, not just a general technique-mapping review. Getting this wrong in one direction (reading as diagnostic) could lead someone to self-diagnose and stop short of an actual assessment; getting it wrong in the other (over-hedging) could make the module feel dismissive of a pattern that's genuinely worth pursuing."
  },
  {
    "area": "Clinical",
    "text": "All 3 practicable technique mappings and the reference-only technique framing are my synthesis of the taxonomy's named sources - not clinician-reviewed."
  },
  {
    "area": "Clinical",
    "text": "Tier 1/2 escalation definitions for this module are a first draft, awaiting sign-off. See BRIEF.escalation.neurodivergenceClassifierNote - moderate priority, similar in kind to Module 4's low-mood note but for a different underlying cause (years of internalized 'laziness' narratives rather than a hopelessness-testing exercise)."
  },
  {
    "area": "Structural note - new T=3-with-[C] sub-case at mechanism_count=1",
    "text": "3 practicable techniques fit the 5-touch week exactly (3 technique touches + separate check-in + separate pre-commitment, no combining needed) - the same resolution used for Anxiety's Panic mechanism, now confirmed a second time, and for the first time at mechanism_count=1. The single [C] technique (A4, structured assessment referral) sits as a passive reference card in Week 2's list, since all 5 touch slots are already used by the exact T=3 fit - no bridge touch needed, unlike Module 3's Intrusive Thoughts or Module 6's Trauma mechanism, both of which had T=2 and genuinely needed the extra slot a bridge touch provides. Recommend the template note this distinction clearly: a bridge touch to [C] techniques is needed when T+2 < 5 (room to spare), not simply whenever a mechanism has any [C] techniques at all."
  },
  {
    "area": "Structural note - reused resolution",
    "text": "Same mechanism_count=1 base structure as Modules 6 and 7: 2 weeks, no integration week, no retrieval check. Same transfer-test resolution as Module 7 (not Module 6): this module has no content-specific safety rationale to omit the unscaffolded transfer test, so it's folded into the closing touch's Apply beat rather than omitted."
  },
  {
    "area": "Content decision, sequencing",
    "text": "The taxonomy lists techniques in the order [B] CBT, [A] psychoeducation, [A] ACT. This module teaches them in a different order - psychoeducation (A1) first, then ND-adapted CBT (A2), then ACT (A3) - because introducing skills-based CBT before reframing 'laziness' as neurodevelopmental risks the CBT landing as 'here's how to finally fix your laziness' rather than 'here's support that works with how your brain operates.' The reframe needs to happen first for the skills work to land as intended. Flagging this as a deliberate deviation from the taxonomy's listed order, for a stated pedagogical reason, not an oversight."
  },
  {
    "area": "Content decision, bank composition",
    "text": "Reflections gets A1 (psychoeducation reframe) - revisiting which parts of the reframe still feel true, or noticing new examples of the pattern, is more of a periodic deeper reflection than a quick habit. Tools gets A3 (self-acceptance/values work), scoped down to catching a self-critical 'lazy' thought in the moment and swapping in a values-consistent reframe - which is genuinely habit-shaped once the fuller Week 2 version has been learned. A2 excluded under the standard [B] rule; no exception made, for the same reason given in Module 7's dev guide - ND-adapted CBT with real task-based skills practice isn't something with a meaningfully smaller, bank-safe version."
  },
  {
    "area": "Resolved",
    "text": "Crisis helpline numbers reused from Modules 1-7 (KIRAN, TeleMANAS, Vandrevala Foundation) - national, not module-specific."
  },
  {
    "area": "Resolved",
    "text": "Escalation UX (persistent crisis banner regardless of tier, server-side logging of all classification events including NONE, Tier 1 relying on the always-visible banner rather than an additional interrupt, Tier 2 frequency-based interrupt threshold deferred pending real usage data) follows the shared decisions documented in Module 3's dev guide, section 5 - not re-derived here."
  },
  {
    "area": "Not yet started",
    "text": "Same as prior modules: accessibility target, analytics schema, and a full copy/editorial pass have not been done for this module either."
  },
  {
    "area": "Standing reminder",
    "text": "Nothing in this module has been clinically reviewed and nothing has been tested with a real user. This module's diagnostic-boundary question (first item above) makes that especially true here - please treat this module's first-draft status with the same weight given to Module 6's."
  }
]
};
