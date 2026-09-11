import { ModuleContent } from '../../../types/moduleContent';

function opt(label: string, isTarget: boolean, explain: string) {
  return { label, isTarget, explain };
}

export const MODULE_17_CONTENT: ModuleContent = {
  moduleId: 'M17',
  slug: 'communication-intimacy',
  name: 'Communication & Intimacy',
  duration_weeks: 5,
  tier: 'Core - 349 rupees - Relationships domain',
  brief: {
    moduleName: "Communication & Intimacy",
    moduleNumber: 17,
    tier: "Core - 349 rupees - Relationships domain",
    scenarioSource: "Pan-India, English-medium context (per product decision) - difficulty raising hard topics with a partner to avoid conflict, and discomfort or distress around physical and emotional intimacy, including the cultural silence around discussing sex and mismatched expectations that can surface after marriage. Language is English-medium throughout; content has not yet been reviewed for phrasing that reads as metro-specific, and Mechanism B in particular has not been reviewed by anyone with clinical experience in sex therapy specifically - flagged in OPEN_QUESTIONS as a priority.",
    mechanisms: [
      {
        key: "A",
        name: "Communication Difficulties",
        short: "Communication Difficulties",
        def: "Difficulty expressing needs to a partner - often showing up as avoiding difficult conversations to keep the peace.",
        need: "Connection",
        contrast: {
          who: "Aparna",
          text: "used to avoid raising anything difficult with her partner too - but she's found a way to actually say the hard thing early and gently, rather than letting it build until avoiding it costs more than saying it ever would have."
        },
        techniques: [
          {
            code: "A1",
            approach: "Gottman Method",
            format: "A",
            name: "Gottman-Informed 'I-Statements' and the Soft Start-Up Technique",
            source: "John Gottman",
            what: "Raising a difficult topic using an 'I-statement' - naming your own feeling and need, rather than a 'you' statement that can land as blame - and starting the conversation gently, in the first few seconds, since Gottman's research found how a conversation opens strongly predicts how it goes.",
            how: "A conversation that opens with blame or criticism tends to trigger defensiveness immediately, before the actual issue has even been raised. A soft start-up, focused on your own feeling and need, gives the conversation a real chance.",
            why: "Addresses how a difficult conversation actually begins, which often determines everything that follows."
          },
          {
            code: "A2",
            approach: "Person-Centred Therapy",
            format: "A",
            name: "Active-Listening Drills",
            source: "Carl Rogers's reflective-listening model",
            what: "Practicing reflecting back what a partner has actually said, in your own words, before responding - checking you've understood before adding your own view.",
            how: "In a difficult conversation, people often formulate their response while the other person is still talking, which means real listening stops early. Reflecting back first forces a pause that actual listening requires.",
            why: "Works on the listening side of a hard conversation, which is a different skill than the raising-the-topic skill in A1."
          },
          {
            code: "A3",
            approach: "IPT",
            format: "A",
            name: "Interpersonal Communication Skill-Building",
            source: "Gerald Klerman and Myrna Weissman, Interpersonal Psychotherapy",
            what: "Identifying a specific, recurring communication pattern in the relationship - who tends to raise issues, who tends to go quiet, what usually happens next - and naming a concrete change to try in that specific pattern.",
            how: "Communication difficulties often follow a recognizable, repeating pattern rather than being random each time. Naming the actual pattern makes it possible to interrupt deliberately, rather than reacting the same way each time.",
            why: "Works with the relationship's actual communication pattern over time, which is a different level than a single conversation's opening (A1) or a single moment of listening (A2)."
          },
          {
            code: "A4",
            approach: "CBT",
            format: "A",
            name: "Cognitive Restructuring of Conflict-Avoidance Beliefs",
            source: "Aaron Beck",
            what: "Writing down the specific belief driving the avoidance - \"raising this will ruin things,\" \"it's not worth the fight\" - and testing it against real, specific evidence, the way any other automatic thought would be tested.",
            how: "Avoidance is often driven by a catastrophic prediction about what raising the topic will cause, which rarely gets tested against what actually tends to happen when hard things do get raised.",
            why: "Targets the belief underneath the avoidance directly, which is a different target than the practical skills in A1-A3."
          }
        ]
      },
      {
        key: "B",
        name: "Intimacy & Sexual Concerns",
        short: "Intimacy & Sexual Concerns",
        def: "Difficulty or distress around physical or emotional intimacy in a relationship - including discomfort discussing sex due to cultural silence, and mismatched expectations that can surface after marriage.",
        need: "Connection, Safety",
        contrast: {
          who: "Sonali",
          text: "grew up with the same cultural silence around sex, the same real discomfort even naming the topic - but she's found a way to talk about it with her partner directly, in her own words, rather than letting the silence itself become one more thing standing between them."
        },
        techniques: [
          {
            code: "B1",
            approach: "Somatic Experiencing",
            format: "B",
            guardrail: true,
            name: "Somatic Body-Awareness Practices",
            source: "Peter Levine-informed Somatic Experiencing",
            what: "Simple, gentle body-awareness practices - noticing physical sensation without judgment, in a safe, everyday context - to build a more comfortable, less anxious relationship with your own body.",
            how: "Discomfort or distress around intimacy is often connected to a broader disconnection from the body itself, sometimes shaped by cultural silence or shame. Rebuilding a gentler, non-judgmental awareness of physical sensation, in low-stakes moments, can ease that disconnection over time.",
            why: "Because this works directly with body awareness, which can surface real discomfort for some people, this touch checks in with you partway through."
          },
          {
            code: "B2",
            approach: "CBT",
            format: "A",
            name: "Cognitive Restructuring of Cultural Shame Beliefs About Sex",
            source: "Aaron Beck",
            what: "Naming a specific belief absorbed from cultural silence around sex - \"this isn't something to talk about, even with a partner,\" \"wanting this makes me improper\" - and testing it against real, specific evidence.",
            how: "Cultural silence around a topic doesn't just mean less information is available - it can produce absorbed beliefs that were never actually chosen or examined, which testing against evidence can help separate from what's actually true.",
            why: "Targets the internalized belief directly, which is a different, more everyday-level target than the body-awareness work in B1."
          },
          {
            code: "B3",
            approach: "Sex Therapy",
            format: "C",
            name: "Sensate-Focus Exercises to Rebuild Non-Goal-Directed Physical Intimacy",
            source: "William Masters and Virginia Johnson",
            what: "A structured series of touch-based exercises, delivered through sex-therapy guidance, that deliberately remove any goal or expectation from physical touch between partners - focusing purely on sensation and connection, without pressure toward any particular outcome.",
            how: "Anxiety or pressure around a specific outcome can itself become the main barrier to comfortable intimacy. Removing the goal entirely, under a sex therapist's guidance, can help rebuild comfort with touch itself, separate from any pressure.",
            why: "Because this is a structured couples process that a sex therapist delivers and paces deliberately, it isn't something to attempt alone from a phone screen.",
            professionalNote: "A licensed sex therapist can guide sensate-focus exercises safely and at the right pace for your specific situation. If physical intimacy itself feels like the barrier, this is worth raising with a professional directly."
          },
          {
            code: "B4",
            approach: "EFT",
            format: "C",
            name: "EFT Work on Emotional Safety and Vulnerability as a Precursor to Physical Intimacy",
            source: "Sue Johnson, Emotionally Focused Therapy",
            what: "A structured couples process, guided by a trained therapist, working on the emotional safety and vulnerability between partners that often needs to be present before physical intimacy can feel comfortable or wanted.",
            how: "Physical intimacy difficulties sometimes trace back to a deeper, unaddressed gap in emotional safety between partners - working on that safety directly, with both partners present, can open up what physical-only approaches can't reach on their own.",
            why: "Because this is a couples process requiring both partners and real clinical skill to hold safely, it isn't something to attempt alone from a phone screen.",
            professionalNote: "A couples therapist trained in Emotionally Focused Therapy can help build the emotional safety that often underlies physical intimacy concerns. This is worth raising with a professional directly if the barrier feels more emotional than physical."
          }
        ]
      }
    ],
    escalation: {
      tier1: "Any statement connecting relationship communication difficulty or intimacy distress to intent or a plan to end one's life or self-harm (\"I can't do this anymore, I want it to stop\", \"I have a way to end it\").",
      tier2: "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary, real difficulty of raising hard topics or navigating intimacy concerns, which is what this module is specifically designed to help with. Also watch for language suggesting non-consensual activity, coercion, or pressure within the relationship around intimacy - this module is built for real, but consensual, difficulty and discomfort, not for situations involving coercion or lack of consent, which need a different kind of support entirely."
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
      title: "Two related, but distinct, areas",
      body: [
        "This module covers difficulty raising hard topics with a partner, and discomfort or distress around physical and emotional intimacy - including the cultural silence that can surround talking about sex, and mismatched expectations that can surface after marriage.",
        "This module stays at the level of feelings, communication, and comfort - it isn't a sex-education resource, and it won't ask you to describe anything physically explicit."
],
      cta: "Continue"
    },
    {
      eyebrow: "What this is - and isn't",
      title: "Between-session support, not a replacement",
      body: [
        "This module is designed to sit between therapy sessions, or to be useful on its own - either way, it isn't therapy, and it doesn't diagnose you with anything.",
        "This module is built for real, but consensual, difficulty and discomfort. If anything about your situation involves pressure or a lack of consent, this module isn't the right resource for that, and the crisis resources in this app are always available."
],
      cta: "Continue",
      crisisButton: true
    },
    {
      eyebrow: "Why this module",
      title: "Why we're suggesting this one",
      body: [
        "You told us you're navigating difficulty raising hard topics with a partner, or discomfort around intimacy, or both.",
        "This module is built for exactly that - two specific patterns, each with its own real, evidence-based tools."
],
      cta: "Continue"
    },
    {
      eyebrow: "What to expect",
      title: "The next 5 weeks",
      body: [
        "Short term: a new touch on weekdays, a few minutes each, real scenarios - your own words, not a quiz to pass or fail. Weekends bring a short summary, not new content.",
        "Long term, honestly: this won't make hard conversations easy, and it can't undo years of cultural silence on its own. What it can realistically offer is 6 specific, evidence-based tools, plus enough practice with each pattern that avoidance and silence have less room to run unchecked. That's the actual promise here, not more than that.",
        "One technique in this module asks you to work directly with body awareness, which can surface real discomfort for some people - it ships with a built-in check-in, on purpose. Two more are explained but not delivered as exercises, since they genuinely benefit from a licensed professional's guidance."
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
      cta: "Start Week 1",
      theory: true
    }
  ],
  weeks: [
    // WEEK 1: Communication difficulties: recognising the pattern
    {
      num: 1,
      title: "Communication difficulties: recognising the pattern",
      mechanism: "A",
      kind: "blocked",
      retrievalCheck: null,
      touches: [
        {
          id: "w1t1",
          title: "Recognition - the topic that keeps getting postponed",
          role: "Recognition #1",
          noDelayed: true,
          relate: {
            text: [
          "Quick note before we start: this week and the next aren't about any of the tools yet - none show up. First, you need to be able to spot each pattern clearly. The tools come in Weeks 3-4, matched one at a time to what you'll have learned to recognise.",
          "This week's pattern has a name: <b>communication difficulties</b>. In simple terms: difficulty expressing needs to a partner, often showing up as avoiding difficult conversations to keep the peace.",
          "Here's what that looks like. <b class='who'>Meghna</b> has wanted to raise something that's been bothering her for weeks - how household tasks get split - but each time the moment arrives, she tells herself it's not the right time, and lets it pass again."
]
          },
          think: {
            mode: "tap",
            prompt: "Which of these actually explains what's happening? More than one will sound reasonable.",
            options: [
              opt("The topic keeps getting postponed because avoiding it feels safer in the moment than the discomfort of raising it, not because the timing is genuinely never right", true, "Right - 'not the right time' repeating for weeks suggests the timing isn't actually the obstacle. The discomfort of raising it, in the moment, is what keeps winning out."),
              opt("Meghna genuinely hasn't found the right moment yet", false, "Weeks of the same pattern repeating suggests something more consistent than bad timing - the module's tools (A4) work with the belief driving the avoidance directly, not with finding a better moment."),
              opt("The issue probably isn't actually important enough to raise", false, "The scenario describes it as something that's been bothering her for weeks - that's not consistent with it being unimportant; the avoidance pattern itself is what's worth examining.")
            ],
            whyPrompt: "In a few words - what's the giveaway that this is about avoiding discomfort, not about bad timing?",
          },
          apply: {
            scenario: "Same pattern, a different person: Karan has wanted to tell his wife that a comment she made in front of his parents bothered him, but three weeks later, he still hasn't brought it up, each day telling himself he'll mention it later.",
            prompt: "Same thing happening here. In two or three sentences: what would you actually say to Karan right now?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"Three weeks of 'later' suggests it's not really about timing - it's about how uncomfortable raising it feels right now. The discomfort of saying it is probably smaller than the discomfort of it sitting there unsaid this long.\""
          },
          remember: {
            prompt: "In a sentence or two: think of a real topic you've postponed raising with a partner, telling yourself it wasn't the right time.",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w1t2",
          title: "Recognition - peace that isn't actually peaceful",
          role: "Recognition #2",
          delayedRef: "w1t1_apply",
          delayedPrompt: "Last touch, on Karan, you wrote this:",
          relate: {
            text: [
          "A different moment with Meghna. She tells a friend that she and her partner \"never really fight,\" and frames it as a sign of a strong relationship. Her friend, who knows about the household-tasks issue that's been bothering her for weeks, gently points out that not fighting isn't quite the same as things actually being fine.",
          "Notice what's happening: the absence of conflict is being read as evidence of peace, when it may actually be the avoidance itself."
]
          },
          think: {
            mode: "tap",
            prompt: "What does the friend's gentle pushback actually reveal?",
            options: [
              opt("The absence of visible conflict isn't the same as the underlying issue being resolved - it may just mean the issue is staying unspoken", true, "Right - not fighting can genuinely mean things are fine, but it can also just mean real issues are staying beneath the surface, unaddressed rather than resolved. The friend's question is pointing at that second possibility."),
              opt("Not fighting is always a reliable sign of relationship health", false, "The scenario specifically shows an unresolved issue sitting underneath the apparent calm - this is exactly the case where 'no fighting' isn't the same as 'no problems.'"),
              opt("Meghna's friend is wrong to question something that's clearly working", false, "The friend's question isn't dismissing the relationship - it's pointing at a real, known unresolved issue that Meghna herself brought up earlier, which is a fair thing to name.")
            ],
            whyPrompt: "In a few words - why might the absence of visible conflict not actually mean an issue has been resolved?",
          },
          apply: {
            scenario: "A friend, hearing someone describe their relationship as conflict-free, asks: \"Is it actually resolved, or is it just not being talked about?\" The person pauses, recognizing the difference.",
            prompt: "In two or three sentences: what would answering that question honestly actually sound like, for someone in that position?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the answer honestly distinguishes resolution from silence, rather than treating the two as the same thing."
          },
          remember: {
            prompt: "In a sentence or two: is there something in your own relationship that's quiet because it's resolved, or quiet because it's being avoided?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w1t3",
          title: "What keeping the peace is actually costing",
          role: "Functional logic",
          delayedRef: "w1t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Between the postponed conversation and the peace that isn't quite peace, there's a pattern worth naming honestly: avoiding the hard conversation can feel like protecting the relationship - keeping things calm, not creating unnecessary conflict.",
          "What it actually costs is different: the underlying issue doesn't resolve on its own by staying unspoken, and it tends to keep quietly costing something - resentment, distance - each week it goes unaddressed, often more than raising it directly would have cost."
]
          },
          think: {
            mode: "tap",
            prompt: "What is avoiding the hard conversation actually doing? These are close - think it through.",
            options: [
              opt("Feeling protective of the relationship's calm in the moment, while the underlying issue keeps quietly costing something each week it stays unaddressed", true, "That's the real trade - it can feel like the caring, careful choice, but an unaddressed issue rarely just disappears on its own; it tends to keep accumulating a quiet cost."),
              opt("A reliable way to make sure small issues don't become bigger ones", false, "The scenario shows the opposite pattern - staying quiet for weeks, with the issue still unresolved - not evidence that avoidance is preventing escalation."),
              opt("Evidence that the issue doesn't actually matter to Meghna", false, "The scenario describes it as something that's been bothering her for weeks, which is not consistent with it not mattering - the avoidance is about the discomfort of raising it, not about the issue's importance.")
            ],
            whyPrompt: "In a few words - why might an unaddressed issue keep costing something, even while it stays quiet?",
          },
          apply: {
            scenario: "A cousin, watching a friend avoid a conversation for the third week running, asks: \"Has staying quiet about it actually made it feel resolved, or just meant it's been sitting there longer?\" The friend pauses. \"...Just sitting there longer, honestly.\"",
            prompt: "That's usually the tell. In two or three sentences: think of a time avoiding a hard conversation didn't actually protect the relationship - what happened instead?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the pattern to notice is whether the avoidance actually protected anything, or just delayed the same conversation while quietly adding cost."
          },
          remember: {
            prompt: "In a sentence or two: what does the pull to avoid a hard conversation usually feel like for you, right as it shows up?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w1t4",
          title: "What raising it early and gently can look like",
          role: "Contrast / boundary case",
          delayedRef: "w1t3_apply",
          delayedPrompt: "Last touch, you named this:",
          relate: {
            text: [
          "Here's what a similar situation can look like for someone who approaches it differently.",
          "<b class='who'>Aparna</b> used to avoid raising anything difficult with her partner too - the same real discomfort, the same pull to let it pass. But she's learned to say the hard thing early, while it's still small, and gently - naming her own feeling rather than leading with blame.",
          "This is the module's contrast case for this pattern: real discomfort, still genuinely present - not the absence of it, but a different relationship to the timing."
]
          },
          think: {
            mode: "tap",
            prompt: "What actually makes Aparna's approach different from letting something build for weeks?",
            options: [
              opt("She raises the issue early, while it's still small, rather than letting the discomfort of avoiding it accumulate over time", true, "That's the real difference - not that raising it feels easy for her, but that she doesn't let the same discomfort compound over weeks the way avoidance tends to."),
              opt("Her issues with her partner are smaller and less significant than Meghna's", false, "The scenario doesn't establish that - the difference shown is in when and how each woman raises things, not in how significant the underlying issues are."),
              opt("She simply doesn't feel discomfort about raising hard topics", false, "The scenario specifically says she has the same real discomfort - the difference isn't the absence of discomfort, it's what she does with it.")
            ],
            whyPrompt: "In a few words - how might raising something small and early change how hard the conversation actually is, compared to waiting?",
          },
          apply: {
            scenario: "A friend asks Aparna how she brings herself to raise things early. She says: \"I remind myself it only gets harder to say the longer I wait. Saying it small and early, while it's still small, is a lot easier than saying it after it's had weeks to build up.\"",
            prompt: "In two or three sentences: think of something you've been putting off raising - what would saying it now, while it's still small, actually sound like?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the useful pattern is noticing whether raising it now feels more manageable than continuing to let it build."
          },
          remember: {
            prompt: "In a sentence or two: is there something you could raise this week, while it's still relatively small?",
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
          "One more, and then a small piece of what actually happened with Meghna.",
          "She finally raised the household-tasks issue, weeks after first noticing it bothered her - and the conversation, while a little awkward, was over in fifteen minutes, with her partner genuinely unaware it had been building for that long. It wasn't the disaster she'd been picturing.",
          "That's not a coincidence, and it previews the tools coming in Week 3: the imagined cost of raising something hard is usually much larger than the real cost turns out to be - the anticipation tends to be worse than the actual conversation."
]
          },
          think: {
            mode: "tap",
            prompt: "What does the fifteen-minute conversation tell us about the weeks of anticipation beforehand?",
            options: [
              opt("The real conversation was far smaller and easier than the anticipated version, suggesting the weeks of avoidance were driven by an inflated prediction, not an accurate one", true, "Right - a fifteen-minute, relatively easy conversation is real evidence that the catastrophic anticipation didn't match what actually happened, which is exactly the gap the module's tools (A4) work with."),
              opt("Her partner must have already known and was just waiting for her to bring it up", false, "The scenario specifically says her partner was genuinely unaware it had been building - this isn't consistent with him already knowing and waiting."),
              opt("It doesn't really prove anything, since the conversation was still a little awkward", false, "A little awkwardness doesn't undercut the real point - the conversation being over in fifteen minutes, far smaller than weeks of anticipation, is the meaningful evidence here.")
            ],
            whyPrompt: "In a few words - why might the anticipated cost of a hard conversation usually be worse than the real cost turns out to be?",
          },
          apply: {
            scenario: "A different person, same shape of realisation: after avoiding it for a month, Farhan finally tells his partner that something she said hurt him, and finds the conversation resolves in minutes, nowhere near the blow-up he'd been imagining all month.",
            prompt: "In two or three sentences: what does that outcome tell Farhan about the month of avoidance beforehand?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"The month of avoidance was driven by an imagined version of the conversation that turned out to be far worse than the real one - the anticipation, not the actual conversation, was the real obstacle.\""
          },
          remember: {
            prompt: "In a sentence or two: is there a conversation you've been avoiding where the imagined version might be worse than the real one would be?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: communication difficulties, and how avoiding a hard conversation can feel protective, even though the anticipated cost is usually much larger than the real cost turns out to be. Next week: intimacy and sexual concerns, a related but distinct experience."
    },
    // WEEK 2: Intimacy and sexual concerns: recognising the pattern
    {
      num: 2,
      title: "Intimacy and sexual concerns: recognising the pattern",
      mechanism: "B",
      kind: "blocked",
      retrievalCheck: null,
      touches: [
        {
          id: "w2t1",
          title: "Recognition - a silence inherited, not chosen",
          role: "Recognition #1",
          delayedRef: "w1t5_apply",
          delayedPrompt: "Last week, your idea was:",
          relate: {
            text: [
          "This week's pattern: <b>intimacy and sexual concerns</b>. In simple terms: difficulty or distress around physical or emotional intimacy in a relationship - including discomfort discussing sex due to cultural silence, and mismatched expectations that can surface after marriage.",
          "Here's what that looks like. <b class='who'>Rhea</b> got married eight months ago. She finds she genuinely cannot bring herself to talk about anything related to physical intimacy with her husband, even when something is bothering her - not because she doesn't trust him, but because the topic itself has always felt like something you simply don't discuss out loud, growing up."
]
          },
          think: {
            mode: "tap",
            prompt: "Which of these actually explains what's happening? More than one will sound reasonable.",
            options: [
              opt("An absorbed cultural silence around the topic, not anything about her specific relationship or trust in her husband, is producing the difficulty", true, "Right - the scenario specifically distinguishes this from a trust issue; the silence is something absorbed growing up, not a reflection of anything wrong between her and her husband specifically."),
              opt("She probably doesn't trust her husband enough to be open with him", false, "The scenario explicitly states this isn't about trust - the difficulty traces to an absorbed cultural pattern, which is a different, more general source than anything specific to this relationship."),
              opt("This means something is fundamentally wrong with the relationship", false, "Difficulty discussing a topic due to inherited cultural silence doesn't indicate a fundamental relationship problem - it's a communication pattern that can be worked with directly, which the module's tools (B2) address.")
            ],
            whyPrompt: "In a few words - what's the difference between a communication barrier and a trust problem?",
          },
          apply: {
            scenario: "Same pattern, a different person: Dev finds he physically can't get the words out when something about intimacy is bothering him with his wife, even though he doesn't doubt her or the relationship at all.",
            prompt: "Same thing happening here. In two or three sentences: what would you actually say to Dev right now?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"Not being able to find the words doesn't mean anything's wrong between you two - it sounds more like an old, absorbed silence about the topic itself, not about your trust in her. That's a real barrier, but it's a different one than a relationship problem.\""
          },
          remember: {
            prompt: "In a sentence or two: think of a topic that's felt genuinely hard to discuss, not because of anything about the specific relationship, but because of how you were raised to think about it.",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w2t2",
          title: "Recognition - expectations that were never actually said out loud",
          role: "Recognition #2",
          delayedRef: "w2t1_apply",
          delayedPrompt: "Last touch, on Dev, you wrote this:",
          relate: {
            text: [
          "A different moment with Rhea. She realizes she's been quietly disappointed for months about a mismatch between what she'd expected married life to feel like and what it's actually been - but she's never once said this out loud to her husband, and isn't even sure she could name it clearly if she tried.",
          "Notice what's happening: real expectations, shaped long before the marriage, have never actually been spoken - not examined, not shared, just quietly carried and quietly disappointing her."
]
          },
          think: {
            mode: "tap",
            prompt: "What does carrying an unspoken, unexamined expectation for months actually risk?",
            options: [
              opt("An expectation that was never actually named or shared can't be addressed by either partner, since neither the expectation itself nor the mismatch has ever been made concrete", true, "Right - an expectation that stays entirely internal and unexamined can't be worked with by either person; it just produces quiet disappointment with no clear target either partner can actually respond to."),
              opt("Her husband should have known what she expected without being told", false, "This assumes an unrealistic level of assumed understanding - the scenario shows Rhea herself hasn't even fully named the expectation to herself yet, which makes it very unlikely her husband could have known."),
              opt("The mismatch itself proves the marriage was a mistake", false, "A mismatch between an unexamined, unspoken expectation and reality doesn't indicate a fundamental error - it indicates an expectation that's never actually been named or discussed, which is addressable.")
            ],
            whyPrompt: "In a few words - why might an expectation that's never been named or shared be impossible for either partner to actually address?",
          },
          apply: {
            scenario: "A friend, hearing Rhea describe the quiet disappointment, asks: \"Have you ever actually said out loud what you expected, even to yourself clearly?\" Rhea realizes she hasn't, not really.",
            prompt: "In two or three sentences: what would actually naming the expectation, even just to herself first, look like for someone in Rhea's position?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the answer involves genuinely trying to name the expectation specifically, not staying at the level of vague, general disappointment."
          },
          remember: {
            prompt: "In a sentence or two: is there an expectation in your own relationship that's never actually been said out loud?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w2t3",
          title: "What staying silent is actually costing",
          role: "Functional logic",
          delayedRef: "w2t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Between the inherited silence and the unspoken expectation, there's a pattern worth naming honestly: staying quiet about intimacy can feel like the appropriate, private way to handle something this personal.",
          "What it actually costs is different: it means real discomfort or disappointment has no way to actually be addressed, since a partner can't respond to something that's never been named - the silence, rather than protecting anything, tends to just let the distance grow."
]
          },
          think: {
            mode: "tap",
            prompt: "What is staying silent about intimacy actually doing? These are close - think it through.",
            options: [
              opt("Feeling appropriately private in the moment, while leaving real discomfort or disappointment with no way to actually be addressed by either partner", true, "That's the real trade - privacy about this topic can feel appropriate, but if it means real concerns never get named, neither partner has anything to actually work with, which tends to let quiet distance grow rather than protecting the relationship."),
              opt("A respectful way to avoid burdening a partner with something private", false, "The scenario shows the silence producing quiet disappointment that's building over months, not protecting the relationship - a partner genuinely can't respond to something never communicated."),
              opt("Evidence that intimacy just isn't very important in this relationship", false, "Quiet disappointment building over months isn't consistent with the topic being unimportant - it's consistent with a real concern that's had no way to be voiced.")
            ],
            whyPrompt: "In a few words - why might silence about intimacy let distance grow, rather than actually protecting the relationship?",
          },
          apply: {
            scenario: "A friend, watching someone stay quiet about a source of disappointment for months, asks: \"Has staying quiet actually protected anything, or just meant you're carrying this alone?\" The friend pauses. \"...Just carrying it alone, honestly.\"",
            prompt: "That's usually the tell. In two or three sentences: think of a time staying silent about something intimate didn't actually protect the relationship - what happened instead?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the pattern to notice is whether the silence actually protected anything, or just meant carrying something alone."
          },
          remember: {
            prompt: "In a sentence or two: what does the pull to stay silent about this usually feel like for you, right as it shows up?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w2t4",
          title: "What speaking in your own words can look like",
          role: "Contrast / boundary case",
          delayedRef: "w2t3_apply",
          delayedPrompt: "Last touch, you named this:",
          relate: {
            text: [
          "Here's what a similar situation can look like for someone who's found a way through the silence.",
          "<b class='who'>Sonali</b> grew up with the same cultural silence around sex, the same real discomfort even naming the topic. But she's found a way to talk about it with her partner directly - not with polished, clinical language, just her own honest words, said imperfectly but said.",
          "This is the module's contrast case for this pattern: real discomfort, still genuinely present - not the absence of it, but a different relationship to the silence."
]
          },
          think: {
            mode: "tap",
            prompt: "What actually makes Sonali's approach different from staying silent? Both grew up with the same real cultural silence.",
            options: [
              opt("She speaks in her own imperfect words despite the discomfort, rather than waiting for the discomfort to disappear before speaking", true, "That's the real difference - not that the discomfort is gone for her, but that she doesn't let it be a precondition for speaking; she speaks through it, imperfectly, rather than waiting for it to pass first."),
              opt("Her cultural background involved less silence around the topic than others", false, "The scenario specifically says she grew up with the same real cultural silence - the difference is in her response to it, not in a less restrictive background."),
              opt("She simply feels less discomfort about the topic than most people", false, "The scenario states her discomfort is real, not diminished - the difference is that she speaks despite it, not that it's absent for her.")
            ],
            whyPrompt: "In a few words - how might speaking imperfectly, rather than waiting for comfort first, change what becomes possible?",
          },
          apply: {
            scenario: "A friend asks Sonali how she finds the words despite the discomfort. She says: \"I stopped waiting to feel comfortable before saying anything. I just say it in whatever words I actually have, even if they're clumsy - waiting for the perfect, comfortable moment means never actually saying it.\"",
            prompt: "In two or three sentences: think of something about intimacy you've been waiting to feel comfortable enough to say - what would saying it now, imperfectly, look like?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the useful pattern is noticing whether the words are honest and specific, even if imperfect, not polished or avoided entirely."
          },
          remember: {
            prompt: "In a sentence or two: is there something you could say this week, in your own imperfect words, rather than waiting for it to feel comfortable first?",
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
          "One more, and then a small piece of what actually happened with Rhea.",
          "Months after first noticing the quiet disappointment, she finally said something to her husband - not eloquently, mostly stumbling through it, but she said it. He hadn't known, and was genuinely glad she told him, even though the conversation itself was awkward for both of them.",
          "That's not a coincidence, and it previews the tools coming in Week 4: the words don't need to be polished for a partner to actually hear and respond to them - waiting for eloquence, or waiting for the discomfort to pass first, usually just means waiting indefinitely."
]
          },
          think: {
            mode: "tap",
            prompt: "What does her husband's glad, if awkward, response tell us about the months of silence beforehand?",
            options: [
              opt("An imperfect, stumbling conversation was enough for her husband to actually respond to, suggesting the silence hadn't been necessary to protect anything - it had just meant carrying it alone longer", true, "Right - the conversation didn't need to be polished for him to understand and respond well, which is real evidence that the months of silence weren't actually required to protect the relationship."),
              opt("Her husband must have been upset that she waited so long to tell him", false, "The scenario specifically says he was genuinely glad she told him - this isn't consistent with an upset or negative reaction to the timing."),
              opt("It doesn't really prove anything, since the conversation itself was still awkward", false, "The awkwardness doesn't undercut the real point - an imperfect conversation still working, still landing well with her husband, is exactly the meaningful evidence here.")
            ],
            whyPrompt: "In a few words - why might an imperfect, stumbling conversation still be enough for a partner to genuinely hear and respond to?",
          },
          apply: {
            scenario: "A different person, same shape of realisation: after months of silently feeling disconnected from her husband, Priya finally, clumsily tries to explain what's been bothering her, and finds he listens carefully and wants to understand, even though she can't articulate it perfectly.",
            prompt: "In two or three sentences: what does his careful listening tell Priya about the months of silence beforehand?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"The silence hadn't been protecting anything - an imperfect explanation was enough for him to actually listen and want to understand, which suggests the months of waiting for the right words weren't actually necessary.\""
          },
          remember: {
            prompt: "In a sentence or two: is there something about intimacy you've been carrying silently that you could say, imperfectly, to your partner this week?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: intimacy and sexual concerns, and how an inherited cultural silence can feel like the appropriate way to handle something private, even though speaking imperfectly, rather than waiting for comfort first, is usually what actually lets a partner respond. Next week: the tools for communication difficulties."
    },
    // WEEK 3: Communication difficulties: four tools, and a plan
    {
      num: 3,
      title: "Communication difficulties: four tools, and a plan",
      mechanism: "A",
      kind: "technique",
      retrievalCheck: {
        "prompt1": "In your own words - what is the communication-difficulties pattern, and why might the anticipated cost of a hard conversation usually be worse than the real cost turns out to be?",
        "prompt2": "And what is the intimacy and sexual concerns pattern - why might an imperfect, stumbling conversation still be enough for a partner to genuinely hear and respond to?",
        "reveal": "Communication difficulties involve avoiding hard conversations with a partner to keep the peace - the anticipated cost of raising something difficult is usually far larger than the real cost turns out to be, and raising something small and early tends to be easier than letting it build. Intimacy and sexual concerns involve real discomfort discussing physical or emotional intimacy, often shaped by inherited cultural silence rather than anything about the specific relationship - words don't need to be polished for a partner to actually hear and respond to them, and waiting for comfort or eloquence first usually just means waiting indefinitely."
},
      touches: [
        {
          id: "w3t1",
          title: "Gottman-Informed 'I-Statements' and the Soft Start-Up",
          role: "Technique A1 - Gottman Method",
          delayedRef: "w2t5_apply",
          delayedPrompt: "Last week, your answer was:",
          relate: {
            text: [
          "This is the first of the four tools for communication difficulties from your theory grounding screen: <b>Gottman-informed 'I-statements' and the soft start-up technique</b>.",
          "Remember how a conversation's opening tends to predict how the rest goes? This tool raises a difficult topic using an 'I-statement' - naming your own feeling and need, rather than a 'you' statement that can land as blame - and starting gently."
]
          },
          think: {
            mode: "open",
            prompt: "Why might how a hard conversation opens, in just the first few seconds, matter this much for how the rest of it goes?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Think of a hard topic you've been meaning to raise with a partner, maybe the one from Week 1.",
            prompt: "In two or three sentences: write a soft start-up for it - an I-statement naming your feeling and need, not a 'you' statement.",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether it genuinely uses 'I feel...' / 'I need...' framing, not a 'you always...' framing disguised as a statement about yourself."
          },
          remember: {
            prompt: "In a sentence or two: did writing it this way feel different from how you'd usually start that conversation?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w3t2",
          title: "Active-Listening Drills",
          role: "Technique A2 - Person-Centred Therapy (Rogers)",
          delayedRef: "w3t1_apply",
          delayedPrompt: "Last touch, your start-up was:",
          relate: {
            text: [
          "The second tool: <b>active-listening drills</b> - practicing reflecting back what a partner has actually said, in your own words, before responding with your own view."
]
          },
          think: {
            mode: "open",
            prompt: "Why might formulating your response while a partner is still talking mean real listening has already stopped?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Think of a recent conversation with a partner, or one you can imagine, where reflecting back first might have helped.",
            prompt: "In two or three sentences: what did (or would) the other person say, and what would reflecting it back, in your own words, before responding, actually sound like?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is a genuine reflection of the other person's point, not a reframing that sneaks in your own view already."
          },
          remember: {
            prompt: "In a sentence or two: did practicing the reflection first feel different from how you'd normally respond?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w3t3",
          title: "Interpersonal Communication Skill-Building",
          role: "Technique A3 - IPT (Klerman & Weissman)",
          delayedRef: "w3t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "The third tool: <b>interpersonal communication skill-building</b> - identifying a specific, recurring communication pattern in the relationship, and naming a concrete change to try in that pattern."
]
          },
          think: {
            mode: "open",
            prompt: "Why might naming a recurring pattern make it possible to interrupt deliberately, compared to just reacting the same way each time it happens?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Think of a recurring communication pattern in your own relationship - who tends to raise issues, who tends to go quiet, what usually happens next.",
            prompt: "In two or three sentences: name the pattern, and one concrete change you could try in it.",
            placeholder: "The pattern: ... / The change: ..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is a specific, recognizable pattern, not a vague sense that communication is 'sometimes difficult.'"
          },
          remember: {
            prompt: "In a sentence or two: did naming the pattern directly make it feel more addressable than before?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w3t4",
          title: "Cognitive Restructuring of Conflict-Avoidance Beliefs",
          role: "Technique A4 - CBT (Beck)",
          delayedRef: "w3t3_apply",
          delayedPrompt: "Last touch, your pattern was:",
          relate: {
            text: [
          "The fourth tool: <b>cognitive restructuring of conflict-avoidance beliefs</b> - writing down the specific belief driving the avoidance, like Meghna's imagined disaster, and testing it against real, specific evidence."
]
          },
          think: {
            mode: "open",
            prompt: "Why does a belief like \"raising this will ruin things\" need to be tested against evidence, rather than accepted as an accurate prediction?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Think of a conflict-avoidance belief that's kept you from raising something, maybe the one from Week 1.",
            prompt: "In two or three sentences: write the exact belief, then test it - what's the actual, real evidence for and against it?",
            placeholder: "The belief: ... / The evidence: ..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is specific, real evidence, not a vague reassurance that everything will be fine."
          },
          remember: {
            prompt: "In a sentence or two: did testing the belief change how certain it felt?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w3t5",
          title: "How did it go, and a plan for next time",
          role: "Check-in + pre-commitment",
          delayedRef: "w3t4_apply",
          delayedPrompt: "Last touch, your evidence was:",
          relate: {
            text: [
          "No new idea this touch - two quick things before we move to intimacy and sexual concerns.",
          "First, a real check-in on the four tools from this week - the same four that trace back to Meghna's postponed conversation back in Week 1. Then, a plan built now, while things feel calm."
]
          },
          think: {
            mode: "open",
            prompt: "Which of the four did you actually try this week, if any - and what happened?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Pick whichever of the four tools felt most useful, or most realistic to actually use, this week.",
            prompt: "In two or three sentences, write an if-then plan for using it: 'If [specific cue], then I will [specific tool, specifically applied].'",
            placeholder: "If [specific cue], then I will..."
          },
          reveal: {
            text: "Something like: \"If I catch myself postponing a hard conversation again, then I'll test the catastrophic belief behind the avoidance and try a soft start-up while the issue is still small.\""
          },
          remember: {
            prompt: "In a sentence or two: say the plan back to yourself - does it actually sound doable in a real moment, not just in hindsight?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: four named tools for communication difficulties - the soft start-up, active-listening drills, interpersonal skill-building, and cognitive restructuring of avoidance beliefs - a real check-in, and a plan built while calm. No new teaching in this summary. Next week: intimacy and sexual concerns."
    },
    // WEEK 4: Intimacy and sexual concerns: two tools, and a plan
    {
      num: 4,
      title: "Intimacy and sexual concerns: two tools, and a plan",
      mechanism: "B",
      kind: "technique",
      retrievalCheck: null,
      hasReferenceCard: true,
      touches: [
        {
          id: "w4t1",
          title: "Somatic Body-Awareness Practices",
          role: "Technique B1 - Somatic Experiencing (Levine) - guided",
          delayedRef: "w3t5_apply",
          delayedPrompt: "Last week, your if-then plan was:",
          guardrail: true,
          distressPrompt: "You've just practiced noticing physical sensation directly, which can bring up real feelings for some people. Before we continue - how are you feeling right now?",
          relate: {
            text: [
          "This is the first of the two tools for intimacy and sexual concerns from your theory grounding screen: <b>somatic body-awareness practices</b>.",
          "This tool uses simple, gentle body-awareness exercises - noticing physical sensation without judgment, in a safe, everyday context - to build a more comfortable relationship with your own body, which cultural silence or shame can sometimes disconnect from.",
          "Because this works directly with body awareness, which can surface real discomfort for some people, this touch checks in with you partway through."
]
          },
          think: {
            mode: "open",
            prompt: "Why might rebuilding a gentle, non-judgmental awareness of physical sensation, in low-stakes everyday moments, help ease a broader disconnection from the body?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Think of a simple, everyday, non-intimate moment - like the warmth of tea in your hands, or your feet on the ground.",
            intensityPrompt: "First, choose how far you want to go with this right now:",
            intensityOptions: [
          "Smaller version - notice one simple physical sensation right now, briefly",
          "Bigger version - spend a full minute noticing several sensations, without judging any of them"
],
            prompt: "In two or three sentences: describe what you noticed, without judging it as good or bad.",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether the sensation is described neutrally, without judgment attached to it."
          },
          remember: {
            prompt: "In a sentence or two: did noticing without judging feel different from how you usually relate to physical sensation?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w4t2",
          title: "Cognitive Restructuring of Cultural Shame Beliefs About Sex",
          role: "Technique B2 - CBT (Beck)",
          delayedRef: "w4t1_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "The second tool: <b>cognitive restructuring of cultural shame beliefs about sex</b> - naming a specific absorbed belief, like the ones underneath Rhea's silence, and testing it against real, specific evidence."
]
          },
          think: {
            mode: "open",
            prompt: "Why might a belief absorbed from cultural silence never have actually been chosen or examined, even though it feels like a personal, settled truth?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Think of a belief about sex or intimacy you've absorbed from cultural silence or upbringing, maybe one that's shown up for you before.",
            prompt: "In two or three sentences: write the exact belief, then test it - what's the actual, specific evidence for and against it, examined directly rather than just assumed?",
            placeholder: "The belief: ... / The evidence: ..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is a genuine, direct examination of the belief, not a restatement of it in gentler words."
          },
          remember: {
            prompt: "In a sentence or two: did examining the belief directly change how fixed or true it felt?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w4t3",
          title: "When this benefits from a professional's guidance",
          role: "A bridge before the check-in",
          delayedRef: "w4t2_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Before this week's check-in: the two tools so far work well for the everyday discomfort and absorbed beliefs most people carry around this topic.",
          "If you and a partner are working on rebuilding physical intimacy specifically, or on the deeper emotional safety that makes intimacy feel possible at all, there are two more items in this mechanism's toolkit - sensate-focus exercises, and EFT work on emotional safety - shown as reference cards rather than touches, since both work best with a licensed professional guiding them directly. You can open either any time from this week's list."
]
          },
          think: {
            mode: "open",
            prompt: "Why might rebuilding physical intimacy, or the emotional safety underneath it, benefit from a trained professional's guidance rather than a self-guided exercise?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "No scenario for this touch - just a direct question.",
            prompt: "In a sentence or two: does your own situation feel like it's in the everyday-discomfort range this module is built for, or does it feel like something that could use a professional's guidance? Either answer is fine - this is just for you to notice.",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - if your answer leans toward needing more structured support, the reference cards above are worth opening, and a sex therapist or couples therapist is worth considering directly."
          },
          remember: {
            prompt: "In a sentence or two: is there someone - a professional, a trusted friend - you could imagine actually raising this with?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w4t4",
          title: "How did it go",
          role: "Check-in",
          delayedRef: "w4t3_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "No new idea this touch - just a real check-in on the two tools from this week, the same two that trace back to Rhea's inherited silence back in Week 2."
]
          },
          think: {
            mode: "open",
            prompt: "Which of the two did you actually try this week, if any - and what happened?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Think back over the week's attempts, however small.",
            prompt: "In two or three sentences: what actually happened when you tried one of these, compared to what you expected going in?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single model answer here - the tell is whether you're comparing the real outcome honestly to what you expected."
          },
          remember: {
            prompt: "In a sentence or two: what surprised you most, if anything?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w4t5",
          title: "A plan for next time",
          role: "Pre-commitment",
          delayedRef: "w4t4_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "One more before we bring both patterns together next week: a plan built now, before the next moment of silence or absorbed shame shows up."
]
          },
          think: {
            mode: "open",
            prompt: "Of the two tools this week, which do you trust most to actually reach for?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Pick whichever of the two tools felt most useful, or most realistic to actually use, this week.",
            prompt: "In two or three sentences, write an if-then plan: 'If [specific cue], then I will [specific tool, specifically applied].'",
            placeholder: "If [specific cue], then I will..."
          },
          reveal: {
            text: "Something like: \"If I notice a shame-driven belief about this topic showing up, then I'll test it against real evidence before letting it settle in as true.\""
          },
          remember: {
            prompt: "In a sentence or two: say the plan back to yourself - does it actually sound doable in a real moment, not just in hindsight?",
            placeholder: "Your answer..."
          }
        }
      ],
      summary: "This week: two named tools for intimacy and sexual concerns - somatic body-awareness practices, and cognitive restructuring of cultural shame beliefs - plus reference cards for deeper physical and emotional intimacy work, a check-in, and a plan built while calm. No new teaching in this summary. Next week: bringing both patterns together."
    },
    // WEEK 5: Integration & review
    {
      num: 5,
      title: "Integration & review",
      mechanism: "both",
      kind: "integration",
      retrievalCheck: null,
      touches: [
        {
          id: "w5t1",
          title: "When two patterns show up together",
          role: "Integration",
          delayedRef: "w4t5_apply",
          delayedPrompt: "Last week, your if-then plan was:",
          relate: {
            text: [
          "Anjali has been avoiding a difficult conversation with her husband for weeks (communication difficulties) - and the topic she's avoiding is actually about a mismatch in expectations around intimacy that's been quietly disappointing her (intimacy and sexual concerns), the two patterns tangled around the exact same unspoken issue."
]
          },
          think: {
            mode: "open",
            prompt: "Both patterns showed up here. Which one do you think is actually driving the other, and why?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Same situation - Anjali's avoided conversation and the intimacy-related expectation underneath it.",
            prompt: "In two or three sentences: what would you actually recommend Anjali try, and why that one, out of all six tools you now know?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's a real case either way. Some would start with the soft start-up (A1), since getting the actual conversation started gently might be the more urgent, practical need regardless of the topic underneath it. Others would say naming the cultural-shame belief first (B2) matters more, since whatever's making the topic itself hard to raise may need addressing before any conversation technique can actually work. Either is defensible - what matters is she picks one and actually starts there."
          },
          remember: {
            prompt: "In a sentence or two: which would you have picked for yourself, in her position?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w5t2",
          title: "Designing a full response",
          role: "Integration",
          delayedRef: "w5t1_apply",
          delayedPrompt: "Last touch, you said you'd recommend:",
          relate: {
            text: [
          "Rahul and his wife communicate well about most things (communication difficulties, largely resolved) - but he's noticed a recurring pattern where any conversation that touches on intimacy specifically shuts down immediately, unlike their other conversations (intimacy and sexual concerns, isolated to this one topic)."
]
          },
          think: {
            mode: "open",
            prompt: "What's driving what here, in your own words - is this really a communication problem, or a topic-specific barrier showing up inside otherwise-good communication?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Same situation - Rahul's generally strong communication and the one topic where it breaks down.",
            prompt: "In two or three sentences: design a full plan for Rahul - combine tools across patterns if that's what it takes.",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Something like: \"Since general communication is already strong, this looks more like Mechanism B's territory specifically - cognitive restructuring of cultural shame beliefs (B2) is probably the more targeted starting point, though the soft start-up technique (A1) could still help structure how the topic gets raised, even if the underlying barrier is B2's to address.\""
          },
          remember: {
            prompt: "In a sentence or two: which of the two patterns do you reach for tools on first, generally - and why do you think that's your instinct?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w5t3",
          title: "One more, mixed",
          role: "Integration",
          delayedRef: "w5t2_apply",
          delayedPrompt: "Last touch, your plan for Rahul was:",
          relate: {
            text: [
          "Meera has been quietly disappointed about intimacy since getting married eight months ago (intimacy and sexual concerns) - and she's also realized she avoids nearly every hard topic with her husband, not just this one, going quiet whenever anything difficult comes up (communication difficulties, general pattern)."
]
          },
          think: {
            mode: "open",
            prompt: "Both patterns showed up here at once. In your own words, how do they seem to be feeding each other?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Same situation - Meera's month.",
            prompt: "In two or three sentences: what's the one move that would actually help the most right now, and why that one over the others?",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "There's no single right answer - the pattern worth noticing is that a general avoidance pattern (Mechanism A) may be the more foundational issue here, since it's showing up across many topics, not just intimacy - interpersonal skill-building (A3) to name and interrupt the broader pattern might open the door to the more specific intimacy conversation too, without one single tool being able to address both fully at once."
          },
          remember: {
            prompt: "In a sentence or two: is there a real situation in your own life right now where both of these show up together?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w5t4",
          title: "A third scenario",
          role: "Integration",
          delayedRef: "w5t3_apply",
          delayedPrompt: "Last touch, you wrote this:",
          relate: {
            text: [
          "Vikram raised a difficult topic with his partner successfully last month, using a soft start-up that went well (communication difficulties, a recent success) - but he's noticed that success hasn't made it any easier to bring up something about intimacy that's been on his mind, which still feels like an entirely different kind of hard (intimacy and sexual concerns, still unaddressed)."
]
          },
          think: {
            mode: "open",
            prompt: "If you had to guess why the earlier success didn't transfer, which would you guess, and what would you look for to check?",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "Same situation - Vikram's recent communication success and the still-stuck intimacy topic.",
            prompt: "In two or three sentences: what's the one move that unblocks the most here, if there is one - and if there isn't, say so.",
            placeholder: "Your answer..."
          },
          reveal: {
            text: "Often the honest answer is that the two patterns, while related, don't automatically transfer - a real communication skill (A1) doesn't necessarily dissolve a topic-specific cultural-shame belief (B2), which likely needs its own, separate work even though the general communication skill genuinely helped with other topics."
          },
          remember: {
            prompt: "In a sentence or two: what's your instinct, generally - does getting better at hard conversations in general make any specific topic easier, or does each topic sometimes need its own separate work?",
            placeholder: "Your answer..."
          }
        },
        {
          id: "w5t5",
          title: "Your own situation - nothing pre-walked",
          role: "Transfer test",
          delayedRef: "w5t4_apply",
          delayedPrompt: "Last touch, your instinct was:",
          transferTest: true,
          relate: {
            text: [
          "This is the one part of the module built with no scaffolding at all.",
          "You've followed Meghna through a postponed conversation that turned out far smaller than she feared, Rhea through an inherited silence she finally spoke through imperfectly, and hopefully noticed the shape of one or both of these patterns in your own life too, more than once.",
          "Now it's just yours. You've got a real situation right now - communication difficulties, intimacy and sexual concerns, maybe both at once, the way Anjali, Rahul, Meera, and Vikram each faced in their own ways. Don't simplify it for us."
]
          },
          think: {
            mode: "open",
            prompt: "Describe it in your own words - what's actually going on, as specifically as you can.",
            placeholder: "Your answer...",
          },
          apply: {
            scenario: "With nothing pre-walked this time.",
            prompt: "In two or three sentences: what's your actual next move, and why that one - which of the six tools, and why not one of the others?",
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
      code: "A1",
      rep: 1,
      type: "reflection",
      scenario: "A difficult topic you've been meaning to raise with a partner comes to mind again.",
      prompt: "In two or three sentences: write a soft start-up for it - an I-statement naming your feeling and need.",
      reveal: "There's no single model answer here - the tell is genuine 'I feel/I need' framing, not a disguised 'you' statement."
    },
    {
      code: "A1",
      rep: 2,
      type: "reflection",
      scenario: "A different difficult topic, maybe with a different tone, comes to mind.",
      prompt: "In two or three sentences: write a soft start-up for this one too.",
      reveal: "There's no single model answer here - the tell is specificity to this particular topic."
    },
    {
      code: "A2",
      rep: 1,
      type: "reflection",
      scenario: "Think of a recent or upcoming conversation where reflecting back first might help.",
      prompt: "In two or three sentences: what did (or would) the other person say, and how would you reflect it back in your own words before responding?",
      reveal: "There's no single model answer here - the tell is a genuine reflection, not a response with your own view already mixed in."
    },
    {
      code: "A2",
      rep: 2,
      type: "reflection",
      scenario: "A different conversation, maybe on a different topic, comes to mind.",
      prompt: "In two or three sentences: practice the same reflection for this one too.",
      reveal: "There's no single model answer here - the tell is specificity to this particular conversation."
    },
    {
      code: "A3",
      rep: 1,
      type: "reflection",
      scenario: "A recurring communication pattern in the relationship shows up again.",
      prompt: "In two or three sentences: name the pattern, and one concrete change to try in it.",
      reveal: "There's no single model answer here - the tell is a specific, recognizable pattern, not a vague generalization."
    },
    {
      code: "A3",
      rep: 2,
      type: "reflection",
      scenario: "A different recurring pattern, maybe around a different kind of topic, shows up.",
      prompt: "In two or three sentences: name and address this one too.",
      reveal: "There's no single model answer here - the tell is specificity to this particular pattern."
    },
    {
      code: "A4",
      rep: 1,
      type: "reflection",
      scenario: "A conflict-avoidance belief shows up again, keeping you from raising something.",
      prompt: "In two or three sentences: write the belief, and test it against real, specific evidence.",
      reveal: "There's no single model answer here - the tell is specific evidence, not a vague reassurance."
    },
    {
      code: "A4",
      rep: 2,
      type: "reflection",
      scenario: "A different avoidance belief, maybe about a different topic, shows up.",
      prompt: "In two or three sentences: write and test this one too.",
      reveal: "There's no single model answer here - the tell is genuine, specific evidence for this particular belief."
    },
    {
      code: "B2",
      rep: 1,
      type: "reflection",
      scenario: "A cultural shame belief about sex or intimacy shows up again.",
      prompt: "In two or three sentences: write the belief, and test it against real, specific evidence.",
      reveal: "There's no single model answer here - the tell is a genuine, direct examination, not a restatement in gentler words."
    },
    {
      code: "B2",
      rep: 2,
      type: "reflection",
      scenario: "A different shame-driven belief, maybe absorbed from a different source, shows up.",
      prompt: "In two or three sentences: write and test this one too.",
      reveal: "There's no single model answer here - the tell is genuine, specific evidence for this particular belief."
    }
  ],
  toolsData: {},
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
    tier1: "Any statement connecting relationship communication difficulty or intimacy distress to intent or a plan to end one's life or self-harm (\"I can't do this anymore, I want it to stop\", \"I have a way to end it\").",
    tier2: "Persistent hopelessness about life broadly, or real functional collapse - not the ordinary, real difficulty of raising hard topics or navigating intimacy concerns, which is what this module is specifically designed to help with. Also watch for language suggesting non-consensual activity, coercion, or pressure within the relationship around intimacy - this module is built for real, but consensual, difficulty and discomfort, not for situations involving coercion or lack of consent, which need a different kind of support entirely.",
    systemPrompt: `You are a safety classifier inside a mental-health support app used in India. Classify the user's message into exactly one of: NONE, TIER1, TIER2.

TIER1 definition: Any statement connecting relationship communication difficulty or intimacy distress to intent or a plan to end one's life or self-harm ("I can't do this anymore, I want it to stop", "I have a way to end it").
TIER2 definition: Persistent hopelessness about life broadly, or real functional collapse - not the ordinary, real difficulty of raising hard topics or navigating intimacy concerns, which is what this module is specifically designed to help with. Also watch for language suggesting non-consensual activity, coercion, or pressure within the relationship around intimacy - this module is built for real, but consensual, difficulty and discomfort, not for situations involving coercion or lack of consent, which need a different kind of support entirely.

Critical context 1: many people, especially in Indian English, use hyperbolic or idiomatic self-deprecating language that is NOT a genuine risk signal. Do NOT classify ordinary hyperbole, jokes, or figures of speech as TIER1 or TIER2, even if they contain words like "kill", "die", or "worthless".

Critical context 2 (specific to this module): this module's content is about real difficulty raising hard topics with a partner, and real discomfort or distress around intimacy. Genuine discomfort, shame, or difficulty about these topics is not itself a risk signal, and should be classified NONE. However, if a message suggests non-consensual activity, coercion, or pressure within the relationship around intimacy, treat this with the same seriousness as TIER1/TIER2 risk language, even if it doesn't fit the self-harm-specific definitions exactly, and flag it clearly in your reason field as a consent/coercion concern distinct from ordinary intimacy discomfort.

Only classify as TIER1 if there is a genuine indication of intent, a plan, or serious risk to someone's life or safety. Only classify as TIER2 if there is genuine persistent hopelessness about life broadly, real functional collapse, or the coercion/consent concern described above - not the ordinary, real difficulty of communication or intimacy this module is designed to help with.

When genuinely uncertain, prefer the lower tier (or NONE) rather than over-triggering - but never downgrade language that includes a specific plan, method, timeframe, or indication of coercion or lack of consent.

Respond with ONLY a raw JSON object, no markdown fences, no other text: {"tier": "NONE" | "TIER1" | "TIER2", "reason": "one short clause"}`,
    tier1FallbackWords: ["going to kill myself","planning to end my life","don't want to wake up tomorrow","have a plan to end my life","going to end it all tonight"],
    tier2FallbackWords: ["i am worthless","i feel like a burden to everyone","i hate who i am","there is no point in trying anymore","i can't live like this"]
  },
  openQuestions: [
    {
      area: "Clinical - priority",
      text: "Mechanism B (Intimacy & Sexual Concerns) has not been reviewed by anyone with clinical experience in sex therapy specifically. B1 (somatic body-awareness, Levine-informed) and the two [C] reference techniques (sensate-focus, EFT emotional-safety work) all deserve review from someone trained in that area, not just general CBT/somatic familiarity."
    },
    {
      area: "Clinical",
      text: "All 8 technique mappings (6 practicable + 2 reference-only) are my synthesis of the taxonomy's named sources - not clinician-reviewed."
    },
    {
      area: "Content decision - what this module does not depict",
      text: "Following the same principle established for Trauma (Module 6) and Identity, Belonging & Family Acceptance (Module 13): this module describes present-day feelings, barriers, and communication patterns around intimacy in detail, but never depicts anything physically explicit. The content stays at the emotional and relational level throughout - this is a psychoeducational app, not a sex-ed or clinical-sexology resource. Worth confirming this line was drawn in the right place throughout the module, not just in the touches most obviously about this topic."
    },
    {
      area: "Structural note - T=2 mechanism with two [C] techniques bridged together",
      text: "Mechanism B (T=2 practicable, one guardrailed, plus 2 [C] reference-only techniques) uses the T=2-plus-bridge-touch resolution validated since Intrusive Thoughts and Trauma - 2 technique touches, one bridge/orientation touch introducing both [C] techniques together, then separate check-in and separate pre-commitment. Bridging two [C] techniques in a single touch is not a new case - Trauma (Module 6) already established this when it had two [C] techniques of its own."
    },
    {
      area: "Structural note - retrieval check placement, now five modules on an unconfirmed convention",
      text: "Following the convention used in Modules 12, 13, 15, and 16 (also 2-mechanism modules), a single retrieval check opens at Week 3, testing both mechanisms, with no second check at Week 5. This is now the fifth module to use this convention without it ever being directly confirmed against Module 5 (Identity & Purpose), the actual precedent. This is no longer a minor open item - half a dozen modules now share a structural assumption that has never once been checked against the one module it's supposedly modeled on. This needs direct resolution before any further 2-mechanism module gets built, not another flag."
    },
    {
      area: "Content decision, bank composition",
      text: "With B1 (guardrail) and both [C] techniques excluded, 5 of 8 total techniques are eligible for the Reinforcement Bank, and all 5 were included. Reflections = A1, A2, A3, A4, B2 (5 techniques, 10 reps - worksheet/practice style). No Tools this time - every eligible technique in this module is a reflective, written-response exercise rather than a quick in-the-moment log, which is a new pattern (every prior module has had at least one Tool). Flagged as worth confirming this is fine rather than a sign something's missing - the taxonomy's actual techniques here just don't include a natural quick-habit candidate."
    },
    {
      area: "Content-authorship, recurring techniques",
      text: "Beck's CBT cognitive restructuring appears twice within this module (A4, B2), consistent with the pattern flagged since Module 11. This is the fourth consecutive Relationships-domain module to include a Beck/CBT technique."
    },
    {
      area: "Resolved",
      text: "Crisis helpline numbers reused from Modules 1-16 (KIRAN, TeleMANAS, Vandrevala Foundation) - national, not module-specific."
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
      text: "Nothing in this module has been clinically reviewed and nothing has been tested with a real user. Mechanism B's content, given the cultural sensitivity around this topic, deserves particular care in that review, not a routine pass."
    }
  ]
};
