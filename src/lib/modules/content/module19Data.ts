import { ModuleContent } from '../../../types/moduleContent';

function opt(label: string, isTarget: boolean, explain: string) {
  return { label, isTarget, explain };
}

export const MODULE_19_CONTENT: ModuleContent = {
  moduleId: 'M19',
  slug: 'performance-achievement-anxiety',
  name: 'Performance & Achievement Anxiety',
  duration_weeks: 9,
  tier: "Core - 349 rupees - Work & Education domain",
  brief: {
    moduleName: "Performance & Achievement Anxiety",
    moduleNumber: 19,
    tier: "Core - 349 rupees - Work & Education domain",
    scenarioSource: "Pan-India, English-medium context (per product decision) - covers everyday workplace performance pressure (appraisals, reviews) alongside India's high-stakes competitive exam culture (UPSC, JEE, NEET, board exams, government exam attempts). Language is English-medium throughout; content has not yet been reviewed for how well it represents vernacular-medium students, or exam contexts outside the most commonly cited national ones (state-level exams, recruitment board exams, etc.).",
    mechanisms: [
      {
        key: "A",
        name: "Performance Pressure",
        short: "Performance Pressure",
        def: "Fear of not meeting performance expectations, most often surfacing before appraisals, reviews, or other evaluative moments at work.",
        need: "Achievement",
        contrast: {
          who: "Varun",
          text: "faces the same appraisal cycle and the same evaluative pressure Aditi does - but he's found a way to actually prepare for and sit with that pressure directly, rather than either avoiding it or spiralling into catastrophic predictions about it."
        },
        techniques: [
          {
            code: "A1",
            approach: "CBT",
            format: "A",
            name: "Cognitive Restructuring of Catastrophic Appraisal-Related Predictions",
            source: "Aaron Beck",
            what: "Writing down the specific catastrophic prediction about an upcoming appraisal or review, then testing it against real, specific evidence from past evaluative moments.",
            how: "Performance pressure often runs on an unexamined, worst-case prediction - \"this will go badly and it will matter enormously\" - that rarely survives being checked against how past appraisals have actually gone.",
            why: "Targets the specific catastrophic prediction directly, which is often what makes an ordinary evaluative moment feel disproportionately threatening."
          },
          {
            code: "A2",
            approach: "ACT",
            format: "A",
            name: "Defusion From 'Must Perform Perfectly' Thoughts",
            source: "Steven Hayes, Acceptance and Commitment Therapy",
            what: "Noticing the thought \"I must perform perfectly\" and deliberately holding it more lightly - for example, rephrasing it as \"I'm having the thought that I must perform perfectly\" - rather than treating it as a literal, binding rule.",
            how: "A fused, unexamined rule like \"I must perform perfectly\" tends to drive pressure regardless of whether it's actually true or achievable; defusion doesn't argue with the thought, it changes the relationship to it.",
            why: "Works on the rigid rule itself, which is a different lever than testing a specific prediction (A1)."
          },
          {
            code: "A3",
            approach: "Systematic Desensitization",
            format: "B",
            guardrail: true,
            name: "Exposure-Based Rehearsal of the Feared Evaluative Situation",
            source: "Joseph Wolpe's systematic desensitization",
            what: "Deliberately rehearsing the feared evaluative situation itself - imagining or role-playing the appraisal conversation in detail - to reduce the anxiety response through direct, repeated exposure.",
            how: "Avoiding the feared situation, even just mentally, tends to keep the anxiety response fully intact; deliberately rehearsing it, at a chosen intensity, is what actually reduces it over repeated exposure.",
            why: "Because this asks you to deliberately sit with the feared scenario itself, this touch checks in with you partway through."
          },
          {
            code: "A4",
            approach: "Applied Relaxation",
            format: "A",
            name: "A Pre-Performance Applied-Relaxation Routine",
            source: "Lars-Goran Ost",
            what: "A short, structured relaxation routine practiced specifically in the minutes before a performance-pressure situation, to bring physical arousal down before walking in.",
            how: "Performance pressure often shows up physically - a racing heart, shallow breathing - right before the moment itself; a short, practiced routine gives something concrete to do with that in the moment.",
            why: "Targets the physical, in-the-moment side of performance pressure, which the more cognitive tools (A1, A2) don't specifically address."
          }
        ]
      },
      {
        key: "B",
        name: "Exam Stress",
        short: "Exam Stress",
        def: "Anxiety specific to high-stakes exams - competitive government exams, entrance exams, and board exams - distinct from ordinary workplace performance pressure.",
        need: "Competence",
        contrast: {
          who: "Meenal",
          text: "is preparing for the same competitive exam Karan is, under the same real stakes - but she's found a way to actually study and sit for practice tests without the anxiety taking over the process itself."
        },
        techniques: [
          {
            code: "B1",
            approach: "CBT",
            format: "B",
            guardrail: true,
            name: "Structured Study/Exam Behavioural Experiments to Test Avoidance-Driven Predictions",
            source: "Beck-style behavioural experiment, CBT",
            what: "Deliberately running a real study session or practice test - the exact thing avoidance has been protecting against - as a structured experiment to test what the anxiety has been predicting would happen.",
            how: "Exam-related avoidance (of studying, of practice tests, of past papers) is usually driven by an untested prediction about what will happen if the real difficulty is confronted directly; a real, structured attempt produces real evidence either way.",
            why: "Because this asks you to actually do the thing avoidance has been protecting against, this touch checks in with you partway through."
          },
          {
            code: "B2",
            approach: "Applied Relaxation",
            format: "A",
            name: "Applied Relaxation Practised Ahead of High-Stakes Exams",
            source: "Lars-Goran Ost's Applied Relaxation protocol",
            what: "The same applied-relaxation structure as A4, adapted specifically for the run-up to a high-stakes exam - practiced repeatedly in the days before, not just improvised on exam day.",
            how: "High-stakes exam anxiety benefits from a relaxation routine that's already been practiced and familiar by the time the actual exam arrives, rather than one attempted for the first time under real pressure.",
            why: "Targets the physical arousal specific to exam-day pressure, building on the general routine from A4 but with exam-specific practice built in ahead of time."
          },
          {
            code: "B3",
            approach: "CBT + ACT",
            format: "A",
            name: "Cognitive Restructuring of 'One Exam Defines My Future' Fused Beliefs",
            source: "Aaron Beck, paired with Steven Hayes's defusion work",
            what: "Examining the belief that a single exam result determines the whole of one's future, testing it against real evidence (people who didn't get the result they wanted the first time), and practicing holding the belief more lightly.",
            how: "High-stakes exam cultures often produce a fused belief - this one exam IS my future - that both overstates the actual stakes and makes the exam itself harder to sit for calmly.",
            why: "Targets the specific fused belief that gives a single exam outsized weight, distinct from the general exam-day anxiety B1 and B2 address."
          },
          {
            code: "B4",
            approach: "Exposure",
            format: "B",
            guardrail: true,
            name: "Timed Test-Taking Exposure Rehearsal",
            source: "Exposure-based rehearsal, applied to timed testing conditions",
            what: "Sitting a full practice test under real timed conditions - the actual clock, the actual format - as deliberate exposure to the specific pressure of the timer itself, not just the exam content.",
            how: "Time pressure during a real exam is often a distinct source of anxiety from the content itself, and it's rarely rehearsed directly; sitting a genuinely timed practice test is what actually builds tolerance for it.",
            why: "Because this asks you to deliberately sit with timed pressure under real conditions, this touch checks in with you partway through."
          }
        ]
      },
      {
        key: "C",
        name: "Fear of Failure",
        short: "Fear of Failure",
        def: "Fear of disappointing yourself or others through failure, distinct from the anxiety about the evaluative moment itself.",
        need: "Achievement",
        contrast: {
          who: "Rahul",
          text: "is attempting the same competitive placement process Divya is, with the same real risk of not getting the outcome he wants - but he's found a way to actually think through what failure would really mean, rather than treating it as unthinkable."
        },
        techniques: [
          {
            code: "C1",
            approach: "CBT",
            format: "A",
            name: "Decatastrophizing Worksheets",
            source: "Aaron Beck, CBT",
            what: "A structured worksheet walking through the actual likelihood of failure and, separately, how survivable it would genuinely be if it happened - rather than leaving both as an unexamined, catastrophic blur.",
            how: "Fear of failure often treats failure as both more likely and more catastrophic than it actually is; walking through both questions separately, on paper, tends to reveal a real gap between the fear and the honest answer.",
            why: "Directly targets the catastrophic sizing of failure itself, which is the core of this mechanism."
          },
          {
            code: "C2",
            approach: "Positive Psychology",
            format: "A",
            name: "Strengths-Based Reframing Using the VIA Character Strengths Framework",
            source: "Christopher Peterson and Martin Seligman",
            what: "Identifying your own top character strengths from the VIA framework, then reframing a feared failure scenario through the lens of what strengths would still be genuinely available to draw on, regardless of outcome.",
            how: "Fear of failure narrows attention onto the single feared outcome; deliberately naming what strengths remain constant regardless of that outcome widens the picture back out.",
            why: "Offers a different, strengths-based lever than the more analytical decatastrophizing in C1."
          },
          {
            code: "C3",
            approach: "ACT",
            format: "A",
            name: "ACT Willingness Exercises to Act Despite Fear",
            source: "Steven Hayes, Acceptance and Commitment Therapy",
            what: "Identifying one real, value-driven action currently being avoided because of fear of failure, and deliberately choosing to take it anyway - not once the fear disappears, but alongside it.",
            how: "Waiting for fear of failure to disappear before acting tends to mean never acting; willingness work targets acting despite the fear being present, rather than treating its presence as a stop sign.",
            why: "Moves from understanding the fear (C1, C2) to actually acting despite it, which is a distinct, final step."
          }
        ]
      },
      {
        key: "D",
        name: "Imposter Syndrome",
        short: "Imposter Syndrome",
        def: "A persistent feeling of being a fraud despite real, concrete evidence of competence - common after a significant achievement, not despite one.",
        need: "Competence, Belonging",
        contrast: {
          who: "Sneha",
          text: "joined the same competitive company Farhan did, as a first-generation professional facing the same unfamiliar environment - but she's found a way to actually hold her own competence as real, rather than dismissing it as luck."
        },
        techniques: [
          {
            code: "D1",
            approach: "CBT",
            format: "A",
            name: "An Evidence Log Tracking Concrete Accomplishments",
            source: "Addressing Pauline Clance and Suzanne Imes's imposter-phenomenon construct, via Beck-style CBT",
            what: "An ongoing, dated log of concrete accomplishments and the specific skills or effort behind each one - built up over time as direct evidence against fraud-related beliefs, not a one-time list.",
            how: "Imposter-related beliefs survive by discounting evidence of competence as luck, timing, or other people being fooled; an ongoing, concrete, dated log makes that evidence harder to discount in the moment it's needed.",
            why: "Builds a real, accumulating record to counter the fraud belief directly, distinct from the in-the-moment defusion work in D3."
          },
          {
            code: "D2",
            approach: "CFT",
            format: "A",
            name: "Self-Compassion Practice for Competence-Related Shame",
            source: "Paul Gilbert, Compassion-Focused Therapy",
            what: "Noticing the self-critical voice that often accompanies feeling like a fraud, and deliberately offering the same understanding you'd offer a colleague facing the exact same unfamiliar environment.",
            how: "Imposter-related shame is often harsher toward oneself than the same situation would warrant if it were a colleague's; the colleague-comparison gives a concrete, fairer standard to work from.",
            why: "Addresses the shame accompanying the fraud belief, which is a different target than the evidence itself (D1)."
          },
          {
            code: "D3",
            approach: "ACT",
            format: "A",
            name: "Defusion From 'I'm a Fraud' Thoughts",
            source: "Steven Hayes, Acceptance and Commitment Therapy",
            what: "Noticing the thought \"I'm a fraud\" in the moment it shows up, and deliberately holding it as a passing thought rather than a settled fact - the same defusion structure as A2, applied to this specific belief.",
            how: "The thought \"I'm a fraud\" tends to be treated as a factual verdict rather than one passing mental event among many; defusion changes that relationship without needing to first win an argument with the thought.",
            why: "Gives a quick, in-the-moment response for when the thought actually shows up, distinct from the slower, accumulating evidence-building in D1."
          }
        ]
      }
    ],
    escalation: {
      tier1: "Any statement connecting performance pressure, exam outcomes, or fear of failure to intent or a plan to end one's life or self-harm (\"I can't face them if I fail\", \"if this exam doesn't work out there's no point going on\", \"I have a way to end it\"). Given the well-documented, real elevated risk of suicide linked to competitive-exam outcomes in the Indian context (UPSC/JEE/NEET and similar attempts), treat any hopelessness explicitly tied to an exam or evaluative outcome - even without an explicit plan - as warranting the same seriousness as other Tier 1 language, rather than assuming it's the ordinary, intense stress this module is designed to help with.",
      tier2: "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary, real anxiety of performance pressure, exam stress, fear of failure, or imposter syndrome, which is what this module is specifically designed to help with. Also watch for language suggesting family or social consequences tied to a specific exam or evaluative outcome (severe shame, threatened rejection, or withdrawal of support tied to a result) - a real and India-specific pressure this module's scenarios touch on, distinct from ordinary disappointment."
    }
  },
  introScreens: [
    {
      eyebrow: "Before we begin",
      title: "What's stored, and who can see it",
      body: [
        "Your open-text answers in this module are saved to your journal.",
        "The only person who can ever see them is your assigned practitioner, if you've connected one - never other users, never shown anywhere public.",
        "If something you write suggests you might be in real danger, we show you support resources right away. That's the only thing that happens automatically - nothing gets sent anywhere without you knowing.",
        "Your answers stay saved and reviewable by you for 12 months from purchase, extended automatically if you renew.",
        "You can turn this module off in Settings at any time."
],
      cta: "I understand - continue",
      consent: true
    },
    {
      eyebrow: "What this module covers",
      title: "Four related, but distinct, patterns",
      body: [
        "This module covers everyday performance pressure at work, the specific anxiety of high-stakes exams, fear of failure itself, and imposter syndrome - four real, different experiences, not one blended 'achievement anxiety' module.",
        "If only one or two of these actually apply to you, that's expected - the tools for each stand on their own."
],
      cta: "Continue"
    },
    {
      eyebrow: "What this is - and isn't",
      title: "Between-session support, not a replacement",
      body: [
        "This module is designed to sit between therapy sessions, or to be useful on its own - either way, it isn't therapy, and it doesn't diagnose you with anything.",
        "This module is built for real, but ordinary, performance and exam anxiety - not for situations involving genuine family rejection or crisis tied to an outcome. If that's what you're facing, the crisis resources in this app are always available."
],
      cta: "Continue",
      crisisButton: true
    },
    {
      eyebrow: "Why this module",
      title: "Why we're suggesting this one",
      body: [
        "You told us you're dealing with performance pressure, exam stress, fear of failure, or feeling like a fraud despite real evidence otherwise - or some combination.",
        "This module is built for exactly that - four specific patterns, each with its own real, evidence-based tools."
],
      cta: "Continue"
    },
    {
      eyebrow: "What to expect",
      title: "The next 9 weeks",
      body: [
        "Short term: a new touch on weekdays, a few minutes each, real scenarios - your own words, not a quiz to pass or fail. Weekends bring a short summary, not new content.",
        "Long term, honestly: this won't change the actual stakes of a real exam or appraisal, and it won't guarantee an outcome. What it can realistically offer is 14 specific, evidence-based tools, plus enough practice with each pattern that the anxiety around performance and evaluation has less room to run unchecked. That's the actual promise here, not more than that.",
        "Three techniques in this module ask you to actually rehearse or sit with a feared situation on purpose - a feared conversation, an avoided study session, a real timed test - which can feel genuinely uncomfortable. All three ship with a built-in check-in."
],
      cta: "Continue"
    },
    {
      eyebrow: "Theory grounding",
      title: "The tools everything here is built on",
      body: [
        "Each of these four patterns has more than one real, evidence-based approach behind it - so instead of blending them into one vague idea, each approach gets its own tool and its own touch.",
        "You won't use any of these in Weeks 1-4 - those four weeks are just about being able to spot each pattern clearly, before any tool gets layered on top. Weeks 5-8 bring these back, one at a time, matched to exactly what you'll have just learned to recognise."
],
      cta: "Start Week 1",
      theory: true
    }
  ],
  weeks: [
    // WEEK 1: Performance pressure: recognising the pattern
    {
      num: 1,
      title: "Performance pressure: recognising the pattern",
      mechanism: "A",
      kind: "blocked",
      retrievalCheck: null,
      touches: [
        {
          id: "w1t1",
          title: "Recognition - the appraisal that hasn't happened yet",
          role: "Recognition #1",
          noDelayed: true,
          relate: {
            text: [
          "Quick note before we start: this week and the next three aren't about any of the tools yet - none show up. First, you need to be able to spot each pattern clearly. The tools come in Weeks 5-8, matched one at a time to what you'll have learned to recognise.",
          "This week's pattern has a name: <b>performance pressure</b>. In simple terms: fear of not meeting performance expectations, most often surfacing before appraisals, reviews, or other evaluative moments.",
          "Here's what that looks like. <b class='who'>Aditi</b>'s appraisal is three weeks away. She's already rehearsed, in detail, a version where her manager lists every shortcoming and questions whether she should still have her role - despite nothing in the last year actually suggesting that's likely."
]
          },
          think: {
            mode: "tap",
            prompt: "Which of these actually explains what's happening? More than one will sound reasonable.",
            options: [
              opt("A catastrophic, unexamined prediction about the appraisal is driving the fear, not actual evidence from the past year", true, "Right - the scenario specifically notes nothing in the last year suggests this outcome is likely; the fear is running on a vivid, untested prediction, not real evidence."),
              opt("Her manager has probably given her reason to expect a harsh appraisal", false, "The scenario specifically says nothing in the last year suggests this is likely - the prediction isn't coming from actual signals, but from an untested worst-case scenario."),
              opt("This is simply what being a careful, conscientious employee looks like", false, "Careful preparation is different from rehearsing a vivid catastrophic outcome that isn't supported by the actual evidence - the module's tools (A1) work with exactly this distinction.")
            ],
            whyPrompt: "In a few words - what's the giveaway that this is a prediction, not actual evidence?",
          },
          apply: {
            scenario: "Same pattern, a different person: before every monthly review, Rakesh mentally rehearses being told his work isn't good enough, even though his last six reviews have all been positive.",
            prompt: "Same thing happening here. In two or three sentences: what would you actually say to Rakesh right now?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"Six positive reviews in a row is real evidence, and it points the other way from what you're rehearsing - the vivid, worst-case version might just be a prediction your mind keeps running, not something actually supported by what's happened so far.\""
          },
          remember: {
            prompt: "In a sentence or two: think of a real evaluative moment where you rehearsed a worse outcome than what past evidence actually supported.",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w1t2",
          title: "Recognition - a rule that never actually gets checked",
          role: "Recognition #2",
          delayedRef: "w1t1_apply",
          delayedPrompt: "Last touch, on Rakesh, you wrote this:",
          relate: {
            text: [
          "A different angle on the same pattern with Aditi. Underneath the appraisal fear sits a specific, rigid rule she's never actually said out loud: \"I must perform perfectly, every time, or it means something is fundamentally wrong with me.\"",
          "She's never questioned this rule directly - it just runs in the background, treated as simply true, shaping how threatening an ordinary appraisal feels."
]
          },
          think: {
            mode: "tap",
            prompt: "What does treating this rule as simply true, without ever questioning it, actually do?",
            options: [
              opt("An unquestioned, rigid rule like this drives pressure regardless of whether it's actually achievable or even true, which is exactly what makes an ordinary evaluative moment feel disproportionately threatening", true, "Right - the rule isn't being weighed against reality at all; it's just running as an assumed fact, which is what gives it so much power over how threatening an ordinary appraisal feels."),
              opt("The rule is probably accurate, since high standards are generally a good thing", false, "The scenario is about a rigid, unexamined rule - \"must perform perfectly or something is fundamentally wrong with me\" - which is different from having reasonable high standards that have actually been thought through."),
              opt("This doesn't really affect how threatening the appraisal feels, since the rule is just a private thought", false, "The scenario specifically describes this rule as shaping how threatening the appraisal feels, even while running unquestioned in the background.")
            ],
            whyPrompt: "In a few words - why might an unquestioned rule have more power over someone than one they've actually thought through?",
          },
          apply: {
            scenario: "A colleague mentions offhand that they feel like a failure any time they get even minor feedback, because in their mind, feedback of any kind means they've fundamentally failed at their job.",
            prompt: "In two or three sentences: what's the unquestioned rule running underneath that reaction, and what would loosening it look like?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether a specific, rigid rule was named (not just \"they're sensitive\"), and whether loosening it was described as changing the relationship to the rule, not proving it false."
          },
          remember: {
            prompt: "In a sentence or two: what's a performance-related rule you've been treating as simply true, without ever actually questioning it?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w1t3",
          title: "What rehearsing the worst case is actually costing",
          role: "Functional logic",
          delayedRef: "w1t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Between the catastrophic prediction and the unquestioned rule, there's a pattern worth naming honestly: rehearsing the worst-case appraisal in detail can feel like useful preparation - being ready for the worst, just in case.",
          "What it actually costs is different: the three weeks leading up to Aditi's appraisal are spent in a low-grade dread that doesn't actually improve her preparation - it just makes the waiting itself worse, for a version of the meeting that's unlikely to happen."
]
          },
          think: {
            mode: "tap",
            prompt: "What is rehearsing the worst case actually doing here? These are close - think it through.",
            options: [
              opt("Feeling like protective preparation, while actually just extending real dread across the weeks of waiting, without improving the actual outcome", true, "Right - that's the real trade. The rehearsal feels protective, but it isn't building anything useful toward the actual appraisal; it's just making the waiting period itself harder."),
              opt("A genuinely useful way to prepare for a difficult conversation", false, "The scenario doesn't describe this as building any actual preparation - it's a catastrophic rehearsal that isn't supported by the real evidence, unlike genuine, targeted preparation."),
              opt("Evidence that she takes her job seriously and cares about doing well", false, "Caring about doing well is different from spending weeks rehearsing an unsupported worst-case outcome - the module's tools (A1) work with exactly that difference.")
            ],
            whyPrompt: "In a few words - why might rehearsing a feared outcome extend the distress of waiting without actually helping the real preparation?",
          },
          apply: {
            scenario: "A colleague, watching someone visibly dread an upcoming review for weeks, asks: \"Has all this worrying actually changed how the review is likely to go, or has it just made the waiting worse?\" The person pauses. \"...Just made the waiting worse, honestly.\"",
            prompt: "That's usually the tell. In two or three sentences: think of a time dreading an evaluation in advance didn't actually change the outcome - what happened instead?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the pattern to notice is whether the dread actually changed the outcome, or just cost real time and peace of mind without a corresponding benefit."
          },
          remember: {
            prompt: "In a sentence or two: what does the pull to rehearse the worst case usually feel like for you, right as it shows up?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w1t4",
          title: "What sitting with the pressure can look like",
          role: "Contrast / boundary case",
          delayedRef: "w1t3_apply",
          delayedPrompt: "Last touch, you named this:",
          relate: {
            text: [
          "Here's what a similar situation can look like for someone who's found a different way through it.",
          "<b class='who'>Varun</b> faces the same appraisal cycle and the same evaluative pressure Aditi does. But he's found a way to actually prepare for and sit with that pressure directly, rather than either avoiding it or spiralling into catastrophic predictions about it.",
          "This is the module's contrast case for this pattern: real evaluative pressure, still genuinely present - not the absence of it, but a different relationship to the prediction driving it."
]
          },
          think: {
            mode: "tap",
            prompt: "What actually makes Varun's approach different from Aditi's? Both face the same real evaluative pressure.",
            options: [
              opt("He prepares based on real evidence and sits with the discomfort of the evaluative moment directly, rather than defaulting to an unexamined catastrophic prediction", true, "That's the real difference - not that the pressure is absent for him, but that his preparation is grounded in real evidence rather than in a vivid, untested worst case."),
              opt("His manager is simply less demanding than Aditi's", false, "The scenario specifically says he faces the same evaluative pressure - the difference is in his internal response to it, not in the external situation."),
              opt("He simply doesn't feel any nervousness before appraisals", false, "The scenario doesn't say the pressure is absent for Varun - it says he sits with it directly, which is different from never feeling it at all.")
            ],
            whyPrompt: "In a few words - how might grounding preparation in real evidence change what an appraisal actually feels like going in?",
          },
          apply: {
            scenario: "A colleague asks Varun how he stays relatively calm before appraisals. He says: \"I stopped assuming the worst version was the likely one. I look at what's actually happened this year, and I prepare for that - it's still nerve-wracking, I just don't add an imagined disaster on top of it anymore.\"",
            prompt: "In two or three sentences: think of your own next evaluative moment - what would preparing based on real evidence, rather than the worst case, actually look like?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the useful pattern is noticing whether the answer is grounded in specific, real evidence rather than a general reassurance."
          },
          remember: {
            prompt: "In a sentence or two: is there one specific piece of real evidence about your own performance you could hold onto, next time this pressure shows up?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w1t5",
          title: "What actually happened",
          role: "Reinforcing rep",
          delayedRef: "w1t4_apply",
          delayedPrompt: "Last touch, your idea was:",
          relate: {
            text: [
          "One more, and then a small piece of what actually happened with Aditi.",
          "Her appraisal happened. It was ordinary - a few areas to work on, clear recognition of what had gone well, nothing resembling the catastrophic version she'd rehearsed for three weeks.",
          "That's not a coincidence, and it previews the tools coming in Week 5: the vivid, worst-case prediction and the actual outcome were almost entirely disconnected - which is usually the case, and testing the specific prediction against real evidence, directly, is what the coming tools are built to do."
]
          },
          think: {
            mode: "tap",
            prompt: "What does the ordinary appraisal tell us about the three weeks of rehearsed dread beforehand?",
            options: [
              opt("The rehearsed prediction and the actual outcome were almost entirely disconnected, which suggests the dread was running on an untested prediction rather than real signals about what would happen", true, "Right - the outcome and the prediction didn't match at all. That gap is exactly what reveals the dread wasn't tracking anything real about the actual appraisal."),
              opt("She got lucky this time, but the fear was still a reasonable one to have", false, "The scenario describes the prediction as consistently disconnected from actual evidence throughout the module's examples, not a one-time lucky outcome."),
              opt("It doesn't really prove anything, since one appraisal is just one data point", false, "One real, concrete outcome is still meaningful evidence against an untested fear - it's more evidence than the fear had ever actually been checked against before.")
            ],
            whyPrompt: "In a few words - why might a feared prediction and the actual outcome be almost entirely disconnected, if the prediction was never actually tested?",
          },
          apply: {
            scenario: "A different person, same shape of realisation: after weeks of dreading a performance review, Sameer walks out with mostly positive feedback and one minor suggestion - nothing like what he'd spent weeks bracing for.",
            prompt: "In two or three sentences: what does that ordinary outcome tell Sameer about the dread he felt beforehand?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"The dread was real, but it wasn't actually tracking what was likely to happen - the outcome was ordinary, which suggests the fear was running on an untested worst case, not on real evidence.\""
          },
          remember: {
            prompt: "In a sentence or two: is there an upcoming evaluative moment where you could try grounding your expectation in real evidence instead of the worst case?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: performance pressure, and how a catastrophic, unexamined prediction can drive weeks of dread that the actual outcome rarely matches. Next week: exam stress, a related but distinct pattern."
    },
    // WEEK 2: Exam stress: recognising the pattern
    {
      num: 2,
      title: "Exam stress: recognising the pattern",
      mechanism: "B",
      kind: "blocked",
      retrievalCheck: null,
      touches: [
        {
          id: "w2t1",
          title: "Recognition - the exam that has to justify everything",
          role: "Recognition #1",
          noDelayed: true,
          relate: {
            text: [
          "This week's pattern has a name: <b>exam stress</b>. In simple terms: anxiety specific to high-stakes exams - competitive government exams, entrance exams, board exams - distinct from ordinary workplace performance pressure.",
          "Here's what that looks like. <b class='who'>Karan</b> is preparing for a competitive exam attempt. He's stopped opening practice test papers entirely over the last two weeks, telling himself he'll \"start properly\" once he feels ready - a moment that keeps not arriving."
]
          },
          think: {
            mode: "tap",
            prompt: "What's actually happening with Karan's avoidance of practice papers?",
            options: [
              opt("Avoidance of practice tests is likely protecting against an untested prediction about how badly he'd do, which never gets checked precisely because the practice tests keep being avoided", true, "Right - by never actually sitting the practice tests, Karan never finds out whether the feared outcome is real, which is exactly what keeps the avoidance going."),
              opt("He's genuinely too under-prepared to attempt a practice test yet", false, "The scenario doesn't establish this - it describes a pattern of waiting to \"feel ready,\" which is a common avoidance pattern, not necessarily a genuine preparation gap."),
              opt("Waiting until he feels ready is simply a sensible study strategy", false, "The scenario specifically notes that the moment of \"feeling ready\" keeps not arriving, which is characteristic of avoidance rather than a deliberate, working strategy.")
            ],
            whyPrompt: "In a few words - why might avoiding practice tests keep the underlying fear about them untested?",
          },
          apply: {
            scenario: "Same pattern, a different person: Sunita has been putting off starting a structured revision schedule for her board exams for a month, telling herself she'll begin once she feels less overwhelmed.",
            prompt: "Same thing happening here. In two or three sentences: what would you actually say to Sunita right now?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"Waiting to feel less overwhelmed before starting might be exactly what's keeping the overwhelm going - starting small, even before feeling ready, is often the only way to find out the fear was bigger than the actual task.\""
          },
          remember: {
            prompt: "In a sentence or two: think of a real moment you avoided studying or a practice test, waiting for a readiness that didn't arrive.",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w2t2",
          title: "Recognition - one exam carrying an entire future",
          role: "Recognition #2",
          delayedRef: "w2t1_apply",
          delayedPrompt: "Last touch, on Sunita, you wrote this:",
          relate: {
            text: [
          "A different angle on the same pattern with Karan. Underneath the avoidance sits a belief he's never said out loud in exactly these words: \"this exam is my entire future - if it doesn't go well, nothing else will matter.\"",
          "That belief makes the exam itself feel disproportionately large, and makes actually sitting a practice test - risking seeing a bad score - feel unbearable rather than simply useful information."
]
          },
          think: {
            mode: "tap",
            prompt: "What does treating one exam as carrying an entire future actually do to how it feels to prepare for it?",
            options: [
              opt("It inflates the stakes of every practice attempt far beyond what's actually true, which makes even a useful practice test feel like an unbearable risk rather than ordinary preparation", true, "Right - the fused belief that this exam IS the future turns a normal, useful diagnostic tool (a practice test) into something that feels catastrophic to attempt."),
              opt("It's an accurate reflection of how important competitive exams genuinely are", false, "The taxonomy's point isn't that the exam doesn't matter - it's that treating a single exam as the ENTIRE future is an overstatement that makes preparation harder, not a fair description of how life outcomes actually work."),
              opt("This belief doesn't really affect how he prepares, since it's just a private thought", false, "The scenario specifically shows this belief making practice tests feel unbearable to attempt - it's directly shaping his behavior, not staying private and inert.")
            ],
            whyPrompt: "In a few words - why might treating one exam as your entire future make ordinary preparation feel unbearable?",
          },
          apply: {
            scenario: "A student says they can't bring themselves to attempt a mock test because if they score badly, it would confirm their whole future is over.",
            prompt: "In two or three sentences: what's the fused belief underneath that reaction, and what would loosening it look like?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether a specific, fused belief was named (this exam = my whole future), and whether loosening it was described as reducing the belief's grip, not denying the exam matters at all."
          },
          remember: {
            prompt: "In a sentence or two: is there an exam or result you've been treating as carrying more weight than it probably actually does?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w2t3",
          title: "What avoiding the practice tests is actually costing",
          role: "Functional logic",
          delayedRef: "w2t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Between the fused belief and the avoidance, there's a pattern worth naming honestly: not attempting practice tests can feel protective - as long as no bad score has actually appeared, the fear stays untested and unconfirmed.",
          "What it actually costs is different: with the exam date approaching, Karan has no real data on where he actually stands, and no practice with the timed conditions he'll face on the real day - the protection is imagined, but the lost preparation time is real."
]
          },
          think: {
            mode: "tap",
            prompt: "What is avoiding practice tests actually doing here? These are close - think it through.",
            options: [
              opt("Feeling like protection against a bad score, while actually costing the real diagnostic information and timed practice needed before the actual exam", true, "Right - that's the real trade. The avoidance feels protective, but it's not building anything toward the actual exam; it's just losing real preparation time while the deadline approaches."),
              opt("A genuinely sound strategy, since attempting practice tests too early can hurt confidence", false, "The scenario describes an approaching exam date with no real preparation data yet - this isn't early, deliberate pacing, it's avoidance that's costing real time close to the actual exam."),
              opt("Evidence that he's simply not ready to attempt a full test yet", false, "Readiness isn't established or contradicted by avoidance itself - the scenario shows a pattern of waiting to feel ready that never resolves, which is the actual issue, not a genuine readiness gap.")
            ],
            whyPrompt: "In a few words - why might avoiding practice tests feel protective while actually costing real preparation time?",
          },
          apply: {
            scenario: "A parent, watching their child avoid attempting mock tests as the exam date nears, asks: \"Has avoiding the mock tests actually protected you from anything, or has it just meant you don't know where you stand?\" The student pauses. \"...I don't actually know where I stand, honestly.\"",
            prompt: "That's usually the tell. In two or three sentences: think of a time avoiding a practice attempt didn't actually protect against anything - what happened instead?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the pattern to notice is whether the avoidance actually protected against something real, or just cost real preparation time and information."
          },
          remember: {
            prompt: "In a sentence or two: what does the pull to avoid a practice test or study session usually feel like for you, right as it shows up?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w2t4",
          title: "What preparing under real conditions can look like",
          role: "Contrast / boundary case",
          delayedRef: "w2t3_apply",
          delayedPrompt: "Last touch, you named this:",
          relate: {
            text: [
          "Here's what a similar situation can look like for someone who's found a different way through it.",
          "<b class='who'>Meenal</b> is preparing for the same competitive exam Karan is, under the same real stakes. But she's found a way to actually study and sit for practice tests without the anxiety taking over the process itself.",
          "This is the module's contrast case for this pattern: real exam stakes, still genuinely present - not the absence of pressure, but a different relationship to the fear of what a practice score might reveal."
]
          },
          think: {
            mode: "tap",
            prompt: "What actually makes Meenal's approach different from Karan's? Both face the same real exam stakes.",
            options: [
              opt("She treats practice tests as useful information about where she stands, rather than as a verdict on her entire future, which lets her actually sit for them regularly", true, "That's the real difference - not that the stakes are lower for her, but that she's separated \"useful diagnostic information\" from \"verdict on my future,\" which lets her actually use practice tests as intended."),
              opt("Her exam is simply less competitive or high-stakes than Karan's", false, "The scenario specifically says she's preparing for the same competitive exam under the same real stakes - the difference is in her relationship to practice testing, not the exam itself."),
              opt("She simply doesn't feel any anxiety about the exam", false, "The scenario doesn't say the pressure is absent for Meenal - it says she's found a way to study and test without the anxiety taking over, which is different from never feeling it at all.")
            ],
            whyPrompt: "In a few words - how might treating a practice score as information, rather than a verdict, change whether someone actually attempts it?",
          },
          apply: {
            scenario: "A fellow student asks Meenal how she brings herself to sit for practice tests regularly. She says: \"I stopped treating a bad practice score as proof my whole future was over. It's just information about where I am today - if it's bad, that tells me what to study next, that's it.\"",
            prompt: "In two or three sentences: think of your own next practice test or study session you've been avoiding - what would treating it as information, rather than a verdict, actually look like?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the useful pattern is noticing whether the answer separates \"information about today\" from \"verdict on the future.\""
          },
          remember: {
            prompt: "In a sentence or two: is there one specific practice attempt you've been avoiding that you could imagine sitting for this week?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w2t5",
          title: "What actually happened",
          role: "Reinforcing rep",
          delayedRef: "w2t4_apply",
          delayedPrompt: "Last touch, your idea was:",
          relate: {
            text: [
          "One more, and then a small piece of what actually happened with Karan.",
          "He finally sat one practice test, two weeks later than planned. The score wasn't his best, but it wasn't the catastrophe he'd been bracing for either - and for the first time, he had real information about exactly what to study next.",
          "That's not a coincidence, and it previews the tools coming in Week 6: the avoided practice test and the actual outcome were almost entirely disconnected from the feared version - which is usually the case, and actually attempting the avoided thing, as a real test, is what the coming tools are built around."
]
          },
          think: {
            mode: "tap",
            prompt: "What does the practice test result tell us about the two weeks of avoidance beforehand?",
            options: [
              opt("The avoided practice test and the feared catastrophic version were almost entirely disconnected, which suggests the avoidance was protecting against an untested fear rather than an actual likely outcome", true, "Right - the outcome and the fear didn't match at all. That gap is exactly what reveals the avoidance wasn't protecting against anything real."),
              opt("He got a lucky score this time, but the fear was still a reasonable one to have", false, "The scenario describes the practice test as giving him real, useful information rather than confirming a catastrophe - not a lucky outcome, but a normal, informative one."),
              opt("It doesn't really prove anything, since it was only one practice test", false, "One real, concrete attempt is still meaningful evidence against an untested fear - it's more real information than the two weeks of avoidance had produced.")
            ],
            whyPrompt: "In a few words - why might an avoided task and the feared catastrophic version be almost entirely disconnected, if the fear was never actually tested?",
          },
          apply: {
            scenario: "A different person, same shape of realisation: after avoiding a full-length mock test for weeks, Priya finally sits one and finds several weak areas - useful, specific information, not the confirmation of total failure she'd feared.",
            prompt: "In two or three sentences: what does that outcome tell Priya about the weeks of avoidance beforehand?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"The fear was real, but it wasn't actually tracking what would happen - the result was specific and useful, not a catastrophe, which suggests the avoidance was protecting against an untested fear, not a real likely outcome.\""
          },
          remember: {
            prompt: "In a sentence or two: is there a practice attempt or study session you've been avoiding that you could try this week, even imperfectly?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: exam stress, and how avoiding a feared practice test or study session usually protects against an imagined outcome rather than a real one. Next week: fear of failure itself, a related but distinct pattern."
    },
    // WEEK 3: Fear of failure: recognising the pattern
    {
      num: 3,
      title: "Fear of failure: recognising the pattern",
      mechanism: "C",
      kind: "blocked",
      retrievalCheck: null,
      touches: [
        {
          id: "w3t1",
          title: "Recognition - the outcome too big to look at directly",
          role: "Recognition #1",
          noDelayed: true,
          relate: {
            text: [
          "This week's pattern has a name: <b>fear of failure</b>. In simple terms: fear of disappointing yourself or others through failure - distinct from the anxiety about the evaluative moment itself.",
          "Here's what that looks like. <b class='who'>Divya</b> is attempting a competitive placement process. When asked what would actually happen if she didn't get the outcome she wants, she goes quiet - she's never actually let herself think it through; it's simply too large and too final to look at directly."
]
          },
          think: {
            mode: "tap",
            prompt: "What does never letting herself think through the failure scenario actually do?",
            options: [
              opt("Leaving the failure scenario unexamined lets it stay maximally vague and catastrophic in her mind, since it's never actually been sized up against real, specific detail", true, "Right - an unexamined fear tends to stay as large and undefined as possible; the scenario specifically shows she's never actually thought it through in specific terms."),
              opt("Not thinking about failure is simply a healthy way to stay positive and focused", false, "The scenario describes an inability to look at the scenario at all, driven by fear, which is different from a deliberate, healthy choice to stay focused on the positive."),
              opt("This suggests failure genuinely would be as catastrophic as it feels", false, "The scenario doesn't establish this - it shows the fear has never actually been examined against real, specific detail, which is exactly what the module's tools (C1) work with.")
            ],
            whyPrompt: "In a few words - why might an unexamined fear tend to stay bigger and vaguer than a fear that's actually been thought through?",
          },
          apply: {
            scenario: "Same pattern, a different person: Arjun refuses to even consider what he'd do if he didn't get into his top-choice program, saying it's \"not worth thinking about\" because it would be too devastating.",
            prompt: "Same thing happening here. In two or three sentences: what would you actually say to Arjun right now?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"Not letting yourself think it through might be exactly what's keeping it feeling unbearable - actually walking through what would realistically happen, in specific detail, often reveals it's more survivable than the unexamined version feels.\""
          },
          remember: {
            prompt: "In a sentence or two: think of a real outcome you've avoided thinking through because it felt too large or too final.",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w3t2",
          title: "Recognition - failure standing in for something bigger",
          role: "Recognition #2",
          delayedRef: "w3t1_apply",
          delayedPrompt: "Last touch, on Arjun, you wrote this:",
          relate: {
            text: [
          "A different angle on the same pattern with Divya. When pressed gently, it turns out the placement outcome isn't just about the job itself - it's carrying something bigger: whether she's actually as capable as people around her seem to believe.",
          "The fear of failure here isn't really about the placement process alone; it's standing in for a much larger question about her own competence."
]
          },
          think: {
            mode: "tap",
            prompt: "What does the placement outcome actually seem to represent for Divya?",
            options: [
              opt("The specific outcome has become a stand-in for a much larger, unresolved question about her own competence, which makes the stakes of this one event feel disproportionately large", true, "Right - the scenario specifically shows the fear isn't really about the placement process itself, but about a bigger, unresolved question the outcome has come to represent."),
              opt("The placement outcome genuinely is that important to her actual career", false, "The scenario points to something bigger than the placement itself being at stake - a question about her own competence - not simply the objective importance of this one process."),
              opt("This doesn't really change anything about how she should approach the placement process", false, "Recognising that a feared outcome is standing in for something bigger is exactly what the module's decatastrophizing and strengths-based tools (C1, C2) are built to work with - it changes what's actually being worked through.")
            ],
            whyPrompt: "In a few words - why might a specific feared outcome sometimes be standing in for a bigger, separate question?",
          },
          apply: {
            scenario: "A colleague mentions that not getting a promotion this cycle would feel like proof they were never actually good enough to be in the role in the first place.",
            prompt: "In two or three sentences: what bigger question does this feared outcome seem to be standing in for, and how might naming that help?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether a specific, bigger underlying question was named (not just \"they're anxious\"), and whether naming it was described as separating the two, not treating the outcome as literal proof of the bigger question."
          },
          remember: {
            prompt: "In a sentence or two: is there a specific feared outcome in your life that might be standing in for something bigger than the outcome itself?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w3t3",
          title: "What treating failure as unthinkable is actually costing",
          role: "Functional logic",
          delayedRef: "w3t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Between the unexamined fear and the bigger question it's standing in for, there's a pattern worth naming honestly: refusing to think through failure can feel like protecting yourself from something unbearable.",
          "What it actually costs is different: without ever sizing up the actual likelihood and survivability of failure, Divya carries the full, undefined weight of it through the entire placement process - present in every part of it, never actually examined."
]
          },
          think: {
            mode: "tap",
            prompt: "What is refusing to think through failure actually doing here? These are close - think it through.",
            options: [
              opt("Feeling like protection from something unbearable, while actually meaning the full, undefined weight of the fear is carried through the entire process, unexamined and unreduced", true, "Right - that's the real trade. Avoiding the thought feels protective, but it means the fear never gets sized down to something more specific and survivable - it just stays present, full-strength, throughout."),
              opt("A genuinely healthy way to stay focused on succeeding rather than dwelling on failure", false, "The scenario describes an inability to examine the outcome at all, driven by fear, rather than a deliberate, healthy choice to redirect focus toward success."),
              opt("Evidence that failure in this case really would be unbearable", false, "The scenario doesn't establish this - it shows an unexamined fear carried at full strength, which the module's decatastrophizing tool (C1) is specifically built to test against real detail.")
            ],
            whyPrompt: "In a few words - why might refusing to examine a feared outcome mean carrying its full weight for longer, rather than less?",
          },
          apply: {
            scenario: "A friend, watching someone carry visible dread through an entire months-long process without ever discussing what failure would actually mean, asks: \"Has avoiding thinking about it made the waiting feel any lighter?\" The person pauses. \"...No, actually heavier, if anything.\"",
            prompt: "That's usually the tell. In two or three sentences: think of a time avoiding thinking through a feared outcome made the waiting period feel heavier, not lighter - what happened?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the pattern to notice is whether avoiding the thought actually made the fear lighter, or just left it unexamined and full-strength for longer."
          },
          remember: {
            prompt: "In a sentence or two: what does the pull to avoid thinking through a feared failure usually feel like for you, right as it shows up?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w3t4",
          title: "What actually sizing up failure can look like",
          role: "Contrast / boundary case",
          delayedRef: "w3t3_apply",
          delayedPrompt: "Last touch, you named this:",
          relate: {
            text: [
          "Here's what a similar situation can look like for someone who's found a different way through it.",
          "<b class='who'>Rahul</b> is attempting the same competitive placement process Divya is, with the same real risk of not getting the outcome he wants. But he's found a way to actually think through what failure would really mean, rather than treating it as unthinkable.",
          "This is the module's contrast case for this pattern: real risk of failure, still genuinely present - not the absence of stakes, but a different relationship to actually examining what failure would mean."
]
          },
          think: {
            mode: "tap",
            prompt: "What actually makes Rahul's approach different from Divya's? Both face the same real risk of failure.",
            options: [
              opt("He's actually sized up what failure would realistically mean and how survivable it would be, rather than leaving it as an unexamined, maximally catastrophic possibility", true, "That's the real difference - not that the risk is lower for him, but that he's done the work of actually examining the feared outcome instead of leaving it unexamined and maximally large."),
              opt("His placement process carries genuinely lower stakes than Divya's", false, "The scenario specifically says he's attempting the same competitive placement process with the same real risk - the difference is in his relationship to examining failure, not the stakes themselves."),
              opt("He simply doesn't care whether he succeeds or fails", false, "The scenario doesn't say the stakes don't matter to Rahul - it says he's thought through what failure would mean, which is different from not caring about the outcome at all.")
            ],
            whyPrompt: "In a few words - how might actually sizing up a feared outcome change how heavy it feels to carry?",
          },
          apply: {
            scenario: "A colleague asks Rahul how he stays relatively steady through such a high-stakes process. He says: \"I actually sat down and thought through what not getting it would really mean - it would be genuinely disappointing, but I could see specifically what I'd do next. It stopped being this unthinkable, formless thing.\"",
            prompt: "In two or three sentences: think of your own feared failure - what would actually sizing it up, in specific detail, look like for you?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the useful pattern is noticing whether the answer moves toward specific, real detail rather than staying at the level of a vague, unexamined fear."
          },
          remember: {
            prompt: "In a sentence or two: is there one feared failure you could imagine actually sizing up, on purpose, rather than continuing to avoid?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w3t5",
          title: "What actually happened",
          role: "Reinforcing rep",
          delayedRef: "w3t4_apply",
          delayedPrompt: "Last touch, your idea was:",
          relate: {
            text: [
          "One more, and then a small piece of what actually happened with Divya.",
          "She finally let herself think it through, out loud, with a friend: what would actually happen if the placement didn't come through. The answer, once she said it out loud, was specific and survivable - disappointing, real, but nothing like the formless dread she'd been carrying.",
          "That's not a coincidence, and it previews the tools coming in Week 7: the unexamined fear and the actual, thought-through version were almost entirely different in size - which is usually the case, and actually sizing up the feared outcome directly is what the coming tools are built around."
]
          },
          think: {
            mode: "tap",
            prompt: "What does the specific, survivable version tell us about the formless dread she'd been carrying?",
            options: [
              opt("The unexamined, formless version was significantly larger and more catastrophic than the actual, specific version once she thought it through, suggesting the size of the fear had never actually been tested", true, "Right - the two versions were genuinely different in size. That gap is exactly what reveals the original dread was running unexamined, not tracking the real, specific shape of the outcome."),
              opt("She got lucky that the outcome sounded manageable once she said it out loud", false, "The scenario describes decatastrophizing as a consistent pattern the module's examples show, not a one-time lucky reframe."),
              opt("It doesn't really change anything, since the placement outcome still hasn't actually happened yet", false, "Sizing up a feared outcome in advance is itself meaningful - it changes how the waiting period feels and how prepared she is, regardless of when the actual outcome arrives.")
            ],
            whyPrompt: "In a few words - why might an unexamined fear be significantly larger than the same fear once it's actually been thought through in detail?",
          },
          apply: {
            scenario: "A different person, same shape of realisation: after finally writing out what would happen if a business venture failed, Neha finds a specific, if disappointing, path forward - nothing like the vague sense of total ruin she'd been carrying.",
            prompt: "In two or three sentences: what does that specific, written-out version tell Neha about the vague dread she'd been carrying?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"The dread was real, but it wasn't actually the size it felt like - once written out specifically, it turned into something disappointing but survivable, which suggests the original fear had never actually been examined at that level of detail.\""
          },
          remember: {
            prompt: "In a sentence or two: is there a feared outcome you could try actually writing out or saying aloud this week, in specific detail?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: fear of failure, and how an unexamined feared outcome tends to stay far larger than the same outcome once it's actually been sized up in detail. Next week: imposter syndrome, a related but distinct pattern."
    },
    // WEEK 4: Imposter syndrome: recognising the pattern
    {
      num: 4,
      title: "Imposter syndrome: recognising the pattern",
      mechanism: "D",
      kind: "blocked",
      retrievalCheck: null,
      touches: [
        {
          id: "w4t1",
          title: "Recognition - competence explained away",
          role: "Recognition #1",
          noDelayed: true,
          relate: {
            text: [
          "This week's pattern has a name: <b>imposter syndrome</b>. In simple terms: a persistent feeling of being a fraud despite real, concrete evidence of competence - common after a significant achievement, not despite one.",
          "Here's what that looks like. <b class='who'>Farhan</b>, a first-generation professional, just joined a prestigious company after a genuinely competitive process. Instead of feeling capable, he's convinced there's been some mistake - that he was hired due to luck, or because the interview panel was fooled, rather than because of anything he actually brings."
]
          },
          think: {
            mode: "tap",
            prompt: "What's actually happening with how Farhan is explaining his own hiring?",
            options: [
              opt("Real evidence of his competence - passing a genuinely competitive process - is being explained away as luck or being fooled, rather than being accepted as evidence of actual ability", true, "Right - the scenario specifically describes a genuinely competitive process he passed; the fraud belief survives by attributing that real evidence to luck or deception instead."),
              opt("He probably really was hired due to a mistake or oversight", false, "The scenario specifically describes a genuinely competitive hiring process - nothing suggests an actual mistake, only Farhan's own explanation discounting his real qualification."),
              opt("This is simply appropriate humility about a new role", false, "Humility acknowledges real accomplishment while staying grounded; this pattern actively explains away the accomplishment itself, which is a different and more corrosive thing.")
            ],
            whyPrompt: "In a few words - what's the giveaway that this is explaining away real evidence, not humility?",
          },
          apply: {
            scenario: "Same pattern, a different person: after being promoted to lead a major project, Aisha is convinced her manager simply didn't have anyone else available, rather than believing she was actually the right person for it.",
            prompt: "Same thing happening here. In two or three sentences: what would you actually say to Aisha right now?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"'No one else was available' explains away real evidence - a manager choosing you specifically for a major project is a genuine signal about your ability, not a coincidence that needs explaining away.\""
          },
          remember: {
            prompt: "In a sentence or two: think of a real accomplishment of yours that you've explained away as luck, timing, or other people being fooled.",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w4t2",
          title: "Recognition - a harsher standard than you'd set for anyone else",
          role: "Recognition #2",
          delayedRef: "w4t1_apply",
          delayedPrompt: "Last touch, on Aisha, you wrote this:",
          relate: {
            text: [
          "A different angle on the same pattern with Farhan. When a close friend, also a first-generation professional in an unfamiliar environment, describes feeling completely out of their depth, Farhan immediately reassures them: \"Of course it feels that way at first, everyone does, you'll find your footing.\"",
          "He would never say that same harsh, dismissive thing to his friend that he says to himself daily."
]
          },
          think: {
            mode: "tap",
            prompt: "What does the gap between how Farhan treats his friend and how he treats himself actually reveal?",
            options: [
              opt("He already has genuinely fair, understanding standards for someone in this exact situation - he's just not applying them to himself, which is a specific, addressable gap rather than a fixed personality trait", true, "Right - the fair, reasonable standard already exists; the scenario shows he applies it easily to a friend. The gap is specifically in applying that same fairness to himself."),
              opt("He's simply being more honest with himself than he is with his friend", false, "The scenario doesn't suggest his self-directed harshness is more accurate - it shows a double standard, not a more truthful self-assessment."),
              opt("His friend's situation is genuinely different enough that the comparison doesn't hold", false, "The scenario specifically describes his friend's situation as the exact same kind of experience - feeling out of depth as a first-generation professional in an unfamiliar environment.")
            ],
            whyPrompt: "In a few words - why might someone already have fair standards for others, but not apply them to themselves?",
          },
          apply: {
            scenario: "Someone reassures a colleague going through the same rocky first few months they had, telling them it's completely normal - while privately still believing their own rocky start meant they were never actually qualified.",
            prompt: "In two or three sentences: what would applying their own advice to themselves actually sound like?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the self-directed version is genuinely as understanding as the version offered to the colleague, not a softened version of the same harsh judgment."
          },
          remember: {
            prompt: "In a sentence or two: is there a standard you apply easily to other people but not to yourself, in a similar situation?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w4t3",
          title: "What discounting your own competence is actually costing",
          role: "Functional logic",
          delayedRef: "w4t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Between explaining away his hiring and holding himself to a harsher standard than he'd hold anyone else to, there's a pattern worth naming honestly: staying alert to the possibility of being \"found out\" can feel like appropriate caution - not getting complacent, staying sharp.",
          "What it actually costs is different: Farhan spends real energy, daily, bracing for exposure that isn't coming, rather than actually settling into a role he genuinely earned - the vigilance doesn't protect him from anything real, it just makes an already-difficult transition harder."
]
          },
          think: {
            mode: "tap",
            prompt: "What is staying alert to being \"found out\" actually doing here? These are close - think it through.",
            options: [
              opt("Feeling like protective vigilance against exposure, while actually costing real daily energy that could go toward genuinely settling into a role he actually earned", true, "Right - that's the real trade. The vigilance feels protective, but there's no real exposure coming; it's just draining energy that could otherwise go toward actually adjusting to the role."),
              opt("A genuinely useful way to stay motivated and avoid complacency", false, "The scenario doesn't describe healthy motivation - it describes bracing for an exposure that isn't coming, which is a different and more costly thing than ordinary motivation to do well."),
              opt("Evidence that he actually is under-qualified and should stay alert", false, "The scenario establishes a genuinely competitive hiring process as real evidence of his qualification - the alertness isn't responding to an actual gap, it's responding to an unexamined fraud belief.")
            ],
            whyPrompt: "In a few words - why might vigilance against an exposure that isn't actually coming still feel necessary?",
          },
          apply: {
            scenario: "A colleague, watching someone constantly double- and triple-check work well beyond what the role requires, asks: \"Has all this extra checking actually caught something the other checks would have missed, or has it just meant more stress for the same outcome?\" The person pauses. \"...Just more stress, honestly.\"",
            prompt: "That's usually the tell. In two or three sentences: think of a time staying alert for exposure didn't actually protect against anything real - what happened instead?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the pattern to notice is whether the vigilance actually protected against something real, or just cost real energy without a corresponding benefit."
          },
          remember: {
            prompt: "In a sentence or two: what does the feeling of bracing for exposure usually feel like for you, right as it shows up?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w4t4",
          title: "What holding your own competence as real can look like",
          role: "Contrast / boundary case",
          delayedRef: "w4t3_apply",
          delayedPrompt: "Last touch, you named this:",
          relate: {
            text: [
          "Here's what a similar situation can look like for someone who's found a different way through it.",
          "<b class='who'>Sneha</b> joined the same competitive company Farhan did, as a first-generation professional facing the same unfamiliar environment. But she's found a way to actually hold her own competence as real, rather than dismissing it as luck.",
          "This is the module's contrast case for this pattern: real unfamiliarity, still genuinely present - not the absence of feeling out of place sometimes, but a different relationship to the evidence of her own competence."
]
          },
          think: {
            mode: "tap",
            prompt: "What actually makes Sneha's approach different from Farhan's? Both face the same real unfamiliarity.",
            options: [
              opt("She holds the real evidence of her competence - a genuinely competitive hiring process - as actually meaningful, rather than explaining it away as luck or a mistake", true, "That's the real difference - not that the environment feels less unfamiliar to her, but that she treats the evidence of her own competence as real, rather than discounting it."),
              opt("Her hiring process was genuinely less competitive than Farhan's", false, "The scenario specifically says she joined the same competitive company under the same real process - the difference is in how she holds the evidence, not in the process itself."),
              opt("She simply never feels out of place in the new environment", false, "The scenario doesn't say the unfamiliarity is absent for Sneha - it says she holds her competence as real despite it, which is different from never feeling out of place at all.")
            ],
            whyPrompt: "In a few words - how might treating real evidence of competence as actually meaningful change how the unfamiliar environment feels?",
          },
          apply: {
            scenario: "A colleague asks Sneha how she stays grounded in a genuinely unfamiliar environment. She says: \"I stopped explaining away why I'm actually here. The process was real and competitive, and I earned my spot in it - the environment still feels new sometimes, but that doesn't erase the evidence.\"",
            prompt: "In two or three sentences: think of your own real evidence of competence that you might have been explaining away - what would holding it as real actually look like?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the useful pattern is noticing whether the answer actually holds a piece of real evidence as meaningful, rather than immediately re-explaining it away."
          },
          remember: {
            prompt: "In a sentence or two: is there one specific piece of evidence of your own competence you could imagine actually holding as real, rather than explaining away?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w4t5",
          title: "What actually happened",
          role: "Reinforcing rep",
          delayedRef: "w4t4_apply",
          delayedPrompt: "Last touch, your idea was:",
          relate: {
            text: [
          "One more, and then a small piece of what actually happened with Farhan.",
          "Three months in, a senior colleague specifically praised a piece of his work, unprompted, in front of the wider team. His first instinct was to explain it away - but for the first time, he let himself just sit with it as real for a moment, without immediately discounting it.",
          "That's not a coincidence, and it previews the tools coming in Week 8: the impulse to discount real evidence and the actual, accumulating record of his competence were pulling in opposite directions - which is usually the case, and actually building and holding onto that record is what the coming tools are built around."
]
          },
          think: {
            mode: "tap",
            prompt: "What does letting the praise sit as real, even briefly, tell us about the usual instinct to discount it?",
            options: [
              opt("The usual instinct to immediately discount praise or evidence is a habitual response, not an accurate read of the situation, since letting it sit as real for once didn't reveal anything false about it", true, "Right - nothing changed about the evidence itself; what changed was letting it be held as real instead of immediately explaining it away, which suggests the discounting habit isn't tracking accuracy."),
              opt("The praise was probably just polite and not really meant seriously", false, "The scenario describes specific, unprompted praise in front of the wider team - nothing suggests it wasn't genuine, only that Farhan's habitual instinct was to discount it."),
              opt("It doesn't really matter whether he holds onto it, since one piece of praise won't change the underlying pattern", false, "A single instance of holding evidence as real is exactly the kind of small, real rep the module's evidence-log tool (D1) is built to accumulate over time.")
            ],
            whyPrompt: "In a few words - why might habitually discounting evidence not actually be an accurate read of the situation?",
          },
          apply: {
            scenario: "A different person, same shape of realisation: after a client specifically requests to work with them again by name, Rohit's first instinct is to assume it was a fluke - but he pauses and considers what it would mean to actually hold that as real evidence of his work.",
            prompt: "In two or three sentences: what does that specific, repeated request tell Rohit about the fluke explanation he's been reaching for?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"A client specifically asking for him again by name is real, repeated evidence - harder to explain away as a one-time fluke, which suggests the discounting instinct isn't actually tracking what's true.\""
          },
          remember: {
            prompt: "In a sentence or two: is there a specific piece of evidence of your own competence you could try holding onto, without immediately discounting it, this week?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: imposter syndrome, and how real evidence of competence often gets explained away rather than held as real. Next week: the tools for performance pressure."
    },
    // WEEK 5: Performance pressure: the tools
    {
      num: 5,
      title: "Performance pressure: the tools",
      mechanism: "A",
      kind: "technique",
      retrievalCheck: {
        "prompt1": "In your own words, without looking back: what was the actual pattern driving Aditi's three weeks of dread before her appraisal in Week 1 - not the dread itself, but what was underneath it?",
        "prompt2": "And separately, in your own words: what made Karan's avoidance of practice tests in Week 2 keep going, even as his exam date got closer?",
        "reveal": "Performance pressure (Week 1): an unexamined, catastrophic prediction about the appraisal - not actual evidence from the past year - was driving the three weeks of dread, and the rehearsal itself never improved the real preparation. Exam stress (Week 2): the avoidance kept going because never actually sitting a practice test meant the underlying fear about the result was never tested, which is exactly what avoidance protects."
},
      touches: [
        {
          id: "w5t1",
          title: "Tool - testing the prediction against the evidence",
          role: "Technique #1 - Cognitive Restructuring",
          delayedRef: "w4t5_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Time for the first tool for performance pressure: <b>cognitive restructuring of catastrophic appraisal-related predictions</b> (Aaron Beck). The idea: write down the specific catastrophic prediction about an upcoming evaluation, then test it against real, specific evidence from past evaluative moments.",
          "<b class='who'>Aditi</b> tries it before her next quarterly check-in. She writes the prediction word for word: \"my manager will list every shortcoming and question whether I should keep my role.\" Then she lists what's actually happened in her last four check-ins. None resembled that prediction even slightly."
]
          },
          think: {
            mode: "tap",
            prompt: "Why does writing the prediction down, word for word, matter here - rather than just noticing a general feeling of dread?",
            options: [
              opt("A specific, written prediction can actually be tested against real evidence from past evaluations, while a vague feeling of dread can't be checked against anything concrete", true, "Right - \"my manager will question whether I should keep my role\" is specific enough to check against four real past check-ins; \"I feel dread\" isn't specific enough to test against anything."),
              opt("Writing it down mostly just helps her remember the fear more clearly later", false, "The point isn't memory - it's that a specific, written prediction becomes something that can actually be checked against real evidence, which a vague feeling can't."),
              opt("It doesn't really matter how specific the prediction is, as long as she's aware of feeling anxious", false, "Vague anxiety can't be tested against evidence the way a specific, falsifiable prediction can - the specificity is exactly what makes the technique work.")
            ],
            whyPrompt: "In a few words - why does a specific, written prediction hold up to testing in a way a vague feeling doesn't?",
          },
          apply: {
            scenario: "Try the same tool. Think of a real upcoming or recent evaluative moment. Write down the specific catastrophic prediction underneath your nerves about it, then think honestly about what your actual past evidence shows.",
            prompt: "In two or three sentences: what was the specific prediction, and what does the real evidence actually show?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the prediction was written specifically enough to actually be checked against real past evidence, not just restated as a general feeling."
          },
          remember: {
            prompt: "In a sentence or two: does naming the specific prediction, rather than just the general dread, change how likely it feels?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w5t2",
          title: "Tool - holding the rule a little more loosely",
          role: "Technique #2 - ACT Defusion",
          delayedRef: "w5t1_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Second tool: <b>defusion from 'must perform perfectly' thoughts</b> (Steven Hayes, ACT). The idea: notice the rigid rule driving the pressure, and deliberately rephrase it as a passing thought rather than a binding fact - \"I'm having the thought that I must perform perfectly\" instead of simply \"I must perform perfectly.\"",
          "Aditi tries it on the rule she named in Week 1. Saying \"I'm having the thought that I must perform perfectly, every time, or something is fundamentally wrong with me\" out loud feels almost absurd once it's stated in full - which is part of the point."
]
          },
          think: {
            mode: "tap",
            prompt: "Why might rephrasing the rule this way, rather than arguing against it directly, actually help?",
            options: [
              opt("Defusion doesn't need to win an argument with the thought - it changes the relationship to it by naming it as a mental event, which alone can loosen its grip", true, "Right - defusion works by changing how the thought is held, not by proving it false; naming it as \"a thought I'm having\" rather than a fact is often enough to loosen its automatic grip."),
              opt("It works because saying the rule out loud proves it's definitely false", false, "Defusion doesn't claim the thought is false - it changes the relationship to the thought, whether or not the content itself is ever directly argued with."),
              opt("This technique mainly works as a distraction from the underlying pressure", false, "Defusion isn't a distraction technique - it directly targets how tightly a rigid thought is held, which is a different mechanism than distraction.")
            ],
            whyPrompt: "In a few words - why might naming a thought as \"a thought I'm having\" loosen its grip, without needing to prove it false?",
          },
          apply: {
            scenario: "Try it yourself. Take the performance-related rule you named in Week 1, and rephrase it as \"I'm having the thought that...\" - say or write the full version.",
            prompt: "In two or three sentences: what was the rule, and did rephrasing it this way change how it felt to hold?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the full defused version was actually written or said, not just described in the abstract."
          },
          remember: {
            prompt: "In a sentence or two: where do you think this kind of quick defusion would actually be useful for you, in a real moment?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w5t3",
          title: "Tool - rehearsing the feared moment on purpose",
          role: "Technique #3 - Exposure-Based Rehearsal",
          delayedRef: "w5t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          guardrail: true,
          distressPrompt: "You just deliberately rehearsed a feared evaluative moment. How are you feeling about it right now?",
          relate: {
            text: [
          "Third tool: <b>exposure-based rehearsal of the feared evaluative situation</b> (Joseph Wolpe's systematic desensitization). The idea: deliberately rehearse the feared appraisal conversation itself, in as much realistic detail as you're ready for, to reduce the anxiety response through direct, repeated exposure rather than avoidance.",
          "This is a real exposure exercise, not just a reading exercise - so, like every guardrailed touch in this module, it checks in with you partway through. Choose the intensity you're actually ready for; there's no wrong size here.",
          "<b class='who'>Aditi</b> chooses a smaller version first: writing out, in full, what she imagines her manager saying - and then reading it back to herself once, out loud."
]
          },
          think: {
            mode: "tap",
            prompt: "Why does the rehearsal need to happen in real, deliberate detail, rather than just briefly acknowledging the fear exists?",
            options: [
              opt("The anxiety response to the feared scenario stays intact as long as it's avoided even mentally - deliberately rehearsing it in detail is what actually reduces the response through repeated exposure", true, "Right - systematic desensitization specifically works through direct, repeated exposure to the feared scenario; briefly acknowledging a fear without actually engaging with it doesn't produce the same reduction in the anxiety response."),
              opt("Briefly acknowledging the fear exists would work just as well as detailed rehearsal", false, "The mechanism here specifically requires engaging with the feared scenario in real detail - brief acknowledgment without engagement doesn't produce the same exposure effect."),
              opt("The amount of detail doesn't matter, as long as she knows the exposure exercise happened", false, "The realistic detail is what makes it actual exposure to the feared scenario, rather than a vague gesture toward it - the detail is the mechanism, not incidental to it.")
            ],
            whyPrompt: "In a few words - why does the anxiety response tend to stay intact until the feared scenario is actually, deliberately rehearsed?",
          },
          apply: {
            scenario: "Try scheduling your own version of this: rehearsing a real feared evaluative conversation in as much detail as you're ready for right now.",
            intensityPrompt: "Choose the version you're actually ready to try:",
            intensityOptions: [
          "Smaller version - write out the feared conversation once, privately",
          "Bigger version - write it out and read it aloud, or rehearse it with a trusted person"
],
            prompt: "In two or three sentences: what feared evaluative moment did you rehearse, and what did you notice while doing it?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the rehearsal engaged with real, specific detail of the feared scenario, rather than staying at the level of a general acknowledgment."
          },
          remember: {
            prompt: "In a sentence or two: did anything about the feared scenario feel different once you'd actually rehearsed it, compared to just thinking about it in passing?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w5t4",
          title: "Tool - bringing the body down before the moment",
          role: "Technique #4 - Pre-Performance Applied Relaxation",
          delayedRef: "w5t3_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Fourth tool: <b>a pre-performance applied-relaxation routine</b> (Lars-Goran Ost). The idea: a short, structured relaxation routine practiced specifically in the minutes before a performance-pressure situation, to bring physical arousal down before walking in.",
          "Aditi practices a short version - three slow, controlled breaths and a deliberate drop of her shoulders - a few times in the days before her appraisal, so it's already familiar by the time she actually needs it in the waiting room outside her manager's office."
]
          },
          think: {
            mode: "tap",
            prompt: "Why does the routine need to be practiced in advance, rather than only attempted for the first time right before the real moment?",
            options: [
              opt("A routine that's already familiar is far more reliable under real, in-the-moment pressure than one being attempted for the very first time, when arousal is already high", true, "Right - practicing the routine ahead of time, in calmer moments, is what makes it something that can actually be relied on when arousal is genuinely high right before the real situation."),
              opt("Practicing it in advance doesn't really matter, since any relaxation routine will work equally well the first time", false, "A routine attempted for the first time under real, high-arousal pressure is far less reliable than one that's already familiar from prior, calmer practice."),
              opt("The main benefit of advance practice is simply passing the time before the appraisal", false, "Advance practice isn't about passing time - it's specifically about making the routine familiar and reliable enough to actually use effectively under real pressure.")
            ],
            whyPrompt: "In a few words - why might a relaxation routine practiced in advance work more reliably than one tried for the first time under real pressure?",
          },
          apply: {
            scenario: "Try building your own short version now: pick a simple routine (breathing, a physical release, or something else) you could practice ahead of a real performance-pressure moment.",
            prompt: "In two or three sentences: what's the routine, and when could you practice it a few times before you'd actually need it?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the plan includes practicing the routine ahead of time, not just intending to use it for the first time in the actual moment."
          },
          remember: {
            prompt: "In a sentence or two: which of these four tools - the prediction, the rule, the rehearsal, or the routine - feels most useful for your own performance pressure right now?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w5t5",
          title: "Check-in and pre-commitment - performance pressure",
          role: "Check-in & pre-commitment",
          delayedRef: "w5t4_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Four tools for performance pressure, now covered: testing the catastrophic prediction (A1), defusing the rigid rule (A2), rehearsing the feared moment directly (A3), and a pre-performance relaxation routine (A4).",
          "They target different parts of the same pattern - a prediction, a rule, an avoidance, and a body - not four versions of the same fix. Most people find one or two land more than the others, and that's expected."
]
          },
          think: {
            mode: "open",
            prompt: "Looking back at all four - which one, honestly, do you think you'd actually reach for first, before a real evaluative moment? No wrong answer here.",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Pick the one tool from this week you're most likely to actually use again, on your own, before the module comes back to it in the reinforcement bank.",
            prompt: "In two or three sentences: which tool, and what's one specific, real upcoming moment where you could try it?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the plan names a specific, real upcoming moment, not a general intention to 'try to use it sometime.'"
          },
          remember: {
            prompt: "In a sentence or two: what would make you actually forget to try it, and is there anything that could help you remember?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: four tools for performance pressure - cognitive restructuring, ACT defusion, exposure-based rehearsal, and a pre-performance relaxation routine. Next week: exam stress, and its own set of tools."
    },
    // WEEK 6: Exam stress: the tools
    {
      num: 6,
      title: "Exam stress: the tools",
      mechanism: "B",
      kind: "technique",
      retrievalCheck: null,
      touches: [
        {
          id: "w6t1",
          title: "Tool - actually attempting the avoided thing",
          role: "Technique #1 - Structured Behavioural Experiment",
          delayedRef: "w5t5_apply",
          delayedPrompt: "Last touch, your plan was:",
          guardrail: true,
          distressPrompt: "You just committed to a real attempt at something you'd been avoiding. How are you feeling about it right now?",
          relate: {
            text: [
          "First tool for exam stress: <b>structured study/exam behavioural experiments to test avoidance-driven predictions</b> (Beck-style CBT). The idea: deliberately run the real study session or practice test that's been avoided, as a structured experiment to test what the anxiety has actually been predicting.",
          "This is a real experiment, not just a reading exercise - so, like every guardrailed touch in this module, it checks in with you partway through. Choose the version you're actually ready to try.",
          "<b class='who'>Karan</b> chooses a smaller version first: a single, shorter practice section rather than a full-length test, with a plan to look honestly at the result afterward instead of avoiding it."
]
          },
          think: {
            mode: "tap",
            prompt: "Why does the experiment need to be a real, structured attempt, rather than just deciding to feel less anxious about studying?",
            options: [
              opt("The prediction behind the avoidance is untested precisely because the real attempt has never actually happened - only a real, structured attempt produces real evidence about what actually happens", true, "Right - deciding to feel less anxious doesn't test anything; the entire point of a behavioural experiment is that only a genuinely attempted study session or practice test produces real evidence about the feared outcome."),
              opt("Simply deciding to feel less anxious would work just as well as an actual structured attempt", false, "The point isn't managing the feeling directly - it's producing real evidence by actually doing the avoided thing, which only a real attempt can provide."),
              opt("The specific size of the attempt doesn't matter, as long as he thinks about studying more", false, "The size matters because it's what actually gets tested - a genuinely attempted section of a specific size produces real evidence about that specific attempt, which just thinking about studying doesn't.")
            ],
            whyPrompt: "In a few words - why does only a real, structured attempt count as actual evidence, rather than simply intending to feel less anxious?",
          },
          apply: {
            scenario: "Now try scheduling a real version of this for yourself - a specific study session or practice attempt you've genuinely been avoiding.",
            intensityPrompt: "Choose the version you're actually ready to try:",
            intensityOptions: [
          "Smaller version - a short section or a single topic, timed loosely",
          "Bigger version - a full practice test under real conditions"
],
            prompt: "In two or three sentences: when specifically will you try this, and what's the feared outcome you expect to test?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether a specific time and a specific feared outcome were both named, which is what makes it an actual, testable experiment rather than a vague intention."
          },
          remember: {
            prompt: "In a sentence or two: what do you honestly expect the result to show - and what would it mean if it didn't match that expectation?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w6t2",
          title: "Tool - a routine already familiar by exam day",
          role: "Technique #2 - Applied Relaxation for Exams",
          delayedRef: "w6t1_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Second tool: <b>applied relaxation practised ahead of high-stakes exams</b> (Lars-Goran Ost's Applied Relaxation protocol). The idea: the same structured relaxation approach as Week 5's routine, but practiced repeatedly in the specific days before a high-stakes exam, so it's genuinely familiar by the time the real exam arrives.",
          "Karan starts practicing a short breathing-and-shoulder-drop routine every evening in the two weeks before his exam - not waiting to improvise something on the actual day."
]
          },
          think: {
            mode: "tap",
            prompt: "Why does this need repeated practice specifically in the days before the exam, rather than just knowing the routine exists?",
            options: [
              opt("A routine only becomes reliable under real exam-day pressure once it's been practiced repeatedly beforehand - simply knowing it exists doesn't make it usable when arousal is high", true, "Right - repeated practice in the run-up to the exam is what turns a known technique into something genuinely usable under real pressure on the day itself."),
              opt("Repeated practice beforehand doesn't add anything beyond knowing the routine exists", false, "Knowing about a relaxation technique is different from having practiced it enough times to reliably use it under real, high-pressure exam conditions."),
              opt("The main purpose of practicing ahead of time is to fill study time productively", false, "The purpose is specifically building reliability under pressure, not simply occupying study time - it's a distinct kind of preparation from content review.")
            ],
            whyPrompt: "In a few words - why might repeated practice before the exam matter more than simply knowing a relaxation technique exists?",
          },
          apply: {
            scenario: "Try building your own short routine and a specific practice schedule for the days before your next real high-stakes moment, exam or otherwise.",
            prompt: "In two or three sentences: what's the routine, and how many times could you realistically practice it before you'd need it?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether a realistic number of practice repetitions was named, not just an intention to use the routine once, on the day itself."
          },
          remember: {
            prompt: "In a sentence or two: what usually gets in the way of actually practicing a routine like this ahead of time, rather than only on the day itself?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w6t3",
          title: "Tool - loosening the belief that one exam is everything",
          role: "Technique #3 - Cognitive Restructuring + Defusion",
          delayedRef: "w6t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Third tool: <b>cognitive restructuring of 'one exam defines my future' fused beliefs</b> (Aaron Beck, paired with Steven Hayes's defusion work). The idea: examine the belief that this exam determines the whole of your future, test it against real counter-evidence, and practice holding it more lightly.",
          "Karan lists people he knows who didn't get the result they wanted on a first attempt, and traces what actually happened to their lives afterward - none matches the totalizing \"nothing else will matter\" prediction."
]
          },
          think: {
            mode: "tap",
            prompt: "Why does looking at real people who didn't get their first-choice result actually help here, rather than just trying to feel less anxious about the belief?",
            options: [
              opt("Real, concrete counter-examples directly test whether the belief 'this exam is my entire future' is actually true, which simply managing the anxious feeling wouldn't do", true, "Right - the belief itself needs to be tested against real evidence, and real counter-examples are exactly that kind of evidence, distinct from just trying to feel calmer about the same untested belief."),
              opt("It mainly works as a distraction from thinking about the exam itself", false, "This isn't a distraction technique - it directly tests the specific fused belief against real evidence, which is a cognitive-restructuring mechanism, not a distraction from the topic."),
              opt("This step doesn't really add anything if the person already knows the exam matters", false, "Knowing an exam matters is different from believing it defines your entire future - the technique specifically targets that inflated, fused version of the belief.")
            ],
            whyPrompt: "In a few words - why might real counter-examples do something that simply trying to feel less anxious about a belief doesn't?",
          },
          apply: {
            scenario: "Try it yourself. Think of an exam or result you've been treating as defining your future, and list any real people you know (or know of) who didn't get their first-choice result and what actually happened next for them.",
            prompt: "In two or three sentences: who did you think of, and what does their actual outcome suggest about the 'this defines everything' belief?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether a real, specific counter-example was named, rather than a general reassurance that things usually work out."
          },
          remember: {
            prompt: "In a sentence or two: does the belief feel any different to hold, now that you've tested it against a real example?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w6t4",
          title: "Tool - sitting with the clock itself",
          role: "Technique #4 - Timed Exposure Rehearsal",
          delayedRef: "w6t3_apply",
          delayedPrompt: "Last touch, you wrote this:",
          guardrail: true,
          distressPrompt: "You just committed to a real timed practice attempt. How are you feeling about it right now?",
          relate: {
            text: [
          "Fourth tool: <b>timed test-taking exposure rehearsal</b>. The idea: sit a full practice test under genuinely timed conditions - the actual clock, the actual format - as deliberate exposure to the specific pressure of the timer itself, distinct from the exam content.",
          "Like the first touch this week, this is a real experiment, and it checks in with you partway through too.",
          "<b class='who'>Karan</b> sits a full-length practice test with a real timer running, for the first time. The pressure of watching the clock is its own distinct experience from the content itself - and one he'd never actually rehearsed before."
]
          },
          think: {
            mode: "tap",
            prompt: "Why is the timed condition itself worth rehearsing separately from just reviewing the exam content?",
            options: [
              opt("Time pressure during a real exam is often a distinct source of anxiety from the content, and rehearsing it directly, under real timed conditions, is what actually builds tolerance for it - reviewing content alone doesn't", true, "Right - the taxonomy specifically distinguishes the timer's pressure from the content itself; only genuinely timed practice builds tolerance for that specific pressure, which content review on its own doesn't address."),
              opt("Timed practice doesn't really add anything beyond reviewing the same content untimed", false, "The scenario specifically frames the clock's pressure as its own distinct experience, separate from the content - untimed review doesn't rehearse that specific pressure at all."),
              opt("The main purpose of timed practice is simply to see the score, not to build tolerance for the clock itself", false, "While the score is useful information, the technique's specific purpose here is building tolerance for timed pressure itself, which is a distinct target from the score alone.")
            ],
            whyPrompt: "In a few words - why might the pressure of a timer be worth rehearsing separately from the exam content itself?",
          },
          apply: {
            scenario: "Try planning your own timed practice attempt - a real section or full test, under a real, running clock.",
            intensityPrompt: "Choose the version you're actually ready to try:",
            intensityOptions: [
          "Smaller version - a single timed section, shorter clock",
          "Bigger version - a full-length test under real, complete timed conditions"
],
            prompt: "In two or three sentences: when will you try this, and what do you expect the timer's pressure specifically to feel like?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the plan specifically addresses the timer's pressure, not just an intention to review content at some point."
          },
          remember: {
            prompt: "In a sentence or two: has rehearsing (or planning to rehearse) the timed condition changed how you think about the real exam day?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w6t5",
          title: "Check-in and pre-commitment - exam stress",
          role: "Check-in & pre-commitment",
          delayedRef: "w6t4_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Four tools for exam stress, now covered: attempting the avoided study session or test directly (B1), a relaxation routine practiced ahead of time (B2), loosening the fused belief that one exam is everything (B3), and rehearsing the timer itself under real conditions (B4).",
          "Two of these four asked you to actually do something uncomfortable on purpose - worth a direct, honest check-in before committing to what comes next."
]
          },
          think: {
            mode: "open",
            prompt: "Honestly - how did the two real attempts this week (the avoided study session, and the timed practice test) actually go, compared to what you expected going in?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Pick the one tool from this week you're most likely to actually use again, on your own, before the module comes back to it in the reinforcement bank.",
            prompt: "In two or three sentences: which tool, and what's one specific, real upcoming moment where you could try it?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the plan names a specific, real upcoming moment, not a general intention to 'study more' or 'feel calmer.'"
          },
          remember: {
            prompt: "In a sentence or two: is there anything that could get in the way of actually trying it, and how would you handle that if it happens?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: four tools for exam stress - a real structured behavioural experiment, applied relaxation practiced ahead of time, restructuring the 'one exam is everything' belief, and timed exposure rehearsal. Next week: fear of failure, and its own set of tools."
    },
    // WEEK 7: Fear of failure: the tools
    {
      num: 7,
      title: "Fear of failure: the tools",
      mechanism: "C",
      kind: "technique",
      retrievalCheck: null,
      touches: [
        {
          id: "w7t1",
          title: "Tool - sizing failure up on paper",
          role: "Technique #1 - Decatastrophizing Worksheet",
          delayedRef: "w6t5_apply",
          delayedPrompt: "Last touch, your plan was:",
          relate: {
            text: [
          "First tool for fear of failure: <b>decatastrophizing worksheets</b> (Aaron Beck, CBT). The idea: walk through the actual likelihood of failure, and separately, how survivable it would genuinely be if it happened - on paper, in specific detail, rather than leaving both as an unexamined, catastrophic blur.",
          "<b class='who'>Divya</b> tries it on her placement fear. She writes down her honest estimate of the likelihood, then separately writes out, in specific steps, what she'd actually do the week after if the outcome didn't go her way. Both turn out to be more concrete, and less catastrophic, than the unexamined version."
]
          },
          think: {
            mode: "tap",
            prompt: "Why does the worksheet ask these as two separate questions - likelihood, then survivability - rather than one combined judgment?",
            options: [
              opt("Likelihood and survivability are genuinely different questions, and separating them stops an inflated sense of one from bleeding into an inflated sense of the other", true, "Right - keeping likelihood and survivability separate stops the fear from treating 'this could happen' and 'this would be unbearable' as the same claim, when they're actually two different things worth examining on their own."),
              opt("It doesn't really matter whether they're separated, since they usually come out the same anyway", false, "The scenario specifically shows both coming out clearer once separated - collapsing them into one judgment is part of what keeps the fear feeling maximally catastrophic."),
              opt("Separating them mainly makes the worksheet feel more official and thorough", false, "The separation isn't cosmetic - it targets a specific way catastrophic thinking works, by keeping the size of the risk and the size of the consequence from inflating each other.")
            ],
            whyPrompt: "In a few words - why might separating 'how likely' from 'how survivable' stop a fear from feeling maximally catastrophic?",
          },
          apply: {
            scenario: "Try the same worksheet. Think of a real feared failure. Write your honest estimate of the likelihood, then separately, specific steps for what you'd actually do the week after if it happened.",
            prompt: "In two or three sentences: what did each of the two questions actually reveal?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether both questions were answered with real, specific detail, rather than left as a single vague impression."
          },
          remember: {
            prompt: "In a sentence or two: did writing out a real next-step plan change how the feared failure felt to think about?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w7t2",
          title: "Tool - what stays true regardless of the outcome",
          role: "Technique #2 - VIA Strengths Reframing",
          delayedRef: "w7t1_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Second tool: <b>strengths-based reframing using the VIA Character Strengths framework</b> (Christopher Peterson and Martin Seligman). The idea: identify your own top character strengths, then reframe the feared failure scenario through what would still be genuinely available to draw on, regardless of the outcome.",
          "Divya names three of her own real strengths - persistence, curiosity, and honesty - and asks what each would look like the week after a failed placement attempt. All three, she realizes, would still be fully intact and usable, regardless of the outcome."
]
          },
          think: {
            mode: "tap",
            prompt: "Why does naming specific personal strengths help here, rather than just offering general reassurance?",
            options: [
              opt("Specific, named strengths are things that genuinely wouldn't disappear regardless of the outcome, which widens the picture beyond the single feared result in a concrete, believable way", true, "Right - general reassurance doesn't hold up under real fear, but specific, named strengths that would genuinely remain intact regardless of the outcome are a concrete, believable widening of the picture."),
              opt("It mainly works by boosting confidence temporarily, regardless of whether the strengths are real", false, "The technique's mechanism is specifically about naming real, verifiable strengths that remain constant, not a general confidence boost disconnected from anything concrete."),
              opt("This step doesn't really matter if the person already has reasonable self-esteem", false, "Even with reasonable self-esteem, fear of failure narrows attention onto one feared outcome - explicitly naming what remains constant regardless of that outcome is a distinct, useful step.")
            ],
            whyPrompt: "In a few words - why might naming specific, real strengths do more than general reassurance under real fear of failure?",
          },
          apply: {
            scenario: "Try it yourself. Name two or three of your own real strengths, then describe what each would still look like the week after your own feared failure.",
            prompt: "In two or three sentences: what strengths did you name, and what would they look like afterward?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether specific, real strengths were named and connected concretely to what they'd look like afterward, not left as a general \"I'd be fine.\""
          },
          remember: {
            prompt: "In a sentence or two: does naming what stays constant regardless of outcome change how much the feared failure dominates your attention right now?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w7t3",
          title: "Tool - acting alongside the fear, not after it",
          role: "Technique #3 - ACT Willingness",
          delayedRef: "w7t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Third tool: <b>ACT willingness exercises to act despite fear</b> (Steven Hayes, ACT). The idea: identify one real, value-driven action currently being avoided because of fear of failure, and choose to take it anyway - not once the fear disappears, but alongside it.",
          "Divya identifies one specific action she's been putting off because of the placement fear: reaching out to a mentor for honest feedback on her application. She sends the message while the fear is still fully present, rather than waiting for it to go away first."
]
          },
          think: {
            mode: "tap",
            prompt: "Why does the exercise specifically ask you to act while the fear is still present, rather than waiting for it to reduce first?",
            options: [
              opt("Waiting for fear of failure to disappear before acting tends to mean never acting at all - willingness work specifically targets acting alongside the fear, not treating its presence as a stop sign", true, "Right - this is the core point of willingness work: the fear doesn't need to go away first, because waiting for that tends to mean the action never happens; acting alongside the fear is the actual skill being built."),
              opt("Acting while afraid is simply riskier and less advisable than waiting until calmer", false, "The technique isn't about ignoring genuine risk - it's specifically about value-driven actions where waiting for fear to disappear would mean never taking a worthwhile step."),
              opt("This step mainly works by reducing the fear itself in the moment of acting", false, "The technique doesn't claim the fear disappears when acting - it specifically works alongside a fear that may still be fully present, which is the distinguishing feature of willingness work.")
            ],
            whyPrompt: "In a few words - why might waiting for fear to disappear before acting mean the action never actually happens?",
          },
          apply: {
            scenario: "Try it yourself. Name one real, value-driven action you've been avoiding because of fear of failure, and describe taking it while the fear is still present.",
            prompt: "In two or three sentences: what's the action, and when could you actually take it, fear and all?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the plan names a specific action and timing, taken alongside the fear, rather than a plan to act \"once I feel more ready.\""
          },
          remember: {
            prompt: "In a sentence or two: which of these three fear-of-failure tools - the worksheet, the strengths, or the willingness action - feels most relevant to where you are right now?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w7t4",
          title: "Check-in - fear of failure",
          role: "Check-in",
          delayedRef: "w7t3_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Three tools for fear of failure, now covered: sizing the fear up on paper (C1), naming what stays constant regardless of outcome (C2), and acting alongside the fear rather than waiting for it to pass (C3).",
          "The third tool in particular asks something different from most tools so far this module - not examining a belief, but actually acting while the fear is still present. Worth a direct, honest check-in before moving on."
]
          },
          think: {
            mode: "open",
            prompt: "Honestly - how did actually taking the willingness action (or planning to) feel, compared to what you expected going in?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Take a moment to look back at all three tools from this week together, rather than separately.",
            prompt: "In two or three sentences: looking at all three together, what's the clearest thing they showed you about the gap between the unexamined fear and the examined version?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the answer looks at the pattern across all three tools together, not just repeats what happened with one of them."
          },
          remember: {
            prompt: "In a sentence or two: is there any part of this that still feels genuinely unresolved, or that you'd want to come back to?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w7t5",
          title: "Pre-commitment - fear of failure",
          role: "Pre-commitment",
          delayedRef: "w7t4_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "One more, real commitment before this week closes. Sizing up the fear on paper (C1), naming what stays constant (C2), and acting alongside the fear (C3) work best together - an examined risk, a stable sense of self underneath it, and real, willing action.",
          "This is the moment to actually commit to one more step, specific enough that you could genuinely follow through on it."
]
          },
          think: {
            mode: "open",
            prompt: "Of the three tools this week, which one - or which combination - do you think would actually make the most real difference for you going forward?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Commit to one specific, real next step - either sizing up another feared outcome on paper, or a concrete willingness action - before the module comes back to this in the reinforcement bank.",
            prompt: "In two or three sentences: what's the specific commitment, and when will you actually try it?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the commitment names a specific action and timing, not a general intention to 'worry less about failing.'"
          },
          remember: {
            prompt: "In a sentence or two: what would genuinely following through on this commitment mean to you, beyond just completing it?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: three tools for fear of failure - decatastrophizing on paper, strengths-based reframing, and willingness action alongside the fear. Next week: imposter syndrome, and its own set of tools."
    },
    // WEEK 8: Imposter syndrome: the tools
    {
      num: 8,
      title: "Imposter syndrome: the tools",
      mechanism: "D",
      kind: "technique",
      retrievalCheck: null,
      touches: [
        {
          id: "w8t1",
          title: "Tool - a record that's hard to explain away",
          role: "Technique #1 - Evidence Log",
          delayedRef: "w7t5_apply",
          delayedPrompt: "Last touch, your plan was:",
          relate: {
            text: [
          "First tool for imposter syndrome: <b>an evidence log tracking concrete accomplishments</b> (addressing Pauline Clance and Suzanne Imes's imposter-phenomenon construct, via Beck-style CBT). The idea: an ongoing, dated log of concrete accomplishments and the specific skill or effort behind each - built up over time, not a one-time list.",
          "<b class='who'>Farhan</b> starts his log with the senior colleague's unprompted praise from Week 4, dated and specific: what exactly was praised, and what skill of his actually produced it. He plans to add to it whenever something similar happens, rather than writing it once and stopping."
]
          },
          think: {
            mode: "tap",
            prompt: "Why does the log need to be ongoing and dated, rather than a single list written once?",
            options: [
              opt("Fraud-related beliefs survive by discounting evidence as it comes in one instance at a time - an ongoing, accumulating, dated record makes that evidence harder to discount collectively than any single instance could on its own", true, "Right - a single piece of evidence is easy to explain away individually; an ongoing, accumulating, dated record is what actually builds a harder-to-dismiss case over time."),
              opt("A single list written once would work exactly as well as an ongoing log", false, "The specific mechanism here is accumulation over time - a one-time list doesn't capture new evidence as it happens, and doesn't build the same cumulative weight against the fraud belief."),
              opt("The dating detail is mostly for organizational tidiness, not the mechanism itself", false, "The dating matters because it shows the evidence accumulating over real time, which is part of what makes the pattern harder to write off as one lucky moment.")
            ],
            whyPrompt: "In a few words - why might an accumulating, dated log be harder to discount than a single piece of evidence?",
          },
          apply: {
            scenario: "Try starting your own version. Think of one real, recent piece of evidence of your own competence, and log it: what happened, the date, and the specific skill or effort behind it.",
            prompt: "In two or three sentences: what did you log, and what specific skill or effort was actually behind it?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether a specific skill or effort was named behind the accomplishment, not just the accomplishment itself restated."
          },
          remember: {
            prompt: "In a sentence or two: what's usually your first instinct when you notice a piece of evidence like this - to log it, or to immediately explain it away?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w8t2",
          title: "Tool - the understanding you'd offer someone else",
          role: "Technique #2 - Self-Compassion Practice",
          delayedRef: "w8t1_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Second tool: <b>self-compassion practice for competence-related shame</b> (Paul Gilbert, Compassion-Focused Therapy). The idea: notice the self-critical voice that accompanies feeling like a fraud, and deliberately offer yourself the same understanding you'd offer a colleague in the exact same unfamiliar situation.",
          "Farhan notices the familiar thought - \"everyone else here belongs, I don't\" - and deliberately rewrites it as he would for his friend from Week 4: \"feeling out of place at first is normal here, and it doesn't mean you don't belong.\" Saying it to himself feels stranger than saying it to his friend did."
]
          },
          think: {
            mode: "tap",
            prompt: "Why does the technique specifically use the frame of 'what would I say to a colleague', rather than just telling him to 'be kinder to himself'?",
            options: [
              opt("The colleague-frame gives a concrete, testable standard - most people already know exactly what fair, understanding language sounds like for someone else, even when it feels unreachable for themselves", true, "Right - 'be kinder to yourself' is vague and hard to act on directly, while 'what would I say to a colleague in this exact position' gives a concrete standard most people can actually generate, even when self-directed kindness feels harder to access."),
              opt("It mainly works because colleagues are less critical than family members would be", false, "The technique isn't specifically about colleagues being less critical - it's about using a fair, external standard of understanding that's easier to access than self-directed kindness, regardless of who the comparison person is."),
              opt("The frame doesn't really matter, as long as he tries to think positively", false, "Generic positive thinking isn't the same as the specific, concrete standard of fairness the colleague-frame provides - the specificity is what makes the technique work.")
            ],
            whyPrompt: "In a few words - why might it be easier to generate fair, understanding language for someone else than for yourself, in the same position?",
          },
          apply: {
            scenario: "Try it yourself. Think of something you've been harshly self-critical about related to feeling like a fraud or not belonging.",
            prompt: "In two or three sentences: what's the harsh version, and what would you actually say to a colleague going through the exact same thing?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the colleague-version is genuinely more understanding than the original self-directed version, not just a softer restatement of the same criticism."
          },
          remember: {
            prompt: "In a sentence or two: did saying the kinder version to yourself feel as natural as it would to say it to someone else, or did it feel strange, the way it did for Farhan?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w8t3",
          title: "Tool - holding the fraud thought a little more loosely",
          role: "Technique #3 - ACT Defusion",
          delayedRef: "w8t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Third tool: <b>defusion from 'I'm a fraud' thoughts</b> (Steven Hayes, ACT) - the same defusion structure from Week 5's A2, applied here to this specific belief. The idea: notice the thought \"I'm a fraud\" the moment it shows up, and hold it as a passing thought rather than a settled fact.",
          "Farhan tries it the next time the thought arises, mid-meeting: instead of accepting \"I'm a fraud\" as simply true, he silently notes \"I'm having the thought that I'm a fraud\" - and keeps participating in the meeting rather than mentally checking out."
]
          },
          think: {
            mode: "tap",
            prompt: "Why might this quick, in-the-moment version matter, compared to the slower, accumulating evidence log from D1?",
            options: [
              opt("The evidence log builds a case over time, but the fraud thought still shows up in real moments that need something immediate - defusion gives a quick response for exactly that moment, without needing to wait for or recall the accumulated evidence", true, "Right - the two tools work on different timescales: D1 builds a slow, accumulating case, while D3 gives something usable in the exact moment the thought shows up, which the log alone doesn't address in real time."),
              opt("This tool replaces the evidence log entirely, since it works faster", false, "The two tools aren't substitutes for each other - the log builds a slower, cumulative case while defusion addresses the thought in the specific moment it arises; both have distinct value."),
              opt("The timing of when the thought is addressed doesn't really matter", false, "The scenario specifically shows the thought arising mid-meeting - having something usable in that exact moment, rather than only a slower accumulating tool, is the specific value being addressed here.")
            ],
            whyPrompt: "In a few words - why might a quick, in-the-moment tool matter alongside a slower, accumulating one, rather than replacing it?",
          },
          apply: {
            scenario: "Try it yourself. Think of the next time you expect the \"I'm a fraud\" thought (or something like it) to show up, and plan the defused version you'd use in that exact moment.",
            prompt: "In two or three sentences: what's the situation, and what would the defused version actually sound like?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the defused version was actually written out in full (\"I'm having the thought that...\"), not just described as an intention."
          },
          remember: {
            prompt: "In a sentence or two: which of these three imposter-syndrome tools - the log, the self-compassion, or the defusion - feels most useful for a real moment you actually face?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w8t4",
          title: "Check-in - imposter syndrome",
          role: "Check-in",
          delayedRef: "w8t3_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Three tools for imposter syndrome, now covered: an accumulating evidence log (D1), self-compassion for the shame underneath the fraud belief (D2), and quick, in-the-moment defusion from the fraud thought itself (D3).",
          "These three work on different timescales - slow accumulation, felt understanding, and quick in-the-moment response - worth a direct check-in on how they actually fit together for you before committing to what comes next."
]
          },
          think: {
            mode: "open",
            prompt: "Honestly - which of these three feels like it addresses something the other two don't quite reach, for you specifically?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Take a moment to look back at all three tools from this week together, rather than separately.",
            prompt: "In two or three sentences: looking at all three together, what's the clearest thing they showed you about how the fraud belief actually operates for you?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the answer looks at the pattern across all three tools together, not just repeats what happened with one of them."
          },
          remember: {
            prompt: "In a sentence or two: is there any part of this that still feels genuinely unresolved, or that you'd want to come back to?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w8t5",
          title: "Pre-commitment - imposter syndrome",
          role: "Pre-commitment",
          delayedRef: "w8t4_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "One more, real commitment before this week closes. The evidence log (D1), self-compassion (D2), and defusion (D3) work best together over time - a growing record, a fairer internal voice, and a quick response for the moment the fraud thought actually shows up.",
          "This is the moment to actually commit to one more step, specific enough that you could genuinely follow through on it."
]
          },
          think: {
            mode: "open",
            prompt: "Of the three tools this week, which one - or which combination - do you think would actually make the most real difference for you going forward?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Commit to one specific, real next step - adding to your evidence log, practicing the self-compassion rewrite, or planning the defused response - before the module comes back to this in the reinforcement bank.",
            prompt: "In two or three sentences: what's the specific commitment, and when will you actually try it?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the commitment names a specific action and timing, not a general intention to 'feel more confident.'"
          },
          remember: {
            prompt: "In a sentence or two: what would genuinely following through on this commitment mean to you, beyond just completing it?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: three tools for imposter syndrome - an accumulating evidence log, self-compassion for the underlying shame, and quick in-the-moment defusion from the fraud thought. Next week: bringing all four patterns together."
    },
    // WEEK 9: Bringing it together
    {
      num: 9,
      title: "Bringing it together",
      mechanism: "both",
      kind: "integration",
      retrievalCheck: {
        "prompt1": "Without looking back: what's the actual difference between an unexamined fear of failure and the same fear once it's been sized up on paper (Week 7's decatastrophizing)?",
        "prompt2": "And separately: what's the real difference between explaining away evidence of your own competence and actually holding it as real (Week 8's imposter syndrome pattern)?",
        "reveal": "Fear of failure (Week 3 / Week 7): an unexamined fear tends to stay maximally vague and catastrophic, while the same fear, actually sized up in specific detail against real likelihood and survivability, usually turns out disappointing but survivable - the size difference is the whole point of decatastrophizing. Imposter syndrome (Week 4 / Week 8): explaining away real evidence (as luck, timing, or others being fooled) keeps the fraud belief intact regardless of how much real evidence accumulates, while actually holding a piece of evidence as real - without immediately re-explaining it - is what an accumulating evidence log is built to make possible."
},
      touches: [
        {
          id: "w9t1",
          title: "Performance pressure and exam stress, one more time",
          role: "Integration - Performance Pressure & Exam Stress",
          delayedRef: "w8t5_apply",
          delayedPrompt: "Last touch, your commitment was:",
          relate: {
            text: [
          "One last look at each pattern, now with the actual tools in hand.",
          "<b class='who'>Aditi</b>, weeks later, notices the old catastrophic-rehearsal pull returning before a genuinely high-stakes review. This time, instead of spending weeks bracing, she writes down the specific prediction and checks it against the evidence - the same tool from Week 5, used on her own, unprompted.",
          "<b class='who'>Karan</b>, closer to his actual exam date now, notices the pull to avoid one more practice test. He recognises it this time, and sits it anyway, the same real experiment from Week 6."
]
          },
          think: {
            mode: "tap",
            prompt: "What's actually different about these two moments, compared to Weeks 1 and 2's versions of Aditi and Karan?",
            options: [
              opt("The old pulls - toward catastrophic rehearsal, and toward avoidance - still show up under real pressure, but both now have a specific tool to actually work with them, rather than just being carried along unnoticed", true, "Right - the pressure and the pulls haven't disappeared, which is realistic; what's changed is that both now have a specific, learnable response available, rather than the unexamined patterns from Weeks 1 and 2."),
              opt("The old pulls have disappeared entirely now that they have the tools", false, "The scenario shows both pulls returning under real pressure - the tools don't eliminate the pattern, they give something specific to do with it when it shows up."),
              opt("These two moments are simply less high-stakes than the earlier ones", false, "The scenario specifically describes both as genuinely high-stakes - the difference isn't the stakes, it's that both now have a specific tool available to work with the pull it produces.")
            ],
            whyPrompt: "In a few words - why might having a specific tool matter more than the pressure itself disappearing?",
          },
          apply: {
            scenario: "Think of your own version: a moment where old performance pressure or exam-related avoidance could show up again for you, even after these tools.",
            prompt: "In two or three sentences: which specific tool from Weeks 5 or 6 would you actually reach for in that moment?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether a specific tool is named, tied to a real, plausible moment, not a general statement that things will be fine now."
          },
          remember: {
            prompt: "In a sentence or two: what would it look like to notice the pull early, the way Aditi and Karan did, rather than only after it's already built up for weeks?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w9t2",
          title: "Fear of failure, one more time",
          role: "Integration - Fear of Failure",
          delayedRef: "w9t1_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "<b class='who'>Divya</b>'s placement outcome finally arrives - and it isn't the one she wanted. This time, though, the outcome doesn't land as the unthinkable catastrophe she once couldn't even discuss. She already sized it up on paper months earlier: it's genuinely disappointing, exactly as expected, and exactly as survivable as she'd worked out it would be.",
          "She moves to the specific next-step plan she wrote back in Week 7, rather than starting from nothing."
]
          },
          think: {
            mode: "tap",
            prompt: "Why does having already sized up this outcome, months earlier, matter now that it's actually happened?",
            options: [
              opt("Because the disappointment was already examined in specific detail beforehand, she has both an accurate sense of its size and a concrete next-step plan already in hand, rather than facing an unexamined catastrophe and a blank plan simultaneously", true, "Right - the decatastrophizing work done in advance means she's not facing the disappointment and a total blank at the same time; both the size of it and what to do next were already worked out."),
              opt("Having sized it up in advance means the disappointment doesn't actually hurt now", false, "The scenario specifically calls it genuinely disappointing - the tool doesn't remove the real disappointment, it makes the size of it accurate and gives a concrete next step."),
              opt("This shows the decatastrophizing exercise predicted the outcome would be positive", false, "The exercise doesn't predict outcomes - it sizes up what a negative outcome would actually mean, which is exactly what's playing out here now that the outcome has, in fact, been negative.")
            ],
            whyPrompt: "In a few words - why might sizing up a feared outcome in advance help even when the feared outcome actually happens?",
          },
          apply: {
            scenario: "Think of your own version: a real outcome you're currently uncertain about, where sizing up the disappointing version in advance, the way Divya did, might genuinely help.",
            prompt: "In two or three sentences: what's the outcome, and what would sizing it up now, before you know the result, actually look like?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the answer moves toward a real, specific outcome and next-step plan, not a general hope that things will work out."
          },
          remember: {
            prompt: "In a sentence or two: does knowing you have a next-step plan already worked out change how you feel about waiting for an uncertain outcome?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w9t3",
          title: "Imposter syndrome, one more time",
          role: "Integration - Imposter Syndrome",
          delayedRef: "w9t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "<b class='who'>Farhan</b>, a year into his role now, is asked to mentor a new first-generation hire who's visibly struggling with the same fraud feeling he once had. Explaining the pattern to someone else, he notices his own evidence log has grown substantially since Week 8 - entries he'd have explained away a year ago now sit there, dated and specific, genuinely hard to dismiss collectively.",
          "The fraud thought still shows up sometimes. It just doesn't run unchallenged the way it used to."
]
          },
          think: {
            mode: "tap",
            prompt: "What does \"it still shows up sometimes, it just doesn't run unchallenged\" actually mean here?",
            options: [
              opt("The fraud thought hasn't necessarily disappeared, but a year of accumulated evidence and practiced defusion means it no longer goes unquestioned the way it did at the start - the tools changed the response to the thought, not necessarily whether the thought ever occurs", true, "Right - this is a realistic, honest outcome: the thought can still occur, but a year of evidence-logging and defusion practice means it's met with a response now, rather than being simply accepted as fact the way it was in Week 4."),
              opt("This means the tools have completely eliminated the fraud thought after a year", false, "The scenario specifically says the thought still shows up sometimes - the tools changed how it's met, not whether it ever occurs at all."),
              opt("This suggests the tools didn't actually work, since the thought is still present", false, "The scenario describes a real, meaningful change - the thought no longer running unchallenged - which is a genuine outcome of the tools working, even though the thought itself hasn't vanished entirely.")
            ],
            whyPrompt: "In a few words - why might a genuinely successful outcome still include the thought occasionally showing up?",
          },
          apply: {
            scenario: "Think of your own version: a fraud-related or self-doubting thought that might still show up for you occasionally, even with practice.",
            prompt: "In two or three sentences: what would it look like for that thought to show up, but not run unchallenged, the way it does for Farhan now?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the answer describes a realistic, ongoing relationship to the thought, rather than an expectation that it will disappear entirely."
          },
          remember: {
            prompt: "In a sentence or two: what would you want to say to someone else just starting to notice this pattern in themselves, the way Farhan does with the new hire?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w9t4",
          title: "When all four show up at once",
          role: "Integration - Combined Pattern",
          delayedRef: "w9t3_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "One more scenario, and this one's new - a fresh character, since these four patterns often show up together, not one at a time.",
          "<b class='who'>Ishita</b> is in the final stretch before a major competitive exam and, separately, a placement interview the same month: dread before the interview that goes well beyond ordinary nerves (performance pressure), avoidance of her hardest practice sections (exam stress), an inability to think through what not getting either outcome would mean (fear of failure), and a nagging sense that if she does get through, it'll have been luck rather than her own preparation (imposter syndrome) - all four, showing up in the same stretch of weeks."
]
          },
          think: {
            mode: "tap",
            prompt: "Given everything covered across this module, what would actually make sense as Ishita's first move - not all fourteen tools at once?",
            options: [
              opt("Start with whichever single pattern feels clearest or most pressing right now, and use one specific tool for it - the four patterns are related but distinct, and trying to address all of them simultaneously isn't necessary or realistic", true, "Right - the module has treated these as four real, distinct patterns throughout, not one blended problem requiring every tool at once; picking one clear starting point with one specific tool is a realistic, workable first move."),
              opt("She needs to use all fourteen techniques simultaneously to make real progress", false, "Nothing in the module suggests all fourteen techniques need to be used at once - each mechanism's tools work on its own pattern, and starting with one clear entry point is realistic, not a lesser approach."),
              opt("Since the four patterns are appearing together, they must actually be one single problem requiring one single fix", false, "The module has consistently treated performance pressure, exam stress, fear of failure, and imposter syndrome as four related but genuinely distinct patterns, even when they show up together, which is exactly what's happening for Ishita here.")
            ],
            whyPrompt: "In a few words - why might picking one clear starting point make more sense than trying to address all four patterns at once?",
          },
          apply: {
            scenario: "Put yourself in Ishita's position, or think of a stretch in your own life where more than one of these four patterns showed up together.",
            prompt: "In two or three sentences: which one pattern would you actually start with, and which one tool from this module would you use for it?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether one clear, specific starting point is named, rather than an attempt to address everything simultaneously."
          },
          remember: {
            prompt: "In a sentence or two: has more than one of these four patterns ever actually shown up together for you, the way they have for Ishita?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w9t5",
          title: "On your own - no options, no hints",
          role: "Unscaffolded Transfer Test",
          delayedRef: "w9t4_apply",
          delayedPrompt: "Last touch, you wrote this:",
          transferTest: true,
          relate: {
            text: [
          "Last one, and it's different from everything before it: no tap options this time, and no hints about which pattern or which tool applies. Just a real scenario, and your own read on it.",
          "<b class='who'>Devansh</b>, a friend of Ishita's, mentions offhand that he's been putting off starting his revision for a major recruitment exam for weeks, telling himself he'll begin once he feels ready. When you ask what's actually stopping him, he says, almost as an aside, that if this attempt doesn't work out, he doesn't know how he'd tell his parents, and that a part of him worries he only got as far as he has through luck rather than his own ability anyway."
]
          },
          think: {
            mode: "open",
            prompt: "Before writing anything for Devansh directly: in your own words, first pass, what does this actually sound like to you?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Devansh hasn't asked for advice directly - but you're genuinely trying to understand what's actually going on for him, using everything from this module.",
            prompt: "In three or four sentences, entirely in your own words: what pattern or patterns do you think are actually present for Devansh, and what would you genuinely suggest he try first, and why?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - a strong answer would likely name exam stress (the avoidance of starting revision, waiting to feel ready) and imposter syndrome (attributing his progress so far to luck) as both plausibly present, and suggest starting with one specific, named tool rather than everything at once - the same reasoning practiced across Weeks 1 through 9, now applied without any options to choose from."
          },
          remember: {
            prompt: "In a sentence or two: of everything across these nine weeks, what's the one idea you'd actually want to remember, even a year from now?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: bringing performance pressure, exam stress, fear of failure, and imposter syndrome together - how they show up together in practice, and a final, unscaffolded scenario with no options and no hints, to test what's actually stuck."
    }
  ],
  reinforcementBank: [
    {
      code: "A1",
      rep: 1,
      type: 'reflection',
      scenario: "A colleague mentions they've been rehearsing a worst-case version of an upcoming client presentation for over a week, even though their last several presentations have gone well.",
      prompt: "What specific catastrophic prediction is probably driving that, and what evidence would actually test it?",
      reveal: "Something like: the underlying prediction is likely close to \"this one will go badly and it will matter enormously\" - and the real test is simply looking back at how the last several presentations actually went, which for most people points the other way."
    },
    {
      code: "A1",
      rep: 2,
      type: 'reflection',
      scenario: "You notice yourself mentally rehearsing a harsh reaction from someone before a routine check-in that's never actually gone badly before.",
      prompt: "What's the specific prediction underneath that rehearsal, and what does the honest evidence actually say about it?",
      reveal: "There's no single model answer here - the tell is whether a specific, testable prediction was named and actually checked against real evidence, not just relabeled as \"nerves.\""
    },
    {
      code: "B3",
      rep: 1,
      type: 'reflection',
      scenario: "A student says failing this one attempt at a competitive exam would mean their whole future is finished.",
      prompt: "What real counter-example might help test that belief, and how would you bring it up?",
      reveal: "Something like: naming someone real who didn't get their first-choice result and tracing what actually happened afterward - the point isn't to dismiss the disappointment, but to test whether \"my whole future\" is actually accurate."
    },
    {
      code: "B3",
      rep: 2,
      type: 'reflection',
      scenario: "Revisit your own \"this exam/result defines my future\" belief from Week 6.",
      prompt: "Has the belief's grip loosened at all since you first tested it against a real counter-example - even slightly?",
      reveal: "There's no single model answer here - the tell is an honest, specific comparison to the original answer, not a repeated restatement of it."
    },
    {
      code: "C1",
      rep: 1,
      type: 'reflection',
      scenario: "Someone describes an upcoming outcome as something they \"can't even think about\" because it would be too devastating if it went badly.",
      prompt: "What would walking them through likelihood and survivability, separately, likely reveal?",
      reveal: "Something like: separating the two questions usually reveals both are smaller than the unexamined, combined dread - the likelihood is often lower than it feels, and the survivability higher, once actually sized up on paper."
    },
    {
      code: "C1",
      rep: 2,
      type: 'reflection',
      scenario: "Try this for real: think of a current feared outcome and size it up on paper again, separately - likelihood, then survivability.",
      prompt: "What did the sized-up version look like, compared to how it felt before you wrote it out?",
      reveal: "There's no single model answer here - the tell is an honest, specific sort into the two questions, not a single vague impression left unexamined."
    },
    {
      code: "C2",
      rep: 1,
      type: 'reflection',
      scenario: "A friend feels like their entire sense of self would be at risk if a specific venture failed.",
      prompt: "What strengths might genuinely remain constant for them regardless of that outcome, and how would naming them help?",
      reveal: "Something like: naming two or three specific, real strengths - not generic reassurance - and describing what each would concretely look like the week after, widens the picture beyond the single feared outcome."
    },
    {
      code: "C2",
      rep: 2,
      type: 'reflection',
      scenario: "Revisit the strengths you named for yourself in Week 7.",
      prompt: "Has anything about how you'd use them after a setback become clearer since you first named them?",
      reveal: "There's no single model answer here - the tell is an honest, specific update, not a repeated restatement of the original answer."
    },
    {
      code: "C3",
      rep: 1,
      type: 'reflection',
      scenario: "Someone says they're waiting to feel more confident before finally applying for a role they actually want.",
      prompt: "What would a willingness-based response to that waiting look like?",
      reveal: "Something like: naming the specific action being avoided and taking it now, fear and uncertainty still present, rather than waiting for a feeling of readiness that may not arrive on its own."
    },
    {
      code: "C3",
      rep: 2,
      type: 'reflection',
      scenario: "Think of a real action you've been avoiding until a feeling of readiness arrives.",
      prompt: "What would it look like to take that action this week, feeling and all?",
      reveal: "There's no single model answer here - the tell is whether a specific action and timing were named, not a general intention to \"do it eventually.\""
    },
    {
      code: "D2",
      rep: 1,
      type: 'reflection',
      scenario: "A colleague privately believes they don't deserve a role they were specifically selected for through a competitive process.",
      prompt: "What would you actually say to them, and how does that compare to what they're likely saying to themselves?",
      reveal: "Something like: most people can generate real, fair understanding for a colleague far more easily than for themselves - the useful move is noticing that gap and offering the colleague-version instead of the harsher, self-directed one."
    },
    {
      code: "D2",
      rep: 2,
      type: 'reflection',
      scenario: "Think of the harshest thing you've said to yourself about not belonging or not being qualified, in the past week.",
      prompt: "Rewrite it as you would say it to a colleague in the exact same position.",
      reveal: "There's no single model answer here - the tell is whether the rewritten version is genuinely more understanding, not a softened version of the same underlying criticism."
    }
  ],
  toolsData: {
    "defusion_a2": {
      code: "A2",
      title: "Defusion From 'Must Perform Perfectly'",
      mechShort: "Performance Pressure",
      kind: "log_single",
      intro: "A quick log for whenever you actually catch the 'must perform perfectly' rule showing up, and defuse it the way Aditi did in Week 5 - \"I'm having the thought that...\" - rather than treating it as simply true.",
      logLabel: "What was the situation, and what did the defused version sound like?",
      firstPlaceholder: "e.g. Before a client call - \"I'm having the thought that I must perform perfectly or I'll be seen as incompetent\" - said it out loud, felt slightly less urgent.",
      placeholder: "Your answer..."
    },
    "relaxation_routine": {
      code: "A4",
      title: "Pre-Performance / Pre-Exam Relaxation Routine",
      mechShort: "Performance Pressure & Exam Stress",
      kind: "log_single",
      intro: "A quick log for the short relaxation routine from Weeks 5 and 6 - whatever you actually practiced before a real performance-pressure or exam moment, and how it went.",
      logLabel: "What did you practice, and how did it actually go?",
      firstPlaceholder: "e.g. Three slow breaths and a shoulder drop, practiced twice this week before a call - noticeably calmer walking in the third time.",
      placeholder: "Your answer..."
    },
    "fraud_defusion": {
      code: "D3",
      title: "Defusion From 'I'm a Fraud'",
      mechShort: "Imposter Syndrome",
      kind: "log_single",
      intro: "A quick log for whenever the \"I'm a fraud\" thought actually shows up, and you defuse it the way Farhan did in Week 8 - noting it as a passing thought, not a settled fact.",
      logLabel: "What was the situation, and what did the defused version sound like?",
      firstPlaceholder: "e.g. Mid-meeting, felt like everyone could tell I didn't belong - silently noted \"I'm having the thought that I'm a fraud\" and kept participating.",
      placeholder: "Your answer..."
    },
    "evidence_log": {
      code: "D1",
      title: "Competence Evidence Log",
      mechShort: "Imposter Syndrome",
      kind: "log_multi",
      intro: "An ongoing, dated record of concrete accomplishments and the specific skill or effort behind each - built up over time, the way Farhan's log grew from Week 8 onward.",
      fields: [
        {
                "key": "accomplishment",
                "label": "What happened",
                "firstPlaceholder": "e.g. Senior colleague praised my proposal in front of the team",
                "placeholder": "e.g. Client specifically asked for me again on the next project"
        },
        {
                "key": "skill",
                "label": "The specific skill or effort behind it",
                "firstPlaceholder": "e.g. I'd spent real time restructuring the argument the night before",
                "placeholder": "e.g. I followed up carefully after our first project ended"
        }
]
    },
    "exam_relaxation": {
      code: "B2",
      title: "Exam-Day Relaxation Practice",
      mechShort: "Exam Stress",
      kind: "log_single",
      intro: "A quick log specifically for practicing the exam-day relaxation routine from Week 6, ahead of a real exam date, so it's genuinely familiar by the time you need it.",
      logLabel: "What did you practice, and how many times so far?",
      firstPlaceholder: "e.g. Breathing-and-shoulder-drop routine, practiced once this evening - two weeks before the exam, plan to repeat it nightly.",
      placeholder: "Your answer..."
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
      { id: 'w1', prompt: 'How much has this issue affected you this week?', min: 0, max: 10, minLabel: 'Not at all', maxLabel: 'Extremely' },
      { id: 'w2', prompt: 'How confident do you feel managing this issue this week?', min: 0, max: 10, minLabel: 'Not confident', maxLabel: 'Extremely confident' },
      { id: 'w3', prompt: 'On how many days did you practice this week\'s activities?', min: 0, max: 7, minLabel: '0 days', maxLabel: '7 days' }
    ],
    endExtraQuestions: [
      { id: 'e6', prompt: 'Overall, how helpful was this program?', min: 1, max: 5, minLabel: 'Not at all helpful', maxLabel: 'Extremely helpful' }
    ],
    endChoice: {
      id: 'e7',
      prompt: 'What would you like to do next?',
      options: ['Finish here', 'Continue with another program', 'Talk to a therapist']
    }
  },
  escalationConfig: {
    tier1: "Any statement connecting performance pressure, exam outcomes, or fear of failure to intent or a plan to end one's life or self-harm (\"I can't face them if I fail\", \"if this exam doesn't work out there's no point going on\", \"I have a way to end it\"). Given the well-documented, real elevated risk of suicide linked to competitive-exam outcomes in the Indian context (UPSC/JEE/NEET and similar attempts), treat any hopelessness explicitly tied to an exam or evaluative outcome - even without an explicit plan - as warranting the same seriousness as other Tier 1 language, rather than assuming it's the ordinary, intense stress this module is designed to help with.",
    tier2: "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary, real anxiety of performance pressure, exam stress, fear of failure, or imposter syndrome, which is what this module is specifically designed to help with. Also watch for language suggesting family or social consequences tied to a specific exam or evaluative outcome (severe shame, threatened rejection, or withdrawal of support tied to a result) - a real and India-specific pressure this module's scenarios touch on, distinct from ordinary disappointment.",
    systemPrompt: `You are a safety classifier inside a mental-health support app used in India. Classify the user's message into exactly one of: NONE, TIER1, TIER2.

TIER1 definition: Any statement connecting performance pressure, exam outcomes, or fear of failure to intent or a plan to end one's life or self-harm ("I can't face them if I fail", "if this exam doesn't work out there's no point going on", "I have a way to end it"). Given the well-documented, real elevated risk of suicide linked to competitive-exam outcomes in the Indian context (UPSC/JEE/NEET and similar attempts), treat any hopelessness explicitly tied to an exam or evaluative outcome - even without an explicit plan - as warranting the same seriousness as other Tier 1 language, rather than assuming it's the ordinary, intense stress this module is designed to help with.
TIER2 definition: Persistent hopelessness about life broadly, or real functional collapse - not the ordinary, real anxiety of performance pressure, exam stress, fear of failure, or imposter syndrome, which is what this module is specifically designed to help with. Also watch for language suggesting family or social consequences tied to a specific exam or evaluative outcome (severe shame, threatened rejection, or withdrawal of support tied to a result) - a real and India-specific pressure this module's scenarios touch on, distinct from ordinary disappointment.

Critical context 1: many people, especially in Indian English, use hyperbolic or idiomatic self-deprecating language that is NOT a genuine risk signal - for example "this exam is going to kill me", "I'll die of embarrassment if I fail". Do NOT classify ordinary hyperbole, jokes, or figures of speech as TIER1 or TIER2, even if they contain words like "kill", "die", or "worthless".

Critical context 2 (specific to this module): this module's content is about real performance pressure, exam stress, fear of failure, and imposter syndrome. Genuine anxiety, stress, or self-doubt about an upcoming evaluation is not itself a risk signal, and should be classified NONE. However, given the well-documented, real elevated risk of suicide linked to competitive-exam outcomes in the Indian context, treat any genuine hopelessness explicitly tied to an exam or evaluative outcome - "there's no point going on if I fail this", "I can't face my family if this doesn't work out" - as TIER1, even without an explicit plan or method stated. Do not require a specific plan before classifying this kind of exam-outcome-linked hopelessness as TIER1.

Only classify as TIER2 if there is genuine persistent hopelessness about life broadly, real functional collapse, or genuine indication of severe family/social rejection tied to a specific result - not the ordinary, real anxiety of performance pressure or exam stress, which is what this module is designed to help with.

When genuinely uncertain, prefer the lower tier (or NONE) rather than over-triggering - but never downgrade language that includes a specific plan, method, timeframe, or exam-outcome-linked hopelessness as described above.

Respond with ONLY a raw JSON object, no markdown fences, no other text: {"tier": "NONE" | "TIER1" | "TIER2", "reason": "one short clause"}`,
    tier1FallbackWords: ["going to kill myself","planning to end my life","don't want to wake up tomorrow","have a plan to end my life","going to end it all tonight","no point going on if i fail","can't face my family if i fail this exam"],
    tier2FallbackWords: ["i am worthless","i feel like a burden to everyone","i hate who i am","there is no point in trying anymore","i can't live like this","my family will disown me if i fail"]
  },
  openQuestions: [
    {
      area: "Clinical",
      text: "All 14 practicable technique mappings are this build's synthesis of the taxonomy's named sources - not clinician-reviewed."
    },
    {
      area: "Clinical - safety, needs explicit sign-off",
      text: "BRIEF.escalation.tier1 was deliberately widened for this module beyond the standard definition, to explicitly treat exam-outcome-linked hopelessness as Tier 1 even without an explicit plan, given the well-documented, real elevated risk of competitive-exam-linked suicide in the Indian context. This is a genuinely different kind of change than Module 18's workplace-safety addition (which carved out a distinct concern within Tier 2); this one widens what counts as Tier 1 itself. Flagged for explicit review before treating this as a template for future exam/academic-stress-adjacent modules (e.g. Module 22, Student & Transition Stress) - the taxonomy classifies this module as Core tier based on how common the concern is, not Specialized*(safety-adjacent) based on intrinsic risk, and this addition was made independently of that tier classification."
    },
    {
      area: "Structural note - well-established 4-mechanism convention",
      text: "This module uses the retrieval-check convention already validated across Anxiety & Worry and Conflict & Communication: first check opens at Week 5 (the first technique week), testing mechanisms A and B; final check opens at Week 9 (the last week), retesting the remaining mechanisms C and D. No new convention introduced."
    },
    {
      area: "Structural note - reused T resolutions",
      text: "Mechanisms A and B (both T=4) use the standard combined check-in/pre-commitment resolution, same as Module 18's Mechanisms A and B. Mechanisms C and D (both T=3, zero guardrails) use the standard exact-fit resolution. No new structural cases."
    },
    {
      area: "Structural note - three guardrails, two different flavors",
      text: "A3 and B4 are exposure-based rehearsal touches (deliberately sitting with a feared evaluative situation or timed pressure) - closer to the disclosure/vulnerability-style guardrails common in earlier modules. B1 is a real behavioral-experiment touch (actually running a study session or practice test that's been avoided) - closer to Module 18's C2/C3 behavioral-experiment flavor. Worth confirming the standard intensity-choice-plus-distress-check-in mechanic fits both flavors equally well."
    },
    {
      area: "Content decision - representation gap",
      text: "Mechanism B (Exam Stress) is written around nationally-cited competitive exams (UPSC, JEE, NEET, board exams). It doesn't specifically address state-level exams, recruitment board exams, or vernacular-medium exam contexts, which involve real but different pressures. Flagged explicitly, not just as a generic disclaimer."
    },
    {
      area: "Content decision, bank composition",
      text: "With 3 of 14 techniques guardrail-excluded (A3, B1, B4) and no technique matching the Module 5 deep-exploration or Module 15 normalizing-psychoeducation exceptions, 11 of 14 practicable techniques are eligible for the Reinforcement Bank. Reflections = A1, B3, C1, C2, C3, D2 (6 techniques, 12 reps). Tools = A2, A4, B2, D1, D3 (5 techniques) - a deliberate choice: A2/D3 (defusion) and A4/B2 (applied relaxation) are genuinely quick, in-the-moment practices that fit the log_single pattern, and D1 (the evidence log) is inherently an accumulating log, given kind:'log_multi'. This is a heavier Tools split than prior modules (Module 17 had zero, Module 18 had two) - a deliberate reading of this module's content, not a default."
    },
    {
      area: "Content-authorship, recurring techniques",
      text: "Hayes's ACT-style defusion appears twice within this module (A2, D3) using the identical technique structure applied to two different fused thoughts, and again once more as willingness work (C3) - three ACT-based techniques total, similar in count to Module 18's three ACT appearances. Beck's CBT appears three times (A1, B3, C1/decatastrophizing) with different specific techniques each time."
    },
    {
      area: "Resolved",
      text: "Crisis helpline numbers reused from Modules 1-18 (KIRAN, TeleMANAS, Vandrevala Foundation) - national, not module-specific."
    },
    {
      area: "Resolved",
      text: "Escalation UX follows the shared decisions documented in Module 3's dev guide, section 5, including Module 18's two engine-level fixes (HTML-escaping on echoed answers, and the persistent Tier 1 banner) which this module inherits directly since it's built on Module 18's post-fix engine tail."
    },
    {
      area: "Not yet started",
      text: "Same as prior modules: accessibility target, analytics schema, and a full copy/editorial pass have not been done for this module either."
    },
    {
      area: "Standing reminder",
      text: "Nothing in this module has been clinically reviewed and nothing has been tested with a real user."
    }
  ]
};
