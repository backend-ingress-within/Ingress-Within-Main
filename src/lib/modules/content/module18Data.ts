import { ModuleContent } from '../../../types/moduleContent';

function opt(label: string, isTarget: boolean, explain: string) {
  return { label, isTarget, explain };
}

export const MODULE_18_CONTENT: ModuleContent = {
  moduleId: 'M18',
  slug: 'pressure-burnout',
  name: 'Pressure & Burnout',
  duration_weeks: 7,
  tier: "Core - 349 rupees - Work & Education domain",
  brief: {
    moduleName: "Pressure & Burnout",
    moduleNumber: 18,
    tier: "Core - 349 rupees - Work & Education domain",
    scenarioSource: "Pan-India, English-medium context (per product decision) - urban, white-collar work culture: tight deadlines, long commutes, always-on messaging expectations, and the difficulty disengaging from work that hustle-culture norms can produce. Language is English-medium throughout; content has not yet been reviewed for phrasing that reads as metro-specific, or for how well it represents non-white-collar and informal-sector work stress, which this module does not currently address.",
    mechanisms: [
      {
        key: "A",
        name: "Work Stress",
        short: "Work Stress",
        def: "General pressure from work demands - tight deadlines, long commutes, always-on work culture.",
        need: "Competence",
        contrast: {
          who: "Kavya",
          text: "faces the same tight deadlines and always-on culture Rohan does - but she's found a way to actually triage her workload and protect real boundaries around it, rather than letting every demand feel equally urgent."
        },
        techniques: [
          {
            code: "A1",
            approach: "CBT",
            format: "A",
            name: "Cognitive Restructuring of 'Always-On' and Catastrophic Workload Beliefs",
            source: "Aaron Beck",
            what: "Writing down the specific catastrophic thought driving the pressure to always be reachable - \"if I don't respond immediately, something will go badly wrong\" - and testing it against real, specific evidence.",
            how: "Always-on culture often runs on an unexamined assumption that any delay in response carries serious consequences, which rarely holds up against a specific, honest look at what actually happens when a response is delayed.",
            why: "Targets the belief driving the always-on pressure directly, which is often what makes the workload itself feel more urgent than it actually is."
          },
          {
            code: "A2",
            approach: "Applied Relaxation",
            format: "A",
            name: "Progressive Muscle Relaxation for Physical Tension",
            source: "Edmund Jacobson's original PMR, adapted by Lars-Goran Ost into Applied Relaxation",
            what: "A structured practice of deliberately tensing and then releasing muscle groups in sequence, to notice and reduce the physical tension that work stress often produces without being consciously felt.",
            how: "Work stress frequently shows up as physical tension - shoulders, jaw, neck - that goes unnoticed until it's already significant. Deliberately tensing and releasing makes that tension noticeable and reduces it directly.",
            why: "Works on the physical, bodily side of work stress directly, which the more cognitive tools (A1) don't specifically target."
          },
          {
            code: "A3",
            approach: "ACT",
            format: "A",
            name: "Values-Based Work-Life Boundary Setting",
            source: "Steven Hayes, Acceptance and Commitment Therapy",
            what: "Naming what you actually value outside of work, and using that to set one real, specific boundary - a time work stops, a day that's protected - rather than letting work expand to fill all available time by default.",
            how: "Without a boundary actively chosen and named, work tends to expand into whatever time is available, especially under always-on cultural pressure. Naming a value-based boundary gives something concrete to actually hold.",
            why: "Provides a concrete, forward-building boundary, which is a different lever than the belief-testing in A1."
          },
          {
            code: "A4",
            approach: "Social Problem-Solving Therapy",
            format: "A",
            name: "A Structured Problem-Solving Worksheet for Workload Triage",
            source: "Thomas D'Zurilla and Marvin Goldfried, Social Problem-Solving Therapy",
            what: "A structured worksheet for sorting an overwhelming workload into what's actually urgent, what can wait, and what can be delegated or dropped - rather than treating every task as equally pressing.",
            how: "An overwhelming workload often feels undifferentiated - everything urgent at once - which itself adds to the stress. Structured triage makes the actual priorities visible, which usually turns out to be a smaller list than it felt like.",
            why: "Addresses the practical scale of the workload directly, which is a different target than the belief (A1), the body (A2), or the boundary (A3)."
          }
        ]
      },
      {
        key: "B",
        name: "Burnout",
        short: "Burnout",
        def: "Exhaustion from sustained, unrelieved stress - an escalation of unmanaged work stress, often showing up as feeling drained daily despite adequate sleep, and cynicism toward work.",
        need: "Recovery",
        contrast: {
          who: "Ritu",
          text: "went through the same exhaustion and cynicism toward work that Ananya is describing - but she's found a way to actually recognize burnout for what it is and build a real recovery pace, rather than pushing through and calling it a bad phase."
        },
        techniques: [
          {
            code: "B1",
            approach: "Behavioural Activation",
            format: "A",
            name: "Graded Behavioural Activation for Re-Engagement Using Mastery/Pleasure Activity Scheduling",
            source: "Peter Lewinsohn; Christopher Martell, Sona Dimidjian, and Neil Jacobson",
            what: "Deliberately scheduling small activities that bring either a sense of mastery (accomplishing something) or genuine pleasure, starting small enough to actually follow through, to counter burnout's pull toward withdrawal.",
            how: "Burnout tends to produce withdrawal from anything not strictly necessary, which then removes exactly the activities that could counter the exhaustion and cynicism - deliberately scheduling small ones breaks that cycle.",
            why: "Addresses the withdrawal pattern directly, through concrete scheduled action."
          },
          {
            code: "B2",
            approach: "Psychoeducation",
            format: "A",
            name: "Psychoeducation Using the Maslach Burnout Inventory Framework",
            source: "Christina Maslach's Burnout Inventory framework - exhaustion, cynicism, inefficacy",
            what: "Understanding burnout through its three recognized components - exhaustion, cynicism, and a sense of inefficacy - to see which are actually present for you, rather than treating burnout as one vague, undifferentiated feeling.",
            how: "Burnout is often experienced as a single overwhelming feeling, but the framework breaks it into three distinct, recognizable components, which makes it easier to see clearly and track over time.",
            why: "Provides the framework underneath the other tools - understanding what's actually happening, structurally, in burnout."
          },
          {
            code: "B3",
            approach: "CFT",
            format: "A",
            name: "Self-Compassion Practice for Burnout-Related Self-Criticism",
            source: "Paul Gilbert, Compassion-Focused Therapy",
            what: "Noticing the self-critical voice that often accompanies burnout - \"I should be able to handle this,\" \"everyone else manages fine\" - and deliberately offering yourself the same understanding you'd offer a colleague in the same position.",
            how: "Burnout frequently comes with harsh self-judgment for not coping better, which tends to deepen the exhaustion rather than motivate genuine recovery.",
            why: "Works on the emotional tone underneath burnout, which is a different lever than the structural understanding in B2."
          },
          {
            code: "B4",
            approach: "ACT",
            format: "A",
            name: "Values-Based Recovery and Pacing Plan",
            source: "Steven Hayes, Acceptance and Commitment Therapy",
            what: "Building a real, values-based plan for recovery and pacing - what actually matters enough to protect energy for, and what a sustainable pace, rather than an all-or-nothing push, could look like.",
            how: "Burnout recovery often gets treated as something to simply push through or wait out, rather than something that benefits from a deliberate, values-based pace built around what actually matters.",
            why: "Provides the concrete, forward-building recovery plan, building on the understanding from B2 and the self-compassion from B3."
          }
        ]
      },
      {
        key: "C",
        name: "Overwork Culture / Work-Life Imbalance",
        short: "Overwork Culture",
        def: "Chronic difficulty disengaging from work, often shaped by hustle-culture norms - including difficulty taking leave, and guilt when not 'available' after hours.",
        need: "Recovery, Autonomy",
        contrast: {
          who: "Naveen",
          text: "faced the same hustle-culture pressure and the same guilt about being unavailable that Siddharth describes - but he's found a way to actually redefine what success means to him, beyond constant availability, and hold that redefinition even when it feels uncomfortable."
        },
        techniques: [
          {
            code: "C1",
            approach: "ACT",
            format: "A",
            name: "Values Clarification to Redefine 'Success' Beyond Availability",
            source: "Kelly Wilson and Tobias Lundgren-style ACT values work",
            what: "Examining whether the definition of 'success' currently being lived by - constant availability, always being reachable - actually matches your own real values, or was absorbed from hustle-culture norms without ever being chosen.",
            how: "A definition of success built around constant availability is often absorbed from workplace or cultural norms rather than genuinely chosen, and examining it directly can reveal a real gap between what's being lived and what's actually valued.",
            why: "Addresses the underlying definition of success driving the overwork pattern, which the more behavioral tools (C2, C3) build on."
          },
          {
            code: "C2",
            approach: "Behavioural Activation",
            format: "B",
            guardrail: true,
            name: "Scheduled Disengagement as a Behavioural Experiment Testing Feared Consequences",
            source: "Beck-style behavioural experiment, applied via Behavioural Activation",
            what: "Deliberately scheduling a specific period of disengagement from work - genuinely not checking messages - as a real experiment to test the feared consequence directly, rather than assuming it without ever actually checking.",
            how: "The fear of what happens when unavailable is usually untested, since availability has never actually been suspended long enough to find out. A real, scheduled experiment provides actual evidence either way.",
            why: "Because this asks you to test a real, sometimes anxiety-provoking fear directly, this touch checks in with you partway through."
          },
          {
            code: "C3",
            approach: "Graded Exposure",
            format: "B",
            guardrail: true,
            name: "Graded Exposure to 'Being Unavailable', Starting With Small Increments",
            source: "Wolpe-style graded exposure",
            what: "Building up tolerance for being unavailable gradually, starting with small increments - ten unmonitored minutes before a full evening - rather than attempting a large disengagement all at once.",
            how: "A large, sudden disengagement can feel too anxiety-provoking to sustain, while small, graded increments make the discomfort more manageable and build real tolerance over time.",
            why: "Because this also asks you to sit with real anxiety about being unavailable, even in a small increment, this touch checks in with you partway through."
          }
        ]
      }
    ],
    escalation: {
      tier1: "Any statement connecting work pressure or burnout to intent or a plan to end one's life or self-harm (\"I can't keep doing this, I want it to stop\", \"I have a way to end it\").",
      tier2: "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary, real exhaustion of work stress or burnout, which is what this module is specifically designed to help with. Also watch for language suggesting a genuinely unsafe or exploitative work situation - being denied basic rest, threats tied to taking leave, or conditions beyond ordinary high-pressure work - since this module is built for real but ordinary work stress and burnout, not for situations involving workplace exploitation or abuse, which need a different kind of support."
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
      title: "Three related, but distinct, patterns",
      body: [
        "This module covers general work stress, burnout as its escalation, and the harder-to-shift overwork culture that can keep both going - three real, different experiences, not one blended 'work stress' module.",
        "If only one or two of these actually apply to you, that's expected - the tools for each stand on their own."
],
      cta: "Continue"
    },
    {
      eyebrow: "What this is - and isn't",
      title: "Between-session support, not a replacement",
      body: [
        "This module is designed to sit between therapy sessions, or to be useful on its own - either way, it isn't therapy, and it doesn't diagnose you with anything.",
        "This module is built for real, but ordinary, high-pressure work and burnout - not for situations involving workplace exploitation or unsafe conditions. If that's what you're facing, the crisis resources in this app are always available."
],
      cta: "Continue",
      crisisButton: true
    },
    {
      eyebrow: "Why this module",
      title: "Why we're suggesting this one",
      body: [
        "You told us you're dealing with work pressure, burnout, or difficulty disengaging from work - or some combination.",
        "This module is built for exactly that - three specific patterns, each with its own real, evidence-based tools."
],
      cta: "Continue"
    },
    {
      eyebrow: "What to expect",
      title: "The next 7 weeks",
      body: [
        "Short term: a new touch on weekdays, a few minutes each, real scenarios - your own words, not a quiz to pass or fail. Weekends bring a short summary, not new content.",
        "Long term, honestly: this won't change your actual workload or your workplace's culture on its own. What it can realistically offer is 11 specific, evidence-based tools, plus enough practice with each pattern that pressure and burnout have less room to run unchecked. That's the actual promise here, not more than that.",
        "Two techniques in this module ask you to actually test being unavailable, which can feel genuinely uncomfortable on purpose - both ship with a built-in check-in."
],
      cta: "Continue"
    },
    {
      eyebrow: "Theory grounding",
      title: "The tools everything here is built on",
      body: [
        "Each of these three patterns has more than one real, evidence-based approach behind it - so instead of blending them into one vague idea, each approach gets its own tool and its own touch.",
        "You won't use any of these in Weeks 1-3 - those three weeks are just about being able to spot each pattern clearly, before any tool gets layered on top. Weeks 4-6 bring these back, one at a time, matched to exactly what you'll have just learned to recognise."
],
      cta: "Start Week 1",
      theory: true
    }
  ],
  weeks: [
    // WEEK 1: Work stress: recognising the pattern
    {
      num: 1,
      title: "Work stress: recognising the pattern",
      mechanism: "A",
      kind: "blocked",
      retrievalCheck: null,
      touches: [
        {
          id: "w1t1",
          title: "Recognition - the phone that never fully rests",
          role: "Recognition #1",
          noDelayed: true,
          relate: {
            text: [
          "Quick note before we start: this week and the next two aren't about any of the tools yet - none show up. First, you need to be able to spot each pattern clearly. The tools come in Weeks 4-6, matched one at a time to what you'll have learned to recognise.",
          "This week's pattern has a name: <b>work stress</b>. In simple terms: general pressure from work demands - tight deadlines, long commutes, always-on work culture.",
          "Here's what that looks like. <b class='who'>Rohan</b> checks his work messages the moment he wakes up, throughout his commute, during dinner, and right before sleep - not because anyone has ever explicitly told him to, but because he's convinced that missing a message, even briefly, will cause something to go badly wrong."
]
          },
          think: {
            mode: "tap",
            prompt: "Which of these actually explains what's happening? More than one will sound reasonable.",
            options: [
              opt("An unexamined belief that any delay carries serious consequences is driving constant checking, not an actual requirement from his job", true, "Right - nothing in the scenario describes an explicit requirement; the constant checking is driven by an assumption about consequences that's never actually been tested."),
              opt("His job genuinely requires this level of constant availability", false, "The scenario specifically notes no one has explicitly required this - the checking is self-driven by an assumption, not a stated job requirement."),
              opt("This is simply what being a responsible, committed employee looks like", false, "Responsible engagement with work is different from checking constantly out of an untested fear of consequences - the module's tools (A1) work with exactly this distinction.")
            ],
            whyPrompt: "In a few words - what's the giveaway that this is an assumption, not an actual job requirement?",
          },
          apply: {
            scenario: "Same pattern, a different person: Priyanka checks her email compulsively through her entire weekend, convinced that any unanswered message will create a crisis by Monday, even though nothing has ever actually gone wrong the few times she's missed one.",
            prompt: "Same thing happening here. In two or three sentences: what would you actually say to Priyanka right now?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"You said yourself nothing's actually gone wrong the times you've missed a message - that's real evidence against the fear, even though the fear still feels urgent. The urgency might be coming from the belief itself, not from what actually happens.\""
          },
          remember: {
            prompt: "In a sentence or two: think of a real moment you checked work messages compulsively, driven by a fear of what might happen if you didn't.",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w1t2",
          title: "Recognition - a body keeping score no one's reading",
          role: "Recognition #2",
          delayedRef: "w1t1_apply",
          delayedPrompt: "Last touch, on Priyanka, you wrote this:",
          relate: {
            text: [
          "A different moment with Rohan. A friend points out he's been rubbing his neck constantly during their conversation. Rohan hadn't even noticed - and realizes, when he pays attention, that his shoulders have been tight for weeks, maybe longer.",
          "Notice what's happening: real physical tension has been building for weeks, entirely unnoticed, until someone else pointed it out."
]
          },
          think: {
            mode: "tap",
            prompt: "What does not noticing weeks of physical tension actually suggest?",
            options: [
              opt("Physical tension from stress can build up entirely below conscious awareness until it's already significant, which is common under sustained pressure", true, "Right - the scenario shows tension that's been present for weeks without Rohan noticing at all, which is a common pattern: physical stress signals often go unnoticed until they're already substantial."),
              opt("Rohan must not actually be that stressed if he didn't notice", false, "Not noticing physical tension isn't evidence of low stress - it's often the opposite, since sustained stress can numb awareness of the body's own signals over time."),
              opt("His friend is probably overreacting to a normal amount of tension", false, "The scenario describes weeks of unnoticed tension, which is a real, recognizable pattern worth attending to, not an overreaction to something minor.")
            ],
            whyPrompt: "In a few words - why might physical stress build up unnoticed until someone else points it out?",
          },
          apply: {
            scenario: "A colleague, noticing someone clenching their jaw throughout a meeting, gently mentions it afterward. The person is surprised - they hadn't felt it at all.",
            prompt: "In two or three sentences: what would checking in with your own body, right now, actually reveal? Try it as you answer.",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the answer reflects an actual, honest check of physical sensation in the moment, not a general statement about stress."
          },
          remember: {
            prompt: "In a sentence or two: where do you tend to physically hold tension, when work stress has been building?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w1t3",
          title: "What treating everything as urgent is actually costing",
          role: "Functional logic",
          delayedRef: "w1t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Between the constant checking and the unnoticed tension, there's a pattern worth naming honestly: treating every task and message as equally urgent can feel like the responsible, thorough way to handle a demanding job.",
          "What it actually costs is different: when everything is treated as equally urgent, nothing actually gets triaged, which means real priorities get lost in the noise, and the constant vigilance itself produces the physical and mental exhaustion building underneath it."
]
          },
          think: {
            mode: "tap",
            prompt: "What is treating everything as equally urgent actually doing? These are close - think it through.",
            options: [
              opt("Feeling like thorough, responsible diligence, while actually preventing real triage and producing the exhaustion that comes with constant, undifferentiated vigilance", true, "That's the real trade - it can feel like taking the job seriously, but without triage, real priorities get lost in the noise, and the constant vigilance itself is what's producing the exhaustion."),
              opt("An effective way to make sure nothing important gets missed", false, "The scenario suggests the opposite - when everything is equally urgent, nothing is actually prioritized, which doesn't protect against missing what's truly important."),
              opt("Evidence that Rohan's job is genuinely more demanding than most", false, "This assumes something about the job itself the scenario doesn't establish - the pattern described is about how the demands are being processed internally, not their objective scale.")
            ],
            whyPrompt: "In a few words - why might treating everything as equally urgent actually prevent real priorities from being protected?",
          },
          apply: {
            scenario: "A colleague, watching someone respond to every single notification with the same urgency, asks: \"Has treating everything as equally important actually helped you get the real priorities done, or just kept you constantly on edge?\" The person pauses. \"...Constantly on edge, honestly.\"",
            prompt: "That's usually the tell. In two or three sentences: think of a time treating everything as urgent didn't actually help you get the important things done - what happened instead?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the pattern to notice is whether treating everything as urgent actually protected the real priorities, or just produced constant vigilance without triage."
          },
          remember: {
            prompt: "In a sentence or two: what does the pull to treat everything as equally urgent usually feel like for you, right as it shows up?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w1t4",
          title: "What real triage can look like",
          role: "Contrast / boundary case",
          delayedRef: "w1t3_apply",
          delayedPrompt: "Last touch, you named this:",
          relate: {
            text: [
          "Here's what a similar work situation can look like for someone who approaches it differently.",
          "<b class='who'>Kavya</b> faces the same tight deadlines and always-on culture Rohan does - the same real pressure. But she's built a habit of actually sorting her workload each morning into what's genuinely urgent, what can wait, and what can be delegated, rather than treating every incoming demand as equally pressing.",
          "This is the module's contrast case for this pattern: real demands, still genuinely present - not the absence of pressure, but a different relationship to it."
]
          },
          think: {
            mode: "tap",
            prompt: "What actually makes Kavya's approach different from Rohan's? Both face the same real workload pressure.",
            options: [
              opt("She actively triages her workload into real priority levels, rather than treating every incoming demand as equally urgent", true, "That's the real difference - not that her workload is lighter, but that she sorts it deliberately, which is exactly what Rohan's undifferentiated urgency doesn't do."),
              opt("Her job has fewer actual demands than Rohan's", false, "The scenario specifically says she faces the same tight deadlines and culture - the difference is in how she processes the demands, not in how many there are."),
              opt("She simply cares less about doing well at work than Rohan does", false, "Actively triaging a workload each morning isn't consistent with caring less - it's a deliberate practice that takes real effort, arguably more than reflexively treating everything as urgent.")
            ],
            whyPrompt: "In a few words - how might actively sorting a workload each morning change how the day actually feels?",
          },
          apply: {
            scenario: "A colleague asks Kavya how she stays on top of everything without feeling constantly overwhelmed. She says: \"I sort it every morning - what's actually urgent today, what can wait, what I can hand off. Most days, the real urgent list is a lot shorter than it feels like before I sort it.\"",
            prompt: "In two or three sentences: think of your own current workload - what would sorting it into real priority levels actually reveal?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the useful pattern is noticing whether the sorting is genuinely done, not just imagined as something that would obviously help."
          },
          remember: {
            prompt: "In a sentence or two: is there a workload you could try actually triaging this week, rather than treating it as one undifferentiated pile?",
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
          "One more, and then a small piece of what actually happened with Rohan.",
          "After his friend pointed out the tension, he tried, once, deliberately not checking messages for two hours during a weekend. Nothing happened - no crisis, no consequence, nothing that couldn't wait. The two hours were genuinely, physically easier than he expected.",
          "That's not a coincidence, and it previews the tools coming in Week 4: the feared consequence of stepping back, tested directly even once, usually turns out to be far smaller than the constant vigilance was assuming."
]
          },
          think: {
            mode: "tap",
            prompt: "What does the uneventful two hours tell us about the belief that had been driving the constant checking?",
            options: [
              opt("A real, if small, test of the feared consequence found nothing happened, which is direct evidence the belief driving the constant checking was overestimating the actual risk", true, "Right - this was a genuine, if small, real-world test, and nothing went wrong, which is meaningful evidence against the always-on belief, not just a reassuring thought."),
              opt("He just got lucky that nothing happened this particular time", false, "While one instance isn't absolute proof, treating it as mere luck ignores that this is exactly the kind of direct evidence the module's tools (A1) are built to use - a real test, not a hypothetical one."),
              opt("It doesn't really prove anything, since he only tried it once", false, "One real test is a meaningful start, even if not exhaustive - it's genuine evidence against the catastrophic belief, which is more than the belief itself was ever tested against before.")
            ],
            whyPrompt: "In a few words - why might even one real test of a feared consequence carry more weight than the untested fear itself?",
          },
          apply: {
            scenario: "A different person, same shape of realisation: after avoiding it for months, Tara finally silences her phone for an entire evening, and finds nothing urgent had actually needed her attention when she checks it again later.",
            prompt: "In two or three sentences: what does that evening tell Tara about the months of constant checking beforehand?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"The months of constant checking were responding to a feared consequence that, tested directly just once, didn't actually happen - which suggests the fear had been running well ahead of the real risk.\""
          },
          remember: {
            prompt: "In a sentence or two: is there a small, real test of stepping back you could try this week?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: work stress, and how treating every demand as equally urgent can feel responsible, even though a real, even small, test of stepping back usually reveals the feared consequences were overestimated. Next week: burnout, a related but distinct escalation of unmanaged stress."
    },
    // WEEK 2: Burnout: recognising the pattern
    {
      num: 2,
      title: "Burnout: recognising the pattern",
      mechanism: "B",
      kind: "blocked",
      retrievalCheck: null,
      touches: [
        {
          id: "w2t1",
          title: "Recognition - tired despite doing everything right",
          role: "Recognition #1",
          delayedRef: "w1t5_apply",
          delayedPrompt: "Last week, your idea was:",
          relate: {
            text: [
          "This week's pattern: <b>burnout</b>. In simple terms: exhaustion from sustained, unrelieved stress - an escalation of unmanaged work stress, often showing up as feeling drained daily despite adequate sleep, and cynicism toward work.",
          "Here's what that looks like. <b class='who'>Ananya</b> has been sleeping a full eight hours for weeks, eating reasonably, even exercising occasionally - and still wakes up every day feeling as exhausted as if she hadn't slept at all. She's started to feel a flat, cynical distance from work she used to genuinely enjoy."
]
          },
          think: {
            mode: "tap",
            prompt: "Which of these actually explains what's happening? More than one will sound reasonable.",
            options: [
              opt("The exhaustion isn't being caused by inadequate sleep or self-care, since those are already reasonably in place - it's a sign of sustained, unrelieved stress escalating into burnout", true, "Right - the scenario specifically rules out inadequate sleep or basic self-care as the cause, since those are already reasonably handled; the exhaustion despite that points toward burnout as the actual pattern, not a fixable sleep or lifestyle issue."),
              opt("She must not actually be sleeping as well as she thinks she is", false, "The scenario states she's sleeping a full eight hours - treating this as unreliable without evidence dismisses a real, documented pattern of burnout that occurs even with adequate sleep."),
              opt("This is just normal tiredness that any demanding job produces", false, "Ordinary tiredness from a demanding job usually responds to rest and recovery time - the persistence of exhaustion despite adequate sleep for weeks, plus the cynicism, points to something beyond ordinary tiredness.")
            ],
            whyPrompt: "In a few words - why might exhaustion that persists despite adequate sleep point toward burnout rather than a simple rest deficit?",
          },
          apply: {
            scenario: "Same pattern, a different person: despite a reasonable sleep schedule and no major life disruptions, Karan finds himself completely drained every morning, and increasingly indifferent to a job that used to genuinely interest him.",
            prompt: "Same thing happening here. In two or three sentences: what would you actually say to Karan right now?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"Being drained despite adequate sleep, plus feeling indifferent to work you used to care about - that combination sounds like burnout specifically, not just ordinary tiredness. It's worth naming it as that, rather than assuming more rest alone will fix it.\""
          },
          remember: {
            prompt: "In a sentence or two: have you experienced exhaustion that didn't seem to respond to rest, the way ordinary tiredness usually does?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w2t2",
          title: "Recognition - a harsh voice making it worse",
          role: "Recognition #2",
          delayedRef: "w2t1_apply",
          delayedPrompt: "Last touch, on Karan, you wrote this:",
          relate: {
            text: [
          "A different moment with Ananya. Noticing her own exhaustion and cynicism, her internal response is harsh: \"everyone else manages fine, what's wrong with me, I should be able to handle this.\" The self-criticism runs constantly, on top of the exhaustion itself.",
          "Notice what's happening: burnout is being met with harsh self-judgment, which is adding a second layer of distress on top of the original exhaustion."
]
          },
          think: {
            mode: "tap",
            prompt: "What does the harsh self-criticism actually add to the underlying burnout?",
            options: [
              opt("A second layer of distress - self-judgment - on top of the original exhaustion, which tends to deepen burnout rather than motivate recovery from it", true, "Right - the self-criticism isn't neutral; it's adding real additional distress on top of the burnout itself, and research on self-compassion suggests this tends to worsen, not improve, recovery."),
              opt("A reasonable check on whether she's actually managing her responsibilities well", false, "Harsh self-judgment isn't the same as a fair, reasonable check-in - it's an assumption that everyone else manages fine, which is unverifiable and adds distress without adding useful information."),
              opt("Evidence that she genuinely isn't working hard enough", false, "Nothing in the scenario supports this - the pattern described is exhaustion despite reasonable self-care, not a lack of effort, and the self-criticism doesn't reflect an accurate assessment of that.")
            ],
            whyPrompt: "In a few words - why might harsh self-criticism deepen burnout rather than help someone recover from it?",
          },
          apply: {
            scenario: "A friend, hearing someone criticize themselves harshly for feeling burned out, asks: \"Would you say that to a colleague who was going through the exact same thing?\" The person realizes they wouldn't, not even close.",
            prompt: "In two or three sentences: what would offering yourself that same understanding, instead of the harsh version, actually sound like?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the answer offers genuine understanding, not a softened version of the same self-criticism."
          },
          remember: {
            prompt: "In a sentence or two: has burnout ever come with a harsh internal voice for you, on top of the exhaustion itself?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w2t3",
          title: "What pushing through is actually costing",
          role: "Functional logic",
          delayedRef: "w2t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Between the unresponsive exhaustion and the harsh self-criticism, there's a pattern worth naming honestly: pushing through burnout, treating it as something to simply power past, can feel like the only responsible option when there's real work to do.",
          "What it actually costs is different: burnout doesn't resolve by being pushed through the way ordinary tiredness does - it tends to deepen, and the withdrawal and cynicism that come with it often compound the longer real recovery is postponed."
]
          },
          think: {
            mode: "tap",
            prompt: "What is pushing through burnout actually doing? These are close - think it through.",
            options: [
              opt("Feeling like the only responsible option given real work demands, while actually letting burnout deepen since it doesn't resolve the way ordinary tiredness does", true, "That's the real trade - pushing through feels necessary and responsible, but burnout specifically doesn't respond to being powered past the way ordinary fatigue sometimes does; it tends to compound instead."),
              opt("A reliable way to get through a temporarily demanding period", false, "The scenario describes sustained exhaustion over weeks, not a brief demanding period - pushing through hasn't resolved anything, which is inconsistent with this being a reliable short-term strategy."),
              opt("Evidence of real strength and commitment to the job", false, "Pushing through burnout isn't the same as strength - the module's tools (B4) treat genuine recovery, not endurance, as what actually addresses burnout.")
            ],
            whyPrompt: "In a few words - why might burnout not respond to being pushed through the way ordinary tiredness sometimes does?",
          },
          apply: {
            scenario: "A colleague, watching someone push through weeks of exhaustion without any real recovery, asks: \"Has pushing through actually made you feel any less burned out, or just meant you're doing it for longer?\" The person pauses. \"...Longer, honestly. It's not getting better.\"",
            prompt: "That's usually the tell. In two or three sentences: think of a time pushing through burnout didn't actually resolve it - what happened instead?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the pattern to notice is whether pushing through actually resolved the burnout, or just extended it."
          },
          remember: {
            prompt: "In a sentence or two: what does the pull to push through burnout usually feel like for you, right as it shows up?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w2t4",
          title: "What real recovery can look like",
          role: "Contrast / boundary case",
          delayedRef: "w2t3_apply",
          delayedPrompt: "Last touch, you named this:",
          relate: {
            text: [
          "Here's what a similar experience can look like for someone who's found a different way through it.",
          "<b class='who'>Ritu</b> went through the same exhaustion and cynicism toward work that Ananya is describing - the same real burnout. But she's learned to recognize it for what it is, name it directly rather than push through it, and build a genuine, if gradual, recovery pace around what actually matters to her.",
          "This is the module's contrast case for this pattern: real burnout, still genuinely present - not the absence of exhaustion, but a different relationship to recovering from it."
]
          },
          think: {
            mode: "tap",
            prompt: "What actually makes Ritu's approach different from pushing through? Both experienced real, comparable burnout.",
            options: [
              opt("She names the burnout directly and builds a genuine recovery pace, rather than treating it as something to push past", true, "That's the real difference - not that her burnout was less severe, but that she responded to it as burnout requiring real recovery, rather than as an obstacle to power through."),
              opt("Her job was less demanding than Ananya's, giving her more room to recover", false, "The scenario describes comparable burnout for both women - the difference is in how each responded to it, not in how demanding their jobs were."),
              opt("She simply has more natural resilience than Ananya", false, "Naming burnout and building a deliberate recovery pace is a learnable response, not a fixed trait - the module's tools (B1-B4) are built to teach exactly this kind of response.")
            ],
            whyPrompt: "In a few words - how might naming burnout directly, rather than pushing through it, change what recovery actually looks like?",
          },
          apply: {
            scenario: "A friend asks Ritu how she recognized she needed to actually recover, not just push harder. She says: \"I stopped assuming pushing harder would eventually work. Once I named it as burnout, not just a rough patch, I could actually start building real recovery instead of just enduring.\"",
            prompt: "In two or three sentences: think of your own experience with exhaustion - what would naming it directly, rather than pushing through, actually look like?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the useful pattern is noticing whether naming it directly feels like it opens up a different kind of response than pushing through does."
          },
          remember: {
            prompt: "In a sentence or two: is there exhaustion in your own life right now that might actually be burnout, rather than something to just push past?",
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
          "One more, and then a small piece of what actually happened with Ananya.",
          "After a conversation with a friend who named what she was describing as burnout, not just a rough patch, she started scheduling one small, genuinely enjoyable activity each week - nothing large, just something real. Weeks later, the constant exhaustion hadn't vanished, but it had measurably eased, and the cynicism toward work had softened slightly too.",
          "That's not a coincidence, and it previews the tools coming in Week 5: burnout doesn't resolve by being pushed through, but small, deliberately scheduled recovery, even just one activity a week, can measurably ease it over time."
]
          },
          think: {
            mode: "tap",
            prompt: "What does the gradual easing, after weeks of one small scheduled activity, tell us about what pushing through hadn't been able to do?",
            options: [
              opt("A small, deliberate recovery practice produced real, if gradual, improvement that months of pushing through hadn't managed to achieve at all", true, "Right - pushing through hadn't eased anything over the same or longer period; a small, deliberate change did, which is real evidence about which approach actually works for burnout specifically."),
              opt("Her workload must have simply gotten lighter around the same time", false, "The scenario attributes the shift to the scheduled activity, not to any described change in her actual workload - introducing an unstated cause isn't supported here."),
              opt("It doesn't really prove anything, since the exhaustion didn't fully disappear", false, "That the exhaustion didn't vanish entirely doesn't undercut the real, measurable easing - meaningful improvement, not full resolution, is exactly the realistic outcome burnout recovery tools are built to produce.")
            ],
            whyPrompt: "In a few words - why might one small, deliberately scheduled activity ease burnout in a way that pushing through never did?",
          },
          apply: {
            scenario: "A different person, same shape of realisation: after months of feeling flat and cynical about work, Dev starts scheduling one short walk with a friend each week, purely for enjoyment, and finds his overall exhaustion easing gradually over the following weeks.",
            prompt: "In two or three sentences: what does that gradual shift tell Dev about the months of just pushing through beforehand?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"The months of pushing through hadn't eased anything - one small, deliberately scheduled activity did more over a few weeks than all that pushing managed, which suggests real recovery needs deliberate action, not just endurance.\""
          },
          remember: {
            prompt: "In a sentence or two: is there one small, genuinely enjoyable activity you could schedule this week, even briefly?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: burnout, and how pushing through exhaustion can feel like the only responsible option, even though small, deliberately scheduled recovery tends to ease it in a way pushing through never does. Next week: overwork culture and work-life imbalance, a related but distinct pattern."
    },
    // WEEK 3: Overwork culture: recognising the pattern
    {
      num: 3,
      title: "Overwork culture: recognising the pattern",
      mechanism: "C",
      kind: "blocked",
      retrievalCheck: null,
      touches: [
        {
          id: "w3t1",
          title: "Recognition - a definition of success never actually chosen",
          role: "Recognition #1",
          delayedRef: "w2t5_apply",
          delayedPrompt: "Last week, your idea was:",
          relate: {
            text: [
          "This week's pattern: <b>overwork culture and work-life imbalance</b>. In simple terms: chronic difficulty disengaging from work, often shaped by hustle-culture norms - including difficulty taking leave, and guilt when not 'available' after hours.",
          "Here's what that looks like. <b class='who'>Siddharth</b> hasn't taken a full day off in over a year. When asked why, he describes a vague sense that being constantly available is simply what success looks like - though when pressed, he can't actually say where that definition came from, or whether he'd choose it if he thought about it directly."
]
          },
          think: {
            mode: "tap",
            prompt: "Which of these actually explains what's happening? More than one will sound reasonable.",
            options: [
              opt("He's living by a definition of success - constant availability - that was absorbed from surrounding culture rather than genuinely chosen or examined", true, "Right - his own inability to say where the definition came from, or whether he'd choose it deliberately, points to an absorbed norm rather than a genuinely examined value."),
              opt("Constant availability genuinely is what success requires in his field", false, "The scenario doesn't establish this as an actual field requirement - it describes Siddharth himself being unable to justify or even fully articulate where the belief comes from."),
              opt("He simply enjoys working more than taking time off", false, "The scenario describes a vague, unexamined sense of what success looks like, not a described genuine enjoyment of constant work - these are different things, and the module's tools (C1) address exactly this distinction.")
            ],
            whyPrompt: "In a few words - what's the giveaway that this definition of success was absorbed, not genuinely chosen?",
          },
          apply: {
            scenario: "Same pattern, a different person: Meher feels a constant, low-grade guilt whenever she's not immediately responsive after work hours, even on her own personal time, without being able to say exactly why or where the expectation came from.",
            prompt: "Same thing happening here. In two or three sentences: what would you actually say to Meher right now?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"Not being able to say where that expectation actually came from is worth noticing - it suggests it might be an absorbed norm, not something you'd actually choose if you examined it directly.\""
          },
          remember: {
            prompt: "In a sentence or two: think of an expectation about work availability you've absorbed without ever really examining whether you'd actually choose it.",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w3t2",
          title: "Recognition - an untested fear keeping the pattern going",
          role: "Recognition #2",
          delayedRef: "w3t1_apply",
          delayedPrompt: "Last touch, on Meher, you wrote this:",
          relate: {
            text: [
          "A different moment with Siddharth. Asked what he thinks would actually happen if he took a real day off, fully unavailable, he describes a vague sense of disaster - things falling apart, being seen as uncommitted - but admits he's never actually tested this, not even once, in years of working this way.",
          "Notice what's happening: a specific, real fear is driving the pattern, but it's never once been tested against what would actually happen."
]
          },
          think: {
            mode: "tap",
            prompt: "What does never once testing the feared consequence, across years, actually suggest?",
            options: [
              opt("The fear has been driving the behavior entirely untested, which means there's no actual evidence for or against it, only the assumption itself", true, "Right - years of avoiding the test means the fear has never been checked against reality, so it's been driving real behavior based purely on an assumption, not evidence."),
              opt("The fear must be accurate, since he's avoided testing it for so long", false, "Avoiding a test for a long time isn't evidence the fear is accurate - it's just evidence the fear has been strong enough to prevent the test, which is a different thing entirely."),
              opt("Taking a full day off would genuinely be risky for him to try", false, "This assumes the fear is accurate without any actual evidence, which is exactly the pattern being examined - the module's tools (C2, C3) are built to test this directly rather than assume it either way.")
            ],
            whyPrompt: "In a few words - why does years of avoiding the test mean there's no real evidence about what would actually happen?",
          },
          apply: {
            scenario: "A friend, hearing Siddharth describe the vague sense of disaster, asks: \"Have you ever actually tested this, even once, or is this just what you've always assumed would happen?\" Siddharth realizes he genuinely doesn't know, since he's never checked.",
            prompt: "In two or three sentences: what would actually testing this, even in a small way, look like for someone in Siddharth's position?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the answer involves a genuinely real, if small, test, not just imagining what the test might show."
          },
          remember: {
            prompt: "In a sentence or two: is there a feared consequence of being unavailable that you've never actually tested?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w3t3",
          title: "What staying constantly available is actually costing",
          role: "Functional logic",
          delayedRef: "w3t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Between the absorbed definition of success and the untested fear, there's a pattern worth naming honestly: staying constantly available can feel like the safe, responsible choice - protecting against the imagined disaster of stepping back.",
          "What it actually costs is different: it means real recovery time, and real time for what actually matters outside work, never happens - the imagined protection comes at the cost of a real, ongoing toll that the untested fear never has to justify."
]
          },
          think: {
            mode: "tap",
            prompt: "What is staying constantly available actually doing? These are close - think it through.",
            options: [
              opt("Feeling like protection against an untested, imagined disaster, while actually costing all the real recovery time and personal life the availability crowds out", true, "That's the real trade - it feels protective against something that's never actually been tested, while the real, ongoing cost of never having recovery time or personal space keeps accumulating regardless."),
              opt("A genuinely necessary sacrifice for career success", false, "The scenario doesn't establish that constant availability is actually necessary - it establishes an untested fear driving the pattern, which the module's tools work to actually check against reality."),
              opt("Evidence of strong work ethic and commitment", false, "Constant availability driven by an untested fear isn't the same as genuine commitment - the module's tools (C1) work with the difference between a chosen value and an absorbed, unexamined norm.")
            ],
            whyPrompt: "In a few words - why might the real cost of constant availability keep accumulating even though the feared disaster it's protecting against has never actually happened?",
          },
          apply: {
            scenario: "A colleague, watching someone decline yet another weekend for themselves to stay available, asks: \"Has staying available this whole time actually protected anything real, or just meant you never get any time back?\" The person pauses. \"...Never get any time back, honestly.\"",
            prompt: "That's usually the tell. In two or three sentences: think of a time staying constantly available didn't actually protect against anything real - what happened instead?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the pattern to notice is whether the availability actually protected against something real, or just cost real time without a corresponding benefit."
          },
          remember: {
            prompt: "In a sentence or two: what does the pull to stay constantly available usually feel like for you, right as it shows up?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w3t4",
          title: "What redefining success can look like",
          role: "Contrast / boundary case",
          delayedRef: "w3t3_apply",
          delayedPrompt: "Last touch, you named this:",
          relate: {
            text: [
          "Here's what a similar situation can look like for someone who's found a different way through it.",
          "<b class='who'>Naveen</b> faced the same hustle-culture pressure and the same guilt about being unavailable that Siddharth describes. But he's found a way to actually redefine what success means to him, beyond constant availability, and hold that redefinition even when it feels uncomfortable - even when the old guilt still shows up.",
          "This is the module's contrast case for this pattern: real cultural pressure, still genuinely present - not the absence of it, but a different relationship to the definition of success driving it."
]
          },
          think: {
            mode: "tap",
            prompt: "What actually makes Naveen's approach different from Siddharth's? Both face the same real hustle-culture pressure.",
            options: [
              opt("He's actively redefined success for himself and holds that redefinition even when discomfort or guilt shows up, rather than defaulting back to the absorbed norm", true, "That's the real difference - not that the cultural pressure or guilt is absent for him, but that he's done the work of choosing a different definition and holds it even when it's uncomfortable."),
              opt("His workplace culture is less demanding than Siddharth's", false, "The scenario specifically says he faced the same hustle-culture pressure - the difference is in his internal response to it, not in the external pressure itself."),
              opt("He simply doesn't feel guilt about being unavailable", false, "The scenario doesn't say the guilt is absent for Naveen - it says he holds his redefinition even when it shows up, which is different from never feeling it at all.")
            ],
            whyPrompt: "In a few words - how might actively choosing a definition of success, rather than defaulting to an absorbed one, change what becomes possible?",
          },
          apply: {
            scenario: "A colleague asks Naveen how he holds his boundaries despite the old guilt still showing up sometimes. He says: \"I stopped expecting the guilt to disappear before I could act differently. It still shows up sometimes - I just don't let it decide for me anymore, because I've actually thought about what success means to me now.\"",
            prompt: "In two or three sentences: think of your own definition of success at work - how much of it was actually chosen, versus absorbed from the culture around you?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the useful pattern is noticing whether the answer honestly distinguishes what was chosen from what was absorbed."
          },
          remember: {
            prompt: "In a sentence or two: is there one piece of your definition of success you could imagine actually re-examining, on purpose?",
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
          "One more, and then a small piece of what actually happened with Siddharth.",
          "After the conversation about never having tested his fear, he tried something small: two hours, one Saturday, phone fully off. The guilt showed up almost immediately - but nothing else did. No crisis, no consequence, nothing that couldn't wait until Monday.",
          "That's not a coincidence, and it previews the tools coming in Week 6: the guilt shows up regardless of whether anything is actually wrong - it's a feeling shaped by the absorbed norm, not a reliable signal about real consequences, and testing the fear directly, even in small increments, is usually the only way to actually find that out."
]
          },
          think: {
            mode: "tap",
            prompt: "What does the two uneventful hours tell us about the guilt that showed up during them?",
            options: [
              opt("The guilt showed up regardless of whether anything was actually wrong, suggesting it's a conditioned feeling from the absorbed norm rather than a reliable signal about real consequences", true, "Right - the guilt and the actual outcome were disconnected: guilt appeared immediately, but nothing bad happened. That gap is exactly what reveals the guilt isn't tracking real risk."),
              opt("The guilt is a useful, accurate signal that should be listened to regardless", false, "The scenario shows the guilt appearing even though nothing was actually wrong, which is direct evidence against treating it as an accurate signal about real consequences in this case."),
              opt("It doesn't really prove anything, since he only tried it once for two hours", false, "A short, real test is still meaningful evidence - it's a genuine data point against the untested fear, even if a longer test would add more, and it's more evidence than the fear had ever been checked against before.")
            ],
            whyPrompt: "In a few words - why might guilt show up regardless of whether anything is actually wrong, if it's coming from an absorbed norm rather than real risk?",
          },
          apply: {
            scenario: "A different person, same shape of realisation: after finally taking a full weekend off for the first time in a year, Aditi feels intense guilt the entire time, but returns Monday to find absolutely nothing had gone wrong in her absence.",
            prompt: "In two or three sentences: what does that uneventful Monday tell Aditi about the guilt she felt all weekend?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"The guilt was real and intense, but it wasn't actually tracking anything real - nothing went wrong, which suggests the guilt was coming from the absorbed norm, not from an accurate sense of risk.\""
          },
          remember: {
            prompt: "In a sentence or two: is there a small, real test of stepping back from availability you could try this week, even briefly?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: overwork culture and work-life imbalance, and how an absorbed, untested definition of success can drive constant availability, even though small, real tests usually reveal the feared consequences don't actually happen. Next week: the tools for work stress."
    },
    // WEEK 4: Work stress: the tools
    {
      num: 4,
      title: "Work stress: the tools",
      mechanism: "A",
      kind: "technique",
      retrievalCheck: {
        "prompt1": "In your own words, without looking back: what was the actual pattern driving Rohan's constant checking in Week 1 - not the checking itself, but what was underneath it?",
        "prompt2": "And separately, in your own words: what made Ananya's exhaustion in Week 2 different from ordinary tiredness after a demanding week?",
        "reveal": "Work stress (Week 1): an unexamined belief that any delay in response carries serious consequences - not an actual job requirement - was driving the constant checking, and the physical tension that came with it. Burnout (Week 2): exhaustion that persists despite adequate sleep and reasonable self-care, often paired with a growing cynicism toward work, which ordinary tiredness usually doesn't produce and rest alone usually doesn't resolve."
},
      touches: [
        {
          id: "w4t1",
          title: "Tool - naming the catastrophic thought",
          role: "Technique #1 - Cognitive Restructuring",
          delayedRef: "w3t5_apply",
          delayedPrompt: "Last week, your idea was:",
          relate: {
            text: [
          "Time for the first tool for work stress: <b>cognitive restructuring of 'always-on' and catastrophic workload beliefs</b> (Aaron Beck's CBT). The idea: write down the specific catastrophic thought driving the pressure to always be reachable - and test it against real, specific evidence.",
          "<b class='who'>Rohan</b> tries it. He writes down the thought driving his constant checking, word for word: \"if I don't respond within a few minutes, something will go badly wrong.\" Then he lists every time in the last month a delayed response actually caused a real problem. He can't think of one."
]
          },
          think: {
            mode: "tap",
            prompt: "What makes writing the thought down, word for word, useful here - rather than just generally knowing 'I feel anxious about responding fast'?",
            options: [
              opt("A specific, written thought can actually be tested against real evidence, while a vague feeling of anxiety can't be checked against anything concrete", true, "Right - \"if I don't respond immediately, something will go badly wrong\" is specific enough to check against a month of actual evidence; \"I feel anxious\" isn't specific enough to test against anything."),
              opt("Writing it down mostly just helps him remember it later", false, "The point isn't memory - it's that a specific, written claim becomes something that can actually be checked against real evidence, which a vague feeling can't."),
              opt("It doesn't really matter how specific the thought is, as long as he's aware of feeling anxious", false, "Vague awareness of anxiety can't be tested against evidence the way a specific, falsifiable claim can - the specificity is exactly what makes the technique work.")
            ],
            whyPrompt: "In a few words - why does a specific, written thought hold up to testing in a way a vague feeling doesn't?",
          },
          apply: {
            scenario: "Try the same tool. Think of a real moment recently when you felt pressure to respond to work immediately. Write down the specific catastrophic thought underneath it, then think honestly about what evidence you actually have for or against it.",
            prompt: "In two or three sentences: what was the specific thought, and what does the real evidence actually show?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the thought was written specifically enough to actually be checked against real evidence, not just restated as a general feeling."
          },
          remember: {
            prompt: "In a sentence or two: does naming the specific thought, rather than just the general anxious feeling, change how urgent it feels?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w4t2",
          title: "Tool - releasing tension you didn't notice building",
          role: "Technique #2 - Progressive Muscle Relaxation",
          delayedRef: "w4t1_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Second tool: <b>progressive muscle relaxation</b> (Edmund Jacobson, adapted into Applied Relaxation by Lars-Goran Ost). The idea: deliberately tense, then release, muscle groups in sequence - shoulders, jaw, hands - to notice and reduce tension that's built up without being consciously felt.",
          "Rohan tries a short version at his desk: tensing his shoulders hard for five seconds, then releasing. The release makes him realize how tight they'd actually been all morning - tension he hadn't noticed until it was gone."
]
          },
          think: {
            mode: "tap",
            prompt: "Why does deliberately tensing a muscle first, before releasing it, actually help - rather than just trying to relax directly?",
            options: [
              opt("The contrast between the deliberate tension and its release makes the relaxation more noticeable and complete than trying to relax a muscle that's already tense without a clear before-and-after", true, "Right - the deliberate tense-then-release cycle creates a clear, noticeable contrast, which is what makes the resulting relaxation more complete than simply trying to 'relax' a muscle that's already held tight."),
              opt("Tensing the muscle first doesn't actually add anything - relaxing directly would work the same way", false, "The deliberate tense-then-release contrast is the specific mechanism PMR relies on - it's not interchangeable with just trying to relax without the tensing step."),
              opt("It's mainly useful as a distraction from the stressful thought, not the physical tension itself", false, "PMR targets the physical tension directly, not as a distraction technique - the released tension is the actual outcome, not a side effect of being distracted.")
            ],
            whyPrompt: "In a few words - why might the deliberate tense-release contrast reveal tension that was otherwise unnoticed?",
          },
          apply: {
            scenario: "Try a short version yourself, right now if you can: pick one muscle group - shoulders, jaw, or hands - and deliberately tense it for five seconds, then release.",
            prompt: "In two or three sentences: what did you notice about the tension in that muscle group before you released it, if anything?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the useful signal is whether trying it revealed any tension that wasn't consciously noticed beforehand, which is common and exactly what the technique is built to surface."
          },
          remember: {
            prompt: "In a sentence or two: where do you think a quick PMR check-in during a stressful workday would actually be useful for you?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w4t3",
          title: "Tool - a boundary actually chosen, not defaulted to",
          role: "Technique #3 - Values-Based Boundary Setting",
          delayedRef: "w4t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Third tool: <b>values-based work-life boundary setting</b> (Steven Hayes, ACT). The idea: name what actually matters outside work, and use that to set one real, specific boundary - rather than letting work expand into whatever time is available.",
          "Rohan names something he actually values: dinner with his family, uninterrupted. He sets one specific boundary - phone off from 7 to 8pm, every weekday - and tells his team directly, rather than just quietly hoping to get away with it."
]
          },
          think: {
            mode: "tap",
            prompt: "What makes this boundary different from just generally 'trying to disconnect more'?",
            options: [
              opt("It's tied to a specific, named value (uninterrupted family dinner) and specified concretely (a fixed hour, told to his team) - which gives it something real to actually hold, rather than a vague intention", true, "Right - a vague intention to 'disconnect more' has nothing concrete to hold; a boundary tied to a named value and specified as a fixed, communicated hour is something that can actually be kept."),
              opt("It's basically the same as generally trying to disconnect more - the specificity doesn't add much", false, "The specificity is exactly what makes it workable - a vague intention tends to dissolve under pressure, while a named, communicated boundary has something concrete to hold to."),
              opt("The main benefit is telling his team, not the value or the specific hour", false, "Telling the team matters, but it's built on top of a boundary that's already specific and value-based - without that specificity, there'd be nothing concrete to communicate.")
            ],
            whyPrompt: "In a few words - why might naming a specific value first make a boundary easier to actually hold?",
          },
          apply: {
            scenario: "Try it yourself. Think of one thing you genuinely value outside of work, and one specific, concrete boundary that would actually protect time for it.",
            prompt: "In two or three sentences: what's the value, and what's the one specific boundary you'd set for it?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the boundary is specific and concrete enough to actually hold, rather than a general intention like 'work less.'"
          },
          remember: {
            prompt: "In a sentence or two: what usually gets in the way of you actually holding a boundary like that, once you've set it?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w4t4",
          title: "Tool - sorting the noise from the real priorities",
          role: "Technique #4 - Problem-Solving Worksheet",
          delayedRef: "w4t3_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Fourth tool: <b>a structured problem-solving worksheet for workload triage</b> (Thomas D'Zurilla and Marvin Goldfried, Social Problem-Solving Therapy). The idea: sort an overwhelming workload into what's actually urgent, what can wait, and what can be delegated or dropped.",
          "Rohan lists everything on his plate, unfiltered, then sorts each item into one of three columns. Out of eleven items, only two turn out to be genuinely urgent today. The rest had just been sitting in his head feeling equally pressing."
]
          },
          think: {
            mode: "tap",
            prompt: "What does going from '11 equally urgent things' to 'only 2 actually urgent today' actually show?",
            options: [
              opt("An unsorted workload tends to feel undifferentiated and equally pressing, even when the real priorities, once sorted, turn out to be a much smaller list", true, "Right - the felt sense of everything being equally urgent doesn't match the actual sorted priorities, which is exactly the gap the structured worksheet is built to reveal."),
              opt("It shows Rohan was exaggerating how much work he actually had", false, "The eleven items were real - sorting didn't remove any of them, it clarified which ones were genuinely urgent today versus which could wait or be delegated."),
              opt("It mainly proves he should just work faster to get through all eleven today", false, "The point of triage isn't speed - it's recognizing that most of the eleven items don't actually need to happen today at all, which is a different kind of relief than working faster.")
            ],
            whyPrompt: "In a few words - why might an unsorted workload feel more urgent, overall, than it actually is once triaged?",
          },
          apply: {
            scenario: "Try a quick version. Think of everything currently on your own plate at work, and sort it, even roughly, into urgent-today, can-wait, and could-be-delegated-or-dropped.",
            prompt: "In two or three sentences: what did the sorted version look like, compared to how it felt before you sorted it?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether sorting revealed a smaller real-priority list than the workload felt like before sorting, which is the common and intended effect."
          },
          remember: {
            prompt: "In a sentence or two: which of these four tools - the thought, the body, the boundary, or the triage - feels most useful for your actual work stress right now?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w4t5",
          title: "Check-in and pre-commitment - work stress",
          role: "Check-in & pre-commitment",
          delayedRef: "w4t4_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Four tools for work stress, now covered: naming the catastrophic thought (A1), releasing unnoticed tension (A2), setting a real boundary (A3), and sorting the real priorities from the noise (A4).",
          "They target different parts of the same pattern - a belief, a body, a boundary, and a workload - not four versions of the same fix. Most people find one or two land more than the others, and that's expected; you don't need to use all four equally."
]
          },
          think: {
            mode: "open",
            prompt: "Looking back at all four - which one, honestly, do you think you'd actually reach for first, in a real stressful moment at work? No wrong answer here.",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Pick the one tool from this week you're most likely to actually use again, on your own, before the module comes back to it in the reinforcement bank.",
            prompt: "In two or three sentences: which tool, and what's one specific, real moment this coming week where you could try it?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the plan names a specific, real moment, not a general intention to 'try to use it sometime.'"
          },
          remember: {
            prompt: "In a sentence or two: what would make you actually forget to try it, and is there anything that could help you remember?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: four tools for work stress - cognitive restructuring, progressive muscle relaxation, values-based boundaries, and structured problem-solving triage. Next week: burnout, and its own set of tools."
    },
    // WEEK 5: Burnout: the tools
    {
      num: 5,
      title: "Burnout: the tools",
      mechanism: "B",
      kind: "technique",
      retrievalCheck: null,
      touches: [
        {
          id: "w5t1",
          title: "Tool - scheduling small mastery and pleasure back in",
          role: "Technique #1 - Graded Behavioural Activation",
          delayedRef: "w4t5_apply",
          delayedPrompt: "Last touch, your plan was:",
          relate: {
            text: [
          "First tool for burnout: <b>graded behavioural activation, using mastery/pleasure activity scheduling</b> (Peter Lewinsohn; Christopher Martell, Sona Dimidjian, and Neil Jacobson). The idea: deliberately schedule small activities that bring a sense of mastery or genuine pleasure, starting small enough to actually follow through on, to counter burnout's pull toward withdrawal.",
          "<b class='who'>Ananya</b> picks something small and genuinely enjoyable - a fifteen-minute walk with a friend, twice a week - and puts it directly in her calendar, rather than waiting until she feels like it."
]
          },
          think: {
            mode: "tap",
            prompt: "Why schedule it directly in the calendar, rather than just planning to do it 'when there's time' or 'when she feels like it'?",
            options: [
              opt("Burnout's pull toward withdrawal means waiting for motivation or spare time tends to mean it never happens - scheduling it as a fixed commitment is what actually gets it done", true, "Right - burnout specifically produces withdrawal from anything not strictly necessary, so relying on feeling like it or finding spare time tends to lose out to that pull; a fixed schedule doesn't depend on motivation being present first."),
              opt("Scheduling it doesn't really matter, as long as she genuinely intends to do it", false, "Genuine intention alone tends to lose out to burnout's pull toward withdrawal - the scheduling is specifically what counters that pull, not the intention on its own."),
              opt("The main point is picking something enjoyable, not when it happens", false, "The enjoyment matters, but burnout research specifically points to scheduling as the mechanism that gets a small activity to actually happen, regardless of how enjoyable it is in theory.")
            ],
            whyPrompt: "In a few words - why does burnout's pull toward withdrawal make waiting for motivation an unreliable plan?",
          },
          apply: {
            scenario: "Try it yourself. Think of one small activity - something genuinely enjoyable, or something that gives you a real sense of accomplishing something, however small - that you could actually schedule this week.",
            prompt: "In two or three sentences: what's the activity, and when specifically would you actually put it in your week?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the plan names a specific time, not just a general intention to fit it in somewhere."
          },
          remember: {
            prompt: "In a sentence or two: what's usually the first thing that gets cut when you're feeling burned out - and is it exactly this kind of activity?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w5t2",
          title: "Tool - naming which part of burnout is actually present",
          role: "Technique #2 - MBI Psychoeducation",
          delayedRef: "w5t1_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Second tool: <b>psychoeducation using the Maslach Burnout Inventory framework</b> (Christina Maslach). The idea: understand burnout through its three recognized components - exhaustion, cynicism, and a sense of inefficacy - rather than treating it as one vague, undifferentiated feeling.",
          "Ananya goes through the three components honestly. Exhaustion: clearly present, most days. Cynicism: present, though less than she expected. Inefficacy - actually feeling ineffective at her work - turns out to be barely present at all. Naming the three separately makes the picture clearer than 'I'm just burned out' had."
]
          },
          think: {
            mode: "tap",
            prompt: "What does naming the three components separately actually add, compared to just saying 'I'm burned out'?",
            options: [
              opt("It reveals which specific components are actually present and to what degree, which a single undifferentiated label like 'burned out' doesn't distinguish", true, "Right - Ananya's exhaustion and cynicism were present but her inefficacy wasn't, which a single blended label wouldn't have surfaced - the three-part breakdown makes the actual pattern visible and trackable."),
              opt("It doesn't really add anything beyond just knowing she's burned out overall", false, "The breakdown specifically revealed that inefficacy was barely present while exhaustion and cynicism were, which a single overall label would have missed entirely."),
              opt("It mainly helps her explain her burnout to other people, not understand it herself", false, "The framework is primarily a tool for her own clearer understanding and tracking, not primarily for explaining it to others, though it could serve both.")
            ],
            whyPrompt: "In a few words - why might a single vague label like 'burned out' hide differences that actually matter?",
          },
          apply: {
            scenario: "Try it yourself. Go through the three components honestly for your own current state: exhaustion, cynicism toward work, and a sense of inefficacy.",
            prompt: "In two or three sentences: which of the three feels most present for you right now, and which feels least present?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the answer actually distinguishes between the three, rather than treating burnout as one blended feeling."
          },
          remember: {
            prompt: "In a sentence or two: does naming which component is strongest for you change what kind of recovery might actually help?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w5t3",
          title: "Tool - the understanding you'd offer someone else",
          role: "Technique #3 - Self-Compassion Practice",
          delayedRef: "w5t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Third tool: <b>self-compassion practice for burnout-related self-criticism</b> (Paul Gilbert, Compassion-Focused Therapy). The idea: notice the self-critical voice that often accompanies burnout, and deliberately offer yourself the same understanding you'd offer a colleague in the same position.",
          "Ananya notices the familiar thought - \"everyone else manages fine, what's wrong with me\" - and deliberately rewrites it as she would for a colleague: \"you're dealing with something real, and it makes sense that it's affecting you.\" Saying it to herself feels stranger than saying it to anyone else would."
]
          },
          think: {
            mode: "tap",
            prompt: "Why does the technique specifically use the frame of 'what would I say to a colleague', rather than just telling her to 'be kinder to herself'?",
            options: [
              opt("The colleague-frame gives a concrete, testable standard - most people already know exactly what fair, understanding language sounds like for someone else, even when it feels unreachable for themselves", true, "Right - 'be kinder to yourself' is vague and hard to act on directly, while 'what would I say to a colleague in this exact position' gives a concrete standard most people can actually generate, even when self-directed kindness feels harder to access."),
              opt("It mainly works because colleagues are less critical than family members would be", false, "The technique isn't specifically about colleagues being less critical - it's about using a fair, external standard of understanding that's easier to access than self-directed kindness, regardless of who the comparison person is."),
              opt("The frame doesn't really matter, as long as she tries to think positively", false, "Generic positive thinking isn't the same as the specific, concrete standard of fairness the colleague-frame provides - the specificity of the comparison is what makes the technique work.")
            ],
            whyPrompt: "In a few words - why might it be easier to generate fair, understanding language for someone else than for yourself, in the same position?",
          },
          apply: {
            scenario: "Try it yourself. Think of something you've been harshly self-critical about recently, related to work or burnout.",
            prompt: "In two or three sentences: what's the harsh version, and what would you actually say to a colleague going through the exact same thing?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the colleague-version is genuinely more understanding than the original self-directed version, not just a softer restatement of the same criticism."
          },
          remember: {
            prompt: "In a sentence or two: did saying the kinder version to yourself feel as natural as it would to say it to someone else - or did it feel strange, the way it did for Ananya?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w5t4",
          title: "Tool - a real pace, built around what matters",
          role: "Technique #4 - Values-Based Recovery Plan",
          delayedRef: "w5t3_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Fourth tool: <b>a values-based recovery and pacing plan</b> (Steven Hayes, ACT). The idea: build a real plan for recovery and pacing around what actually matters, rather than treating burnout as something to simply push through or wait out.",
          "Ananya builds hers around one value - staying genuinely present with her family in the evenings, not distracted or half-checked-out - and sets a realistic pace: no major new commitments at work for the next two months, while the small scheduled activities and self-compassion practice continue."
]
          },
          think: {
            mode: "tap",
            prompt: "What makes this plan a 'pace' rather than either pushing through or simply waiting it out?",
            options: [
              opt("It names something specific worth protecting energy for, and sets a deliberate, time-bound limit on new commitments - an active, chosen middle ground, not endurance and not passive waiting", true, "Right - pushing through would mean taking on more regardless, and waiting it out would mean doing nothing deliberate; this plan is an active, values-based middle path with a real, specific limit and a real, specific reason for it."),
              opt("It's basically the same as pushing through, just described more gently", false, "Pushing through means continuing to take on the same load regardless of the cost - this plan specifically limits new commitments for a set period, which is a real behavioral change, not a relabeling."),
              opt("It's basically the same as just waiting for the burnout to pass on its own", false, "Passively waiting involves no deliberate action - this plan actively sets a limit and names a specific value to protect energy for, which is a deliberate structure, not passive waiting.")
            ],
            whyPrompt: "In a few words - why might naming a specific value to protect make a recovery pace easier to actually hold to?",
          },
          apply: {
            scenario: "Try it yourself. Name one thing that actually matters to you that burnout has been crowding out, and one realistic, time-bound limit you could set to protect space for it.",
            prompt: "In two or three sentences: what's the value, and what's the specific limit?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the limit is specific and time-bound, rather than an open-ended intention to 'take it easier.'"
          },
          remember: {
            prompt: "In a sentence or two: which of these four burnout tools - scheduling, naming the components, self-compassion, or the recovery pace - feels most relevant to where you actually are right now?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w5t5",
          title: "Check-in and pre-commitment - burnout",
          role: "Check-in & pre-commitment",
          delayedRef: "w5t4_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Four tools for burnout, now covered: scheduling small mastery and pleasure back in (B1), naming which components are actually present (B2), offering yourself real understanding (B3), and building a values-based recovery pace (B4).",
          "Like last week's set, these target different levers on the same pattern - action, understanding, self-talk, and pacing - not four versions of one fix."
]
          },
          think: {
            mode: "open",
            prompt: "Looking back at all four - which one, honestly, do you think you'd actually reach for first, if burnout showed up for you? No wrong answer here.",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Pick the one tool from this week you're most likely to actually use again, on your own, before the module comes back to it in the reinforcement bank.",
            prompt: "In two or three sentences: which tool, and what's one specific, real moment this coming week where you could try it?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the plan names a specific, real moment, not a general intention to 'try to use it sometime.'"
          },
          remember: {
            prompt: "In a sentence or two: is there anything that could get in the way of actually trying it, and how would you handle that if it happens?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: four tools for burnout - graded behavioural activation, MBI psychoeducation, self-compassion, and a values-based recovery pace. Next week: overwork culture and work-life imbalance, including two tools that ask you to actually test being unavailable."
    },
    // WEEK 6: Overwork culture: the tools
    {
      num: 6,
      title: "Overwork culture: the tools",
      mechanism: "C",
      kind: "technique",
      retrievalCheck: null,
      touches: [
        {
          id: "w6t1",
          title: "Tool - a definition of success actually chosen",
          role: "Technique #1 - Values Clarification",
          delayedRef: "w5t5_apply",
          delayedPrompt: "Last touch, your plan was:",
          relate: {
            text: [
          "First tool for overwork culture: <b>values clarification to redefine 'success' beyond availability</b> (Kelly Wilson and Tobias Lundgren-style ACT values work). The idea: examine whether the definition of success currently being lived by actually matches your own real values, or was absorbed from hustle-culture norms without ever being chosen.",
          "<b class='who'>Siddharth</b> writes down what 'success' has meant to him in practice - constant availability, always reachable - then asks honestly whether that's something he'd choose if he thought about it directly, or something he inherited from the culture around him without ever examining it. He realizes he can't remember ever actually choosing it."
]
          },
          think: {
            mode: "tap",
            prompt: "What does 'I can't remember ever actually choosing it' actually reveal here?",
            options: [
              opt("The current definition of success was absorbed from surrounding norms rather than genuinely examined and chosen - which is exactly what values clarification is designed to surface", true, "Right - a definition of success that was never actually examined or chosen is a strong sign it was absorbed from hustle-culture norms rather than reflecting his own real values, which is the gap this technique is built to reveal."),
              opt("It shows he's simply forgetful, and probably did choose it at some point", false, "The exercise isn't about memory - the more likely explanation, and the one the technique targets, is that the definition was never actually examined or chosen in the first place, not that the choice happened but was forgotten."),
              opt("It doesn't really matter whether he chose it or absorbed it, as long as it's working for him", false, "The scenario is specifically about a definition of success that isn't working for him - constant availability with no room to disengage - which is exactly why examining whether it was chosen or absorbed matters here.")
            ],
            whyPrompt: "In a few words - why might a definition of success that was never actually examined be worth re-examining now?",
          },
          apply: {
            scenario: "Try it yourself. Write down what 'success' has actually meant in practice in your own work life, then ask honestly: did you choose that definition, or absorb it from somewhere?",
            prompt: "In two or three sentences: what's the definition you're actually living by, and where do you think it came from?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the answer honestly traces the definition to its source, rather than assuming it must be self-chosen simply because it's familiar."
          },
          remember: {
            prompt: "In a sentence or two: if you could redefine 'success' for yourself right now, with no outside pressure, what would you actually change about it?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w6t2",
          title: "Tool - testing the fear directly",
          role: "Technique #2 - Scheduled Disengagement (Behavioural Experiment)",
          delayedRef: "w6t1_apply",
          delayedPrompt: "Last touch, you wrote this:",
          guardrail: true,
          distressPrompt: "You just committed to a real test of being unavailable, even briefly. How are you feeling about it right now?",
          relate: {
            text: [
          "Second tool: <b>scheduled disengagement as a behavioural experiment testing feared consequences</b> (a Beck-style behavioural experiment, applied through Behavioural Activation). The idea: deliberately schedule a specific period of genuinely not checking messages, as a real experiment to test the feared consequence directly, rather than assuming it without ever checking.",
          "This is a real experiment, not just a reading exercise - so, like every guardrailed touch in this module, it checks in with you partway through. Choose the version you're actually ready to try; there's no wrong size here.",
          "<b class='who'>Siddharth</b> chooses a smaller version first: fifteen minutes, phone fully off, no checking. The fear shows up almost immediately - but so does the actual, uneventful outcome once the fifteen minutes pass."
]
          },
          think: {
            mode: "tap",
            prompt: "Why does the experiment need to be a real, scheduled period of disengagement, rather than just imagining what would happen?",
            options: [
              opt("The fear about being unavailable is untested because availability has never actually been suspended long enough to find out - only a real experiment produces real evidence, not imagined evidence", true, "Right - imagining an outcome isn't the same as testing it; the entire point of a behavioural experiment is that only a genuinely lived period of disengagement produces real evidence about what actually happens, which imagining it can't provide."),
              opt("Imagining the outcome would work just as well, since the point is mainly to reduce anxiety about it", false, "The point isn't just anxiety reduction in the moment - it's producing real evidence about what actually happens, which only an actual, lived experiment can provide, not an imagined one."),
              opt("The specific length of time doesn't matter, as long as he thinks about it seriously", false, "The length matters because it's what actually gets tested - a genuinely lived period of a specific length produces real evidence about that length of disengagement specifically, which thinking about it doesn't.")
            ],
            whyPrompt: "In a few words - why does only a real, lived period of disengagement count as actual evidence, rather than imagining it?",
          },
          apply: {
            scenario: "Now try scheduling a real version of this for yourself - a specific period of genuinely not checking work messages, starting soon if possible.",
            intensityPrompt: "Choose the version you're actually ready to try:",
            intensityOptions: [
          "Smaller version - schedule just 15 minutes of disengagement",
          "Bigger version - schedule a full hour or more"
],
            prompt: "In two or three sentences: when specifically will you try this, and what's the feared consequence you expect to test?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether a specific time and a specific feared consequence were both named, which is what makes it an actual, testable experiment rather than a vague intention."
          },
          remember: {
            prompt: "In a sentence or two: what do you honestly expect to happen during your scheduled disengagement - and what would it mean if nothing did?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w6t3",
          title: "Tool - building tolerance in small, real steps",
          role: "Technique #3 - Graded Exposure",
          delayedRef: "w6t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          guardrail: true,
          distressPrompt: "You just committed to another real step of being unavailable. How are you feeling about it right now?",
          relate: {
            text: [
          "Third tool: <b>graded exposure to 'being unavailable', starting with small increments</b> (Wolpe-style graded exposure). The idea: build up tolerance for being unavailable gradually - ten unmonitored minutes before a full evening - rather than attempting a large disengagement all at once.",
          "Like the last touch, this is a real experiment, and it checks in with you partway through too.",
          "<b class='who'>Siddharth</b>, a few days after his first fifteen-minute test, tries something slightly bigger: leaving his phone in another room for a full hour during dinner. The guilt shows up again, on schedule - but so does another uneventful outcome."
]
          },
          think: {
            mode: "tap",
            prompt: "Why start with a small increment (fifteen minutes, then an hour) rather than attempting a full evening or weekend right away?",
            options: [
              opt("A large, sudden disengagement can feel too anxiety-provoking to actually sustain, while small, graded increments make the discomfort manageable and let real tolerance build gradually", true, "Right - graded exposure specifically works by building tolerance in small, sustainable steps; attempting a large disengagement immediately risks feeling too overwhelming to actually follow through on, which would undercut the whole experiment."),
              opt("Starting small doesn't really matter, as long as he eventually gets to a full evening or more", false, "The gradual pacing is the actual mechanism here, not just a stepping stone to skip through - starting too big risks the discomfort being unsustainable, which the small-increment structure is specifically designed to avoid."),
              opt("The main reason is to avoid missing anything genuinely important at work", false, "The technique isn't primarily about minimizing missed work - it's about building real tolerance for the discomfort of being unavailable, gradually, which is a different goal than avoiding missed messages.")
            ],
            whyPrompt: "In a few words - why might a small, graded increment build more lasting tolerance than one large attempt?",
          },
          apply: {
            scenario: "Try planning your own next, slightly bigger step of disengagement, building on whatever you tried in the last touch.",
            intensityPrompt: "Choose the version you're actually ready to try:",
            intensityOptions: [
          "Smaller version - ten minutes unmonitored",
          "Bigger version - a longer stretch, maybe a full evening"
],
            prompt: "In two or three sentences: what's the next step, and how does it compare to what you tried before?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the next step is genuinely graded (a real but manageable increase), rather than either staying exactly the same or jumping too far too fast."
          },
          remember: {
            prompt: "In a sentence or two: has the guilt itself changed at all across these small tests, even if it hasn't disappeared?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w6t4",
          title: "Check-in - overwork culture",
          role: "Check-in",
          delayedRef: "w6t3_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Three tools for overwork culture, now covered: re-examining the definition of success driving the pattern (C1), and two real experiments testing the fear of being unavailable (C2, C3).",
          "The two experiments in particular ask something different from most tools in this module so far - not examining or naming a belief, but actually doing something uncomfortable on purpose. That's worth a direct, honest check-in before moving on, separate from committing to anything further."
]
          },
          think: {
            mode: "open",
            prompt: "Honestly - how did the two disengagement experiments actually go for you, compared to what you expected going in?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Take a moment to look back at both experiments from this week - the smaller one and the one after it - as a pair, not separately.",
            prompt: "In two or three sentences: looking at both together, what's the clearest thing they showed you about the gap between the feared consequence and what actually happened?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the answer looks at the pattern across both experiments together, not just repeats what happened in one of them."
          },
          remember: {
            prompt: "In a sentence or two: is there any part of this that still feels genuinely unresolved, or that you'd want to come back to?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w6t5",
          title: "Pre-commitment - overwork culture",
          role: "Pre-commitment",
          delayedRef: "w6t4_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "One more, real commitment before this week closes. The definition-of-success work (C1) and the two disengagement experiments (C2, C3) work best together - a chosen value, tested against real, small evidence that the fear doesn't hold up the way it feels like it should.",
          "This is the moment to actually commit to one more step, specific enough that you could genuinely follow through on it."
]
          },
          think: {
            mode: "open",
            prompt: "Of the three tools this week, which one - or which combination - do you think would actually make the most real difference for you going forward?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Commit to one specific, real next step - either a slightly bigger disengagement experiment, or a concrete way to hold the redefined value from C1 - before the module comes back to this in the reinforcement bank.",
            prompt: "In two or three sentences: what's the specific commitment, and when will you actually try it?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the commitment names a specific action and timing, not a general intention to 'keep working on it.'"
          },
          remember: {
            prompt: "In a sentence or two: what would genuinely following through on this commitment mean to you, beyond just completing it?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: three tools for overwork culture - values clarification, and two real, graded experiments testing the fear of being unavailable. Next week: bringing all three patterns - work stress, burnout, and overwork culture - together."
    },
    // WEEK 7: Bringing it together
    {
      num: 7,
      title: "Bringing it together",
      mechanism: "both",
      kind: "integration",
      retrievalCheck: {
        "prompt1": "Without looking back: what's the actual difference between ordinary work stress and the belief that drives it, versus the workload itself?",
        "prompt2": "And separately: what's the real difference between examining a definition of success (like C1) and actually testing it through a real experiment (like C2 or C3)?",
        "reveal": "Work stress (Week 1 / A1): the workload itself is often less the problem than an unexamined belief - that any delay carries serious consequences - which makes ordinary demands feel more urgent than they actually are once tested. Overwork culture (Week 6 / C1-C3): examining a definition of success can reveal it was absorbed rather than chosen, but that recognition alone doesn't test whether the feared consequences of changing it are real - only an actual, lived experiment, even a small one, produces genuine evidence either way."
},
      touches: [
        {
          id: "w7t1",
          title: "Work stress, one more time - now with the tools available",
          role: "Integration - Work Stress",
          delayedRef: "w6t5_apply",
          delayedPrompt: "Last touch, your commitment was:",
          relate: {
            text: [
          "One last look at each pattern, now with the actual tools in hand.",
          "<b class='who'>Rohan</b>, weeks later, notices the old always-on pull returning during a genuinely demanding sprint at work. This time, instead of just checking constantly, he catches the thought driving it, writes it down, and checks it against the evidence - the same tool from Week 4, used on his own, unprompted."
]
          },
          think: {
            mode: "tap",
            prompt: "What's actually different about this moment, compared to Week 1's version of Rohan?",
            options: [
              opt("The pull toward constant checking still shows up under real pressure, but he now has a specific tool to actually work with it, rather than just being carried along by it unnoticed", true, "Right - the pressure and the pull haven't disappeared, which is realistic; what's changed is that he now has a specific, learnable response available, rather than the unnoticed, unexamined pattern from Week 1."),
              opt("The pull toward constant checking has disappeared entirely now that he has the tools", false, "The scenario shows the old pull returning under pressure - the tools don't eliminate the pattern, they give him something specific to do with it when it shows up."),
              opt("This sprint is simply less demanding than what he was dealing with in Week 1", false, "The scenario specifically describes this as a genuinely demanding sprint - the difference isn't the demand level, it's that he now has a specific tool available to work with the pull it produces.")
            ],
            whyPrompt: "In a few words - why might having a specific tool matter more than the pressure itself disappearing?",
          },
          apply: {
            scenario: "Think of your own version: a moment where old work-stress pressure could show up again for you, even after these tools.",
            prompt: "In two or three sentences: which specific tool from Weeks 4 would you actually reach for in that moment?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether a specific tool is named, tied to a real, plausible moment, not a general statement that things will be fine now."
          },
          remember: {
            prompt: "In a sentence or two: what would it look like to notice the pull early, the way Rohan did, rather than only after it's already built up?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w7t2",
          title: "Burnout, one more time - now with the tools available",
          role: "Integration - Burnout",
          delayedRef: "w7t1_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "<b class='who'>Ananya</b>, a few weeks into using her recovery pace, notices the familiar flat exhaustion creeping back after a particularly hard stretch at work. This time she names it directly - using the three-component framework from Week 5 - rather than letting it sit as one vague, undifferentiated feeling.",
          "She finds cynicism creeping back in more than exhaustion this time, which is different from before, and adjusts what she leans on accordingly - more self-compassion practice, less new activity scheduling, since withdrawal isn't actually the main issue right now."
]
          },
          think: {
            mode: "tap",
            prompt: "Why does it matter that Ananya's pattern this time is different (more cynicism, less exhaustion) from before?",
            options: [
              opt("Because the three-component framework lets her notice the specific shape of what's actually present this time, and adjust which tool she leans on accordingly, rather than reaching for the same fix regardless of what's actually happening", true, "Right - the point of naming the components separately is exactly this kind of responsiveness: recognizing that this recurrence looks different from before, and adjusting the response rather than defaulting to whichever tool worked last time."),
              opt("It doesn't really matter which component is stronger, since all four tools work the same way regardless", false, "The scenario specifically shows her choosing differently based on what's actually present this time - the tools aren't interchangeable regardless of which component dominates."),
              opt("It mainly shows that her burnout is getting worse over time", false, "A different pattern of symptoms isn't the same as worsening burnout - it's a different, real presentation that calls for a different specific response, which is what the framework is designed to help her see.")
            ],
            whyPrompt: "In a few words - why might naming which specific component is present help someone choose a more fitting response?",
          },
          apply: {
            scenario: "Think of your own version: if burnout-like exhaustion or cynicism showed up for you again in the future, in a somewhat different shape than before.",
            prompt: "In two or three sentences: which of the four burnout tools would you expect to reach for, and how would you decide?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the answer connects the choice of tool to noticing which component is actually present, rather than picking one arbitrarily."
          },
          remember: {
            prompt: "In a sentence or two: what would help you notice a shift like this early, before it builds for weeks the way it did the first time?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w7t3",
          title: "Overwork culture, one more time - now with the tools available",
          role: "Integration - Overwork Culture",
          delayedRef: "w7t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "<b class='who'>Siddharth</b>, a month after his first small disengagement tests, has worked up to a full unmonitored evening most weeks - still uncomfortable sometimes, but no longer avoided entirely. A new, bigger test comes up: a full weekend away, no phone at all.",
          "The old guilt shows up immediately, just as strong as it was for the fifteen-minute version months ago. But this time, he recognizes it for what it is - a conditioned response to an absorbed norm, not a reliable signal - and goes ahead with the weekend anyway."
]
          },
          think: {
            mode: "tap",
            prompt: "Why is it worth noting that the guilt is 'just as strong' even after months of successful small tests?",
            options: [
              opt("It shows the guilt itself doesn't necessarily fade just from repeated evidence that nothing goes wrong - what changes is his relationship to it, recognizing it as an unreliable signal rather than needing it to disappear before acting", true, "Right - this is an important, realistic point: the feeling itself may not diminish much, but what genuinely changes with practice is being able to recognize it and act anyway, rather than needing the guilt to go away first."),
              opt("It suggests the graded exposure tool hasn't actually worked, since the guilt hasn't gotten smaller", false, "The tool's real success isn't measured by the guilt disappearing - it's measured by being able to act despite it, which is exactly what's happening here, even with the guilt still present."),
              opt("It means the bigger test is probably too risky to attempt yet", false, "The scenario doesn't suggest the test is unsafe - it shows a familiar, expected guilt response to a bigger step, which graded exposure is specifically built to help someone move through, not avoid.")
            ],
            whyPrompt: "In a few words - why might successfully acting despite a feeling matter more than the feeling itself shrinking?",
          },
          apply: {
            scenario: "Think of your own version: a bigger step of disengagement or boundary-setting you might genuinely want to try, once you've had some practice with smaller ones.",
            prompt: "In two or three sentences: what would that bigger step look like, and what do you expect the guilt or discomfort to feel like when it shows up?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the answer expects the discomfort to still be genuinely present, rather than assuming practice will have eliminated it."
          },
          remember: {
            prompt: "In a sentence or two: what does it mean to you that the guilt might not fully go away, even once the pattern itself has genuinely shifted?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w7t4",
          title: "When all three show up at once",
          role: "Integration - Combined Pattern",
          delayedRef: "w7t3_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "One more scenario, and this one's new - a fresh character, since these three patterns often show up together, not one at a time.",
          "<b class='who'>Meera</b> is in the middle of a hard quarter: tight deadlines driving constant checking (work stress), a growing flatness and cynicism she hasn't quite named yet (possible burnout), and a nagging sense that she hasn't taken a real day off in months because being unavailable feels unthinkable (overwork culture) - all three, showing up in the same week."
]
          },
          think: {
            mode: "tap",
            prompt: "Given everything covered across this module, what would actually make sense as Meera's first move - not all eleven tools at once?",
            options: [
              opt("Start with whichever single pattern feels clearest or most pressing right now, and use one specific tool for it - the three patterns are related but distinct, and trying to address all of them simultaneously isn't necessary or realistic", true, "Right - the module has treated these as three real, distinct patterns throughout, not one blended problem requiring every tool at once; picking one clear starting point with one specific tool is a realistic, workable first move."),
              opt("She needs to use all eleven techniques simultaneously to make real progress", false, "Nothing in the module suggests all eleven techniques need to be used at once - each mechanism's tools work on its own pattern, and starting with one clear entry point is realistic, not a lesser approach."),
              opt("Since the three patterns are appearing together, they must actually be one single problem requiring one single fix", false, "The module has consistently treated work stress, burnout, and overwork culture as three related but genuinely distinct patterns, even when they show up together, which is exactly what's happening for Meera here.")
            ],
            whyPrompt: "In a few words - why might picking one clear starting point make more sense than trying to address all three patterns at once?",
          },
          apply: {
            scenario: "Put yourself in Meera's position, or think of a stretch in your own life where more than one of these three patterns showed up together.",
            prompt: "In two or three sentences: which one pattern would you actually start with, and which one tool from this module would you use for it?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether one clear, specific starting point is named, rather than an attempt to address everything simultaneously."
          },
          remember: {
            prompt: "In a sentence or two: has more than one of these three patterns ever actually shown up together for you, the way they have for Meera?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w7t5",
          title: "On your own - no options, no hints",
          role: "Unscaffolded Transfer Test",
          delayedRef: "w7t4_apply",
          delayedPrompt: "Last touch, you wrote this:",
          transferTest: true,
          relate: {
            text: [
          "Last one, and it's different from everything before it: no tap options this time, and no hints about which pattern or which tool applies. Just a real scenario, and your own read on it.",
          "<b class='who'>Kabir</b>, a colleague of Meera's, mentions offhand that he's been feeling strange lately - fine at work most days, technically, but genuinely can't remember the last time he felt anything other than tired and a little distant from a job he used to care about. He also mentions, almost as an aside, that he hasn't taken a weekend fully off in as long as he can remember, and the idea of doing so honestly makes him uneasy."
]
          },
          think: {
            mode: "open",
            prompt: "Before writing anything for Kabir directly: in your own words, first pass, what does this actually sound like to you?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Kabir hasn't asked for advice directly - but you're genuinely trying to understand what's actually going on for him, using everything from this module.",
            prompt: "In three or four sentences, entirely in your own words: what pattern or patterns do you think are actually present for Kabir, and what would you genuinely suggest he try first, and why?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - a strong answer would likely name burnout (the exhaustion and cynicism despite otherwise functioning at work) and overwork culture (the unease at the idea of a full weekend off) as both plausibly present, and suggest starting with one specific, named tool rather than everything at once - the same reasoning practiced across Weeks 1 through 7, now applied without any options to choose from."
          },
          remember: {
            prompt: "In a sentence or two: of everything across these seven weeks, what's the one idea you'd actually want to remember, even a year from now?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: bringing work stress, burnout, and overwork culture together - how they show up together in practice, and a final, unscaffolded scenario with no options and no hints, to test what's actually stuck."
    }
  ],
  reinforcementBank: [
    {
      code: "A1",
      rep: 1,
      type: 'reflection',
      scenario: "A colleague mentions they've been responding to work messages within minutes, even at midnight, 'just in case.'",
      prompt: "What specific catastrophic thought is probably driving that, and what evidence would actually test it?",
      reveal: "Something like: the underlying thought is likely close to 'if I don't respond immediately, something will go badly wrong' - and the real test is simply looking back at how many delayed responses have actually caused a serious problem, which for most people is close to none."
    },
    {
      code: "A1",
      rep: 2,
      type: 'reflection',
      scenario: "You notice yourself checking your phone the moment you wake up, before even getting out of bed, for work messages specifically.",
      prompt: "What's the specific thought underneath that habit, and what does the honest evidence actually say about it?",
      reveal: "There's no single model answer here - the tell is whether a specific, testable thought was named and actually checked against real evidence, not just relabeled as 'anxiety.'"
    },
    {
      code: "A3",
      rep: 1,
      type: 'reflection',
      scenario: "A friend says they keep meaning to protect their evenings for something that matters to them, but it never actually happens, week after week.",
      prompt: "What's missing from 'meaning to protect' that a real, values-based boundary would actually include?",
      reveal: "Something like: a specific, named value, and a concrete, communicated boundary tied to it - a fixed time, told to the people it affects - rather than a general intention, which tends to dissolve under pressure."
    },
    {
      code: "A3",
      rep: 2,
      type: 'reflection',
      scenario: "Think of a time recently when work expanded to fill time you'd actually wanted to protect for something else.",
      prompt: "What value was that time actually meant to protect, and what specific boundary might have held it?",
      reveal: "There's no single model answer here - the tell is a specific, nameable value paired with a concrete boundary, not a vague wish for 'more balance.'"
    },
    {
      code: "A4",
      rep: 1,
      type: 'reflection',
      scenario: "Someone describes their to-do list as 'everything is on fire, all the time' - fifteen items, all feeling equally urgent.",
      prompt: "What would sorting that list into urgent-today, can-wait, and delegate-or-drop likely reveal, based on what this technique tends to show?",
      reveal: "Something like: an unsorted list of fifteen items that all feel equally urgent usually turns out, once actually triaged, to have only a small handful that are genuinely urgent today - the felt urgency and the real priority list rarely match until they're actually sorted."
    },
    {
      code: "A4",
      rep: 2,
      type: 'reflection',
      scenario: "Try this for real: list what's actually on your plate right now, and sort it into the three columns, even roughly.",
      prompt: "What did the sorted version look like, and how many items actually landed in 'urgent today'?",
      reveal: "There's no single model answer here - the tell is an honest, specific sort, not a list where everything ends up back in the 'urgent' column by default."
    },
    {
      code: "B2",
      rep: 1,
      type: 'reflection',
      scenario: "A friend says 'I'm just burned out' and leaves it at that, without saying more.",
      prompt: "What would asking them to separate that into exhaustion, cynicism, and inefficacy likely reveal, and why would it be useful to ask?",
      reveal: "Something like: the three components often aren't equally present - someone might have real exhaustion with little cynicism, or the reverse - and naming which is which usually reveals a clearer, more specific picture than 'burned out' alone."
    },
    {
      code: "B2",
      rep: 2,
      type: 'reflection',
      scenario: "Go through the three components honestly for yourself again, right now, separate from Week 5's first pass.",
      prompt: "Has the balance between the three shifted at all since you first did this - and if so, how?",
      reveal: "There's no single model answer here - the tell is an honest comparison to the earlier pass, not a repeat of the same answer without actually checking whether anything's changed."
    },
    {
      code: "B3",
      rep: 1,
      type: 'reflection',
      scenario: "You catch yourself thinking, 'I should be handling this better than I am' about something genuinely difficult.",
      prompt: "What would you actually say to a colleague who told you they were struggling with the exact same thing?",
      reveal: "Something like: most people can generate real, fair understanding for a colleague far more easily than for themselves - the useful move is noticing that gap and offering yourself the colleague-version instead of the harsher, self-directed one."
    },
    {
      code: "B3",
      rep: 2,
      type: 'reflection',
      scenario: "Think of the harshest thing you've said to yourself about burnout or exhaustion in the past week.",
      prompt: "Rewrite it as you would say it to a colleague in the exact same position.",
      reveal: "There's no single model answer here - the tell is whether the rewritten version is genuinely more understanding, not a softened version of the same underlying criticism."
    },
    {
      code: "B4",
      rep: 1,
      type: 'reflection',
      scenario: "Someone says they know they need to 'take it easier' but can't say what that would actually look like in practice.",
      prompt: "What would turning 'take it easier' into an actual values-based pace plan look like for them?",
      reveal: "Something like: naming one specific thing that actually matters enough to protect energy for, and setting one real, time-bound limit tied to it - not a vague intention, but a concrete, plannable pace."
    },
    {
      code: "B4",
      rep: 2,
      type: 'reflection',
      scenario: "Revisit your own recovery pace plan from Week 5.",
      prompt: "Is the limit you set still holding, or has it quietly slipped - and if it's slipped, what would it take to reset it?",
      reveal: "There's no single model answer here - the tell is an honest check on whether the plan is actually being followed, not just restating the original plan as if nothing has changed."
    },
    {
      code: "C1",
      rep: 1,
      type: 'reflection',
      scenario: "A colleague says their idea of doing well at work has always just meant 'being available whenever needed' - they've never really thought about it beyond that.",
      prompt: "What would it look like to actually examine whether that definition was chosen or absorbed?",
      reveal: "Something like: asking directly whether they can remember choosing that definition, or whether it was picked up from the culture around them without ever being examined - which is usually the more honest answer, and the starting point for redefining it deliberately."
    },
    {
      code: "C1",
      rep: 2,
      type: 'reflection',
      scenario: "Revisit your own definition of success from Week 6.",
      prompt: "Has anything about it shifted since you first wrote it down - even slightly?",
      reveal: "There's no single model answer here - the tell is an honest, specific comparison to the original answer, not a repeated restatement of it."
    }
  ],
  toolsData: {
    "pmr": {
      code: "A2",
      title: "Progressive Muscle Relaxation",
      mechShort: "Work Stress",
      kind: "log_single",
      intro: "A quick log for whenever you actually notice physical tension building - shoulders, jaw, hands - and use a short tense-and-release to work with it, the way Rohan did in Week 4.",
      logLabel: "What did you notice, and where?",
      firstPlaceholder: "e.g. Shoulders were tight before a meeting - tensed and released for about 10 seconds, noticed them drop noticeably afterward.",
      placeholder: "Your answer..."
    },
    "activity_scheduling": {
      code: "B1",
      title: "Mastery/Pleasure Activity Scheduling",
      mechShort: "Burnout",
      kind: "log_single",
      intro: "A quick log for the small, scheduled activities from Week 5 - whatever you actually put in your week to counter burnout's pull toward withdrawal, and how it went.",
      logLabel: "What did you schedule, and how did it actually go?",
      firstPlaceholder: "e.g. Fifteen-minute walk with a friend, Tuesday evening - almost cancelled it, went anyway, genuinely glad afterward.",
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
    tier1: "Any statement connecting work pressure or burnout to intent or a plan to end one's life or self-harm (\"I can't keep doing this, I want it to stop\", \"I have a way to end it\").",
    tier2: "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary, real exhaustion of work stress or burnout, which is what this module is specifically designed to help with. Also watch for language suggesting a genuinely unsafe or exploitative work situation - being denied basic rest, threats tied to taking leave, or conditions beyond ordinary high-pressure work - since this module is built for real but ordinary work stress and burnout, not for situations involving workplace exploitation or abuse, which need a different kind of support.",
    systemPrompt: `You are a safety classifier inside a mental-health support app used in India. Classify the user's message into exactly one of: NONE, TIER1, TIER2.

TIER1 definition: Any statement connecting work pressure or burnout to intent or a plan to end one's life or self-harm ("I can't keep doing this, I want it to stop", "I have a way to end it").
TIER2 definition: Persistent hopelessness about life broadly, or real functional collapse - not the ordinary, real exhaustion of work stress or burnout, which is what this module is specifically designed to help with. Also watch for language suggesting a genuinely unsafe or exploitative work situation - being denied basic rest, threats tied to taking leave, or conditions beyond ordinary high-pressure work - since this module is built for real but ordinary work stress and burnout, not for situations involving workplace exploitation or abuse, which need a different kind of support.

Critical context 1: many people, especially in Indian English, use hyperbolic or idiomatic self-deprecating language that is NOT a genuine risk signal - for example "this deadline is killing me", "my boss will murder me if this is late". Do NOT classify ordinary hyperbole, jokes, or figures of speech as TIER1 or TIER2, even if they contain words like "kill", "die", or "worthless".

Critical context 2 (specific to this module): this module's content is about real work stress and burnout. Genuine exhaustion, cynicism, or overwhelm about work is not itself a risk signal, and should be classified NONE. However, if a message suggests a genuinely unsafe or exploitative work situation - being denied basic rest, threats tied to taking leave, or conditions beyond ordinary high-pressure work - treat this with the same seriousness as TIER1/TIER2 risk language, even if it doesn't fit the self-harm-specific definitions exactly, and flag it clearly in your reason field as a workplace-safety concern distinct from ordinary burnout.

Only classify as TIER1 if there is a genuine indication of intent, a plan, or serious risk to someone's life or safety. Only classify as TIER2 if there is genuine persistent hopelessness about life broadly, real functional collapse, or the workplace-safety concern described above - not the ordinary, real exhaustion of work stress or burnout, which is what this module is designed to help with.

When genuinely uncertain, prefer the lower tier (or NONE) rather than over-triggering - but never downgrade language that includes a specific plan, method, timeframe, or indication of an unsafe work situation.

Respond with ONLY a raw JSON object, no markdown fences, no other text: {"tier": "NONE" | "TIER1" | "TIER2", "reason": "one short clause"}`,
    tier1FallbackWords: ["going to kill myself","planning to end my life","don't want to wake up tomorrow","have a plan to end my life","going to end it all tonight"],
    tier2FallbackWords: ["i am worthless","i feel like a burden to everyone","i hate who i am","there is no point in trying anymore","i can't live like this"]
  },
  openQuestions: [
    {
      area: "Clinical",
      text: "All 11 practicable technique mappings are my synthesis of the taxonomy's named sources - not clinician-reviewed."
    },
    {
      area: "Clinical",
      text: "Tier 1/2 escalation definitions for this module are a first draft, awaiting sign-off - including the addition distinguishing ordinary work stress/burnout from a genuinely unsafe or exploitative work situation, which deserves specific review."
    },
    {
      area: "Structural note - well-established 3-mechanism convention",
      text: "This module uses the retrieval-check convention already validated across four prior 3-mechanism modules (Anxiety & Worry, Judged & Compared, Autonomy & Boundaries, Conflict & Communication): first check opens at Week 4 (the first technique week), testing mechanisms A and B; final check opens at Week 7 (the last week), retesting mechanism A plus the remaining mechanism C. Unlike the 2-mechanism convention flagged repeatedly since Module 12, this pattern has real, repeated precedent and does not carry the same unconfirmed-assumption risk."
    },
    {
      area: "Structural note - reused T resolutions",
      text: "Mechanisms A and B (both T=4) use the standard combined check-in/pre-commitment resolution. Mechanism C (T=3, 2 of 3 guardrailed) uses the standard exact-fit resolution regardless of guardrail count, same as established since Module 11. No new structural cases."
    },
    {
      area: "Structural note - two guardrails in one mechanism, both behavioral-experiment style",
      text: "Mechanism C's two [B] techniques (C2, C3) are both structured around deliberately testing or building tolerance for being unavailable - a genuinely different guardrail flavor than the disclosure/vulnerability-style guardrails seen in most prior modules (naming an internalized belief, examining a painful pattern). These ask the person to actually do something uncomfortable (disengage, be unreachable) rather than examine or name something. Worth confirming the standard intensity-choice-plus-distress-check-in mechanic is the right guardrail shape for this different kind of technique, or whether a real behavioral experiment needs a different check-in structure."
    },
    {
      area: "Content decision - representation gap",
      text: "This module's scenarios are written for urban, white-collar, always-connected work - deadlines, messaging expectations, commutes. It doesn't address non-white-collar or informal-sector work stress, which involves real but different pressures (job insecurity, physical demands, lack of any leave policy to even push back against). Flagged explicitly as a representation gap, not just a generic disclaimer."
    },
    {
      area: "Content decision, bank composition",
      text: "With 2 of 11 techniques guardrail-excluded (C2, C3) and no technique matching either the Module 5 deep-exploration exception or the Module 15 normalizing-psychoeducation exception, 9 of 11 practicable techniques are eligible for the Reinforcement Bank, and all 9 were included. Reflections = A1, A3, A4, B2, B3, B4, C1 (7 techniques, 14 reps); Tools = A2, B1 (2 techniques, quick in-the-moment practices - PMR and activity scheduling)."
    },
    {
      area: "Content-authorship, recurring techniques",
      text: "Beck's CBT appears once (A1) but the Beck-style behavioural-experiment framing recurs in C2. Hayes's ACT appears three times within this module (A3, B4, C1), the most repetition of a single approach within one module so far - each with different scenarios per standing practice, but worth flagging given the count."
    },
    {
      area: "Resolved",
      text: "Crisis helpline numbers reused from Modules 1-17 (KIRAN, TeleMANAS, Vandrevala Foundation) - national, not module-specific."
    },
    {
      area: "Resolved",
      text: "Escalation UX follows the shared decisions documented in Module 3's dev guide, section 5 - not re-derived here, except for the module-specific addition in BRIEF.escalation.tier2 above."
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
