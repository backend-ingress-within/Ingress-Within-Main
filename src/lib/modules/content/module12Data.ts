import { ModuleContent } from '../../../types/moduleContent';

function opt(label: string, isTarget: boolean, explain: string) {
  return { label, isTarget, explain };
}

export const MODULE_12_CONTENT: ModuleContent = {
  moduleId: 'M12',
  slug: 'caregiving-role-burden',
  name: "Caregiving & Role Burden",
  duration_weeks: 5,
  tier: "Common - 499 rupees - Family domain",
  brief: {
  "moduleName": "Caregiving & Role Burden",
  "moduleNumber": 12,
  "tier": "Common - 499 rupees - Family domain",
  "scenarioSource": "Pan-India, English-medium context (per product decision) - urban dual-income households managing eldercare alongside childcare, school-admission pressure, and generational disagreement on discipline common across joint and nuclear family structures. Language is English-medium throughout; content has not yet been reviewed for phrasing that reads as metro-specific.",
  "mechanisms": [
    {
      "key": "A",
      "name": "Caregiving Responsibilities",
      "short": "Caregiving",
      "def": "The burden of caring for ageing or ill family members, often alongside work and one's own household - sole or primary responsibility that builds quietly until it produces real exhaustion, guilt about ever having limits, and a growing sense that needing a break means failing the people who depend on you.",
      "need": "Support, and permission to have real limits",
      "contrast": {
        "who": "Kavita",
        "text": "cares for her father too, the same demanding reality as anyone in her position - but she's learned to actually name what she can and can't do, and to ask for help directly, rather than treating every limit as a personal failure."
      },
      "techniques": [
        {
          "code": "A1",
          "approach": "ACT",
          "format": "A",
          "name": "Values-Based Caregiving-Boundary Setting & Committed-Action Planning",
          "source": "Steven Hayes, Acceptance and Commitment Therapy",
          "what": "Naming what actually matters to you as a caregiver - not what you think you're supposed to do, but what you actually value about the relationship and the care itself - and using that to set a real, specific boundary, then committing to one concrete action that honors both the boundary and the value behind it.",
          "how": "Guilt tends to frame every boundary as a betrayal of the relationship. Working from values instead - what kind of daughter, son, or caregiver you actually want to be - usually reveals that a sustainable boundary serves the relationship better than burnout does.",
          "why": "Addresses the boundary itself, directly, rather than just the guilt that shows up around it."
        },
        {
          "code": "A2",
          "approach": "CBT",
          "format": "A",
          "name": "Cognitive Restructuring of Caregiver Guilt",
          "source": "Aaron Beck",
          "what": "Writing down the specific guilt-driven thought - \"I should be doing more,\" \"a good daughter wouldn't need a break\" - and testing it against real, specific evidence, the way any other automatic thought would be tested.",
          "how": "Caregiver guilt often runs on an unexamined standard - \"more is always better care\" - that doesn't hold up against evidence about what actually sustains good care over time, which usually includes the caregiver not burning out.",
          "why": "Targets the guilt thought directly, underneath the boundary-setting in A1."
        },
        {
          "code": "A3",
          "approach": "CFT",
          "format": "A",
          "name": "Compassionate-Mind Training for Caregiver Burnout",
          "source": "Paul Gilbert, Compassion-Focused Therapy",
          "what": "A brief, structured self-compassion practice - noticing the harsh, self-critical inner voice that shows up around caregiving, and deliberately offering yourself the same warmth and understanding you'd offer a friend in the same position.",
          "how": "Caregivers often direct real compassion outward, toward the person they're caring for, while withholding it from themselves entirely. Compassionate-mind training treats that self-directed harshness as something to actually work with, not something to just push through.",
          "why": "Works on the emotional tone underneath the guilt, rather than the content of the thought itself - a different lever than A2."
        },
        {
          "code": "A4",
          "approach": "Caregiver Burden Assessment",
          "format": "A",
          "name": "A Caregiver-Burden Self-Monitoring Log",
          "source": "Informed by Steven Zarit's Caregiver Burden Interview",
          "what": "A short, regular check-in tracking early signs of caregiver burnout - sleep, resentment, physical exhaustion, feeling trapped - logged honestly enough to catch a rising pattern before it becomes a crisis.",
          "how": "Burnout rarely arrives suddenly; it builds through signs that are easy to dismiss individually but form a clear pattern in aggregate. Regular tracking makes that pattern visible early enough to actually act on.",
          "why": "The only tool here that's about noticing the pattern over time, rather than working with a single moment of guilt or exhaustion directly."
        }
      ]
    },
    {
      "key": "B",
      "name": "Parenting Stress",
      "short": "Parenting Stress",
      "def": "Stress from raising children day to day - balancing tradition and modern parenting, managing school pressure and screen time, navigating disagreement with grandparents on discipline - that can build into a constant, low-grade anxiety about whether you're doing any of it right.",
      "need": "Competence, and support",
      "contrast": {
        "who": "Sameer",
        "text": "deals with the same daily pressures raising his kids - school stress, screen-time battles, his own parents' opinions on discipline - but he's learned to hold a steady, consistent approach even when he's genuinely unsure, rather than second-guessing every decision in the moment."
      },
      "techniques": [
        {
          "code": "B1",
          "approach": "Parent Coaching",
          "format": "A",
          "name": "Behavioural Parent-Training Strategies",
          "source": "Gerald Patterson's parent-management training; also reflected in Matt Sanders's Triple P",
          "what": "Concrete, evidence-based parenting strategies - consistent routines, positive reinforcement for wanted behavior, planned ignoring for attention-seeking misbehavior - used deliberately rather than reactively in the moment.",
          "how": "Inconsistent responses to the same behavior (sometimes ignored, sometimes punished, depending on the parent's own stress level) make it harder for a child to learn what's actually expected. Consistency, not strictness, is what these strategies are built around.",
          "why": "The concrete, in-the-moment behavioral toolkit - what to actually do differently, not just how to think about it differently."
        },
        {
          "code": "B2",
          "approach": "CBT",
          "format": "A",
          "name": "Cognitive Restructuring of Parenting-Adequacy Anxious Thoughts",
          "source": "Aaron Beck",
          "what": "Writing down the specific anxious thought about being an inadequate parent - \"I'm ruining my kid,\" \"every other parent has this figured out\" - and testing it against real, specific evidence.",
          "how": "A single hard parenting moment can produce a sweeping conclusion about failing as a parent overall. Testing the specific claim against real evidence - what's actually going well, what a single moment does and doesn't prove - usually reveals the sweeping version doesn't hold up.",
          "why": "Targets the anxious self-judgment directly, which affects how steady a parent can stay while actually using B1's strategies."
        },
        {
          "code": "B3",
          "approach": "ACT",
          "format": "A",
          "name": "Values-Based Parenting Decisions Balancing Tradition and Modern Approaches",
          "source": "Steven Hayes, Acceptance and Commitment Therapy",
          "what": "Working through a specific parenting disagreement - with a co-parent, or across generations with grandparents - by naming what you actually value for your child underneath the specific rule being argued about, and letting that guide the decision rather than simply defaulting to tradition or reacting against it.",
          "how": "Many parenting disagreements get stuck arguing about the specific rule (screen time, discipline method) without ever naming the shared value underneath (safety, respect, connection), which is usually where actual agreement is possible.",
          "why": "Addresses the recurring tradition-versus-modern tension directly, which the other two tools don't specifically target."
        }
      ]
    }
  ],
  "escalation": {
    "tier1": "Any statement connecting caregiving or parenting strain to intent or a plan to end one's life or self-harm (\"I can't do this anymore, I want it to just stop\", \"I have a way to end it\"), or to intent to harm a dependent (an ageing parent or a child) in one's care.",
    "tier2": "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary exhaustion or distress of real, ongoing caregiving or parenting, which is what this module is specifically designed to help with. Also watch for language suggesting an ageing parent or child in one's care may actually be at risk - neglect, harsh physical discipline beyond ordinary frustration, or a caregiver describing themselves as at real risk of losing control around a dependent - this module is built for the everyday burden of caregiving and parenting stress, not for situations involving actual risk to a dependent, which need a different kind of support entirely."
  }
},
  introScreens: [
  {
    "eyebrow": "Before we begin",
    "title": "What's stored, and who can see it",
    "body": [
      "Your open-text answers in this module are saved to your journal.",
      "The only person who can ever see them is your assigned practitioner, if you've connected one - never other users, never shown anywhere public.",
      "If something you write suggests you might be in real danger, or that someone in your care might be, we show you support resources right away. That's the only thing that happens automatically - nothing gets sent anywhere without you knowing.",
      "Your answers stay saved and reviewable by you for 12 months from purchase, extended automatically if you renew.",
      "You can turn this module off in Settings at any time."
    ],
    "cta": "I understand - continue",
    "consent": true
  },
  {
    "eyebrow": "What this module is for - and isn't",
    "title": "Built for everyday burden, not for a dependent in danger",
    "body": [
      "This module is about the everyday weight of caregiving and parenting - real, often exhausting, but not a situation where anyone in your care is actually unsafe. If caring for an ageing parent or a child involves a real safety concern for them, this module isn't the right resource for that, and we'd encourage you to reach out to a professional or a dedicated safety resource instead.",
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
      "You told us you're dealing with the weight of caring for an ageing or ill family member, the daily stress of raising kids, or both at once. Maybe you're managing both, the way many people quietly do.",
      "This module is built for exactly that - two specific patterns, each with its own real, evidence-based tools, not one blended 'family stress' module."
    ],
    "cta": "Continue"
  },
  {
    "eyebrow": "What to expect",
    "title": "The next 5 weeks",
    "body": [
      "Short term: a new touch on weekdays, a few minutes each, real scenarios close to your own week - your own words, not a quiz to pass or fail. Weekends bring a short summary, not new content.",
      "Long term, honestly: this won't reduce how much caregiving or parenting actually needs from you, and it won't change the underlying demands on your time. What it can realistically offer is 7 specific, evidence-based tools, plus enough practice noticing each pattern that guilt and anxious over-functioning have less room to run unchecked. That's the actual promise here, not more than that."
    ],
    "cta": "Continue"
  },
  {
    "eyebrow": "Theory grounding",
    "title": "The tools everything here is built on",
    "body": [
      "Each of these two patterns has more than one real, evidence-based approach behind it - so instead of blending them into one vague idea, each approach gets its own tool and its own touch.",
      "You won't use any of these in Weeks 1-2 - those two weeks are just about being able to spot each pattern clearly, before any tool gets layered on top. Weeks 3-4 bring these back, one at a time, matched to exactly what you'll have just learned to recognise."
    ],
    "theory": true,
    "cta": "Start Week 1"
  }
],
  weeks: [
  {
    "num": 1,
    "title": "Caregiving burden: recognising the pattern",
    "mechanism": "A",
    "kind": "blocked",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w1t1",
        "title": "Recognition - one more thing added",
        "role": "Recognition #1",
        "noDelayed": true,
        "relate": {
          "text": [
            "Quick note before we start: this week and the next aren't about any of the tools yet - none show up. First, you need to be able to spot each pattern clearly. The tools come in Weeks 3-4, matched one at a time to what you'll have learned to recognise.",
            "This week's pattern has a name: <b>caregiving burden</b>. In simple terms: the weight of caring for an ageing or ill family member, often alongside work and one's own household, building quietly until it produces real exhaustion and a growing sense that needing a break means failing the people who depend on you.",
            "Here's what that looks like. <b class='who'>Meera</b> already manages her mother's medication schedule, doctor visits, and most meals, on top of a full-time job and her own two kids. Her brother calls to ask how their mother is doing, then mentions he's swamped at work this month. Meera says it's fine, she's got it - and adds another thing to a list that was already full."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "Which of these actually explains what's happening? More than one will sound reasonable.",
          "options": [
            {
              "label": "Meera is absorbing responsibility that could genuinely be shared, without actually naming that out loud to her brother",
              "isTarget": true,
              "explain": "Right - she said 'it's fine' instead of naming the actual imbalance, which keeps the responsibility invisible to the one person who could share it."
            },
            {
              "label": "Her brother doesn't care about their mother",
              "isTarget": false,
              "explain": "There's no evidence for that in the scenario - he called to check in, which suggests some care. What's shown is an unequal split that isn't being named, not an absence of caring."
            },
            {
              "label": "Meera genuinely has more time than her brother does",
              "isTarget": false,
              "explain": "The scenario doesn't establish that - it shows her saying 'it's fine' reflexively, not an actual comparison of who has more capacity right now."
            }
          ],
          "whyPrompt": "In a few words - what's the giveaway that this is an unnamed imbalance, not just how things naturally worked out?"
        },
        "apply": {
          "scenario": "Same pattern, a different person: Anjali has been the one taking her father to every doctor's appointment for months. Her sister offers, almost in passing, to take the next one - and Anjali says she's already used to the routine, it's easier if she just keeps doing it.",
          "prompt": "Same thing happening here. In two or three sentences: what would you actually say to Anjali right now?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"Being used to the routine doesn't mean it isn't a real weight, or that you're the only one who could learn it. Letting your sister take even one appointment isn't giving up the role - it's actually sharing it.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of a real moment this applies to you - something you took on without ever actually naming that you could use help with it.",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t2",
        "title": "Recognition - the standard that never lowers",
        "role": "Recognition #2",
        "delayedRef": "w1t1_apply",
        "delayedPrompt": "Last touch, on Anjali, you wrote this:",
        "relate": {
          "text": [
            "A different moment with Meera. Her mother has a good week - eating well, in better spirits - and instead of feeling any relief, Meera immediately starts planning for the next bad week, adding two more things to her already-full list \"just in case.\"",
            "Notice what's happening: even a genuinely good week doesn't lower the internal bar for how much she should be doing."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does never lowering the bar, even during a good week, actually suggest?",
          "options": [
            {
              "label": "The standard she's holding herself to isn't actually responsive to how things are going - it only ever moves in one direction",
              "isTarget": true,
              "explain": "That's the pattern - a standard that can't go down, regardless of real evidence that things are currently okay, tends to produce constant strain rather than proportionate effort."
            },
            {
              "label": "She's just being appropriately careful about her mother's health",
              "isTarget": false,
              "explain": "Being prepared is reasonable, but the scenario specifically shows the bar rising even during a genuinely good week - that's different from ordinary, proportionate caution."
            },
            {
              "label": "Her mother's condition is probably worse than it appears",
              "isTarget": false,
              "explain": "Nothing in the scenario indicates that - the good week is described as real, which is what makes Meera's response to it worth noticing."
            }
          ],
          "whyPrompt": "In a few words - why might a standard that only ever rises eventually become unsustainable?"
        },
        "apply": {
          "scenario": "A friend, hearing about Meera's good-week response, asks her directly: \"When's the last time you let a good week actually feel like relief, instead of just prep time for the next hard one?\" Meera doesn't have an easy answer.",
          "prompt": "In two or three sentences: what would answering that question honestly actually sound like, for someone in Meera's position?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the answer is honest about how rarely relief gets allowed to just be relief, not a version that still frames rest as something that has to be earned first."
        },
        "remember": {
          "prompt": "In a sentence or two: when's the last time a genuinely good stretch actually felt like relief to you, rather than just prep time for whatever's next?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t3",
        "title": "What the guilt is actually protecting, and what it costs",
        "role": "Functional logic",
        "delayedRef": "w1t2_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Between the call with her brother and the good week she couldn't relax into, there's a pattern worth naming honestly: the constant \"I should be doing more\" can feel like it's protecting Meera - proof, to herself, that she's a good daughter, regardless of what anyone else contributes.",
            "What it actually costs is different: it's already produced real exhaustion, and it's quietly training the people around her - her brother included - that she'll always absorb whatever isn't picked up, which makes it less likely anyone else steps in without being asked directly."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What is the constant \"I should be doing more\" actually doing? These are close - think it through.",
          "options": [
            {
              "label": "Providing a sense of being a good daughter in the moment, while making burnout more likely and making it less likely others step in unasked",
              "isTarget": true,
              "explain": "That's the real trade - it offers something real (a feeling of doing right by her mother) but at an ongoing cost that compounds over time, both to Meera and to how the caregiving load gets shared."
            },
            {
              "label": "Genuinely reflecting how much care her mother actually needs, moment to moment",
              "isTarget": false,
              "explain": "The scenario shows the standard rising even during a good week, which suggests it isn't tracking her mother's actual, changing needs so much as an internal rule that only moves one direction."
            },
            {
              "label": "A temporary phase that will resolve on its own once things calm down",
              "isTarget": false,
              "explain": "Nothing in the pattern shown suggests it's self-correcting - if anything, the good week making it worse, not better, suggests the opposite."
            }
          ],
          "whyPrompt": "In a few words - why might always absorbing the gap actually reduce, not increase, how much help she gets long-term?"
        },
        "apply": {
          "scenario": "A cousin, watching Meera decline help again, asks: \"Has doing more than anyone's asking ever actually made you feel like you've done enough?\" Meera pauses. \"...No, honestly. There's always something else I could be doing.\"",
          "prompt": "That's usually the tell. In two or three sentences: think of a time doing more than needed didn't actually resolve the underlying feeling of not doing enough - what happened instead?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the pattern to notice is whether doing more actually settled the feeling of inadequacy, or just shifted it to the next thing on the list."
        },
        "remember": {
          "prompt": "In a sentence or two: what does the feeling of \"I should be doing more\" usually feel like for you, right as it shows up?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w1t4",
        "title": "What naming a real limit can look like",
        "role": "Contrast / boundary case",
        "delayedRef": "w1t3_apply",
        "delayedPrompt": "Last touch, you named this:",
        "relate": {
          "text": [
            "Here's what a similar moment can look like for someone who responds to caregiving demands differently.",
            "<b class='who'>Kavita</b> cares for her father too, the same demanding reality as Meera faces with her mother. But when her brother asks how their father is doing, she tells him directly: \"He's stable, but I need you to take the Thursday appointments starting next month - I can't keep doing all of them and also work full time.\"",
            "This is the module's contrast case for this pattern: real caregiving, still genuinely demanding - not the absence of a burden, but a different response to it."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What actually makes Kavita's response different from Meera's? Both are doing real, hard caregiving.",
          "options": [
            {
              "label": "She names the specific limit and the specific ask directly, rather than absorbing the gap silently and hoping it gets noticed",
              "isTarget": true,
              "explain": "That's the real difference - not that her situation is easier, but that she states the limit and the request out loud, rather than leaving her brother to guess or never learn there's a gap at all."
            },
            {
              "label": "Her father needs less care than Meera's mother does",
              "isTarget": false,
              "explain": "There's no basis for that comparison in the scenario - the difference described is in how Kavita responds to the demand, not in how demanding the caregiving itself is."
            },
            {
              "label": "She simply cares less about doing a good job",
              "isTarget": false,
              "explain": "The scenario doesn't suggest that - asking for a specific, concrete form of help is consistent with wanting the caregiving to actually go well, not with caring less about it."
            }
          ],
          "whyPrompt": "In a few words - how does naming a specific ask, rather than a general feeling of being overwhelmed, change what happens next?"
        },
        "apply": {
          "scenario": "A neighbor asks Kavita how she gets her brother to actually help. She says: \"I stopped hinting and started asking for something specific - a day, a task, a real thing he can say yes or no to. Vague overwhelm is easy to nod at and forget. A specific ask is harder to ignore.\"",
          "prompt": "In two or three sentences: think of a caregiving task you've been carrying alone - what would a specific, named ask for help actually sound like?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the useful pattern is noticing whether the ask names a specific task and person, or stays general enough to be easy to miss."
        },
        "remember": {
          "prompt": "In a sentence or two: name one specific task you could imagine actually handing off, and to whom.",
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
            "One more, and then a small piece of what actually happened with Meera.",
            "A few weeks later, worn down enough to finally say something, she told her brother directly that she needed him to take over the Thursday appointments - not a hint, an actual ask. He said yes immediately, mentioning he'd assumed she preferred handling it herself since she never said otherwise.",
            "That's not a coincidence, and it previews the tools coming in Week 3: the load often doesn't shift on its own - it usually requires actually naming the specific ask out loud. The tools ahead don't reduce how much caregiving is genuinely needed - they give you a way to actually share it, and to catch the guilt that makes sharing it feel wrong."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does her brother's response tell us about the weeks before she asked?",
          "options": [
            {
              "label": "The silence had been read as a preference, not a limit, which meant the imbalance continued simply because it was never actually named",
              "isTarget": true,
              "explain": "Right - his assumption fills in exactly the gap that staying silent left open. That's evidence the imbalance was fixable, not evidence that he wouldn't have helped."
            },
            {
              "label": "Her brother just happened to have more free time once she finally asked",
              "isTarget": false,
              "explain": "This attributes the shift to timing, when a more direct explanation is available: naming the specific need explicitly, rather than assuming it would be noticed, is what actually changed."
            },
            {
              "label": "It doesn't really prove anything, since she was still overwhelmed for weeks before asking",
              "isTarget": false,
              "explain": "The weeks of overwhelm don't cancel out what his response demonstrates - that naming the specific ask directly is a real, workable path to sharing the load, even after a long stretch of not doing so."
            }
          ],
          "whyPrompt": "In a few words - why does naming a specific need directly work better than hoping it gets noticed?"
        },
        "apply": {
          "scenario": "A different person, same shape of realisation: after months of managing her mother-in-law's medications alone, Sunita finally tells her husband directly that she needs him to handle the pharmacy pickups - and finds he'd genuinely had no idea it had become a weekly burden, since she'd never mentioned it.",
          "prompt": "In two or three sentences: what does her husband's reaction tell Sunita about the months before she asked?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"His not knowing wasn't him ignoring her - the burden genuinely hadn't been named yet, which is exactly what changed once she did.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of a caregiving load you've never actually named out loud to anyone who could help - what might happen if you did?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: caregiving burden, and how silently absorbing every gap can feel like proof of being a good caregiver, even though naming a specific limit or ask directly is usually what actually shifts the load. Next week: parenting stress, a related but distinct pattern."
  },
  {
    "num": 2,
    "title": "Parenting stress: recognising the pattern",
    "mechanism": "B",
    "kind": "blocked",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w2t1",
        "title": "Recognition - the decision that won't settle",
        "role": "Recognition #1",
        "delayedRef": "w1t5_apply",
        "delayedPrompt": "Last week, your idea was:",
        "relate": {
          "text": [
            "This week's pattern: <b>parenting stress</b>. In simple terms: the daily stress of raising kids - balancing tradition and modern parenting, school pressure, screen time, disagreement with grandparents on discipline - that can build into a constant, low-grade anxiety about whether any of it is being done right.",
            "Here's what that looks like. <b class='who'>Rohan</b> spends an entire evening researching school admission strategies, comparing them against what other parents in his building are doing, then lies awake reworking the decision he'd already made that morning, even though nothing new has actually changed."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "Which of these actually explains what's happening? More than one will sound reasonable.",
          "options": [
            {
              "label": "Reworking an already-made decision with no new information is a sign the anxiety is about certainty itself, not about the decision's actual quality",
              "isTarget": true,
              "explain": "Right - nothing changed between the morning and the night, which means the reworking isn't responding to new evidence, it's chasing a feeling of certainty that repeated review doesn't actually produce."
            },
            {
              "label": "The school decision genuinely needs more research before it's finalized",
              "isTarget": false,
              "explain": "The scenario specifically notes nothing new has changed - the reworking isn't driven by new information, which is what distinguishes this from genuinely incomplete research."
            },
            {
              "label": "Rohan doesn't trust his own judgment as a parent",
              "isTarget": false,
              "explain": "This assumes a broader conclusion about his self-trust that the single scenario doesn't establish - what's shown is one specific pattern (re-litigating a settled decision), not a general verdict on his judgment."
            }
          ],
          "whyPrompt": "In a few words - what's the giveaway that this is about chasing certainty, not about the decision itself?"
        },
        "apply": {
          "scenario": "Same pattern, a different person: Priya decides on a screen-time limit for her daughter after real thought, then spends the next two days second-guessing it every time her daughter seems upset, wondering if she got the number wrong.",
          "prompt": "Same thing happening here. In two or three sentences: what would you actually say to Priya right now?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"Your daughter being upset about a limit doesn't mean the limit is wrong - kids often push back on reasonable limits too. The question isn't whether she's upset, it's whether the limit itself was actually thought through, which it sounds like it was.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of a real parenting decision you've made that you kept reworking afterward, even without new information.",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t2",
        "title": "Recognition - measuring against everyone else",
        "role": "Recognition #2",
        "delayedRef": "w2t1_apply",
        "delayedPrompt": "Last touch, on Priya, you wrote this:",
        "relate": {
          "text": [
            "A different moment with Rohan. At a family gathering, another parent mentions their child started reading independently earlier than Rohan's son did. Rohan says nothing at the time, but spends the drive home quietly reworking his entire approach to reading at home, based on one comment from one other family.",
            "Notice what's happening: a single data point from one other child becomes evidence that something needs to change."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does reacting this strongly to one comment actually suggest?",
          "options": [
            {
              "label": "A single comparison is being treated as meaningful evidence, when normal variation between children makes any one comparison poor evidence on its own",
              "isTarget": true,
              "explain": "That's the pattern - kids genuinely develop at different rates, which means a single comparison point is weak evidence, even though it can feel urgent and specific in the moment it's heard."
            },
            {
              "label": "Rohan's son is probably behind and this is a fair concern",
              "isTarget": false,
              "explain": "One comment about one other child isn't sufficient evidence to draw that conclusion - the scenario is showing the outsized reaction to a single, unverified data point, not an established developmental concern."
            },
            {
              "label": "Comparing children's development is always meaningless and should be ignored entirely",
              "isTarget": false,
              "explain": "This overcorrects - the point isn't that comparison never matters, it's that reacting to a single, casual comment as if it settles something is disproportionate to what one comment can actually tell you."
            }
          ],
          "whyPrompt": "In a few words - why is a single comparison usually weak evidence about how your own child is doing?"
        },
        "apply": {
          "scenario": "A friend, hearing about Rohan's drive home, asks him directly: \"Do you actually know how most kids compare on this, or just what one parent said at one gathering?\" Rohan realizes he doesn't actually know.",
          "prompt": "In two or three sentences: what would answering that question honestly actually sound like, for someone in Rohan's position?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the answer is honest about how little one comment actually establishes, not a version that still treats the comment as more meaningful than it is."
        },
        "remember": {
          "prompt": "In a sentence or two: think of a time a single comment about your child sent you into a spiral - what did it actually turn out to mean, if anything?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t3",
        "title": "What the constant checking is actually costing",
        "role": "Functional logic",
        "delayedRef": "w2t2_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Between the reworked school decision and the comparison at the family gathering, there's a pattern worth naming honestly: constantly checking his choices against everyone else can feel like it's protecting Rohan - proof that he's not missing something important as a parent.",
            "What it actually costs is different: it doesn't make his decisions any better, since he's not acting on new information, just re-litigating old decisions - and it leaves him anxious and second-guessing in front of his kids, rather than steady, even when his original decisions were genuinely reasonable."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What is the constant comparing and rechecking actually doing? These are close - think it through.",
          "options": [
            {
              "label": "Producing a temporary sense of vigilance, without improving decision quality, while costing him steadiness that his kids likely notice",
              "isTarget": true,
              "explain": "That's the real trade - it feels like responsible parenting in the moment, but the decisions themselves aren't getting better, just more anxious, and that anxiety has its own real cost."
            },
            {
              "label": "Genuinely catching real parenting mistakes before they become serious problems",
              "isTarget": false,
              "explain": "The scenarios shown involve rechecking decisions with no new information, not catching an actual, evidence-based mistake - the pattern is about anxiety-driven repetition, not error-correction."
            },
            {
              "label": "A sign that Rohan cares more about his kids than parents who don't second-guess themselves",
              "isTarget": false,
              "explain": "This frames anxious rechecking as evidence of superior care, but the scenario doesn't support that comparison, and it isn't what the pattern is actually demonstrating."
            }
          ],
          "whyPrompt": "In a few words - why might constant rechecking cost more than it protects against?"
        },
        "apply": {
          "scenario": "His wife, watching him rework the school decision again, asks: \"Has rechecking this ever actually changed what you decided, or just how calm you felt about it?\" Rohan thinks about it. \"...Just how calm I felt. The decision's been the same the whole time.\"",
          "prompt": "That's usually the tell. In two or three sentences: think of a time rechecking a decision didn't actually change the outcome - what happened instead?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the pattern to notice is whether rechecking actually changed the decision, or just temporarily changed how anxious it felt."
        },
        "remember": {
          "prompt": "In a sentence or two: what does the urge to recheck a parenting decision usually feel like for you, right as it shows up?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w2t4",
        "title": "What steady, imperfect parenting can look like",
        "role": "Contrast / boundary case",
        "delayedRef": "w2t3_apply",
        "delayedPrompt": "Last touch, you named this:",
        "relate": {
          "text": [
            "Here's what a similar moment can look like for someone who responds to parenting uncertainty differently.",
            "<b class='who'>Sameer</b> deals with the same daily pressures raising his kids - school stress, screen-time battles, his own parents' opinions on discipline. When another parent mentions their child reached a milestone earlier, Sameer notices the comparison, shrugs, and says, \"kids get there at their own pace, mine will too\" - and actually means it, moving on with his evening.",
            "This is the module's contrast case for this pattern: real uncertainty, still genuinely present - not the absence of doubt, but a different response to it."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What actually makes Sameer's response different from Rohan's? Both hear the same kind of comment.",
          "options": [
            {
              "label": "He treats a single comparison as low-value information and lets it go, rather than treating it as urgent evidence that something needs to change",
              "isTarget": true,
              "explain": "That's the real difference - not that he doesn't notice the comparison, but that he assigns it the right amount of weight and doesn't let one data point override a decision he's already comfortable with."
            },
            {
              "label": "His children are developing exactly on the expected timeline",
              "isTarget": false,
              "explain": "The scenario doesn't establish that - what's shown is Sameer's response to hearing about a comparison, not confirmation that no gap exists at all."
            },
            {
              "label": "He simply cares less about how his kids are doing than Rohan does",
              "isTarget": false,
              "explain": "Shrugging off a single comparison isn't evidence of caring less - it's consistent with holding a steady, values-based view of parenting that doesn't get destabilized by one comment."
            }
          ],
          "whyPrompt": "In a few words - how does treating one comparison as low-value information change what happens next, compared to treating it as urgent?"
        },
        "apply": {
          "scenario": "A colleague asks Sameer how he stays calm about this stuff. He says: \"I remind myself that one comment from one parent about one kid isn't actually data about mine. If I see an actual pattern over time, that's different - but a single comment isn't a pattern.\"",
          "prompt": "In two or three sentences: think of a recent comparison that got under your skin - what would treating it the way Sameer does have actually sounded like?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the useful pattern is noticing whether the comparison is actually part of a real, observed pattern, or a single data point being treated as more meaningful than it is."
        },
        "remember": {
          "prompt": "In a sentence or two: name one comparison you could imagine actually letting go of, the way Sameer does.",
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
            "One more, and then a small piece of what actually happened with Rohan.",
            "A month later, his son did start reading more independently - on his own timeline, with no change to what Rohan had been doing all along. The reworking, the rechecking, the anxious comparisons: none of it had actually sped anything up or changed the outcome.",
            "That's not a coincidence, and it previews the tools coming in Week 3: steadiness usually comes from consistent, values-based decisions held with some confidence - not from constant rechecking, which tends to add anxiety without adding accuracy. The tools ahead don't promise every parenting decision will feel certain - they give you a way to hold steady even when it doesn't."
          ]
        },
        "think": {
          "mode": "tap",
          "prompt": "What does the outcome a month later tell us about all the reworking before it?",
          "options": [
            {
              "label": "The reading milestone arrived on its own timeline regardless of the extra anxiety, suggesting the rechecking added stress without adding anything to the actual outcome",
              "isTarget": true,
              "explain": "Right - the timeline played out the same way it likely would have anyway. That's evidence the anxious rechecking wasn't actually driving the outcome, just adding cost along the way."
            },
            {
              "label": "The extra attention Rohan gave the issue is probably what caused the improvement",
              "isTarget": false,
              "explain": "The scenario doesn't establish a change in what Rohan actually did differently - just constant reworking of a decision that didn't change, which makes this causal claim unsupported."
            },
            {
              "label": "It doesn't really prove anything, since kids develop at their own pace regardless",
              "isTarget": false,
              "explain": "That kids develop at their own pace is exactly the point being illustrated - it's evidence that the anxious rechecking wasn't necessary to reach an outcome that likely would have happened anyway."
            }
          ],
          "whyPrompt": "In a few words - why might a steady, less anxious approach have gotten to the same place with less cost along the way?"
        },
        "apply": {
          "scenario": "A different person, same shape of realisation: after weeks of anxiously comparing her toddler's vocabulary to other kids' at the park, Deepa's daughter has a sudden burst of new words, right on the pediatrician's expected timeline all along.",
          "prompt": "In two or three sentences: what does that outcome tell Deepa about the weeks of comparison beforehand?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"The comparison-driven anxiety wasn't tracking anything real - her daughter was always going to get there on her own timeline, and the weeks of worry didn't change that, they just made the weeks harder.\""
        },
        "remember": {
          "prompt": "In a sentence or two: think of a parenting worry you've been carrying that a steadier, less comparison-driven view might actually settle - what would that look like?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: parenting stress, and how constantly rechecking decisions against other people's kids can feel protective, even though it rarely changes the outcome and usually just adds anxiety. Next week: the tools for caregiving burden."
  },
  {
    "num": 3,
    "title": "Caregiving burden: four tools, and a plan",
    "mechanism": "A",
    "kind": "technique",
    "retrievalCheck": {
      "prompt1": "In your own words - what is caregiving burden, and what does silently absorbing every gap actually cost, versus what it can feel like it's protecting?",
      "prompt2": "And what is parenting stress - why does constantly rechecking a decision against other people's kids usually fail to actually improve the decision?",
      "reveal": "Caregiving burden is the weight of caring for an ageing or ill family member, often alongside work and one's own household, that can build quietly into real exhaustion - the guilt-driven habit of silently absorbing every gap feels like proof of being a good caregiver, but it doesn't reduce the underlying load, and it often keeps others from realizing help is needed at all. Parenting stress is the daily anxiety of raising kids, including constant comparison to other children - rechecking a decision with no new information doesn't improve the decision, it just adds anxiety, since the outcome tends to unfold on its own timeline regardless."
    },
    "touches": [
      {
        "id": "w3t1",
        "title": "Values-Based Caregiving-Boundary Setting",
        "role": "Technique A1 - ACT (Hayes)",
        "delayedRef": "w2t5_apply",
        "delayedPrompt": "Last week, your answer was:",
        "relate": {
          "text": [
            "This is the first of the four tools for caregiving burden from your theory grounding screen: <b>values-based caregiving-boundary setting and committed-action planning</b>.",
            "Remember Meera absorbing another task from her brother without naming it? This tool makes the boundary deliberate: name what you actually value about the caregiving relationship, use that to set a real, specific limit, then commit to one concrete action that honors both."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might naming what you actually value about the relationship make a boundary feel less like a betrayal of it?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a caregiving task you've been carrying alone, maybe one you started thinking about back in Week 1.",
          "prompt": "In two or three sentences: name the value underneath the caregiving, then a specific boundary and one concrete action that honors both.",
          "placeholder": "The value: ... / The boundary and action: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the boundary is specific and actionable, not a vague intention to 'do less' without a concrete plan."
        },
        "remember": {
          "prompt": "In a sentence or two: did naming the value first change how the boundary felt to write?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w3t2",
        "title": "Cognitive Restructuring of Caregiver Guilt",
        "role": "Technique A2 - CBT (Beck)",
        "delayedRef": "w3t1_apply",
        "delayedPrompt": "Last touch, your boundary was:",
        "relate": {
          "text": [
            "The second tool: <b>cognitive restructuring of caregiver guilt</b> - writing down the specific guilt-driven thought and testing it against real, specific evidence, the way any other automatic thought would be tested."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why does a thought like \"a good daughter or son wouldn't need a break\" need to be tested against evidence, rather than just accepted as true?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a guilt-driven thought you've had recently about your own caregiving.",
          "prompt": "In two or three sentences: write the exact thought, then test it - is there real, specific evidence against it?",
          "placeholder": "The thought: ... / The evidence: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the evidence is specific (an actual moment, an actual fact about sustainable care), not a vague reassurance."
        },
        "remember": {
          "prompt": "In a sentence or two: did testing the thought change how solid it felt?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w3t3",
        "title": "Compassionate-Mind Training for Caregiver Burnout",
        "role": "Technique A3 - CFT (Gilbert)",
        "delayedRef": "w3t2_apply",
        "delayedPrompt": "Last touch, your evidence was:",
        "relate": {
          "text": [
            "The third tool: <b>compassionate-mind training</b> - noticing the harsh, self-critical inner voice around caregiving, and deliberately offering yourself the same warmth you'd offer a friend in the same position."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might caregivers find it easier to extend compassion to the person they're caring for than to themselves?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a recent moment where your own inner voice was harsh about your caregiving.",
          "prompt": "In two or three sentences: write what that harsh voice said, then what you'd actually say to a friend in the exact same position.",
          "placeholder": "The harsh voice said: ... / To a friend, I'd say: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is a genuine gap between the harshness turned inward and the warmth that would go to someone else in the same spot."
        },
        "remember": {
          "prompt": "In a sentence or two: did writing what you'd say to a friend feel different from what you'd normally say to yourself?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w3t4",
        "title": "A Caregiver-Burden Self-Monitoring Log",
        "role": "Technique A4 - Caregiver Burden Assessment (Zarit-informed)",
        "delayedRef": "w3t3_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "The fourth tool: <b>a caregiver-burden self-monitoring log</b> - a short, regular check-in tracking early signs of burnout, logged honestly enough to catch a rising pattern before it becomes a crisis."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might tracking these signs regularly catch a pattern that's easy to dismiss in any single moment?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think honestly about the last week or two of caregiving.",
          "prompt": "In two or three sentences: log what you've actually noticed - sleep, resentment, exhaustion, feeling trapped - as honestly as you can.",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is honesty about what's actually there, not a version that minimizes signs because they feel like they shouldn't count."
        },
        "remember": {
          "prompt": "In a sentence or two: did writing it down make a pattern more visible than it felt before?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w3t5",
        "title": "How did it go, and a plan for next time",
        "role": "Check-in + pre-commitment",
        "delayedRef": "w3t4_apply",
        "delayedPrompt": "Last touch, your log was:",
        "relate": {
          "text": [
            "No new idea this touch - two quick things before we move to parenting stress.",
            "First, a real check-in on the four tools from this week - the same four that trace back to Meera's unnamed load back in Week 1. Then, a plan built now, while things feel calm."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Which of the four did you actually try this week, if any - and what happened?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Pick whichever of the four tools felt most useful, or most realistic to actually use, this week.",
          "prompt": "In two or three sentences, write an if-then plan for using it: 'If [specific cue], then I will [specific tool, specifically applied].'",
          "placeholder": "If [specific cue], then I will..."
        },
        "reveal": {
          "text": "Something like: \"If I notice myself adding a task to my list without naming it out loud to anyone, then I'll pause and name a specific ask to a specific person instead.\""
        },
        "remember": {
          "prompt": "In a sentence or two: say the plan back to yourself - does it actually sound doable in a real moment, not just in hindsight?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: four named tools for caregiving burden - values-based boundary setting, cognitive restructuring of guilt, compassionate-mind training, and a burden self-monitoring log - a real check-in, and a plan built while calm. No new teaching in this summary. Next week: parenting stress."
  },
  {
    "num": 4,
    "title": "Parenting stress: three tools, and a plan",
    "mechanism": "B",
    "kind": "technique",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w4t1",
        "title": "Behavioural Parent-Training Strategies",
        "role": "Technique B1 - Parent Coaching (Patterson / Sanders)",
        "delayedRef": "w3t5_apply",
        "delayedPrompt": "Last week, your if-then plan was:",
        "relate": {
          "text": [
            "This is the first of the three tools for parenting stress from your theory grounding screen: <b>behavioural parent-training strategies</b> - consistent routines, positive reinforcement for wanted behavior, and planned ignoring for attention-seeking misbehavior, used deliberately rather than reactively."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might responding to the same behavior differently depending on your own stress level make it harder for a child to learn what's expected?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a recurring behavior at home that tends to get an inconsistent response from you, depending on your mood or energy that day.",
          "prompt": "In two or three sentences: write out a consistent plan for it - what gets reinforced, what gets planned-ignored, applied the same way regardless of your own day.",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether the plan is specific and consistent enough to actually apply the same way twice."
        },
        "remember": {
          "prompt": "In a sentence or two: does having a consistent plan written down make it easier to imagine actually holding to it?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w4t2",
        "title": "Cognitive Restructuring of Parenting-Adequacy Anxious Thoughts",
        "role": "Technique B2 - CBT (Beck)",
        "delayedRef": "w4t1_apply",
        "delayedPrompt": "Last touch, your plan was:",
        "relate": {
          "text": [
            "The second tool: <b>cognitive restructuring of parenting-adequacy anxious thoughts</b> - writing down the specific anxious thought about being an inadequate parent and testing it against real, specific evidence."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why does a thought like \"I'm ruining my kid\" need to be tested against specific evidence, rather than felt as simply true in the moment?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of an anxious thought you've had recently about your own adequacy as a parent, maybe the one from Week 2.",
          "prompt": "In two or three sentences: write the exact thought, then test it - what's actually going well that the sweeping version ignores?",
          "placeholder": "The thought: ... / The evidence: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is specific, real evidence, not a vague reassurance that everything is probably fine."
        },
        "remember": {
          "prompt": "In a sentence or two: did testing the thought change how solid it felt?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w4t3",
        "title": "Values-Based Parenting Decisions",
        "role": "Technique B3 - ACT (Hayes)",
        "delayedRef": "w4t2_apply",
        "delayedPrompt": "Last touch, your evidence was:",
        "relate": {
          "text": [
            "The third tool: <b>values-based parenting decisions</b> - naming what you actually value for your child underneath a specific disagreement (with a co-parent, or across generations with grandparents), and letting that guide the decision."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Why might naming the shared value underneath a disagreement work better than arguing about the specific rule directly?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Think of a real parenting disagreement - with a co-parent, or with grandparents - about a specific rule.",
          "prompt": "In two or three sentences: name the specific rule being argued about, then the value you think is actually underneath it for you.",
          "placeholder": "The rule: ... / The value underneath it: ..."
        },
        "reveal": {
          "text": "There's no single model answer here - the tell is whether a real, specific value emerges, not just a restatement of the original rule in different words."
        },
        "remember": {
          "prompt": "In a sentence or two: did naming the value reveal any actual common ground with the other side of the disagreement?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w4t4",
        "title": "How did it go",
        "role": "Check-in",
        "delayedRef": "w4t3_apply",
        "delayedPrompt": "Last touch, your value was:",
        "relate": {
          "text": [
            "No new idea this touch - just a real check-in on the three tools from this week, the same three that trace back to Rohan's reworked school decision back in Week 2."
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
        "id": "w4t5",
        "title": "A plan for next time",
        "role": "Pre-commitment",
        "delayedRef": "w4t4_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "One more before we bring both patterns together next week: a plan built now, before the next anxious parenting moment shows up."
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
          "text": "Something like: \"If I notice myself rechecking a decision with no new information, then I'll name the value underneath it and remind myself the decision already reflects that value.\""
        },
        "remember": {
          "prompt": "In a sentence or two: say the plan back to yourself - does it actually sound doable mid-worry, not just in hindsight?",
          "placeholder": "Your answer..."
        }
      }
    ],
    "summary": "This week: three named tools for parenting stress - behavioural parent-training strategies, cognitive restructuring of adequacy anxiety, and values-based parenting decisions - a real check-in, and a plan built while calm. No new teaching in this summary. Next week: bringing both patterns together."
  },
  {
    "num": 5,
    "title": "Integration & review",
    "mechanism": "both",
    "kind": "integration",
    "retrievalCheck": null,
    "touches": [
      {
        "id": "w5t1",
        "title": "When two patterns show up together",
        "role": "Integration",
        "delayedRef": "w4t5_apply",
        "delayedPrompt": "Last week, your if-then plan was:",
        "relate": {
          "text": [
            "Meera has been quietly absorbing every gap in her mother's care for months (caregiving burden) - and lately, she's also been lying awake reworking her younger daughter's school decision, even though nothing new has changed (parenting stress), the sandwich-generation reality of both demands landing in the same season of her life."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Both patterns showed up here. Which one do you think is actually driving the other, and why?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Same situation - Meera's caregiving load and the parenting anxiety showing up alongside it.",
          "prompt": "In two or three sentences: what would you actually recommend Meera try, and why that one, out of all seven tools you now know?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's a real case either way. Some would start with values-based caregiving-boundary setting, since freeing up real time and energy might naturally reduce the bandwidth being pulled into anxious school-decision reworking. Others would say the parenting-adequacy thought-testing matters more directly, since that anxiety is showing up specifically around her daughter, not her mother. Either is defensible - what matters is she picks one and actually runs it."
        },
        "remember": {
          "prompt": "In a sentence or two: which would you have picked for yourself, in her position?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w5t2",
        "title": "Designing a full response",
        "role": "Integration",
        "delayedRef": "w5t1_apply",
        "delayedPrompt": "Last touch, you said you'd recommend:",
        "relate": {
          "text": [
            "Arjun has been the primary caregiver for his father for two years, absorbing every appointment and every gap without asking his siblings for help (caregiving burden) - and at home, he's noticed himself being unusually harsh with his own son over small things, snapping in ways that feel out of proportion to what actually happened (parenting stress), as if the caregiving strain is spilling into how he parents."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "What's driving what here, in your own words - is the caregiving strain feeding the parenting reactivity, or are they genuinely separate things happening to overlap right now?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Same situation - Arjun's caregiving load and the harshness showing up with his son.",
          "prompt": "In two or three sentences: design a full plan for Arjun - combine tools across patterns if that's what it takes.",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Something like: \"Compassionate-mind training addresses the harsh, depleted state he's carrying from caregiving directly, which may be the actual source of the short temper with his son. Separately, naming a specific ask to his siblings for caregiving help reduces the load itself - even if the reactivity with his son is genuinely its own pattern too, reducing the caregiving strain gives him more capacity to catch it.\""
        },
        "remember": {
          "prompt": "In a sentence or two: which of the two patterns do you reach for tools on first, generally - and why do you think that's your instinct?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w5t3",
        "title": "One more, mixed",
        "role": "Integration",
        "delayedRef": "w5t2_apply",
        "delayedPrompt": "Last touch, your plan for Arjun was:",
        "relate": {
          "text": [
            "Nisha has had a genuinely hard month: she's the only one managing her mother-in-law's diabetes care, day in and day out (caregiving burden), and she's also been anxiously rewriting her son's bedtime routine every few days, convinced each version is somehow wrong (parenting stress) - both demands pulling at the same limited hours and energy."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Both patterns showed up here at once. In your own words, how do they seem to be feeding each other?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Same situation - Nisha's month.",
          "prompt": "In two or three sentences: what's the one move that would actually help the most right now, and why that one over the others?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single right answer - the pattern worth noticing is that constant depletion from unshared caregiving likely reduces the mental bandwidth to hold a parenting decision steady, which may explain why the bedtime routine keeps getting rewritten - without one single tool being able to address both fully at once."
        },
        "remember": {
          "prompt": "In a sentence or two: is there a real situation in your own life right now where both of these show up together?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w5t4",
        "title": "A third scenario",
        "role": "Integration",
        "delayedRef": "w5t3_apply",
        "delayedPrompt": "Last touch, you wrote this:",
        "relate": {
          "text": [
            "Vikram has been the go-between managing his elderly mother's finances and appointments for a year now (caregiving burden) - and every parenting decision he makes gets second-guessed by his own parents, who compare his approach unfavorably to how they raised him, which he's started internalizing as evidence he's doing it wrong (parenting stress)."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "If you had to guess which pattern is actually the loudest here, which would you guess, and what would you look for to check?",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "Same situation - Vikram caught between caregiving demands and his parents' parenting critiques.",
          "prompt": "In two or three sentences: what's the one move that unblocks the most here, if there is one - and if there isn't, say so.",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "Often the honest answer is that no single tool resolves both cleanly - values-based parenting decisions could help him hold steady against his parents' comparisons by grounding him in his own values rather than theirs, but the underlying caregiving load for his mother is still there and still needs its own boundary-setting, regardless of how settled he feels about his parenting."
        },
        "remember": {
          "prompt": "In a sentence or two: what's your instinct, generally - address the caregiving load first, or the parenting anxiety it's feeding into first?",
          "placeholder": "Your answer..."
        }
      },
      {
        "id": "w5t5",
        "title": "Your own situation - nothing pre-walked",
        "role": "Transfer test",
        "transferTest": true,
        "delayedRef": "w5t4_apply",
        "delayedPrompt": "Last touch, your instinct was:",
        "relate": {
          "text": [
            "This is the one part of the module built with no scaffolding at all.",
            "You've followed Meera through an unnamed caregiving load, Rohan through anxious parenting rechecking, and hopefully noticed the shape of one or both of these patterns in your own life too, more than once.",
            "Now it's just yours. You've got a real situation right now - caregiving burden, parenting stress, maybe both at once, the way many people quietly carry both. Don't simplify it for us."
          ]
        },
        "think": {
          "mode": "open",
          "prompt": "Describe it in your own words - what's actually going on, as specifically as you can.",
          "placeholder": "Your answer..."
        },
        "apply": {
          "scenario": "With nothing pre-walked this time.",
          "prompt": "In two or three sentences: what's your actual next move, and why that one - which of the seven tools, and why not one of the others?",
          "placeholder": "Your answer..."
        },
        "reveal": {
          "text": "There's no single right answer here - this was the one part of the module deliberately built to have no signalled answer. What matters is whether your reasoning traces back to the tools from your theory grounding screen and Weeks 3-4, not whether it matches anyone else's."
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
    "scenario": "A caregiving task has quietly become yours alone again, without anyone actually asking you to take it on.",
    "prompt": "In two or three sentences: name the value underneath the caregiving, then a specific boundary and one concrete action that honors both.",
    "reveal": "There's no single model answer here - the tell is a specific, actionable boundary, not a vague intention to 'do less.'"
  },
  {
    "code": "A1",
    "rep": 2,
    "type": "reflection",
    "scenario": "A different caregiving task, maybe with a different family member, needs the same clarity.",
    "prompt": "In two or three sentences: name the value and boundary for this one too.",
    "reveal": "There's no single model answer here - the tell is specificity to this particular task and relationship."
  },
  {
    "code": "A2",
    "rep": 1,
    "type": "reflection",
    "scenario": "A guilt-driven thought about your caregiving shows up again - \"I should be doing more.\"",
    "prompt": "In two or three sentences: write the exact thought, and test it against real, specific evidence.",
    "reveal": "There's no single model answer here - the tell is specific evidence, not a vague reassurance."
  },
  {
    "code": "A2",
    "rep": 2,
    "type": "reflection",
    "scenario": "A different guilt-driven thought, maybe about a different part of the caregiving, shows up.",
    "prompt": "In two or three sentences: write and test this one too.",
    "reveal": "There's no single model answer here - the tell is genuine, specific evidence for this particular thought."
  },
  {
    "code": "B2",
    "rep": 1,
    "type": "reflection",
    "scenario": "An anxious thought about being an inadequate parent shows up - \"I'm getting this wrong.\"",
    "prompt": "In two or three sentences: write the exact thought, and test it against real, specific evidence.",
    "reveal": "There's no single model answer here - the tell is specific evidence, not a vague reassurance."
  },
  {
    "code": "B2",
    "rep": 2,
    "type": "reflection",
    "scenario": "A different anxious parenting thought, maybe in a different situation, shows up.",
    "prompt": "In two or three sentences: write and test this one too.",
    "reveal": "There's no single model answer here - the tell is genuine, specific evidence for this particular thought."
  },
  {
    "code": "B3",
    "rep": 1,
    "type": "reflection",
    "scenario": "A parenting disagreement - with a co-parent or grandparents - comes up again.",
    "prompt": "In two or three sentences: name the specific rule being argued about, and the value you think is underneath it for you.",
    "reveal": "There's no single model answer here - the tell is a real, specific value, not a restatement of the rule."
  },
  {
    "code": "B3",
    "rep": 2,
    "type": "reflection",
    "scenario": "A different parenting disagreement, maybe about a different topic, comes up.",
    "prompt": "In two or three sentences: name the rule and value for this one too.",
    "reveal": "There's no single model answer here - the tell is specificity to this particular disagreement."
  }
],
  toolsData: {
  "compassion_break_log": {
    "code": "A3",
    "title": "Compassionate-Mind Break",
    "mechShort": "Caregiving",
    "kind": "log_single",
    "intro": "Notice the harsh, self-critical voice around caregiving, and deliberately offer yourself the same warmth you'd offer a friend. Log it each time you actually try this.",
    "logLabel": "What did the harsh voice say, and what did you offer yourself instead?",
    "firstPlaceholder": "e.g. Caught myself thinking I was failing my mother - reminded myself I’d never say that to a friend in my position",
    "placeholder": "Your answer..."
  },
  "caregiver_burden_log": {
    "code": "A4",
    "title": "Caregiver-Burden Check-In",
    "mechShort": "Caregiving",
    "kind": "log_single",
    "intro": "A short, honest check on early signs of burnout - sleep, resentment, exhaustion, feeling trapped. Log it regularly to catch a rising pattern early.",
    "logLabel": "What did you actually notice this time?",
    "firstPlaceholder": "e.g. Slept badly three nights running, snapped at my kids more than usual - logging it before it builds further",
    "placeholder": "Your answer..."
  },
  "parent_training_log": {
    "code": "B1",
    "title": "Consistent Response Log",
    "mechShort": "Parenting Stress",
    "kind": "log_single",
    "intro": "Use a consistent, planned response to a recurring behavior - reinforcement or planned ignoring - rather than a reactive one. Log it each time you actually use it.",
    "logLabel": "What was the behavior, and how did the consistent response go?",
    "firstPlaceholder": "e.g. Planned-ignored the usual bedtime stalling instead of engaging - shorter this time than most nights",
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
    tier1: "Any statement connecting caregiving or parenting strain to intent or a plan to end one's life or self-harm (\"I can't do this anymore, I want it to just stop\", \"I have a way to end it\"), or to intent to harm a dependent (an ageing parent or a child) in one's care.",
    tier2: "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary exhaustion or distress of real, ongoing caregiving or parenting, which is what this module is specifically designed to help with. Also watch for language suggesting an ageing parent or child in one's care may actually be at risk - neglect, harsh physical discipline beyond ordinary frustration, or a caregiver describing themselves as at real risk of losing control around a dependent - this module is built for the everyday burden of caregiving and parenting stress, not for situations involving actual risk to a dependent, which need a different kind of support entirely.",
    systemPrompt: "You are a safety classifier inside a mental-health support app used in India. Classify the user's message into exactly one of: NONE, TIER1, TIER2.\n\nTIER1 definition: Any statement connecting caregiving or parenting strain to intent or a plan to end one's life or self-harm (\"I can't do this anymore, I want it to just stop\", \"I have a way to end it\"), or to intent to harm a dependent (an ageing parent or a child) in one's care.\nTIER2 definition: Persistent hopelessness about life broadly, or real functional collapse - not the ordinary exhaustion or distress of real, ongoing caregiving or parenting, which is what this module is specifically designed to help with. Also watch for language suggesting an ageing parent or child in one's care may actually be at risk - neglect, harsh physical discipline beyond ordinary frustration, or a caregiver describing themselves as at real risk of losing control around a dependent - this module is built for the everyday burden of caregiving and parenting stress, not for situations involving actual risk to a dependent, which need a different kind of support entirely.\n\nCritical context 1: many people, especially in Indian English, use hyperbolic or idiomatic self-deprecating language that is NOT a genuine risk signal - for example \"my mother will kill me if I miss this deadline\", \"this caregiving schedule is literally killing me\". Do NOT classify ordinary hyperbole, jokes, or figures of speech as TIER1 or TIER2, even if they contain words like \"kill\", \"die\", or \"worthless\".\n\nCritical context 2 (specific to this module): this module's content is about real caregiving burden and parenting stress. Genuine exhaustion, guilt, or anxiety about these topics is not itself a risk signal, and should be classified NONE. However, this module is specifically built for the everyday burden of caregiving and parenting, NOT for situations involving actual risk to a dependent. If a message describes or suggests neglect of an ageing parent, harsh physical discipline of a child beyond ordinary frustration, or the person describing themselves as at real risk of losing control around someone in their care, treat this with the same seriousness as TIER1/TIER2 risk language, even if it doesn't fit the self-harm-specific definitions above exactly - flag it in your reason field clearly as a risk-to-dependent concern distinct from the caregiver's or parent's own distress, so it can be routed appropriately.\n\nOnly classify as TIER1 if there is a genuine indication of intent, a plan, or serious risk to the person's life or safety, or to a dependent in their care. Only classify as TIER2 if there is genuine persistent hopelessness about life broadly, or real functional collapse - not the ordinary exhaustion of real, ongoing caregiving or parenting, which is what this module is designed to help with.\n\nWhen genuinely uncertain, prefer the lower tier (or NONE) rather than over-triggering - but never downgrade language that includes a specific plan, method, timeframe, or indication of risk to a dependent.\n\nRespond with ONLY a raw JSON object, no markdown fences, no other text: {\"tier\": \"NONE\" | \"TIER1\" | \"TIER2\", \"reason\": \"one short clause\"}",
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
    "text": "All 7 practicable technique mappings are my synthesis of the taxonomy's named sources - not clinician-reviewed."
  },
  {
    "area": "Clinical",
    "text": "Tier 1/2 escalation definitions for this module are a first draft, awaiting sign-off. This module includes a specific addition, similar in spirit to Module 11's physical-safety addition: explicit awareness that caregiving and parenting strain could, in rare cases, involve real risk to the dependent being cared for (an ageing parent or a child) - not just distress in the caregiver or parent themselves. Flagged in BRIEF.escalation.tier1/tier2 and worth clinical review on whether a dedicated pathway for risk-to-dependent is needed, since that is a meaningfully different concern than the self-directed distress the standard Tier 1/2 framework was built around."
  },
  {
    "area": "Structural note - first zero-guardrail, zero-reference-card module",
    "text": "2 mechanisms (5 weeks, matching Identity & Purpose's shape), T=4/3, all 7 techniques format [A]. This is the first module built with no [B] guardrail techniques and no [C] reference-only techniques at all - no intensity choices, no distress check-ins, no reference cards anywhere in the build. Worth confirming this reads as intentional (the taxonomy genuinely marks every technique here [A]) rather than an extraction error - the source taxonomy table was checked directly and confirms all 7 are [A]."
  },
  {
    "area": "Structural note - retrieval check placement, needs explicit confirmation",
    "text": "With only 2 mechanisms, the first retrieval check (week 3, the first technique week) already tests both mechanisms that exist, since \"the first two mechanisms taught\" covers the entire module. This build does not add a second, separate retrieval check at week 5 (integration), since the formula's language - \"final opens at the last week, tests remaining mechanism(s) not yet retrieval-tested\" - implies nothing remains untested at that point. This is a reasonable reading of the existing formula, but the formula doesn't define the 2-mechanism case explicitly, and Identity & Purpose (Module 5, also 2 mechanisms) is the actual precedent that should be checked directly to confirm this matches what was already built and validated there."
  },
  {
    "area": "Structural note - reused T resolutions",
    "text": "Mechanism A (T=4) uses the standard combined check-in/pre-commitment resolution, same as Module 11's Mechanism B. Mechanism B (T=3) uses the exact-fit resolution (3 technique touches + separate check-in + separate pre-commitment), same as most T=3 mechanisms since Anxiety's Panic mechanism. No new structural cases."
  },
  {
    "area": "Content decision, bank composition - new precedent",
    "text": "With no [B] or [C] techniques to exclude, and no one-time deep-exploration technique matching the Module 5 exception, all 7 techniques are eligible for the Reinforcement Bank - the first module where nothing gets excluded. All 7 were included: Reflections = A1, A2, B2, B3 (4 techniques, worksheet/values-clarification style, 8 reps); Tools = A3, A4, B1 (3 techniques, quick in-the-moment or logging practices). This is a new situation the project hasn't hit before (every prior module excluded at least one technique) and is worth an explicit decision on whether \"include everything when nothing is excluded\" is the right default, or whether some techniques should still be held back from the bank for other reasons even without a guardrail or reference-only flag."
  },
  {
    "area": "Resolved",
    "text": "Crisis helpline numbers reused from Modules 1-11 (KIRAN, TeleMANAS, Vandrevala Foundation) - national, not module-specific."
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
    "text": "Nothing in this module has been clinically reviewed and nothing has been tested with a real user. Every technique mapping, scenario, and escalation threshold is a first draft - and this module's risk-to-dependent escalation question and the retrieval-check placement question both deserve real weight, not routine sign-off."
  },
  {
    "area": "Content-authorship, recurring techniques - within this module and across the project",
    "text": "Beck's CBT cognitive restructuring appears twice within this single module (A2, caregiver guilt; B2, parenting-adequacy anxiety), each written with fresh, module-appropriate content and different scenarios per the standing practice, not reused text. The same approach (Beck, CBT) has now recurred across nearly every module built so far (Anxiety, Mood, Judged & Compared, Conflict & Communication, and now twice here), and Hayes's ACT also appears twice within this module (A1, caregiving boundaries; B3, parenting values). This continues to be flagged rather than resolved - per the standing note in Module 11's handoff, this has now come up enough times that it's worth an actual content-ops policy decision (e.g., a house style guide per named approach, to keep repeated techniques feeling distinct project-wide) rather than continuing to re-flag it module by module."
  }
]
};
