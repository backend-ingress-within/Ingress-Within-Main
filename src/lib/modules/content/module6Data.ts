import { ModuleContent } from '../../../types/moduleContent';

function opt(label: string, isTarget: boolean, explain: string) {
  return { label, isTarget, explain };
}

export const MODULE_6_CONTENT: ModuleContent = {
  moduleId: 'M6',
  slug: 'trauma-past-experiences',
  name: "Trauma & Past Experiences",
  duration_weeks: 2,
  tier: "Specialized* * 399 rupees * Self domain",
  brief: {
  "moduleName": "Trauma & Past Experiences",
  "tier": "Specialized* * 399 rupees * Self domain",
  "mechanisms": [
    {
      "key": "A",
      "name": "Trauma & Past Difficult Experiences",
      "short": "Trauma",
      "def": "A lasting emotional and physical response to a deeply distressing past event, showing up now as patterns like sudden strong physical reactions, avoidance of reminders, or a nervous system that stays on guard long after the actual danger has passed. This module works only with how these patterns show up today - never with the details of what happened.",
      "need": "Safety, containment, agency",
      "contrast": {
        "who": "Ayaan",
        "text": "went through a difficult accident of his own a while back, and still has real physical reactions to reminders of it - he hasn't 'gotten over it' in some clean, finished way. What's different is that he's built a quick way to bring himself back to the present moment when a reaction fires, rather than needing to avoid the reminder altogether."
      },
      "techniques": [
        {
          "code": "A1",
          "approach": "Somatic Experiencing / Interpersonal Neurobiology",
          "format": "B",
          "guardrail": true,
          "name": "Titrated Grounding & Body-Based Regulation",
          "source": "Peter Levine, Somatic Experiencing; Dan Siegel's window of tolerance",
          "what": "Small, paced grounding techniques - naming what you can currently see, hear, and feel; feeling your feet on the floor; a slow, steady breath - practiced specifically to stay within a manageable range when a trauma-related reaction starts to fire, rather than getting fully flooded or shutting down completely.",
          "how": "'Titrated' means deliberately small and paced - not confronting the full intensity of a reaction at once, but staying just inside what's actually tolerable right now, a little at a time. This keeps the nervous system able to process what's happening rather than getting overwhelmed by it.",
          "why": "The foundational, stabilizing tool for this mechanism - a way to stay present and safe in the moment a reaction shows up, before any other work can happen."
        },
        {
          "code": "A2",
          "approach": "Narrative Therapy",
          "format": "B",
          "guardrail": true,
          "name": "Narrative Re-Authoring to Restore Agency",
          "source": "Michael White & David Epston",
          "what": "Building the story of who you are now, having gotten through something genuinely hard - not by retelling what happened, but by identifying real moments of your own strength, judgment, or care for yourself since then, and naming what you want the next part of your own story to include.",
          "how": "A difficult past experience often comes with a dominant story of being simply a victim of what happened, with no say in it. This tool doesn't deny that something hard and real occurred - it deliberately looks for, and builds on, the real evidence of your own agency since then, which is just as true and more workable to carry forward.",
          "why": "Important distinction, stated plainly: this is not the same as retelling the event in detail, which is a different kind of work best done with a professional (see the two reference techniques below). This tool works with your present-day story about yourself, not with the memory of the event itself."
        },
        {
          "code": "A3",
          "approach": "Trauma-Focused CBT",
          "format": "C",
          "name": "Trauma Narrative Construction & Cognitive Restructuring",
          "source": "Judith Cohen, Anthony Mannarino & Esther Deblinger's Trauma-Focused CBT",
          "what": "A structured, therapist-paced process of constructing a full, detailed account of the traumatic event - gradually, at a pace the person can tolerate - and directly working with the specific beliefs that formed around it (about safety, blame, or trust, for example), testing them against evidence the way any other belief would be tested.",
          "how": "Unlike this module's narrative re-authoring tool, which deliberately avoids the event's details, this works directly with the full memory itself - which is exactly why it needs a trained therapist's pacing. Done well, it can meaningfully reduce the memory's ongoing power without retraumatizing the person, but that safety depends entirely on careful, professional pacing.",
          "why": "Genuinely one of the most effective, well-established treatments for this pattern when it's frequent or disruptive - but deliberately constructing and repeatedly working with the full memory isn't something to attempt alone from an app.",
          "professionalNote": "A therapist trained in Trauma-Focused CBT (often listed as TF-CBT) can build and pace this work safely, including deciding when someone is ready for it at all. If the pattern from this module is frequent, or is costing real function - sleep, work, relationships - this is specifically worth raising with a professional; it's a well-established, effective treatment, not a last resort."
        },
        {
          "code": "A4",
          "approach": "EMDR",
          "format": "C",
          "name": "EMDR (Eye Movement Desensitization & Reprocessing)",
          "source": "Francine Shapiro's eight-phase EMDR protocol",
          "what": "An eight-phase, therapist-led protocol that uses bilateral stimulation - commonly guided eye movements, though taps or sounds are also used - while the person briefly holds the traumatic memory in mind, to help the brain process and file the memory in a way that reduces its ongoing emotional intensity.",
          "how": "The exact mechanism is still debated, but EMDR has strong evidence behind it for this pattern. The eight phases include careful preparation and stabilization work before the memory itself is ever directly engaged with, and require a trained specialist to administer safely and in the right order.",
          "why": "A genuinely well-evidenced treatment, distinct in method from Trauma-Focused CBT, and often considered when someone hasn't responded as well to talk-based approaches - but, like TF-CBT, this requires a trained specialist and cannot be safely approximated through self-guided exercises.",
          "professionalNote": "Look for a therapist specifically trained and certified in EMDR - it's a distinct protocol from general trauma therapy and needs that specific training. Many licensed trauma therapists in India now offer it; a professional can help assess whether it, or TF-CBT, or another approach fits your situation best."
        }
      ]
    }
  ],
  "scenarioSource": "Pan-India, English-medium context (per product decision). The recurring example used throughout this module is a serious road accident, chosen deliberately as a common, well-documented trigger for this pattern that does not require depicting violence or graphic detail. Per the content-design principle stated above, no touch in this module asks the user to describe what happened to them, and none of the scenario writing below depicts a traumatic event directly - only its present-day effects.",
  "escalation": {
    "tier1": "Any statement connecting the trauma response, or the accident/event itself, to intent or a plan to end one's life or self-harm (\"I can't take this anymore, I want it to just stop for good\", \"I have a way to end it\").",
    "tier2": "Persistent, unresolving flashbacks or dissociation that the person describes as ongoing right now (not a single past episode being recounted), real functional collapse specifically tied to the trauma response (unable to leave home, unable to work, for an extended stretch), or hopelessness extending beyond the immediate reaction into a broader sense that safety or normal functioning will never be possible again.",
    "traumaClassifierNote": "HIGHEST PRIORITY of any module built so far. Every other module's classifier note has addressed content that could be mistaken for risk language while actually being the module working as intended. This module is different in a more serious way: genuine acute distress - a real flashback, real dissociation, a real panic response - is a plausible, not just hypothetical, reaction to this content, because the content is specifically about the person's own trauma responses. The classifier needs to distinguish three genuinely different things: (a) describing symptoms as part of the recognition exercise itself, which is literally what Week 1 asks for and should classify as NONE (\"I flinch at loud sounds\", \"I've been avoiding the highway\", \"my heart races when I hear tires screech\"); (b) real, escalating distress during one of the two guided technique touches, which the guardrail mechanic's own distress check-in is specifically designed to catch, separately from this classifier; and (c) genuine crisis or intent language (TIER1), or real, current, ongoing dissociation/functional collapse/hopelessness (TIER2), as opposed to accurately describing a difficult but time-limited past reaction. One additional signal worth building in: since this module deliberately never asks the user to describe the specifics of what happened, a user volunteering graphic detail of the event itself, unprompted, may itself warrant a lower escalation threshold or a gentler redirect toward the professional-support resources - not because describing it is inherently dangerous, but because it suggests the module's current scope (present-day patterns only) may not be sufficient for what this person actually needs right now."
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
    "eyebrow": "What this module does, and doesn't, ask of you",
    "title": "We will never ask you to describe what happened",
    "body": [
      "This is important, so we're stating it plainly: nothing in this module asks you to describe the details of a difficult past experience. Every question is about how it shows up for you now - reactions, avoidance, patterns in the present - never a retelling of the event itself.",
      "That kind of detailed narrative work is real and can genuinely help, but it needs to happen with a licensed professional, not through an app. This module will point you clearly toward that option if it's relevant, rather than attempting it here.",
      "This module is shorter than others for exactly this reason - two weeks, not several. It's scoped narrowly: recognizing the pattern, two grounding-focused tools, and clear guidance on what comes next. It isn't a substitute for trauma-focused therapy, and it doesn't try to be."
    ],
    "cta": "Continue",
    "crisisButton": true
  },
  {
    "eyebrow": "What this is - and isn't",
    "title": "Between-session support, not a replacement",
    "body": [
      "This module is designed to sit between therapy sessions, or to be useful on its own - either way, it isn't therapy, and it doesn't diagnose you with anything.",
      "Both techniques ahead ask you to engage with something real, so they ship with a built-in choice of intensity and a check-in, on purpose.",
      "If you're in crisis right now, don't wait for this module to help. Reach out immediately - the button below is always here if you need it."
    ],
    "cta": "Continue",
    "crisisButton": true
  },
  {
    "eyebrow": "What to expect",
    "title": "The next 2 weeks",
    "body": [
      "Week 1 is entirely about recognizing the pattern - how a difficult past experience can show up today, in ways that might not feel obviously connected to it at first. No tools yet.",
      "Week 2 brings two tools: a grounding technique for staying steady when a reaction fires, and a narrative technique focused on your own strength and agency since then - not on retelling what happened. The week also clearly explains two further techniques that are genuinely effective, but need a licensed professional to deliver safely.",
      "Honestly: this module won't resolve a difficult past experience on its own - nothing delivered through an app safely can. What it can realistically offer is a clearer sense of your own pattern, two steadying tools, and a clear, honest picture of what further support looks like and when it's worth seeking. That's the actual promise here, not more than that."
    ],
    "cta": "Continue"
  },
  {
    "eyebrow": "Theory grounding",
    "title": "The tools ahead, and the ones that need a professional",
    "body": [
      "Two tools are delivered directly in this module: a body-based grounding technique, and a narrative technique focused on your own agency going forward, not on the event itself.",
      "Two further techniques are real and genuinely effective for this pattern, but are explained rather than delivered as an exercise here - they need a licensed professional's pacing and support to do safely. You'll see exactly what they are, and why, in Week 2."
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
        "title": "Recognition - the parking lot",
        "role": "Recognition #1",
        "noDelayed": true,
        "relate": {
          "text": [
            "Quick note before we start: this week isn't about any tools yet - none show up. First, this is about being able to recognise the pattern clearly. The two tools come next week.",
            "A quick reminder too: nothing in this module will ask you to describe what happened to you. Everything below is about how a difficult past experience can show up today - reactions, avoidance, patterns - not about retelling the event itself.",
            "Here's what that can look like. A few years ago, <b class='who'>Devesh</b> was in a serious road accident. Today, in a parking lot, a car nearby brakes suddenly with a loud screech. Nothing dangerous is actually happening around him right now - but his heart races, his chest tightens, and he needs a full minute standing still before he feels able to keep walking."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "Which of these actually explains what's happening? More than one will sound reasonable.",
          "options": [
            {
              "label": "His nervous system is reacting as if the original danger is happening again right now, even though nothing dangerous is actually present in the parking lot",
              "isTarget": true,
              "explain": "Right - this is the core of the pattern: a real, protective response, triggered by a cue that resembles the original threat, firing even when there's no current danger."
            },
            {
              "label": "He's overreacting to a loud noise that would startle most people a little",
              "isTarget": false,
              "explain": "A loud screech startles most people briefly, but notice the scale here is different - a full minute of racing heart and needing to stand still is a much stronger, more specific reaction, tied to something particular in his history."
            },
            {
              "label": "Something in the parking lot is actually unsafe, and he's picking up on it",
              "isTarget": false,
              "explain": "The scenario is explicit that nothing dangerous is actually happening - the reaction is about a resemblance to something in the past, not an accurate read on present danger."
            }
          ],
          "whyPrompt": "In a few words - what's the giveaway that this is about the past, not about present danger?"
        },
        "apply": {
          "scenario": "Same pattern, a different person: after a frightening experience on a train some years ago, Meher finds that a sudden, loud announcement over a station's speakers makes her heart race and her hands shake, even on a platform she knows is safe.",
          "prompt": "Same thing happening here. In two or three sentences: what would you actually say to Meher right now?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"What you're feeling right now is real, and it makes sense given what you've been through - your nervous system is responding to something that resembles the past, not to anything actually dangerous on this platform today.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of a real moment this applies to you, if one comes to mind - what's a cue that triggers a reaction bigger than the present moment calls for?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t2",
        "title": "Recognition - the longer route",
        "role": "Recognition #2",
        "delayedRef": "w1t1_apply",
        "delayedPrompt": "Last touch, on Meher, you wrote this:",
        "relate": {
          "text": [
            "Same Devesh, a different pattern. He's been taking a longer route to work for a while now, avoiding the highway where the accident happened. He tells himself, and others, that it's just more scenic - though if he's honest, that's not really the reason.",
            "Notice what's carried over: the reaction from the parking lot isn't a one-off. It's shaped an actual daily decision, quietly, in a way that costs him real time each day."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What's actually happening with the route? Read all three carefully.",
          "options": [
            {
              "label": "The avoidance is protecting him from a real trigger, but the reason he gives himself for it isn't the actual reason",
              "isTarget": true,
              "explain": "Right - the avoidance itself makes sense as a protective response, but notice the gap between the stated reason ('more scenic') and what's actually driving the choice."
            },
            {
              "label": "He genuinely just prefers the scenic route, unrelated to the accident",
              "isTarget": false,
              "explain": "He himself doesn't fully believe this reason when he's honest about it - the scenario points at the gap between the stated reason and the real one, which is worth noticing rather than taking at face value."
            },
            {
              "label": "He's simply bad at managing his time in the mornings",
              "isTarget": false,
              "explain": "This treats it as a scheduling issue, but the pattern described - a specific route avoided, a specific reason given that doesn't quite hold up - points to something more specific than general time management."
            }
          ],
          "whyPrompt": "In a few words - why does the stated reason not matching the real one matter here?"
        },
        "apply": {
          "scenario": "A different person, same shape of pattern: since a difficult experience in a crowded market a while back, Farhan has been avoiding crowded places generally, telling himself he just prefers quieter environments these days.",
          "prompt": "In two or three sentences: what's actually going on for Farhan, and what would you point out about the reason he's giving himself?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"Preferring quiet is a real preference for lots of people - but notice this one traces back to a specific experience and a specific kind of place, which is a different thing from a general preference.\""
        },
        "remember": {
          "prompt": "In a sentence or two: has a reaction like this ever quietly shaped a decision of yours, with a different stated reason than the real one?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t3",
        "title": "What the reaction is actually doing",
        "role": "Functional logic",
        "delayedRef": "w1t2_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Between the parking lot and the longer route, there's a pattern worth naming honestly: the reaction can feel like proof something is currently wrong with him - that he hasn't 'gotten over it', or that he's overreacting.",
            "What it's actually doing is different: it's a real, protective nervous-system response that made complete sense at the time of the original event, still firing now on cues that resemble that original threat - even though the actual danger has passed."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What is the reaction actually doing, functionally? These are close - think it through.",
          "options": [
            {
              "label": "A protective response that made sense at the time, still firing on cues that resemble the original threat, even though the danger itself is in the past",
              "isTarget": true,
              "explain": "That's the real mechanism - not a current judgment about the parking lot or the highway, but a nervous system still responding to something that resembles what happened before."
            },
            {
              "label": "Proof that he hasn't properly processed or gotten over the accident",
              "isTarget": false,
              "explain": "This treats an ongoing physiological pattern as a personal failure to 'move on', when what's described is a well-documented, common response that doesn't map neatly onto ideas like 'getting over it' on any fixed timeline."
            },
            {
              "label": "A sign that avoiding driving altogether would now be the safer choice",
              "isTarget": false,
              "explain": "This treats the reaction itself as accurate information about current danger, when the pattern being described is specifically about a response that doesn't match present-day risk."
            }
          ],
          "whyPrompt": "In a few words - why does separating 'past-appropriate response' from 'current judgment' matter here?"
        },
        "apply": {
          "scenario": "A friend, hearing Devesh describe the parking lot moment, says: \"That's not you overreacting or failing to move on. That's your body still protecting you from something that isn't actually happening right now.\"",
          "prompt": "In two or three sentences: think of a moment you, or someone you know, judged a reaction like this as a personal failing - what would it look like to see it the way the friend just did instead?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the pattern to notice is whether the reaction gets read as a current judgment about danger, or recognised as a protective response still firing from the past."
        },
        "remember": {
          "prompt": "In a sentence or two: what does the moment right before a reaction like this usually feel like, if you have one you're willing to name?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t4",
        "title": "What a different response can look like",
        "role": "Contrast / boundary case",
        "delayedRef": "w1t3_apply",
        "delayedPrompt": "Last touch, you named this:",
        "relate": {
          "text": [
            "Here's what a similar reaction can look like for someone with a different response to it.",
            "<b class='who'>Ayaan</b> went through a difficult accident of his own a while back, and still has real physical reactions to reminders of it - a screeching brake still makes his heart jump too. He hasn't 'gotten over it' in some clean, finished way; the reaction is still real.",
            "What's different is that he's built a quick way to bring himself back to the present moment when it fires - naming a few things he can currently see, feeling his feet on the ground - rather than needing to avoid the reminder altogether the way Devesh currently does with the highway.",
            "This is the module's contrast case for this pattern: a real, ongoing reaction, honestly acknowledged - not the absence of a trigger response, but a way to move through it that doesn't require rerouting a whole day."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What actually makes Ayaan's situation different from Devesh's? All three can look similar in the moment.",
          "options": [
            {
              "label": "He has the same kind of reaction, but a quick way to bring himself back to the present moment, rather than needing to avoid the trigger to feel okay",
              "isTarget": true,
              "explain": "That's the real difference - not that his reaction is smaller or resolved, which it isn't, but that he has a way through it that doesn't depend on avoidance."
            },
            {
              "label": "His accident was probably less serious than Devesh's",
              "isTarget": false,
              "explain": "There's no basis for that comparison in the scenario, and the reaction described - heart jumping at a screeching brake - sounds genuinely comparable. The difference is in what happens after the reaction starts, not its size."
            },
            {
              "label": "He's simply a calmer person under stress in general",
              "isTarget": false,
              "explain": "Nothing in the scenario supports a fixed-trait explanation - what's described is a specific, learnable skill (bringing himself back to the present), not an innate quality."
            }
          ],
          "whyPrompt": "In a few words - how would having a quick way back to the present change what happens after a reaction fires?"
        },
        "apply": {
          "scenario": "A colleague asks Ayaan how he still manages to drive after everything. He says: \"The reaction still happens - my heart still jumps. I just have something I do right after, to come back to right now, instead of needing to get away from wherever I am.\"",
          "prompt": "In two or three sentences: think of a reaction you (or someone you know) currently manages mostly by avoiding its trigger - what would 'a quick way back to the present', the way Ayaan describes it, actually look like there?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the useful pattern is noticing whether there's currently a way through the reaction, or whether avoidance is currently doing all the work."
        },
        "remember": {
          "prompt": "In a sentence or two: does the idea of 'a quick way back to the present' feel like something new, or something you've already tried in some form?",
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
            "One more, and then a small piece of what actually happened to Devesh.",
            "One day, a delayed flight left him no real choice but to drive the highway route. It was hard - his heart raced most of the way, his hands stayed tight on the wheel - but he made it, and once he arrived and had been safe for a while, the intensity of the reaction eased on its own.",
            "That's not a coincidence, and it previews what's ahead next week: the reaction is real and can be genuinely intense in the moment, but it isn't indefinite - it tends to ease once the nervous system registers that the person is actually safe. Next week's two tools work with exactly that: staying steady enough to let that easing happen, and building a fuller sense of your own strength in getting through moments like this."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does the reaction easing, once he was safely at his destination, tell us about it?",
          "options": [
            {
              "label": "The reaction was real and intense but time-limited, easing once his nervous system registered that he was actually safe, rather than lasting indefinitely",
              "isTarget": true,
              "explain": "Right - this is a genuinely important pattern: the reaction doesn't stay at full intensity forever. It's real, and it eases, both at once."
            },
            {
              "label": "He just got lucky that nothing went wrong on that particular drive",
              "isTarget": false,
              "explain": "This keeps the original fear centered on present-day danger, when what actually happened was a real but time-limited physiological reaction that eased on its own once he was safe - not a matter of luck avoiding an actual threat."
            },
            {
              "label": "Avoiding the highway would still have been the smarter choice that day",
              "isTarget": false,
              "explain": "This treats the reaction itself as accurate danger information, when what the moment actually demonstrated was that he could get through a real, intense reaction and arrive safely - which is different from the highway itself being unsafe."
            }
          ],
          "whyPrompt": "In a few words - why does knowing the reaction eases change what a moment like this feels like to be in?"
        },
        "apply": {
          "scenario": "A different person, same shape of moment: Priya, years after a frightening experience in a lift, had to take one during a fire drill at work - the anxiety was real and intense throughout, and eased over the following hour once she was safely back at her desk.",
          "prompt": "In two or three sentences: what does that easing, over the following hour, tell Priya about the reaction she went through?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"The reaction was real and genuinely hard to sit with - and it also wasn't permanent. It eased once her body registered she was actually safe, the way this kind of reaction tends to.\""
        },
        "remember": {
          "prompt": "In a sentence or two: if you have a reaction like this of your own, has it ever eased the way Devesh's or Priya's did? What did that look like?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: recognising how a difficult past experience can show up today - not as a memory being recalled, but as a real, protective reaction firing on cues that resemble the original threat, even when there's no current danger. The reaction is genuinely intense and also genuinely time-limited. Next week: two tools, and a clear picture of what further support looks like."
  },
  {
    "num": 2,
    "title": "Two tools, and what comes next",
    "mechanism": "A",
    "kind": "technique",
    "retrievalCheck": null,
    "hasReferenceCard": true,
    "touches": [
      {
        "id": "w2t1",
        "title": "Titrated Grounding & Body-Based Regulation",
        "role": "Technique A1 - Somatic Experiencing (Levine); window of tolerance (Siegel) - guided",
        "guardrail": true,
        "delayedRef": "w1t5_apply",
        "delayedPrompt": "Last week, your answer was:",
        "relate": {
          "text": [
            "This is the first of the two tools for this pattern: <b>titrated grounding and body-based regulation</b>.",
            "Remember Devesh, needing a full minute to compose himself in the parking lot? This tool is for exactly that moment - small, paced grounding techniques, practiced specifically to stay within a manageable range when a reaction fires, rather than getting fully overwhelmed by it. 'Titrated' means deliberately small and paced: naming a few things you can currently see, feeling your feet on the floor, one slow breath at a time - not confronting the full intensity all at once.",
            "Because this asks you to actually practice this, live, right now, this touch checks in with you directly partway through."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might staying within a manageable range, rather than pushing through a reaction at full intensity, actually help more?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Find a moment where you can try this now, even without a reaction currently present, just to get familiar with it.",
          "intensityPrompt": "First, choose how long a version of this you want to try:",
          "intensityOptions": [
            "Shorter version - name 3 things you can see and 1 thing you can feel",
            "Longer version - the full grounding sequence, taking your time"
          ],
          "prompt": "In two or three sentences: describe what you actually noticed while doing this - in your body, or in how present the moment felt.",
          "placeholder": "Your answer..."
        },
        "distressPrompt": "You've just practiced a grounding technique for a real reaction pattern. Before we continue - how are you feeling right now?",
        "reveal": {
          "text": "There's no single model answer here - the tell is whether you noticed something real, even small, not whether the exercise itself felt dramatic."
        },
        "remember": {
          "prompt": "In a sentence or two: is this something you could realistically reach for in a real moment, the way Devesh might have in the parking lot?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t2",
        "title": "Narrative Re-Authoring to Restore Agency",
        "role": "Technique A2 - Narrative Therapy (White & Epston) - guided",
        "guardrail": true,
        "delayedRef": "w2t1_apply",
        "delayedPrompt": "Last touch, you noticed:",
        "relate": {
          "text": [
            "The second tool: <b>narrative re-authoring</b>. Worth restating clearly: this is not about retelling what happened. This tool works with the story you tell about who you are now, having gotten through something genuinely hard.",
            "A difficult past experience often comes with a dominant story of simply being something that happened to you, with no say in it. This tool doesn't deny that something hard and real occurred - it deliberately looks for real evidence of your own agency since then: a moment you made a careful decision, protected yourself or someone else, or handled something hard with more steadiness than you expected of yourself. And it asks what you want the next part of that story to include.",
            "Because this asks you to engage with something real about your own experience, this touch checks in with you directly partway through."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might focusing on evidence of your own agency, rather than on the event itself, be a meaningfully different kind of work?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think about the time since whatever difficult experience is relevant to you, if one is - this can be recent or from years ago.",
          "intensityPrompt": "First, choose how far you want to go with this right now:",
          "intensityOptions": [
            "Smaller version - just name one moment of your own agency, briefly",
            "Bigger version - name it and reflect on what you want the next part of your story to include"
          ],
          "prompt": "In two or three sentences: name one real moment, however small, where you showed up for yourself since then - and, if you chose the bigger version, what you want the next part of your story to include.",
          "placeholder": "The moment: ... / (If bigger version) What I want next: ..."
        },
        "distressPrompt": "You've just reflected on something real and personal. Before we continue - how are you feeling right now?",
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the moment named is genuinely specific and real to you, not a generic 'I survived it' statement."
        },
        "remember": {
          "prompt": "In a sentence or two: was that moment easy or hard to find? What does that tell you?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t3",
        "title": "Knowing when this needs more than the app",
        "role": "Orientation - the two reference tools",
        "delayedRef": "w2t2_apply",
        "delayedPrompt": "Last touch, you named:",
        "relate": {
          "text": [
            "No new practicable technique this touch. Instead, something worth knowing clearly: two more real, well-established techniques exist for this pattern, and for the deeper work of actually processing what happened - but they're built to be delivered by a licensed professional, not through an app.",
            "<b>Trauma-focused cognitive restructuring</b> involves constructing a full, detailed account of the event with a therapist's support, and directly working with the beliefs that formed around it - a structured, paced process that needs real clinical support to do safely. <b>EMDR</b> (Eye Movement Desensitization and Reprocessing) is an eight-phase protocol using bilateral stimulation (like guided eye movements) to help the brain process a traumatic memory - also something that requires a trained specialist to administer.",
            "Both involve working directly with the memory of what happened, which is exactly the kind of work this module has deliberately not attempted. That's exactly why they're shown as reference cards rather than touches: genuinely effective, well-established treatments, not something to attempt alone."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might working directly with a traumatic memory need a professional's pacing and support, in a way that recognising present-day patterns doesn't?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think honestly about your own experience, if this pattern applies to you - how often the reaction shows up, and how much it's currently costing you in avoidance, sleep, or day-to-day function.",
          "prompt": "In two or three sentences: does what you've described to yourself this week sound like something worth raising with a professional - even just to ask?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single right answer here - the honest point of this touch is simply naming, clearly, that trauma-focused therapy and EMDR are genuinely effective, well-established treatments worth pursuing if this pattern is frequent or costly, not a last resort, and not something this module can walk you through on its own."
        },
        "remember": {
          "prompt": "In a sentence or two: is this something you'd consider actually raising with a professional - and if not now, what would change that?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t4",
        "title": "How did it go",
        "role": "Check-in",
        "delayedRef": "w2t3_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "No new idea this touch - just a real check-in on the two tools from this week, the same two that started with Devesh's parking lot moment back in Week 1."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Which of the two did you actually try this week, if either - and what happened?",
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
            "This is the last touch in this module, so it's worth being direct about where that leaves things.",
            "You've spent two weeks recognising a real pattern, practiced a grounding technique for the moments it fires, and done some real work naming your own agency since a difficult experience. That's genuinely worthwhile, and it's also, honestly, not the same as fully processing what happened - that deeper work, if it's something you want, is exactly what the two professional-support techniques from the last touch are for.",
            "Whatever you decide to do next, the pattern you've learned to recognise this week, and the grounding tool from Week 2, are yours to keep using regardless."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Looking back over the two weeks: what's one thing you understand about your own pattern now that you didn't as clearly two weeks ago?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think about the two tools from this week, and the two professional-support techniques from the last touch.",
          "prompt": "In two or three sentences: write a plan for yourself - not a test, just something honest for you to come back to. What would you actually like to do next, whether that's using the grounding tool, considering professional support, or both?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single right answer here, and this isn't being checked against anything - whatever you've written is yours to revisit whenever it's useful."
        },
        "remember": {
          "prompt": "In a sentence or two: is there anything from these two weeks you want to hold onto, in your own words?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": null
  }
],
  reinforcementBank: [
  {
    "code": "A2",
    "rep": 1,
    "type": "reflection",
    "scenario": "A small, recent moment - it doesn't need to connect to anything difficult from your past - where you handled something with a bit of care or steadiness for yourself.",
    "prompt": "In two or three sentences: name that one moment, and what it shows about how you're doing today. Nothing more than that - just the one moment.",
    "reveal": "There's no single model answer here - the tell is whether the moment named is real and specific, not a generic 'I'm doing okay.' This is a lighter version of Week 2's exercise on purpose: one small moment, not the fuller story."
  },
  {
    "code": "A2",
    "rep": 2,
    "type": "reflection",
    "scenario": "A moment recently where you made a choice that was genuinely yours - even a small one, even something ordinary.",
    "prompt": "In two or three sentences: name that choice, and what it says about the person making it.",
    "reveal": "There's no single model answer here - the tell is specificity, not scale. A small, real choice counts just as much as a large one."
  }
],
  toolsData: {
  "grounding_log": {
    "code": "A1",
    "title": "Titrated Grounding",
    "mechShort": "Trauma",
    "kind": "log_single",
    "intro": "The same paced grounding technique from Week 2 - naming what you can currently see, hear, and feel, or feeling your feet on the floor - for whenever a reaction actually fires. This one's here because it's meant to become something you reach for on your own, not just something practiced once with guidance. Log it each time you actually use it.",
    "logLabel": "What triggered it, and what did you do?",
    "firstPlaceholder": "e.g. A loud screech outside my window - named 3 things I could see, heart rate came down within a minute or two",
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
    tier1: "Any statement connecting the trauma response, or the accident/event itself, to intent or a plan to end one's life or self-harm (\"I can't take this anymore, I want it to just stop for good\", \"I have a way to end it\").",
    tier2: "Persistent, unresolving flashbacks or dissociation that the person describes as ongoing right now (not a single past episode being recounted), real functional collapse specifically tied to the trauma response (unable to leave home, unable to work, for an extended stretch), or hopelessness extending beyond the immediate reaction into a broader sense that safety or normal functioning will never be possible again.",
    traumaClassifierNote: "HIGHEST PRIORITY of any module built so far. Every other module's classifier note has addressed content that could be mistaken for risk language while actually being the module working as intended. This module is different in a more serious way: genuine acute distress - a real flashback, real dissociation, a real panic response - is a plausible, not just hypothetical, reaction to this content, because the content is specifically about the person's own trauma responses. The classifier needs to distinguish three genuinely different things: (a) describing symptoms as part of the recognition exercise itself, which is literally what Week 1 asks for and should classify as NONE (\"I flinch at loud sounds\", \"I've been avoiding the highway\", \"my heart races when I hear tires screech\"); (b) real, escalating distress during one of the two guided technique touches, which the guardrail mechanic's own distress check-in is specifically designed to catch, separately from this classifier; and (c) genuine crisis or intent language (TIER1), or real, current, ongoing dissociation/functional collapse/hopelessness (TIER2), as opposed to accurately describing a difficult but time-limited past reaction. One additional signal worth building in: since this module deliberately never asks the user to describe the specifics of what happened, a user volunteering graphic detail of the event itself, unprompted, may itself warrant a lower escalation threshold or a gentler redirect toward the professional-support resources - not because describing it is inherently dangerous, but because it suggests the module's current scope (present-day patterns only) may not be sufficient for what this person actually needs right now.",
    systemPrompt: "You are a safety classifier inside a mental-health support app used in India. Classify the user's message into exactly one of: NONE, TIER1, TIER2.\n\nTIER1 definition: Any statement connecting the trauma response, or the accident/event itself, to intent or a plan to end one's life or self-harm (\"I can't take this anymore, I want it to just stop for good\", \"I have a way to end it\").\nTIER2 definition: Persistent, unresolving flashbacks or dissociation that the person describes as ongoing right now (not a single past episode being recounted), real functional collapse specifically tied to the trauma response (unable to leave home, unable to work, for an extended stretch), or hopelessness extending beyond the immediate reaction into a broader sense that safety or normal functioning will never be possible again.\n\nCritical context 1: many people, especially in Indian English, use hyperbolic or idiomatic self-deprecating language that is NOT a genuine risk signal - for example \"I could kill myself for forgetting that\", \"this deadline is literally killing me\". Do NOT classify ordinary hyperbole, jokes, or figures of speech as TIER1 or TIER2, even if they contain words like \"kill\", \"die\", or \"worthless\".\n\nCritical context 2 (specific to this module, read carefully): this module is about recognizing present-day trauma-response patterns - physical reactions, avoidance, hypervigilance - following a difficult past experience. Describing these symptoms accurately, even in vivid or distressing terms, is the module working exactly as intended and should be classified as NONE: for example \"I flinch and my heart races at loud sounds\", \"I've been avoiding driving on the highway for years\", \"I still see it happen in my mind sometimes when something reminds me of it\". A single past episode of dissociation or a flashback, described as something that happened and passed, is also NONE. Only escalate to TIER2 if the person describes this as CURRENTLY, ONGOINGLY happening right now in a way that isn't resolving, or describes real, extended functional collapse specifically because of it (unable to leave home or work for an extended period). Only escalate to TIER1 if there is genuine expressed intent, desire, or a plan to end their life or harm themselves - not merely describing how difficult or frightening the trauma response itself is.\n\nOne more thing to watch for, specific to this module: it deliberately never asks the user to describe the specific details of what happened to them, only how it shows up today. If a user's message goes well beyond that scope and includes graphic detail of the traumatic event itself, this does not automatically mean TIER1 or TIER2, but it is worth noting in your reason field, since it suggests the person may need more support than this module's current scope is designed to provide.\n\nOnly classify as TIER1 if there is a genuine indication of intent, a plan, or serious risk to the person's life or safety. Only classify as TIER2 if there is genuine, current, ongoing dissociation or functional collapse, or hopelessness extending beyond the immediate trauma response into life broadly - not an accurate description of a real but time-limited past reaction, which is exactly what this module asks users to describe.\n\nWhen genuinely uncertain between accurate symptom description and a real signal, prefer the lower tier (or NONE) rather than over-triggering - but never downgrade language that includes a specific plan, method, or timeframe.\n\nRespond with ONLY a raw JSON object, no markdown fences, no other text: {\"tier\": \"NONE\" | \"TIER1\" | \"TIER2\", \"reason\": \"one short clause\"}",
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
    "area": "Clinical - do not proceed to any real testing without this",
    "text": "This module should not be shown to any real user, even in early testing, without a clinician directly involved in reviewing the actual content first - not just a sign-off after the fact, the way other modules' open items are framed. The content type itself (trauma response recognition, plus two guided techniques that ask the user to actively engage with grounding and their own narrative) carries meaningfully higher risk than any other module built so far, and that difference should be reflected in the review process, not just noted in this list."
  },
  {
    "area": "Clinical",
    "text": "Both technique mappings (A1, A2) and both reference-only technique framings (see below) are my synthesis of the taxonomy's named sources - not clinician-reviewed."
  },
  {
    "area": "Clinical",
    "text": "Tier 1/2 escalation definitions for this module are a first draft, awaiting sign-off - and given BRIEF.escalation.traumaClassifierNote above, this module's classifier calibration is the single highest-priority item across all six modules built so far, not a routine item."
  },
  {
    "area": "Structural note - first mechanism_count=1 module",
    "text": "With only one mechanism, the standard formula ((2 x mechanism_count) + 1, integration only if 2+ mechanisms) produces a 2-week module with no integration week - Week 1 understanding, Week 2 technique, nothing after. Two further decisions were made beyond what the formula outputs, both deliberate rather than automatic: (1) no retrieval check anywhere in this module, since there's no multi-week gap for anything to test recall across - Week 2 follows directly from Week 1 the very next week; (2) no unscaffolded transfer test at the end, which is a genuine deviation from every other module built so far. Ending trauma content on a fully open 'apply this to your own worst experience, nothing pre-walked' prompt was judged inappropriate for this content specifically, regardless of the standard pattern - the module instead closes on a scaffolded, professional-support-oriented note (see w2t5). Recommend the template explicitly document mechanism_count=1 as its own case, including this reasoning, rather than leaving it to be re-derived (or worse, applied mechanically without the same judgment) the next time it comes up."
  },
  {
    "area": "Structural note - first T=2-with-bridge-touch confirmation",
    "text": "Same resolution as Module 3's Intrusive Thoughts mechanism (T=2, practicable techniques equal to reference-only techniques in count): 2 technique touches, a bridge/orientation touch introducing both [C] techniques, and separate check-in and pre-commitment touches = 5. Second confirmation of this pattern, now across two different modules - worth treating as validated, not a one-off."
  },
  {
    "area": "Structural note - new [B]-graduates-to-bank exceptions, in both tabs",
    "text": "Both practicable techniques are [B] guardrailed, which would exclude both from the bank entirely under the standard rule used in every prior module. Two deliberate, narrow exceptions were made instead. Tools gets titrated grounding (A1) at essentially its full form, because its guardrail is about encountering the technique live for the first time, not about the technique itself being risky to repeat - grounding is a stabilization skill whose entire purpose is safe, independent, repeated use once learned. Reflections gets narrative re-authoring (A2), but only in a deliberately narrower form than Week 2's guided touch - a single small moment of steadiness or agency, never referencing the difficult experience directly, with no 'what do you want your story to include' depth. That narrower scope is what makes it reasonable to include without any guardrail cycle at all. Neither exception reverses the underlying caution: the fuller, deeper version of each technique stays guided-only in Week 2. Recommend the template document this as a general pattern: [B] techniques can have a lighter, narrower version placed in the bank, distinct from a blanket in-or-out decision, when the lighter version is genuinely scoped down rather than just the same exercise minus its guardrail. Separately, building this module also surfaced and fixed a real pre-existing bug: renderReflectionsTab/renderToolsTab had no empty-state handling at all, and a hardcoded lede sentence naming two specific techniques from an earlier module that had been silently wrong in every module built since - fixed here and backported to Modules 3, 4, and 5 (this module ended up not needing the empty-state path once the two bank exceptions above were added, but the underlying fix is real and applies regardless)."
  },
  {
    "area": "Content decision, highest weight in this module",
    "text": "The recurring example (a road accident) was chosen specifically to be common, clinically well-documented, and not require depicting violence, assault, or other graphic content. No touch in this module - including the narrative re-authoring technique - asks the user to describe what happened to them; every prompt asks only about present-day patterns, physical reactions, or (in the re-authoring touch) moments of resilience since. This is a deliberate, load-bearing content-design decision, not an incidental style choice, and should be explicitly confirmed (not just tacitly approved) by clinical review before launch."
  },
  {
    "area": "Product question, not resolved here",
    "text": "The standard guardrail distress check-in (three options: fine / a bit shaken / really not okay, escalating only on the worst answer) is reused unchanged from every prior module. Given this module's content, it's worth a deliberate product decision on whether that threshold and wording is actually appropriate here, or whether trauma-specific touches warrant either a lower bar for surfacing crisis resources, additional support shown regardless of which option is picked, or different wording entirely. Not changed in this build, since engine behavior has been kept identical across all modules to date - but flagging this explicitly as a real, unresolved question rather than assuming the generic mechanic is automatically sufficient here."
  },
  {
    "area": "Resolved",
    "text": "Crisis helpline numbers reused from Modules 1-5 (KIRAN, TeleMANAS, Vandrevala Foundation) - national, not module-specific."
  },
  {
    "area": "Resolved",
    "text": "Escalation UX (persistent crisis banner regardless of tier, server-side logging of all classification events including NONE, Tier 1 relying on the always-visible banner rather than an additional interrupt, Tier 2 frequency-based interrupt threshold deferred pending real usage data) follows the shared decisions documented in Module 3's dev guide, section 5 - not re-derived here. Worth reconsidering, though, whether this module's Tier 1 should rely solely on the passive banner the way other modules do, given the classifier note above; see the product question entry above."
  },
  {
    "area": "Not yet started",
    "text": "Same as prior modules: accessibility target, analytics schema, and a full copy/editorial pass have not been done for this module either."
  },
  {
    "area": "Standing reminder, with more weight than usual",
    "text": "Nothing in this module has been clinically reviewed and nothing has been tested with a real user. This is true of every module built so far, but here it matters more: the cost of getting the escalation calibration, the guardrail thresholds, or the content boundaries wrong is meaningfully higher than in any other module in this set. Please treat this module's first-draft status as a stronger caution than the same sentence in Modules 1 through 5."
  }
]
};
