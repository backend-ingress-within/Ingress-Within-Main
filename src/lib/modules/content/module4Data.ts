import { ModuleContent } from '../../../types/moduleContent';

function opt(label: string, isTarget: boolean, explain: string) {
  return { label, isTarget, explain };
}

export const MODULE_4_CONTENT: ModuleContent = {
  moduleId: 'M4',
  slug: 'mood-emotional-regulation',
  name: "Mood & Emotional Regulation",
  duration_weeks: 7,
  tier: "Core · ₹349 · Self domain",
  brief: {
  "moduleName": "Mood & Emotional Regulation",
  "tier": "Core · ₹349 · Self domain",
  "mechanisms": [
    {
      "key": "A",
      "name": "Emotional Overwhelm & Dysregulation",
      "short": "Overwhelm",
      "def": "A sudden flood of emotion that outpaces the ability to think clearly or respond deliberately — often followed by either acting impulsively in the moment, or shutting down completely until it passes.",
      "need": "Nervous-system regulation, a moment to think",
      "contrast": {
        "who": "Tara",
        "text": "feels a sharp surge of emotion when a colleague criticises her work in front of others, notices the surge building in her chest before it fully takes over, and takes a slow breath and a short pause before saying anything back."
      },
      "techniques": [
        {
          "code": "A1",
          "approach": "DBT (distress tolerance)",
          "format": "A",
          "name": "TIPP Skills",
          "source": "Marsha Linehan, DBT distress-tolerance module",
          "what": "Four rapid physiological tools for the moment emotion has already flooded past thinking: <b>T</b>emperature (cold water on the face or wrists), <b>I</b>ntense exercise (a short burst — jumping jacks, running in place), <b>P</b>aced breathing (slower exhale than inhale), and <b>P</b>rogressive muscle relaxation.",
          "how": "Each of these works directly on the body's physiological arousal — not on the thought or story behind the emotion — which matters because during a genuine flood, the thinking part of the brain is temporarily less available anyway. These bring the body's state down first, so thinking becomes possible again.",
          "why": "The fastest tools of the four — built for the moment of the flood itself, not for reflecting on it afterward."
        },
        {
          "code": "A2",
          "approach": "Interpersonal Neurobiology",
          "format": "A",
          "name": "The Window-of-Tolerance Framework",
          "source": "Dan Siegel",
          "what": "A framework for recognising which of three zones you're currently in: a workable middle “window” where you can think and respond deliberately, a hyper-aroused zone above it (flooded, reactive, can't slow down), or a hypo-aroused zone below it (shut down, numb, checked out).",
          "how": "Naming which zone you're actually in — rather than judging yourself for being in it — is often the first step back toward the workable middle, and it clarifies which kind of tool actually helps (calming tools for hyper-arousal, activating tools for hypo-arousal are not interchangeable).",
          "why": "The diagnostic tool of the four — it doesn't calm anything by itself, but it tells you which of the other three tools actually fits what's happening right now."
        },
        {
          "code": "A3",
          "approach": "Mindfulness (breath-based)",
          "format": "A",
          "name": "Extended-Exhale Breath-Based Grounding",
          "source": "Jon Kabat-Zinn-style mindfulness practice",
          "what": "Deliberately making the exhale longer than the inhale — for example, a count of 4 in, 6 or 8 out — practiced for a minute or two, either as a regular practice or in the moment.",
          "how": "A longer exhale directly engages the body's parasympathetic (calming) nervous system response — a real physiological lever, not just a distraction technique.",
          "why": "The most portable of the four — no space, equipment, or privacy needed, usable almost anywhere the moment a flood starts building."
        },
        {
          "code": "A4",
          "approach": "ACT",
          "format": "A",
          "name": "The 'Observing Self' Exercise",
          "source": "Steven Hayes, ACT",
          "what": "Deliberately shifting from being fully inside an overwhelming emotion to noticing yourself having it — practicing the sentence “I am noticing that I am feeling [emotion]” rather than simply being swept up in the feeling itself.",
          "how": "This creates a small but real distance between you and the emotion — not by suppressing or arguing with it, but by shifting the vantage point from which it's experienced, which is often enough to make the flood feel survivable rather than total.",
          "why": "The tool for right after the physiological flood has eased slightly — creating enough distance to actually choose a next step."
        }
      ]
    },
    {
      "key": "B",
      "name": "Anger & Irritability",
      "short": "Anger",
      "def": "A pattern where everyday, minor triggers produce a reaction bigger than the moment actually calls for — often followed by regret, once the reaction has passed and the trigger looks smaller in hindsight.",
      "need": "A sense of fairness, of not being overlooked or pushed around",
      "contrast": {
        "who": "Leena",
        "text": "feels a real, sharp flash of irritation when a colleague is late to the third meeting in a row, notices the flash, and chooses to raise it calmly in a one-on-one later rather than snapping in the moment."
      },
      "techniques": [
        {
          "code": "B1",
          "approach": "Cognitive-behavioural model of anger",
          "format": "A",
          "name": "Anger-Cycle Thought Records",
          "source": "Raymond Novaco's cognitive-behavioural model of anger",
          "what": "Writing down the specific appraisal underneath an anger spike — the interpretation of the trigger, not just the trigger itself (“they're disrespecting me”, “this is completely unfair”) — and checking that appraisal against what's actually known.",
          "how": "Anger is driven less by the trigger itself and more by the appraisal attached to it — the same minor mess can read as ‘careless’ or as ‘disrespectful,’ and only one of those readings tends to produce a disproportionate reaction. Naming the appraisal makes it checkable.",
          "why": "The foundational tool for this mechanism — it targets the interpretation driving the spike, not just the spike itself."
        },
        {
          "code": "B2",
          "approach": "DBT",
          "format": "A",
          "name": "The STOP Skill & Opposite Action",
          "source": "Marsha Linehan, DBT",
          "what": "STOP — <b>S</b>top, <b>T</b>ake a step back, <b>O</b>bserve, <b>P</b>roceed mindfully — for the moment an urge to snap arises, followed by opposite action: if the urge is to lash out, deliberately doing something different from what the urge demands, when the anger isn't actually justified by the full facts.",
          "how": "An anger urge feels like it has to be acted on immediately. STOP creates a deliberate pause before that happens; opposite action then tests whether acting on the urge is actually warranted, or whether a different response fits the situation better.",
          "why": "The in-the-moment tool — usable in the few seconds between the urge appearing and a reaction actually happening."
        },
        {
          "code": "B3",
          "approach": "Stress-inoculation approach",
          "format": "A",
          "name": "Structured Time-Out Protocol",
          "source": "Novaco's stress-inoculation approach",
          "what": "A planned, deliberate step away from a triggering situation — agreed in advance, not improvised mid-argument — with a clear signal for calling it, a set duration, and a clear way of returning to the conversation afterward.",
          "how": "Removing yourself from a triggering situation, done well, isn't avoidance — it's giving the physiological spike time to come down before continuing, which planning in advance makes far more workable than trying to invent the boundary mid-conflict.",
          "why": "The tool for when STOP alone isn't enough — a structured way to actually remove yourself, rather than just pausing in place."
        },
        {
          "code": "B4",
          "approach": "ACT",
          "format": "A",
          "name": "Values-Based Response Practice",
          "source": "Steven Hayes, ACT",
          "what": "Deliberately pausing before responding to ask: what response here actually reflects the kind of person, partner, sibling, or colleague I want to be — rather than the response the anger urge is demanding.",
          "how": "Anger urges are loud but not automatically aligned with what actually matters to you. This tool doesn't try to make the anger disappear — it inserts a values-based choice point between the urge and the action.",
          "why": "The tool for choosing what actually happens next, once STOP or a time-out has created enough space to choose anything at all."
        }
      ]
    },
    {
      "key": "C",
      "name": "Low Mood & Depressive Symptoms",
      "short": "Low Mood",
      "def": "A persistent low mood marked by reduced motivation and pleasure, and a growing belief that nothing will actually help — which becomes self-reinforcing, since withdrawing removes exactly the activities that could improve it.",
      "need": "Mastery, pleasure, hope",
      "contrast": {
        "who": "Vikram",
        "text": "is genuinely going through a low patch after a breakup — he still doesn't feel like doing much — but forces himself to take a short walk and reply to one friend's message most days anyway, even without feeling like it first."
      },
      "techniques": [
        {
          "code": "C1",
          "approach": "Behavioural Activation",
          "format": "A",
          "name": "Activity Scheduling with Mastery/Pleasure Ratings",
          "source": "Peter Lewinsohn; Christopher Martell, Sona Dimidjian & Neil Jacobson",
          "what": "Deliberately scheduling small, specific activities — not waiting to feel motivated first — and rating each one afterward on how much mastery (accomplishment) and pleasure it actually produced, even if the rating is low.",
          "how": "Low mood usually waits for motivation before acting, but motivation in depression tends to follow action, not precede it. Scheduling and rating breaks that stuck order, and often reveals that an activity produced more mastery or pleasure than predicted beforehand.",
          "why": "The foundational tool for this mechanism — it directly targets the withdrawal that keeps the low mood self-reinforcing."
        },
        {
          "code": "C2",
          "approach": "IPT",
          "format": "B",
          "guardrail": true,
          "name": "Interpersonal Role-Transition Work",
          "source": "Gerald Klerman & Myrna Weissman, IPT",
          "what": "Directly naming and working through a real role change underlying the low mood — a job loss, a breakup, becoming a parent, a move — grieving what the old role gave you, and identifying what the new role could realistically offer instead.",
          "how": "Low mood often has a real, identifiable transition underneath it that hasn't been fully processed — not just a mood to manage, but a change to actually work through, which naming and mapping directly can move forward in a way symptom-management alone can't.",
          "why": "Because this asks you to engage directly with a real, possibly painful life change — not a hypothetical one — it ships with the same guardrails as any [B] technique: a choice of intensity, and a check-in afterward."
        },
        {
          "code": "C3",
          "approach": "CBT (cognitive triad)",
          "format": "A",
          "name": "Cognitive Restructuring of Hopelessness",
          "source": "Aaron Beck's cognitive-triad model",
          "what": "Directly examining the three linked beliefs Beck's model identifies in low mood — a negative view of oneself, of the world, and of the future — and testing each one against real, specific evidence, the way any other belief would be tested.",
          "how": "Hopelessness often feels like an accurate read on reality rather than one belief among several possible ones. Testing each part of the triad separately, with real evidence, is what the low mood itself never does on its own.",
          "why": "Works directly on the belief structure underneath the mood, rather than on behaviour — a different angle from activity scheduling."
        },
        {
          "code": "C4",
          "approach": "CBT (behavioural experiments)",
          "format": "B",
          "guardrail": true,
          "name": "Behavioural Experiments Testing 'Nothing Will Help' Predictions",
          "source": "Aaron Beck",
          "what": "Naming the specific prediction underneath the hopelessness — “nothing will make this evening better”, “trying won't change anything” — and deliberately running a small, real test of it, then comparing what actually happened to the prediction.",
          "how": "‘Nothing will help’ feels like a settled conclusion, but it's rarely actually been tested — it's usually assumed, which is exactly what keeps withdrawal going. A real test, even a small one, gives evidence a settled-sounding belief usually doesn't have.",
          "why": "Because this asks you to act despite genuinely expecting it won't help — real discomfort, not hypothetical — it ships with the same guardrails as any [B] technique: a choice of intensity, and a check-in afterward."
        }
      ]
    }
  ],
  "scenarioSource": "Pan-India, English-medium context (per product decision) — workplace settings, family dynamics, everyday friction with siblings/colleagues/roommates. Language is English-medium throughout; content has not yet been reviewed for phrasing that reads as metro-specific.",
  "escalation": {
    "tier1": "Any statement connecting emotional flooding, anger, or low mood to intent or a plan to end one's life or self-harm (“I can't take this anymore, I want it to just stop for good”, “I have a way to end it”).",
    "tier2": "Persistent hopelessness about life broadly — not just about the current low-mood episode improving — (“nothing is ever going to get better, there's no point in any of this”), or real functional collapse: not getting out of bed for multiple days, not eating regularly, missing work or responsibilities repeatedly.",
    "lowMoodClassifierNote": "CRITICAL, module-specific: two touches in this module (C3, C4) explicitly ask users to write out genuinely hopeless-sounding thoughts and predictions on purpose — that's the exercise itself, not a symptom to flag. 'Nothing will make this evening better' typed into a behavioural-experiment prompt is the module working correctly, not a risk signal on its own. The classifier must distinguish practice material written as part of a structured exercise (NONE, even when the words themselves sound bleak) from a genuine, unprompted expression of hopelessness or intent (TIER1/TIER2). This is a different calibration challenge from the Anxiety module's intrusive-thoughts note — there the risk was the module's own recognition content being over-flagged; here the risk is compounded by the fact that two touches literally instruct the user to produce hopeless-sounding text as an assignment. Needs dedicated clinical review before this ships, using real examples of both genuine hopelessness and completed C3/C4 exercise answers side by side."
  }
},
  introScreens: [
  {
    "eyebrow": "Before we begin",
    "title": "What's stored, and who can see it",
    "body": [
      "Your open-text answers in this module are saved to your journal.",
      "The only person who can ever see them is your assigned practitioner, if you've connected one — never other users, never shown anywhere public.",
      "If something you write suggests you might be in real danger, we show you support resources right away. That's the only thing that happens automatically — nothing gets sent anywhere without you knowing.",
      "Your answers stay saved and reviewable by you for 12 months from purchase, extended automatically if you renew.",
      "You can turn this module off in Settings at any time."
    ],
    "cta": "I understand — continue",
    "consent": true
  },
  {
    "eyebrow": "What this is — and isn't",
    "title": "Between-session support, not a replacement",
    "body": [
      "This module is designed to sit between therapy sessions, or to be useful on its own — either way, it isn't therapy, and it doesn't diagnose you with anything.",
      "Two techniques in this module (you'll see them marked clearly when they come up, both in the low-mood section) ask you to work with a real, sometimes heavy life change or a genuinely discouraging prediction — they ship with a built-in pause and check-in, on purpose.",
      "If you're in crisis right now, don't wait for this module to help. Reach out immediately — the button below is always here if you need it."
    ],
    "cta": "Continue",
    "crisisButton": true
  },
  {
    "eyebrow": "Why this module",
    "title": "Why we're suggesting this one",
    "body": [
      "You told us you're dealing with feelings that come on too fast to think through, a short fuse that costs you afterward, or a low mood that's made it hard to want to do much of anything — maybe all three, maybe one that's loudest right now.",
      "This module is built for exactly that — three specific patterns, each with its own real evidence-based tools, not one blended ‘manage your emotions’ module."
    ],
    "cta": "Continue"
  },
  {
    "eyebrow": "What to expect",
    "title": "The next 7 weeks",
    "body": [
      "Short term: a new touch on weekdays, a few minutes each, real scenarios close to your own week — your own words, not a quiz to pass or fail. Weekends bring a short summary, not new content.",
      "Long term, honestly: this won't make emotional flooding, anger, or low mood disappear. What it can realistically offer is 12 specific, evidence-based tools, plus enough practice noticing each pattern that you reach for the right tool sooner. That's the actual promise here, not more than that."
    ],
    "cta": "Continue"
  },
  {
    "eyebrow": "Theory grounding",
    "title": "The tools everything here is built on",
    "body": [
      "Each of these three patterns has more than one real, evidence-based approach behind it — so instead of blending them into one vague idea, each approach gets its own tool and its own touch.",
      "You won't use any of these in Weeks 1–3 — those three weeks are just about being able to spot each pattern clearly, on its own, before any tool gets layered on top. Weeks 4–6 bring these back, one at a time, matched to exactly what you'll have just learned to recognise. Two techniques below are marked differently — both in the low-mood section — they ask you to engage with something real and potentially heavy, so they ship with a built-in choice of intensity and a check-in."
    ],
    "theory": true,
    "cta": "Start Week 1"
  }
],
  weeks: [
  {
    "num": 1,
    "title": "Overwhelm: recognising the pattern",
    "mechanism": "A",
    "kind": "blocked",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w1t1",
        "title": "Recognition — the meeting",
        "role": "Recognition #1",
        "noDelayed": true,
        "relate": {
          "text": [
            "Quick note before we start: this week and the next two aren't about any of the tools yet — none of them show up. First, you need to be able to spot each pattern clearly. The tools come in Weeks 4–6, matched one at a time to what you'll have learned to recognise.",
            "This week's pattern has a name: <b>emotional overwhelm and dysregulation</b>. In simple terms: a sudden flood of emotion that outpaces the ability to think clearly, often followed by either acting impulsively or shutting down completely.",
            "Here's what that looks like. <b class='who'>Ishaan</b> gets blindsided by unexpectedly harsh feedback in a team meeting. His chest tightens, his face goes hot, and for the rest of the meeting he can't actually follow what's being said — he's just trying to hold it together until it ends."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "Which of these actually explains what's happening? More than one will sound reasonable.",
          "options": [
            {
              "label": "His nervous system is flooded past the point where clear thinking is currently available, not that he's overreacting to something small",
              "isTarget": true,
              "explain": "Right — the flood is a real, physiological state, and it genuinely narrows what's available to think about right now. That's different from the feedback simply being minor and him making too much of it."
            },
            {
              "label": "He's just being too sensitive about normal feedback",
              "isTarget": false,
              "explain": "This treats the flood as a character flaw rather than what it actually is — a real nervous-system state that temporarily reduces access to clear thinking, regardless of how ‘normal’ the feedback objectively was."
            },
            {
              "label": "He should have prepared better for tough feedback in advance",
              "isTarget": false,
              "explain": "Preparation can help in general, but notice this skips past what's actually happening in the room — a real physiological flood, not a planning failure."
            }
          ],
          "whyPrompt": "In a few words — what's the giveaway that this is a state, not an overreaction to content?"
        },
        "apply": {
          "scenario": "Same pattern, a different person: Meher gets a sudden wave of panic and tearfulness when her landlord unexpectedly raises a difficult topic on a call, and finds she can barely respond to the rest of the conversation.",
          "prompt": "Same thing happening here. In two or three sentences: what would you actually say to Meher right now?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: “What's happening to you right now is a real flood, not a sign you can't handle this call — it makes sense that clear thinking feels out of reach for a few minutes. That will pass.”"
        },
        "remember": {
          "prompt": "In a sentence or two: think of a real moment this applies to you — what's something that flooded you past the point of clear thinking?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t2",
        "title": "Recognition — later that evening",
        "role": "Recognition #2",
        "delayedRef": "w1t1_apply",
        "delayedPrompt": "Last touch, on Meher, you wrote this:",
        "relate": {
          "text": [
            "Same Ishaan, later that evening. A friend makes a mildly teasing comment over text — something that wouldn't normally bother him — and he snaps back sharply, immediately regretting it.",
            "Notice what's carried over: the flood from the meeting hadn't actually settled. A small new trigger landed on a nervous system that was still overloaded, not a fresh, calm one."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What's actually happening that evening? Read all three carefully.",
          "options": [
            {
              "label": "The earlier flood hadn't fully settled, so a minor new trigger landed on an already-overloaded system and produced a reaction bigger than the trigger itself warranted",
              "isTarget": true,
              "explain": "Right — the reaction is disproportionate to the text message alone, but makes sense given what his nervous system was already carrying from the meeting."
            },
            {
              "label": "He's just naturally a short-tempered person",
              "isTarget": false,
              "explain": "There's no evidence for that as a general trait — this specific reaction follows directly from an already-flooded state, not a fixed personality feature."
            },
            {
              "label": "The friend's comment was probably ruder than it seemed",
              "isTarget": false,
              "explain": "The scenario describes it as mildly teasing, and Ishaan himself immediately regretted his reaction — which suggests the comment itself wasn't actually the driver here."
            }
          ],
          "whyPrompt": "In a few words — why does an earlier flood matter for a completely unrelated moment hours later?"
        },
        "apply": {
          "scenario": "A different person, same shape of evening: Rohan has a stressful, overwhelming client call in the afternoon, and finds himself snapping at his roommate over a dish left in the sink that night — something he'd normally shrug off.",
          "prompt": "In two or three sentences: what's actually going on for Rohan, and what would you point out about the timing?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: “The dish isn't really what this is about — the call left him flooded, and the dish was just the next thing his already-overloaded system reacted to.”"
        },
        "remember": {
          "prompt": "In a sentence or two: has an earlier flood ever spilled into something unrelated later in your own day?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t3",
        "title": "What the flood is actually doing",
        "role": "Functional logic",
        "delayedRef": "w1t2_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Between the meeting and the text message, there's a pattern worth naming honestly: the flood can feel like proof something is seriously wrong — with the situation, or with your own ability to cope.",
            "What it's actually doing is different: it's a real nervous-system response that temporarily narrows access to clear thinking — not evidence about the size of the original problem, and not evidence about your capacity to handle things in general."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What is the flood actually doing, functionally? These are close — think it through.",
          "options": [
            {
              "label": "Temporarily narrowing access to clear, deliberate thinking, as a real physiological state — not a verdict on the size of the trigger or on someone's general capability",
              "isTarget": true,
              "explain": "That's the real mechanism — a genuine, temporary, physiological narrowing, not a permanent judgment about capability or a proportional reflection of how big the original issue actually was."
            },
            {
              "label": "Proof that the situation is genuinely as bad as it feels in the moment",
              "isTarget": false,
              "explain": "The intensity of the flood and the actual severity of the triggering situation aren't the same thing — a flood can be real and intense while the triggering event was, in hindsight, fairly minor."
            },
            {
              "label": "A sign that Ishaan generally can't handle pressure",
              "isTarget": false,
              "explain": "One flooded moment doesn't establish a general pattern about capability — and treating it that way adds a layer of self-judgment on top of an already real, difficult state."
            }
          ],
          "whyPrompt": "In a few words — why does separating 'state' from 'verdict' matter here?"
        },
        "apply": {
          "scenario": "A friend, seeing Ishaan beating himself up afterward for “overreacting,” says: ‘Your body went into a real flood response — that's not the same as the meeting actually being a catastrophe, or you actually being bad at handling things.’",
          "prompt": "In two or three sentences: think of a moment you flooded and then judged yourself afterward for it — what would it look like to separate the state from the verdict, the way the friend just did?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here — the pattern to notice is whether the after-the-fact judgment was about the state itself (real, temporary, physiological) or turned into a broader verdict about capability."
        },
        "remember": {
          "prompt": "In a sentence or two: what does the moment right before a flood usually feel like for you, physically?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t4",
        "title": "What noticing it building looks like",
        "role": "Contrast / boundary case",
        "delayedRef": "w1t3_apply",
        "delayedPrompt": "Last touch, you named this:",
        "relate": {
          "text": [
            "Here's what the same kind of moment looks like for someone who catches it before the flood fully takes over.",
            "<b class='who'>Tara</b> feels a sharp surge of emotion when a colleague criticises her work in front of others. She notices the surge building in her chest — before it fully takes over — and takes a slow breath and a short pause before saying anything back.",
            "This is the module's contrast case for this pattern: real, strong emotion, genuinely felt — not the absence of a surge, but a surge caught early enough to leave room for a choice."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What actually makes Tara's moment different from Ishaan's? All three can look similar in the moment.",
          "options": [
            {
              "label": "She noticed the surge building before it crossed into a full flood, which left her a moment to choose a response rather than being swept past thinking entirely",
              "isTarget": true,
              "explain": "That's the real difference — not the size of the emotion, which was genuinely strong for both, but whether it was caught early enough to leave room for a choice."
            },
            {
              "label": "She just doesn't feel criticism as strongly as Ishaan does",
              "isTarget": false,
              "explain": "The scenario describes a sharp surge — real, strong emotion. The difference isn't intensity; it's the timing of when she noticed it."
            },
            {
              "label": "The criticism she received was milder than what Ishaan got",
              "isTarget": false,
              "explain": "There's no basis for that comparison in the scenario — public criticism in front of others is a real trigger regardless. What differs is what happened after the surge started, not how harsh the trigger was."
            }
          ],
          "whyPrompt": "In a few words — how would you know, in the moment, whether you're still in the 'noticing' window or already past it?"
        },
        "apply": {
          "scenario": "A colleague asks Tara how she stayed composed. She says: ‘I wasn't calm inside — I felt the same surge everyone feels. I just caught it early enough to take one breath before saying anything.’",
          "prompt": "In two or three sentences: think of a time you felt a strong emotional surge building — did you catch it early, or only notice once you were already fully in it? What told you which one it was?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer — the useful pattern is noticing whether there was a moment of ‘building’ you could catch, or whether the flood was already complete by the time you noticed anything."
        },
        "remember": {
          "prompt": "In a sentence or two: name one thing you could do, like Tara, to catch the surge a little earlier next time.",
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
            "One more, and then a small piece of what actually happened to Ishaan.",
            "About an hour after the meeting ended, without doing anything special, the flood eased on its own — he found he could think clearly again, and the meeting, in hindsight, felt manageable rather than catastrophic.",
            "That's not a coincidence, and it previews the tools coming in Week 4: floods are real, intense, and genuinely limit clear thinking while they last — and they're also reliably time-limited. The tools ahead don't stop a flood from ever happening again — they change what the hour in the middle of one actually looks like."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does the flood settling on its own, within an hour, tell us about it?",
          "options": [
            {
              "label": "The flood followed a real, time-limited physiological pattern rather than being a permanent state or an accurate final verdict on the situation",
              "isTarget": true,
              "explain": "Right — nothing special was done, and it settled anyway. That's characteristic of a genuine, time-limited physiological response, not evidence the initial catastrophic read was correct."
            },
            {
              "label": "He just got lucky that it passed quickly this time",
              "isTarget": false,
              "explain": "This keeps the original catastrophic framing alive by treating a reliable, expected pattern — floods settling on their own — as a fluke rather than as the normal course of things."
            },
            {
              "label": "The meeting genuinely wasn't that big a deal, which is why he calmed down",
              "isTarget": false,
              "explain": "This assumes the size of the original trigger determined the recovery time, when the pattern is more about the flood's own physiological timeline than about how objectively serious the meeting was."
            }
          ],
          "whyPrompt": "In a few words — why does knowing floods reliably settle change what the middle of one feels like to be in?"
        },
        "apply": {
          "scenario": "A different person, same shape of aftermath: Priya felt completely overwhelmed after a tense family phone call, convinced she'd feel that way for the rest of the day — and found, about 40 minutes later, that she could think clearly again and the call felt far less catastrophic in hindsight.",
          "prompt": "In two or three sentences: what does that 40-minute settling tell Priya about the story she was believing mid-flood?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: “The flood followed its own physiological timeline and settled on its own — which doesn't match the mid-call belief that she'd feel that overwhelmed indefinitely.”"
        },
        "remember": {
          "prompt": "In a sentence or two: think of a time a flood eventually settled on its own — how long did it actually take, compared to how permanent it felt in the middle of it?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: emotional overwhelm and dysregulation — a real, time-limited physiological flood that narrows access to clear thinking, not a verdict on the size of the trigger or on your general capability. Next week: anger and irritability, where the flood shows up as a short fuse rather than a shutdown."
  },
  {
    "num": 2,
    "title": "Anger: recognising the pattern",
    "mechanism": "B",
    "kind": "blocked",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w2t1",
        "title": "Recognition — a small mess",
        "role": "Recognition #1",
        "delayedRef": "w1t5_apply",
        "delayedPrompt": "Last touch, on Priya, you wrote this:",
        "relate": {
          "text": [
            "A different pattern this week: <b>anger and irritability</b> — everyday, minor triggers producing a reaction bigger than the moment actually calls for, usually followed by regret once it passes.",
            "Here's what that looks like. <b class='who'>Karan</b> comes home to find his younger sibling left a small mess in the shared kitchen — a genuinely minor thing — and snaps at them sharply, raising his voice over something that, an hour later, he can barely believe he reacted to that strongly."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What's actually happening for Karan? Read all three carefully.",
          "options": [
            {
              "label": "A genuinely minor trigger is producing a reaction disproportionate to what it actually calls for",
              "isTarget": true,
              "explain": "Right — the tell isn't whether the mess was annoying at all, it's the size of the reaction relative to how minor the actual trigger was, which he himself recognises within the hour."
            },
            {
              "label": "His sibling is probably regularly careless, and this was the last straw",
              "isTarget": false,
              "explain": "The scenario doesn't establish a pattern of repeated carelessness — and even if it did, notice that wouldn't change whether the specific reaction to this specific mess was proportionate."
            },
            {
              "label": "He's just tired from a long day, which is understandable",
              "isTarget": false,
              "explain": "Tiredness can be a real contributing factor to a shorter fuse in general — but it doesn't change what's actually happening in this specific moment: a small trigger, a big reaction."
            }
          ],
          "whyPrompt": "In a few words — what's the actual measure of 'disproportionate' here?"
        },
        "apply": {
          "scenario": "Same pattern, a different person: Aditi raises her voice sharply at a colleague who forwarded an email to the wrong group by mistake — a genuine but minor error — and immediately feels the reaction was bigger than the mistake warranted.",
          "prompt": "In two or three sentences: what's actually going on for Aditi right now?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: “The email mistake was real but minor — the size of her reaction says more about something else going on than about how serious the mistake actually was.”"
        },
        "remember": {
          "prompt": "In a sentence or two: think of a real moment this applies to you — what small trigger got a bigger reaction than it actually called for?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t2",
        "title": "Recognition — a pattern across the week",
        "role": "Recognition #2",
        "delayedRef": "w2t1_apply",
        "delayedPrompt": "Last touch, on Aditi, you wrote this:",
        "relate": {
          "text": [
            "Same Karan, looking back over the week. It wasn't just the kitchen mess — he's been short with his mother about a minor scheduling mix-up, sharp with a friend over a joke, and impatient in traffic more than usual, several small moments, not one isolated incident.",
            "Notice the shape: this isn't about any one trigger being unusually bad. It's a pattern — a lower threshold than usual, showing up across several unrelated small moments."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What's actually happening across the week? Read all three carefully.",
          "options": [
            {
              "label": "His threshold for reacting sharply has been running lower than usual across several unrelated small triggers, not just one especially bad moment",
              "isTarget": true,
              "explain": "Right — the pattern across several unrelated moments is the actual signal, not any single trigger being unusually severe."
            },
            {
              "label": "This has just been an unusually difficult week, objectively",
              "isTarget": false,
              "explain": "That's possible in general, but notice it doesn't actually explain the pattern itself — several small, genuinely minor triggers each getting a bigger-than-warranted reaction, regardless of how the week is independently rated."
            },
            {
              "label": "His mother, friend, and other drivers all happened to be more irritating than usual",
              "isTarget": false,
              "explain": "This explains the pattern by pointing outward at several unrelated people all coincidentally becoming more irritating — which is a much less likely explanation than a lower personal threshold running across the week."
            }
          ],
          "whyPrompt": "In a few words — why does looking across a whole week reveal something a single moment doesn't?"
        },
        "apply": {
          "scenario": "A different person, same shape of week: Nikhil notices he's snapped at his partner over a small thing, been curt with a delivery person, and honked longer than necessary at another driver, all within the same few days.",
          "prompt": "In two or three sentences: what's actually going on for Nikhil, and what would you point out about the pattern across his week?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: “None of these triggers, on their own, is unusual — what's notable is that his threshold for reacting sharply has clearly dropped across several unrelated moments this week.”"
        },
        "remember": {
          "prompt": "In a sentence or two: has your own threshold felt lower than usual across a recent week? What showed up?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t3",
        "title": "What the anger is actually protecting",
        "role": "Functional logic",
        "delayedRef": "w2t2_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Between the kitchen and the rest of the week, there's a pattern worth naming honestly: the anger feels like it's standing up for something real — fairness, respect, not being taken advantage of.",
            "What it actually costs is different from what it protects: in the moment, it rarely produces the outcome it seems to want (being taken more seriously, more respected) — what it reliably produces is regret and, often, a strained relationship, once it passes."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What is the anger spike actually trying to do? These are close — think it through.",
          "options": [
            {
              "label": "Respond to a felt sense of unfairness or disrespect, at a scale that outpaces what the actual moment calls for, and that tends to cost more (in regret, in relationships) than it gains",
              "isTarget": true,
              "explain": "That's the real function — a genuine underlying concern (fairness, respect) expressed at a scale that doesn't actually serve that concern well, and often undermines it."
            },
            {
              "label": "Effectively communicate that a real boundary has been crossed",
              "isTarget": false,
              "explain": "If it reliably did that, it wouldn't be followed by regret and relationship strain so often — the disproportionate scale of the reaction tends to obscure the underlying concern rather than communicate it clearly."
            },
            {
              "label": "Warn others so they don't repeat the mistake",
              "isTarget": false,
              "explain": "Sharp, disproportionate reactions are a poor teaching tool in practice — they tend to produce defensiveness rather than the kind of correction this option assumes."
            }
          ],
          "whyPrompt": "In a few words — why doesn't the scale of the anger actually serve the concern underneath it?"
        },
        "apply": {
          "scenario": "A friend, hearing Karan describe the week, asks: ‘Did snapping at your sister actually get you what you wanted — more consideration, less mess — or did it just leave you both feeling bad?’ Karan pauses. ‘...Mostly just feeling bad, honestly.’",
          "prompt": "That's usually the tell. In two or three sentences: think of a time your own anger didn't actually get you what you wanted — what happened instead?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here — the pattern to notice is whether the reaction actually served the underlying concern, or mostly just produced regret and strain."
        },
        "remember": {
          "prompt": "In a sentence or two: what does the moment right before you snap usually feel like for you?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t4",
        "title": "What handling irritation differently looks like",
        "role": "Contrast / boundary case",
        "delayedRef": "w2t3_apply",
        "delayedPrompt": "Last touch, you named this:",
        "relate": {
          "text": [
            "Here's what the same kind of moment looks like for someone who isn't caught in the pattern.",
            "<b class='who'>Leena</b> feels a real, sharp flash of irritation when a colleague is late to the third meeting in a row. She notices the flash, and chooses to raise it calmly in a one-on-one later, rather than snapping in the moment.",
            "This is the module's contrast case for this pattern: genuine irritation, honestly felt — not the absence of anger, but anger that gets expressed on a scale and timeline that actually serves the concern."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What actually makes Leena's response different from Karan's? All three can look similar in the moment.",
          "options": [
            {
              "label": "She felt the same genuine irritation, but chose the scale and timing of her response rather than reacting immediately at full intensity",
              "isTarget": true,
              "explain": "That's the real difference — not whether she felt irritated, which she clearly did, but whether the response matched the actual situation or discharged at full intensity in the moment."
            },
            {
              "label": "The colleague's lateness wasn't actually as annoying as Karan's sibling's mess",
              "isTarget": false,
              "explain": "Being late to three meetings in a row is a genuinely reasonable thing to be annoyed about — the difference isn't the size of the trigger, it's what happened with the irritation afterward."
            },
            {
              "label": "Leena just has a naturally calmer temperament",
              "isTarget": false,
              "explain": "The scenario describes a real, sharp flash of irritation — not calm indifference. The difference is in what she did with that flash, not whether she felt it."
            }
          ],
          "whyPrompt": "In a few words — how would you know, in the moment, which one you're doing?"
        },
        "apply": {
          "scenario": "A colleague asks Leena how she stayed composed about the lateness. She says: ‘I was genuinely annoyed — I just didn't think snapping in the meeting would actually fix the lateness, so I saved it for a moment where raising it could actually land.’",
          "prompt": "In two or three sentences: think of a time you felt irritated — did you react in the moment, or choose the timing and scale? What told you which one it was?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer — the useful pattern is noticing whether the response was chosen deliberately, or discharged automatically at whatever intensity the flash arrived at."
        },
        "remember": {
          "prompt": "In a sentence or two: name one thing you could do, like Leena, to choose the timing of a response instead of reacting immediately.",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t5",
        "title": "What actually happened",
        "role": "Reinforcing rep",
        "delayedRef": "w2t4_apply",
        "delayedPrompt": "Last touch, your idea was:",
        "relate": {
          "text": [
            "One more, and then a small piece of what actually happened with Karan and his sibling.",
            "The next day, he found out the mess had happened because his sibling had been rushing to help a friend in an actual emergency — something he hadn't known, and hadn't asked about, before snapping.",
            "That's not a coincidence, and it previews the tools coming in Week 5: anger spikes usually run on an assumed story about the trigger — carelessness, disrespect — that's rarely actually checked before reacting. The tools ahead don't promise the irritation will stop showing up — they change what happens in the gap before it turns into a reaction."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does finding out about the emergency the next day reveal about Karan's reaction the night before?",
          "options": [
            {
              "label": "The reaction was based on an assumed story about the mess (carelessness) that turned out not to match what had actually happened",
              "isTarget": true,
              "explain": "Right — the sharp reaction assumed carelessness, when the real explanation was something Karan hadn't known and hadn't asked about."
            },
            {
              "label": "His sibling should have explained themselves before he got upset",
              "isTarget": false,
              "explain": "This shifts responsibility for the checking onto the other person — but the actual gap here was Karan reacting sharply before checking, not his sibling failing to pre-explain."
            },
            {
              "label": "It doesn't really matter why the mess happened — a mess is still a mess",
              "isTarget": false,
              "explain": "This sidesteps what the scenario is actually showing — that the size and content of the reaction was built on an assumption that turned out to be wrong."
            }
          ],
          "whyPrompt": "In a few words — why does an unchecked assumption do so much of anger's work?"
        },
        "apply": {
          "scenario": "A different person, same shape of realisation: Farah snapped at a friend for cancelling plans last-minute, assuming it was carelessness — and later learned the friend had a genuine family emergency that day.",
          "prompt": "In two or three sentences: what does that later realisation tell Farah about the reaction she had in the moment?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: “Her reaction was responding to an assumed story — carelessness — rather than to what had actually happened, which turned out to be something entirely different.”"
        },
        "remember": {
          "prompt": "In a sentence or two: think of a time an assumed story turned out to be wrong once you found out more — what was the gap?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: anger and irritability — minor triggers producing reactions built on an assumed, often unchecked story, usually followed by regret. Next week: low mood, where the pattern shows up as withdrawal rather than as a spike."
  },
  {
    "num": 3,
    "title": "Low mood: recognising the pattern",
    "mechanism": "C",
    "kind": "blocked",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w3t1",
        "title": "Recognition — putting the brush down",
        "role": "Recognition #1",
        "delayedRef": "w2t5_apply",
        "delayedPrompt": "Last touch, on Farah, you wrote this:",
        "relate": {
          "text": [
            "This week's pattern is different in shape from the last two — quieter, and slower: <b>low mood and depressive symptoms</b>. A persistent low mood marked by reduced motivation and pleasure, and a growing belief that nothing will actually help.",
            "Here's what that looks like. <b class='who'>Ayesha</b> used to paint most weekends. Lately she's stopped — not because anything specific happened, just a quiet, settled thought each time she considers it: ‘what's the point, it won't actually make me feel any better.’ So the brushes stay put away."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What's actually happening for Ayesha? Read all three carefully.",
          "options": [
            {
              "label": "A belief that an activity won't help is stopping her from doing it — without that belief ever actually being tested",
              "isTarget": true,
              "explain": "Right — the belief sounds settled and reasonable, but notice it's never actually been checked against what happens when she does paint. It's an assumption operating as a conclusion."
            },
            {
              "label": "She's genuinely lost interest in painting as a hobby, which happens to people naturally",
              "isTarget": false,
              "explain": "That's possible in principle, but notice the specific reasoning she's using — ‘it won't make me feel better’ — is a prediction about outcome, not a statement of lost interest in the activity itself."
            },
            {
              "label": "She's just being realistic — one painting session probably wouldn't fix a low mood anyway",
              "isTarget": false,
              "explain": "This treats the belief as obviously true without it ever being tested — which is exactly the move the pattern makes on its own, just repeated here as reasonable rather than examined."
            }
          ],
          "whyPrompt": "In a few words — what's the difference between a belief and a tested conclusion here?"
        },
        "apply": {
          "scenario": "Same pattern, a different person: Dev used to go to the gym regularly, but has stopped for the past month, telling himself there's no point since he won't enjoy it the way he used to anyway.",
          "prompt": "Same thing happening here. In two or three sentences: what would you actually say to Dev right now?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: “That belief — that you won't enjoy it — hasn't actually been tested in a month. It might be right, but right now it's just an assumption keeping you from finding out.”"
        },
        "remember": {
          "prompt": "In a sentence or two: think of a real moment this applies to you — what's something you've stopped doing because you assumed it wouldn't help?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w3t2",
        "title": "Recognition — cancelling on a friend",
        "role": "Recognition #2",
        "delayedRef": "w3t1_apply",
        "delayedPrompt": "Last touch, on Dev, you wrote this:",
        "relate": {
          "text": [
            "Same Ayesha, a few days later. A friend invites her out for coffee. Her first thought is that she won't be good company, that she'll just bring the mood down, so she cancels — and stays in bed a couple of hours longer than she needs to that weekend.",
            "Notice what's building: each small withdrawal — the painting, the coffee, the extra hours in bed — removes exactly the kind of thing that could interrupt the low mood, which then makes the next withdrawal feel even more justified."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What's actually happening as the withdrawals add up? Read all three carefully.",
          "options": [
            {
              "label": "Each withdrawal removes something that could have interrupted the low mood, which then makes the mood feel like further proof that withdrawing was the right call",
              "isTarget": true,
              "explain": "Right — this is the self-reinforcing loop: withdrawal feels protective, but it removes exactly the ingredients (contact, activity, mastery) that could have helped, which then seems to confirm the original belief."
            },
            {
              "label": "She's protecting her friend from having to deal with a low mood, which is considerate",
              "isTarget": false,
              "explain": "This reframes withdrawal as thoughtfulness toward others — but notice it also conveniently avoids testing whether seeing the friend might have actually helped her own mood."
            },
            {
              "label": "Staying in bed longer is just her body needing more rest right now",
              "isTarget": false,
              "explain": "Rest can be genuinely needed at times — but notice the reasoning described here (‘I'll bring the mood down,’ not ‘I'm physically exhausted’) is about avoidance, not physical rest."
            }
          ],
          "whyPrompt": "In a few words — why does withdrawal make the belief feel more true, even though it hasn't actually been tested?"
        },
        "apply": {
          "scenario": "A different person, same shape of week: Suresh keeps declining invitations from his cricket group, telling himself he wouldn't enjoy it anyway in his current mood, and has now missed four weeks in a row.",
          "prompt": "In two or three sentences: what's actually going on for Suresh, and what would you point out about the pattern across the four weeks?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: “Each missed week makes the belief feel more settled, but none of the four weeks actually tested whether going would have helped — the belief has never once been checked.”"
        },
        "remember": {
          "prompt": "In a sentence or two: notice a withdrawal like this in your own recent week — what did it remove, and did the belief behind it ever actually get tested?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w3t3",
        "title": "What the withdrawal is actually protecting",
        "role": "Functional logic",
        "delayedRef": "w3t2_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Between the brushes and the coffee invite, there's a pattern worth naming honestly: withdrawing feels like conserving energy — like the sensible thing to do when there isn't much left to give.",
            "What it actually does is different: it removes exactly the activities — contact with others, small accomplishments, moments of pleasure — that tend to interrupt a low mood, which means the mood has less chance to shift, not more."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What is the withdrawal actually doing? These are close — think it through.",
          "options": [
            {
              "label": "Conserving effort in the short term, at the cost of removing the exact activities — contact, small wins, pleasure — that could interrupt the low mood over time",
              "isTarget": true,
              "explain": "That's the real trade-off — it feels protective in the moment, but structurally it removes the very things that tend to shift a low mood, which keeps the mood in place longer, not shorter."
            },
            {
              "label": "Genuinely giving her body and mind the rest they currently need",
              "isTarget": false,
              "explain": "If it were working that way, the mood would be expected to lift with rest — but the pattern described here is ongoing and self-reinforcing, which is a different shape from restorative rest."
            },
            {
              "label": "Protecting other people from having to deal with her low mood",
              "isTarget": false,
              "explain": "This is possible as a felt reason, but it also conveniently avoids ever testing whether contact with others might have actually helped — which is exactly what the pattern relies on not happening."
            }
          ],
          "whyPrompt": "In a few words — why does conserving energy in the short term cost more in the long term here?"
        },
        "apply": {
          "scenario": "A friend, noticing Ayesha has stopped doing anything she used to enjoy, asks gently: ‘When's the last time not doing something actually made you feel better, versus just feeling the same or worse?’ Ayesha pauses. ‘...Honestly, I don't think it's ever actually made me feel better.’",
          "prompt": "That's usually the tell. In two or three sentences: think of a time withdrawing didn't actually make you feel better — what happened instead?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here — the pattern to notice is whether withdrawing actually improved the mood, or just removed something that might have helped without any real payoff."
        },
        "remember": {
          "prompt": "In a sentence or two: what does the pull to withdraw usually feel like for you, right before you act on it?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w3t4",
        "title": "What pushing through without waiting for motivation looks like",
        "role": "Contrast / boundary case",
        "delayedRef": "w3t3_apply",
        "delayedPrompt": "Last touch, you named this:",
        "relate": {
          "text": [
            "Here's what the same kind of low mood looks like for someone who doesn't fully withdraw.",
            "<b class='who'>Vikram</b> is genuinely going through a low patch after a breakup — he still doesn't feel like doing much — but forces himself to take a short walk and reply to one friend's message most days anyway, even without feeling like it first.",
            "This is the module's contrast case for this pattern: real, genuine low mood, not pretended away — but small activity that happens anyway, rather than waiting for motivation to show up first."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What actually makes Vikram's approach different from Ayesha's? All three can look similar in the moment.",
          "options": [
            {
              "label": "He acted despite not feeling motivated, rather than waiting for motivation before acting — which is the actual order that tends to work",
              "isTarget": true,
              "explain": "That's the real difference — not whether he felt like doing it, which he clearly didn't, but that he didn't wait to feel like it before doing something small anyway."
            },
            {
              "label": "His breakup is a less serious cause of low mood than whatever Ayesha is dealing with",
              "isTarget": false,
              "explain": "There's no basis for ranking causes here, and the scenario doesn't suggest that — the difference isn't the cause or its severity, it's the response to the low mood itself."
            },
            {
              "label": "He's just a naturally more resilient person",
              "isTarget": false,
              "explain": "Nothing in the scenario supports a fixed trait explanation — he explicitly still doesn't feel like doing things. The difference is a behavioural choice (act anyway), not an innate quality."
            }
          ],
          "whyPrompt": "In a few words — how would you know, in the moment, whether you're waiting for motivation or acting despite its absence?"
        },
        "apply": {
          "scenario": "A friend asks Vikram how he manages to keep walking and replying to messages when he clearly doesn't feel like it. He says: ‘I stopped waiting to feel like it first — if I waited for that, I don't think it would ever come. I just do the small thing anyway.’",
          "prompt": "In two or three sentences: think of something small you've been putting off until you feel more like doing it — what would doing it anyway, without waiting, actually look like?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer — the useful pattern is noticing whether the plan depends on motivation showing up first, or on acting regardless of whether it has."
        },
        "remember": {
          "prompt": "In a sentence or two: name one small thing you could do, like Vikram, without waiting to feel like it first.",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w3t5",
        "title": "What actually happened",
        "role": "Reinforcing rep",
        "delayedRef": "w3t4_apply",
        "delayedPrompt": "Last touch, your idea was:",
        "relate": {
          "text": [
            "One more, and then a small piece of what actually happened to Ayesha.",
            "A friend eventually convinced her to come along to a low-key gathering, which she almost cancelled on twice. She didn't come away feeling completely fine — the low mood didn't vanish — but she noticed, honestly, it was a little better than the evening would have been at home alone, and she was glad, mildly, that she'd gone.",
            "That's not a coincidence, and it previews the tools coming in Week 6: activity rarely produces a dramatic mood flip, but it's also rarely nothing — which is exactly the kind of evidence the belief ‘nothing will help’ never actually gets tested against. The tools ahead make that testing deliberate, in small, honest doses — not promising a fix, just checking the belief."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does the 'mildly better, not dramatically different' outcome actually tell us?",
          "options": [
            {
              "label": "The original belief — that nothing would help — wasn't accurate, even though the outcome also wasn't a dramatic, complete fix; a small, real improvement is still evidence against 'nothing'",
              "isTarget": true,
              "explain": "Right — the test doesn't need to produce a total mood flip to matter. 'Mildly better than staying home' directly contradicts 'nothing will help,' even without being a dramatic transformation."
            },
            {
              "label": "It basically confirms nothing much helps, since the improvement was so small",
              "isTarget": false,
              "explain": "This sets the bar for 'help' unreasonably high — the belief being tested was 'nothing will help,' not 'this one evening will completely fix things.' A small real improvement is still real evidence against the stronger claim."
            },
            {
              "label": "She should have picked a bigger event to get a clearer result",
              "isTarget": false,
              "explain": "This misses the actual point of a small test — a small, low-stakes activity is often exactly the right size to test a belief without the exercise itself becoming another source of overwhelm."
            }
          ],
          "whyPrompt": "In a few words — why does a small, honest improvement still count as real evidence?"
        },
        "apply": {
          "scenario": "A different person, same shape of evening: Naina forces herself to a friend's small get-together despite low motivation, expecting it to be pointless, and finds afterward that while she wasn't transformed, she did laugh once and felt slightly lighter than she expected to.",
          "prompt": "In two or three sentences: what does that evening tell Naina about the belief she walked in with?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: “She walked in expecting nothing, and got something small but real — which is genuine evidence against the belief that nothing would help, even without a dramatic shift.”"
        },
        "remember": {
          "prompt": "In a sentence or two: think of a time you did something despite expecting it to be pointless — was it actually as pointless as you expected?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: low mood and depressive symptoms — a belief that nothing will help, which withdrawal keeps from ever actually being tested, and which small activity tends to at least partly disconfirm. That's all three patterns recognised. Next week: the tools start, beginning with emotional overwhelm."
  },
  {
    "num": 4,
    "title": "Overwhelm: four tools, and a plan",
    "mechanism": "A",
    "kind": "technique",
    "retrievalCheck": {
      "prompt1": "In your own words — what is emotional overwhelm and dysregulation, and what does the flood actually do to clear thinking, versus what it can feel like it means about you or the situation?",
      "prompt2": "And what is anger and irritability — how is it actually different from overwhelm, given both can involve a strong emotional reaction?",
      "reveal": "Emotional overwhelm and dysregulation is a sudden, real, time-limited physiological flood that narrows access to clear thinking — it's a state, not a verdict on the size of the trigger or on your capability. Anger and irritability is more specifically a minor trigger producing a disproportionate reaction, usually built on an unchecked assumption about the trigger — overwhelm can happen without anger at all (shutting down, not just spiking), and anger can happen at a lower intensity than a full flood."
    },
    "touches": [
      {
        "id": "w4t1",
        "title": "TIPP Skills",
        "role": "Technique A1 · DBT distress-tolerance (Linehan)",
        "delayedRef": "w3t5_apply",
        "delayedPrompt": "Last week, your doubt was:",
        "relate": {
          "text": [
            "This is the first of the four tools for overwhelm from your theory grounding screen — the one labelled DBT: <b>TIPP skills</b>.",
            "Remember Ishaan, unable to think clearly for the rest of the meeting? TIPP is for exactly that moment — four rapid physiological tools: <b>T</b>emperature (cold water on the face or wrists), <b>I</b>ntense exercise (a short burst of movement), <b>P</b>aced breathing (slower exhale than inhale), and <b>P</b>rogressive muscle relaxation. These work on the body directly, not on the thought."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might working on the body directly, rather than the thought, matter most during an actual flood?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a recent or possible moment of real overwhelm — maybe the one you named back in Week 1.",
          "prompt": "In two or three sentences: which one of the four TIPP tools feels most realistic for you to actually reach for in that kind of moment, and why that one?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here — the tell is whether the choice is genuinely realistic for you (something you could actually do where you'd likely be), not just the one that sounds best on paper."
        },
        "remember": {
          "prompt": "In a sentence or two: is there anywhere you'd need to prepare in advance to make this tool actually usable — cold water nearby, space to move?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w4t2",
        "title": "The Window-of-Tolerance Framework",
        "role": "Technique A2 · Interpersonal Neurobiology (Siegel)",
        "delayedRef": "w4t1_apply",
        "delayedPrompt": "Last touch, your choice was:",
        "relate": {
          "text": [
            "The second tool: <b>the window-of-tolerance framework</b> — recognising which of three zones you're in: a workable middle window, a hyper-aroused zone above it (flooded, reactive), or a hypo-aroused zone below it (shut down, numb).",
            "This doesn't calm anything by itself — but naming the zone tells you which kind of tool actually fits. TIPP's intense exercise helps come down from hyper-arousal; it wouldn't help someone who's shut down and needs something activating instead."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might using a calming tool on hypo-arousal (shut down), or an activating tool on hyper-arousal (flooded), actually make things worse rather than better?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think back over the last week or two.",
          "prompt": "In two or three sentences: name a moment you were outside the window — which zone were you in, hyper or hypo, and how do you know?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here — the tell is whether the zone identification is specific (racing heart and can't stop talking vs. numb and can't get off the couch), not a vague 'I was upset.'"
        },
        "remember": {
          "prompt": "In a sentence or two: which zone do you tend to go to more often — hyper or hypo?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w4t3",
        "title": "Extended-Exhale Breath-Based Grounding",
        "role": "Technique A3 · Mindfulness (Kabat-Zinn-style)",
        "delayedRef": "w4t2_apply",
        "delayedPrompt": "Last touch, your zone was:",
        "relate": {
          "text": [
            "The third tool: <b>extended-exhale breathing</b> — making the exhale longer than the inhale, for example 4 counts in, 6 or 8 counts out, for a minute or two.",
            "This is a real physiological lever, not a distraction technique — a longer exhale directly engages the body's calming nervous-system response."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might this work even when you don't believe, in the moment, that 'just breathing' will actually help?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Find a minute right now, if you can.",
          "prompt": "In two or three sentences: try a few rounds — 4 in, 6 or 8 out — and describe what you actually noticed.",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here — the tell is whether you noticed a real, physical shift, even a small one, not just going through the motions."
        },
        "remember": {
          "prompt": "In a sentence or two: could you realistically use this almost anywhere — what would stop you, if anything?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w4t4",
        "title": "The 'Observing Self' Exercise",
        "role": "Technique A4 · ACT (Hayes)",
        "delayedRef": "w4t3_apply",
        "delayedPrompt": "Last touch, you noticed:",
        "relate": {
          "text": [
            "The fourth tool: <b>the observing-self exercise</b> — shifting from being fully inside an overwhelming emotion to noticing yourself having it: “I am noticing that I am feeling [emotion].”",
            "This doesn't suppress or argue with the emotion — it creates a small, real distance from it, often enough to make a flood feel survivable rather than total."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might naming a feeling this way create distance, when just feeling it doesn't?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of an emotion you're currently carrying, even a mild one right now.",
          "prompt": "In two or three sentences: try the sentence — ‘I am noticing that I am feeling ___’ — and describe what shifted, if anything.",
          "placeholder": "I am noticing that I am feeling... / What shifted: ..."
        },
        "reveal": {
          "text": "There's no single model answer — the tell is whether naming it created even a small gap, versus feeling identical to just thinking about the feeling directly."
        },
        "remember": {
          "prompt": "In a sentence or two: is this a tool you could reach for right after a flood starts easing, to help decide what to do next?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w4t5",
        "title": "How did it go, and a plan for next time",
        "role": "Check-in + pre-commitment",
        "delayedRef": "w4t4_apply",
        "delayedPrompt": "Last touch, your noticing was:",
        "relate": {
          "text": [
            "No new idea this touch — two quick things before we move to anger.",
            "First, a real check-in on the four tools from this week — the same four that started with Ishaan's meeting back in Week 1. Then, a plan built now, while nothing is actually flooding."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Which of the four did you actually reach for this week, if any — and what happened when you did?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Pick whichever of the four tools felt most useful this week.",
          "prompt": "In two or three sentences, write an if-then plan for using it: ‘If [specific cue], then I will [specific tool, specifically applied].’",
          "placeholder": "If [specific cue], then I will..."
        },
        "reveal": {
          "text": "Something like: “If my chest tightens and I can't follow a conversation, then I'll excuse myself for a minute and do extended-exhale breathing before rejoining.”"
        },
        "remember": {
          "prompt": "In a sentence or two: say the plan back to yourself — does it actually sound doable in the middle of a real flood?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: four named tools for overwhelm — TIPP skills, the window-of-tolerance framework, extended-exhale breathing, and the observing-self exercise — a real check-in, and a plan built while calm. No new teaching in this summary. Next week: the same shape, for anger."
  },
  {
    "num": 5,
    "title": "Anger: four tools, and a plan",
    "mechanism": "B",
    "kind": "technique",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w5t1",
        "title": "Anger-Cycle Thought Records",
        "role": "Technique B1 · Cognitive-behavioural model of anger (Novaco)",
        "delayedRef": "w4t5_apply",
        "delayedPrompt": "Last week, your if-then plan was:",
        "relate": {
          "text": [
            "This is the first of the four tools for anger from your theory grounding screen: <b>anger-cycle thought records</b>.",
            "Remember Karan finding out about the emergency the next day? This tool makes that kind of discovery deliberate: write down the specific appraisal underneath an anger spike — ‘they're disrespecting me,’ ‘this is completely unfair’ — and check it against what's actually known, before reacting on it."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might naming the exact appraisal, before reacting, change how the trigger actually gets responded to?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of something that's irritated you recently, even mildly.",
          "prompt": "In two or three sentences: name the appraisal underneath it, then check it — what's the actual evidence for that appraisal, and is there a more neutral explanation available?",
          "placeholder": "The appraisal: ... / The evidence / alternative: ..."
        },
        "reveal": {
          "text": "There's no single model answer here — the tell is whether a genuine alternative explanation got considered, not just a reassurance layered on top of the same appraisal."
        },
        "remember": {
          "prompt": "In a sentence or two: did naming the appraisal change how big the trigger felt?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w5t2",
        "title": "The STOP Skill & Opposite Action",
        "role": "Technique B2 · DBT (Linehan)",
        "delayedRef": "w5t1_apply",
        "delayedPrompt": "Last touch, your appraisal was:",
        "relate": {
          "text": [
            "The second tool: <b>STOP and opposite action</b>. STOP — <b>S</b>top, <b>T</b>ake a step back, <b>O</b>bserve, <b>P</b>roceed mindfully — for the moment an urge to snap arises. Opposite action then means doing something different from what the urge demands, when the anger isn't fully justified by the facts.",
            "This is the in-the-moment tool — the few seconds between an urge appearing and a reaction actually happening."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might a few seconds of deliberate pause change what happens next, even though the irritation itself hasn't gone anywhere yet?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a moment recently where an urge to snap showed up, even briefly.",
          "prompt": "In two or three sentences: walk through what STOP would have looked like in that exact moment, and what opposite action might have been.",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here — the tell is whether the opposite action is genuinely specific to that moment, not a generic ‘stay calm.’"
        },
        "remember": {
          "prompt": "In a sentence or two: which part of STOP feels hardest for you — the stopping, or the observing before proceeding?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w5t3",
        "title": "Structured Time-Out Protocol",
        "role": "Technique B3 · Stress-inoculation approach (Novaco)",
        "delayedRef": "w5t2_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "The third tool: <b>a structured time-out protocol</b> — a planned step away from a triggering situation, agreed in advance, with a clear signal for calling it, a set duration, and a clear way of returning to the conversation.",
            "This isn't avoidance — it's giving a real physiological spike time to come down, made workable by planning it before it's needed, not inventing it mid-argument."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might a time-out agreed in advance work better than one improvised in the middle of a heated moment?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a relationship or situation where anger spikes tend to happen — with a partner, a sibling, a colleague.",
          "prompt": "In two or three sentences: draft the actual protocol — what's the signal for calling it, how long, and how do you plan to return to the conversation afterward?",
          "placeholder": "Signal: ... / Duration: ... / How we return: ..."
        },
        "reveal": {
          "text": "There's no single model answer here — the tell is whether all three parts are concrete enough to actually use, not just ‘I'll take a break sometimes.’"
        },
        "remember": {
          "prompt": "In a sentence or two: is this something you could realistically propose to the other person involved, ahead of time?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w5t4",
        "title": "Values-Based Response Practice",
        "role": "Technique B4 · ACT (Hayes)",
        "delayedRef": "w5t3_apply",
        "delayedPrompt": "Last touch, your protocol was:",
        "relate": {
          "text": [
            "The fourth tool: <b>values-based response practice</b> — pausing to ask what response actually reflects the kind of person, partner, sibling, or colleague you want to be, rather than the response the anger urge is demanding.",
            "This doesn't try to make the anger disappear — it inserts a values-based choice point between the urge and the action."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might asking 'what does this reflect about who I want to be' matter more, in the moment, than asking 'am I right to be angry'?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a recent or ongoing situation where anger has been showing up.",
          "prompt": "In two or three sentences: what response would actually reflect who you want to be here, separate from what the urge is demanding?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer — the tell is whether the answer names something genuinely values-based (the kind of sibling, colleague, partner you want to be), not just a softer version of the same reaction."
        },
        "remember": {
          "prompt": "In a sentence or two: does this feel different from just trying to suppress the anger?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w5t5",
        "title": "How did it go, and a plan for next time",
        "role": "Check-in + pre-commitment",
        "delayedRef": "w5t4_apply",
        "delayedPrompt": "Last touch, your answer was:",
        "relate": {
          "text": [
            "No new idea this touch — two quick things before we move to low mood.",
            "First, a real check-in on this week's four tools — the same four that started with Karan's kitchen mess back in Week 2. Then a plan built now, before the next irritation actually hits."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Which of the four did you actually try this week, and what happened?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Pick whichever of the four tools felt most useful this week.",
          "prompt": "In two or three sentences: write an if-then plan for using it: ‘If [specific cue], then I will [specific tool, specifically applied].’",
          "placeholder": "If [specific cue], then I will..."
        },
        "reveal": {
          "text": "Something like: “If I feel the urge to snap at someone at home, then I'll do STOP first and check the appraisal before saying anything.”"
        },
        "remember": {
          "prompt": "In a sentence or two: say the plan back to yourself — does it actually sound doable in a genuinely irritated moment, not just on a calm day?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: four named tools for anger — anger-cycle thought records, STOP and opposite action, a structured time-out protocol, and values-based response practice — a real check-in, and a plan built while calm. No new teaching in this summary. Next week: low mood."
  },
  {
    "num": 6,
    "title": "Low mood: four tools, and a plan",
    "mechanism": "C",
    "kind": "technique",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w6t1",
        "title": "Activity Scheduling with Mastery/Pleasure Ratings",
        "role": "Technique C1 · Behavioural Activation (Lewinsohn; Martell, Dimidjian & Jacobson)",
        "delayedRef": "w5t5_apply",
        "delayedPrompt": "Last week, your if-then plan was:",
        "relate": {
          "text": [
            "This is the first of the four tools for low mood from your theory grounding screen — the one labelled Behavioural Activation: <b>activity scheduling with mastery/pleasure ratings</b>.",
            "Remember Vikram, walking and replying to a message without waiting to feel like it first? This tool makes that deliberate: schedule a small, specific activity ahead of time — not when motivation shows up — and rate it afterward on mastery (accomplishment) and pleasure, even if the rating is low."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might scheduling an activity BEFORE motivation shows up actually work, when it feels backwards?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of something small you've been putting off, maybe the one you named in Week 3.",
          "prompt": "In two or three sentences: schedule it — a specific day and time — and predict, honestly, what mastery and pleasure rating (0–10) you expect it to get.",
          "placeholder": "The activity, day and time: ... / Predicted mastery/pleasure: ..."
        },
        "reveal": {
          "text": "There's no single model answer here — the tell is whether the schedule is specific enough to actually keep (a real day and time), and whether the prediction is honest, not artificially low or high."
        },
        "remember": {
          "prompt": "In a sentence or two: after you do it, come back and rate it honestly — did it match your prediction?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w6t2",
        "title": "Interpersonal Role-Transition Work",
        "role": "Technique C2 · IPT (Klerman & Weissman) — guided",
        "guardrail": true,
        "delayedRef": "w6t1_apply",
        "delayedPrompt": "Last touch, your prediction was:",
        "relate": {
          "text": [
            "The second tool, and this one's different from the others this week, on purpose: <b>interpersonal role-transition work</b>.",
            "Sometimes a low mood has a real, identifiable change underneath it — a job loss, a breakup, becoming a parent, a move — that hasn't been fully worked through. This tool asks you to name it directly: what did the old role give you, and what could the new one realistically offer instead.",
            "Because this asks you to engage with something real, and possibly painful, this touch checks in with you directly partway through."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might naming a real transition directly do something that just managing the mood day-to-day doesn't?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think honestly about whether there's a real transition underneath your own current mood, if there is one — this is optional to go deep on.",
          "intensityPrompt": "First, choose how far you want to go with this right now:",
          "intensityOptions": [
            "Smaller version — just name the transition, briefly",
            "Bigger version — name it and explore what the new role could offer"
          ],
          "prompt": "In two or three sentences: name the transition (if there is one), what the old role gave you, and — if you chose the bigger version — what the new one might realistically offer.",
          "placeholder": "The transition: ... / What the old role gave me: ... / (If bigger version) What the new one might offer: ..."
        },
        "distressPrompt": "You've just named something real, and possibly difficult. Before we continue — how are you feeling right now?",
        "reveal": {
          "text": "There's no single model answer here — the tell is whether the transition named is genuinely specific to your own life, not a generic ‘things have changed’."
        },
        "remember": {
          "prompt": "In a sentence or two: was there a real transition there, and had you actually named it clearly before this touch?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w6t3",
        "title": "Cognitive Restructuring of Hopelessness",
        "role": "Technique C3 · CBT (Beck's cognitive triad)",
        "delayedRef": "w6t2_apply",
        "delayedPrompt": "Last touch, your transition was:",
        "relate": {
          "text": [
            "The third tool: <b>cognitive restructuring of hopelessness</b>, using Beck's cognitive-triad model — three linked beliefs: a negative view of yourself, of the world, and of the future.",
            "This is a practice exercise — you'll be asked to write out one of these beliefs honestly, exactly as it sounds in your head, so it can actually be tested. Writing a belief down to examine it is different from believing it as a settled fact; that's the point of this touch."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might separating the three parts of the triad — self, world, future — matter, rather than treating hopelessness as one big feeling?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of one honest belief from any part of the triad that's been present for you lately.",
          "prompt": "In two or three sentences: write the belief exactly as it sounds in your head, then test it — what's the actual, specific evidence for and against it?",
          "placeholder": "The belief: ... / Evidence for and against: ..."
        },
        "reveal": {
          "text": "There's no single model answer here — the tell is whether real, specific evidence was considered on both sides, not just a reassurance layered over the same belief."
        },
        "remember": {
          "prompt": "In a sentence or two: did writing the belief down and testing it change how solid it felt?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w6t4",
        "title": "Behavioural Experiments Testing 'Nothing Will Help' Predictions",
        "role": "Technique C4 · CBT (Beck) — guided",
        "guardrail": true,
        "delayedRef": "w6t3_apply",
        "delayedPrompt": "Last touch, your belief was:",
        "relate": {
          "text": [
            "The fourth tool: <b>behavioural experiments testing ‘nothing will help’ predictions</b>.",
            "Remember Ayesha's evening — mildly better than staying home, not a dramatic fix, but real? This tool makes that kind of test deliberate: name a specific prediction (‘nothing will make this evening better’), then run a small, real test of it, and compare what actually happened to what you predicted.",
            "Because this asks you to act despite genuinely expecting it won't help — real discomfort, not hypothetical — this touch checks in with you directly partway through."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why does the size of the improvement matter less than whether 'nothing' turned out to be literally true?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of something small you could actually try today or this week, even while expecting it won't help.",
          "intensityPrompt": "First, choose how big a test you want to run:",
          "intensityOptions": [
            "Smaller version — something brief, low-effort",
            "Bigger version — something that takes more real effort or time"
          ],
          "prompt": "In two or three sentences: name the specific prediction, the test you're choosing, and what you'd count as evidence against ‘nothing.’",
          "placeholder": "Prediction: ... / Test: ... / What would count as evidence against 'nothing': ..."
        },
        "distressPrompt": "You've just committed to testing a real, discouraging prediction. Before we continue — how are you feeling right now?",
        "reveal": {
          "text": "There's no single model answer here — the tell is whether the evidence bar is honest and specific, not set so high that almost nothing could count against the prediction."
        },
        "remember": {
          "prompt": "In a sentence or two: after you run the test, come back and compare — did 'nothing' turn out to be literally true?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w6t5",
        "title": "How did it go, and a plan for next time",
        "role": "Check-in + pre-commitment",
        "delayedRef": "w6t4_apply",
        "delayedPrompt": "Last touch, your test was:",
        "relate": {
          "text": [
            "No new idea this touch — two quick things before Week 7.",
            "First, a real check-in on this week's four tools — the same four that started with Ayesha's brushes back in Week 3. Then a plan built now, while things feel manageable."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Which of the four did you actually try this week, if any — and what happened?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Pick whichever of the four tools felt most useful this week.",
          "prompt": "In two or three sentences: write an if-then plan for using it: ‘If [specific cue], then I will [specific tool, specifically applied].’",
          "placeholder": "If [specific cue], then I will..."
        },
        "reveal": {
          "text": "Something like: “If I catch myself cancelling on someone because ‘I won't be good company,’ then I'll go anyway, for a shorter time than usual, and rate it honestly afterward.”"
        },
        "remember": {
          "prompt": "In a sentence or two: say the plan back to yourself — does it actually sound doable on a genuinely low day?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: four named tools for low mood — activity scheduling, interpersonal role-transition work, cognitive restructuring of hopelessness, and behavioural experiments testing ‘nothing will help’ — a real check-in, and a plan built while things feel manageable. No new teaching in this summary. Next week: all three patterns together, and the one unscaffolded test."
  },
  {
    "num": 7,
    "title": "Integration & review",
    "mechanism": "both",
    "kind": "integration",
    "retrievalCheck": {
      "prompt1": "Name one tool for anger and, in your own words, what it actually does.",
      "prompt2": "Name one tool for low mood and, in your own words, what it actually does.",
      "reveal": "Any of the four anger tools or four low-mood tools count here — what matters is whether the description is functional (what the tool actually does and why) rather than just the name repeated back."
    },
    "touches": [
      {
        "id": "w7t1",
        "title": "When two patterns show up together",
        "role": "Integration",
        "delayedRef": "w6t5_apply",
        "delayedPrompt": "Last week, your if-then plan was:",
        "relate": {
          "text": [
            "Meher had a genuinely overwhelming morning — flooded, unable to think clearly through back-to-back stressful calls — and by the afternoon, still not fully settled, snapped sharply at a friend over a small, unrelated thing."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Both overwhelm and anger showed up here. Which one do you think came first and fed the other, and why?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Same situation — Meher's morning and afternoon.",
          "prompt": "In two or three sentences: what would you actually recommend Meher try, and why that one, out of all twelve tools you now know?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's a real case either way. Some would start with TIPP or extended-exhale breathing to address the still-unsettled overwhelm directly, since that's likely feeding the shorter fuse. Others would say STOP is more urgent, since the anger is what's actually about to damage a friendship if it isn't caught. Either is defensible — what matters is she picks one and actually runs it."
        },
        "remember": {
          "prompt": "In a sentence or two: which would you have picked for yourself, in her position?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w7t2",
        "title": "Designing a full response",
        "role": "Integration",
        "delayedRef": "w7t1_apply",
        "delayedPrompt": "Last touch, you said you'd recommend:",
        "relate": {
          "text": [
            "Arjun has been withdrawing from friends for a few weeks (low mood) — and the little contact he does have has been unusually short-tempered, snapping over small things he'd normally let go (anger), which then makes him withdraw further, embarrassed by how he reacted."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "What's driving what here, in your own words — is the anger feeding the withdrawal, the withdrawal feeding the anger, or both?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Same situation — Arjun's withdrawal and short temper.",
          "prompt": "In two or three sentences: design a full plan for Arjun — combine tools across patterns if that's what it takes.",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: “Activity scheduling addresses the withdrawal directly — something small, low-stakes, with a friend. Values-based response practice helps with the snapping in the meantime, so the contact he does have doesn't keep pushing people further away while he works on the bigger pattern.”"
        },
        "remember": {
          "prompt": "In a sentence or two: which of the three patterns do you reach for tools on first, generally — and why do you think that's your instinct?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w7t3",
        "title": "When all three show up at once",
        "role": "Integration",
        "delayedRef": "w7t2_apply",
        "delayedPrompt": "Last touch, your plan for Arjun was:",
        "relate": {
          "text": [
            "Zara has had a genuinely hard month — low motivation, cancelling plans, telling herself nothing will help (low mood); snapping more than usual at her partner over small things (anger); and, on the days it all builds up, a real flood where she can barely think or speak for a while (overwhelm)."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "All three patterns showed up here. In your own words, how do they seem to be feeding each other?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Same situation — Zara's month.",
          "prompt": "In two or three sentences: what's the one move that would actually help the most right now, and why that one over the others?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single right answer — the pattern worth noticing is that all three can genuinely reinforce each other (low mood lowers her threshold for irritation, irritation strains the relationship, the strain and withdrawal together build toward the occasional flood) without one single tool being able to untangle all three at once."
        },
        "remember": {
          "prompt": "In a sentence or two: is there a real situation in your own life right now where more than one of these three shows up together?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w7t4",
        "title": "One more, mixed",
        "role": "Integration",
        "delayedRef": "w7t3_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Rahul got genuinely harsh feedback from a client on a project he'd worked hard on (a real trigger for overwhelm), has been short with his team ever since (anger), and has started telling himself he's just not good at this job and nothing he does will change that (low mood)."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "If you had to guess which pattern is actually the loudest here, which would you guess, and what would you look for to check?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Same situation — Rahul and the client feedback.",
          "prompt": "In two or three sentences: what's the one move that unblocks the most here, if there is one — and if there isn't, say so.",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Often the honest answer is that no single tool resolves all three cleanly — the observing-self exercise might help with the immediate overwhelm, an anger-cycle thought record might catch the sharpness with his team before it damages relationships further, and cognitive restructuring might eventually test the 'not good at this job' belief — but the original feedback itself is still real and still has to be dealt with regardless."
        },
        "remember": {
          "prompt": "In a sentence or two: what's your instinct, generally — deal with the feelings first, or address the original trigger first and let the feelings settle after?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w7t5",
        "title": "Your own situation — nothing pre-walked",
        "role": "Transfer test",
        "transferTest": true,
        "delayedRef": "w7t4_apply",
        "delayedPrompt": "Last touch, your instinct was:",
        "relate": {
          "text": [
            "This is the one part of the module built with no scaffolding at all.",
            "You've followed Ishaan through a flooded meeting, Karan through a snapped-at sibling, and Ayesha through put-away paintbrushes — and hopefully noticed the shape of one or more of these patterns in your own week too, more than once.",
            "Now it's just yours. You've got a real situation right now — overwhelm, anger, low mood, maybe more than one at once. Don't simplify it for us."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Describe it in your own words — what's actually going on, as specifically as you can.",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "With nothing pre-walked this time.",
          "prompt": "In two or three sentences: what's your actual next move, and why that one — which of the twelve tools, and why not one of the others?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single right answer here — this was the one part of the module deliberately built to have no signalled answer. What matters is whether your reasoning traces back to the tools from your theory grounding screen and Weeks 4–6, not whether it matches anyone else's."
        },
        "remember": {
          "prompt": "In a sentence or two — what do you actually want to remember from this module, in your own words, not the module's?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": null
  }
],
  reinforcementBank: [
  {
    "code": "B1",
    "rep": 1,
    "type": "reflection",
    "scenario": "A colleague forwards an email to the wrong group by mistake, and you feel a flash of sharp irritation — ‘that's so careless, they never pay attention.’",
    "prompt": "In two or three sentences: write the appraisal, then check it — what's the actual evidence, and is there a more neutral explanation?",
    "reveal": "There's no single model answer — the tell is whether a genuine alternative explanation (rushing, a real slip anyone could make) got considered, not just a reassurance on top of the same appraisal."
  },
  {
    "code": "B1",
    "rep": 2,
    "type": "reflection",
    "scenario": "A family member forgets to pass on a message you asked them to relay, and you feel a spike of ‘they never take what I ask seriously.’",
    "prompt": "In two or three sentences: name the appraisal and test it against what's actually known.",
    "reveal": "There's no single model answer — the tell is whether the evidence considered is specific, not a vague reassurance."
  },
  {
    "code": "C1",
    "rep": 1,
    "type": "reflection",
    "scenario": "You've been putting off calling an old friend back, telling yourself you're too tired and it won't be worth the effort right now.",
    "prompt": "In two or three sentences: schedule the call for a specific time, and predict, honestly, what mastery/pleasure rating you expect it to get.",
    "reveal": "There's no single model answer — the tell is whether the schedule is specific enough to actually keep."
  },
  {
    "code": "C1",
    "rep": 2,
    "type": "reflection",
    "scenario": "You've stopped going for your usual weekend walk, assuming you won't enjoy it in your current mood.",
    "prompt": "In two or three sentences: schedule it and predict the mastery/pleasure rating, then note (if you've done it) how the actual rating compared.",
    "reveal": "There's no single model answer — the tell is an honest comparison between the prediction and what actually happened."
  },
  {
    "code": "C3",
    "rep": 1,
    "type": "reflection",
    "scenario": "A project didn't go the way you hoped, and you've been thinking ‘I'm just not good at this, and I never will be.’",
    "prompt": "In two or three sentences: write the belief exactly as it sounds in your head, and test it against real, specific evidence for and against.",
    "reveal": "There's no single model answer — the tell is whether both sides of the evidence are specific and honest, not one-sided."
  },
  {
    "code": "C3",
    "rep": 2,
    "type": "reflection",
    "scenario": "After a difficult week, you've caught yourself thinking ‘things like this always happen to me.’",
    "prompt": "In two or three sentences: write the belief, and test it against real, specific evidence.",
    "reveal": "There's no single model answer — the tell is whether the evidence considered is genuinely specific to real events, not restated feeling."
  }
],
  toolsData: {
  "tipp_log": {
    "code": "A1",
    "title": "TIPP Skills",
    "mechShort": "Overwhelm",
    "kind": "log_single",
    "intro": "Temperature, Intense exercise, Paced breathing, Progressive relaxation — for the moment a flood has already taken over. Log it each time you actually reach for one.",
    "logLabel": "Which TIPP tool did you use, and what happened?",
    "firstPlaceholder": "e.g. Cold water on my wrists during a flooded moment before a call — heart rate came down within a couple of minutes",
    "placeholder": "Your answer..."
  },
  "window_log": {
    "code": "A2",
    "title": "Window-of-Tolerance Check",
    "mechShort": "Overwhelm",
    "kind": "log_single",
    "intro": "A quick check-in with yourself: which zone am I in right now — the workable window, hyper-aroused, or hypo-aroused? Log it whenever you actually check.",
    "logLabel": "Which zone were you in, and what did you notice?",
    "firstPlaceholder": "e.g. Hypo-aroused — numb and unmotivated most of the afternoon",
    "placeholder": "Your answer..."
  },
  "exhale_log": {
    "code": "A3",
    "title": "Extended-Exhale Breathing",
    "mechShort": "Overwhelm",
    "kind": "log_single",
    "intro": "4 counts in, 6 or 8 counts out, for a minute or two. A real physiological lever, usable almost anywhere. Log it each time you actually practice a round.",
    "logLabel": "When did you practice, and what did you notice?",
    "firstPlaceholder": "e.g. Before a difficult call — noticed my shoulders drop a little",
    "placeholder": "Your answer..."
  },
  "observing_self_log": {
    "code": "A4",
    "title": "Observing-Self Exercise",
    "mechShort": "Overwhelm",
    "kind": "log_single",
    "intro": "‘I am noticing that I am feeling ___.’ A small, real distance from an overwhelming emotion. Log it each time you actually try it.",
    "logLabel": "What were you feeling, and did naming it create any distance?",
    "firstPlaceholder": "e.g. Noticing that I am feeling embarrassed after a mistake — helped a little, didn’t erase it",
    "placeholder": "Your answer..."
  },
  "stop_log": {
    "code": "B2",
    "title": "STOP & Opposite Action",
    "mechShort": "Anger",
    "kind": "log_single",
    "intro": "Stop, Take a step back, Observe, Proceed mindfully — for the moment an urge to snap arises. Log it each time you actually catch and use it.",
    "logLabel": "What was the urge, and what did you do instead?",
    "firstPlaceholder": "e.g. Urge to snap at a slow queue — paused, observed it wasn’t worth it, said nothing",
    "placeholder": "Your answer..."
  },
  "timeout_log": {
    "code": "B3",
    "title": "Structured Time-Out",
    "mechShort": "Anger",
    "kind": "log_single",
    "intro": "A planned step away from a triggering situation, with a clear signal, duration, and way back in. Log it each time you actually use the protocol.",
    "logLabel": "What triggered it, and how did the time-out go?",
    "firstPlaceholder": "e.g. Called it during a tense conversation with a sibling — came back calmer after 10 minutes",
    "placeholder": "Your answer..."
  },
  "values_response_log": {
    "code": "B4",
    "title": "Values-Based Response",
    "mechShort": "Anger",
    "kind": "log_single",
    "intro": "Pausing to ask what response reflects who you want to be, before reacting. Log it each time you actually do this.",
    "logLabel": "What was the situation, and what response did you choose?",
    "firstPlaceholder": "e.g. Chose to let a minor comment go, since snapping isn’t who I want to be with my team",
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
    tier1: "Any statement connecting emotional flooding, anger, or low mood to intent or a plan to end one's life or self-harm (“I can't take this anymore, I want it to just stop for good”, “I have a way to end it”).",
    tier2: "Persistent hopelessness about life broadly — not just about the current low-mood episode improving — (“nothing is ever going to get better, there's no point in any of this”), or real functional collapse: not getting out of bed for multiple days, not eating regularly, missing work or responsibilities repeatedly.",
    lowMoodClassifierNote: "CRITICAL, module-specific: two touches in this module (C3, C4) explicitly ask users to write out genuinely hopeless-sounding thoughts and predictions on purpose — that's the exercise itself, not a symptom to flag. 'Nothing will make this evening better' typed into a behavioural-experiment prompt is the module working correctly, not a risk signal on its own. The classifier must distinguish practice material written as part of a structured exercise (NONE, even when the words themselves sound bleak) from a genuine, unprompted expression of hopelessness or intent (TIER1/TIER2). This is a different calibration challenge from the Anxiety module's intrusive-thoughts note — there the risk was the module's own recognition content being over-flagged; here the risk is compounded by the fact that two touches literally instruct the user to produce hopeless-sounding text as an assignment. Needs dedicated clinical review before this ships, using real examples of both genuine hopelessness and completed C3/C4 exercise answers side by side.",
    systemPrompt: "You are a safety classifier inside a mental-health support app used in India. Classify the user's message into exactly one of: NONE, TIER1, TIER2.\n\nTIER1 definition: Any statement connecting emotional flooding, anger, or low mood to intent or a plan to end one's life or self-harm (“I can't take this anymore, I want it to just stop for good”, “I have a way to end it”).\nTIER2 definition: Persistent hopelessness about life broadly — not just about the current low-mood episode improving — (“nothing is ever going to get better, there's no point in any of this”), or real functional collapse: not getting out of bed for multiple days, not eating regularly, missing work or responsibilities repeatedly.\n\nCritical context 1: many people, especially in Indian English, use hyperbolic or idiomatic self-deprecating language that is NOT a genuine risk signal — for example \"I could kill myself for forgetting that\", \"this deadline is literally killing me\", \"I could just die of embarrassment\". Do NOT classify ordinary hyperbole, jokes, or figures of speech as TIER1 or TIER2, even if they contain words like \"kill\", \"die\", or \"worthless\".\n\nCritical context 2 (specific to this module): two exercises in this module explicitly instruct the user to write out a hopeless-sounding prediction or belief ON PURPOSE, as the assignment itself — for example \"nothing will make this evening better\" typed in response to a prompt asking them to name the specific prediction they're about to test, or a negative self/world/future belief typed in response to a prompt asking them to identify and then challenge it. This is the module working exactly as intended — classify as NONE. Only classify as TIER1 or TIER2 if the message goes beyond naming a belief-to-be-tested and expresses genuine, current, unprompted hopelessness about life broadly, or actual intent/a plan. Look for cues the person is working WITH the hopeless thought as material (testing it, naming it, examining it) versus simply being IN it and expressing it as their own current, settled view with no framing of testing or examining it.\n\nOnly classify as TIER1 if there is a genuine indication of intent, a plan, or serious risk to the person's life or safety. Only classify as TIER2 if there is genuine persistent hopelessness about life broadly, or real functional collapse — not a single hard day, a low-mood episode being described accurately, or hopeless-sounding text written as part of a structured exercise.\n\nWhen genuinely uncertain between exercise material/hyperbole and a real signal, prefer the lower tier (or NONE) rather than over-triggering — but never downgrade language that includes a specific plan, method, or timeframe.\n\nRespond with ONLY a raw JSON object, no markdown fences, no other text: {\"tier\": \"NONE\" | \"TIER1\" | \"TIER2\", \"reason\": \"one short clause\"}",
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
    "area": "Clinical",
    "text": "All 12 practicable technique mappings are my synthesis of the taxonomy's named sources — not clinician-reviewed."
  },
  {
    "area": "Clinical",
    "text": "Tier 1/2 escalation definitions for this module (overwhelm/anger/low-mood framing) are a first draft, awaiting sign-off."
  },
  {
    "area": "Clinical — highest priority in this module",
    "text": "See BRIEF.escalation.lowMoodClassifierNote above, baked into the escalation system prompt below. Two touches (C3, C4) explicitly instruct users to write hopeless-sounding practice material as the exercise itself — a materially different, and arguably harder, calibration problem than the Anxiety module's intrusive-thoughts note, since here the module is actively prompting the exact language a naive classifier would flag. Needs dedicated clinical review with real side-by-side examples before this ships."
  },
  {
    "area": "Structural note — simplest module built so far",
    "text": "All three mechanisms have exactly T=4 practicable techniques — the template's already-solved standard case (4 technique touches + 1 combined check-in/pre-commit touch). No pairing, bridging, or exact-fit edge cases needed this time. Mechanism C's two [B] techniques (IPT role-transition, behavioural experiments) are a straightforward instance of the already-validated 'two separate [B] touches in one mechanism' pattern, not a new one — confirms that pattern generalizes cleanly at T=4, not just at the T values it was previously seen at."
  },
  {
    "area": "Structural note",
    "text": "Zero [C] reference-only techniques in this module — second module after Module 2 with none. All 12 techniques are practicable in-app, matching the taxonomy's own count exactly."
  },
  {
    "area": "Content decision",
    "text": "IPT role-transition work (C2) asks users to name a real underlying life transition (job loss, breakup, becoming a parent, a move). This is inherently more personal/identifying than most other touches in this module — worth confirming the guardrail + standard journal-privacy framing from the Intro Sequence is sufficient here, or whether this specific touch needs additional reassurance about what's stored and seen."
  },
  {
    "area": "Resolved",
    "text": "Crisis helpline numbers reused from Modules 1–3 (KIRAN, TeleMANAS, Vandrevala Foundation) — national, not module-specific."
  },
  {
    "area": "Resolved",
    "text": "Escalation UX (persistent crisis banner regardless of tier, server-side logging of all classification events including NONE, Tier 1 relies on the always-visible banner rather than an additional interrupt, Tier 2 frequency-based interrupt threshold deferred pending real usage data) follows the shared decisions documented in Module 3's dev guide §5 — not re-derived here, since that section was written to be module-agnostic infrastructure."
  },
  {
    "area": "Not yet started",
    "text": "Same as prior modules: accessibility target, analytics schema, and a full copy/editorial pass have not been done for this module either."
  },
  {
    "area": "Standing reminder",
    "text": "Nothing in this module has been clinically reviewed and nothing has been tested with a real user — and the low-mood classifier calibration above matters more here than in any prior module, given how close this content sits to genuine depressive risk language."
  }
]
};
