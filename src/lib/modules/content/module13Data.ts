import { ModuleContent } from '../../../types/moduleContent';

function opt(label: string, isTarget: boolean, explain: string) {
  return { label, isTarget, explain };
}

export const MODULE_13_CONTENT: ModuleContent = {
  moduleId: 'M13',
  slug: 'identity-belonging-family-acceptance',
  name: "Identity, Belonging & Family Acceptance",
  duration_weeks: 5,
  tier: "Specialized* (safety-adjacent) - 399 rupees, accessibility floor - Family domain",
  brief: {
    moduleName: "Identity, Belonging & Family Acceptance",
    moduleNumber: 13,
    tier: "Specialized* (safety-adjacent) - 399 rupees, accessibility floor - Family domain",
    scenarioSource: "Pan-India, English-medium context (per product decision) - inter-caste and inter-religion relationships facing family or community opposition, and LGBTQ+ individuals navigating disclosure and family acceptance under arranged-marriage pressure and limited openly-affirming community spaces. Language is English-medium throughout; content has not yet been reviewed for phrasing that reads as metro-specific, and has not yet been reviewed by anyone with lived experience of either concern - flagged explicitly in OPEN_QUESTIONS as a priority above the project's usual clinical-review gap.",
    mechanisms: [
      {
        key: 'A',
        name: "Inter-Caste / Inter-Religion Family Rejection",
        short: "Family Rejection",
        def: "Family rejection or conflict over a partner from a different caste, religion, or community - ranging from disapproval and pressure to end the relationship, up to threats of social boycott from the wider family or community.",
        need: "Belonging, and autonomy",
        contrast: {
          who: "Divya",
          text: "faced the same kind of family opposition to her relationship, the same real pressure - but she's found a way to stay connected to both her own sense of what she wants and to at least some part of her family, rather than experiencing it as a total, forced choice between the two."
        },
        techniques: [
          {
            code: 'A1',
            approach: "ACT",
            format: 'A',
            name: "Values Clarification Around Relationship Commitment Versus Family Approval",
            source: "Steven Hayes, Acceptance and Commitment Therapy",
            what: "Naming what you actually value in the relationship itself, separately from what you value about family approval - both are usually real - and using that clarity to think through the decision in front of you, rather than treating it as a single either-or choice.",
            how: "Family rejection often gets framed as an all-or-nothing choice between the relationship and the family. Naming both values separately, honestly, usually reveals a more specific, more workable question underneath the all-or-nothing framing.",
            why: "Addresses the underlying decision directly, in terms of what actually matters to you, rather than in terms of the pressure being applied."
          },
          {
            code: 'A2',
            approach: "Family Systems Theory",
            format: 'A',
            name: "Family Systems Mapping of Conflict Triangles and Coalition Patterns",
            source: "Murray Bowen's Family Systems Theory",
            what: "Mapping out who in the family actually holds which position - who's directly opposed, who's quietly supportive, who's caught in the middle - since family conflict over a relationship is rarely as unanimous as it can feel from the inside.",
            how: "A family's opposition often looks monolithic from the center of the conflict, but usually involves specific people in specific roles - a parent driving the opposition, a sibling privately more open, a relative caught between two sides. Naming the actual structure makes it easier to see where support might genuinely exist.",
            why: "Works on the family structure itself, which is a different lever than the internal decision A1 addresses."
          },
          {
            code: 'A3',
            approach: "Narrative Therapy",
            format: 'A',
            name: "Re-Authoring Conversations Separating the Person's Worth From the Family's Rejection Narrative",
            source: "Michael White and David Epston, Narrative Therapy",
            what: "Noticing when family rejection has been absorbed into a personal story - \"I'm a disappointment,\" \"I've brought shame\" - and deliberately re-authoring that story to separate a family's reaction from your own actual worth.",
            how: "Family rejection is often about the family's own fears, beliefs, or social pressures, not a genuine verdict on the person being rejected - but the story it produces can still get absorbed as if it were one.",
            why: "Addresses the internal story the rejection can produce, which is a different target than either the decision (A1) or the family structure (A2)."
          },
          {
            code: 'A4',
            approach: "Safety Planning",
            format: 'C',
            name: "Structured Safety-Planning Where Social Boycott or Ostracism Risk Is Present",
            source: "Standard structured safety-planning practice, adapted for family/community-boycott contexts",
            what: "A structured plan - covering practical safety, financial independence, and a support network outside the family - built specifically for situations where real social boycott or ostracism risk exists, not just disapproval.",
            how: "When real boycott or safety risk is present, planning benefits from being concrete and specific, covering practical questions (where to stay, who to call, financial independence) rather than staying general.",
            why: "Because this covers real, situation-specific safety planning where risk may be present, it isn't something to build alone from a phone screen - genuine safety planning benefits from a professional who can ask the specific questions your actual situation requires.",
            professionalNote: "A counsellor or social worker experienced with family and community conflict - many cities have organisations specifically set up for this - can help build a real, situation-specific safety plan. If you're facing anything beyond disapproval - actual threats, restricted movement, or fear for your physical safety - this is worth raising with a professional directly, and the crisis resources in this app are available any time, not just during a designated moment."
          }
        ]
      },
      {
        key: 'B',
        name: "Sexual Orientation / Gender Identity & Family Acceptance",
        short: "Identity & Family Acceptance",
        def: "Distress related to family or community response to one's sexual orientation or gender identity - including fear of rejection, the need for secrecy, and navigating arranged-marriage pressure while not open with family about who you are.",
        need: "Belonging, safety, and authenticity",
        contrast: {
          who: "Farah",
          text: "has navigated the same fears about family reaction and the same pressure around marriage expectations - but she's built a life that includes real chosen community and real self-acceptance, even in a context where being fully open with every part of her family isn't currently possible."
        },
        techniques: [
          {
            code: 'B1',
            approach: "LGBTQ+-Affirmative CBT",
            format: 'B',
            guardrail: true,
            name: "Identifying and Reducing Internalized Stigma",
            source: "Framework developed by John Pachankis, LGBTQ+-Affirmative CBT",
            what: "Noticing where negative messages about being LGBTQ+ - absorbed from family, community, or a broader culture that isn't always affirming - have been internalized as if they were true, and working to actively reduce their hold.",
            how: "Growing up in a context with limited openly-affirming spaces often means absorbing stigmatizing messages before there's any chance to question them. Naming those messages explicitly, and examining where they actually came from, is the first step to reducing their grip.",
            why: "Because this asks you to examine real, often painful internalized beliefs directly, it ships with the same guardrails as any [B] technique - a choice of intensity, and a check-in afterward."
          },
          {
            code: 'B2',
            approach: "Narrative Therapy",
            format: 'A',
            name: "Narrative Re-Authoring of the Coming-Out Story Into a Coherent, Self-Affirming Identity Narrative",
            source: "Michael White and David Epston, Narrative Therapy",
            what: "Working with your own coming-out story - however far along that process is, including not having started it with everyone yet - to shape it into a narrative that feels coherent and self-affirming, rather than one defined only by others' reactions.",
            how: "A coming-out story that's only ever told in terms of who reacted how can end up centering everyone else's response. Re-authoring the story around your own experience and meaning-making puts it back in your own hands.",
            why: "Works on the internal narrative directly, which is a different target than the stigma work in B1."
          },
          {
            code: 'B3',
            approach: "ACT",
            format: 'A',
            name: "Acceptance Work for Navigating Disclosure Timing and 'Outness' Across Contexts",
            source: "Steven Hayes, Acceptance and Commitment Therapy",
            what: "Working through the real, practical question of being differently 'out' in different contexts - open with friends, not yet with parents, uncertain with extended family - as an active, values-based choice rather than something to feel guilty about.",
            how: "Being out in some contexts and not others often gets experienced as dishonesty or failure, when it's frequently a reasonable, safety-and-timing-based choice that most LGBTQ+ people navigate in some form.",
            why: "Addresses the practical, ongoing disclosure-timing question directly, which the narrative work in B2 doesn't specifically target."
          },
          {
            code: 'B4',
            approach: "Minority Stress Theory",
            format: 'A',
            name: "Minority-Stress-Informed Psychoeducation",
            source: "Ilan Meyer's Minority Stress Model",
            what: "Understanding a real, evidence-based framework for why being a sexual or gender minority in a non-affirming environment produces additional, measurable stress on top of ordinary life stress - not because of who you are, but because of the environment's response to it.",
            how: "Minority stress theory distinguishes stress that comes from the minority experience itself (prejudice, expectation of rejection, concealment) from ordinary life stress, which helps clarify that the added weight isn't a personal failing.",
            why: "Provides the psychoeducational framework underneath B1, B2, and B3 - understanding where the added stress actually comes from."
          }
        ]
      }
    ],
    escalation: {
      tier1: "Any statement connecting family or community rejection - over caste, religion, sexual orientation, or gender identity - to intent or a plan to end one's life or self-harm (\"I can't face them, I want it to be over\", \"I have a way to end it\"), or describing an imminent, specific threat of violence from family or community.",
      tier2: "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary grief, fear, or distress of navigating real family rejection, which is what this module is specifically designed to help with. This module also needs a distinct, carefully-handled addition beyond the standard framework: language suggesting actual physical danger - restricted movement, threats of forced marriage, threats of violence, or genuine fear for physical safety connected to a relationship, sexual orientation, or gender identity - should be treated with the same seriousness as Tier 1/2 risk language even where it doesn't name self-harm directly, since these situations carry real, well-documented safety risk in some family and community contexts. This module is built for the real but non-violent distress of family disapproval and disclosure fear, not for situations involving actual physical danger, which need a different kind of support entirely - the in-app crisis resources should be surfaced immediately and directly, without waiting for further escalation confirmation, whenever this kind of language appears."
    }
  },
  introScreens: [
    {
      eyebrow: "Before we begin",
      title: "What's stored, and who can see it",
      body: [
        "Your open-text answers in this module are saved to your journal.",
        "The only person who can ever see them is your assigned practitioner, if you've connected one - never other users, never shown anywhere public.",
        "If something you write suggests you might be in real danger - including physical danger connected to family or community response - we show you support resources right away. That's the only thing that happens automatically - nothing gets sent anywhere without you knowing.",
        "Your answers stay saved and reviewable by you for 12 months from purchase, extended automatically if you renew.",
        "You can turn this module off in Settings at any time."
      ],
      cta: "I understand - continue",
      consent: true
    },
    {
      eyebrow: "What this module covers",
      title: "Two related, but distinct, kinds of family rejection",
      body: [
        "This module covers family or community rejection connected to a relationship across caste or religious lines, and family or community response to sexual orientation or gender identity - two different experiences with real overlap in what they can cost someone in terms of belonging and safety.",
        "If you're navigating gender identity specifically, this module's psychoeducation is written to include that experience directly, even though the practice scenarios mainly follow one person's story."
      ],
      cta: "Continue"
    },
    {
      eyebrow: "What this is - and isn't",
      title: "Between-session support, not a replacement, and not built for active danger",
      body: [
        "This module is designed to sit between therapy sessions, or to be useful on its own - either way, it isn't therapy, and it doesn't diagnose you with anything.",
        "If you're facing actual physical danger right now - not disapproval or distance, but real threat to your safety - please reach out immediately using the crisis resources always available in this app, rather than waiting for this module to help. This module is built for the real, but non-violent, weight of family rejection and disclosure fear."
      ],
      cta: "Continue",
      crisisButton: true
    },
    {
      eyebrow: "Why this module",
      title: "Why we're suggesting this one",
      body: [
        "You told us you're navigating family or community opposition to a relationship, or working through fear or distance connected to your sexual orientation or gender identity, or both.",
        "This module is built for exactly that - two specific patterns, each with its own real, evidence-based tools, not one blended 'family conflict' module."
      ],
      cta: "Continue"
    },
    {
      eyebrow: "What to expect",
      title: "The next 5 weeks",
      body: [
        "Short term: a new touch on weekdays, a few minutes each, real scenarios - your own words, not a quiz to pass or fail. Weekends bring a short summary, not new content.",
        "Long term, honestly: this won't change how your family or community actually responds, and it can't promise reconciliation. What it can realistically offer is 7 specific, evidence-based tools, plus enough practice separating your own worth from a family's reaction that the weight of rejection has less room to define you. That's the actual promise here, not more than that.",
        "Several techniques in this module ask you to actually engage with real, sometimes painful material about your own family or identity - one ships with a built-in choice of intensity and a check-in, on purpose. One more is explained but not delivered as an exercise, since it genuinely needs a licensed professional."
      ],
      cta: "Continue"
    },
    {
      eyebrow: "Theory grounding",
      title: "The tools everything here is built on",
      body: [
        "Each of these two patterns has more than one real, evidence-based approach behind it - so instead of blending them into one vague idea, each approach gets its own tool and its own touch.",
        "You won't use any of these in Weeks 1-2 - those two weeks are just about being able to spot each pattern clearly, before any tool gets layered on top. Weeks 3-4 bring these back, one at a time, matched to exactly what you'll have just learned to recognise."
      ],
      theory: true,
      cta: "Start Week 1"
    }
  ],
  weeks: [
    // WEEK 1: Mechanism A (Family Rejection) - Understanding
    {
      num: 1,
      title: "Family rejection: recognising the pattern",
      mechanism: 'A',
      kind: 'blocked',
      retrievalCheck: null,
      touches: [
        {
          id: 'w1t1',
          title: "Recognition - the ultimatum that isn't really one",
          role: "Recognition #1",
          noDelayed: true,
          relate: {
            text: [
              "Quick note before we start: this week and the next aren't about any of the tools yet - none show up. First, you need to be able to spot each pattern clearly. The tools come in Weeks 3-4, matched one at a time to what you'll have learned to recognise.",
              "This week's pattern has a name: <b>inter-caste or inter-religion family rejection</b>. In simple terms: family or community opposition to a relationship with someone from a different caste, religion, or community - ranging from disapproval, up to real pressure and, in some situations, threats of social boycott.",
              "Here's what that looks like. <b class='who'>Ananya</b> has been in a relationship for a year with someone her parents disapprove of, on religious grounds. Her mother frames it as a simple choice: \"Either you end this, or you're no longer welcome here.\" Ananya hears it as final - the whole relationship with her family, decided in one sentence."
            ]
          },
          think: {
            mode: 'tap',
            prompt: "Which of these actually explains what's happening? More than one will sound reasonable.",
            options: [
              opt("A statement made in one heated moment is being treated as a fixed, final, unchangeable family position", true, "Right - a family's actual position, especially under a decision this significant, is rarely as fixed as its most extreme statement in a hard moment. Treating it as final forecloses on possibilities that may still be open."),
              opt("Ananya's mother has clearly decided to permanently cut her off", false, "The scenario shows one statement, in one difficult moment - not evidence of a settled, permanent family decision. Family positions on something this significant often shift over time, in both directions."),
              opt("Ananya should end the relationship immediately to avoid losing her family", false, "This treats the ultimatum as though it settles the actual decision Ananya faces, when the module's first tool (Week 3) is specifically about clarifying what she actually values here - not concluding for her which choice is right.")
            ],
            whyPrompt: "In a few words - what's the giveaway that this is one moment's statement, not a fixed family position?"
          },
          apply: {
            scenario: "Same pattern, a different person: after her father says he won't attend her wedding if she marries outside their caste, Meenal starts planning as if the relationship with her entire family is already over.",
            prompt: "Same thing happening here. In two or three sentences: what would you actually say to Meenal right now?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"One statement from your father, even a hard one, isn't the same as knowing how your whole family will actually respond over time. It's worth staying open to that, without pretending the statement didn't hurt or that it doesn't reflect something real he's feeling right now.\""
          },
          remember: {
            prompt: "In a sentence or two: think of a moment you treated a hard statement from family as more final than it may have actually been.",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w1t2',
          title: "Recognition - carrying the family's worry as your own verdict",
          role: "Recognition #2",
          delayedRef: 'w1t1_apply',
          delayedPrompt: "Last touch, on Meenal, you wrote this:",
          relate: {
            text: [
              "A different moment with Ananya. Her mother, in the same conversation, says she's worried about what people in their community will say. Ananya walks away not just hurt, but genuinely believing she's done something shameful - as though her mother's worry about others' opinions has become proof that she's actually in the wrong.",
              "Notice what's happening: her mother's fear of community judgment has been absorbed by Ananya as a verdict on her own choices."
            ]
          },
          think: {
            mode: 'tap',
            prompt: "What does absorbing her mother's social worry as a personal verdict actually miss?",
            options: [
              opt("Her mother's fear is about social consequences for the family, which is a separate question from whether Ananya's relationship itself is actually wrong", true, "That's the distinction - a parent's worry about community judgment reflects real social pressure they're facing, but it's a different question entirely from whether the relationship itself is a wrong or shameful choice."),
              opt("Community opinion is a reliable way to judge whether a relationship is right", false, "The scenario doesn't establish that community disapproval reflects anything about the relationship's actual merits - it reflects social pressure and norms, which is a different thing."),
              opt("Ananya's mother doesn't actually love her", false, "Worrying about social consequences and loving someone aren't mutually exclusive - the scenario doesn't suggest an absence of love, just a specific, separate kind of fear getting mixed into the conversation.")
            ],
            whyPrompt: "In a few words - why might a parent's fear of community judgment not actually be evidence about the relationship itself?"
          },
          apply: {
            scenario: "A friend, hearing Ananya describe the conversation, asks her directly: \"Is your mother saying the relationship is wrong, or that she's scared of what other people will think? Those aren't the same thing.\"",
            prompt: "In two or three sentences: what would answering that question honestly actually sound like, for someone in Ananya's position?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the answer actually separates the two things (the relationship's merit, and the family's social fear), rather than treating the fear as proof of the former."
          },
          remember: {
            prompt: "In a sentence or two: has a family member's worry about others' opinions ever gotten absorbed by you as a verdict on your own choices?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w1t3',
          title: "What going along with the pressure actually costs",
          role: "Functional logic",
          delayedRef: 'w1t2_apply',
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
              "Between the ultimatum and the absorbed shame, there's a pattern worth naming honestly: going along with family pressure, even partway - hiding the relationship further, distancing from the partner - can feel like it's protecting the relationship with her family.",
              "What it actually costs is different: it doesn't resolve the underlying disapproval, since the family's actual position on the relationship hasn't changed, and it adds a second loss - distance from the partner - without actually restoring what going along with the pressure was meant to protect."
            ]
          },
          think: {
            mode: 'tap',
            prompt: "What is going along with the pressure, even partway, actually doing? These are close - think it through.",
            options: [
              opt("Offering a temporary reduction in family conflict, without resolving the family's actual position, while adding a real cost to the relationship itself", true, "That's the real trade - it can lower the immediate temperature, but the family's underlying view usually hasn't shifted, meaning the cost (strain on the relationship) is paid without the hoped-for benefit (actual approval) being secured."),
              opt("A guaranteed way to eventually win the family's approval", false, "The scenario doesn't establish that going along with pressure changes the family's underlying position - it may reduce visible conflict without changing the actual view driving it."),
              opt("Evidence that Ananya doesn't really value the relationship", false, "Managing real family pressure while still valuing a relationship are not mutually exclusive - the pattern being described is about the cost of the strategy, not a verdict on how much she cares.")
            ],
            whyPrompt: "In a few words - why might reduced visible conflict not mean the underlying disapproval has actually changed?"
          },
          apply: {
            scenario: "A cousin, watching a friend distance from her partner to keep the peace at home, asks: \"Has doing that actually changed how your parents feel about the relationship, or just how much you're talking about it?\" The friend pauses. \"...Just how much I'm talking about it, honestly.\"",
            prompt: "That's usually the tell. In two or three sentences: think of a time managing the conflict didn't actually resolve the underlying disagreement - what happened instead?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the pattern to notice is whether the underlying view actually shifted, or just the amount of visible conflict."
          },
          remember: {
            prompt: "In a sentence or two: what does the pressure to go along, even partway, usually feel like for you, right as it shows up?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w1t4',
          title: "What staying connected to both can look like",
          role: "Contrast / boundary case",
          delayedRef: 'w1t3_apply',
          delayedPrompt: "Last touch, you named this:",
          relate: {
            text: [
              "Here's what a similar situation can look like for someone who responds differently.",
              "<b class='who'>Divya</b> faced the same kind of family opposition to her relationship - real disapproval, real pressure, from a family that made their disagreement clear. But rather than treating it as a single forced choice, she told her parents directly: \"I understand this is hard for you, and I'm not asking you to pretend it isn't. I am asking you not to make me choose between you and him - I want to stay in this family, and I'm staying in this relationship.\"",
              "This is the module's contrast case for this pattern: real opposition, still genuinely present - not the absence of a hard situation, but a different response to it."
            ]
          },
          think: {
            mode: 'tap',
            prompt: "What actually makes Divya's response different from the all-or-nothing framing Ananya is facing?",
            options: [
              opt("She names both things she wants directly - the relationship and the family connection - rather than accepting the choice has to be either-or", true, "That's the real difference - not that her family's opposition is any less real, but that she refuses the framing that only one of the two things can be kept, and states that directly."),
              opt("Her family is less opposed to the relationship than Ananya's family is", false, "The scenario describes real, genuine disapproval from Divya's family too - the difference shown is in how Divya responds to it, not in how strongly her family objects."),
              opt("She simply cares less about her family's feelings than Ananya does", false, "Explicitly saying she wants to stay in the family isn't consistent with caring less about it - it's a direct statement of wanting to preserve that connection, not abandon it.")
            ],
            whyPrompt: "In a few words - how might refusing the either-or framing directly change what happens next, compared to accepting it?"
          },
          apply: {
            scenario: "A friend asks Divya how she found the words for that conversation. She says: \"I stopped assuming it had to be one or the other before I even said anything. Once I said out loud that I wanted both, it became a real possibility to actually talk about - not just something I assumed was impossible.\"",
            prompt: "In two or three sentences: think of a situation where you've been assuming an either-or choice - what would naming that you want both actually sound like?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the useful pattern is noticing whether the framing names both things wanted directly, or still quietly assumes only one is possible."
          },
          remember: {
            prompt: "In a sentence or two: is there an either-or framing in your own situation you might be accepting too quickly?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w1t5',
          title: "What actually happened",
          role: "Reinforcing rep",
          delayedRef: 'w1t4_apply',
          delayedPrompt: "Last touch, your idea was:",
          relate: {
            text: [
              "One more, and then a small piece of what actually happened with Ananya.",
              "Months later, after the initial ultimatum, her mother's position had genuinely softened - not full acceptance, but an openness to actually meeting her partner that hadn't existed in that first hard conversation. What changed wasn't a single dramatic reconciliation - it was Ananya staying in contact, not disappearing from the family the way the ultimatum had implied she should.",
              "That's not a coincidence, and it previews the tools coming in Week 3: family positions on something this significant often aren't fixed the way they can sound in a single hard moment, and staying connected - rather than treating the relationship with family as already over - leaves room for that to become visible over time."
            ]
          },
          think: {
            mode: 'tap',
            prompt: "What does her mother's softened position months later tell us about how fixed the original ultimatum actually was?",
            options: [
              opt("The ultimatum reflected a moment's intensity more than a truly fixed, unchangeable position, since real movement happened without a single dramatic reconciliation forcing it", true, "Right - genuine, gradual softening is evidence the original statement wasn't as final as it sounded in the moment it was said."),
              opt("Her mother probably didn't mean the ultimatum seriously in the first place", false, "This isn't quite right either - the pain and seriousness in the moment can be real, while still not representing a truly fixed, permanent position. Both things can be true at once."),
              opt("It doesn't really prove anything, since full acceptance still hadn't happened", false, "Partial movement toward openness is still real evidence against the idea that the original ultimatum was fixed and final - it doesn't need to reach full acceptance to demonstrate that.")
            ],
            whyPrompt: "In a few words - why might staying in contact, rather than assuming the relationship with family is over, leave more room for a position to actually shift?"
          },
          apply: {
            scenario: "A different person, same shape of realisation: after her father initially refused to discuss her partner at all, Kavya kept quietly staying in touch, without pushing the topic - and found that a year later, he asked about her partner directly for the first time.",
            prompt: "In two or three sentences: what does her father's question a year later tell Kavya about the year of quiet, ongoing contact beforehand?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"The quiet, ongoing contact likely mattered - it kept the door open long enough for something to shift, in a way that disappearing from the relationship after the initial refusal wouldn't have allowed.\""
          },
          remember: {
            prompt: "In a sentence or two: is there a family relationship where staying in contact, even without resolution yet, might matter more than it currently feels like it does?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: inter-caste and inter-religion family rejection, and how an ultimatum in one hard moment can feel like a fixed, final family position, even though real positions often move over time when contact is maintained. Next week: sexual orientation and gender identity's relationship to family acceptance, a related but distinct pattern."
    },

    // WEEK 2: Mechanism B (Identity & Family Acceptance) - Understanding
    {
      num: 2,
      title: "Identity and family acceptance: recognising the pattern",
      mechanism: 'B',
      kind: 'blocked',
      retrievalCheck: null,
      touches: [
        {
          id: 'w2t1',
          title: "Recognition - the constant calculation",
          role: "Recognition #1",
          delayedRef: 'w1t5_apply',
          delayedPrompt: "Last week, your idea was:",
          relate: {
            text: [
              "This week's pattern: <b>sexual orientation or gender identity's relationship to family acceptance</b>. In simple terms: distress connected to family or community response to who you are - including fear of rejection, the need for secrecy, and navigating pressure around marriage while not open with family about your identity.",
              "Here's what that looks like. <b class='who'>Kabir</b> is gay, and hasn't come out to his parents. At every family gathering, he runs a constant, exhausting calculation - which relatives are in the room, what's safe to say, how to answer questions about marriage without lying outright or revealing too much."
            ]
          },
          think: {
            mode: 'tap',
            prompt: "Which of these actually explains what's happening? More than one will sound reasonable.",
            options: [
              opt("The constant calculation is a real, reasonable response to an environment that doesn't yet feel safe to be fully open in - not a personal failing", true, "Right - navigating disclosure carefully in a genuinely non-affirming or uncertain environment is a reasonable, protective response, not evidence of dishonesty or something wrong with Kabir."),
              opt("Kabir is being dishonest with his family by not telling them directly", false, "Choosing when and how to disclose something this significant, based on real assessment of safety and timing, isn't the same as dishonesty - it's a common, reasonable form of self-protection."),
              opt("This kind of constant calculation is unique to Kabir and not a common experience", false, "This is actually a widely shared experience among LGBTQ+ people navigating non-affirming or uncertain family environments - not an unusual or isolated pattern.")
            ],
            whyPrompt: "In a few words - why might careful, ongoing calculation about disclosure be a reasonable response, rather than a problem in itself?"
          },
          apply: {
            scenario: "Same pattern, a different person: Farah finds herself editing every sentence before family gatherings, mentally rehearsing answers to questions about marriage, exhausted before she's even arrived.",
            prompt: "Same thing happening here. In two or three sentences: what would you actually say to Farah right now?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"That constant editing is exhausting because it's real, ongoing work - not because you're doing something wrong. It makes sense that it takes something out of you, and that doesn't mean you're handling it badly.\""
          },
          remember: {
            prompt: "In a sentence or two: think of a real moment where you've done this kind of constant calculation, about anything you weren't fully open about.",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w2t2',
          title: "Recognition - a distorted mirror",
          role: "Recognition #2",
          delayedRef: 'w2t1_apply',
          delayedPrompt: "Last touch, on Farah, you wrote this:",
          relate: {
            text: [
              "A different moment with Kabir. After overhearing a dismissive comment about being gay from a relative at a family gathering, he spends the rest of the evening feeling a familiar, old sense of shame settle in - even though the comment wasn't about him specifically, and even though he generally knows, intellectually, that there's nothing wrong with who he is.",
              "Notice what's happening: a comment from someone else has activated a much older, internalized feeling that doesn't fully match what he actually believes."
            ]
          },
          think: {
            mode: 'tap',
            prompt: "What does this gap - between what he intellectually knows and what he suddenly feels - actually suggest?",
            options: [
              opt("An earlier, internalized message about being LGBTQ+ is still present underneath his current, more accepting beliefs, and gets activated by moments like this one", true, "That's the pattern - internalized stigma absorbed earlier in life, often before there was any chance to question it, can persist underneath more accepting current beliefs and resurface in specific moments."),
              opt("The relative's comment reveals an accurate truth Kabir usually manages to ignore", false, "One dismissive comment from someone else isn't evidence about the truth of Kabir's identity - it's evidence of that person's view, which is a separate thing from what's actually true."),
              opt("Kabir doesn't actually accept himself, despite what he says", false, "Having an old, internalized reaction get activated by a specific trigger doesn't mean his current self-acceptance isn't genuine - both can be real at once, which is exactly what this pattern is about.")
            ],
            whyPrompt: "In a few words - why might an old, internalized message persist even after someone has genuinely moved toward greater self-acceptance?"
          },
          apply: {
            scenario: "A friend, hearing about Kabir's evening, says: \"That comment wasn't about you specifically, but it clearly landed somewhere. That's not you secretly believing it - that's an old message getting triggered by something outside your control.\"",
            prompt: "In two or three sentences: what would processing that distinction honestly actually sound like, for someone in Kabir's position?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the answer separates the old, triggered feeling from current, genuine belief, rather than treating the feeling as proof the old message was true."
          },
          remember: {
            prompt: "In a sentence or two: has a comment from someone else ever activated an old, internalized feeling in you that didn't match what you actually believe?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w2t3',
          title: "What constant secrecy is actually costing",
          role: "Functional logic",
          delayedRef: 'w2t2_apply',
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
              "Between the exhausting calculation and the old shame resurfacing, there's a pattern worth naming honestly: staying fully closeted with family can feel like it's protecting Kabir - keeping the relationship with his parents intact, avoiding a conversation that feels genuinely risky.",
              "What it actually costs is different: it's ongoing, exhausting work sustained indefinitely, and it means the relationship with his parents, however intact it looks, is built without a part of who he actually is ever being present in it."
            ]
          },
          think: {
            mode: 'tap',
            prompt: "What is staying fully closeted with family actually doing? These are close - think it through.",
            options: [
              opt("Genuinely protecting against a real, specific risk in the short term, while costing ongoing exhausting effort and a relationship that doesn't include a real part of who he is", true, "That's the real trade - concealment can be a genuinely reasonable, protective choice given real risk, and it also has a real, ongoing cost worth naming honestly, not pretending it's free."),
              opt("A permanent solution that fully resolves the tension he's feeling", false, "The scenario shows ongoing exhaustion and old shame resurfacing - not evidence that concealment has actually resolved the underlying tension, just that it's being managed at a real cost."),
              opt("Proof that Kabir isn't actually ready to accept who he is", false, "Choosing not to disclose to family, for real safety or timing reasons, isn't the same as not accepting himself - B3's tool later this module treats disclosure timing as a legitimate, separate choice from self-acceptance.")
            ],
            whyPrompt: "In a few words - why might a genuinely protective choice still carry a real, ongoing cost worth naming honestly?"
          },
          apply: {
            scenario: "A friend, watching Kabir manage another family gathering, asks: \"Has staying closeted with them actually made things feel resolved, or just made this a permanent, ongoing thing to manage?\" Kabir thinks about it. \"...Permanent and ongoing, if I'm honest.\"",
            prompt: "That's usually the tell. In two or three sentences: think of a time managing a hidden part of yourself didn't actually resolve the underlying tension - what happened instead?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the pattern to notice is whether the underlying tension actually resolved, or just got managed on an ongoing basis."
          },
          remember: {
            prompt: "In a sentence or two: what does the effort of staying closeted, or managing disclosure carefully, usually feel like for you, right as it shows up?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w2t4',
          title: "What real, chosen belonging can look like",
          role: "Contrast / boundary case",
          delayedRef: 'w2t3_apply',
          delayedPrompt: "Last touch, you named this:",
          relate: {
            text: [
              "Here's what a similar situation can look like for someone who has built a different kind of support.",
              "<b class='who'>Farah</b> has navigated the same fears about family reaction and the same marriage-expectation pressure. Not every part of her family is aware, and she isn't fully open in every context. But she's built a close group of chosen friends who know her fully, and she describes genuinely believing there's nothing wrong with who she is, even in a context where being fully open with every relative isn't currently possible.",
              "This is the module's contrast case for this pattern: real, ongoing complexity - not the absence of it, but a different relationship to it."
            ]
          },
          think: {
            mode: 'tap',
            prompt: "What actually makes Farah's situation different from a story where nothing has genuinely gotten better for her?",
            options: [
              opt("She's built real chosen community and real self-acceptance, even though her situation with family remains genuinely unresolved and complex", true, "That's the real distinction - being open with family isn't the only measure of things going well. Real chosen community and real internal self-acceptance can exist meaningfully, even while the family situation itself stays complicated."),
              opt("Her family has fully accepted her, unlike Kabir's family", false, "The scenario specifically says not every part of her family is aware, and she isn't fully open in every context - her family situation remains genuinely unresolved, not resolved."),
              opt("She's simply better at hiding her identity than Kabir is", false, "The scenario emphasizes genuine self-acceptance and real chosen community, not skill at concealment - the difference described is about what she's built, not how well she manages secrecy.")
            ],
            whyPrompt: "In a few words - why might chosen community and self-acceptance matter even when the family situation itself hasn't fully resolved?"
          },
          apply: {
            scenario: "A friend asks Farah how she holds both the complexity with her family and her own sense of okay-ness at the same time. She says: \"I stopped treating my family's acceptance as the only thing that decides whether I'm okay. I built other real relationships where I'm fully known, and that's real too, even while the family part is still genuinely unresolved.\"",
            prompt: "In two or three sentences: think of your own sense of belonging - where does it currently, mostly, come from?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the useful pattern is noticing whether belonging is currently resting entirely on one relationship or context, or spread across more than one."
          },
          remember: {
            prompt: "In a sentence or two: is there a source of real belonging in your life that you might be undervaluing, because it isn't the one you most wish were resolved?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w2t5',
          title: "What actually happened",
          role: "Reinforcing rep",
          delayedRef: 'w2t4_apply',
          delayedPrompt: "Last touch, your idea was:",
          relate: {
            text: [
              "One more, and then a small piece of what actually happened with Kabir.",
              "He eventually spoke with a close friend, someone outside the family entirely, about the constant calculation and the old shame that kept resurfacing. Just being fully known by one person, without any editing, changed something - not the situation with his parents, which stayed exactly as complicated as it had been, but the sense that his whole life depended on that one relationship resolving.",
              "That's not a coincidence, and it previews the tools coming in Week 3: real belonging doesn't have to depend entirely on the hardest, most uncertain relationship resolving first. The tools ahead don't promise family acceptance - they give you a way to build real self-acceptance and real belonging alongside whatever is or isn't yet resolved with family."
            ]
          },
          think: {
            mode: 'tap',
            prompt: "What does the shift Kabir felt, after being fully known by one person, tell us about where the weight had actually been concentrated before?",
            options: [
              opt("The weight had been resting on family acceptance being the only source of feeling truly known, and diversifying that source genuinely eased it, even with nothing changed at home", true, "Right - the situation with his parents was unchanged, which means the shift came from somewhere else: having even one relationship of full acceptance reduced how much weight the unresolved one was carrying alone."),
              opt("Talking to a friend is a replacement for eventually having the conversation with his parents", false, "The scenario doesn't suggest one relationship replaces the other - it suggests spreading the weight of needing full acceptance across more than one relationship, not avoiding the parent conversation indefinitely."),
              opt("It doesn't really prove anything, since the situation with his parents didn't actually change", false, "That the situation with his parents stayed exactly the same is precisely what makes the shift meaningful - it shows the relief came from somewhere else, not from the unresolved situation suddenly resolving.")
            ],
            whyPrompt: "In a few words - why might having even one relationship of full acceptance ease the weight of another relationship that's still unresolved?"
          },
          apply: {
            scenario: "A different person, same shape of realisation: after months of feeling like her wellbeing depended entirely on her mother eventually accepting her, Reema joins a local LGBTQ+ community group and finds that having other people who fully see her changes how heavy the unresolved situation with her mother feels, even though nothing about her mother's position has shifted yet.",
            prompt: "In two or three sentences: what does that shift tell Reema about where the weight had been concentrated before?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"The weight had been resting entirely on her mother's eventual acceptance - spreading that need for belonging across other real relationships didn't resolve things with her mother, but it meant her whole sense of okay-ness wasn't riding on that one relationship alone anymore.\""
          },
          remember: {
            prompt: "In a sentence or two: is there a place you could build or lean on more real belonging right now, separate from whichever relationship still feels most unresolved?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: sexual orientation and gender identity's relationship to family acceptance, and how the weight of an unresolved family relationship can ease when belonging isn't depending on that one relationship alone. Next week: the tools for family rejection."
    },

    // WEEK 3: Mechanism A technique week (T=3 exact fit + passive [C])
    {
      num: 3,
      title: "Family rejection: three tools, and a plan",
      mechanism: 'A',
      kind: 'technique',
      retrievalCheck: {
        prompt1: "In your own words - what is inter-caste/inter-religion family rejection, and why might an ultimatum in one hard moment not actually reflect a fixed, permanent family position?",
        prompt2: "And what is the pattern connecting sexual orientation or gender identity to family acceptance - why might belonging depending entirely on one unresolved family relationship be worth spreading elsewhere?",
        reveal: "Inter-caste/inter-religion family rejection is family or community opposition to a relationship across caste or religious lines - a hard ultimatum in one moment can feel fixed and final, but real family positions often move over time, especially when contact is maintained rather than treated as already over. The pattern connecting sexual orientation or gender identity to family acceptance involves real, ongoing distress from fear of rejection and the need for secrecy - when belonging depends entirely on one unresolved family relationship, its weight can feel unbearable; building real belonging and self-acceptance elsewhere doesn't resolve the family situation, but it changes how much weight that one relationship has to carry alone."
      },
      hasReferenceCard: true,
      touches: [
        {
          id: 'w3t1',
          title: "Values Clarification: Relationship Commitment Versus Family Approval",
          role: "Technique A1 - ACT (Hayes)",
          delayedRef: 'w2t5_apply',
          delayedPrompt: "Last week, your answer was:",
          relate: {
            text: [
              "This is the first of the three tools for family rejection from your theory grounding screen: <b>values clarification around relationship commitment versus family approval</b>.",
              "Remember Ananya facing her mother's ultimatum as an all-or-nothing choice? This tool separates the two values that are actually both present: what you value about the relationship itself, and what you value about family approval - named honestly, separately, rather than collapsed into a single either-or."
            ]
          },
          think: {
            mode: 'open',
            prompt: "Why might naming both values separately, rather than treating this as one single choice, reveal a more workable question underneath?",
            placeholder: "Your answer..."
          },
          apply: {
            scenario: "Think of a real relationship-versus-family-approval tension in your own life, or one close to it.",
            prompt: "In two or three sentences: name what you value about the relationship, and separately, what you value about family approval - as honestly as you can.",
            placeholder: "What I value about the relationship: ... / What I value about family approval: ..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether both values are named honestly and specifically, not collapsed back into a single choice."
          },
          remember: {
            prompt: "In a sentence or two: did naming both separately change how the situation felt to think about?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w3t2',
          title: "Family Systems Mapping of Conflict Triangles",
          role: "Technique A2 - Family Systems Theory (Bowen)",
          delayedRef: 'w3t1_apply',
          delayedPrompt: "Last touch, your values were:",
          relate: {
            text: [
              "The second tool: <b>family systems mapping of conflict triangles and coalition patterns</b> - mapping who in the family actually holds which position, since opposition is rarely as unanimous as it can feel from the center of the conflict."
            ]
          },
          think: {
            mode: 'open',
            prompt: "Why might family opposition that looks unanimous from the inside actually involve people in quite different positions?",
            placeholder: "Your answer..."
          },
          apply: {
            scenario: "Think of the family opposition in your own situation, or one close to it.",
            prompt: "In two or three sentences: map out who's directly opposed, who might be quietly more open, and who's caught in the middle, as specifically as you can.",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the map names specific people in specific positions, not a single undifferentiated 'the family.'"
          },
          remember: {
            prompt: "In a sentence or two: did mapping it out reveal anyone whose actual position surprised you?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w3t3',
          title: "Re-Authoring the Rejection Narrative",
          role: "Technique A3 - Narrative Therapy (White & Epston)",
          delayedRef: 'w3t2_apply',
          delayedPrompt: "Last touch, your map was:",
          relate: {
            text: [
              "The third tool: <b>re-authoring conversations separating your own worth from the family's rejection narrative</b> - noticing when rejection has been absorbed as a personal verdict, and deliberately telling a different, truer story."
            ]
          },
          think: {
            mode: 'open',
            prompt: "Why might a family's rejection reflect their own fears or social pressures more than an actual verdict on the person being rejected?",
            placeholder: "Your answer..."
          },
          apply: {
            scenario: "Think of a story you've absorbed about yourself from family rejection or disapproval, maybe the one from Week 1.",
            prompt: "In two or three sentences: write the absorbed story, then re-author it - what's the truer version that separates your worth from their reaction?",
            placeholder: "The absorbed story: ... / The truer version: ..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the re-authored version genuinely separates worth from reaction, not just restates the original story more gently."
          },
          remember: {
            prompt: "In a sentence or two: did writing the truer version feel different from how the story usually sits with you?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w3t4',
          title: "When the situation goes beyond disapproval",
          role: "A note before the check-in",
          delayedRef: 'w3t3_apply',
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
              "Before this week's check-in: everything so far in this module is built for real, but non-violent, family disapproval and conflict.",
              "If your own situation involves more than that - actual threats, restricted movement, or fear for your physical safety - there's a fourth item in this mechanism's toolkit, shown as a reference card rather than a touch, since it genuinely needs a licensed professional's involvement, not a self-guided exercise. You can open it any time from this week's list."
            ]
          },
          think: {
            mode: 'open',
            prompt: "Why might genuine safety planning, where real risk is present, need a professional's involvement rather than a self-guided worksheet?",
            placeholder: "Your answer..."
          },
          apply: {
            scenario: "No scenario for this touch - just a direct question.",
            prompt: "In a sentence or two: does your own situation feel like it's in the disapproval-and-conflict range this module is built for, or does it involve something closer to actual danger? Either answer is fine - this is just for you to notice.",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - if your answer leans toward actual danger, the reference card above, and the crisis resources always available in this app, are worth using directly, not just noting."
          },
          remember: {
            prompt: "In a sentence or two: is there someone - a friend, a professional, a helpline - you could actually reach out to if your situation ever moved into that territory?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w3t5',
          title: "How did it go, and a plan for next time",
          role: "Check-in + pre-commitment",
          delayedRef: 'w3t4_apply',
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
              "No new idea this touch - two quick things before we move to identity and family acceptance.",
              "First, a real check-in on the three tools from this week - the same three that trace back to Ananya's ultimatum back in Week 1. Then, a plan built now, while things feel calm."
            ]
          },
          think: {
            mode: 'open',
            prompt: "Which of the three did you actually try this week, if any - and what happened?",
            placeholder: "Your answer..."
          },
          apply: {
            scenario: "Pick whichever of the three tools felt most useful, or most realistic to actually use, this week.",
            prompt: "In two or three sentences, write an if-then plan for using it: 'If [specific cue], then I will [specific tool, specifically applied].'",
            placeholder: "If [specific cue], then I will..."
          },
          reveal: {
            text: "Something like: \"If I catch myself treating a hard family statement as final, then I'll pause and ask which value - the relationship or family approval - I'm actually weighing, before deciding what it means.\""
          },
          remember: {
            prompt: "In a sentence or two: say the plan back to yourself - does it actually sound doable in a real moment, not just in hindsight?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: three named tools for family rejection - values clarification, family systems mapping, and re-authoring the rejection narrative - plus a reference card for situations involving real safety risk, a check-in, and a plan built while calm. No new teaching in this summary. Next week: identity and family acceptance."
    },

    // WEEK 4: Mechanism B technique week (T=4, standard combining, B1 guardrailed)
    {
      num: 4,
      title: "Identity and family acceptance: four tools, and a plan",
      mechanism: 'B',
      kind: 'technique',
      retrievalCheck: null,
      touches: [
        {
          id: 'w4t1',
          title: "Narrative Re-Authoring of the Coming-Out Story",
          role: "Technique B2 - Narrative Therapy (White & Epston)",
          delayedRef: 'w3t5_apply',
          delayedPrompt: "Last week, your if-then plan was:",
          relate: {
            text: [
              "This is the first of the four tools for identity and family acceptance from your theory grounding screen: <b>narrative re-authoring of the coming-out story into a coherent, self-affirming identity narrative</b>.",
              "Remember Kabir's constant calculation at family gatherings? This tool works with the coming-out story itself - however far along it is, including parts not yet shared with everyone - shaping it around your own experience and meaning-making, rather than only around others' reactions."
            ]
          },
          think: {
            mode: 'open',
            prompt: "Why might a coming-out story that's only ever told in terms of others' reactions end up centering the wrong thing?",
            placeholder: "Your answer..."
          },
          apply: {
            scenario: "Think of your own coming-out story, or disclosure story, however far along it is - even if it's mostly still private.",
            prompt: "In two or three sentences: write a piece of that story centered on your own experience and meaning, not on how others reacted.",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the story is genuinely centered on your own experience, not structured around cataloguing others' responses."
          },
          remember: {
            prompt: "In a sentence or two: did centering your own experience feel different from how you usually tell this story, even to yourself?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w4t2',
          title: "Acceptance Work for Disclosure Timing and 'Outness'",
          role: "Technique B3 - ACT (Hayes)",
          delayedRef: 'w4t1_apply',
          delayedPrompt: "Last touch, your story piece was:",
          relate: {
            text: [
              "The second tool: <b>acceptance work for navigating disclosure timing and 'outness' across contexts</b> - treating being differently open in different settings as an active, values-based choice, not something to feel guilty about."
            ]
          },
          think: {
            mode: 'open',
            prompt: "Why might being out in some contexts and not others be a reasonable choice, rather than a form of dishonesty?",
            placeholder: "Your answer..."
          },
          apply: {
            scenario: "Think of the different contexts in your own life - where you're more open, where you're more careful.",
            prompt: "In two or three sentences: name one context where your current level of openness feels like a genuine, reasonable choice, and why.",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the choice is framed as active and values-based, not as something to apologize for."
          },
          remember: {
            prompt: "In a sentence or two: did naming it as an active choice change how it felt to think about?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w4t3',
          title: "Minority-Stress-Informed Psychoeducation",
          role: "Technique B4 - Minority Stress Theory (Meyer)",
          delayedRef: 'w4t2_apply',
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
              "The third tool: <b>minority-stress-informed psychoeducation</b> - understanding why being a sexual or gender minority in a non-affirming environment adds real, measurable stress on top of ordinary life stress, not because of who you are, but because of the environment's response to it."
            ]
          },
          think: {
            mode: 'open',
            prompt: "Why might distinguishing minority stress from ordinary life stress matter for how you understand your own exhaustion?",
            placeholder: "Your answer..."
          },
          apply: {
            scenario: "Think of a recent period of exhaustion or strain connected to navigating disclosure, family, or community response.",
            prompt: "In two or three sentences: how much of that strain, looking at it now, was ordinary life stress versus added minority stress specifically?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is an honest attempt to separate the two, not a claim that all strain is one or the other."
          },
          remember: {
            prompt: "In a sentence or two: did separating the two change how you think about that period?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w4t4',
          title: "Identifying and Reducing Internalized Stigma",
          role: "Technique B1 - LGBTQ+-Affirmative CBT (Pachankis) - guided",
          guardrail: true,
          delayedRef: 'w4t3_apply',
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
              "The fourth tool: <b>identifying and reducing internalized stigma</b> - noticing where negative messages about being LGBTQ+, absorbed from family, community, or a broader non-affirming culture, have settled in as if they were true.",
              "Because this asks you to examine real, sometimes painful internalized beliefs directly, this touch checks in with you partway through."
            ]
          },
          think: {
            mode: 'open',
            prompt: "Why might a negative message absorbed early in life, before there was any chance to question it, be harder to notice than one encountered later?",
            placeholder: "Your answer..."
          },
          apply: {
            scenario: "Think of an old, internalized message about being LGBTQ+ that you've absorbed at some point, maybe the one that resurfaced for Kabir in Week 2.",
            intensityPrompt: "First, choose how far you want to go with this right now:",
            intensityOptions: [
              "Smaller version - name the message briefly, without unpacking where it came from yet",
              "Bigger version - name the message and trace where it likely came from"
            ],
            prompt: "In two or three sentences: write the message, and where you think it actually came from - or just name it, depending on what you chose above.",
            placeholder: "Your answer..."
          },
          distressPrompt: "You've just examined a real, sometimes painful internalized belief. Before we continue - how are you feeling right now?",
          reveal: {
            text: "There's no single model answer here - the tell is whether the message is named specifically, not left as a vague, general sense of unease."
          },
          remember: {
            prompt: "In a sentence or two: did naming the message directly, rather than leaving it vague, change how much power it seemed to hold?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w4t5',
          title: "How did it go, and a plan for next time",
          role: "Check-in + pre-commitment",
          delayedRef: 'w4t4_apply',
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
              "No new idea this touch - two quick things before we bring both patterns together next week.",
              "First, a real check-in on the four tools from this week, the same four that trace back to Kabir's constant calculation back in Week 2. Then, a plan built now, while things feel calm."
            ]
          },
          think: {
            mode: 'open',
            prompt: "Which of the four did you actually try this week, if any - and what happened?",
            placeholder: "Your answer..."
          },
          apply: {
            scenario: "Pick whichever of the four tools felt most useful, or most realistic to actually use, this week.",
            prompt: "In two or three sentences, write an if-then plan for using it: 'If [specific cue], then I will [specific tool, specifically applied].'",
            placeholder: "If [specific cue], then I will..."
          },
          reveal: {
            text: "Something like: \"If an old, internalized message about being LGBTQ+ gets triggered by something someone says, then I'll name it explicitly as an old message, not a current truth, before letting it settle in.\""
          },
          remember: {
            prompt: "In a sentence or two: say the plan back to yourself - does it actually sound doable in a real moment, not just in hindsight?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: four named tools for identity and family acceptance - narrative re-authoring, disclosure-timing acceptance work, minority-stress psychoeducation, and internalized-stigma work - a real check-in, and a plan built while calm. No new teaching in this summary. Next week: bringing both patterns together."
    },

    // WEEK 5: Integration + unscaffolded transfer test
    {
      num: 5,
      title: "Integration & review",
      mechanism: 'both',
      kind: 'integration',
      retrievalCheck: null,
      touches: [
        {
          id: 'w5t1',
          title: "When two patterns show up together",
          role: "Integration",
          delayedRef: 'w4t5_apply',
          delayedPrompt: "Last week, your if-then plan was:",
          relate: {
            text: [
              "Rhea is in a relationship her family opposes on religious grounds (family rejection) - and she's also queer, not yet out to her parents, which means the version of her relationship her family actually knows about isn't even fully accurate to begin with (identity and family acceptance), each layer of the situation adding to the other's weight."
            ]
          },
          think: {
            mode: 'open',
            prompt: "Both patterns showed up here. Which one do you think is actually driving the other, and why?",
            placeholder: "Your answer..."
          },
          apply: {
            scenario: "Same situation - Rhea's religious-difference conflict and her not-yet-disclosed identity.",
            prompt: "In two or three sentences: what would you actually recommend Rhea try, and why that one, out of all seven tools you now know?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's a real case either way. Some would start with values clarification (A1), since getting clear on what she actually wants from both the relationship and family approval might clarify what she can realistically ask for right now. Others would say disclosure-timing acceptance work (B3) matters more directly, since the fact her family doesn't know she's queer is actively shaping what they even think they're opposing. Either is defensible - what matters is she picks one and actually starts there."
          },
          remember: {
            prompt: "In a sentence or two: which would you have picked for yourself, in her position?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w5t2',
          title: "Designing a full response",
          role: "Integration",
          delayedRef: 'w5t1_apply',
          delayedPrompt: "Last touch, you said you'd recommend:",
          relate: {
            text: [
              "Arnav's family has made their disapproval of his partner (a different caste) very clear (family rejection) - and separately, he's gay, and has decided not to come out to them at all right now, partly because he doesn't want to add another front to an already difficult relationship (identity and family acceptance)."
            ]
          },
          think: {
            mode: 'open',
            prompt: "What's driving what here, in your own words - is the caste conflict shaping his choice about disclosure, or are they genuinely separate decisions that happen to be overlapping right now?",
            placeholder: "Your answer..."
          },
          apply: {
            scenario: "Same situation - Arnav's caste-conflict relationship and his choice not to disclose his sexual orientation right now.",
            prompt: "In two or three sentences: design a full plan for Arnav - combine tools across patterns if that's what it takes.",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"Family systems mapping (A2) could help him see whether there's more room with specific family members than the caste conflict currently suggests. Separately, disclosure-timing acceptance work (B3) affirms that choosing not to come out right now, given everything else on the table, is a reasonable, values-based choice - not something he needs to justify or feel guilty about, even while the caste conflict is unresolved.\""
          },
          remember: {
            prompt: "In a sentence or two: which of the two patterns do you reach for tools on first, generally - and why do you think that's your instinct?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w5t3',
          title: "One more, mixed",
          role: "Integration",
          delayedRef: 'w5t2_apply',
          delayedPrompt: "Last touch, your plan for Arnav was:",
          relate: {
            text: [
              "Simran has been quietly seeing someone from a different religion for months (family rejection, not yet disclosed to family at all) - and she's also been managing an old, internalized shame about a past relationship with a woman that she's never told anyone in her family about (identity and family acceptance), both things staying hidden for what feels like overlapping reasons."
            ]
          },
          think: {
            mode: 'open',
            prompt: "Both patterns showed up here at once, both still hidden. In your own words, how do they seem to be feeding each other?",
            placeholder: "Your answer..."
          },
          apply: {
            scenario: "Same situation - Simran's hidden relationship and old internalized shame.",
            prompt: "In two or three sentences: what's the one move that would actually help the most right now, and why that one over the others?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single right answer - the pattern worth noticing is that keeping both things hidden may be reinforcing each other's sense of urgency and risk, even though they're actually separate situations with separate timelines - without one single tool being able to address both fully at once."
          },
          remember: {
            prompt: "In a sentence or two: is there a real situation in your own life right now where both of these show up together?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w5t4',
          title: "A third scenario",
          role: "Integration",
          delayedRef: 'w5t3_apply',
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
              "Yusuf's parents have accepted, with real difficulty, his relationship with a partner from a different faith (family rejection, largely resolved with effort) - but he still hasn't told them he's bisexual, worried that even after working through one hard conversation, this would be one difficult thing too many for the relationship to hold (identity and family acceptance)."
            ]
          },
          think: {
            mode: 'open',
            prompt: "If you had to guess which pattern is actually the loudest here, which would you guess, and what would you look for to check?",
            placeholder: "Your answer..."
          },
          apply: {
            scenario: "Same situation - Yusuf weighing whether to disclose again after one hard conversation already resolved with effort.",
            prompt: "In two or three sentences: what's the one move that unblocks the most here, if there is one - and if there isn't, say so.",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Often the honest answer is that no single tool resolves both cleanly - disclosure-timing acceptance work (B3) could help him treat the timing of this second disclosure as its own separate, legitimate choice rather than borrowing anxiety from the first one, but the underlying fear about how much a relationship can hold is still his to weigh, regardless of how the first conversation went."
          },
          remember: {
            prompt: "In a sentence or two: what's your instinct, generally - would one hard conversation going well make you more or less afraid of the next one?",
            placeholder: "Your answer..."
          }
        },
        {
          id: 'w5t5',
          title: "Your own situation - nothing pre-walked",
          role: "Transfer test",
          transferTest: true,
          delayedRef: 'w5t4_apply',
          delayedPrompt: "Last touch, your instinct was:",
          relate: {
            text: [
              "This is the one part of the module built with no scaffolding at all.",
              "You've followed Ananya through an ultimatum that turned out not to be final, Kabir through the constant calculation of careful disclosure, and hopefully noticed the shape of one or both of these patterns in your own life too, more than once.",
              "Now it's just yours. You've got a real situation right now - family rejection, identity and family acceptance, maybe both at once, the way Rhea, Arnav, Simran, and Yusuf each faced in their own ways. Don't simplify it for us."
            ]
          },
          think: {
            mode: 'open',
            prompt: "Describe it in your own words - what's actually going on, as specifically as you can.",
            placeholder: "Your answer..."
          },
          apply: {
            scenario: "With nothing pre-walked this time.",
            prompt: "In two or three sentences: what's your actual next move, and why that one - which of the tools, and why not one of the others?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single right answer here - this was the one part of the module deliberately built to have no signalled answer. What matters is whether your reasoning traces back to the tools from your theory grounding screen and Weeks 3-4, not whether it matches anyone else's."
          },
          remember: {
            prompt: "In a sentence or two - what do you actually want to remember from this module, in your own words, not the module's?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: null
    }
  ],
  reinforcementBank: [
    {
      code: 'A1',
      rep: 1,
      type: 'reflection',
      scenario: "A relationship-versus-family-approval tension shows up again, maybe in a new form.",
      prompt: "In two or three sentences: name what you value about the relationship, and separately, what you value about family approval.",
      reveal: "There's no single model answer here - the tell is whether both values are named honestly and specifically."
    },
    {
      code: 'A1',
      rep: 2,
      type: 'reflection',
      scenario: "A different version of the same tension, maybe involving a different family member's view, comes up.",
      prompt: "In two or three sentences: name the values again for this one.",
      reveal: "There's no single model answer here - the tell is specificity to this particular version of the tension."
    },
    {
      code: 'A3',
      rep: 1,
      type: 'reflection',
      scenario: "An absorbed story about your own worth, tied to family rejection or disapproval, resurfaces.",
      prompt: "In two or three sentences: write the absorbed story, then the truer, re-authored version.",
      reveal: "There's no single model answer here - the tell is a genuine separation between worth and reaction."
    },
    {
      code: 'A3',
      rep: 2,
      type: 'reflection',
      scenario: "A different absorbed story, maybe about a different part of the family conflict, resurfaces.",
      prompt: "In two or three sentences: write and re-author this one too.",
      reveal: "There's no single model answer here - the tell is genuine re-authoring, not just gentler restating."
    },
    {
      code: 'B2',
      rep: 1,
      type: 'reflection',
      scenario: "A piece of your coming-out or disclosure story - however far along it is - comes to mind again.",
      prompt: "In two or three sentences: write it centered on your own experience and meaning, not others' reactions.",
      reveal: "There's no single model answer here - the tell is genuine centering on your own experience."
    },
    {
      code: 'B2',
      rep: 2,
      type: 'reflection',
      scenario: "A different piece of the story, maybe from a different period, comes to mind.",
      prompt: "In two or three sentences: write this piece too, the same way.",
      reveal: "There's no single model answer here - the tell is specificity to this particular piece of the story."
    },
    {
      code: 'B4',
      rep: 1,
      type: 'reflection',
      scenario: "A recent period of strain connected to navigating disclosure, family, or community response comes to mind.",
      prompt: "In two or three sentences: separate the ordinary life stress from the added minority stress in that period.",
      reveal: "There's no single model answer here - the tell is an honest attempt at the distinction."
    },
    {
      code: 'B4',
      rep: 2,
      type: 'reflection',
      scenario: "A different period of strain, maybe a more recent one, comes to mind.",
      prompt: "In two or three sentences: separate the two kinds of stress for this one too.",
      reveal: "There's no single model answer here - the tell is genuine separation, specific to this period."
    }
  ],
  toolsData: {
    values_clarity_log: {
      code: 'A2',
      title: 'Family Position Check-In',
      mechShort: 'Family Rejection',
      kind: 'log_single',
      intro: "A quick check on who in the family actually holds which position, since opposition can shift and isn't always as unanimous as it feels. Log it whenever it's worth revisiting.",
      logLabel: 'What did you notice about where different family members actually stand right now?',
      firstPlaceholder: 'e.g. My aunt asked a genuinely curious question this time, instead of just repeating my mother\u2019s position - noting the shift',
      placeholder: 'Your answer...'
    },
    disclosure_log: {
      code: 'B3',
      title: 'Disclosure-Choice Log',
      mechShort: 'Identity & Family Acceptance',
      kind: 'log_single',
      intro: "Log a moment where you made an active, values-based choice about disclosure or outness in a specific context - not something to feel guilty about, just something to notice.",
      logLabel: 'What was the context, and what did you choose, and why?',
      firstPlaceholder: 'e.g. Didn\u2019t correct a colleague\u2019s assumption at work today - chose the timing deliberately, not out of shame',
      placeholder: 'Your answer...'
    }
  },
  mhpiConfig: {
    baselineQuestions: [
      { id: 'q1', label: 'Problem Severity', prompt: 'Overall, how much is this issue affecting you right now?', min: 0, max: 10, minLabel: 'Not at all', maxLabel: 'Extremely', reverse: false },
      { id: 'q2', label: 'Functional Impact', prompt: 'How much is this issue interfering with your daily life (work, studies, relationships, or routine)?', min: 0, max: 10, minLabel: 'Not at all', maxLabel: 'Extremely', reverse: false },
      { id: 'q3', label: 'Avoidance', prompt: 'Because of this issue, how often do you avoid situations you would otherwise want to face?', min: 0, max: 10, minLabel: 'Never', maxLabel: 'Always', reverse: false },
      { id: 'q4', label: 'Self-Efficacy', prompt: 'How confident are you that you can manage this issue effectively?', min: 0, max: 10, minLabel: 'Not confident', maxLabel: 'Extremely confident', reverse: true },
      { id: 'q5', label: 'Hope', prompt: 'How hopeful are you that this issue can improve?', min: 0, max: 10, minLabel: 'Not hopeful', maxLabel: 'Extremely hopeful', reverse: true }
    ],
    weeklyQuestions: [
      { id: 'w1', prompt: "How much has this issue affected you this week?", min: 0, max: 10, minLabel: 'Not at all', maxLabel: 'Extremely' },
      { id: 'w2', prompt: "How confident do you feel managing this issue this week?", min: 0, max: 10, minLabel: 'Not confident', maxLabel: 'Extremely confident' },
      { id: 'w3', prompt: "On how many days did you practice this week's activities?", min: 0, max: 7, minLabel: '0 days', maxLabel: '7 days' }
    ],
    endExtraQuestions: [
      { id: 'e6', prompt: "Overall, how helpful was this program?", min: 1, max: 5, minLabel: 'Not at all helpful', maxLabel: 'Extremely helpful' }
    ],
    endChoice: {
      id: 'e7',
      prompt: "What would you like to do next?",
      options: ['Finish here', 'Continue with another program', 'Talk to a therapist']
    }
  },
  escalationConfig: {
    tier1: "Any statement connecting family or community rejection - over caste, religion, sexual orientation, or gender identity - to intent or a plan to end one's life or self-harm (\"I can't face them, I want it to be over\", \"I have a way to end it\"), or describing an imminent, specific threat of violence from family or community.",
    tier2: "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary grief, fear, or distress of navigating real family rejection, which is what this module is specifically designed to help with. This module also needs a distinct, carefully-handled addition beyond the standard framework: language suggesting actual physical danger - restricted movement, threats of forced marriage, threats of violence, or genuine fear for physical safety connected to a relationship, sexual orientation, or gender identity - should be treated with the same seriousness as Tier 1/2 risk language even where it doesn't name self-harm directly, since these situations carry real, well-documented safety risk in some family and community contexts. This module is built for the real but non-violent distress of family disapproval and disclosure fear, not for situations involving actual physical danger, which need a different kind of support entirely - the in-app crisis resources should be surfaced immediately and directly, without waiting for further escalation confirmation, whenever this kind of language appears.",
    systemPrompt: `You are a safety classifier inside a mental-health support app used in India. Classify the user's message into exactly one of: NONE, TIER1, TIER2.

TIER1 definition: Any statement connecting family or community rejection - over caste, religion, sexual orientation, or gender identity - to intent or a plan to end one's life or self-harm ("I can't face them, I want it to be over", "I have a way to end it"), or describing an imminent, specific threat of violence from family or community.
TIER2 definition: Persistent hopelessness about life broadly, or real functional collapse - not the ordinary grief, fear, or distress of navigating real family rejection, which is what this module is specifically designed to help with. This module also needs a distinct, carefully-handled addition beyond the standard framework: language suggesting actual physical danger - restricted movement, threats of forced marriage, threats of violence, or genuine fear for physical safety connected to a relationship, sexual orientation, or gender identity - should be treated with the same seriousness as TIER1/TIER2 risk language even where it doesn't name self-harm directly, since these situations carry real, well-documented safety risk in some family and community contexts. This module is built for the real but non-violent distress of family disapproval and disclosure fear, not for situations involving actual physical danger, which need a different kind of support entirely - the in-app crisis resources should be surfaced immediately and directly, without waiting for further escalation confirmation, whenever this kind of language appears.

Critical context 1: many people, especially in Indian English, use hyperbolic or idiomatic self-deprecating language that is NOT a genuine risk signal. Do NOT classify ordinary hyperbole, jokes, or figures of speech as TIER1 or TIER2, even if they contain words like "kill", "die", or "worthless".

Critical context 2 (specific to this module): this module's content is about real family and community rejection connected to relationships, sexual orientation, and gender identity. Genuine fear, grief, or distress about these topics is not itself a risk signal, and should be classified NONE. However, this module covers situations with well-documented, real safety risk in some contexts - treat any language suggesting actual physical danger (restricted movement, threats of forced marriage, threats of violence, coercion, or genuine fear for physical safety) with the same seriousness as TIER1/TIER2 risk language, even where it doesn't name self-harm directly, and flag it clearly in your reason field as a physical-safety concern distinct from the person's own emotional distress, so it can be routed and surfaced immediately.

Only classify as TIER1 if there is a genuine indication of intent, a plan, or serious risk to the person's life or physical safety. Only classify as TIER2 if there is genuine persistent hopelessness about life broadly, real functional collapse, or the physical-safety concern described above - not the ordinary grief or fear of navigating real family rejection, which is what this module is designed to help with.

When genuinely uncertain, prefer the lower tier (or NONE) rather than over-triggering - but never downgrade language that includes a specific plan, method, timeframe, or indication of physical danger.

Respond with ONLY a raw JSON object, no markdown fences, no other text: {"tier": "NONE" | "TIER1" | "TIER2", "reason": "one short clause"}`,
    tier1FallbackWords: ["going to kill myself", "planning to end my life", "don't want to wake up tomorrow", "have a plan to end my life", "going to end it all tonight"],
    tier2FallbackWords: ["i am worthless", "i feel like a burden to everyone", "i hate who i am", "there is no point in trying anymore", "i can't live like this"]
  },
  openQuestions: [
    { area: "Clinical - priority above the usual review gap", text: "This module has not been reviewed by anyone with lived experience of either concern (inter-caste/inter-religion relationship rejection, or LGBTQ+ identity and family acceptance in an Indian context), and it should be, before this ships to anyone - more so than the project's usual standing clinical-review reminder. Representation, language choices, and the accuracy of the Indian-context framing all need review by people who've actually lived this, not just clinical accuracy review." },
    { area: "Clinical", text: "All 8 technique mappings (7 practicable + 1 reference-only) are my synthesis of the taxonomy's named sources - not clinician-reviewed. B1 in particular (LGBTQ+-Affirmative CBT, Pachankis's internalized-stigma framework) is the first technique in this project built specifically for LGBTQ+-affirmative content, and deserves specific review from someone trained in that framework, not just general CBT review." },
    { area: "Clinical - escalation, needs real weight", text: "This module's Tier 1/2 addition (BRIEF.escalation) is a first draft addressing real, well-documented safety risk: family or community response to inter-caste/inter-religion relationships can include actual violence or coercion in some contexts, and family rejection is a well-established risk factor for self-harm among LGBTQ+ individuals specifically. Given that, this module's escalation handling deserves more clinical weight than a routine sign-off - specifically whether the crisis-resource-surfacing behavior described in BRIEF.escalation.tier2 (showing resources immediately, without waiting for further confirmation, when physical-danger language appears) is the right threshold, or whether it should trigger even earlier." },
    { area: "Content decision - what this module does not depict", text: "Following the same principle established for Trauma (Module 6): this module describes present-day patterns, fears, and coping in detail, but does not depict specific incidents of family conflict, threats, or violence scene-by-scene. Where a scenario needs to reference that opposition or a threat occurred, it's named in general terms (\"her family threatened social boycott\", not a dramatized scene of the threat being made) rather than staged as a moment-by-moment scene. Worth confirming this line was drawn in the right place throughout - it's a judgment call repeated many times across 25 touches, not a single decision." },
    { area: "Content decision - representation scope", text: "Mechanism B's practice touches center on one character's experience as a gay man navigating disclosure and family acceptance. The taxonomy explicitly covers both sexual orientation and gender identity, and B4's psychoeducation (minority stress) and the INTRO_SCREENS language address both explicitly - but the narrative touches (B1-B3) don't separately develop a distinct trans or gender-diverse character arc. This mirrors how every other module uses one or two illustrative characters per mechanism rather than covering every sub-experience, but the stakes of under-representing gender identity specifically in a module whose title names it directly are higher than usual - flagged for explicit review on whether a second character arc, or a substantial revision to make the existing arc more identity-inclusive, is needed before this ships." },
    { area: "Structural note - reused conventions from Modules 11 and 12", text: "Mechanism A (T=3 practicable + 1 [C]) uses the exact-fit-plus-passive-reference-card resolution, same shape as Conflict & Communication's Mechanism A (T=3+1[C]) - since T+2=5 exactly, no bridge touch is needed, and the [C] technique (A4) renders as a passive reference card rather than a touch. Mechanism B (T=4, one guardrailed) uses the standard combining resolution (4 technique touches + 1 combined check-in/pre-commitment). Retrieval check: following the convention used in Module 12 (also 2 mechanisms), a single retrieval check opens at Week 3, testing both mechanisms, with no second check at Week 5 - this still has not been directly confirmed against Module 5's actual precedent, and that open item now applies to two modules, not one, making it more worth resolving soon rather than continuing to defer." },
    { area: "Content-authorship, recurring techniques", text: "Narrative Therapy (White & Epston) appears twice within this single module (A3, re-authoring the rejection narrative; B2, re-authoring the coming-out story) - written with different scenarios and different framing per the standing practice, not reused text, but flagged per the ongoing content-ops question raised in Modules 11 and 12. Hayes's ACT also appears twice (A1, B3), same pattern." },
    { area: "Resolved", text: "Crisis helpline numbers reused from Modules 1-12 (KIRAN, TeleMANAS, Vandrevala Foundation) - national, not module-specific. Given this module's content, it may be worth adding an LGBTQ+-specific helpline resource (for example, established Indian organisations that run dedicated support lines) alongside the standard three - flagged here rather than added unilaterally, since resource selection deserves the same review as the rest of this module's content." },
    { area: "Resolved", text: "Escalation UX (persistent crisis banner regardless of tier, server-side logging of all classification events including NONE) follows the shared decisions documented in Module 3's dev guide, section 5 - not re-derived here, except for the module-specific immediate-surfacing behavior described in BRIEF.escalation.tier2 above." },
    { area: "Not yet started", text: "Same as prior modules: accessibility target, analytics schema, and a full copy/editorial pass have not been done for this module either." },
    { area: "Standing reminder - carries extra weight here", text: "Nothing in this module has been clinically reviewed and nothing has been tested with a real user. Every module carries this reminder, but this module's stakes are higher than most already built: the risk of getting representation, safety framing, or escalation thresholds wrong here isn't just a quality issue, it's a safety issue for a population with well-documented elevated risk. This module should not ship without the lived-experience and clinical review flagged at the top of this list." }
  ]
};
