import { ModuleContent } from '../../../types/moduleContent';

function opt(label: string, isTarget: boolean, explain: string) {
  return { label, isTarget, explain };
}

export const MODULE_10_CONTENT: ModuleContent = {
  moduleId: 'M10',
  slug: 'autonomy-boundaries',
  name: "Autonomy & Boundaries",
  duration_weeks: 7,
  tier: "Common - 499 rupees - Family domain",
  brief: {
  "moduleName": "Autonomy & Boundaries",
  "tier": "Common - 499 rupees - Family domain",
  "mechanisms": [
    {
      "key": "A",
      "name": "Marriage Pressure",
      "short": "Marriage Pressure",
      "def": "Persistent family pressure to marry within a specific timeframe or according to a specific script, producing a sense that one's own doubts, timeline, or preferences don't have a legitimate place in the decision.",
      "need": "Autonomy over a major life decision, a timeline that's actually one's own",
      "contrast": {
        "who": "Simran",
        "text": "faces similar pressure from her parents about marriage timing - it hasn't let up - but she's found a clearer way to separate her family's timeline from her own sense of readiness, and treats her own uncertainty as normal rather than as something wrong with her."
      },
      "techniques": [
        {
          "code": "A1",
          "approach": "ACT",
          "format": "A",
          "name": "Values-Based Decision-Making Worksheets",
          "source": "Kelly Wilson & Tobias Lundgren, ACT",
          "what": "A structured worksheet weighing two real values against each other honestly - autonomy over one's own major life decisions, and connection to family - rather than treating the two as if one must simply defeat the other.",
          "how": "Marriage pressure often gets framed as a choice between family connection and personal autonomy, as if only one can be honored. Naming both as genuinely real values, and weighing a specific decision against both, usually reveals more workable middle ground than the all-or-nothing framing suggests.",
          "why": "The foundational tool for this mechanism - gives the rest of the mechanism's tools an honest starting point that doesn't pre-decide the two values are in total opposition."
        },
        {
          "code": "A2",
          "approach": "IPT",
          "format": "B",
          "guardrail": true,
          "name": "Interpersonal Role-Transition Work",
          "source": "Gerald Klerman & Myrna Weissman, IPT",
          "what": "Directly naming and working through the real role shift family expectations are demanding - from 'unmarried child' to 'spouse,' with everything that implies about identity, household, and relationships - grieving what the current role offers and identifying what the new one could realistically offer instead.",
          "how": "Marriage pressure often treats the transition as purely logistical - a timeline to be met - when it's genuinely a real identity and role shift underneath. Naming that shift directly, the way any major role transition would be worked through, can move it forward in a way pressure about timing alone can't.",
          "why": "Because this asks you to engage directly with a real, sometimes complicated transition - not a hypothetical one - it ships with the same guardrails as any [B] technique: a choice of intensity, and a check-in afterward."
        },
        {
          "code": "A3",
          "approach": "Narrative Therapy",
          "format": "A",
          "name": "Re-Authoring the 'Marriage Timeline' Narrative",
          "source": "Michael White & David Epston",
          "what": "Naming the family's specific marriage timeline as one particular story about how life should unfold - not the only possible one - and identifying what a personally-authored version of that story would actually include.",
          "how": "A family's marriage timeline can become the only available story, simply through repetition. Naming it explicitly as one story among possible others creates room to ask whether it's actually the story that fits, rather than treating it as an unquestionable given.",
          "why": "Builds directly on the values work in A1 - takes the two named values and builds an actual alternative narrative around them, not just a comparison."
        },
        {
          "code": "A4",
          "approach": "Motivational Interviewing",
          "format": "A",
          "name": "A Decisional-Balance Exercise for Ambivalence About Timing",
          "source": "William Miller & Stephen Rollnick, Motivational Interviewing",
          "what": "A structured exercise mapping out the genuine pros and cons of both moving toward marriage now and waiting - honestly, on both sides - rather than treating ambivalence itself as a problem to be resolved as quickly as possible.",
          "how": "Family pressure often treats any ambivalence as something to be pushed through rather than examined. Mapping it out honestly, on paper, treats the ambivalence as real and worth understanding, which usually produces a clearer sense of what's actually driving the hesitation.",
          "why": "The tool for sitting with real ambivalence directly, rather than resolving it prematurely just to relieve the pressure of having an unresolved answer."
        }
      ]
    },
    {
      "key": "B",
      "name": "Lack of Privacy / Boundaries",
      "short": "Privacy & Boundaries",
      "def": "A pattern of routine boundary violations in living situations with limited personal space or autonomy - messages read without permission, rooms entered without knocking, involvement in decisions that should be personal - producing either quiet resentment or reflexive over-explaining.",
      "need": "Personal space, autonomy over personal decisions and information",
      "contrast": {
        "who": "Kavya",
        "text": "lives in a similarly close, low-privacy household - that hasn't changed - but she's found a few specific, small boundaries she can actually hold consistently, rather than either accepting every intrusion silently or trying to overhaul the whole household's habits at once."
      },
      "techniques": [
        {
          "code": "B1",
          "approach": "Assertiveness Training",
          "format": "A",
          "name": "Assertive Boundary-Setting Scripts Using the DESC Framework",
          "source": "Sharon & Gordon Bower",
          "what": "A structured script for raising a specific privacy boundary: <b>D</b>escribe the specific behavior, <b>E</b>xpress how it affects you, <b>S</b>pecify what you'd like instead, and name the <b>C</b>onsequence if honored. Prepared in advance for a specific, real boundary.",
          "how": "A boundary about privacy raised vaguely - 'give me some space' - is easy to dismiss or misunderstand. A specific, prepared script about one specific behavior is far harder to talk past.",
          "why": "The foundational tool for this mechanism - turns a general sense of intrusion into something specific enough to actually address."
        },
        {
          "code": "B2",
          "approach": "DBT",
          "format": "A",
          "name": "The DEAR MAN Interpersonal-Effectiveness Skill",
          "source": "Marsha Linehan, DBT",
          "what": "A structured format for making a boundary request: <b>D</b>escribe the situation, <b>E</b>xpress feelings, <b>A</b>ssert the request clearly, <b>R</b>einforce why honoring it helps, staying <b>M</b>indful of the goal, <b>A</b>ppearing confident, and being willing to <b>N</b>egotiate.",
          "how": "DEAR MAN is built for making a request in the moment, not just preparing one in advance - it's a fast, repeatable structure for when a boundary needs to be raised on the spot, not planned days ahead.",
          "why": "The quicker, in-the-moment counterpart to A3's more deliberate script - useful when a boundary needs to be raised right now, not prepared for later."
        },
        {
          "code": "B3",
          "approach": "CBT",
          "format": "A",
          "name": "Cognitive Restructuring of Guilt-Driven Beliefs About Asserting Boundaries",
          "source": "Aaron Beck",
          "what": "Writing down the specific guilt-producing belief underneath hesitation to set a boundary - 'wanting privacy means I don't love my family' - and testing it against real evidence, the way any other belief would be tested.",
          "how": "Guilt about boundaries often runs on an unexamined belief equating privacy with rejection. Naming the belief specifically and testing it is what usually reveals the equation doesn't actually hold up.",
          "why": "Targets the internal obstacle to using B1 and B2 at all - the guilt that shows up before the boundary is even raised."
        },
        {
          "code": "B4",
          "approach": "Behaviour Rehearsal",
          "format": "A",
          "name": "Behavioural Rehearsal of Boundary Conversations Before They Happen",
          "source": "Wolpe-style behaviour rehearsal",
          "what": "Practicing a prepared boundary script - from B1 or B2 - out loud, ahead of time, so the words and tone are already familiar before the real conversation happens.",
          "how": "A script that's only ever been written down often falls apart under real pressure, especially with family. Rehearsing it out loud changes it from an idea into something the body and voice have actually practiced.",
          "why": "The tool for right before a real boundary conversation - taking a prepared script and making it usable under real pressure."
        }
      ]
    },
    {
      "key": "C",
      "name": "Career Pressure (Forced Career)",
      "short": "Career Pressure",
      "def": "Family-driven pressure to pursue a specific career path - often for financial security, prestige, or continuing a family business or profession - that may conflict with a person's actual interests, aptitudes, or sense of what a meaningful working life would look like.",
      "need": "Self-authorship of one's own vocational path",
      "contrast": {
        "who": "Kunal",
        "text": "is under similar pressure to follow a specific family-expected career path - that pressure hasn't gone away - but he's found a way to genuinely reconcile some of his own real interests with the practical and family considerations, rather than treating it as an all-or-nothing choice between the two."
      },
      "techniques": [
        {
          "code": "C1",
          "approach": "ACT",
          "format": "A",
          "name": "Values Clarification & Committed-Action Planning Toward Authentic Career Goals",
          "source": "Steven Hayes, ACT",
          "what": "Naming what actually matters personally in a working life - separate from the specific path the family expects - and identifying one small, real, committed next step toward something that reflects those values, alongside whatever the family-expected path requires.",
          "how": "A family-expected career path can become the only available option simply through repetition and pressure, crowding out any real reflection on what would actually be personally meaningful. Naming personal values directly, and taking one small step toward them, creates an actual alternative to weigh against the pressure.",
          "why": "The foundational tool for this mechanism - everything else in it depends on having some sense of authentic values to work from."
        },
        {
          "code": "C2",
          "approach": "Trait-and-Factor & Career-Development Theory",
          "format": "A",
          "name": "Structured Interest & Aptitude Exploration",
          "source": "Frank Parsons's trait-and-factor approach, and Donald Super's career-development stage theory",
          "what": "A structured exercise mapping actual interests and aptitudes - not the ones assumed by the family-expected path - against real, viable options, using an established framework rather than a vague sense of 'what I might like.'",
          "how": "Family pressure often assumes there's only one viable path, without ever really mapping what a person's actual interests and strengths point toward. A structured exploration gives real, specific alternatives to consider, not just a vague feeling of wanting something different.",
          "why": "Gives the values work in C1 something concrete to point toward - actual paths, not just a general sense of dissatisfaction with the current one."
        },
        {
          "code": "C3",
          "approach": "Existential Therapy",
          "format": "A",
          "name": "Examination of Freedom & Responsibility in Choosing a Life Path",
          "source": "Irvin Yalom's existential framework",
          "what": "Directly examining how much of the career pressure is a felt lack of choice versus a genuine, if difficult, choice being avoided - and what taking real ownership of that choice, rather than experiencing it as entirely imposed, would actually involve.",
          "how": "Career pressure can feel like there's no real choice at all - as if the path is simply determined. Naming the actual choice, and who's really making it, restores a sense of agency even when every option carries a real cost, including the cost of disappointing family.",
          "why": "The deepest of the three tools - for when the pressure isn't just about which path to take, but about ownership of the choice itself."
        }
      ]
    }
  ],
  "scenarioSource": "Pan-India, English-medium context (per product decision) - joint and extended family living situations, marriage timelines and matchmaking conversations, family businesses and professions. Language is English-medium throughout; content has not yet been reviewed for phrasing that reads as metro-specific.",
  "escalation": {
    "tier1": "Any statement connecting marriage pressure, lack of privacy, or career pressure to intent or a plan to end one's life or self-harm (\"I can't take this anymore, I want it to just stop for good\", \"I have a way to end it\").",
    "tier2": "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary frustration or guilt of navigating real family pressure, which is what this module is specifically designed to help with."
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
      "One technique in this module asks you to engage directly with a real, sometimes complicated life transition - it ships with a built-in choice of intensity and a check-in, on purpose.",
      "If you're in crisis right now, don't wait for this module to help. Reach out immediately - the button below is always here if you need it."
    ],
    "cta": "Continue",
    "crisisButton": true
  },
  {
    "eyebrow": "Why this module",
    "title": "Why we're suggesting this one",
    "body": [
      "You told us you're dealing with pressure around marriage timing, a lack of real privacy or personal space at home, or pressure to follow a career path that isn't really yours. Maybe more than one, maybe all three.",
      "This module is built for exactly that - three specific patterns, each with its own real, evidence-based tools, not one blended 'push back on your family' module."
    ],
    "cta": "Continue"
  },
  {
    "eyebrow": "What to expect",
    "title": "The next 7 weeks",
    "body": [
      "Short term: a new touch on weekdays, a few minutes each, real scenarios close to your own week - your own words, not a quiz to pass or fail. Weekends bring a short summary, not new content.",
      "Long term, honestly: this won't change your family's expectations, and it won't make the pressure disappear. What it can realistically offer is 11 specific, evidence-based tools, plus enough practice noticing each pattern that you reach for the right tool sooner. That's the actual promise here, not more than that."
    ],
    "cta": "Continue"
  },
  {
    "eyebrow": "Theory grounding",
    "title": "The tools everything here is built on",
    "body": [
      "Each of these three patterns has more than one real, evidence-based approach behind it - so instead of blending them into one vague idea, each approach gets its own tool and its own touch.",
      "You won't use any of these in Weeks 1-3 - those three weeks are just about being able to spot each pattern clearly, on its own, before any tool gets layered on top. Weeks 4-6 bring these back, one at a time, matched to exactly what you'll have just learned to recognise. One technique below is marked differently - it asks you to engage with a real, sometimes complicated transition, so it ships with a choice of intensity and a check-in."
    ],
    "theory": true,
    "cta": "Start Week 1"
  }
],
  weeks: [
  {
    "num": 1,
    "title": "Marriage pressure: recognising the pattern",
    "mechanism": "A",
    "kind": "blocked",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w1t1",
        "title": "Recognition - the family gathering question",
        "role": "Recognition #1",
        "noDelayed": true,
        "relate": {
          "text": [
            "Quick note before we start: this week and the next two aren't about any of the tools yet - none show up. First, you need to be able to spot each pattern clearly. The tools come in Weeks 4-6, matched one at a time to what you'll have learned to recognise.",
            "This week's pattern has a name: <b>marriage pressure</b>. In simple terms: persistent family pressure to marry within a specific timeframe or according to a specific script, producing a sense that one's own doubts or timeline don't have a legitimate place in the decision.",
            "Here's what that looks like. At a family gathering, an aunt asks <b class='who'>Pooja</b>, not for the first time, when she's finally going to \"settle down.\" Pooja gives her usual vague, deflecting answer - and later that night, alone, finds herself wondering if her own genuine uncertainty about the timing is actually just a personal failing she needs to fix."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "Which of these actually explains what's happening? More than one will sound reasonable.",
          "options": [
            {
              "label": "Repeated external pressure is making her own genuine uncertainty feel illegitimate, as if it's a problem to fix rather than a normal part of a real decision",
              "isTarget": true,
              "explain": "Right - the uncertainty itself is ordinary for a decision this significant; what's happening is that repeated pressure is making the uncertainty itself feel like the problem."
            },
            {
              "label": "She's genuinely behind where she should be and needs to catch up",
              "isTarget": false,
              "explain": "This accepts the family's specific timeline as the accurate standard, when the actual pattern worth noticing is that the timeline itself, not her readiness, is what's producing the sense of being behind."
            },
            {
              "label": "She should just give her aunt a real, honest answer instead of deflecting",
              "isTarget": false,
              "explain": "This focuses on the specific interaction rather than the underlying pattern - what matters here isn't how she answered her aunt, it's what the pressure is doing to how she relates to her own genuine uncertainty afterward."
            }
          ],
          "whyPrompt": "In a few words - what's the giveaway that this is about pressure, not about her actually being unready?"
        },
        "apply": {
          "scenario": "Same pattern, a different person: at a cousin's wedding, Rhea's grandmother remarks that she should \"stop being so picky\" - Rhea laughs it off, but spends the drive home wondering if her real hesitations about a specific match are actually just excuses.",
          "prompt": "Same thing happening here. In two or three sentences: what would you actually say to Rhea right now?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"Your hesitations don't automatically become excuses just because someone else labelled them that way - it's worth taking your own uncertainty seriously on its own terms, not just as a problem to talk yourself out of.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of a real moment this applies to you - what genuine uncertainty of yours has started to feel like a personal failing under pressure?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t2",
        "title": "Recognition - the timeline that isn't hers",
        "role": "Recognition #2",
        "delayedRef": "w1t1_apply",
        "delayedPrompt": "Last touch, on Rhea, you wrote this:",
        "relate": {
          "text": [
            "Same Pooja, a few weeks later. Her mother mentions a specific age by which \"it really should happen\" - a number Pooja has heard so many times she's started using it herself, in her own head, as if it were a fact about her life rather than one family's specific expectation.",
            "Notice what's carried over: the timeline started as something external, repeated by family - but it's become something Pooja now applies to herself, as if it were simply true."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What's actually happening with the specific age? Read all three carefully.",
          "options": [
            {
              "label": "An external, family-specific timeline has become internalized as if it were an objective fact about her own life, rather than one particular family's expectation",
              "isTarget": true,
              "explain": "Right - the number itself isn't a fact about Pooja's actual readiness or life; it's become internalized to the point of feeling like one, simply through repetition."
            },
            {
              "label": "There probably is a genuinely optimal age for this kind of decision",
              "isTarget": false,
              "explain": "This treats a specific family's expectation as if it reflected some objective, universal timeline, when the pattern being shown is specifically about internalizing one particular, repeated number as if it were a fact."
            },
            {
              "label": "She should just ignore the number if it bothers her so much",
              "isTarget": false,
              "explain": "This treats the issue as a simple matter of willpower to ignore, without addressing what's actually happening - the number has become internalized enough that simply deciding to ignore it isn't straightforward."
            }
          ],
          "whyPrompt": "In a few words - why does it matter that the number came from family repetition, not from anything about Pooja's actual life?"
        },
        "apply": {
          "scenario": "A different person, same shape of moment: Tanvi's father has mentioned a specific year so often that she catches herself mentally counting down to it, treating the year itself as a real deadline rather than a number her father happens to prefer.",
          "prompt": "In two or three sentences: what's actually going on for Tanvi, and what would you point out about where that year actually came from?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"That year isn't actually a deadline in her own life - it's a preference her father has repeated often enough that it's started to feel like one.\""
        },
        "remember": {
          "prompt": "In a sentence or two: is there a specific number, timeline, or deadline you've internalized that actually came from someone else's repetition?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t3",
        "title": "What the pressure is actually costing",
        "role": "Functional logic",
        "delayedRef": "w1t2_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Between the family gathering and the internalized age, there's a pattern worth naming honestly: the pressure can feel like it's helping - keeping Pooja on track, preventing her from drifting without direction.",
            "What it actually costs is different: it doesn't give her a clearer sense of what she actually wants, it just makes her own uncertainty feel illegitimate, which tends to produce anxious compliance or reflexive resistance, rather than any real clarity."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What is the pressure actually doing? These are close - think it through.",
          "options": [
            {
              "label": "Making genuine uncertainty feel illegitimate, which tends to produce anxious compliance or reflexive resistance, without actually producing any real clarity about what Pooja herself wants",
              "isTarget": true,
              "explain": "That's the real cost - the pressure doesn't clarify anything; it just makes an ordinary uncertainty feel like it needs to be eliminated rather than understood."
            },
            {
              "label": "Genuinely helping her stay focused on an important life decision",
              "isTarget": false,
              "explain": "If it were doing that, some real clarity would be expected to follow - instead, the pattern described is a felt need to suppress her own uncertainty, not a clearer sense of her actual preferences."
            },
            {
              "label": "Accurately reflecting the real urgency of the decision",
              "isTarget": false,
              "explain": "This treats the family's specific timeline as an objective measure of urgency, when the pattern being shown is about pressure producing anxiety and compliance, not about the decision's actual, independent urgency."
            }
          ],
          "whyPrompt": "In a few words - why doesn't pressure actually produce the clarity it seems like it should?"
        },
        "apply": {
          "scenario": "A friend, hearing Pooja describe the internalized age, asks: \"Has the pressure ever actually helped you feel clearer about what you want, or just more anxious about not having decided yet?\" Pooja pauses. \"...Just more anxious, honestly. I don't think it's ever made me feel clearer.\"",
          "prompt": "That's usually the tell. In two or three sentences: think of a time pressure didn't actually produce clarity for you - what happened instead?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the pattern to notice is whether the pressure actually produced clearer thinking, or just more anxiety about not having resolved things yet."
        },
        "remember": {
          "prompt": "In a sentence or two: what does the pressure usually feel like for you, physically or in your thinking?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t4",
        "title": "What a separated timeline can look like",
        "role": "Contrast / boundary case",
        "delayedRef": "w1t3_apply",
        "delayedPrompt": "Last touch, you named this:",
        "relate": {
          "text": [
            "Here's what a similar pressure can look like for someone with a different relationship to it.",
            "<b class='who'>Simran</b> faces similar pressure from her parents about marriage timing - it hasn't let up. But she's found a clearer way to separate her family's timeline from her own sense of readiness, and treats her own uncertainty as normal rather than as something wrong with her.",
            "This is the module's contrast case for this pattern: real, ongoing pressure, honestly acknowledged - not the absence of pressure, but a genuine separation between the family's timeline and her own."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What actually makes Simran's relationship to the pressure different from Pooja's? All three can look similar in the moment.",
          "options": [
            {
              "label": "She holds the family's timeline and her own sense of readiness as two separate things, rather than letting the family's timeline become her own by default",
              "isTarget": true,
              "explain": "That's the real difference - not that the pressure is smaller, which it isn't, but that she has an actual second, personal reference point that doesn't automatically collapse into the family's."
            },
            {
              "label": "Her family's expectations are less intense than Pooja's",
              "isTarget": false,
              "explain": "The scenario describes the pressure as similar and ongoing - the difference isn't the intensity of what's coming from outside, it's what Simran has built internally to relate to it."
            },
            {
              "label": "She's simply less concerned with what her family thinks",
              "isTarget": false,
              "explain": "There's no basis for that in the scenario - the pressure still affects her. The difference is that she has a genuine, separate personal timeline to check against, not that the family's opinion doesn't matter to her."
            }
          ],
          "whyPrompt": "In a few words - how does having a genuinely separate personal timeline change what the pressure means?"
        },
        "apply": {
          "scenario": "A friend asks Simran how she handles the constant questions from relatives. She says: \"They still ask, and it still gets to me sometimes. I just have my own sense of when I'll actually be ready, and I check things against that, not just against what they're expecting.\"",
          "prompt": "In two or three sentences: think of your own version of an internalized family timeline - what would a genuinely separate personal timeline, alongside it, actually look like?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the useful pattern is noticing whether a genuine, separate personal timeline exists, or whether the family's timeline is currently the only one available."
        },
        "remember": {
          "prompt": "In a sentence or two: name one thing that would actually tell you, personally, that you're ready - separate from any external timeline.",
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
            "One more, and then a small piece of what actually happened with Pooja.",
            "In a rare, honest conversation, her mother admitted that the specific age she'd been repeating wasn't based on anything in particular - it was just the age her own mother had once mentioned to her, decades earlier, passed down without much thought behind it.",
            "That's not a coincidence, and it previews the tools coming in Week 4: the specific timelines and standards behind marriage pressure often turn out to be far less considered, and far more arbitrary, than their repetition makes them feel. The tools ahead don't make the pressure disappear - they give you a way to work with your own actual timeline alongside it."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does the mother's admission reveal about the specific age Pooja had internalized?",
          "options": [
            {
              "label": "The specific number had no real basis - it was simply passed down without much thought, which is very different from being a carefully considered standard",
              "isTarget": true,
              "explain": "Right - the number felt authoritative because of how often it was repeated, but its actual origin was arbitrary, not carefully reasoned."
            },
            {
              "label": "Her mother was just being honest to make Pooja feel better",
              "isTarget": false,
              "explain": "There's no indication of that in the scenario - the admission describes a genuine, unconsidered origin for the number, not a kind reframing offered to ease Pooja's mind."
            },
            {
              "label": "It doesn't really matter where the number came from, since it's still the expectation now",
              "isTarget": false,
              "explain": "Where a standard actually comes from matters a great deal for how much authority it deserves - an arbitrary, unconsidered number carries a very different weight than one your own life circumstances would suggest."
            }
          ],
          "whyPrompt": "In a few words - why does knowing where a standard actually came from change how much weight it deserves?"
        },
        "apply": {
          "scenario": "A different person, same shape of realisation: after finally asking directly, Ananya learns that her father's insistence on a specific career-before-marriage sequence wasn't based on any real reasoning either - it was just what had always been done in his own family, unexamined.",
          "prompt": "In two or three sentences: what does that discovery tell Ananya about the sequence she's been trying to follow?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"The sequence she's been following wasn't actually reasoned through - it's simply what's always been done, passed along without much examination, which is worth knowing before treating it as an unquestionable rule.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of a family expectation you're currently following - do you actually know where it came from?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: marriage pressure, and how an internalized, often arbitrary family timeline can crowd out genuine personal uncertainty and readiness. Next week: lack of privacy and boundaries, a related but distinct pattern."
  },
  {
    "num": 2,
    "title": "Privacy & boundaries: recognising the pattern",
    "mechanism": "B",
    "kind": "blocked",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w2t1",
        "title": "Recognition - the read message",
        "role": "Recognition #1",
        "delayedRef": "w1t5_apply",
        "delayedPrompt": "Last touch, on Ananya, you wrote this:",
        "relate": {
          "text": [
            "A different pattern this week: <b>lack of privacy and boundaries</b> - routine boundary violations in a living situation with limited personal space, producing either quiet resentment or reflexive over-explaining.",
            "Here's what that looks like. <b class='who'>Aditi</b> notices her mother has clearly read a text message left open on her phone, based on a comment made minutes later that could only have come from it. Aditi says nothing, feels a familiar mix of anger and resignation, and moves on with the day."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "Which of these actually explains what's happening? More than one will sound reasonable.",
          "options": [
            {
              "label": "A real, specific boundary was crossed without permission, and the response was to absorb it quietly rather than address it, which is itself part of a pattern worth noticing",
              "isTarget": true,
              "explain": "Right - a real boundary violation happened, and the pattern worth noticing isn't just the violation itself, but the reflexive choice to say nothing about it."
            },
            {
              "label": "Her mother probably had a good reason to check, given they live together",
              "isTarget": false,
              "explain": "Living together doesn't automatically justify reading someone's private messages - this reframes a real boundary crossing as reasonable without examining whether it actually was."
            },
            {
              "label": "Aditi should be more careful about leaving her phone unlocked around family",
              "isTarget": false,
              "explain": "This shifts responsibility for the boundary violation onto Aditi's own carelessness, rather than naming what actually happened - a private message being read without permission."
            }
          ],
          "whyPrompt": "In a few words - what's the giveaway that this is a real boundary violation, not just an unfortunate accident?"
        },
        "apply": {
          "scenario": "Same pattern, a different person: Farhan realizes his father has clearly gone through his room while he was out, based on items being slightly rearranged, and says nothing about it, the way he usually does.",
          "prompt": "Same thing happening here. In two or three sentences: what would you actually say to Farhan right now?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"That's a real boundary being crossed, whatever the reason behind it - noticing that, and noticing the choice to say nothing about it, matters, even before deciding what to actually do.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of a real moment this applies to you - what boundary has been crossed that you responded to by saying nothing?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t2",
        "title": "Recognition - explaining before being asked",
        "role": "Recognition #2",
        "delayedRef": "w2t1_apply",
        "delayedPrompt": "Last touch, on Farhan, you wrote this:",
        "relate": {
          "text": [
            "Same Aditi, a different context. Getting ready to go out with friends, she finds herself pre-emptively explaining, in detail, exactly where she's going and with whom - before anyone in her family has actually asked.",
            "Notice what's carried over: the lack of privacy hasn't just produced resentment about specific incidents. It's produced a habit of over-explaining herself in advance, as if she needs to pre-justify ordinary decisions before anyone even questions them."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What's actually happening as she gets ready to leave? Read all three carefully.",
          "options": [
            {
              "label": "A habit of pre-emptively justifying ordinary decisions has developed, in anticipation of scrutiny that hasn't even happened yet in this specific instance",
              "isTarget": true,
              "explain": "Right - no one has actually asked yet; the over-explaining is happening in anticipation, which is itself a sign of how normalized the scrutiny has become."
            },
            {
              "label": "She's just being considerate by keeping her family informed",
              "isTarget": false,
              "explain": "There's a real difference between keeping family reasonably informed and pre-emptively over-explaining an ordinary outing in detail before anyone has asked - the pattern described is closer to the latter."
            },
            {
              "label": "Her family probably does need to know these details for safety reasons",
              "isTarget": false,
              "explain": "This assumes a level of necessary oversight without evidence for it in the scenario, and doesn't address what's actually being shown: a reflexive habit of justification, not a considered safety practice."
            }
          ],
          "whyPrompt": "In a few words - why does explaining before being asked matter as much as the original boundary violations?"
        },
        "apply": {
          "scenario": "A different person, same shape of moment: before her sister has said anything, Meera finds herself over-explaining why she needs an evening alone in her room, offering reasons she wouldn't normally feel the need to give.",
          "prompt": "In two or three sentences: what's actually going on for Meera, and what would you point out about explaining before being asked?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"No one's actually questioned her yet - the pre-emptive explaining suggests how normalized the expectation of justification has become, even for something as ordinary as wanting an evening alone.\""
        },
        "remember": {
          "prompt": "In a sentence or two: do you find yourself explaining ordinary decisions before anyone's asked? What does that usually sound like?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t3",
        "title": "What silence about boundaries is actually costing",
        "role": "Functional logic",
        "delayedRef": "w2t2_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Between the read message and the pre-emptive explaining, there's a pattern worth naming honestly: staying quiet about boundary violations can feel like keeping the peace - avoiding conflict in a household where space is already limited.",
            "What it actually does is different: it doesn't reduce future violations, and it adds the ongoing cost of pre-emptive justification, on top of whatever the original violations already cost."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What is staying silent about boundaries actually doing? These are close - think it through.",
          "options": [
            {
              "label": "Failing to reduce future violations, while adding the further cost of habitual pre-emptive justification for ordinary decisions",
              "isTarget": true,
              "explain": "That's the real cost - silence doesn't actually prevent the next violation, and it comes with its own additional cost in constant, anticipatory explaining."
            },
            {
              "label": "Genuinely keeping the household calmer and more peaceful",
              "isTarget": false,
              "explain": "If it were doing that, the violations would be expected to decrease over time - instead, the pattern described shows them continuing, alongside a growing habit of pre-emptive justification."
            },
            {
              "label": "Respecting that this is simply how the household has always operated",
              "isTarget": false,
              "explain": "This treats the pattern as a neutral, unchangeable given, rather than naming what it's actually costing - which is the point of noticing the pattern honestly in the first place."
            }
          ],
          "whyPrompt": "In a few words - why doesn't staying silent actually reduce future boundary violations?"
        },
        "apply": {
          "scenario": "A friend, hearing Aditi describe both moments, asks: \"Has staying quiet ever actually stopped something like the message-reading from happening again?\" Aditi pauses. \"...No. It's happened more than once, honestly.\"",
          "prompt": "That's usually the tell. In two or three sentences: think of a boundary violation you stayed quiet about - did staying quiet actually prevent it from happening again?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the pattern to notice is whether staying silent actually reduced future violations, or just added the cost of ongoing pre-emptive explaining on top of them."
        },
        "remember": {
          "prompt": "In a sentence or two: what does the moment right after a boundary is crossed usually feel like for you?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t4",
        "title": "What holding a small boundary can look like",
        "role": "Contrast / boundary case",
        "delayedRef": "w2t3_apply",
        "delayedPrompt": "Last touch, you named this:",
        "relate": {
          "text": [
            "Here's what a similar living situation can look like for someone who relates to it differently.",
            "<b class='who'>Kavya</b> lives in a similarly close, low-privacy household - that hasn't changed. But she's found a few specific, small boundaries she can actually hold consistently, rather than either accepting every intrusion silently or trying to overhaul the whole household's habits at once.",
            "This is the module's contrast case for this pattern: a real, ongoing lack of privacy, honestly acknowledged - not the absence of intrusion, but a few specific, real boundaries held consistently within it."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What actually makes Kavya's approach different from Aditi's? All three can look similar in the moment.",
          "options": [
            {
              "label": "She holds a few specific, chosen boundaries consistently, rather than either accepting everything silently or attempting to change the whole household at once",
              "isTarget": true,
              "explain": "That's the real difference - not that her household is less intrusive, but that she's picked specific, real, holdable boundaries rather than an all-or-nothing response."
            },
            {
              "label": "Her family is generally more respectful of privacy than Aditi's",
              "isTarget": false,
              "explain": "The scenario describes a similarly close, low-privacy household - the difference isn't in the family's general behavior, it's in Kavya's specific, chosen response to it."
            },
            {
              "label": "She simply doesn't need as much privacy as Aditi does",
              "isTarget": false,
              "explain": "There's no basis for that in the scenario - the difference described is in what she's chosen to hold consistently, not in how much privacy she personally needs or wants."
            }
          ],
          "whyPrompt": "In a few words - why might a few small, consistent boundaries work better than trying to change everything at once?"
        },
        "apply": {
          "scenario": "A colleague asks Kavya how she manages with so little privacy at home. She says: \"I picked a couple of specific things - like knocking before entering my room - and I hold those consistently. I'm not trying to change everything, just those few things.\"",
          "prompt": "In two or three sentences: think of your own living situation - what's one small, specific boundary you could imagine holding consistently, even if you can't change everything at once?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the useful pattern is noticing whether a boundary is specific and realistically holdable, or whether it's actually a request to change the household's whole approach at once."
        },
        "remember": {
          "prompt": "In a sentence or two: name one small, specific boundary you could imagine actually holding consistently.",
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
            "One more, and then a small piece of what actually happened with Aditi.",
            "She finally mentioned, calmly and specifically, that she'd noticed the message had been read, and asked that it not happen again. Her mother, a little defensively at first, actually agreed - and largely has kept to it since, though not perfectly.",
            "That's not a coincidence, and it previews the tools coming in Week 5: a specific, calmly stated boundary is far more likely to actually be respected than silence ever was, even in a household where privacy has never really been the norm. The tools ahead don't promise a perfect household - they give you a way to actually raise what's been sitting silent."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does the mother's response tell us about what silence had actually been accomplishing?",
          "options": [
            {
              "label": "A specific, calmly stated boundary produced a real, if imperfect, change - something years of silence about the same issue had never produced",
              "isTarget": true,
              "explain": "Right - this is real evidence that naming the boundary directly did something silence never managed to do, even if the result isn't perfect."
            },
            {
              "label": "Her mother just happened to be in an agreeable mood that day",
              "isTarget": false,
              "explain": "This attributes the outcome to chance, when the more direct explanation is that a specific, clearly stated request produced a specific, if imperfect, response - which is the actual mechanism worth noticing."
            },
            {
              "label": "It doesn't really count as progress since it wasn't followed perfectly afterward",
              "isTarget": false,
              "explain": "This sets an unreasonably high bar - real, if imperfect, improvement following a specific request is still meaningfully different from the total lack of change that years of silence had produced."
            }
          ],
          "whyPrompt": "In a few words - why does even imperfect follow-through count as real evidence here?"
        },
        "apply": {
          "scenario": "A different person, same shape of realisation: after years of silently tolerating unannounced visits to his room, Vivaan finally asks his brother directly to knock first - and finds that, most of the time now, he actually does.",
          "prompt": "In two or three sentences: what does that mostly-successful outcome tell Vivaan about the years of silence beforehand?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"The years of silence hadn't been producing any real change - the direct, specific request did what all that silence never managed to.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of a boundary you've stayed silent about - what would actually naming it specifically look like?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: lack of privacy and boundaries, and how silence about specific violations tends to produce more silence, not more respect, while a specific, calmly stated boundary has a real chance of actually being honored. Next week: career pressure, where the boundary being crossed is around a major life choice rather than daily privacy."
  },
  {
    "num": 3,
    "title": "Career pressure: recognising the pattern",
    "mechanism": "C",
    "kind": "blocked",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w3t1",
        "title": "Recognition - the family business",
        "role": "Recognition #1",
        "delayedRef": "w2t5_apply",
        "delayedPrompt": "Last touch, on Vivaan, you wrote this:",
        "relate": {
          "text": [
            "This week's pattern is the third and last: <b>career pressure</b>, or a forced career - family-driven pressure to pursue a specific path, often for security or prestige, that may conflict with actual interests or aptitudes.",
            "Here's what that looks like. <b class='who'>Manav</b> has been quietly expected, for as long as he can remember, to eventually take over the family business. He's never actually been asked whether he wants to - it's simply been assumed, repeated so consistently that he's never seriously considered whether anything else might genuinely interest him."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "Which of these actually explains what's happening? More than one will sound reasonable.",
          "options": [
            {
              "label": "A path has been assumed and repeated so consistently that it's never actually been examined as a real choice, alongside real, unexplored alternatives",
              "isTarget": true,
              "explain": "Right - the tell isn't whether the family business is a bad option, it's that it's never actually been treated as one option among others worth genuinely considering."
            },
            {
              "label": "Taking over a family business is obviously the sensible, secure choice",
              "isTarget": false,
              "explain": "This assumes the practical merits of the path settle the question, without addressing what's actually being described - a path that's never been genuinely examined against real alternatives or Manav's own interests."
            },
            {
              "label": "Manav probably does want this, since he's never objected",
              "isTarget": false,
              "explain": "The scenario is explicit that he's never seriously considered alternatives, not that he's actively considered and chosen this path - the absence of objection isn't the same as an actual, examined choice."
            }
          ],
          "whyPrompt": "In a few words - what's the giveaway that this is about an unexamined assumption, not a genuinely considered choice?"
        },
        "apply": {
          "scenario": "Same pattern, a different person: Diya has been assumed, since childhood, to be following her parents into medicine - she's never seriously explored what else might interest her, since the path was simply always the plan.",
          "prompt": "Same thing happening here. In two or three sentences: what would you actually say to Diya right now?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"The plan being long-standing doesn't mean it's actually been chosen - it's worth asking whether you've ever genuinely explored what else might interest you, separate from what's simply always been assumed.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of a real moment this applies to you - what path has been assumed for you without ever really being examined?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w3t2",
        "title": "Recognition - the interest never pursued",
        "role": "Recognition #2",
        "delayedRef": "w3t1_apply",
        "delayedPrompt": "Last touch, on Diya, you wrote this:",
        "relate": {
          "text": [
            "Same Manav, thinking back. He remembers a real, genuine interest in a completely different field from years ago - one he'd found himself drawn to on his own, before quietly letting it drop, without ever really deciding to.",
            "Notice what's carried over: the assumed path didn't just go unexamined - it actively crowded out a real interest that had nowhere to go once the family's expectation took up all the available space."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What's actually significant about the interest he let drop? Read all three carefully.",
          "options": [
            {
              "label": "A genuine personal interest was crowded out by the assumed path, without ever being consciously weighed against it or actively decided against",
              "isTarget": true,
              "explain": "Right - the interest didn't lose out to a considered decision; it simply had no room once the family's expectation filled the space, which is a different thing."
            },
            {
              "label": "He probably realized on his own that the interest wasn't practical enough",
              "isTarget": false,
              "explain": "The scenario doesn't describe a considered decision - it describes the interest quietly dropping away, without Manav ever actively weighing it against the family's expected path."
            },
            {
              "label": "Interests from years ago usually aren't worth revisiting anyway",
              "isTarget": false,
              "explain": "This dismisses the interest based on its age rather than considering what actually happened to it - which is that it was crowded out, not outgrown or genuinely reconsidered and rejected."
            }
          ],
          "whyPrompt": "In a few words - why does it matter that the interest was crowded out, rather than actively rejected?"
        },
        "apply": {
          "scenario": "A different person, same shape of realisation: Arjun recalls a genuine curiosity about a creative field he explored briefly as a teenager, before the assumed path toward his family's engineering firm simply took over all his time and attention.",
          "prompt": "In two or three sentences: what's actually going on for Arjun, and what would you point out about what happened to that early curiosity?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"That curiosity was never actually rejected - it was crowded out by the assumed path taking up all the available space, which is worth distinguishing from a real, considered choice against it.\""
        },
        "remember": {
          "prompt": "In a sentence or two: is there a genuine interest of yours that got crowded out this way, rather than actively decided against?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w3t3",
        "title": "What the assumed path is actually costing",
        "role": "Functional logic",
        "delayedRef": "w3t2_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Between the family business and the crowded-out interest, there's a pattern worth naming honestly: following the assumed path can feel like the responsible, secure choice - avoiding risk, honoring the family, not wasting an established opportunity.",
            "What it actually costs is different: it forecloses any real examination of alternatives, meaning the security or prestige it offers is never actually weighed against what a genuinely chosen path might have offered instead."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What is the assumed path actually doing? These are close - think it through.",
          "options": [
            {
              "label": "Foreclosing any genuine examination of alternatives, so its practical benefits are never actually weighed against what a real, considered choice might have looked like",
              "isTarget": true,
              "explain": "That's the real cost - not that the assumed path is necessarily wrong, but that it's never actually been tested against real alternatives, which means its true value is unknown, not confirmed."
            },
            {
              "label": "Genuinely providing the most secure and sensible option available",
              "isTarget": false,
              "explain": "This might be true, but notice it's an assumption, not something that's actually been tested - the pattern described specifically prevents that comparison from ever happening."
            },
            {
              "label": "Protecting Manav from the real risks of pursuing something less certain",
              "isTarget": false,
              "explain": "This treats the alternative as definitely riskier without it ever having been genuinely explored - which is exactly the foreclosure the pattern produces, not an actual, informed risk comparison."
            }
          ],
          "whyPrompt": "In a few words - why does an unexamined path's value remain genuinely unknown, even if it seems obviously sensible?"
        },
        "apply": {
          "scenario": "A friend, hearing about Manav's crowded-out interest, asks: \"Have you ever actually compared what the family business offers against what that other path might have, or has it just always been assumed to be the better choice?\" Manav pauses. \"...Always just assumed, honestly. I've never actually looked into the other option seriously.\"",
          "prompt": "That's usually the tell. In two or three sentences: think of an assumed path in your own life - have you ever actually compared it to a real alternative, or has it just always been assumed to be the better choice?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the pattern to notice is whether the assumed path has ever actually been weighed against a real alternative, or whether it's simply never been questioned."
        },
        "remember": {
          "prompt": "In a sentence or two: what does the assumed path in your own life actually feel like to think about - settled, or something you've never quite examined?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w3t4",
        "title": "What reconciling both can look like",
        "role": "Contrast / boundary case",
        "delayedRef": "w3t3_apply",
        "delayedPrompt": "Last touch, you named this:",
        "relate": {
          "text": [
            "Here's what a similar pressure can look like for someone with a different relationship to it.",
            "<b class='who'>Kunal</b> is under similar pressure to follow a specific family-expected career path - that pressure hasn't gone away. But he's found a way to genuinely reconcile some of his own real interests with the practical and family considerations, rather than treating it as an all-or-nothing choice between the two.",
            "This is the module's contrast case for this pattern: real, ongoing family expectation, honestly acknowledged - not the absence of pressure, but an actual, examined reconciliation between it and his own interests."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What actually makes Kunal's situation different from Manav's? All three can look similar in the moment.",
          "options": [
            {
              "label": "He's actually examined his own interests alongside the family's expectation and found real, specific ways to reconcile parts of both, rather than letting one simply crowd out the other",
              "isTarget": true,
              "explain": "That's the real difference - not that his family pressure is lighter, but that he's done the genuine examination Manav's path has never had."
            },
            {
              "label": "His family's expected path happens to align better with his interests by luck",
              "isTarget": false,
              "explain": "The scenario describes active reconciliation, not a lucky coincidence - the difference is in the work Kunal has done, not in how well-matched the two happened to be from the start."
            },
            {
              "label": "He's simply more willing to compromise than Manav",
              "isTarget": false,
              "explain": "This frames it as a personality trait rather than naming what's actually different - a genuine, active process of examining and reconciling both sets of considerations."
            }
          ],
          "whyPrompt": "In a few words - what does 'reconciling' actually involve, that simply following the assumed path doesn't?"
        },
        "apply": {
          "scenario": "A colleague asks Kunal how he made peace with his family's expectations. He says: \"I actually looked at what I was genuinely interested in, and found real ways to bring some of that into the path they expected, instead of just accepting it wholesale or rejecting it outright.\"",
          "prompt": "In two or three sentences: think of your own assumed path - is there a genuine way to bring a real interest of yours into it, the way Kunal did?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the useful pattern is noticing whether any real examination or reconciliation has actually happened, or whether the assumed path has simply never been questioned."
        },
        "remember": {
          "prompt": "In a sentence or two: name one genuine interest of yours that might have a real place within your own assumed path.",
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
            "One more, and then a small piece of what actually happened with Manav.",
            "In a quiet moment, he mentioned the old interest to his father, expecting dismissal - and instead found his father genuinely curious, even mentioning that he'd once considered a different path himself before circumstances made the family business the practical choice at the time.",
            "That's not a coincidence, and it previews the tools coming in Week 6: the assumption that family expectation and personal interest are simply opposed often turns out to be less solid than it feels, once actually tested. The tools ahead don't promise the pressure will resolve easily - they give you a way to actually examine the choice, rather than letting it remain permanently unexamined."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does the father's reaction reveal about the assumption Manav had been carrying?",
          "options": [
            {
              "label": "The assumption that his father would simply dismiss the old interest turned out not to be tested until this moment - and the actual reaction was more complicated and less oppositional than assumed",
              "isTarget": true,
              "explain": "Right - Manav had been carrying an assumption about his father's reaction that had never actually been tested, and the real conversation revealed something more nuanced."
            },
            {
              "label": "His father was just being polite about something he doesn't actually care about",
              "isTarget": false,
              "explain": "There's no evidence for that in the scenario - the father's own history with a similar choice suggests genuine understanding, not empty politeness."
            },
            {
              "label": "This doesn't really change anything, since the family business is still the practical choice",
              "isTarget": false,
              "explain": "This may still be true, but it misses what's actually significant here - a previously untested assumption about opposition between family and interest turned out not to hold up the way Manav had assumed."
            }
          ],
          "whyPrompt": "In a few words - why does testing an assumption about family reaction matter, even if the practical outcome doesn't change right away?"
        },
        "apply": {
          "scenario": "A different person, same shape of realisation: after finally mentioning her own interest in a different field, Sanya is surprised to learn her mother had quietly hoped she'd pursue exactly that, but had never said so, assuming the family's usual path was simply expected.",
          "prompt": "In two or three sentences: what does that conversation tell Sanya about the assumption she'd been carrying?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"The opposition she'd assumed was there had never actually been tested - and the real conversation revealed something quite different from what she'd been assuming all along.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of an assumption you're carrying about your family's reaction to a real interest of yours - has it ever actually been tested?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: career pressure, and how an unexamined assumption of opposition between family expectation and personal interest often turns out to be less solid than it feels. That's all three patterns recognised. Next week: the tools start, beginning with marriage pressure."
  },
  {
    "num": 4,
    "title": "Marriage pressure: four tools, and a plan",
    "mechanism": "A",
    "kind": "technique",
    "retrievalCheck": {
      "prompt1": "In your own words - what is marriage pressure, and what does an internalized family timeline actually do, versus what it can feel like it's doing?",
      "prompt2": "And what is lack of privacy and boundaries - how is it actually different from marriage pressure, given both involve family expectations?",
      "reveal": "Marriage pressure is persistent family pressure around a major life decision, often internalized as if the family's specific timeline were an objective fact, when it's usually just one particular, often arbitrary, family expectation. It doesn't clarify what someone actually wants, it just makes genuine uncertainty feel illegitimate. Lack of privacy and boundaries is a pattern of routine, specific boundary violations in daily living - a different scale of issue, about ongoing personal space rather than one major life decision, though both can produce a similar pattern of silent absorption rather than direct address."
    },
    "touches": [
      {
        "id": "w4t1",
        "title": "Values-Based Decision-Making Worksheets",
        "role": "Technique A1 - ACT (Wilson & Lundgren)",
        "delayedRef": "w3t5_apply",
        "delayedPrompt": "Last week, your answer was:",
        "relate": {
          "text": [
            "This is the first of the four tools for marriage pressure from your theory grounding screen: <b>values-based decision-making worksheets</b>.",
            "Remember the false choice between autonomy and family connection? This tool makes weighing both honestly deliberate: a structured worksheet naming both values, and checking a specific decision against both, rather than treating one as automatically defeating the other."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might naming both values honestly, rather than picking one as 'correct', actually produce a more workable answer?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a real decision related to marriage pressure that you're currently facing, or have faced.",
          "prompt": "In two or three sentences: weigh the decision against both autonomy and family connection - where do they genuinely align, and where do they genuinely pull apart?",
          "placeholder": "Where they align: ... / Where they pull apart: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether both values were taken seriously, not just one accepted and the other dismissed."
        },
        "remember": {
          "prompt": "In a sentence or two: did weighing both honestly change how the decision felt to think about?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w4t2",
        "title": "Interpersonal Role-Transition Work",
        "role": "Technique A2 - IPT (Klerman & Weissman) - guided",
        "guardrail": true,
        "delayedRef": "w4t1_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "The second tool, and this one's different from the others this week, on purpose: <b>interpersonal role-transition work</b>.",
            "Marriage pressure often treats the transition as purely a timeline to meet. This tool names the real shift underneath - from one role to another, with everything that implies - grieving what the current role offers and identifying what the new one could realistically offer instead.",
            "Because this asks you to engage with something real and personal, this touch checks in with you directly partway through."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might naming the actual role shift, not just the timeline, matter for working through marriage pressure?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think honestly about the real transition marriage would represent for you, whether it feels close or distant right now.",
          "intensityPrompt": "First, choose how far you want to go with this right now:",
          "intensityOptions": [
            "Smaller version - just name what the current role offers you",
            "Bigger version - name both what the current role offers and what the new one could realistically offer"
          ],
          "prompt": "In two or three sentences: name what your current role offers you, and - if you chose the bigger version - what a new one could realistically offer instead.",
          "placeholder": "What the current role offers: ... / (If bigger version) What a new one could offer: ..."
        },
        "distressPrompt": "You've just named something real and personal. Before we continue - how are you feeling right now?",
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the reflection is genuinely specific to your own life, not a generic statement about marriage in general."
        },
        "remember": {
          "prompt": "In a sentence or two: was there a real transition there you hadn't fully named before this touch?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w4t3",
        "title": "Re-Authoring the 'Marriage Timeline' Narrative",
        "role": "Technique A3 - Narrative Therapy (White & Epston)",
        "delayedRef": "w4t2_apply",
        "delayedPrompt": "Last touch, your reflection was:",
        "relate": {
          "text": [
            "The third tool: <b>re-authoring the marriage timeline narrative</b>.",
            "Remember Pooja's mother admitting the specific age had no real basis? This tool makes questioning the timeline deliberate: name the family's specific timeline as one particular story, not the only possible one, and identify what a personally-authored version would actually include."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might naming the family's timeline as 'one story' rather than 'the truth' make it easier to question?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of the specific timeline or standard you named back in Week 1.",
          "prompt": "In two or three sentences: write it as one particular story, then write what a personally-authored version would actually include.",
          "placeholder": "The family's story: ... / My own version: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the personal version is genuinely yours, not just a softened version of the family's."
        },
        "remember": {
          "prompt": "In a sentence or two: did writing your own version feel different from just reacting to the family's?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w4t4",
        "title": "A Decisional-Balance Exercise for Ambivalence",
        "role": "Technique A4 - Motivational Interviewing (Miller & Rollnick)",
        "delayedRef": "w4t3_apply",
        "delayedPrompt": "Last touch, your version was:",
        "relate": {
          "text": [
            "The fourth tool: <b>a decisional-balance exercise</b> - mapping out the genuine pros and cons of both moving toward marriage now and waiting, honestly, on both sides, rather than treating ambivalence as a problem to resolve quickly."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might mapping ambivalence out honestly, rather than trying to resolve it quickly, actually produce more clarity?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of your own genuine ambivalence about timing, if you have any.",
          "prompt": "In two or three sentences: name one real pro and one real con for both moving forward now and waiting.",
          "placeholder": "Moving forward - pro and con: ... / Waiting - pro and con: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether all four points are honest and specific, not skewed to make one side obviously win."
        },
        "remember": {
          "prompt": "In a sentence or two: did mapping it out honestly change how the ambivalence itself felt?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w4t5",
        "title": "How did it go, and a plan for next time",
        "role": "Check-in + pre-commitment",
        "delayedRef": "w4t4_apply",
        "delayedPrompt": "Last touch, your points were:",
        "relate": {
          "text": [
            "No new idea this touch - two quick things before we move to privacy and boundaries.",
            "First, a real check-in on the four tools from this week - the same four that started with Pooja's family gathering back in Week 1. Then, a plan built now, while things feel calm."
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
          "text": "Something like: \"If someone brings up the marriage timeline again at a family gathering, then I'll remind myself it's one family's story, not an objective fact, before deciding how to respond.\""
        },
        "remember": {
          "prompt": "In a sentence or two: say the plan back to yourself - does it actually sound doable at a real family gathering?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: four named tools for marriage pressure - values-based decision-making, interpersonal role-transition work, re-authoring the timeline narrative, and a decisional-balance exercise - a real check-in, and a plan built while calm. No new teaching in this summary. Next week: the same shape, for privacy and boundaries."
  },
  {
    "num": 5,
    "title": "Privacy & boundaries: four tools, and a plan",
    "mechanism": "B",
    "kind": "technique",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w5t1",
        "title": "Assertive Boundary-Setting Scripts Using DESC",
        "role": "Technique B1 - Assertiveness Training (Bower & Bower)",
        "delayedRef": "w4t5_apply",
        "delayedPrompt": "Last week, your if-then plan was:",
        "relate": {
          "text": [
            "This is the first of the four tools for privacy and boundaries from your theory grounding screen: <b>assertive boundary-setting scripts using the DESC framework</b>.",
            "Remember Aditi's calmly stated boundary about the read message? This tool makes preparing that kind of boundary deliberate: <b>D</b>escribe the specific behavior, <b>E</b>xpress how it affects you, <b>S</b>pecify what you'd like instead, and name the <b>C</b>onsequence if honored - prepared in advance for a specific, real boundary."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might a specific, prepared script about privacy be harder to dismiss than a general request for 'more space'?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a real, specific privacy boundary you'd like to raise, maybe the one you named back in Week 2.",
          "prompt": "In two or three sentences: write a DESC script for it - describe, express, specify, and the consequence.",
          "placeholder": "Describe: ... / Express: ... / Specify: ... / Consequence: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether each part is specific and concrete, not a vague general complaint about privacy."
        },
        "remember": {
          "prompt": "In a sentence or two: how did it feel to write the script out, even before saying it to anyone?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w5t2",
        "title": "The DEAR MAN Interpersonal-Effectiveness Skill",
        "role": "Technique B2 - DBT (Linehan)",
        "delayedRef": "w5t1_apply",
        "delayedPrompt": "Last touch, your script was:",
        "relate": {
          "text": [
            "The second tool: <b>DEAR MAN</b> - <b>D</b>escribe the situation, <b>E</b>xpress feelings, <b>A</b>ssert the request clearly, <b>R</b>einforce why it helps, staying <b>M</b>indful of the goal, <b>A</b>ppearing confident, and being willing to <b>N</b>egotiate.",
            "This is the quicker, in-the-moment counterpart to the DESC script - built for when a boundary needs to be raised right now, not planned days ahead."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might having a fast, repeatable structure matter for boundaries that come up unexpectedly, versus ones you can prepare for?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a boundary moment that tends to come up unexpectedly, without much warning.",
          "prompt": "In two or three sentences: walk through the DEAR MAN structure for that moment - what would each part actually sound like?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the structure feels usable in a real, fast-moving moment, not just on paper."
        },
        "remember": {
          "prompt": "In a sentence or two: which part of DEAR MAN feels hardest for you to actually do in the moment?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w5t3",
        "title": "Cognitive Restructuring of Guilt-Driven Beliefs",
        "role": "Technique B3 - CBT (Beck)",
        "delayedRef": "w5t2_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "The third tool: <b>cognitive restructuring of guilt-driven beliefs about asserting boundaries</b> - naming the specific guilt-producing belief underneath hesitation to set a boundary, and testing it against real evidence."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why does the guilt about setting a boundary often need its own separate tool, beyond just having a script ready?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of the guilt that shows up before you'd actually raise a boundary.",
          "prompt": "In two or three sentences: name the specific guilt-producing belief, and test it against real evidence.",
          "placeholder": "The belief: ... / The evidence: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the evidence genuinely addresses the specific belief, not a general reassurance."
        },
        "remember": {
          "prompt": "In a sentence or two: did naming the belief directly change how much weight the guilt carried?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w5t4",
        "title": "Behavioural Rehearsal of Boundary Conversations",
        "role": "Technique B4 - Behaviour Rehearsal (Wolpe)",
        "delayedRef": "w5t3_apply",
        "delayedPrompt": "Last touch, your belief was:",
        "relate": {
          "text": [
            "The fourth tool: <b>behavioural rehearsal</b> - practicing a prepared script, from B1 or B2, out loud, ahead of time, so the words are already familiar before the real conversation happens."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might a boundary script specifically about family privacy need this kind of rehearsal more than other kinds of scripts might?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Use the script you wrote earlier this week, or a new one.",
          "prompt": "In two or three sentences: try saying it out loud, and describe what that was actually like.",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether saying it out loud revealed anything the written version didn't."
        },
        "remember": {
          "prompt": "In a sentence or two: is this a real conversation you could imagine having, using this script, sometime soon?",
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
            "No new idea this touch - two quick things before we move to career pressure.",
            "First, a real check-in on this week's four tools - the same four that started with Aditi's read message back in Week 2. Then a plan built now, before the next boundary moment shows up."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Which of the four did you actually try this week, and what happened?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Pick whichever of the four tools felt most useful this week.",
          "prompt": "In two or three sentences: write an if-then plan for using it: 'If [specific cue], then I will [specific tool, specifically applied].'",
          "placeholder": "If [specific cue], then I will..."
        },
        "reveal": {
          "text": "Something like: \"If I notice a boundary has been crossed again, then I'll use DEAR MAN to raise it in the moment, rather than staying quiet the way I usually do.\""
        },
        "remember": {
          "prompt": "In a sentence or two: say the plan back to yourself - does it actually sound doable in a genuinely low-privacy household?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: four named tools for privacy and boundaries - DESC scripting, DEAR MAN, cognitive restructuring of guilt, and behavioural rehearsal - a real check-in, and a plan built while calm. No new teaching in this summary. Next week: career pressure."
  },
  {
    "num": 6,
    "title": "Career pressure: three tools, and a plan",
    "mechanism": "C",
    "kind": "technique",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w6t1",
        "title": "Values Clarification & Committed-Action Planning",
        "role": "Technique C1 - ACT (Hayes)",
        "delayedRef": "w5t5_apply",
        "delayedPrompt": "Last week, your if-then plan was:",
        "relate": {
          "text": [
            "This is the first of the three tools for career pressure from your theory grounding screen: <b>values clarification and committed-action planning</b>.",
            "Remember Manav's crowded-out interest? This tool makes reclaiming space for it deliberate: name what actually matters personally in a working life, separate from the family-expected path, and identify one small, real, committed next step toward it."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might a small, committed step matter more right now than a big decision about the whole career path?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a real interest of yours that's been crowded out, maybe the one you named back in Week 3.",
          "prompt": "In two or three sentences: name what actually matters to you about it, and one small, real step you could take toward it this week.",
          "placeholder": "What matters to me: ... / One small step: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the step is genuinely small enough to actually take, not a disguised version of a much bigger decision."
        },
        "remember": {
          "prompt": "In a sentence or two: does having one small step feel different from facing the whole decision at once?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w6t2",
        "title": "Structured Interest & Aptitude Exploration",
        "role": "Technique C2 - Trait-and-Factor & Career-Development Theory (Parsons; Super)",
        "delayedRef": "w6t1_apply",
        "delayedPrompt": "Last touch, your step was:",
        "relate": {
          "text": [
            "The second tool: <b>structured interest and aptitude exploration</b>, drawing on established career-development frameworks rather than a vague sense of wanting something different."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might a structured exploration reveal more than simply asking yourself 'what do I actually like'?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think honestly about your actual interests and strengths, separate from any assumed path.",
          "prompt": "In two or three sentences: name one genuine interest and one genuine strength, and one real path they might point toward that you haven't seriously considered.",
          "placeholder": "Interest and strength: ... / A path worth considering: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the interest and strength named are genuinely yours, not borrowed from the assumed path."
        },
        "remember": {
          "prompt": "In a sentence or two: was the path you named something you'd genuinely consider, or just an exercise?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w6t3",
        "title": "Examination of Freedom & Responsibility",
        "role": "Technique C3 - Existential Therapy (Yalom)",
        "delayedRef": "w6t2_apply",
        "delayedPrompt": "Last touch, your path was:",
        "relate": {
          "text": [
            "The third tool: <b>examining freedom and responsibility</b> in choosing a life path - how much of the career pressure is a genuine lack of choice, versus a difficult choice being avoided, and what taking real ownership of it would involve."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might naming a difficult choice as a choice, rather than something imposed, restore a sense of agency even when every option has a real cost?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of the career pressure you've been working with this week.",
          "prompt": "In two or three sentences: is there a real option you've been experiencing as 'not a real choice'? What would actually taking ownership of it, costs included, look like?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether a genuine option got named as an option, with its real cost acknowledged honestly."
        },
        "remember": {
          "prompt": "In a sentence or two: did naming it as a real, if costly, choice change how it felt to carry?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w6t4",
        "title": "How did it go",
        "role": "Check-in",
        "delayedRef": "w6t3_apply",
        "delayedPrompt": "Last touch, your answer was:",
        "relate": {
          "text": [
            "No new idea this touch - just a real check-in on the three tools from this week, the same three that started with Manav's family business back in Week 3."
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
        "id": "w6t5",
        "title": "A plan for next time",
        "role": "Pre-commitment",
        "delayedRef": "w6t4_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "One more before Week 7: a plan built now, before the next moment the assumed path feels like the only option."
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
          "text": "Something like: \"If I catch myself assuming there's no real alternative to the expected path, then I'll remind myself that's a choice I haven't actually examined yet, not a fact.\""
        },
        "remember": {
          "prompt": "In a sentence or two: say the plan back to yourself - does it actually sound doable the next time this comes up?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: three named tools for career pressure - values clarification and committed action, structured interest exploration, and examining freedom and responsibility - a real check-in, and a plan built while calm. No new teaching in this summary. Next week: all three patterns together, and the one unscaffolded test."
  },
  {
    "num": 7,
    "title": "Integration & review",
    "mechanism": "both",
    "kind": "integration",
    "retrievalCheck": {
      "prompt1": "Name one tool for marriage pressure and, in your own words, what it actually does.",
      "prompt2": "Name one tool for career pressure and, in your own words, what it actually does.",
      "reveal": "Any of the four marriage-pressure tools or three career-pressure tools count here - what matters is whether the description is functional (what the tool actually does and why) rather than just the name repeated back."
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
            "Meher's parents have been pressuring her about marriage timing (marriage pressure) - and in the same conversations, they've started reading into her phone and questioning her plans in detail, treating the marriage question as license to scrutinize everything else too (lack of privacy)."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Both patterns showed up here. Which one do you think is actually driving the other, and why?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Same situation - Meher's parents and the increased scrutiny.",
          "prompt": "In two or three sentences: what would you actually recommend Meher try, and why that one, out of all eleven tools you now know?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's a real case either way. Some would start with a DESC script specifically addressing the privacy scrutiny, since that's the more immediate, specific violation. Others would say the values-based decision worksheet matters more, since the marriage pressure seems to be the root cause licensing the broader scrutiny. Either is defensible - what matters is she picks one and actually runs it."
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
            "Arnav has been avoiding a real conversation about his actual career interests (career pressure) partly because raising it at all would mean pushing back against his family for the first time - something he's never done, having always stayed quiet about boundaries in general (lack of privacy and boundaries)."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "What's driving what here, in your own words - is the boundary-avoidance feeding the career silence, or are they separate patterns that happen to reinforce each other?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Same situation - Arnav's unspoken career interest and his general pattern of staying quiet.",
          "prompt": "In two or three sentences: design a full plan for Arnav - combine tools across patterns if that's what it takes.",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"Cognitive restructuring of the guilt around asserting boundaries addresses the more general pattern first - since that seems to be what's actually blocking him from raising anything, not just the career question specifically. Once that's a bit looser, values clarification gives him something concrete to actually raise.\""
        },
        "remember": {
          "prompt": "In a sentence or two: which of the three patterns do you reach for tools on first, generally - and why do you think that's your instinct?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w7t3",
        "title": "When all three show up at once",
        "role": "Integration",
        "delayedRef": "w7t2_apply",
        "delayedPrompt": "Last touch, your plan for Arnav was:",
        "relate": {
          "text": [
            "Ishita is being pressured to marry a specific match her family has arranged (marriage pressure), has had her phone checked twice this month by a concerned aunt staying with the family (privacy), and is also expected to leave her current job for one closer to the match's family, ending any real chance at the career path she's actually been building toward (career pressure)."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "All three patterns showed up here. In your own words, how do they seem to be feeding each other?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Same situation - Ishita's arranged match and everything tied to it.",
          "prompt": "In two or three sentences: what's the one move that would actually help the most right now, and why that one over the others?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single right answer - the pattern worth noticing is that all three genuinely converge here around one decision, which is unusually concentrated - most real situations won't have all three tied together this tightly, but when they are, no single tool untangles all three at once."
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
            "Yash has quietly stopped mentioning a career opportunity he's genuinely excited about, after his mother made an offhand comment linking it to \"still not being settled down\" - now avoiding the topic feels tied up with avoiding the marriage question too, even though they're not actually the same thing."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "If you had to guess which pattern is actually the loudest here, which would you guess, and what would you look for to check?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Same situation - Yash and the career opportunity he's stopped mentioning.",
          "prompt": "In two or three sentences: what's the one move that unblocks the most here, if there is one - and if there isn't, say so.",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Often the honest answer is that no single tool resolves all three cleanly - re-authoring the marriage timeline narrative might loosen the link his mother drew between the two topics, while values clarification for the career opportunity gives him something specific to actually raise, separate from the marriage question entirely."
        },
        "remember": {
          "prompt": "In a sentence or two: what's your instinct, generally - untangle linked issues first, or address the most urgent one and let the others follow?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w7t5",
        "title": "Your own situation - nothing pre-walked",
        "role": "Transfer test",
        "transferTest": true,
        "delayedRef": "w7t4_apply",
        "delayedPrompt": "Last touch, your instinct was:",
        "relate": {
          "text": [
            "This is the one part of the module built with no scaffolding at all.",
            "You've followed Pooja through an internalized timeline, Aditi through a read message, and Manav through a crowded-out interest - and hopefully noticed the shape of one or more of these patterns in your own family life too, more than once.",
            "Now it's just yours. You've got a real situation right now - marriage pressure, lack of privacy, career pressure, maybe more than one at once. Don't simplify it for us."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Describe it in your own words - what's actually going on, as specifically as you can.",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "With nothing pre-walked this time.",
          "prompt": "In two or three sentences: what's your actual next move, and why that one - which of the eleven tools, and why not one of the others?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single right answer here - this was the one part of the module deliberately built to have no signalled answer. What matters is whether your reasoning traces back to the tools from your theory grounding screen and Weeks 4-6, not whether it matches anyone else's."
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
    "code": "A1",
    "rep": 1,
    "type": "reflection",
    "scenario": "A decision related to marriage timing is coming up, and it feels like autonomy and family connection are pulling in opposite directions.",
    "prompt": "In two or three sentences: weigh the decision against both values honestly - where do they align, and where do they pull apart?",
    "reveal": "There's no single model answer here - the tell is whether both values were taken seriously."
  },
  {
    "code": "A1",
    "rep": 2,
    "type": "reflection",
    "scenario": "A different decision related to marriage pressure comes up, maybe smaller than the last one.",
    "prompt": "In two or three sentences: weigh it against both values again.",
    "reveal": "There's no single model answer here - the tell is honesty on both sides, not one value automatically winning."
  },
  {
    "code": "A3",
    "rep": 1,
    "type": "reflection",
    "scenario": "A family member repeats a specific marriage-related expectation you've heard many times before.",
    "prompt": "In two or three sentences: name it as one particular story, and write what your own version would include.",
    "reveal": "There's no single model answer here - the tell is whether your version is genuinely yours."
  },
  {
    "code": "A3",
    "rep": 2,
    "type": "reflection",
    "scenario": "Some time has passed since you last wrote your own version of the story - worth checking if it still feels accurate.",
    "prompt": "In two or three sentences: revisit it, and note honestly if anything's changed.",
    "reveal": "There's no single model answer here - the tell is honesty about what's actually changed, not forced consistency."
  },
  {
    "code": "A4",
    "rep": 1,
    "type": "reflection",
    "scenario": "You notice real ambivalence about a marriage-related decision, and the urge to resolve it quickly.",
    "prompt": "In two or three sentences: map one pro and one con for both sides, honestly.",
    "reveal": "There's no single model answer here - the tell is honesty, not a skewed comparison."
  },
  {
    "code": "A4",
    "rep": 2,
    "type": "reflection",
    "scenario": "A different aspect of the same ambivalence shows up.",
    "prompt": "In two or three sentences: map it out again for this specific aspect.",
    "reveal": "There's no single model answer here - the tell is specificity to this particular aspect, not a repeat of the same general points."
  },
  {
    "code": "B1",
    "rep": 1,
    "type": "reflection",
    "scenario": "A specific privacy boundary keeps getting crossed, and you haven't raised it yet.",
    "prompt": "In two or three sentences: write a DESC script for it.",
    "reveal": "There's no single model answer here - the tell is specificity in each part."
  },
  {
    "code": "B1",
    "rep": 2,
    "type": "reflection",
    "scenario": "A different, separate privacy boundary comes to mind.",
    "prompt": "In two or three sentences: write a DESC script for this one too.",
    "reveal": "There's no single model answer here - the tell is specificity, not a repeat of the same script."
  },
  {
    "code": "B3",
    "rep": 1,
    "type": "reflection",
    "scenario": "You notice guilt showing up before you'd even raise a boundary about privacy.",
    "prompt": "In two or three sentences: name the guilt-producing belief, and test it against evidence.",
    "reveal": "There's no single model answer here - the tell is evidence that genuinely addresses the specific belief."
  },
  {
    "code": "B3",
    "rep": 2,
    "type": "reflection",
    "scenario": "A different guilt-producing belief about a different boundary shows up.",
    "prompt": "In two or three sentences: name and test this one too.",
    "reveal": "There's no single model answer here - the tell is a genuine, specific test, not a generic reassurance."
  },
  {
    "code": "C1",
    "rep": 1,
    "type": "reflection",
    "scenario": "You notice a real interest of yours that's been crowded out by an assumed career path.",
    "prompt": "In two or three sentences: name what matters about it, and one small step toward it.",
    "reveal": "There's no single model answer here - the tell is a genuinely small, doable step."
  },
  {
    "code": "C1",
    "rep": 2,
    "type": "reflection",
    "scenario": "A different interest, or a next step on the same one, comes to mind.",
    "prompt": "In two or three sentences: name it and a small step toward it.",
    "reveal": "There's no single model answer here - the tell is specificity and a realistically small scope."
  },
  {
    "code": "C2",
    "rep": 1,
    "type": "reflection",
    "scenario": "It's been a while since you honestly considered your own interests and strengths separate from the assumed path.",
    "prompt": "In two or three sentences: name one genuine interest or strength, and a path it might point toward.",
    "reveal": "There's no single model answer here - the tell is whether it's genuinely yours, not borrowed from the assumed path."
  },
  {
    "code": "C2",
    "rep": 2,
    "type": "reflection",
    "scenario": "A different interest or strength comes to mind, one you haven't considered before.",
    "prompt": "In two or three sentences: name it and where it might point.",
    "reveal": "There's no single model answer here - the tell is genuine curiosity, not forcing a connection to the assumed path."
  }
],
  toolsData: {
  "dear_man_log": {
    "code": "B2",
    "title": "DEAR MAN",
    "mechShort": "Privacy & Boundaries",
    "kind": "log_single",
    "intro": "Describe, Express, Assert, Reinforce, staying Mindful, Appearing confident, willing to Negotiate - for boundary requests that come up in the moment. Log it each time you actually use it.",
    "logLabel": "What was the situation, and how did DEAR MAN go?",
    "firstPlaceholder": "e.g. Sibling walked in without knocking again - used DEAR MAN on the spot, felt awkward but got the request out clearly",
    "placeholder": "Your answer..."
  },
  "boundary_rehearsal_log": {
    "code": "B4",
    "title": "Rehearse a Boundary Conversation",
    "mechShort": "Privacy & Boundaries",
    "kind": "log_single",
    "intro": "Say a prepared boundary script out loud, ahead of a real conversation, so the words are already familiar. Log it whenever you actually rehearse one.",
    "logLabel": "What conversation were you preparing for, and how did the rehearsal go?",
    "firstPlaceholder": "e.g. Preparing to raise the read-message issue with my mother - saying it out loud made me soften one phrase that sounded too harsh",
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
    tier1: "Any statement connecting marriage pressure, lack of privacy, or career pressure to intent or a plan to end one's life or self-harm (\"I can't take this anymore, I want it to just stop for good\", \"I have a way to end it\").",
    tier2: "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary frustration or guilt of navigating real family pressure, which is what this module is specifically designed to help with.",
    systemPrompt: "You are a safety classifier inside a mental-health support app used in India. Classify the user's message into exactly one of: NONE, TIER1, TIER2.\n\nTIER1 definition: Any statement connecting marriage pressure, lack of privacy, or career pressure to intent or a plan to end one's life or self-harm (\"I can't take this anymore, I want it to just stop for good\", \"I have a way to end it\").\nTIER2 definition: Persistent hopelessness about life broadly, or real functional collapse - not the ordinary frustration or guilt of navigating real family pressure, which is what this module is specifically designed to help with.\n\nCritical context: many people, especially in Indian English, use hyperbolic or idiomatic self-deprecating language that is NOT a genuine risk signal - for example \"my parents will kill me if I don't get married soon\", \"this deadline is literally killing me\". Do NOT classify ordinary hyperbole, jokes, or figures of speech as TIER1 or TIER2, even if they contain words like \"kill\", \"die\", or \"worthless\". This module's content involves real family pressure around marriage, privacy, and career - genuine frustration, guilt, or distress about these topics is not itself a risk signal.\n\nOnly classify as TIER1 if there is a genuine indication of intent, a plan, or serious risk to the person's life or safety. Only classify as TIER2 if there is genuine persistent hopelessness about life broadly, or real functional collapse - not the ordinary frustration or guilt of navigating real family pressure, which is what this module is designed to help with.\n\nWhen genuinely uncertain, prefer the lower tier (or NONE) rather than over-triggering - but never downgrade language that includes a specific plan, method, or timeframe.\n\nRespond with ONLY a raw JSON object, no markdown fences, no other text: {\"tier\": \"NONE\" | \"TIER1\" | \"TIER2\", \"reason\": \"one short clause\"}",
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
    "text": "All 11 practicable technique mappings are my synthesis of the taxonomy's named sources - not clinician-reviewed."
  },
  {
    "area": "Clinical",
    "text": "Tier 1/2 escalation definitions for this module are a first draft, awaiting sign-off. As with Module 9, no module-specific classifier note was written - flagging this consistently now as a pattern worth a deliberate check, not an assumption that content without an obvious calibration risk during writing is automatically fine."
  },
  {
    "area": "Structural note",
    "text": "Same 3-mechanism, 7-week shape as Modules 1, 4, and 9. T=4 (Mechanism A, one [B]), T=4 (Mechanism B, all [A]), T=3 (Mechanism C, all [A], exact fit). No new structural cases - a clean reuse of already-validated formulas."
  },
  {
    "area": "Content-authorship, recurring techniques (second occurrence of this open question)",
    "text": "Two techniques in this module are the exact same technique and source as techniques already built in Module 9: B1 (DESC scripting, Bower & Bower) matches Module 9's A3 exactly, and B4 (behavioural rehearsal, Wolpe-style) matches Module 9's A4 exactly. Both were written fresh for this module's privacy/boundaries context (different scenario, different character, different specific application) rather than reused verbatim - consistent with the same decision made in Module 8 for its repeat of Module 4's activity-scheduling technique. This is now the second confirmed recurrence of the open content-ops question raised in Modules 5 and 8: should techniques that recur across modules share one canonical write-up, or be independently authored each time? Recommend this get an actual decision soon, since it will keep recurring as more modules are built from overlapping technique families (DESC scripting and Wolpe-style rehearsal, in particular, are generically applicable assertiveness tools likely to reappear again)."
  },
  {
    "area": "Content decision, bank exclusion reusing an exact precedent",
    "text": "C3 (examination of freedom and responsibility, Yalom) is the exact same technique and source Module 5 excluded from its own bank, for the same reason: a one-time, deep existential exploration rather than something meant to be repeated on a schedule. That exact precedent is reapplied here, not re-derived - if C3 is excluded, the reasoning is identical to Module 5's A4 exclusion."
  },
  {
    "area": "Content decision, bank composition",
    "text": "Reflections: A1, A3, A4, B1, B3, C1, C2 (7 techniques, 2 reps each = 14 reps) - written worksheets, prepared scripts, and periodic exploration exercises. Tools: B2, B4 (2 techniques) - the DEAR MAN skill (built for in-the-moment use) and behavioural rehearsal (occasional-use, same classification logic as Module 9's A4). Excluded: A2 ([B], standard rule) and C3 (one-time deep exploration, per the Module 5 precedent above). This module's bank is even more Reflections-heavy than Module 5's (7:2 versus 4:3) - not forced toward balance, since the honest technique-shape test applied here produces mostly worksheets and prepared scripts rather than quick habits. Flagging this pattern again, as in Module 5: family/relationship-boundary modules seem to skew Reflections-heavy, while coping-skill modules (Anxiety, Mood) skew Tools-heavy - worth watching whether this holds as more modules are built, or whether it's specific to these particular mechanisms."
  },
  {
    "area": "Resolved",
    "text": "Crisis helpline numbers reused from Modules 1-9 (KIRAN, TeleMANAS, Vandrevala Foundation) - national, not module-specific."
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
