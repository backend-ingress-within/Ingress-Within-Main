import { ModuleContent } from '../../../types/moduleContent';

function opt(label: string, isTarget: boolean, explain: string) {
  return { label, isTarget, explain };
}

export const MODULE_11_CONTENT: ModuleContent = {
  moduleId: 'M11',
  slug: 'conflict-communication',
  name: "Conflict & Communication",
  duration_weeks: 9,
  tier: "Common - 499 rupees - Family domain",
  brief: {
  "moduleName": "Conflict & Communication",
  "tier": "Common - 499 rupees - Family domain",
  "mechanisms": [
    {
      "key": "A",
      "name": "Feeling Misunderstood",
      "short": "Misunderstood",
      "def": "A pattern where important, emotionally loaded conversations repeatedly leave a person feeling that what they actually meant never landed, producing a growing sense that no one really understands them, even people who genuinely care.",
      "need": "To be truly heard and understood",
      "contrast": {
        "who": "Diya",
        "text": "has conversations that go sideways too, the same way anyone's do - but she's learned to check, in the moment, whether what she heard actually matches what the other person meant, rather than assuming a mismatch means no one understands her at all."
      },
      "techniques": [
        {
          "code": "A1",
          "approach": "IPT",
          "format": "B",
          "guardrail": true,
          "name": "Interpersonal Communication Analysis Mapping Recurring Misunderstandings",
          "source": "Gerald Klerman & Myrna Weissman, IPT",
          "what": "Mapping a real, recurring misunderstanding with a specific person - what was said, what was heard, what was actually meant - to find the specific point where the disconnect keeps happening, rather than treating each instance as an unrelated, isolated event.",
          "how": "Recurring misunderstandings usually have a specific, identifiable pattern to them - a particular phrase, tone, or topic that reliably gets misread. Mapping several real instances against each other reveals that pattern, which a single instance alone can't show.",
          "why": "Because this asks you to examine a real, specific relationship pattern in detail, it ships with the same guardrails as any [B] technique - a choice of intensity, and a check-in afterward."
        },
        {
          "code": "A2",
          "approach": "CBT",
          "format": "A",
          "name": "Cognitive Restructuring of 'No One Understands Me' Overgeneralizations",
          "source": "Aaron Beck",
          "what": "Writing down the specific overgeneralized thought - \"no one understands me,\" \"I can never get through to anyone\" - and testing it against real, specific evidence, the way any other automatic thought would be tested.",
          "how": "A single frustrating conversation can produce a sweeping conclusion about everyone, always. Testing the specific claim against real evidence - are there people, even one, who have understood you - usually reveals the overgeneralization doesn't hold up.",
          "why": "Targets the broad, sweeping conclusion directly, which the specific mapping in A1 doesn't address on its own."
        },
        {
          "code": "A3",
          "approach": "Person-Centred Therapy",
          "format": "A",
          "name": "Reflective-Listening Drills",
          "source": "Carl Rogers's person-centred communication skills",
          "what": "Practicing reflecting back what someone else has said, in your own words, before responding with your own point - \"what I'm hearing is...\" - to confirm understanding before moving forward, rather than assuming it.",
          "how": "Many misunderstandings happen because a response gets built on an assumed, unchecked understanding of what was just said. Reflecting back first catches the gap before it turns into a full misunderstanding.",
          "why": "The practical, in-the-moment skill that actually prevents the next misunderstanding, rather than just working with ones that have already happened."
        },
        {
          "code": "A4",
          "approach": "Emotionally Focused Therapy",
          "format": "C",
          "name": "Mapping the Pursue-Withdraw Cycle",
          "source": "Sue Johnson, Emotionally Focused Therapy (EFT)",
          "what": "A structured process, normally guided by a couples or family therapist, of mapping the specific cycle where one person pursues connection (raising the issue, seeking reassurance) and the other withdraws (going quiet, physically leaving), each response triggering more of the other - to surface the deeper attachment needs and fears underneath the surface conflict.",
          "how": "The pursue-withdraw cycle is a well-documented pattern in EFT, but working with it usually requires a trained therapist to help both people see their part in the cycle and the vulnerable needs underneath it, since this kind of work can surface real, tender material that needs skilled support to hold safely.",
          "why": "Genuinely one of the most effective approaches for this exact pattern when it's a recurring, entrenched dynamic - but mapping attachment needs underneath real conflict isn't something to attempt alone from an app.",
          "professionalNote": "A therapist trained in Emotionally Focused Therapy (EFT) - often a couples or family therapist - can help map this cycle safely with both people present. If a pursue-withdraw pattern feels recognizable and entrenched, this is specifically worth raising with a professional; EFT has strong research support for exactly this kind of recurring conflict cycle."
        }
      ]
    },
    {
      "key": "B",
      "name": "Frequent Arguments",
      "short": "Frequent Arguments",
      "def": "A pattern of recurring arguments, often escalating quickly from small triggers, leaving both people flooded and unable to actually resolve anything - sometimes following a predictable, repeating shape from start to finish.",
      "need": "De-escalation, and actual repair rather than just an ending",
      "contrast": {
        "who": "Ritu",
        "text": "has real arguments too, the same as anyone in a close relationship does - but she's learned to notice the early signs of flooding, in herself or the other person, and calls a real pause before things escalate past the point either of them can actually resolve anything."
      },
      "techniques": [
        {
          "code": "B1",
          "approach": "Gottman Method",
          "format": "A",
          "name": "Soft Start-Up & Repair Attempts, with Awareness of the Four Horsemen",
          "source": "John Gottman",
          "what": "Opening a difficult conversation gently rather than with criticism or contempt (a 'soft start-up'), and recognizing genuine repair attempts - a joke, an apology, a moment of softening - offered during conflict, rather than missing or dismissing them. Includes awareness of Gottman's 'Four Horsemen' (criticism, contempt, defensiveness, stonewalling) as patterns that reliably predict escalation.",
          "how": "Gottman's research found that how a conversation starts strongly predicts how it ends, and that couples who stay connected tend to actually notice and accept each other's repair attempts mid-conflict, rather than missing them while escalation is underway.",
          "why": "The foundational tool for this mechanism - changes how a difficult conversation begins and how attempts to de-escalate mid-argument get received."
        },
        {
          "code": "B2",
          "approach": "Gottman Method",
          "format": "A",
          "name": "A Physiological-Flooding Time-Out Protocol",
          "source": "Gottman's research on escalation",
          "what": "Recognizing the physical signs of flooding - racing heart, feeling overwhelmed, unable to think clearly - and calling a structured pause: naming that a break is needed, agreeing on a real duration (Gottman's research suggests at least 20 minutes), and returning to the conversation afterward rather than avoiding it indefinitely.",
          "how": "Past a certain point of physiological flooding, productive conversation becomes genuinely difficult - the body's stress response takes over before either person can think clearly. A real pause, long enough for the body to actually settle, makes returning to the conversation productive again.",
          "why": "The tool for the moment an argument has already started escalating - not preventing it from starting, but stopping it from continuing until neither person can think."
        },
        {
          "code": "B3",
          "approach": "IPT",
          "format": "B",
          "guardrail": true,
          "name": "Interpersonal Role-Dispute Resolution Work",
          "source": "Gerald Klerman & Myrna Weissman, IPT",
          "what": "Directly examining a real, ongoing role dispute - a disagreement about expectations, responsibilities, or how a relationship should actually work - identifying each person's stated expectations, where they diverge, and options for resolving or renegotiating them.",
          "how": "Frequent arguments often circle the same unresolved dispute repeatedly without ever naming it directly. Working through the actual dispute - not just the latest argument about it - is what IPT's role-dispute framework is specifically built for.",
          "why": "Because this asks you to examine a real, ongoing conflict in a real relationship, it ships with the same guardrails as any [B] technique - a choice of intensity, and a check-in afterward."
        },
        {
          "code": "B4",
          "approach": "CBT",
          "format": "A",
          "name": "Thought-Record Work on Conflict-Trigger Appraisals",
          "source": "Aaron Beck",
          "what": "Writing down the specific interpretation that turned a small trigger into an argument - \"they're doing this on purpose,\" \"they don't respect me\" - and testing it against real, alternative explanations.",
          "how": "Arguments often escalate quickly because a neutral or ambiguous trigger gets read through an uncharitable interpretation almost instantly. Slowing down and testing that interpretation against real alternatives is what the heat of the moment never allows time for.",
          "why": "Targets the specific appraisal that turns a small trigger into a full argument, which the other three tools in this mechanism don't address directly."
        }
      ]
    },
    {
      "key": "C",
      "name": "Joint Family / In-Law Conflict",
      "short": "In-Law Conflict",
      "def": "Conflict arising from close, often daily contact with extended family - in-laws, joint-family living arrangements - where roles, authority, and expectations are frequently unclear or contested, and where the conflict often involves more than two people at once.",
      "need": "Clarity about roles and authority, a way to be heard within a larger family system",
      "contrast": {
        "who": "Nandini",
        "text": "lives in a similarly close joint-family arrangement, with real, ongoing tension around authority and roles - that hasn't gone away. But she's built a clearer sense of who actually holds which roles in the family system, which has made specific conflicts easier to name and address directly."
      },
      "techniques": [
        {
          "code": "C1",
          "approach": "Family Systems Theory",
          "format": "A",
          "name": "Family Systems Mapping of Roles, Alliances & Triangulation Using a Genogram",
          "source": "Murray Bowen's Family Systems Theory",
          "what": "Drawing a structured family map (a genogram) showing who holds which roles, which relationships are closer or more distant, and where triangulation is happening - one person being drawn into a conflict that's actually between two others.",
          "how": "Family conflict, especially in larger or joint-family systems, often isn't really about the two people arguing in the moment - it's shaped by the larger system of roles and alliances around them. Mapping the system visually reveals patterns that are much harder to see from inside any single conversation.",
          "why": "The foundational tool for this mechanism - gives a clear, visual picture of the system a specific conflict is actually happening inside of."
        },
        {
          "code": "C2",
          "approach": "Milan Systemic Therapy",
          "format": "B",
          "guardrail": true,
          "name": "Circular Questioning to Surface Each Member's Perspective",
          "source": "Mara Selvini Palazzoli's Milan Systemic approach",
          "what": "Adapted for solo use: rather than a therapist asking each family member directly (the original, facilitated version of this technique), this version asks you to genuinely consider and write out how two or three different family members might each describe the same conflict, in their own likely words - not to excuse anyone, but to see the conflict as the system might actually look from more than one seat in it.",
          "how": "A conflict looked at only from one's own perspective usually looks very different from how it looks from inside the system as a whole. Genuinely trying to write out another family member's likely perspective - even one you disagree with - often reveals dynamics invisible from your own seat alone.",
          "why": "Because this asks you to sit with, and genuinely try to inhabit, other people's perspectives on a real and possibly painful conflict, it ships with the same guardrails as any [B] technique - a choice of intensity, and a check-in afterward.",
          "adaptationNote": "This is a genuine adaptation of a technique originally designed to be facilitated by a therapist with multiple family members present in the room. The solo, written version here is a meaningfully different (and less powerful) tool than the original clinical technique - worth being explicit about rather than implying equivalence."
        },
        {
          "code": "C3",
          "approach": "IPT",
          "format": "B",
          "guardrail": true,
          "name": "Interpersonal Negotiation Skills for Household-Authority Disputes",
          "source": "Gerald Klerman & Myrna Weissman, IPT",
          "what": "Applying structured negotiation skills to a real, specific dispute about household authority - who decides what, in which domains - identifying what's actually being contested, and options for a workable, if imperfect, resolution.",
          "how": "Authority disputes in joint or extended-family households often stay unresolved because they're never actually named as negotiations - they just keep resurfacing as friction. Naming the specific authority question directly, and treating it as something to actually negotiate, is different from just enduring the ongoing friction.",
          "why": "Because this asks you to work through a real, often sensitive dispute about family authority, it ships with the same guardrails as any [B] technique - a choice of intensity, and a check-in afterward."
        }
      ]
    },
    {
      "key": "D",
      "name": "Sibling Conflict",
      "short": "Sibling Conflict",
      "def": "Conflict between siblings, often rooted in long-standing role patterns established early in life - favoritism, comparison, birth-order dynamics - that continue to shape adult interactions, sometimes resurfacing sharply around shared family responsibilities like caregiving or inheritance.",
      "need": "Fairness, and a role in the family that isn't fixed by childhood patterns",
      "contrast": {
        "who": "Amit",
        "text": "has real, long-standing tension with a sibling too, rooted in old family patterns that go back decades. But he's gotten clearer about which parts of the current friction are actually about the present situation, and which parts are really old, inherited roles resurfacing."
      },
      "techniques": [
        {
          "code": "D1",
          "approach": "Family Systems Theory",
          "format": "A",
          "name": "Family-of-Origin Genogram Work Tracing Long-Standing Role Patterns",
          "source": "Bowen's Family Systems Theory, informed by Alfred Adler's birth-order theory",
          "what": "Mapping the family-of-origin system specifically to trace long-standing sibling roles - who was cast as 'the responsible one,' 'the difficult one,' or similar - and how those early roles may still be shaping present-day sibling interactions, whether or not they still actually fit.",
          "how": "Sibling roles established early in childhood often persist in family dynamics long after they've stopped accurately describing who anyone actually is. Mapping where a role came from is often what makes it possible to actually question whether it still fits.",
          "why": "The foundational tool for this mechanism - most sibling conflict in adulthood has real roots in patterns this mapping can actually surface."
        },
        {
          "code": "D2",
          "approach": "IPT",
          "format": "A",
          "name": "Interpersonal-Effectiveness Skills for Raising Fairness-Related Grievances",
          "source": "Gerald Klerman & Myrna Weissman, IPT",
          "what": "Structured skills for actually raising a specific fairness grievance with a sibling directly - naming the specific concern, rather than letting it build silently or come out sideways in an unrelated argument.",
          "how": "Fairness grievances between siblings often go unspoken for years, surfacing indirectly in unrelated friction rather than being raised directly. A structured way to name the actual grievance gives it somewhere real to go.",
          "why": "The practical tool for addressing a specific, current grievance, once D1 has helped clarify which patterns are old and which are actually about the present."
        },
        {
          "code": "D3",
          "approach": "Family Systems Practice",
          "format": "B",
          "guardrail": true,
          "name": "Structured Family Meetings to Renegotiate Caregiving/Inheritance Roles",
          "source": "Bowen-informed family systems practice",
          "what": "A structured format for a real family meeting - with clear ground rules, a specific agenda, and a facilitation structure - to renegotiate roles around shared family responsibilities like caregiving for aging parents or inheritance decisions, rather than letting these get decided by default or old patterns.",
          "how": "Caregiving and inheritance questions often get resolved by whoever's willing to raise them, or by default to old sibling roles, rather than through any real, structured conversation involving everyone affected. A structured meeting format makes an actual, fair negotiation possible.",
          "why": "Because this asks you to prepare for a real, often high-stakes family conversation involving multiple people, it ships with the same guardrails as any [B] technique - a choice of intensity, and a check-in afterward."
        }
      ]
    }
  ],
  "scenarioSource": "Pan-India, English-medium context (per product decision) - joint family living arrangements, in-law dynamics, sibling relationships shaped by caregiving and inheritance questions common in extended-family structures. Language is English-medium throughout; content has not yet been reviewed for phrasing that reads as metro-specific.",
  "escalation": {
    "tier1": "Any statement connecting conflict with a partner, family member, or sibling to intent or a plan to end one's life or self-harm (\"I can't take this anymore, I want it to just stop for good\", \"I have a way to end it\"), or to intent to harm another person.",
    "tier2": "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary frustration or distress of real, ongoing family or relationship conflict, which is what this module is specifically designed to help with. Also watch for language suggesting the conflict has become physically unsafe (not just verbally heated) - this module is built for communication and negotiation work, not for situations involving actual physical danger, which need a different kind of support entirely."
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
    "eyebrow": "What this module is for - and isn't",
    "title": "Built for communication, not for physical safety concerns",
    "body": [
      "This module is about communication, conflict patterns, and negotiation - real, difficult, but non-violent conflict. If any relationship in your life involves physical danger, this module isn't the right resource for that, and we'd encourage you to reach out to a professional or a dedicated safety resource instead.",
      "Several techniques in this module ask you to actually engage with a real, specific relationship or conflict - they ship with a built-in choice of intensity and a check-in, on purpose.",
      "If you're in crisis right now, don't wait for this module to help. Reach out immediately - the button below is always here if you need it."
    ],
    "cta": "Continue",
    "crisisButton": true
  },
  {
    "eyebrow": "What this is - and isn't",
    "title": "Between-session support, not a replacement",
    "body": [
      "This module is designed to sit between therapy sessions, or to be useful on its own - either way, it isn't therapy, and it doesn't diagnose you with anything."
    ],
    "cta": "Continue"
  },
  {
    "eyebrow": "Why this module",
    "title": "Why we're suggesting this one",
    "body": [
      "You told us you're dealing with feeling misunderstood in conversations that matter, arguments that escalate faster than they should, tension with in-laws or extended family, or long-standing friction with a sibling. Maybe more than one, maybe all four.",
      "This module is built for exactly that - four specific patterns, each with its own real, evidence-based tools, not one blended 'communicate better' module."
    ],
    "cta": "Continue"
  },
  {
    "eyebrow": "What to expect",
    "title": "The next 9 weeks",
    "body": [
      "Short term: a new touch on weekdays, a few minutes each, real scenarios close to your own week - your own words, not a quiz to pass or fail. Weekends bring a short summary, not new content.",
      "Long term, honestly: this won't resolve every conflict in your life, and it won't change how other people communicate. What it can realistically offer is 13 specific, evidence-based tools, plus enough practice noticing each pattern that you reach for the right tool sooner. That's the actual promise here, not more than that."
    ],
    "cta": "Continue"
  },
  {
    "eyebrow": "Theory grounding",
    "title": "The tools everything here is built on",
    "body": [
      "Each of these four patterns has more than one real, evidence-based approach behind it - so instead of blending them into one vague idea, each approach gets its own tool and its own touch.",
      "You won't use any of these in Weeks 1-4 - those four weeks are just about being able to spot each pattern clearly, before any tool gets layered on top. Weeks 5-8 bring these back, one at a time, matched to exactly what you'll have just learned to recognise. Several techniques below are marked differently - they ask you to engage with a real, specific relationship or conflict, so they ship with a choice of intensity and a check-in. One more is explained but not delivered as an exercise, since it genuinely needs a licensed professional."
    ],
    "theory": true,
    "cta": "Start Week 1"
  }
],
  weeks: [
  {
    "num": 1,
    "title": "Feeling misunderstood: recognising the pattern",
    "mechanism": "A",
    "kind": "blocked",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w1t1",
        "title": "Recognition - the conversation that missed",
        "role": "Recognition #1",
        "noDelayed": true,
        "relate": {
          "text": [
            "Quick note before we start: this week and the next three aren't about any of the tools yet - none show up. First, you need to be able to spot each pattern clearly. The tools come in Weeks 5-8, matched one at a time to what you'll have learned to recognise.",
            "This week's pattern has a name: <b>feeling misunderstood</b>. In simple terms: important conversations repeatedly leave a person feeling that what they actually meant never landed, producing a growing sense that no one really understands them.",
            "Here's what that looks like. <b class='who'>Aarav</b> tries to explain to his partner why a specific comment from earlier bothered him - something about feeling overlooked, not really about the comment itself. His partner responds by defending the comment directly, missing the actual point entirely. Aarav gives up mid-explanation, feeling like there's no real point in trying to clarify further."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "Which of these actually explains what's happening? More than one will sound reasonable.",
          "options": [
            {
              "label": "A response addressed something adjacent to what was actually meant, and the real point never got heard, which is different from the point being rejected",
              "isTarget": true,
              "explain": "Right - the partner responded to something real, just not to what Aarav actually meant. That's a miss, not a rejection, though it can feel identical in the moment."
            },
            {
              "label": "His partner doesn't care about how Aarav feels",
              "isTarget": false,
              "explain": "There's no evidence in the scenario for that - the partner responded to something, just not to the actual underlying point. A miss and a lack of caring are different things, and the scenario only shows the former."
            },
            {
              "label": "Aarav didn't explain himself clearly enough",
              "isTarget": false,
              "explain": "This places the failure entirely on Aarav's explanation, when the pattern being shown is about a response landing on the wrong thing - which can happen even with a clear explanation, if the listener responds to the surface rather than the underlying point."
            }
          ],
          "whyPrompt": "In a few words - what's the giveaway that this is a miss, not a rejection?"
        },
        "apply": {
          "scenario": "Same pattern, a different person: Meher tries to tell her mother she's been feeling overwhelmed lately, and her mother responds with a list of practical suggestions, missing that Meher mostly just wanted to be heard, not fixed.",
          "prompt": "Same thing happening here. In two or three sentences: what would you actually say to Meher right now?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"Your mother responded to something real - wanting to help - but it sounds like what actually landed wasn't quite what you meant. That's a miss worth naming, not necessarily a sign she doesn't care.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of a real moment this applies to you - what's a time your actual point didn't land, even though the other person responded to something?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t2",
        "title": "Recognition - a growing conclusion",
        "role": "Recognition #2",
        "delayedRef": "w1t1_apply",
        "delayedPrompt": "Last touch, on Meher, you wrote this:",
        "relate": {
          "text": [
            "Same Aarav, a few days later, with a different person - a close friend. A similar miss happens again, in a completely unrelated conversation. Aarav notices himself thinking, almost automatically, \"no one ever really understands me.\"",
            "Notice what's carried over: one miss with his partner has become a general conclusion about everyone, applied instantly to an unrelated conversation with a different person entirely."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What's actually happening with this new conclusion? Read all three carefully.",
          "options": [
            {
              "label": "A specific miss in one relationship is generalizing into a sweeping conclusion about all relationships, applied automatically to an unrelated situation",
              "isTarget": true,
              "explain": "Right - this is the overgeneralization itself: one real miss becoming 'no one ever' rather than staying specific to what actually happened."
            },
            {
              "label": "He's accurately noticing a real pattern across all his relationships",
              "isTarget": false,
              "explain": "Two misses, in different relationships, with different people, isn't yet strong evidence of a pattern this broad - the jump to 'no one ever' is faster and more sweeping than the actual evidence supports."
            },
            {
              "label": "His friend also doesn't understand him, confirming his fear",
              "isTarget": false,
              "explain": "This accepts the sweeping conclusion as already proven by a single instance, when the pattern worth noticing is exactly how fast that conclusion formed from limited evidence."
            }
          ],
          "whyPrompt": "In a few words - why does one miss with a friend not actually prove the sweeping conclusion?"
        },
        "apply": {
          "scenario": "A different person, same shape of moment: after a colleague misunderstands a straightforward request, Kabir finds himself thinking \"I can never get my point across to anyone,\" despite the moment being fairly minor and unrelated to his closer relationships.",
          "prompt": "In two or three sentences: what's actually going on for Kabir, and what would you point out about how fast that conclusion formed?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"One minor miss with a colleague doesn't actually establish 'never, with anyone' - that conclusion jumped much further than this one moment's evidence supports.\""
        },
        "remember": {
          "prompt": "In a sentence or two: has a single misunderstanding ever turned into a sweeping conclusion for you? What did that sound like?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t3",
        "title": "What the sweeping conclusion is actually costing",
        "role": "Functional logic",
        "delayedRef": "w1t2_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Between the conversation with his partner and the moment with his friend, there's a pattern worth naming honestly: concluding \"no one understands me\" can feel like it's protecting Aarav - lowering his expectations so future misses hurt less.",
            "What it actually costs is different: it doesn't reduce how much a real miss hurts, and it makes him less likely to try clarifying at all next time, since what's the point if no one really understands anyway."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What is the sweeping conclusion actually doing? These are close - think it through.",
          "options": [
            {
              "label": "Discouraging future attempts to clarify or explain, without actually reducing how much a real miss hurts when it happens",
              "isTarget": true,
              "explain": "That's the real cost - it doesn't provide any real protection from the sting, it just makes trying again feel pointless, which tends to produce more misses, not fewer."
            },
            {
              "label": "Genuinely protecting him from being hurt by future misunderstandings",
              "isTarget": false,
              "explain": "If it were doing that, the misses would be expected to hurt less over time - instead, the pattern described shows him giving up on clarifying, which likely produces more unresolved misses, not fewer painful ones."
            },
            {
              "label": "Accurately reflecting how most people actually are",
              "isTarget": false,
              "explain": "This treats a fast, sweeping conclusion from limited evidence as an accurate general truth, when the pattern being shown is specifically about how quickly and disproportionately that conclusion formed."
            }
          ],
          "whyPrompt": "In a few words - why doesn't giving up on clarifying actually protect against future hurt?"
        },
        "apply": {
          "scenario": "A friend, hearing Aarav describe both moments, asks: \"Has deciding no one understands you ever actually made a future misunderstanding hurt less?\" Aarav pauses. \"...No, actually. It still stings just as much. I just also don't bother trying to explain anymore.\"",
          "prompt": "That's usually the tell. In two or three sentences: think of a time a sweeping conclusion like this didn't actually protect you from anything - what happened instead?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the pattern to notice is whether the conclusion actually reduced the sting of future misses, or just reduced the willingness to try clarifying again."
        },
        "remember": {
          "prompt": "In a sentence or two: what does giving up on clarifying usually feel like for you, in the moment you decide not to bother?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t4",
        "title": "What checking understanding can look like",
        "role": "Contrast / boundary case",
        "delayedRef": "w1t3_apply",
        "delayedPrompt": "Last touch, you named this:",
        "relate": {
          "text": [
            "Here's what a similar moment can look like for someone who responds to a miss differently.",
            "<b class='who'>Diya</b> has conversations that go sideways too, the same way anyone's do. But she's learned to check, in the moment, whether what she heard actually matches what the other person meant, rather than assuming a mismatch means no one understands her at all.",
            "This is the module's contrast case for this pattern: real misunderstandings, still genuinely happening - not the absence of a miss, but a different response to it in the moment it occurs."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What actually makes Diya's response different from Aarav's? All three can look similar in the moment.",
          "options": [
            {
              "label": "She checks whether a mismatch has actually happened, in the moment, rather than immediately concluding a broad pattern from a single miss",
              "isTarget": true,
              "explain": "That's the real difference - not that her conversations go better in general, but that she checks the specific moment rather than jumping to a sweeping conclusion about it."
            },
            {
              "label": "The people she talks to are generally better listeners than the people in Aarav's life",
              "isTarget": false,
              "explain": "There's no basis for that comparison in the scenario - the difference described is in Diya's own response to a miss, not in who she happens to be talking to."
            },
            {
              "label": "She simply doesn't get as frustrated by miscommunication",
              "isTarget": false,
              "explain": "The scenario doesn't suggest that - it describes a specific behavioral difference (checking in the moment), not a difference in how frustrated she feels."
            }
          ],
          "whyPrompt": "In a few words - how does checking in the moment change what happens next, compared to assuming?"
        },
        "apply": {
          "scenario": "A colleague asks Diya how she handles it when a conversation seems to be going sideways. She says: \"I just ask, right then, whether what I'm hearing back actually matches what I meant. Sometimes it doesn't, and we can fix it right there instead of both walking away with the wrong idea.\"",
          "prompt": "In two or three sentences: think of a recent conversation that felt like it went sideways - what would checking in the moment, the way Diya does, have actually sounded like?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the useful pattern is noticing whether there was a real moment to check in, or whether the conversation moved too fast to catch it."
        },
        "remember": {
          "prompt": "In a sentence or two: name one phrase you could imagine actually using to check understanding in the moment.",
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
            "One more, and then a small piece of what actually happened with Aarav.",
            "A week later, he mentioned to his partner, almost as an aside, that the earlier conversation had left him feeling unheard - and this time, instead of defending the original comment, his partner actually stopped and asked what he'd meant. The conversation that had failed once went differently the second time, once named directly.",
            "That's not a coincidence, and it previews the tools coming in Week 5: understanding often requires actually checking or naming the gap directly - it doesn't reliably happen on its own, but it isn't unreachable either. The tools ahead don't promise every conversation will land - they give you a way to actually close the gap when it doesn't."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does the second conversation going differently tell us about the first one?",
          "options": [
            {
              "label": "Naming the gap directly produced a different outcome than the first attempt, which suggests the miss wasn't permanent or unfixable, just unaddressed until named directly",
              "isTarget": true,
              "explain": "Right - the same underlying issue, addressed directly the second time, produced real understanding. That's evidence the gap was fixable, not evidence that no one understands him."
            },
            {
              "label": "His partner just happened to be in a more receptive mood the second time",
              "isTarget": false,
              "explain": "This attributes the shift to chance, when a more direct explanation is available: naming the gap explicitly, rather than assuming it would be understood implicitly, is what actually changed."
            },
            {
              "label": "It doesn't really prove anything, since the first conversation still failed",
              "isTarget": false,
              "explain": "The first conversation failing doesn't cancel out what the second one demonstrates - that naming the gap directly is a real, workable path to being understood, even after an initial miss."
            }
          ],
          "whyPrompt": "In a few words - why does naming a gap directly work better than hoping it resolves on its own?"
        },
        "apply": {
          "scenario": "A different person, same shape of realisation: after a friend misunderstood something Priya said at a group dinner, she mentions it directly a few days later - and finds her friend genuinely didn't realise, apologising and actually understanding once Priya explained clearly.",
          "prompt": "In two or three sentences: what does that later conversation tell Priya about the original misunderstanding?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"The misunderstanding wasn't a sign her friend doesn't get her - it just hadn't been named directly yet, which is exactly what fixed it once she did.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of a misunderstanding you never went back to name directly - what might happen if you did?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: feeling misunderstood, and how a single real miss can generalize into a sweeping conclusion that discourages trying again, even though naming the gap directly often actually resolves it. Next week: frequent arguments, a related but distinct pattern."
  },
  {
    "num": 2,
    "title": "Frequent arguments: recognising the pattern",
    "mechanism": "B",
    "kind": "blocked",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w2t1",
        "title": "Recognition - the small trigger",
        "role": "Recognition #1",
        "delayedRef": "w1t5_apply",
        "delayedPrompt": "Last touch, on Priya, you wrote this:",
        "relate": {
          "text": [
            "A different pattern this week: <b>frequent arguments</b> - recurring conflict, often escalating quickly from small triggers, leaving both people flooded and unable to actually resolve anything.",
            "Here's what that looks like. <b class='who'>Sanjana</b> and her partner start arguing over a genuinely small thing - dishes left in the sink. Within a few minutes, the argument has moved far past the dishes, into old, unrelated grievances, both raising their voices, neither really tracking how it escalated so fast."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "Which of these actually explains what's happening? More than one will sound reasonable.",
          "options": [
            {
              "label": "A minor trigger escalated rapidly into unrelated territory, following a pattern that has more to do with how the argument unfolds than with the dishes themselves",
              "isTarget": true,
              "explain": "Right - the dishes aren't really what the argument became about. The pattern worth noticing is the rapid escalation itself, not the size of the original trigger."
            },
            {
              "label": "The dishes were clearly a bigger issue than they seemed",
              "isTarget": false,
              "explain": "This tries to justify the escalation's scale by inflating the original trigger's importance, when the pattern being shown is specifically about how a small trigger escalates disproportionately, not about the dishes being secretly significant."
            },
            {
              "label": "Sanjana's partner is being unreasonable by bringing up old grievances",
              "isTarget": false,
              "explain": "This assigns blame to one person for the escalation, when the pattern described is mutual and rapid - both people are escalating together, not one person derailing a reasonable conversation."
            }
          ],
          "whyPrompt": "In a few words - what's the giveaway that this is about escalation, not about the size of the original trigger?"
        },
        "apply": {
          "scenario": "Same pattern, a different person: what starts as a small disagreement about weekend plans between Rohan and his brother turns, within minutes, into a heated argument about years-old family decisions, neither quite sure how they got there.",
          "prompt": "Same thing happening here. In two or three sentences: what would you actually say to Rohan right now?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"The weekend plans aren't really what this became about - it's worth noticing how fast it escalated into old territory, since that's the actual pattern, not the original disagreement.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of a real moment this applies to you - what small trigger has escalated far past its actual size?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t2",
        "title": "Recognition - unable to think clearly",
        "role": "Recognition #2",
        "delayedRef": "w2t1_apply",
        "delayedPrompt": "Last touch, on Rohan, you wrote this:",
        "relate": {
          "text": [
            "Same Sanjana, a few minutes further into the argument. Her heart is racing, her thoughts feel scattered, and she notices she can't actually track what her partner is saying anymore - she's just waiting for her turn to respond, not really listening.",
            "Notice what's carried over: this isn't just an argument about content anymore. Something physical is happening - a real state that's making it harder to actually think or listen, regardless of what's being said."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What's actually happening to Sanjana in this moment? Read all three carefully.",
          "options": [
            {
              "label": "A real physiological state - racing heart, scattered thinking - is making clear thought and real listening difficult, independent of the argument's actual content",
              "isTarget": true,
              "explain": "Right - this is flooding: a genuine physical state that limits what's available mentally, regardless of how reasonable or unreasonable the actual content of the argument is."
            },
            {
              "label": "She's just being stubborn and not really trying to listen",
              "isTarget": false,
              "explain": "This treats a real physiological state as a choice or character flaw, when what's being described is a genuine, common response to escalation that affects the capacity to listen, not the willingness."
            },
            {
              "label": "Her partner must be saying something particularly unreasonable",
              "isTarget": false,
              "explain": "There's no evidence about the content of what's being said - the pattern described is about Sanjana's own physical state affecting her ability to track it, not about the reasonableness of the content itself."
            }
          ],
          "whyPrompt": "In a few words - why does it matter that this is a physical state, not just a disagreement about content?"
        },
        "apply": {
          "scenario": "A different person, same shape of moment: mid-argument with his sister, Dev notices his hands are shaking and he's repeating the same point over and over, unable to actually take in anything she's saying back.",
          "prompt": "In two or three sentences: what's actually going on for Dev, and what would you point out about what's happening in his body?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"His body is in a real state of flooding right now - the shaking, the repetition - which is limiting what he can actually take in, separate from whatever his sister is saying.\""
        },
        "remember": {
          "prompt": "In a sentence or two: have you noticed physical signs like this during an argument before? What do they usually feel like?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t3",
        "title": "What continuing to argue while flooded is actually costing",
        "role": "Functional logic",
        "delayedRef": "w2t2_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Between the dishes and the racing heart, there's a pattern worth naming honestly: pushing through and continuing the argument can feel like the only way to actually resolve it - stopping feels like avoiding the issue.",
            "What it actually produces is different: past a certain point of flooding, nothing productive is really happening - both people are reacting, not resolving, and the argument tends to just get louder and more scattered rather than closer to any actual resolution."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does continuing to argue while flooded actually produce? These are close - think it through.",
          "options": [
            {
              "label": "More escalation and reactivity, without actually moving toward resolution, since clear thinking becomes harder the longer the flooded state continues",
              "isTarget": true,
              "explain": "That's the real pattern - flooding doesn't resolve by pushing through it; it tends to compound, making the argument louder and less productive the longer it continues."
            },
            {
              "label": "Genuine progress toward resolving the underlying issue",
              "isTarget": false,
              "explain": "If it were producing that, some real movement toward resolution would be expected - instead, the pattern described shows both people becoming less able to listen or think clearly, not closer to resolving anything."
            },
            {
              "label": "A necessary release of built-up tension that clears the air",
              "isTarget": false,
              "explain": "This assumes escalation itself is cathartic and resolves something, when the pattern being described specifically shows both people becoming less capable of productive engagement, not relieved of tension."
            }
          ],
          "whyPrompt": "In a few words - why doesn't pushing through flooding actually get an argument closer to resolution?"
        },
        "apply": {
          "scenario": "A friend, hearing Sanjana describe the argument afterward, asks: \"Once your heart was racing and you couldn't really track what he was saying, did continuing the argument actually resolve the original dish issue?\" Sanjana pauses. \"...No. We just both said things we didn't mean, and it took days to actually address the dishes at all.\"",
          "prompt": "That's usually the tell. In two or three sentences: think of an argument that kept going past the point either of you could think clearly - did it actually resolve anything?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the pattern to notice is whether continuing past flooding actually produced resolution, or just more escalation that had to be cleaned up afterward."
        },
        "remember": {
          "prompt": "In a sentence or two: what does the moment right before you start feeling flooded in an argument usually feel like?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t4",
        "title": "What noticing flooding early can look like",
        "role": "Contrast / boundary case",
        "delayedRef": "w2t3_apply",
        "delayedPrompt": "Last touch, you named this:",
        "relate": {
          "text": [
            "Here's what a similar argument can look like for someone who relates to escalation differently.",
            "<b class='who'>Ritu</b> has real arguments too, the same as anyone in a close relationship does. But she's learned to notice the early signs of flooding, in herself or the other person, and calls a real pause before things escalate past the point either of them can actually resolve anything.",
            "This is the module's contrast case for this pattern: real conflict, genuinely happening - not the absence of arguments, but a different response once flooding starts to show up."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What actually makes Ritu's approach different from Sanjana's? All three can look similar in the moment.",
          "options": [
            {
              "label": "She notices the early physical signs of flooding and calls a real pause before the argument escalates past the point of clear thinking",
              "isTarget": true,
              "explain": "That's the real difference - not that her arguments are calmer to begin with, but that she catches the flooding early enough to actually interrupt the escalation."
            },
            {
              "label": "Her arguments are generally about smaller, less significant issues",
              "isTarget": false,
              "explain": "There's no basis for that in the scenario - the difference described is in what Ritu does once flooding starts, not in the size or significance of what the arguments are about."
            },
            {
              "label": "She simply doesn't get as physically activated during conflict",
              "isTarget": false,
              "explain": "The scenario doesn't suggest that - it describes her noticing real signs of flooding, in herself or the other person, not an absence of physical activation altogether."
            }
          ],
          "whyPrompt": "In a few words - why does catching flooding early matter more than trying to power through it?"
        },
        "apply": {
          "scenario": "A colleague asks Ritu how she keeps arguments from spiraling. She says: \"I notice when my heart starts racing, or when I stop really hearing the other person, and I just say we need a real break - not to avoid it, just to actually come back to it once we can think again.\"",
          "prompt": "In two or three sentences: think of a recent argument that escalated - was there an early moment you could have called a pause, the way Ritu does?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the useful pattern is noticing whether there was an early, catchable moment, or whether the escalation happened too fast to catch."
        },
        "remember": {
          "prompt": "In a sentence or two: name one physical sign that would tell you, early, that you're starting to get flooded.",
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
            "One more, and then a small piece of what actually happened with Sanjana.",
            "The next day, once both of them had calmed down, they actually talked about the dishes - calmly, in about five minutes, reaching a real, workable agreement. The issue that had produced a twenty-minute escalating argument the night before turned out to be genuinely simple to resolve, once neither person was flooded.",
            "That's not a coincidence, and it previews the tools coming in Week 6: the actual issue underneath an argument is often far more resolvable than the escalated argument itself makes it seem - the escalation, not the issue, is usually what makes things feel unsolvable. The tools ahead don't promise arguments will stop happening - they give you a way to get back to the actual issue."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does the five-minute resolution the next day tell us about the twenty-minute argument the night before?",
          "options": [
            {
              "label": "The escalation itself, not the underlying issue, was what had made things feel unresolvable - the actual issue was genuinely simple once addressed without flooding",
              "isTarget": true,
              "explain": "Right - this is a real, important distinction: the argument's difficulty came from the escalation, not from the dishes being a genuinely hard problem to solve."
            },
            {
              "label": "They just got lucky that the issue turned out to be simple",
              "isTarget": false,
              "explain": "This attributes the easy resolution to chance, when a more direct explanation is available: the issue was simple all along, and the escalation the night before was what made it seem otherwise."
            },
            {
              "label": "The nighttime argument was pointless and shouldn't have happened at all",
              "isTarget": false,
              "explain": "This is a harsher judgment than the moment calls for - flooding and escalation are a common, real pattern, not simply avoidable through better judgment in the moment. The point is noticing the pattern, not blaming it."
            }
          ],
          "whyPrompt": "In a few words - why does it matter that the issue was easy to resolve once flooding wasn't part of the conversation?"
        },
        "apply": {
          "scenario": "A different person, same shape of realisation: after a heated argument about weekend chores, Yusuf and his roommate revisit the same issue calmly the next morning and settle it in a few minutes, both surprised at how simple it turned out to be.",
          "prompt": "In two or three sentences: what does that next-morning conversation tell Yusuf about the argument the night before?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"The issue itself was never really the hard part - the escalation the night before made it feel unsolvable, when it turned out to be simple once addressed calmly.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of an argument that felt unsolvable in the moment - was the underlying issue actually as hard as the argument made it feel?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: frequent arguments, and how physiological flooding, not the size of the original issue, is usually what makes an argument feel unsolvable. Next week: joint family and in-law conflict, where more than two people are often involved."
  },
  {
    "num": 3,
    "title": "In-law conflict: recognising the pattern",
    "mechanism": "C",
    "kind": "blocked",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w3t1",
        "title": "Recognition - caught in the middle",
        "role": "Recognition #1",
        "delayedRef": "w2t5_apply",
        "delayedPrompt": "Last touch, on Yusuf, you wrote this:",
        "relate": {
          "text": [
            "This week's pattern is different in shape from the last two: <b>joint family and in-law conflict</b> - conflict arising from close, often daily contact with extended family, where more than two people are frequently involved at once.",
            "Here's what that looks like. <b class='who'>Priyanka</b> finds herself in the middle of a disagreement between her husband and his mother about a household decision. Neither is speaking to the other about it directly - both are raising it with Priyanka instead, each expecting her to relay their side, or to simply agree with them."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "Which of these actually explains what's happening? More than one will sound reasonable.",
          "options": [
            {
              "label": "Priyanka has been pulled into a conflict that's actually between two other people, being asked to carry messages and take sides in a dispute that isn't really hers",
              "isTarget": true,
              "explain": "Right - this is triangulation: a conflict between two people being routed through a third person instead of being addressed directly between the two who actually disagree."
            },
            {
              "label": "She's the natural person to help resolve this, given her closeness to both",
              "isTarget": false,
              "explain": "Being close to both people doesn't automatically make someone the right go-between for a conflict that's actually between the other two - this frames triangulation as a helpful role rather than naming the pattern itself."
            },
            {
              "label": "She should just pick a side to end the tension faster",
              "isTarget": false,
              "explain": "This assumes resolution requires taking a side, when the actual pattern worth noticing is that the conflict is being avoided directly by both original parties, not that a decisive third-party verdict is what's missing."
            }
          ],
          "whyPrompt": "In a few words - what's the giveaway that this is triangulation, not just Priyanka helping out?"
        },
        "apply": {
          "scenario": "Same pattern, a different person: Rehan's father and his wife disagree about weekend plans, and both keep raising it with Rehan separately, expecting him to pass along their position rather than discussing it with each other directly.",
          "prompt": "Same thing happening here. In two or three sentences: what would you actually say to Rehan right now?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"This disagreement is actually between your father and your wife - being asked to relay both sides means you're being pulled into a conflict that isn't really yours to carry.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of a real moment this applies to you - when have you been caught in the middle of a conflict between two other family members?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w3t2",
        "title": "Recognition - the unclear authority",
        "role": "Recognition #2",
        "delayedRef": "w3t1_apply",
        "delayedPrompt": "Last touch, on Rehan, you wrote this:",
        "relate": {
          "text": [
            "Same Priyanka, a different context. A decision about the household budget comes up, and it's genuinely unclear who actually has authority to decide - her husband assumes it's his role, his mother assumes it's hers based on longstanding household practice, and Priyanka isn't sure where she fits in either.",
            "Notice what's carried over: this isn't just about being caught in the middle of a specific disagreement anymore. The roles and authority in the household itself are genuinely unclear, which makes almost any decision a potential source of friction."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What's actually happening with the budget decision? Read all three carefully.",
          "options": [
            {
              "label": "The household's actual roles and authority are genuinely unclear, which means almost any specific decision can become a point of friction, not just this particular one",
              "isTarget": true,
              "explain": "Right - the budget decision is really surfacing a deeper, unresolved question about roles, which is why it's not really about the budget specifically."
            },
            {
              "label": "Priyanka's husband is clearly right that it's his decision to make",
              "isTarget": false,
              "explain": "The scenario doesn't establish that any one person's claim to authority is objectively correct - it shows genuine ambiguity between two real, competing assumptions, not a clear right answer being ignored."
            },
            {
              "label": "This particular decision just happens to be unusually contentious",
              "isTarget": false,
              "explain": "This treats it as an isolated, unlucky instance, when the pattern being shown is a more general, ongoing unclarity about roles that would likely surface with many different decisions, not just this one."
            }
          ],
          "whyPrompt": "In a few words - why does this go beyond just one disagreement about the budget?"
        },
        "apply": {
          "scenario": "A different person, same shape of moment: Ananya notices that decisions about her children's schedules keep becoming points of tension, because it's never been clarified whether she, her husband, or her mother-in-law - who helps with childcare daily - actually has final say.",
          "prompt": "In two or three sentences: what's actually going on for Ananya, and what would you point out about the underlying issue?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"The recurring tension over schedules is really pointing at an unresolved question about who actually has authority here - which is worth naming directly, rather than re-litigating each specific schedule decision separately.\""
        },
        "remember": {
          "prompt": "In a sentence or two: is there a role or authority question in your own household that's never actually been clarified?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w3t3",
        "title": "What staying in the middle is actually costing",
        "role": "Functional logic",
        "delayedRef": "w3t2_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Between being the message-carrier and the unclear budget authority, there's a pattern worth naming honestly: staying in the middle can feel like keeping the peace - preventing the two other people from having to face each other directly.",
            "What it actually does is different: it doesn't resolve the underlying disagreement, and it puts Priyanka in the position of managing a conflict that isn't hers, repeatedly, without the actual authority question ever getting addressed."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What is staying in the middle actually doing? These are close - think it through.",
          "options": [
            {
              "label": "Managing the appearance of the conflict without resolving the underlying disagreement, while placing the burden of that management repeatedly on the person in the middle",
              "isTarget": true,
              "explain": "That's the real cost - the conflict doesn't go away, it just gets routed through a third person who now carries the burden of managing it, again and again."
            },
            {
              "label": "Genuinely protecting the family from open conflict",
              "isTarget": false,
              "explain": "If it were doing that, the underlying disagreement would be expected to actually resolve over time - instead, the pattern described shows it resurfacing repeatedly, just always mediated rather than addressed directly."
            },
            {
              "label": "A reasonable way to keep everyone's feelings considered",
              "isTarget": false,
              "explain": "This treats ongoing mediation as inherently considerate, when the pattern being shown is that it prevents the two people who actually disagree from ever working it out between themselves."
            }
          ],
          "whyPrompt": "In a few words - why doesn't staying in the middle actually resolve the underlying disagreement?"
        },
        "apply": {
          "scenario": "A friend, hearing Priyanka describe both moments, asks: \"Has relaying messages between them ever actually resolved anything, or does a new version of the same disagreement keep coming back?\" Priyanka pauses. \"...It keeps coming back, honestly. Just about different things each time.\"",
          "prompt": "That's usually the tell. In two or three sentences: think of a conflict you've been relaying or managing between two other people - has it actually resolved, or does it keep resurfacing?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the pattern to notice is whether staying in the middle has actually led to resolution, or just to the same underlying tension resurfacing in new forms."
        },
        "remember": {
          "prompt": "In a sentence or two: what does being caught in the middle usually feel like for you, physically or in your thinking?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w3t4",
        "title": "What clearer roles can look like",
        "role": "Contrast / boundary case",
        "delayedRef": "w3t3_apply",
        "delayedPrompt": "Last touch, you named this:",
        "relate": {
          "text": [
            "Here's what a similar household can look like for someone with a clearer sense of the system around her.",
            "<b class='who'>Nandini</b> lives in a similarly close joint-family arrangement, with real, ongoing tension around authority and roles - that hasn't gone away. But she's built a clearer sense of who actually holds which roles in the family system, which has made specific conflicts easier to name and address directly.",
            "This is the module's contrast case for this pattern: real, ongoing complexity in a larger family system, honestly acknowledged - not the absence of unclear roles, but a clearer map of them to work from."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What actually makes Nandini's situation different from Priyanka's? All three can look similar in the moment.",
          "options": [
            {
              "label": "She has an actual, clearer sense of the roles and authority in her household system, which lets her address specific conflicts more directly rather than getting pulled into the middle repeatedly",
              "isTarget": true,
              "explain": "That's the real difference - not that her household has fewer disagreements, but that she has a clearer map of the system, which changes how specific conflicts get addressed."
            },
            {
              "label": "Her in-laws are generally easier to get along with",
              "isTarget": false,
              "explain": "The scenario describes real, ongoing tension for Nandini too - the difference isn't in how easy the relationships are, it's in the clarity she's built about how the system actually works."
            },
            {
              "label": "She's simply less involved in her extended family's decisions",
              "isTarget": false,
              "explain": "There's no basis for that in the scenario - the difference described is about clarity of roles, not about the level of her involvement in the family."
            }
          ],
          "whyPrompt": "In a few words - how does a clearer sense of the system change what happens with a specific conflict?"
        },
        "apply": {
          "scenario": "A colleague asks Nandini how she navigates her joint-family household. She says: \"I've actually mapped out, for myself, who tends to hold which kind of decision. It doesn't stop disagreements, but it means I'm not constantly guessing whose call something actually is.\"",
          "prompt": "In two or three sentences: think of your own family system - what would mapping out the actual roles and authority, the way Nandini has, reveal?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the useful pattern is noticing whether the roles in your own system are genuinely clear, or whether they're currently more assumed than actually established."
        },
        "remember": {
          "prompt": "In a sentence or two: name one role or authority question in your household you've never actually seen mapped out clearly.",
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
            "One more, and then a small piece of what actually happened with Priyanka.",
            "She stopped relaying the budget disagreement and, instead, suggested her husband and his mother actually discuss it directly, together, just once. It was awkward, and didn't fully resolve everything - but for the first time, the two people who actually disagreed were talking to each other about it, rather than through her.",
            "That's not a coincidence, and it previews the tools coming in Week 7: a conflict routed through a third person rarely gets resolved by that person - it usually needs the two people who actually disagree to engage directly, even if a family system makes that harder than a simple two-person conversation. The tools ahead don't promise every family conflict will resolve easily - they give you a way to work with the larger system rather than just carrying it alone."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does the direct conversation, even an imperfect one, reveal about the pattern of relaying messages?",
          "options": [
            {
              "label": "Getting the two actual parties to engage directly, even imperfectly, did something that repeated message-relaying never managed to do - move the conflict toward the people who could actually resolve it",
              "isTarget": true,
              "explain": "Right - imperfect direct engagement is still a meaningfully different, more productive step than continued relaying, even without full resolution."
            },
            {
              "label": "It probably would have gone the same way through Priyanka relaying it too",
              "isTarget": false,
              "explain": "This dismisses a real, structural difference - a direct conversation between the two actual parties is categorically different from a third party carrying messages back and forth, regardless of how smoothly either goes."
            },
            {
              "label": "It doesn't count as progress since it didn't fully resolve things",
              "isTarget": false,
              "explain": "This sets an unreasonably high bar - a genuinely new kind of engagement, even if imperfect, is still meaningfully different progress from the repeated, unresolved pattern of relaying that came before it."
            }
          ],
          "whyPrompt": "In a few words - why does direct engagement matter even when it doesn't fully resolve the issue?"
        },
        "apply": {
          "scenario": "A different person, same shape of realisation: after months of relaying disagreements between her father and her aunt about caregiving arrangements, Simran finally arranges a direct conversation between them - awkward, unresolved on some points, but genuinely different from anything that happened while she carried messages between them.",
          "prompt": "In two or three sentences: what does that direct conversation tell Simran about the months of relaying beforehand?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"The months of relaying never actually moved the conflict toward resolution - the direct conversation, even imperfect, did something the relaying never could.\""
        },
        "remember": {
          "prompt": "In a sentence or two: is there a conflict you're currently relaying between two other family members - what would a direct conversation between them actually look like?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: joint family and in-law conflict, and how getting caught in the middle of a conflict that's actually between two other people rarely resolves it, while direct engagement, even imperfect, moves things forward. Next week: sibling conflict, where old family roles often shape present-day friction."
  },
  {
    "num": 4,
    "title": "Sibling conflict: recognising the pattern",
    "mechanism": "D",
    "kind": "blocked",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w4t1",
        "title": "Recognition - the old role resurfacing",
        "role": "Recognition #1",
        "delayedRef": "w3t5_apply",
        "delayedPrompt": "Last touch, on Simran, you wrote this:",
        "relate": {
          "text": [
            "This week's pattern is the fourth and last: <b>sibling conflict</b> - conflict between siblings, often rooted in long-standing role patterns established early in life, that continue to shape adult interactions.",
            "Here's what that looks like. At a family event, <b class='who'>Rajat</b>'s younger brother makes a passing comment implying Rajat isn't handling something responsibly. Rajat feels a flash of anger far bigger than the comment itself seems to warrant - and recognizes, with some discomfort, that he's slipping back into an old role: the one who always has to prove he's actually the responsible one."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "Which of these actually explains what's happening? More than one will sound reasonable.",
          "options": [
            {
              "label": "A minor comment triggered a reaction disproportionate to the moment, because it activated an old, long-standing family role rather than responding to just this one comment",
              "isTarget": true,
              "explain": "Right - the size of the reaction is the tell. A passing comment wouldn't normally produce this much heat, unless it's landing on an old, sensitized role."
            },
            {
              "label": "His brother's comment was genuinely more insulting than it seemed",
              "isTarget": false,
              "explain": "The scenario describes it as a passing comment - the size of Rajat's reaction is disproportionate to what's described, which is exactly the pattern worth noticing, not evidence the comment was secretly more serious."
            },
            {
              "label": "Rajat is just naturally sensitive to criticism",
              "isTarget": false,
              "explain": "This treats the reaction as a general personality trait, when the pattern being shown is specifically tied to an old, particular family role - not a general sensitivity to any criticism from anyone."
            }
          ],
          "whyPrompt": "In a few words - what's the giveaway that this is about an old role, not just this one comment?"
        },
        "apply": {
          "scenario": "Same pattern, a different person: when her older sister jokingly suggests she's \"still as disorganized as ever,\" Tara feels a sharp, disproportionate sting, recognizing she's slipping into an old family role as \"the scattered one\" that she thought she'd left behind years ago.",
          "prompt": "Same thing happening here. In two or three sentences: what would you actually say to Tara right now?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"That sting is bigger than one joking comment usually deserves - it sounds like it's landing on an old role, not just on today's comment specifically.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of a real moment this applies to you - what old sibling role has resurfaced in a reaction that felt bigger than the moment called for?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w4t2",
        "title": "Recognition - the pattern repeating",
        "role": "Recognition #2",
        "delayedRef": "w4t1_apply",
        "delayedPrompt": "Last touch, on Tara, you wrote this:",
        "relate": {
          "text": [
            "Same Rajat, thinking back further. He realizes this isn't the first time - variations of this exact dynamic, him feeling compelled to prove his responsibility to this particular brother, have played out for years, since well before either of them were adults.",
            "Notice what's carried over: this isn't a one-off reaction to one comment. It's a role that's been playing out consistently, in different specific forms, for a long time."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What's actually significant about the pattern going back years? Read all three carefully.",
          "options": [
            {
              "label": "A long-standing role, established well before adulthood, has continued shaping present-day interactions, regardless of how much either brother has actually changed since then",
              "isTarget": true,
              "explain": "Right - the role itself may no longer accurately reflect who either of them actually is now, but it's continued operating as if it still does."
            },
            {
              "label": "He genuinely has always been, and still is, the more responsible sibling",
              "isTarget": false,
              "explain": "This accepts the role as an accurate, permanent description, when the pattern worth noticing is specifically that old roles tend to persist whether or not they still actually fit."
            },
            {
              "label": "His brother has always been deliberately provoking him",
              "isTarget": false,
              "explain": "This assumes intentional provocation without evidence, when the pattern being shown is about a role dynamic that both siblings may be participating in without either necessarily intending harm."
            }
          ],
          "whyPrompt": "In a few words - why does it matter that this role goes back to before adulthood?"
        },
        "apply": {
          "scenario": "A different person, same shape of realisation: Ishaan notices that he and his sister still fall into the same \"peacemaker\" and \"instigator\" roles they had as children, even now, in their thirties, in ways that don't really reflect who either of them actually is anymore.",
          "prompt": "In two or three sentences: what's actually going on for Ishaan, and what would you point out about how long this pattern has been running?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"Those roles were established decades ago and may not accurately describe either of you now - the pattern's persistence doesn't mean it's still actually accurate.\""
        },
        "remember": {
          "prompt": "In a sentence or two: is there an old sibling role of yours that's persisted longer than it's actually still fit?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w4t3",
        "title": "What the old role is actually protecting",
        "role": "Functional logic",
        "delayedRef": "w4t2_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Between the passing comment and the years of the same pattern, there's a pattern worth naming honestly: staying in the old role - proving responsibility, defending the familiar position - can feel like keeping something stable and known in a long relationship.",
            "What it actually does is different: it keeps both siblings responding to old, outdated versions of each other rather than to who they've each actually become, which tends to produce exactly the kind of disproportionate friction Rajat felt over one small comment."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What is staying in the old role actually doing? These are close - think it through.",
          "options": [
            {
              "label": "Keeping both siblings responding to old, outdated versions of each other, which produces friction disproportionate to whatever the present moment actually calls for",
              "isTarget": true,
              "explain": "That's the real mechanism - the old role is essentially responding to a version of the relationship that may not exist anymore, which is exactly what makes small moments land so much harder than they should."
            },
            {
              "label": "Genuinely reflecting who each of them still actually is",
              "isTarget": false,
              "explain": "If that were true, the reaction wouldn't be disproportionate to the actual comment - the size of the reaction is exactly what suggests the old role isn't a fully accurate fit anymore."
            },
            {
              "label": "Providing helpful, stable structure to a long relationship",
              "isTarget": false,
              "explain": "This frames the old role as a stabilizing feature, when the pattern being shown is that it's producing exactly the kind of outsized friction that makes the relationship harder, not easier, to navigate."
            }
          ],
          "whyPrompt": "In a few words - why does responding to an old version of a sibling produce more friction, not less?"
        },
        "apply": {
          "scenario": "A friend, hearing Rajat describe the pattern, asks: \"Is your brother's comment actually about who you are now, or is it landing on a role from years ago that maybe doesn't fully apply anymore?\" Rajat pauses. \"...Probably the old role, honestly. I don't think he even meant it that seriously.\"",
          "prompt": "That's usually the tell. In two or three sentences: think of a sibling reaction of yours that might be landing on an old role rather than the present moment - what would separating the two actually look like?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the pattern to notice is whether the reaction is proportionate to the present moment, or disproportionately large in a way that suggests an old role is doing most of the work."
        },
        "remember": {
          "prompt": "In a sentence or two: what does slipping into an old sibling role usually feel like for you, in the moment it happens?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w4t4",
        "title": "What separating old from new can look like",
        "role": "Contrast / boundary case",
        "delayedRef": "w4t3_apply",
        "delayedPrompt": "Last touch, you named this:",
        "relate": {
          "text": [
            "Here's what a similar moment can look like for someone who relates to an old role differently.",
            "<b class='who'>Amit</b> has real, long-standing tension with a sibling too, rooted in old family patterns that go back decades. But he's gotten clearer about which parts of the current friction are actually about the present situation, and which parts are really old, inherited roles resurfacing.",
            "This is the module's contrast case for this pattern: real, long-standing sibling tension, honestly acknowledged - not the absence of old roles, but a clearer separation between what's actually current and what's really old history resurfacing."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What actually makes Amit's approach different from Rajat's? All three can look similar in the moment.",
          "options": [
            {
              "label": "He's built a real, working ability to separate what's actually about the present moment from what's an old role resurfacing, rather than reacting to both as if they were the same thing",
              "isTarget": true,
              "explain": "That's the real difference - not that his sibling relationship has less history, but that he's gotten better at telling the two apart in the moment."
            },
            {
              "label": "His sibling relationship has less complicated history than Rajat's",
              "isTarget": false,
              "explain": "The scenario describes real, long-standing tension for Amit too - the difference isn't in how much history exists, it's in his ability to separate old patterns from present-day reality."
            },
            {
              "label": "He's simply a calmer person in general",
              "isTarget": false,
              "explain": "There's no basis for that in the scenario - what's described is a specific, learnable skill (separating old from new), not a general personality trait."
            }
          ],
          "whyPrompt": "In a few words - how does separating 'old role' from 'present moment' change how a comment actually lands?"
        },
        "apply": {
          "scenario": "A colleague asks Amit how he manages long-standing sibling tension. He says: \"When something stings more than it should, I try to ask myself whether it's really about right now, or whether it's an old role from years ago showing up again. That question alone changes a lot.\"",
          "prompt": "In two or three sentences: think of a recent sibling moment that stung more than expected - was it actually about the present, or an old role resurfacing, the way Amit describes?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the useful pattern is noticing whether the reaction's size actually matches the present moment, or points toward something older."
        },
        "remember": {
          "prompt": "In a sentence or two: name one old sibling role of yours you could imagine actually questioning next time it resurfaces.",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w4t5",
        "title": "What actually happened",
        "role": "Reinforcing rep",
        "delayedRef": "w4t4_apply",
        "delayedPrompt": "Last touch, your idea was:",
        "relate": {
          "text": [
            "One more, and then a small piece of what actually happened with Rajat.",
            "Later that evening, he mentioned to his brother, half-joking but genuinely, that he still felt like he had to prove himself responsible around him, even now. His brother, surprised, admitted he hadn't thought of Rajat that way in years - the \"responsible one\" framing had mostly stopped mattering to him a long time ago.",
            "That's not a coincidence, and it previews the tools coming in Week 8: an old sibling role can persist entirely on one side of a relationship, long after it's actually stopped being relevant to the other. The tools ahead don't promise every old pattern will dissolve easily - they give you a way to actually trace where it came from and test whether it still holds."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does the brother's surprised reaction reveal about the old role Rajat had been carrying?",
          "options": [
            {
              "label": "The old role had been persisting mostly on Rajat's side, and had stopped mattering to his brother in a way Rajat hadn't realized until he actually named it",
              "isTarget": true,
              "explain": "Right - this is a genuinely common pattern: an old role can keep operating in one person's mind long after the other person has actually let it go."
            },
            {
              "label": "His brother was just being kind to smooth things over",
              "isTarget": false,
              "explain": "There's no strong indication of that in the scenario - the brother's surprise reads as genuine, not as a diplomatic softening of an ongoing, real expectation."
            },
            {
              "label": "It doesn't really matter what his brother thinks, since the role still feels real to Rajat",
              "isTarget": false,
              "explain": "How the role feels internally is real and matters, but the new information from his brother is still significant - it reveals the role may be less externally reinforced than Rajat had assumed, which is useful, actionable information."
            }
          ],
          "whyPrompt": "In a few words - why does it matter whether an old role is still actively reinforced by the other person, or just persisting internally?"
        },
        "apply": {
          "scenario": "A different person, same shape of realisation: after finally mentioning she still feels like the 'irresponsible younger one' around her older brother, Kavya learns he stopped seeing her that way years ago and has no idea why she'd still feel that pressure.",
          "prompt": "In two or three sentences: what does that conversation tell Kavya about the role she's been carrying?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"The role has mostly been persisting on her own side - her brother let go of that framing years ago, which is worth knowing before continuing to react as if it were still actively being reinforced.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of an old sibling role you're still carrying - has it ever actually been tested against what the other person currently thinks?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: sibling conflict, and how an old family role can persist on one side of a relationship long after it's stopped being relevant to the other. That's all four patterns recognised. Next week: the tools start, beginning with feeling misunderstood."
  },
  {
    "num": 5,
    "title": "Feeling misunderstood: three tools, and a plan",
    "mechanism": "A",
    "kind": "technique",
    "retrievalCheck": {
      "prompt1": "In your own words - what is feeling misunderstood, and what does the sweeping conclusion 'no one understands me' actually cost, versus what it can feel like it's protecting?",
      "prompt2": "And what is the pattern of frequent arguments - how is physiological flooding different from just disagreeing about something?",
      "reveal": "Feeling misunderstood is when a real, specific miss in communication generalizes into a sweeping conclusion that no one understands you - the conclusion doesn't actually reduce future hurt, it just discourages trying to clarify again. Frequent arguments often escalate past the point of productive conversation because of flooding - a real physiological state (racing heart, scattered thinking) that limits clear thought, separate from whatever the argument is actually about."
    },
    "hasReferenceCard": true,
    "touches": [
      {
        "id": "w5t1",
        "title": "Cognitive Restructuring of 'No One Understands Me'",
        "role": "Technique A2 - CBT (Beck)",
        "delayedRef": "w4t5_apply",
        "delayedPrompt": "Last week, your answer was:",
        "relate": {
          "text": [
            "This is the first of the three tools for feeling misunderstood from your theory grounding screen: <b>cognitive restructuring of the sweeping 'no one understands me' conclusion</b>.",
            "Remember Aarav's conclusion jumping from one miss to 'no one ever'? This tool makes testing that conclusion deliberate: write down the exact overgeneralized thought, and test it against real, specific evidence - is there truly no one, or even one person, who has understood you."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why does a sweeping thought like 'no one understands me' need to be tested against specific evidence, rather than just felt as true?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a sweeping conclusion you've drawn recently, maybe the one you named back in Week 1.",
          "prompt": "In two or three sentences: write the exact thought, then test it - is there real, specific evidence against it?",
          "placeholder": "The thought: ... / The evidence: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the evidence is specific (an actual person, an actual moment), not a vague reassurance."
        },
        "remember": {
          "prompt": "In a sentence or two: did testing the conclusion change how solid it felt?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w5t2",
        "title": "Reflective-Listening Drills",
        "role": "Technique A3 - Person-Centred Therapy (Rogers)",
        "delayedRef": "w5t1_apply",
        "delayedPrompt": "Last touch, your evidence was:",
        "relate": {
          "text": [
            "The second tool: <b>reflective-listening drills</b> - reflecting back what someone else has said, in your own words, before responding with your own point, to confirm understanding before moving forward."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might reflecting back before responding actually prevent a misunderstanding from happening in the first place?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of your next real conversation, or a recent one you could replay.",
          "prompt": "In two or three sentences: practice reflecting back what someone said - \"what I'm hearing is...\" - and describe what happened, or would happen.",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the reflection genuinely captures the other person's point, not just repeats their words."
        },
        "remember": {
          "prompt": "In a sentence or two: did checking your understanding this way feel natural or awkward? Either is useful to notice.",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w5t3",
        "title": "Interpersonal Communication Analysis",
        "role": "Technique A1 - IPT (Klerman & Weissman) - guided",
        "guardrail": true,
        "delayedRef": "w5t2_apply",
        "delayedPrompt": "Last touch, you noticed:",
        "relate": {
          "text": [
            "The third tool: <b>interpersonal communication analysis</b>, mapping a real, recurring misunderstanding with a specific person - what was said, what was heard, what was actually meant - to find where the disconnect keeps happening.",
            "Because this asks you to examine a real, specific relationship pattern in detail, this touch checks in with you directly partway through."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might mapping several instances of a recurring misunderstanding reveal something a single instance can't?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a real, recurring misunderstanding with a specific person in your life.",
          "intensityPrompt": "First, choose how far you want to go with this right now:",
          "intensityOptions": [
            "Smaller version - map just one recent instance",
            "Bigger version - map two or three instances and look for the pattern"
          ],
          "prompt": "In two or three sentences: map what was said, what was heard, and what was actually meant, for the instance or instances you chose.",
          "placeholder": "What was said: ... / What was heard: ... / What was meant: ..."
        },
        "distressPrompt": "You've just examined a real, specific relationship pattern closely. Before we continue - how are you feeling right now?",
        "reveal": {
          "text": "There's no single model answer here - the tell is whether a specific disconnect point emerges, not just a general sense that communication is hard."
        },
        "remember": {
          "prompt": "In a sentence or two: did mapping it reveal a specific pattern you hadn't named before?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w5t4",
        "title": "How did it go",
        "role": "Check-in",
        "delayedRef": "w5t3_apply",
        "delayedPrompt": "Last touch, your pattern was:",
        "relate": {
          "text": [
            "No new idea this touch - just a real check-in on the three tools from this week, the same three that trace back to Aarav's conversation with his partner back in Week 1."
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
        "id": "w5t5",
        "title": "A plan for next time",
        "role": "Pre-commitment",
        "delayedRef": "w5t4_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "One more before we move to frequent arguments: a plan built now, before the next moment a real miss shows up.",
            "There's also a fourth technique for this mechanism - mapping the pursue-withdraw cycle - shown as a reference card rather than a touch. Open it from this week's list if you're curious what it is and why it's not something the app walks you through directly."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Of the three tools this week, which do you trust most to actually reach for in the moment?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Pick whichever of the three tools felt most useful, or most realistic to actually use, this week.",
          "prompt": "In two or three sentences, write an if-then plan: 'If [specific cue], then I will [specific tool, specifically applied].'",
          "placeholder": "If [specific cue], then I will..."
        },
        "reveal": {
          "text": "Something like: \"If I notice a conversation seems to be going sideways, then I'll reflect back what I heard before responding with my own point.\""
        },
        "remember": {
          "prompt": "In a sentence or two: say the plan back to yourself - does it actually sound doable mid-conversation, not just in hindsight?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: three named tools for feeling misunderstood - cognitive restructuring, reflective-listening drills, and interpersonal communication analysis - a real check-in, and a plan built while calm. There's also a fourth technique, mapping the pursue-withdraw cycle, shown as a reference card since it genuinely needs a professional. No new teaching in this summary. Next week: frequent arguments."
  },
  {
    "num": 6,
    "title": "Frequent arguments: four tools, and a plan",
    "mechanism": "B",
    "kind": "technique",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w6t1",
        "title": "Soft Start-Up & Repair Attempts",
        "role": "Technique B1 - Gottman Method",
        "delayedRef": "w5t5_apply",
        "delayedPrompt": "Last week, your if-then plan was:",
        "relate": {
          "text": [
            "This is the first of the four tools for frequent arguments from your theory grounding screen: <b>soft start-up and repair attempts</b>.",
            "Opening a difficult conversation gently rather than with criticism or contempt, and recognizing genuine repair attempts - a joke, an apology, a moment of softening - offered mid-conflict, rather than missing them. Also includes awareness of Gottman's 'Four Horsemen' - criticism, contempt, defensiveness, stonewalling - patterns that reliably predict escalation."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might how a difficult conversation starts predict how the whole conversation goes?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a difficult conversation you need to have, or recently had.",
          "prompt": "In two or three sentences: write a soft start-up for it - describing the issue without criticism or contempt.",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the start-up describes the issue specifically, without blame-loaded language."
        },
        "remember": {
          "prompt": "In a sentence or two: how did the soft version feel different from how you'd normally open that conversation?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w6t2",
        "title": "A Physiological-Flooding Time-Out Protocol",
        "role": "Technique B2 - Gottman Method",
        "delayedRef": "w6t1_apply",
        "delayedPrompt": "Last touch, your start-up was:",
        "relate": {
          "text": [
            "The second tool: <b>a physiological-flooding time-out protocol</b> - recognizing the physical signs of flooding, and calling a structured pause: naming that a break is needed, agreeing on a real duration (at least 20 minutes), and returning afterward."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why does the pause need a real, agreed duration, rather than just walking away indefinitely?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of the physical signs of flooding you named back in Week 2.",
          "prompt": "In two or three sentences: write out what you'd actually say to call a time-out, and how you'd agree on returning to the conversation.",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether it includes a real plan to return, not just an exit."
        },
        "remember": {
          "prompt": "In a sentence or two: does having the exact words ready make this easier to imagine actually using?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w6t3",
        "title": "Interpersonal Role-Dispute Resolution Work",
        "role": "Technique B3 - IPT (Klerman & Weissman) - guided",
        "guardrail": true,
        "delayedRef": "w6t2_apply",
        "delayedPrompt": "Last touch, your plan was:",
        "relate": {
          "text": [
            "The third tool: <b>interpersonal role-dispute resolution work</b> - directly examining a real, ongoing dispute about expectations or responsibilities, identifying each person's stated position, where they diverge, and options for resolving it.",
            "Because this asks you to examine a real, ongoing conflict in a real relationship, this touch checks in with you directly partway through."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might naming the actual, ongoing dispute directly work better than re-litigating each new argument about it?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a real, recurring dispute underneath your frequent arguments, if one exists.",
          "intensityPrompt": "First, choose how far you want to go with this right now:",
          "intensityOptions": [
            "Smaller version - just name each person's stated position",
            "Bigger version - name the positions and explore real options for resolving them"
          ],
          "prompt": "In two or three sentences: name the actual dispute, and - if you chose the bigger version - one real option for resolving it.",
          "placeholder": "The dispute: ... / (If bigger version) An option: ..."
        },
        "distressPrompt": "You've just examined a real, ongoing dispute closely. Before we continue - how are you feeling right now?",
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the dispute is named specifically, not as a vague sense of general friction."
        },
        "remember": {
          "prompt": "In a sentence or two: was the actual dispute easy or hard to name clearly?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w6t4",
        "title": "Thought-Record Work on Conflict-Trigger Appraisals",
        "role": "Technique B4 - CBT (Beck)",
        "delayedRef": "w6t3_apply",
        "delayedPrompt": "Last touch, your dispute was:",
        "relate": {
          "text": [
            "The fourth tool: <b>thought-record work on conflict-trigger appraisals</b> - writing down the specific interpretation that turned a small trigger into an argument, and testing it against real alternative explanations."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why does slowing down to test the interpretation matter more in the heat of an argument than at any other time?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a recent small trigger that escalated into an argument.",
          "prompt": "In two or three sentences: write the interpretation that turned it into an argument, and a real alternative explanation.",
          "placeholder": "The interpretation: ... / An alternative: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the alternative is genuinely plausible, not just a forced positive spin."
        },
        "remember": {
          "prompt": "In a sentence or two: did the alternative explanation feel at least somewhat plausible?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w6t5",
        "title": "How did it go, and a plan for next time",
        "role": "Check-in + pre-commitment",
        "delayedRef": "w6t4_apply",
        "delayedPrompt": "Last touch, your alternative was:",
        "relate": {
          "text": [
            "No new idea this touch - two quick things before we move to in-law conflict.",
            "First, a real check-in on the four tools from this week - the same four that started with Sanjana's argument over dishes back in Week 2. Then, a plan built now, while things feel calm."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Which of the four did you actually reach for this week, if any - and what happened?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Pick whichever of the four tools felt most useful this week.",
          "prompt": "In two or three sentences, write an if-then plan for using it: 'If [specific cue], then I will [specific tool, specifically applied].'",
          "placeholder": "If [specific cue], then I will..."
        },
        "reveal": {
          "text": "Something like: \"If I notice my heart racing during an argument, then I'll call a real time-out with a specific duration, rather than pushing through.\""
        },
        "remember": {
          "prompt": "In a sentence or two: say the plan back to yourself - does it actually sound doable mid-argument, not just in hindsight?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: four named tools for frequent arguments - soft start-up and repair attempts, a flooding time-out protocol, role-dispute resolution, and thought-record work on triggers - a real check-in, and a plan built while calm. No new teaching in this summary. Next week: in-law conflict."
  },
  {
    "num": 7,
    "title": "In-law conflict: three tools, and a plan",
    "mechanism": "C",
    "kind": "technique",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w7t1",
        "title": "Family Systems Mapping (Genogram)",
        "role": "Technique C1 - Family Systems Theory (Bowen)",
        "delayedRef": "w6t5_apply",
        "delayedPrompt": "Last week, your if-then plan was:",
        "relate": {
          "text": [
            "This is the first of the three tools for in-law conflict from your theory grounding screen: <b>family systems mapping using a genogram</b>.",
            "Remember Priyanka's unclear budget authority? This tool makes mapping the system deliberate: draw a structured family map showing who holds which roles, which relationships are closer or more distant, and where triangulation is happening."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might a visual map of the family system reveal patterns that aren't visible from inside any single conversation?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of your own household or extended family system, maybe the one you started thinking about back in Week 3.",
          "prompt": "In two or three sentences: describe the key roles and any triangulation you can identify - who gets pulled into whose conflicts.",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether specific roles and relationships are named, not a vague sense that things are complicated."
        },
        "remember": {
          "prompt": "In a sentence or two: did mapping it out reveal anything you hadn't consciously noticed before?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w7t2",
        "title": "Circular Questioning (Adapted for Solo Use)",
        "role": "Technique C2 - Milan Systemic Therapy (Selvini Palazzoli) - guided",
        "guardrail": true,
        "delayedRef": "w7t1_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "The second tool: <b>circular questioning</b>, adapted here for solo use. The original technique is normally facilitated by a therapist asking each family member directly, with everyone present - this version asks you to genuinely consider and write out how two or three different family members might each describe the same conflict, in their own likely words.",
            "Worth being honest about: this solo, written version is a real but meaningfully smaller tool than the original clinical technique, which needs a therapist and multiple people in the room to do fully.",
            "Because this asks you to sit with, and genuinely try to inhabit, other people's perspectives on a real conflict, this touch checks in with you directly partway through."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might genuinely trying to write another family member's perspective reveal something you can't see from your own seat alone?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a real, current family conflict involving more than two people.",
          "intensityPrompt": "First, choose how far you want to go with this right now:",
          "intensityOptions": [
            "Smaller version - write one other person's likely perspective, briefly",
            "Bigger version - write two or three different people's likely perspectives"
          ],
          "prompt": "In two or three sentences: write out the perspective(s) you chose, genuinely, even if you disagree with them.",
          "placeholder": "Your answer..."
        },
        "distressPrompt": "You've just genuinely tried to inhabit someone else's view on a real, possibly difficult conflict. Before we continue - how are you feeling right now?",
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the perspective is genuinely written as that person might see it, not as a strawman version easy to dismiss."
        },
        "remember": {
          "prompt": "In a sentence or two: did writing it out change anything about how you see the conflict, even slightly?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w7t3",
        "title": "Interpersonal Negotiation Skills for Authority Disputes",
        "role": "Technique C3 - IPT (Klerman & Weissman) - guided",
        "guardrail": true,
        "delayedRef": "w7t2_apply",
        "delayedPrompt": "Last touch, your perspective-writing was:",
        "relate": {
          "text": [
            "The third tool: <b>interpersonal negotiation skills for household-authority disputes</b> - naming a real, specific authority question directly, and treating it as something to actually negotiate rather than something to just keep enduring as background friction.",
            "Because this asks you to work through a real, often sensitive family dispute, this touch checks in with you directly partway through."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why does naming an authority question directly, as something to negotiate, matter more than just enduring the ongoing friction?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a real, specific authority question in your household - who decides what, in which domain.",
          "intensityPrompt": "First, choose how far you want to go with this right now:",
          "intensityOptions": [
            "Smaller version - just name the specific authority question clearly",
            "Bigger version - name it and outline a real negotiation approach"
          ],
          "prompt": "In two or three sentences: name the authority question, and - if you chose the bigger version - a real approach to negotiating it.",
          "placeholder": "The question: ... / (If bigger version) An approach: ..."
        },
        "distressPrompt": "You've just named a real, possibly sensitive household dynamic directly. Before we continue - how are you feeling right now?",
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the authority question is specific and real, not a vague sense of general tension."
        },
        "remember": {
          "prompt": "In a sentence or two: was naming the authority question directly harder or easier than expected?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w7t4",
        "title": "How did it go",
        "role": "Check-in",
        "delayedRef": "w7t3_apply",
        "delayedPrompt": "Last touch, your question was:",
        "relate": {
          "text": [
            "No new idea this touch - just a real check-in on the three tools from this week, the same three that trace back to Priyanka's position in the middle back in Week 3."
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
        "id": "w7t5",
        "title": "A plan for next time",
        "role": "Pre-commitment",
        "delayedRef": "w7t4_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "One more before we move to sibling conflict: a plan built now, before the next moment you're pulled into the middle of a conflict that isn't yours."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Of the three tools this week, which do you trust most to actually reach for in the moment?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Pick whichever of the three tools felt most useful, or most realistic to actually use, this week.",
          "prompt": "In two or three sentences, write an if-then plan: 'If [specific cue], then I will [specific tool, specifically applied].'",
          "placeholder": "If [specific cue], then I will..."
        },
        "reveal": {
          "text": "Something like: \"If I notice I'm being asked to relay a message between two other family members, then I'll suggest they discuss it directly instead of carrying it myself.\""
        },
        "remember": {
          "prompt": "In a sentence or two: say the plan back to yourself - does it actually sound doable the next time this comes up?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: three named tools for in-law conflict - family systems mapping, circular questioning adapted for solo use, and interpersonal negotiation for authority disputes - a real check-in, and a plan built while calm. No new teaching in this summary. Next week: sibling conflict."
  },
  {
    "num": 8,
    "title": "Sibling conflict: three tools, and a plan",
    "mechanism": "D",
    "kind": "technique",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w8t1",
        "title": "Family-of-Origin Genogram Work",
        "role": "Technique D1 - Family Systems Theory (Bowen; Adler)",
        "delayedRef": "w7t5_apply",
        "delayedPrompt": "Last week, your if-then plan was:",
        "relate": {
          "text": [
            "This is the first of the three tools for sibling conflict from your theory grounding screen: <b>family-of-origin genogram work tracing long-standing role patterns</b>.",
            "Remember Rajat's brother having let go of the 'responsible one' framing years ago? This tool makes tracing that history deliberate: map the family-of-origin system specifically to trace old sibling roles, and where they actually came from."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why does tracing where an old role actually came from make it possible to question whether it still fits?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of an old sibling role of yours, maybe the one you named back in Week 4.",
          "prompt": "In two or three sentences: trace where that role came from, and whether it still actually fits who you are now.",
          "placeholder": "Where it came from: ... / Does it still fit: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the tracing is genuinely specific to your own family history, not a generic statement about siblings in general."
        },
        "remember": {
          "prompt": "In a sentence or two: was tracing the role's origin easier or harder than expected?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w8t2",
        "title": "Interpersonal-Effectiveness Skills for Fairness Grievances",
        "role": "Technique D2 - IPT (Klerman & Weissman)",
        "delayedRef": "w8t1_apply",
        "delayedPrompt": "Last touch, your answer was:",
        "relate": {
          "text": [
            "The second tool: <b>interpersonal-effectiveness skills for raising fairness-related grievances</b> - naming a specific fairness concern with a sibling directly, rather than letting it build silently or surface sideways in unrelated friction."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why does a fairness grievance tend to come out sideways, in unrelated arguments, when it's never actually named directly?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a real fairness grievance you have with a sibling, if one exists.",
          "prompt": "In two or three sentences: name the specific grievance, and how you'd actually raise it directly.",
          "placeholder": "The grievance: ... / How I'd raise it: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the grievance is named specifically, not as a vague, general sense of unfairness."
        },
        "remember": {
          "prompt": "In a sentence or two: was naming the grievance directly harder or easier than expected?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w8t3",
        "title": "Structured Family Meetings for Caregiving/Inheritance Roles",
        "role": "Technique D3 - Family Systems Practice (Bowen-informed) - guided",
        "guardrail": true,
        "delayedRef": "w8t2_apply",
        "delayedPrompt": "Last touch, your grievance was:",
        "relate": {
          "text": [
            "The third tool: <b>structured family meetings to renegotiate caregiving or inheritance roles</b> - a real meeting format with clear ground rules, a specific agenda, and facilitation structure, rather than letting these questions get decided by default or old patterns.",
            "Because this asks you to prepare for a real, often high-stakes family conversation involving multiple people, this touch checks in with you directly partway through."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might caregiving or inheritance questions specifically need a structured meeting format, rather than an informal conversation?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a real or possible future caregiving or inheritance question in your family, if one applies to you.",
          "intensityPrompt": "First, choose how far you want to go with this right now:",
          "intensityOptions": [
            "Smaller version - just outline the agenda for a possible meeting",
            "Bigger version - outline the agenda and the ground rules you'd propose"
          ],
          "prompt": "In two or three sentences: outline what you chose - the agenda, and if applicable, the ground rules.",
          "placeholder": "Your answer..."
        },
        "distressPrompt": "You've just prepared for a real, possibly high-stakes family conversation. Before we continue - how are you feeling right now?",
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the agenda and ground rules are specific enough to actually use, not a vague intention to \"talk about it sometime.\""
        },
        "remember": {
          "prompt": "In a sentence or two: does having a structured format make this conversation feel more approachable?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w8t4",
        "title": "How did it go",
        "role": "Check-in",
        "delayedRef": "w8t3_apply",
        "delayedPrompt": "Last touch, your outline was:",
        "relate": {
          "text": [
            "No new idea this touch - just a real check-in on the three tools from this week, the same three that trace back to Rajat's old role back in Week 4."
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
        "id": "w8t5",
        "title": "A plan for next time",
        "role": "Pre-commitment",
        "delayedRef": "w8t4_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "One more before Week 9: a plan built now, before the next moment an old sibling role resurfaces."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Of the three tools this week, which do you trust most to actually reach for in the moment?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Pick whichever of the three tools felt most useful, or most realistic to actually use, this week.",
          "prompt": "In two or three sentences, write an if-then plan: 'If [specific cue], then I will [specific tool, specifically applied].'",
          "placeholder": "If [specific cue], then I will..."
        },
        "reveal": {
          "text": "Something like: \"If a sibling comment stings more than it should, then I'll ask myself whether it's really about now, or an old role resurfacing, before reacting.\""
        },
        "remember": {
          "prompt": "In a sentence or two: say the plan back to yourself - does it actually sound doable the next time this comes up?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: three named tools for sibling conflict - family-of-origin genogram work, interpersonal-effectiveness skills for fairness grievances, and structured family meetings - a real check-in, and a plan built while calm. No new teaching in this summary. Next week: all four patterns together, and the one unscaffolded test."
  },
  {
    "num": 9,
    "title": "Integration & review",
    "mechanism": "both",
    "kind": "integration",
    "retrievalCheck": {
      "prompt1": "Name one tool for in-law conflict and, in your own words, what it actually does.",
      "prompt2": "Name one tool for sibling conflict and, in your own words, what it actually does.",
      "reveal": "Any of the three in-law-conflict tools or three sibling-conflict tools count here - what matters is whether the description is functional (what the tool actually does and why) rather than just the name repeated back."
    },
    "touches": [
      {
        "id": "w9t1",
        "title": "When two patterns show up together",
        "role": "Integration",
        "delayedRef": "w8t5_apply",
        "delayedPrompt": "Last week, your if-then plan was:",
        "relate": {
          "text": [
            "Meher feels consistently misunderstood by her husband (feeling misunderstood) - and lately, their attempts to actually discuss it have turned into escalating arguments within minutes, both flooded before anything gets resolved (frequent arguments)."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Both patterns showed up here. Which one do you think is actually driving the other, and why?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Same situation - Meher's feeling of being misunderstood and the arguments that follow attempts to discuss it.",
          "prompt": "In two or three sentences: what would you actually recommend Meher try, and why that one, out of all thirteen tools you now know?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's a real case either way. Some would start with the flooding time-out protocol, since the arguments themselves need to actually stay calm enough for anything else to work. Others would say reflective listening matters more, since preventing the next miss might stop the arguments from starting at all. Either is defensible - what matters is she picks one and actually runs it."
        },
        "remember": {
          "prompt": "In a sentence or two: which would you have picked for yourself, in her position?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w9t2",
        "title": "Designing a full response",
        "role": "Integration",
        "delayedRef": "w9t1_apply",
        "delayedPrompt": "Last touch, you said you'd recommend:",
        "relate": {
          "text": [
            "Dev has been caught in the middle of tension between his wife and his mother for months (in-law conflict) - and lately, he's noticed himself snapping at his own brother over small things, in a way that feels like an old pattern resurfacing from years ago (sibling conflict), as if the stress from one is spilling into the other."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "What's driving what here, in your own words - is the in-law stress feeding the sibling pattern, or are they genuinely separate things happening to overlap right now?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Same situation - Dev's in-law tension and the resurfacing sibling pattern.",
          "prompt": "In two or three sentences: design a full plan for Dev - combine tools across patterns if that's what it takes.",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"Family systems mapping addresses the in-law tension directly, giving him a clearer sense of the roles he's caught between. Separately, tracing the old sibling role with his brother helps him notice when a reaction is about long-standing history versus the present moment - even if the stress from one situation is genuinely spilling into the other.\""
        },
        "remember": {
          "prompt": "In a sentence or two: which of the four patterns do you reach for tools on first, generally - and why do you think that's your instinct?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w9t3",
        "title": "When three or four show up at once",
        "role": "Integration",
        "delayedRef": "w9t2_apply",
        "delayedPrompt": "Last touch, your plan for Dev was:",
        "relate": {
          "text": [
            "Isha has had a genuinely hard month: she feels consistently unheard by her partner (feeling misunderstood), their conversations about it keep escalating into flooded arguments (frequent arguments), her mother-in-law has been openly taking sides in these arguments (in-law conflict), and Isha's older sister, hearing about all of it secondhand, has started implying Isha is overreacting - echoing an old \"too sensitive\" role from their childhood (sibling conflict)."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "All four patterns showed up here. In your own words, how do they seem to be feeding each other?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Same situation - Isha's month.",
          "prompt": "In two or three sentences: what's the one move that would actually help the most right now, and why that one over the others?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single right answer - the pattern worth noticing is that all four can genuinely reinforce each other (feeling unheard triggers arguments, the mother-in-law's involvement adds a third-party layer, and the sister's old framing adds another layer of not being taken seriously) without one single tool being able to untangle all four at once."
        },
        "remember": {
          "prompt": "In a sentence or two: is there a real situation in your own life right now where more than one of these four shows up together?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w9t4",
        "title": "One more, mixed",
        "role": "Integration",
        "delayedRef": "w9t3_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Arnav has been the go-between for a disagreement between his father and his uncle for weeks (in-law/extended-family conflict) - and every time he tries to explain his own frustration about being stuck in the middle, his wife responds with practical suggestions that miss what he actually means (feeling misunderstood), which has started to escalate into arguments between them too (frequent arguments)."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "If you had to guess which pattern is actually the loudest here, which would you guess, and what would you look for to check?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Same situation - Arnav caught between two conflicts at once.",
          "prompt": "In two or three sentences: what's the one move that unblocks the most here, if there is one - and if there isn't, say so.",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Often the honest answer is that no single tool resolves all three cleanly - stepping back from the go-between role addresses the root extended-family conflict, reflective listening might help his wife actually hear his frustration about it, and a flooding time-out could keep their own arguments about it from escalating further - but the original father-uncle disagreement is still there and still needs its own resolution regardless."
        },
        "remember": {
          "prompt": "In a sentence or two: what's your instinct, generally - address the root conflict first, or stabilize the arguments it's spilling into first?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w9t5",
        "title": "Your own situation - nothing pre-walked",
        "role": "Transfer test",
        "transferTest": true,
        "delayedRef": "w9t4_apply",
        "delayedPrompt": "Last touch, your instinct was:",
        "relate": {
          "text": [
            "This is the one part of the module built with no scaffolding at all.",
            "You've followed Aarav through a missed conversation, Sanjana through an escalating argument, Priyanka through a family caught in the middle, and Rajat through an old sibling role - and hopefully noticed the shape of one or more of these patterns in your own relationships too, more than once.",
            "Now it's just yours. You've got a real situation right now - feeling misunderstood, frequent arguments, in-law conflict, sibling conflict, maybe more than one at once. Don't simplify it for us."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Describe it in your own words - what's actually going on, as specifically as you can.",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "With nothing pre-walked this time.",
          "prompt": "In two or three sentences: what's your actual next move, and why that one - which of the thirteen tools, and why not one of the others?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single right answer here - this was the one part of the module deliberately built to have no signalled answer. What matters is whether your reasoning traces back to the tools from your theory grounding screen and Weeks 5-8, not whether it matches anyone else's."
        },
        "remember": {
          "prompt": "In a sentence or two - what do you actually want to remember from this module, in your own words, not the module's?",
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
    "scenario": "You catch yourself thinking \"no one ever really gets what I mean\" after a conversation goes sideways.",
    "prompt": "In two or three sentences: write the exact thought, and test it against real, specific evidence.",
    "reveal": "There's no single model answer here - the tell is specific evidence, not a vague reassurance."
  },
  {
    "code": "A2",
    "rep": 2,
    "type": "reflection",
    "scenario": "A different sweeping conclusion about being misunderstood shows up, maybe in a different relationship.",
    "prompt": "In two or three sentences: write and test this one too.",
    "reveal": "There's no single model answer here - the tell is genuine, specific evidence for this particular conclusion."
  },
  {
    "code": "B4",
    "rep": 1,
    "type": "reflection",
    "scenario": "A small trigger is starting to feel like it's turning into an argument.",
    "prompt": "In two or three sentences: write the interpretation driving it, and a real alternative explanation.",
    "reveal": "There's no single model answer here - the tell is a genuinely plausible alternative, not a forced positive spin."
  },
  {
    "code": "B4",
    "rep": 2,
    "type": "reflection",
    "scenario": "A different trigger, in a different relationship, starts to escalate.",
    "prompt": "In two or three sentences: write the interpretation and an alternative for this one too.",
    "reveal": "There's no single model answer here - the tell is specificity to this particular trigger."
  },
  {
    "code": "C1",
    "rep": 1,
    "type": "reflection",
    "scenario": "A specific tension in your extended family system comes up again.",
    "prompt": "In two or three sentences: map the roles and any triangulation involved.",
    "reveal": "There's no single model answer here - the tell is specific roles named, not a vague sense of complexity."
  },
  {
    "code": "C1",
    "rep": 2,
    "type": "reflection",
    "scenario": "Some time has passed since you last mapped your family system - worth checking if anything's shifted.",
    "prompt": "In two or three sentences: revisit the map, and note honestly if anything's changed.",
    "reveal": "There's no single model answer here - family systems can genuinely shift; the tell is honesty about what's actually different."
  },
  {
    "code": "D1",
    "rep": 1,
    "type": "reflection",
    "scenario": "An old sibling role resurfaces in a recent interaction.",
    "prompt": "In two or three sentences: trace where it came from, and whether it still fits.",
    "reveal": "There's no single model answer here - the tell is genuine, specific tracing, not a general statement about siblings."
  },
  {
    "code": "D1",
    "rep": 2,
    "type": "reflection",
    "scenario": "A different old role, or the same one in a new context, shows up.",
    "prompt": "In two or three sentences: trace and test this one too.",
    "reveal": "There's no single model answer here - the tell is specificity to this particular role and context."
  }
],
  toolsData: {
  "reflective_listening_log": {
    "code": "A3",
    "title": "Reflective Listening",
    "mechShort": "Misunderstood",
    "kind": "log_single",
    "intro": "Reflect back what someone said, in your own words, before responding with your own point. Log it each time you actually try this.",
    "logLabel": "What was the conversation, and what happened when you reflected back?",
    "firstPlaceholder": "e.g. Discussing weekend plans with my partner - reflecting back caught a real misunderstanding before it grew",
    "placeholder": "Your answer..."
  },
  "soft_startup_log": {
    "code": "B1",
    "title": "Soft Start-Up",
    "mechShort": "Frequent Arguments",
    "kind": "log_single",
    "intro": "Open a difficult conversation gently, without criticism or contempt, and notice repair attempts mid-conflict. Log it each time you actually use this.",
    "logLabel": "What was the conversation, and how did the soft start-up go?",
    "firstPlaceholder": "e.g. Raised a chore disagreement gently instead of snapping - noticed it didn’t escalate the way it usually does",
    "placeholder": "Your answer..."
  },
  "flooding_timeout_log": {
    "code": "B2",
    "title": "Flooding Time-Out",
    "mechShort": "Frequent Arguments",
    "kind": "log_single",
    "intro": "Notice the physical signs of flooding, and call a real, timed pause. Log it each time you actually use the protocol.",
    "logLabel": "What triggered it, and how did the time-out go?",
    "firstPlaceholder": "e.g. Called a 20-minute break mid-argument - came back and actually resolved it calmly",
    "placeholder": "Your answer..."
  },
  "fairness_grievance_log": {
    "code": "D2",
    "title": "Raising a Fairness Grievance",
    "mechShort": "Sibling Conflict",
    "kind": "log_single",
    "intro": "Name a specific fairness concern with a sibling directly, rather than letting it build silently. Log it each time you actually do this.",
    "logLabel": "What was the grievance, and how did raising it go?",
    "firstPlaceholder": "e.g. Named feeling like caregiving duties fall unevenly - hard conversation, but got it on the table honestly",
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
    tier1: "Any statement connecting conflict with a partner, family member, or sibling to intent or a plan to end one's life or self-harm (\"I can't take this anymore, I want it to just stop for good\", \"I have a way to end it\"), or to intent to harm another person.",
    tier2: "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary frustration or distress of real, ongoing family or relationship conflict, which is what this module is specifically designed to help with. Also watch for language suggesting the conflict has become physically unsafe (not just verbally heated) - this module is built for communication and negotiation work, not for situations involving actual physical danger, which need a different kind of support entirely.",
    systemPrompt: "You are a safety classifier inside a mental-health support app used in India. Classify the user's message into exactly one of: NONE, TIER1, TIER2.\n\nTIER1 definition: Any statement connecting conflict with a partner, family member, or sibling to intent or a plan to end one's life or self-harm (\"I can't take this anymore, I want it to just stop for good\", \"I have a way to end it\"), or to intent to harm another person.\nTIER2 definition: Persistent hopelessness about life broadly, or real functional collapse - not the ordinary frustration or distress of real, ongoing family or relationship conflict, which is what this module is specifically designed to help with. Also watch for language suggesting the conflict has become physically unsafe (not just verbally heated) - this module is built for communication and negotiation work, not for situations involving actual physical danger, which need a different kind of support entirely.\n\nCritical context 1: many people, especially in Indian English, use hyperbolic or idiomatic self-deprecating language that is NOT a genuine risk signal - for example \"my mother-in-law will kill me if I do that\", \"this argument is literally killing me\". Do NOT classify ordinary hyperbole, jokes, or figures of speech as TIER1 or TIER2, even if they contain words like \"kill\", \"die\", or \"worthless\".\n\nCritical context 2 (specific to this module): this module's content is about real conflict - arguments, in-law tension, sibling disputes. Genuine frustration, anger, or distress about these topics is not itself a risk signal, and should be classified NONE. However, this module is specifically built for communication and negotiation-level conflict, NOT for situations involving actual physical danger. If a message describes or suggests physical violence, threats of physical harm (to the user or from the user toward someone else), or a level of danger beyond emotionally heated conflict, treat this with the same seriousness as TIER1/TIER2 risk language, even if it doesn't fit the self-harm-specific definitions above exactly - flag it in your reason field clearly as a physical-safety concern distinct from emotional distress, so it can be routed appropriately.\n\nOnly classify as TIER1 if there is a genuine indication of intent, a plan, or serious risk to the person's life or safety (including risk from another person). Only classify as TIER2 if there is genuine persistent hopelessness about life broadly, or real functional collapse - not the ordinary frustration of real, ongoing family or relationship conflict, which is what this module is designed to help with.\n\nWhen genuinely uncertain, prefer the lower tier (or NONE) rather than over-triggering - but never downgrade language that includes a specific plan, method, timeframe, or indication of physical danger.\n\nRespond with ONLY a raw JSON object, no markdown fences, no other text: {\"tier\": \"NONE\" | \"TIER1\" | \"TIER2\", \"reason\": \"one short clause\"}",
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
    "text": "All 13 practicable technique mappings and the reference-only technique framing are my synthesis of the taxonomy's named sources - not clinician-reviewed."
  },
  {
    "area": "Clinical",
    "text": "Tier 1/2 escalation definitions for this module are a first draft, awaiting sign-off. Unlike Modules 9 and 10, this module DOES include a module-specific addition: explicit awareness that conflict content could, in rare cases, involve real physical danger rather than only communication/negotiation-level conflict - flagged in BRIEF.escalation.tier2 and worth clinical review on whether a dedicated, separate safety pathway (distinct from the standard Tier 1/2 framework) is needed for that specific case, since physical safety concerns are a different kind of problem than the emotional-distress-focused Tier 1/2 system was designed around."
  },
  {
    "area": "Clinical, content-design decision needing explicit review",
    "text": "C2 (circular questioning) is a genuine adaptation of a technique originally designed to be facilitated by a therapist with multiple family members physically present. The solo, written version built here - imagining and writing out another family member's likely perspective - is meaningfully different from, and almost certainly less powerful than, the original clinical technique. This is stated explicitly in the technique's own data (see adaptationNote) and should get direct clinical review on whether this adaptation is a reasonable one to offer at all, or whether it should be reclassified as [C] reference-only instead of [B] practicable, given how far it sits from the original method."
  },
  {
    "area": "Structural note - largest, most guardrail-dense module built so far",
    "text": "4 mechanisms (9 weeks, matching Anxiety & Worry's shape), T=3/4/3/3, with 5 total [B] guardrail techniques - more than any prior module. Mechanism C has two independently-guardrailed touches out of its 3 techniques (C2, C3), the densest guardrail concentration in a single mechanism so far - confirms the established pattern (two separate [B] touches in one mechanism, each with its own independent guardrail cycle) works cleanly even when that's two-thirds of the mechanism's total technique count, not just a minority."
  },
  {
    "area": "Structural note - reused T resolutions",
    "text": "Mechanism A (T=3, one [B], one [C]) uses the same shape as Neurodivergence - T=3 exact fit, with the single [C] rendering as a passive reference card since no bridge touch is needed. Mechanism B (T=4, one [B]) uses the standard combined check-in/pre-commitment resolution. Mechanisms C and D (both T=3) use the exact-fit resolution. No new structural cases - a clean confirmation of already-validated formulas at a new combination (T=3/4/3/3 across 4 mechanisms)."
  },
  {
    "area": "Content decision, bank composition",
    "text": "5 techniques excluded for [B] (A1, B3, C2, C3, D3), 1 excluded for [C] (A4) - leaving 8 of 14 total techniques eligible for the bank, the smallest eligible fraction of any module so far given the guardrail density. Reflections: A2, B4, C1, D1 (4 techniques, written worksheets and mapping exercises, 8 reps). Tools: A3, B1, B2, D2 (4 techniques, in-the-moment or prepared-script practices). A clean 4:4 split this time, unlike the Reflections-heavy skew in Modules 5, 9, and 10 - likely because the guardrail exclusions removed several of what would otherwise have been Reflections-leaning techniques (role-dispute work, negotiation skills, circular questioning all would likely have been Reflections had they not been guardrailed)."
  },
  {
    "area": "Resolved",
    "text": "Crisis helpline numbers reused from Modules 1-10 (KIRAN, TeleMANAS, Vandrevala Foundation) - national, not module-specific."
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
    "text": "Nothing in this module has been clinically reviewed and nothing has been tested with a real user. Every technique mapping, scenario, and escalation threshold is a first draft - and this module's physical-safety escalation question and the C2 adaptation question both deserve real weight, not routine sign-off."
  }
]
};
