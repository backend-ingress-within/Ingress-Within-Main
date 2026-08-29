import { ModuleContent } from '../../../types/moduleContent';

function opt(label: string, isTarget: boolean, explain: string) {
  return { label, isTarget, explain };
}

export const MODULE_7_CONTENT: ModuleContent = {
  moduleId: 'M7',
  slug: 'emotional-suppression-masculinity-norms',
  name: "Emotional Suppression & Masculinity Norms",
  duration_weeks: 2,
  tier: "Common - 499 rupees - Self domain",
  brief: {
  "moduleName": "Emotional Suppression & Masculinity Norms",
  "tier": "Common - 499 rupees - Self domain",
  "mechanisms": [
    {
      "key": "A",
      "name": "Emotional Suppression & Masculinity Norms",
      "short": "Suppression",
      "def": "A pattern of habitually suppressing, minimizing, or not fully identifying emotional experience, often shaped by internalized scripts about what men should or shouldn't feel or show. This tends to reduce accurate emotional self-awareness over time, and rests on a largely untested belief that showing emotion carries real social costs.",
      "need": "Authenticity, connection, permission to feel",
      "contrast": {
        "who": "Vikrant",
        "text": "tells a close friend directly that a rough week at work has genuinely gotten to him, rather than deflecting with 'I'm fine' the way he used to. He finds the conversation doesn't cost him anything socially - if anything, his friend opens up more too."
      },
      "techniques": [
        {
          "code": "A1",
          "approach": "Emotion Theory",
          "format": "A",
          "name": "Emotion-Identification Exercises Using a Feelings Wheel",
          "source": "Robert Plutchik's emotion model",
          "what": "Using a structured feelings wheel - a visual map of emotions from broad categories (like 'sad' or 'angry') down to more specific, precise ones ('discouraged', 'resentful') - to name what's actually being felt in a given moment, rather than defaulting to vague or minimized labels like 'fine' or 'stressed.'",
          "how": "Suppression often isn't a deliberate choice moment to moment - it's frequently a skill gap: not having practiced naming emotions precisely enough to work with them. The wheel gives a concrete way to build that precision, rather than asking someone to simply 'be more in touch with their feelings' in the abstract.",
          "why": "The foundational tool for this mechanism - accurate identification has to come before anything else here can really work."
        },
        {
          "code": "A2",
          "approach": "CBT (behavioural experiments)",
          "format": "B",
          "guardrail": true,
          "name": "Behavioural Experiments Testing Predicted Social Costs of Expressing Emotion",
          "source": "Beck-style CBT",
          "what": "Naming the specific social cost predicted from actually expressing an emotion - 'he'll think less of me', 'she'll see me as weak' - and then deliberately testing it: expressing something genuine in a real, chosen moment, and comparing what actually happens to the prediction.",
          "how": "The belief that expressing emotion costs something socially is rarely actually tested - it's usually inherited from early messaging and just assumed true ever since. A real, deliberate test gives evidence a untested belief doesn't have.",
          "why": "Because this asks you to actually do something real and potentially uncomfortable, not just reflect on it, it ships with the same guardrails as any [B] technique: a choice of intensity, and a check-in afterward."
        },
        {
          "code": "A3",
          "approach": "ACT",
          "format": "A",
          "name": "Acceptance of Vulnerability as Values-Consistent Action",
          "source": "Steven Hayes, ACT",
          "what": "Reframing showing vulnerability not as a weakness to be managed, but as an action that's actually consistent with values many people hold - honesty, closeness, being genuinely known by the people who matter to them - and choosing to act on those values even when the old suppression habit pulls the other way.",
          "how": "Suppression often frames vulnerability purely as risk. This tool doesn't argue that vulnerability has no risk - it reframes what showing it is actually in service of, which changes the choice from 'risk vs. safety' to 'which do I actually value more.'",
          "why": "Gives the behavioural experiments in A2 an actual reason behind them, beyond just testing a prediction - a value being acted on, not just a hypothesis being checked."
        },
        {
          "code": "A4",
          "approach": "Narrative Therapy",
          "format": "A",
          "name": "Externalising & Re-Authoring Conversations Questioning Internalized 'Toughness' Scripts",
          "source": "Michael White & David Epston, Narrative Therapy",
          "what": "Naming the internalized 'toughness' script as something separate from the person - not 'I don't show emotion' but 'the script is telling me that showing emotion makes me less of a man' - and then examining where that script actually came from, and whether it still serves the person the way it might once have seemed to.",
          "how": "A script absorbed early in life, often without ever being consciously chosen, can operate as if it were simply a fact about who someone is. Naming it as a script - something with an origin, and something that can be questioned - creates room to actually evaluate it rather than just live inside it.",
          "why": "Works at the level of the belief system underneath the suppression, rather than at the level of any single moment of feeling or not feeling something."
        }
      ]
    }
  ],
  "scenarioSource": "Pan-India, English-medium context (per product decision) - workplace settings, friendships, family relationships, common 'boys don't cry' or 'be strong' messaging patterns. Language is English-medium throughout; content has not yet been reviewed for phrasing that reads as metro-specific.",
  "escalation": {
    "tier1": "Any statement connecting emotional suppression, or the underlying toughness script, to intent or a plan to end one's life or self-harm (\"I can't take this anymore, I want it to just stop for good\", \"I have a way to end it\").",
    "tier2": "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary discomfort of naming and questioning a long-held pattern, which is what this module is specifically designed to invite.",
    "suppressionClassifierNote": "MODERATE PRIORITY, worth stating as a distinct consideration from prior modules' notes: this module's target pattern is specifically about minimizing and under-reporting emotional experience in one's own language. That means the usual assumption behind escalation classification - that real distress tends to show up as recognizably distressed language - may be less reliable here than in other modules. Someone deep in this pattern might describe something genuinely serious ('work's been rough, I'm managing') in language that reads as mild specifically because minimizing is the pattern itself, not because the underlying experience is actually mild. This doesn't mean escalating more aggressively - false positives carry real costs of their own, and most muted language is exactly what it sounds like. It means the module's own success (getting someone to name a feeling more precisely than usual, per A1's whole purpose) may, over the course of the module, surface a more accurate and sometimes more serious picture than the person's first few answers suggested - worth watching for a shift in tone or specificity across a user's answers within this module, not just any single message in isolation."
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
    "eyebrow": "What this is - and isn't",
    "title": "Between-session support, not a replacement",
    "body": [
      "This module is designed to sit between therapy sessions, or to be useful on its own - either way, it isn't therapy, and it doesn't diagnose you with anything.",
      "One technique in this module asks you to actually try expressing something real to someone, in a moment you choose - it ships with a built-in choice of intensity and a check-in, on purpose.",
      "If you're in crisis right now, don't wait for this module to help. Reach out immediately - the button below is always here if you need it."
    ],
    "cta": "Continue",
    "crisisButton": true
  },
  {
    "eyebrow": "Why this module",
    "title": "Why we're suggesting this one",
    "body": [
      "You told us you're dealing with a habit of pushing feelings down, minimizing what's actually going on, or holding onto an old, internalized sense that showing emotion isn't something you're supposed to do.",
      "This module is built for exactly that - one specific pattern, with four real, evidence-based tools behind it, not a generic 'open up more' message."
    ],
    "cta": "Continue"
  },
  {
    "eyebrow": "What to expect",
    "title": "The next 2 weeks",
    "body": [
      "Week 1 is entirely about recognizing the pattern - how suppression actually shows up, and what it costs, even when it feels protective. No tools yet.",
      "Week 2 brings all four tools, one at a time, matched to what you'll have just learned to recognise.",
      "Honestly: this won't undo years of internalized messaging in two weeks. What it can realistically offer is a clearer sense of the pattern, four specific tools, and a first real test of whether the social costs you've been assuming are actually true. That's the actual promise here, not more than that."
    ],
    "cta": "Continue"
  },
  {
    "eyebrow": "Theory grounding",
    "title": "The tools everything here is built on",
    "body": [
      "This pattern has more than one real, evidence-based approach behind it - so instead of blending them into one vague idea, each approach gets its own tool and its own touch.",
      "You won't use any of these in Week 1 - that week is just about being able to spot the pattern clearly, before any tool gets layered on top. Week 2 brings all four back, one at a time, matched to exactly what you'll have just learned to recognise. One technique below is marked differently - it asks you to do something live and real, so it ships with a choice of intensity and a check-in."
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
        "title": "Recognition - 'I'm fine'",
        "role": "Recognition #1",
        "noDelayed": true,
        "relate": {
          "text": [
            "Quick note before we start: this week isn't about any tools yet - none show up. First, this is about being able to recognise the pattern clearly. All four tools come next week.",
            "This week's pattern has a name: <b>emotional suppression</b>, often shaped by internalized 'toughness' scripts about what men should or shouldn't feel or show. In simple terms: habitually pushing down or minimizing what's actually being felt, often without fully realizing it's happening.",
            "Here's what that looks like. <b class='who'>Rohan</b> has had a genuinely rough week - a project fell through, and it's been sitting heavily on him. When a close friend asks how he's doing, he says \"I'm fine, just busy\" - the same thing he says most weeks, regardless of how the week actually went."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "Which of these actually explains what's happening? More than one will sound reasonable.",
          "options": [
            {
              "label": "\"I'm fine\" has become a default answer, given regardless of what's actually true, rather than a real read on how the week went",
              "isTarget": true,
              "explain": "Right - the tell isn't that he said 'fine' this one time, it's that it's the same answer regardless of the actual week, suggesting it's a habitual response rather than an honest one."
            },
            {
              "label": "He genuinely is fine, and the project falling through isn't actually bothering him",
              "isTarget": false,
              "explain": "The scenario is explicit that it's been sitting heavily on him - the gap here is between what's actually true and what gets said, not evidence that nothing is actually wrong."
            },
            {
              "label": "He doesn't want to burden his friend with his problems, which is considerate",
              "isTarget": false,
              "explain": "This is a common story suppression tells itself, and it might even feel true to Rohan - but notice it doesn't actually change what's happening: something real is being minimized, regardless of the reason given for it."
            }
          ],
          "whyPrompt": "In a few words - what's the giveaway that 'I'm fine' is a default, not an honest read?"
        },
        "apply": {
          "scenario": "Same pattern, a different person: when his sister asks if everything's okay after a visibly hard day, Karthik says \"yeah, all good\" on reflex, the same way he answers most days, good or bad.",
          "prompt": "Same thing happening here. In two or three sentences: what would you actually say to Karthik right now?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"'All good' sounds like it might be more of a default answer than an honest one today - it's worth noticing when that phrase comes out regardless of how the day actually went.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of a real moment this applies to you - what's your own version of the default 'I'm fine' answer?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t2",
        "title": "Recognition - the cost of not saying it",
        "role": "Recognition #2",
        "delayedRef": "w1t1_apply",
        "delayedPrompt": "Last touch, on Karthik, you wrote this:",
        "relate": {
          "text": [
            "Same Rohan, later that evening, alone. The weight of the week hasn't actually gone anywhere - if anything, having said 'fine' all day, he feels more isolated with it, not less, since no one around him actually knows what's going on.",
            "Notice what's carried over: suppressing the feeling didn't make it disappear. It just meant carrying it alone, with the people who might have actually helped left with no idea anything was wrong."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What's actually happening by that evening? Read all three carefully.",
          "options": [
            {
              "label": "The feeling is still there and now he's also isolated with it, since suppressing it prevented anyone from actually knowing",
              "isTarget": true,
              "explain": "Right - suppression didn't remove the feeling, it just removed other people's ability to know about it and potentially help."
            },
            {
              "label": "He's processing it privately, which is a legitimate way to handle things",
              "isTarget": false,
              "explain": "There's a real difference between choosing to process something privately and defaulting to hiding it from everyone, including people who could genuinely help - the scenario points at the isolation this produced, not a considered private-processing choice."
            },
            {
              "label": "The project falling through wasn't actually that significant, given he seems to be managing fine outwardly",
              "isTarget": false,
              "explain": "Managing fine outwardly is exactly the pattern being described - it doesn't tell us how significant the internal experience actually is, which the scenario says is 'sitting heavily' on him."
            }
          ],
          "whyPrompt": "In a few words - why does suppressing a feeling not actually make it go away?"
        },
        "apply": {
          "scenario": "A different person, same shape of evening: after telling everyone at work he was 'totally fine' about being passed over for a promotion, Aditya goes home and finds the disappointment hasn't lifted at all - if anything, it feels heavier for having spent the day pretending otherwise.",
          "prompt": "In two or three sentences: what's actually going on for Aditya, and what would you point out about the cost of the day spent pretending?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"The disappointment didn't go anywhere by being hidden all day - and now he's also carrying it completely alone, since no one around him knows it's there.\""
        },
        "remember": {
          "prompt": "In a sentence or two: has suppressing something ever left you feeling more alone with it, rather than less?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t3",
        "title": "What the suppression is actually protecting",
        "role": "Functional logic",
        "delayedRef": "w1t2_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Between 'I'm fine' and the quiet evening after, there's a pattern worth naming honestly: suppressing the feeling can feel like protecting something - not burdening others, staying strong, not seeming weak.",
            "What it actually does is different: it doesn't remove the feeling, and it removes other people's ability to actually help or connect, while resting on a belief - that showing it would cost something socially - that's rarely ever actually been tested."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What is the suppression actually doing? These are close - think it through.",
          "options": [
            {
              "label": "Protecting against an assumed social cost that's rarely been tested, while doing nothing to reduce the feeling itself and removing others' ability to help",
              "isTarget": true,
              "explain": "That's the real trade-off - it protects against a cost that's usually just assumed, not confirmed, and the price paid is real isolation with a feeling that's still fully present."
            },
            {
              "label": "Genuinely keeping him strong and capable in front of others",
              "isTarget": false,
              "explain": "If it were doing that, the feeling itself would be expected to actually lessen - instead it's described as still sitting heavily, just now carried alone rather than shared."
            },
            {
              "label": "Sparing his friend from an unnecessary burden",
              "isTarget": false,
              "explain": "This is the story suppression often tells itself, but notice it assumes the friend would experience it as a burden rather than as a normal part of being close to someone - an assumption that's rarely actually tested."
            }
          ],
          "whyPrompt": "In a few words - why does an untested assumption about social cost carry so much weight here?"
        },
        "apply": {
          "scenario": "A friend, noticing Rohan seems more withdrawn than usual, asks directly: \"Has keeping this to yourself actually made it easier to carry?\" Rohan pauses. \"...Honestly, no. It's just meant no one else knows.\"",
          "prompt": "That's usually the tell. In two or three sentences: think of a time keeping something to yourself didn't actually make it easier - what happened instead?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the pattern to notice is whether suppressing actually reduced the feeling, or just reduced who knew about it."
        },
        "remember": {
          "prompt": "In a sentence or two: what does the urge to say 'I'm fine' usually feel like for you, right before you say it?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t4",
        "title": "What saying it can look like",
        "role": "Contrast / boundary case",
        "delayedRef": "w1t3_apply",
        "delayedPrompt": "Last touch, you named this:",
        "relate": {
          "text": [
            "Here's what a similar moment can look like for someone who doesn't default to suppressing it.",
            "<b class='who'>Vikrant</b> tells a close friend directly that a rough week at work has genuinely gotten to him, rather than deflecting with 'I'm fine' the way he used to. He finds the conversation doesn't cost him anything socially - if anything, his friend opens up more too.",
            "This is the module's contrast case for this pattern: a real, difficult week, honestly named - not the absence of the old instinct to minimize it, but a choice to say it anyway, and evidence that the feared cost didn't actually show up."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What actually makes Vikrant's moment different from Rohan's? All three can look similar in the moment.",
          "options": [
            {
              "label": "He named the real feeling directly instead of defaulting to minimizing it, and got real evidence the feared social cost wasn't actually there",
              "isTarget": true,
              "explain": "That's the real difference - not that his week was easier, but that he tested the assumption directly instead of just accepting it as true."
            },
            {
              "label": "His friendship is simply stronger or safer than Rohan's",
              "isTarget": false,
              "explain": "There's no basis for that comparison in the scenario - the difference described is in what Vikrant chose to say, not in some pre-existing quality of the friendship that made it safe."
            },
            {
              "label": "His week genuinely wasn't as hard as Rohan's, so it was easier to mention",
              "isTarget": false,
              "explain": "The scenario describes it as a rough week that genuinely got to him - the difference isn't the severity of what happened, it's whether it got named honestly or minimized."
            }
          ],
          "whyPrompt": "In a few words - how would you know, in the moment, whether you're about to minimize or name it honestly?"
        },
        "apply": {
          "scenario": "A colleague asks Vikrant how he decided to actually say something instead of brushing it off. He says: \"I just decided to test whether saying it would actually cost me anything. It didn't - if anything, it did the opposite.\"",
          "prompt": "In two or three sentences: think of a moment you're currently minimizing to someone close to you - what would actually naming it, the way Vikrant did, look like?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the useful pattern is noticing whether there's a real, untested assumption about cost sitting underneath the instinct to minimize."
        },
        "remember": {
          "prompt": "In a sentence or two: name one person you could imagine actually testing this with.",
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
            "One more, and then a small piece of what actually happened with Rohan.",
            "A few days later, worn down enough to actually mention it, he told the same friend the truth - that the project falling through had really gotten to him. The friend's response wasn't judgment or a shift in how he saw Rohan. It was just: \"That sounds rough. Want to talk about it?\"",
            "That's not a coincidence, and it previews what's ahead next week: the social cost suppression assumes is real to the person carrying it, but it's rarely actually been tested against what happens when the truth is said out loud. Next week's tools work with exactly that - naming what's actually felt, and testing what showing it actually costs."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does the friend's actual response tell us about the cost Rohan had been assuming?",
          "options": [
            {
              "label": "The feared cost - being judged, seen differently - didn't actually happen; the friend's real response was ordinary and supportive, not what suppression had predicted",
              "isTarget": true,
              "explain": "Right - this is the pattern worth noticing: the prediction and the actual outcome didn't match, which is exactly the kind of evidence suppression usually never gets to see."
            },
            {
              "label": "He got lucky that this particular friend happened to be understanding",
              "isTarget": false,
              "explain": "This treats a genuinely common response (a friend responding supportively to honesty) as an unlikely exception, rather than as fairly ordinary evidence against the original assumption."
            },
            {
              "label": "It doesn't really prove anything, since one supportive response doesn't mean it would always go that way",
              "isTarget": false,
              "explain": "One instance is a start, not a guarantee for every future case - but notice it's still real evidence against a belief that had never been tested even once before this."
            }
          ],
          "whyPrompt": "In a few words - why does one real test matter, even though it doesn't guarantee every future case will go the same way?"
        },
        "apply": {
          "scenario": "A different person, same shape of moment: after finally admitting to a teammate that a recent setback had really shaken his confidence, Farhan braces for a shift in how the teammate treats him - and gets, instead, a simple 'yeah, that would shake anyone, that's rough.'",
          "prompt": "In two or three sentences: what does that response tell Farhan about the cost he'd been bracing for?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"The response he got was ordinary and supportive, not the judgment he'd braced for - real evidence against an assumption that had never actually been tested before.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of an assumption you're currently carrying about what expressing something would cost you - has it ever actually been tested?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: emotional suppression and the internalized scripts behind it - a pattern that doesn't remove the feeling, just removes others' ability to know about it, resting on an assumed social cost that's rarely actually been tested. Next week: four tools, and a first real test of that assumption."
  },
  {
    "num": 2,
    "title": "Four tools, and testing the cost",
    "mechanism": "A",
    "kind": "technique",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w2t1",
        "title": "Emotion-Identification Using a Feelings Wheel",
        "role": "Technique A1 - Emotion Theory (Plutchik)",
        "delayedRef": "w1t5_apply",
        "delayedPrompt": "Last week, your answer was:",
        "relate": {
          "text": [
            "This is the first of the four tools for this pattern from your theory grounding screen: <b>emotion-identification using a feelings wheel</b>.",
            "Remember Rohan defaulting to 'fine'? A feelings wheel is a visual map of emotions - from broad categories like 'sad' or 'angry' down to more specific ones, like 'discouraged' or 'resentful.' Suppression is often less a deliberate choice and more a skill gap - not having practiced naming things precisely. This tool builds that precision directly."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might naming an emotion more precisely than 'fine' or 'stressed' actually change what happens next with it?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of how you're actually feeling right now, or how you felt at a specific moment recently - not the version you'd say out loud by default.",
          "prompt": "In two or three sentences: try to name it more precisely than your usual default word. What's the more specific version?",
          "placeholder": "My default word would be: ... / A more precise version: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the more precise word actually feels more accurate, not just different for its own sake."
        },
        "remember": {
          "prompt": "In a sentence or two: was it harder or easier than expected to find a more precise word?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t2",
        "title": "Behavioural Experiments Testing Predicted Social Costs",
        "role": "Technique A2 - CBT (Beck-style) - guided",
        "guardrail": true,
        "delayedRef": "w2t1_apply",
        "delayedPrompt": "Last touch, your precise word was:",
        "relate": {
          "text": [
            "The second tool: <b>behavioural experiments testing predicted social costs of expressing emotion</b>.",
            "Remember Rohan's friend responding with ordinary support, not judgment? This tool makes that kind of test deliberate: name the specific social cost you predict from expressing something real - 'he'll think less of me', 'she'll see me as weak' - and then actually test it, in a real, chosen moment.",
            "Because this asks you to actually do something real, not just reflect on it, this touch checks in with you directly partway through."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why does naming the exact predicted cost, before testing it, matter more than just deciding to 'be more open' in general?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of something real you could actually express to someone in your life, and the specific cost you're predicting from doing it.",
          "intensityPrompt": "First, choose how big a test you want to run:",
          "intensityOptions": [
            "Smaller version - something relatively low-stakes to say",
            "Bigger version - something that feels genuinely risky to say"
          ],
          "prompt": "In two or three sentences: name what you'd actually say, who to, and the specific cost you're predicting.",
          "placeholder": "What I'd say, and to whom: ... / The cost I predict: ..."
        },
        "distressPrompt": "You've just committed to a real test of something you predict will cost you socially. Before we continue - how are you feeling right now?",
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the predicted cost is specific enough to actually be tested (a real reaction, not a vague feeling), and whether the person and moment are real, not hypothetical."
        },
        "remember": {
          "prompt": "In a sentence or two: after you actually try this, come back and compare - did the predicted cost happen?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t3",
        "title": "Acceptance of Vulnerability as Values-Consistent Action",
        "role": "Technique A3 - ACT (Hayes)",
        "delayedRef": "w2t2_apply",
        "delayedPrompt": "Last touch, your prediction was:",
        "relate": {
          "text": [
            "The third tool: <b>acceptance of vulnerability as values-consistent action</b>.",
            "Instead of framing vulnerability purely as risk, this tool reframes it: showing it is actually consistent with values a lot of people hold - honesty, closeness, being genuinely known by people who matter. The question shifts from 'is this safe' to 'which do I actually value more.'"
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might reframing vulnerability as values-consistent action change the decision to show it, even when the old risk-framing hasn't fully gone away?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a value you genuinely hold - honesty, closeness, being known by people who matter to you.",
          "prompt": "In two or three sentences: name the value, and a specific moment where showing something real would actually be acting on it.",
          "placeholder": "The value: ... / The moment: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the value named is genuinely yours, and the moment is specific, not a generic 'be more open' statement."
        },
        "remember": {
          "prompt": "In a sentence or two: does thinking about it this way - as acting on a value, not just taking a risk - change how it feels?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t4",
        "title": "Externalising & Re-Authoring the Toughness Script",
        "role": "Technique A4 - Narrative Therapy (White & Epston)",
        "delayedRef": "w2t3_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "The fourth tool: <b>externalising and re-authoring the toughness script</b>.",
            "Name the internalized script as something separate from you - not 'I don't show emotion' but 'the script is telling me that showing emotion makes me less of a man.' Then examine where it actually came from, and whether it still genuinely serves you the way it might once have seemed to."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might naming the script as separate from you, rather than as simply who you are, make it easier to actually question?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think about where your own version of this script might have come from - a specific message, person, or moment, if one comes to mind.",
          "prompt": "In two or three sentences: name what the script is telling you, where it might have come from, and whether it still actually serves you.",
          "placeholder": "What the script says: ... / Where it might be from: ... / Does it still serve me: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the script gets named specifically, not just gestured at in the abstract."
        },
        "remember": {
          "prompt": "In a sentence or two: was tracing where it came from easier or harder than expected?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t5",
        "title": "How did it go, and your own situation",
        "role": "Check-in + pre-commitment",
        "delayedRef": "w2t4_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "No new idea this touch - a real check-in on this week's four tools, the same four that trace back to Rohan's 'I'm fine' back in Week 1.",
            "And then, since this is the last touch in the module: something with no scaffolding, using whichever tool actually fits your own real situation right now."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Which of the four did you actually try this week, if any - and what happened?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "With nothing pre-walked this time: think of a real situation you're actually facing right now, where some version of this pattern is showing up.",
          "prompt": "In two or three sentences: what's your actual next move, and why that one - which of the four tools, and why not one of the others?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single right answer here - this was deliberately left without a signalled answer. What matters is whether your reasoning traces back to the four tools from this week, not whether it matches anyone else's."
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
    "code": "A4",
    "rep": 1,
    "type": "reflection",
    "scenario": "You catch yourself brushing off a real reaction to something - telling yourself, or someone else, that it's 'not a big deal' when it actually is.",
    "prompt": "In two or three sentences: name what the toughness script might be telling you in this moment, and whether it's actually true right now.",
    "reveal": "There's no single model answer here - the tell is whether the script gets named specifically, not just gestured at in the abstract."
  },
  {
    "code": "A4",
    "rep": 2,
    "type": "reflection",
    "scenario": "Think of a recent moment you held something back that you might, on reflection, have actually wanted to say.",
    "prompt": "In two or three sentences: what was the script saying in that moment, and where do you think it's actually from?",
    "reveal": "There's no single model answer here - the tell is specificity about the script's content and origin, not a general statement about 'not being good at feelings.'"
  }
],
  toolsData: {
  "feelings_wheel_log": {
    "code": "A1",
    "title": "Feelings Wheel Check-In",
    "mechShort": "Suppression",
    "kind": "log_single",
    "intro": "Name what you're actually feeling, more precisely than your default word. Log it each time you actually try this.",
    "logLabel": "What was the situation, and what was the more precise word?",
    "firstPlaceholder": "e.g. Meeting got tense - my default would be ‘annoyed’, more precise word is ‘dismissed’",
    "placeholder": "Your answer..."
  },
  "values_vulnerability_log": {
    "code": "A3",
    "title": "Values-Consistent Vulnerability",
    "mechShort": "Suppression",
    "kind": "log_single",
    "intro": "Reframe a moment of vulnerability as acting on a value you hold, not just taking a risk. Log it each time you actually do this.",
    "logLabel": "What was the moment, and what value did it connect to?",
    "firstPlaceholder": "e.g. Told a friend I was actually struggling - connects to wanting real closeness, not just surface-level friendships",
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
    tier1: "Any statement connecting emotional suppression, or the underlying toughness script, to intent or a plan to end one's life or self-harm (\"I can't take this anymore, I want it to just stop for good\", \"I have a way to end it\").",
    tier2: "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary discomfort of naming and questioning a long-held pattern, which is what this module is specifically designed to invite.",
    suppressionClassifierNote: "MODERATE PRIORITY, worth stating as a distinct consideration from prior modules' notes: this module's target pattern is specifically about minimizing and under-reporting emotional experience in one's own language. That means the usual assumption behind escalation classification - that real distress tends to show up as recognizably distressed language - may be less reliable here than in other modules. Someone deep in this pattern might describe something genuinely serious ('work's been rough, I'm managing') in language that reads as mild specifically because minimizing is the pattern itself, not because the underlying experience is actually mild. This doesn't mean escalating more aggressively - false positives carry real costs of their own, and most muted language is exactly what it sounds like. It means the module's own success (getting someone to name a feeling more precisely than usual, per A1's whole purpose) may, over the course of the module, surface a more accurate and sometimes more serious picture than the person's first few answers suggested - worth watching for a shift in tone or specificity across a user's answers within this module, not just any single message in isolation.",
    systemPrompt: "You are a safety classifier inside a mental-health support app used in India. Classify the user's message into exactly one of: NONE, TIER1, TIER2.\n\nTIER1 definition: Any statement connecting emotional suppression, or the underlying toughness script, to intent or a plan to end one's life or self-harm (\"I can't take this anymore, I want it to just stop for good\", \"I have a way to end it\").\nTIER2 definition: Persistent hopelessness about life broadly, or real functional collapse - not the ordinary discomfort of naming and questioning a long-held pattern, which is what this module is specifically designed to invite.\n\nCritical context 1: many people, especially in Indian English, use hyperbolic or idiomatic self-deprecating language that is NOT a genuine risk signal - for example \"I could kill myself for forgetting that\", \"this deadline is literally killing me\". Do NOT classify ordinary hyperbole, jokes, or figures of speech as TIER1 or TIER2, even if they contain words like \"kill\", \"die\", or \"worthless\".\n\nCritical context 2 (specific to this module): this module's subject is a pattern of habitually minimizing and under-describing emotional experience. Because of this, a user's early answers in this module may understate how serious something actually is, in muted or deflecting language (\"it's fine, just a rough patch\") - this is the pattern itself, not necessarily evidence that things are mild. Do not read minimized language as automatically low-risk, but also do not escalate based on tone alone - continue to require genuine indication of intent, a plan, or real functional collapse/hopelessness before escalating, per the definitions above. If a user's language becomes notably more specific or serious across several answers within this module, weigh the more specific, later description more heavily than an earlier, more minimized one.\n\nOnly classify as TIER1 if there is a genuine indication of intent, a plan, or serious risk to the person's life or safety. Only classify as TIER2 if there is genuine persistent hopelessness about life broadly, or real functional collapse - not the ordinary discomfort of naming and questioning a long-held emotional pattern, which is what this module is designed to invite.\n\nWhen genuinely uncertain, prefer the lower tier (or NONE) rather than over-triggering - but never downgrade language that includes a specific plan, method, or timeframe.\n\nRespond with ONLY a raw JSON object, no markdown fences, no other text: {\"tier\": \"NONE\" | \"TIER1\" | \"TIER2\", \"reason\": \"one short clause\"}",
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
    "text": "All 4 practicable technique mappings are my synthesis of the taxonomy's named sources - not clinician-reviewed."
  },
  {
    "area": "Clinical",
    "text": "Tier 1/2 escalation definitions for this module are a first draft, awaiting sign-off."
  },
  {
    "area": "Clinical, moderate priority, new consideration",
    "text": "See BRIEF.escalation.suppressionClassifierNote above. This module's content is specifically about a population pattern of minimizing emotional language - worth clinical input on whether the classifier or the product more broadly should track meaningfully across a user's touches within this module (not just per-message), given the module's own stated goal is to get people describing their emotional state more precisely than their baseline. Not resolved in this build - flagged as a genuine open design question, not just a classifier tuning note."
  },
  {
    "area": "Structural note - second mechanism_count=1 module, different transfer-test resolution than Module 6",
    "text": "Same 2-week, no-integration-week, no-retrieval-check structure as Module 6 (see that module's dev guide for the general mechanism_count=1 reasoning). This module, though, has no clinical safety reason to omit the unscaffolded transfer test the way Module 6 did - suppression/masculinity-norms content doesn't carry the same re-traumatization risk as trauma content. Resolution used: rather than adding a 6th touch (violates the fixed 5-touch rule) or omitting transfer entirely (Module 6's approach, for reasons specific to that module's content), the final 'check-in + pre-commitment' touch's Apply beat is written as a genuinely unscaffolded, own-situation prompt - not the templated if-then-plan format every other technique week uses when it has a separate integration week to hold the transfer test in. Recommend the template document this as the standard resolution for mechanism_count=1 modules that don't have Module 6's specific safety rationale - fold transfer-test spirit into the closing touch rather than defaulting to either extreme (add a 6th touch, or skip transfer silently)."
  },
  {
    "area": "Content decision",
    "text": "Reinforcement Bank for this module is small by necessity - only 3 of 4 techniques are practicable-and-non-guardrailed (A1, A3, A4; A2 excluded as [B]), and with only one mechanism there's no larger pool to draw from the way a 3- or 4-mechanism module has. A4 (externalising/re-authoring the toughness script) is a genuine sit-down reflective exercise, so it's in Reflections; A1 (feelings wheel) and A3 (values-consistent vulnerability) are quick, repeatable, in-the-moment habits, so both are in Tools."
  },
  {
    "area": "Resolved",
    "text": "Crisis helpline numbers reused from Modules 1-6 (KIRAN, TeleMANAS, Vandrevala Foundation) - national, not module-specific."
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
    "text": "Nothing in this module has been clinically reviewed and nothing has been tested with a real user. Every technique mapping, scenario, and escalation threshold is a first draft."
  }
]
};
