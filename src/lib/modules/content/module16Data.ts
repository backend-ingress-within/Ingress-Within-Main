import { ModuleContent } from '../../../types/moduleContent';

function opt(label: string, isTarget: boolean, explain: string) {
  return { label, isTarget, explain };
}

export const MODULE_16_CONTENT: ModuleContent = {
  moduleId: 'M16',
  slug: 'arranged-long-distance-realities',
  name: 'Arranged & Long-Distance Realities',
  duration_weeks: 5,
  tier: 'Common - 499 rupees - Relationships domain',
  brief: {
    moduleName: 'Arranged & Long-Distance Realities',
    moduleNumber: 16,
    tier: 'Common - 499 rupees - Relationships domain',
    scenarioSource: 'Pan-India, English-medium context - the arranged-marriage "meeting" process common across many Indian communities, and long-distance relationships shaped by a partner working or studying abroad, or a post-marriage visa wait across urban and traditional family settings.',
    mechanisms: [
      {
        key: 'A',
        name: 'Arranged Marriage Compatibility Stress',
        short: 'Arranged Marriage Stress',
        def: 'Anxiety while evaluating a prospective spouse in an arranged-marriage process, distinct from general pressure to marry - often showing up during "meetings" with prospective matches, and pressure to decide quickly on limited interaction.',
        need: 'Certainty, Autonomy',
        contrast: {
          who: 'Radhika',
          text: 'has gone through the same arranged-marriage meetings, the same real time pressure - but she\'s found a way to actually name what she\'s evaluating for, rather than spiralling on whether she\'s certain enough to decide.'
        },
        techniques: [
          {
            code: 'A1',
            approach: 'ACT',
            format: 'A',
            name: 'A Values-Based Decision Matrix for Evaluating Compatibility Against Personal Priorities',
            source: 'Wilson and Lundgren-style ACT values work',
            what: 'Naming your actual values and priorities for a life partner - specifically, in your own words, not in general terms - and using them as a concrete matrix to evaluate a prospective match against, rather than relying on a vague, hard-to-pin-down sense of "rightness."',
            how: 'Without a concrete set of named priorities, evaluating a prospective match under real time pressure often collapses into chasing an elusive feeling of certainty. A specific matrix gives something concrete to actually evaluate against.',
            why: 'Addresses the evaluation itself directly, by making the criteria concrete rather than vague.'
          },
          {
            code: 'A2',
            approach: 'CBT',
            format: 'A',
            name: 'Cognitive Restructuring of Catastrophic "Wrong Decision" Thoughts',
            source: 'Aaron Beck',
            what: 'Writing down the specific catastrophic thought about deciding wrong - "if I choose incorrectly, my whole life is ruined" - and testing it against real, specific evidence, the way any other automatic thought would be tested.',
            how: 'The pressure and unfamiliarity of the arranged-meeting process can produce catastrophic thinking about the decision\'s stakes that goes beyond what the actual, real consequences support.',
            why: 'Targets the catastrophic thought about the decision directly, which is a different target than the evaluation criteria in A1.'
          },
          {
            code: 'A3',
            approach: 'Motivational Interviewing',
            format: 'A',
            name: 'A Decisional-Balance Exercise to Clarify Ambivalence Under Time Pressure',
            source: 'Miller and Rollnick, Motivational Interviewing',
            what: 'A structured exercise weighing the real pros and cons of moving forward versus not moving forward with a specific match, made explicit on paper rather than left as a vague, anxious feeling of ambivalence.',
            how: 'Ambivalence under time pressure often stays vague and overwhelming precisely because it\'s never actually been laid out concretely - naming the real considerations on both sides tends to clarify what the ambivalence is actually about.',
            why: 'Works directly with the ambivalence itself, which ACT\'s values work (A1) and CBT\'s catastrophic-thought work (A2) don\'t specifically target.'
          }
        ]
      },
      {
        key: 'B',
        name: 'Long-Distance Relationship Strain',
        short: 'Long-Distance Strain',
        def: 'Strain from geographic separation from a partner or spouse - often connected to a partner working or studying abroad, or a post-marriage visa wait, and compounded by time-zone gaps.',
        need: 'Connection, Security',
        contrast: {
          who: 'Karan',
          text: 'has navigated the same distance, the same time-zone strain with his partner - but he\'s built a real, structured rhythm of connection across the gap, rather than letting the distance itself become a constant source of insecurity.'
        },
        techniques: [
          {
            code: 'B1',
            approach: 'IPT',
            format: 'A',
            name: 'Interpersonal Communication Scheduling to Structure Connection Across Time Zones',
            source: 'Gerald Klerman and Myrna Weissman, Interpersonal Psychotherapy',
            what: 'Deliberately structuring when and how connection happens across a time-zone gap - a regular call time, a shared way to share small daily moments - rather than leaving connection to happen only when it randomly aligns.',
            how: 'Time-zone gaps can make connection feel like something that only happens by chance, which adds strain on top of the distance itself. A deliberate structure makes connection something reliable, not just hoped for.',
            why: 'Addresses the practical, structural side of staying connected across distance directly.'
          },
          {
            code: 'B2',
            approach: 'EFT',
            format: 'B',
            guardrail: true,
            name: 'Reassurance and Attachment-Repair Conversations for Distance-Triggered Insecurity',
            source: 'Sue Johnson, Emotionally Focused Therapy',
            what: 'A structured way of having the reassurance conversation when distance-triggered insecurity spikes - naming the underlying attachment fear directly to a partner, rather than letting it surface sideways as irritability or withdrawal.',
            how: 'Distance can amplify attachment fears that might otherwise stay quiet, and those fears often come out sideways - as coldness or picking fights - rather than being named directly, which tends to work better for actually getting reassurance.',
            why: 'Because this asks you to name a real, sometimes vulnerable attachment fear directly, this touch checks in with you partway through.'
          },
          {
            code: 'B3',
            approach: 'CBT',
            format: 'A',
            name: 'Cognitive Restructuring of Jealousy- and Insecurity-Driven Thoughts',
            source: 'Aaron Beck',
            what: 'Writing down a specific jealousy- or insecurity-driven thought that distance has amplified - "they\'re probably drifting away," "the distance means they don\'t need me as much" - and testing it against real, specific evidence.',
            how: 'Distance removes a lot of the ordinary, reassuring information that closeness normally provides, which can leave more room for anxious, unverified stories to take hold unless they\'re actively tested.',
            why: 'Targets the specific anxious thought directly, which is a different, more everyday-level target than the deeper attachment-repair work in B2.'
          }
        ]
      }
    ],
    escalation: {
      tier1: 'Any statement connecting arranged-marriage pressure or long-distance strain to intent or a plan to end one\'s life or self-harm ("I can\'t take the pressure anymore, I want it to stop", "I have a way to end it").',
      tier2: 'Persistent hopelessness about life broadly, or real functional collapse - not the ordinary, real anxiety of the arranged-marriage process or the real strain of distance, which is what this module is specifically designed to help with. Also watch for language suggesting real coercion in the arranged-marriage process - being pressured or forced toward a match against one\'s will, not just feeling ordinary decision pressure - which is a different, more serious concern than the decision anxiety this module addresses, and needs a different kind of support.'
    }
  },
  introScreens: [
    {
      eyebrow: 'Before we begin',
      title: 'What\'s stored, and who can see it',
      body: [
        'Your open-text answers in this module are saved to your private journal.',
        'The only person who can ever see them is your assigned practitioner, if you\'ve connected one - never other users, never shown anywhere public.',
        'If something you write suggests acute crisis or intent to harm yourself, we show you support resources right away.',
        'Your answers stay saved and reviewable by you for 12 months from purchase.',
        'You can turn this module off in Settings at any time.'
      ],
      cta: 'I understand - continue',
      consent: true
    },
    {
      eyebrow: 'What this module covers',
      title: 'Two related, but distinct, realities',
      body: [
        'This module covers two specific relationship realities:',
        '1. Arranged Marriage Compatibility Stress: navigating uncertainty, decision pressure, and evaluating prospective matches.',
        '2. Long-Distance Relationship Strain: coping with time-zone gaps, physical separation, communication strain, and insecurity across distance.'
      ],
      cta: 'Continue'
    },
    {
      eyebrow: 'What this is - and isn\'t',
      title: 'Between-session psychoeducation, not therapy or legal counsel',
      body: [
        'This module does not make decisions for you or promise instant clarity.',
        'It is designed for real decision anxiety and distance strain, not situations involving actual forced marriage, threats, or coercion.',
        'If you are experiencing forced marriage pressure, physical safety threats, or acute crisis, please access immediate support resources.'
      ],
      cta: 'Continue',
      crisisButton: true
    },
    {
      eyebrow: 'Why this module',
      title: 'Why we\'re suggesting this one',
      body: [
        'You indicated you are evaluating a match in an arranged-marriage process or managing a long-distance relationship.',
        'This module brings together 6 evidence-informed tools across two targeted mechanisms to support your decision-making and connection.'
      ],
      cta: 'Continue'
    },
    {
      eyebrow: 'What to expect',
      title: 'The next 5 weeks',
      body: [
        'Short term: a short teaching touch on weekdays, taking a few minutes each. Weekends bring a short summary, not new content.',
        'Long term: 6 practical tools to help you evaluate matches against personal priorities, challenge catastrophic decision thoughts, structure communication, and express underlying connection needs.'
      ],
      cta: 'Continue'
    },
    {
      eyebrow: 'Theory grounding',
      title: 'The evidence-informed foundations',
      body: [
        'Each mechanism is built on established frameworks: ACT values clarification, Beck\'s Cognitive Behavioral Therapy, Motivational Interviewing, Interpersonal Psychotherapy (IPT), and Emotionally Focused Therapy (EFT).',
        'Weeks 1-2 focus on understanding each pattern clearly. Weeks 3-4 introduce the practical tools. Week 5 brings them together in a final integration.'
      ],
      theory: true,
      cta: 'Start Week 1'
    }
  ],
  weeks: [
    // WEEK 1: Mechanism A (Arranged Marriage Compatibility Stress) - Understanding
    {
      num: 1,
      title: 'Arranged marriage stress: recognising the pattern',
      mechanism: 'A',
      kind: 'blocked',
      retrievalCheck: null,
      touches: [
        {
          id: 'w1t1',
          title: 'Recognition - chasing a feeling instead of naming a criteria',
          role: 'Recognition #1',
          noDelayed: true,
          relate: {
            text: [
              'Welcome to Week 1. This week and next are about recognizing each pattern clearly before practicing tools.',
              'This week\'s pattern: <b>Arranged Marriage Compatibility Stress</b> - anxiety while evaluating a prospective spouse, often showing up during "meetings" with prospective matches under time pressure.',
              'Here\'s what that looks like. <b class=\'who\'>Ishita</b> has met three prospective matches in the last month. After each one, family asks what she thought - and each time, she finds herself searching for a feeling of total certainty before she can answer, unable to say what she\'d actually need to feel sure.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'Which of these actually explains what\'s happening? More than one will sound reasonable.',
            options: [
              opt('She\'s searching for a vague feeling of certainty rather than evaluating against any concrete, named criteria', true, 'Right - without specific priorities named ahead of time, evaluating a match under real time pressure often collapses into chasing an elusive "right feeling" rather than assessing anything concrete.'),
              opt('Three meetings isn\'t enough information to form any real opinion', false, 'The scenario isn\'t really about the amount of information - it\'s about Ishita having no concrete criteria to evaluate against at all.'),
              opt('She should trust her gut instinct rather than overthink it', false, 'The scenario shows her searching for a feeling and not finding one, not overriding a clear instinct with too much thinking.')
            ],
            whyPrompt: 'In a few words - what\'s the giveaway that this is about missing criteria, not too little time?'
          },
          apply: {
            scenario: 'After his fourth meeting, Rohit tells his parents he\'s "just not sure," without being able to say what specifically he\'d want to be more sure about.',
            prompt: 'In two or three sentences: what would you actually say to Rohit right now?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "\'Not sure\' without knowing what you\'re actually evaluating for is hard to resolve by just meeting more people. It might help to name, specifically, what actually matters to you in a partner - then you\'d have something concrete to check each meeting against."'
          },
          remember: {
            prompt: 'In a sentence or two: think of a real decision where you were searching for certainty without having named what you were actually deciding based on.',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w1t2',
          title: 'Recognition - the stakes ballooning under pressure',
          role: 'Recognition #2',
          delayedRef: 'w1t1_apply',
          delayedPrompt: 'Last touch, on Rohit, you wrote this:',
          relate: {
            text: [
              'A different moment with Ishita. The night before deciding whether to move forward with the most recent match, she finds herself convinced that this one decision will single-handedly determine whether her entire life is happy or miserable.',
              'Notice what\'s happening: the actual decision - whether to continue getting to know one specific person - has ballooned into something with far larger, more permanent stakes than it actually carries.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What does this ballooning of stakes actually reflect?',
            options: [
              opt('Pressure and unfamiliarity are producing a catastrophic thought about the decision\'s actual, real consequences', true, 'Right - the real decision is being treated as equivalent to a permanent, total verdict on her whole life, which is a catastrophic leap the actual situation doesn\'t support.'),
              opt('Marriage decisions genuinely do carry stakes this large', false, 'Marriage is significant, but the specific decision - whether to continue with one match - isn\'t a single, irreversible verdict on her entire life.'),
              opt('She\'s right to take the decision extremely seriously', false, 'Taking a decision seriously and experiencing it as a totalizing verdict on her whole life are different things.')
            ],
            whyPrompt: 'In a few words - why might pressure make a real, but bounded, decision feel like it carries much larger stakes than it actually does?'
          },
          apply: {
            scenario: 'A friend asks Ishita: "Is this decision actually as final and total as it feels right now, or does it just feel that way because of the pressure?"',
            prompt: 'In two or three sentences: what would sitting with that question honestly look like for someone in Ishita\'s position?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer here - the tell is whether the answer separates the decision\'s real, bounded weight from the felt, catastrophic version of it.'
          },
          remember: {
            prompt: 'In a sentence or two: has a real but bounded decision ever felt, under pressure, like it carried far larger stakes than it actually did?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w1t3',
          title: 'What chasing certainty is actually costing',
          role: 'Functional logic',
          delayedRef: 'w1t2_apply',
          delayedPrompt: 'Last touch, you wrote this:',
          relate: {
            text: [
              'Between the search for a feeling of certainty and the ballooning stakes, there\'s a pattern worth naming honestly: waiting for total certainty before deciding can feel like the responsible, careful way to handle something this important.',
              'What it actually costs: total certainty rarely arrives on the arranged-meeting process\'s actual timeline, which means waiting for it can mean the anxiety just keeps compounding meeting after meeting.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What is waiting for total certainty actually doing?',
            options: [
              opt('Feeling like careful caution, while anxiety compounds meeting after meeting since total certainty rarely arrives on this timeline', true, 'That\'s the real trade - it feels like responsible caution, but if certainty doesn\'t arrive on a predictable schedule, waiting for it just means more meetings and more pressure.'),
              opt('The safest way to make sure the eventual decision is correct', false, 'Waiting for total certainty doesn\'t guarantee better decision quality; it often just increases pressure.'),
              opt('Evidence that Ishita isn\'t ready for marriage yet', false, 'This pattern is about a decision-making approach under pressure, not a broader readiness verdict.')
            ],
            whyPrompt: 'In a few words - why might waiting for total certainty compound anxiety rather than resolve it?'
          },
          apply: {
            scenario: 'A cousin asks a friend who has hesitated after her fifth meeting: "Has waiting for total certainty brought you any closer to it, or just brought more pressure?"',
            prompt: 'In two or three sentences: think of a time waiting for total certainty didn\'t bring certainty closer - what happened instead?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer here - the pattern to notice is whether waiting actually produced more certainty, or just more time and pressure.'
          },
          remember: {
            prompt: 'In a sentence or two: what does the pull to wait for total certainty usually feel like for you, right as it shows up?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w1t4',
          title: 'What evaluating against real criteria can look like',
          role: 'Contrast / boundary case',
          delayedRef: 'w1t3_apply',
          delayedPrompt: 'Last touch, you named this:',
          relate: {
            text: [
              'Here\'s what a similar situation can look like for someone who approaches the evaluation differently.',
              '<b class=\'who\'>Radhika</b> has gone through the same arranged-marriage meetings, the same real time pressure. But before her first meeting, she sat down and actually named, specifically, what mattered most to her in a partner - concrete priorities she could actually check each meeting against.',
              'This is the contrast case: real pressure still present, but a different way of approaching the evaluation.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What actually makes Radhika\'s approach different from Ishita\'s?',
            options: [
              opt('She evaluates against concrete, named priorities rather than searching for a vague feeling of total certainty', true, 'That\'s the real difference - she has something specific to actually check each meeting against, rather than waiting for an elusive feeling.'),
              opt('Her family is less involved in the process than Ishita\'s family', false, 'The scenario doesn\'t establish anything about family involvement - the difference is in how she approaches the evaluation.'),
              opt('She\'s simply less anxious by temperament than Ishita', false, 'The difference is attributed to having concrete criteria to evaluate against - a specific, learnable approach.')
            ],
            whyPrompt: 'In a few words - how might having concrete, named priorities change what a meeting feels like to evaluate?'
          },
          apply: {
            scenario: 'Radhika tells a friend: "I know what I\'m actually looking for, specifically - not just a feeling. So each meeting, I\'m checking against something real, not waiting to just magically feel sure."',
            prompt: 'In two or three sentences: think of your own priorities for a partner - what would naming them specifically look like?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer here - the useful pattern is noticing whether the priorities are specific and personal, not generic or borrowed.'
          },
          remember: {
            prompt: 'In a sentence or two: is there a decision in your life right now where naming concrete criteria might actually help?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w1t5',
          title: 'What actually happened',
          role: 'Reinforcing rep',
          delayedRef: 'w1t4_apply',
          delayedPrompt: 'Last touch, your idea was:',
          relate: {
            text: [
              'One more, and then a small piece of what actually happened with Ishita.',
              'After a conversation with a friend, she sat down and wrote out her real priorities. Her next meeting felt different: not certain, exactly, but she had something concrete to actually think about afterward.',
              'That previews the tools coming in Week 3: naming concrete criteria doesn\'t produce instant certainty, but it gives the evaluation something real to work with.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What does the different-feeling meeting tell us about what she\'d been missing in earlier meetings?',
            options: [
              opt('Having concrete criteria to evaluate against gave her something real to work with, which searching for a feeling hadn\'t provided', true, 'Right - the shift came from having something specific to evaluate, rather than waiting for a feeling that hadn\'t arrived.'),
              opt('This particular match must have been a better fit than earlier ones', false, 'The shift is attributed to Ishita\'s preparation - naming her priorities - not to something different about the match.'),
              opt('It doesn\'t prove anything, since she still wasn\'t certain afterward', false, 'Not being certain doesn\'t undercut the shift - having something concrete to reflect on is meaningful progress.')
            ],
            whyPrompt: 'In a few words - why might naming concrete criteria help even when it doesn\'t produce full certainty right away?'
          },
          apply: {
            scenario: 'Meher writes out her real priorities before her meeting, finding it gives her something specific to reflect on rather than a vague impression.',
            prompt: 'In two or three sentences: what does that shift tell Meher about her earlier meetings?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "The earlier meetings weren\'t giving her anything concrete to evaluate - naming her real priorities beforehand is what turned a vague impression into something she could actually think through."'
          },
          remember: {
            prompt: 'In a sentence or two: what would naming your own real priorities look like if you\'re facing something like this?',
            placeholder: 'Your answer...'
          }
        }
      ],
      summary: 'This week: arranged marriage compatibility stress, and how searching for a feeling of total certainty can feel responsible, even though naming concrete, specific priorities gives the evaluation something real to work with. Next week: long-distance relationship strain.'
    },

    // WEEK 2: Mechanism B (Long-Distance Relationship Strain) - Understanding
    {
      num: 2,
      title: 'Long-distance strain: recognising the pattern',
      mechanism: 'B',
      kind: 'blocked',
      retrievalCheck: null,
      touches: [
        {
          id: 'w2t1',
          title: 'Recognition - connection left to chance',
          role: 'Recognition #1',
          delayedRef: 'w1t5_apply',
          delayedPrompt: 'Last week, your idea was:',
          relate: {
            text: [
              'This week\'s pattern: <b>Long-Distance Relationship Strain</b> - strain from geographic separation, time-zone gaps, or post-marriage visa waits.',
              'Here\'s what that looks like. <b class=\'who\'>Arjun</b>\'s wife moved abroad for work eight months ago. There\'s no set time they talk - it happens whenever both happen to be free and awake, which some weeks is often, and other weeks barely happens at all.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'Which of these actually explains what\'s happening?',
            options: [
              opt('Leaving connection entirely to chance without deliberate structure makes it inconsistent and adds strain on top of distance itself', true, 'Right - without a deliberate structure, connection across a time-zone gap depends on random alignment, producing inconsistency.'),
              opt('This is an unavoidable feature of any long-distance relationship', false, 'Purely chance-based contact is a default, not an unavoidable feature of distance.'),
              opt('The inconsistency means the relationship itself is fundamentally struggling', false, 'This describes a structural gap - no deliberate connection schedule - not a verdict on underlying relationship health.')
            ],
            whyPrompt: 'In a few words - why might connection left entirely to chance add strain on top of distance itself?'
          },
          apply: {
            scenario: 'Sana finds calls with her fiancé abroad happening unpredictably - sometimes daily, sometimes not for four days, with no plan behind it.',
            prompt: 'In two or three sentences: what would you actually say to Sana right now?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "Leaving it to chance means connection depends entirely on random schedule alignment. A regular, agreed call time might give you both something reliable to count on."'
          },
          remember: {
            prompt: 'In a sentence or two: think of a real moment inconsistent, chance-based contact added strain, separate from distance itself.',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w2t2',
          title: 'Recognition - a fear surfacing sideways',
          role: 'Recognition #2',
          delayedRef: 'w2t1_apply',
          delayedPrompt: 'Last touch, on Sana, you wrote this:',
          relate: {
            text: [
              'A different moment with Arjun. After a stretch of missed calls due to his wife\'s demanding role, he picks a small fight over something unrelated during their next call - short and irritable without saying why.',
              'Notice what\'s happening: an underlying fear about the distance is surfacing sideways as irritability, rather than being named directly.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What does the sideways irritability actually reflect?',
            options: [
              opt('An underlying attachment fear about distance is coming out as irritability, rather than being named directly', true, 'Right - the irritability isn\'t about the small argument; it\'s fear about distance surfacing sideways, which is harder for a partner to respond to.'),
              opt('Arjun genuinely has an unrelated grievance that happens to come up now', false, 'The argument arises after missed calls, connecting to distance-related fear rather than an independent grievance.'),
              opt('His wife\'s demanding role is a sign she\'s deprioritizing the relationship', false, 'A demanding role explains missed calls; the pattern to notice is how Arjun processes the resulting fear.')
            ],
            whyPrompt: 'In a few words - why might a fear that surfaces sideways be harder for a partner to respond to than the fear named directly?'
          },
          apply: {
            scenario: 'A friend asks Arjun: "Were you actually annoyed about that small thing, or is something about the missed calls bothering you more?"',
            prompt: 'In two or three sentences: what would naming the real fear directly sound like for someone in Arjun\'s position?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer here - the tell is whether the answer names the underlying fear about distance directly.'
          },
          remember: {
            prompt: 'In a sentence or two: has a fear about distance ever surfaced sideways for you as irritability or coldness?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w2t3',
          title: 'What letting the fear surface sideways is actually costing',
          role: 'Functional logic',
          delayedRef: 'w2t2_apply',
          delayedPrompt: 'Last touch, you wrote this:',
          relate: {
            text: [
              'Between chance-based contact and sideways irritability, there\'s a pattern worth naming: letting fear come out as irritability can feel safer than admitting distance is scaring him.',
              'What it actually costs: it doesn\'t get him the reassurance he\'s looking for, since his wife can only respond to surface irritation, which usually produces more distance.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What is letting fear surface sideways actually doing?',
            options: [
              opt('Feeling less vulnerable in the moment, while failing to get reassurance since a partner can only respond to what\'s named', true, 'That\'s the real trade - staying indirect feels safer, but leaves the need for reassurance unmet since the partner only sees surface irritation.'),
              opt('An effective way to signal distress without having to be vulnerable', false, 'Irritability over unrelated topics is usually read as a complaint about that specific topic, not a signal of distance-related fear.'),
              opt('Evidence that Arjun is naturally a reserved communicator', false, 'This attributes the pattern to a fixed personality trait rather than an addressable communication choice.')
            ],
            whyPrompt: 'In a few words - why can a partner only respond to a fear that\'s actually been named?'
          },
          apply: {
            scenario: 'A friend asks: "Has staying indirect about what\'s bothering you ever gotten you the reassurance you needed, or just more distance?" The friend admits: "...Just more distance."',
            prompt: 'In two or three sentences: think of a time staying indirect about a real fear didn\'t get you what you needed - what happened instead?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer here - the pattern to notice is whether staying indirect actually produced reassurance or more distance.'
          },
          remember: {
            prompt: 'In a sentence or two: what does the pull to stay indirect about a real fear feel like when it shows up?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w2t4',
          title: 'What structured connection can look like',
          role: 'Contrast / boundary case',
          delayedRef: 'w2t3_apply',
          delayedPrompt: 'Last touch, you named this:',
          relate: {
            text: [
              'Here\'s what a similar situation looks like for someone who\'s built a different rhythm.',
              '<b class=\'who\'>Karan</b> has navigated the same distance and time-zone strain. But he and his partner set up a real structure early on - a fixed weekly video call, shared daily updates - and when insecurity spikes, he names it directly.',
              'This is the contrast case: real distance still present, but a different way of managing it.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What actually makes Karan\'s approach different from Arjun\'s?',
            options: [
              opt('He\'s built a deliberate structure for connection and names insecurity directly rather than leaving contact to chance', true, 'That\'s the real difference - he addressed both the structural side (connection rhythm) and emotional side (naming fear directly).'),
              opt('His partner is more available than Arjun\'s wife', false, 'The difference shown is in how the couple structures connection and communicates.'),
              opt('He simply misses his partner less than Arjun misses his wife', false, 'The difference is in how missing is structured and communicated, not in the intensity of feeling.')
            ],
            whyPrompt: 'In a few words - how might a deliberate connection structure change how much room insecurity has to grow?'
          },
          apply: {
            scenario: 'Karan says: "We don\'t leave connection to chance - we have a set time each week. And when I feel insecure, I just say it directly now."',
            prompt: 'In two or three sentences: what would a real, deliberate connection structure look like for your situation?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer here - the useful pattern is noticing whether the structure is specific and scheduled.'
          },
          remember: {
            prompt: 'In a sentence or two: is there a fear about distance you\'ve been letting surface sideways that you could try naming directly?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w2t5',
          title: 'What actually happened',
          role: 'Reinforcing rep',
          delayedRef: 'w2t4_apply',
          delayedPrompt: 'Last touch, your idea was:',
          relate: {
            text: [
              'One more, and then a small piece of what actually happened with Arjun.',
              'After that irritable call, he named it directly: unpredictable gaps in contact were feeding a fear that distance was pulling them apart. She hadn\'t known that\'s what the tension was about, and they set up a standing weekly call time.',
              'That previews the tools in Week 4: naming fear directly is usually what allows a partner to respond to what\'s real.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What does his wife\'s response tell us about what sideways irritability had failed to communicate?',
            options: [
              opt('Once the real fear was named directly, his wife could actually respond to it, which sideways irritability hadn\'t allowed', true, 'Right - she hadn\'t known tension was about fear of drifting apart until he said so directly.'),
              opt('His wife must not have cared about distance until he brought it up', false, 'She genuinely didn\'t know what was bothering him because sideways irritability hid it.'),
              opt('It doesn\'t prove anything, since distance itself is still there', false, 'Distance remaining unchanged doesn\'t undercut the shift - a standing call time and shared understanding are meaningful changes.')
            ],
            whyPrompt: 'In a few words - why might naming a fear directly give a partner the chance to actually respond to it?'
          },
          apply: {
            scenario: 'Priyanka tells her husband directly that silence between calls makes her anxious, and he immediately suggests a daily good-morning text.',
            prompt: 'In two or three sentences: what does his quick response tell Priyanka about the months of unexplained coldness beforehand?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "He couldn\'t respond to a fear he didn\'t know existed - naming it directly gave him something real to respond to."'
          },
          remember: {
            prompt: 'In a sentence or two: is there a fear about distance you could name directly to your partner this week?',
            placeholder: 'Your answer...'
          }
        }
      ],
      summary: 'This week: long-distance relationship strain, leaving connection to chance, and naming distance-triggered fears directly. Next week: tools for arranged marriage compatibility stress.'
    },

    // WEEK 3: Mechanism A technique week (T=3 exact fit)
    {
      num: 3,
      title: 'Arranged marriage stress: three tools, and a plan',
      mechanism: 'A',
      kind: 'technique',
      retrievalCheck: {
        prompt1: 'In your own words - what is arranged marriage compatibility stress, and why might naming concrete, specific priorities help even when it doesn\'t produce full certainty right away?',
        prompt2: 'And what is long-distance relationship strain - why might a fear that surfaces sideways, as irritability, be harder for a partner to actually respond to than the fear named directly?',
        reveal: 'Arranged marriage compatibility stress is the anxiety of evaluating a prospective spouse under real time pressure. Searching for a vague feeling of total certainty compounds anxiety, while naming concrete priorities gives the evaluation something real to work with. Long-distance relationship strain involves geographic separation and time-zone gaps. A fear surfacing sideways as irritability is harder for a partner to respond to than the same fear named directly, since partners can only respond to what is actually communicated.'
      },
      touches: [
        {
          id: 'w3t1',
          title: 'A Values-Based Decision Matrix for Evaluating Compatibility',
          role: 'Technique A1 - ACT (Wilson & Lundgren)',
          delayedRef: 'w2t5_apply',
          delayedPrompt: 'Last week, your answer was:',
          relate: {
            text: [
              'This is the first tool for arranged marriage compatibility stress: <b>a values-based decision matrix for evaluating compatibility against personal priorities</b>.',
              'Remember Ishita searching for a feeling instead of naming criteria? This tool builds a concrete matrix from your own specific values and priorities for a partner.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why might a specific, personal matrix work better than a general checklist of what\'s "supposed to" matter in a partner?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think of what actually matters most to you in a life partner, specifically and honestly.',
            prompt: 'In two or three sentences: name three to five specific priorities - specific enough to actually evaluate against.',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer here - the tell is specificity, not general qualities that don\'t help distinguish one match from another.'
          },
          remember: {
            prompt: 'In a sentence or two: did naming specific priorities feel different from a general sense of what you\'re looking for?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w3t2',
          title: 'Cognitive Restructuring of Catastrophic "Wrong Decision" Thoughts',
          role: 'Technique A2 - CBT (Beck)',
          delayedRef: 'w3t1_apply',
          delayedPrompt: 'Last touch, your priorities were:',
          relate: {
            text: [
              'The second tool: <b>cognitive restructuring of catastrophic "wrong decision" thoughts</b> - writing down the specific catastrophic thought about deciding wrong and testing it against real evidence.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why might pressure and unfamiliarity produce catastrophic thinking about a decision\'s stakes that goes beyond real consequences?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think of a catastrophic "wrong decision" thought that\'s shown up for you.',
            prompt: 'In two or three sentences: write the exact thought, then test it - what\'s the actual, bounded reality behind the catastrophic version?',
            placeholder: 'The thought: ... / The bounded reality: ...'
          },
          reveal: {
            text: 'There\'s no single model answer here - the tell is a specific, bounded reality, not a dismissal of how real pressure feels.'
          },
          remember: {
            prompt: 'In a sentence or two: did testing the thought change how permanent or total the stakes felt?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w3t3',
          title: 'A Decisional-Balance Exercise to Clarify Ambivalence',
          role: 'Technique A3 - Motivational Interviewing (Miller & Rollnick)',
          delayedRef: 'w3t2_apply',
          delayedPrompt: 'Last touch, you wrote this:',
          relate: {
            text: [
              'The third tool: <b>a decisional-balance exercise to clarify ambivalence under time pressure</b> - laying out the real pros and cons of moving forward versus not moving forward explicitly on paper.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why might ambivalence that\'s never been laid out explicitly stay vague and overwhelming, compared to ambivalence named on paper?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think of a decision you\'re weighing about moving forward with a match or significant decision under time pressure.',
            prompt: 'In two or three sentences: name the real considerations on both sides as specifically as you can.',
            placeholder: 'For moving forward: ... / Against: ...'
          },
          reveal: {
            text: 'There\'s no single model answer here - the tell is specific, honest considerations on both sides.'
          },
          remember: {
            prompt: 'In a sentence or two: did laying it out explicitly change how ambivalence felt?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w3t4',
          title: 'How did it go',
          role: 'Check-in',
          delayedRef: 'w3t3_apply',
          delayedPrompt: 'Last touch, your considerations were:',
          relate: {
            text: [
              'No new idea this touch - just a real check-in on the three tools from this week.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Which of the three did you actually try this week, if any - and what happened?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think back over the week\'s attempts, however small.',
            prompt: 'In two or three sentences: what actually happened when you tried one of these, compared to what you expected?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer here - the tell is comparing the real outcome honestly to what you expected.'
          },
          remember: {
            prompt: 'In a sentence or two: what surprised you most, if anything?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w3t5',
          title: 'A plan for next time',
          role: 'Pre-commitment',
          delayedRef: 'w3t4_apply',
          delayedPrompt: 'Last touch, you wrote this:',
          relate: {
            text: [
              'One more before we move to long-distance relationship strain: a plan built now while things feel calm.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Of the three tools this week, which do you trust most to actually reach for?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Pick whichever tool felt most useful or realistic to use.',
            prompt: 'In two or three sentences, write an if-then plan: "If [specific cue], then I will [specific tool, specifically applied]."',
            placeholder: 'If [specific cue], then I will...'
          },
          reveal: {
            text: 'Something like: "If I catch myself waiting for a feeling of total certainty after a meeting, then I\'ll check my actual priorities matrix instead."'
          },
          remember: {
            prompt: 'In a sentence or two: say the plan back to yourself - does it sound doable in a real moment?',
            placeholder: 'Your answer...'
          }
        }
      ],
      summary: 'This week: three named tools for arranged marriage compatibility stress - a values-based decision matrix, cognitive restructuring of catastrophic thoughts, and a decisional-balance exercise - plus a check-in and an if-then plan. Next week: long-distance relationship strain tools.'
    },

    // WEEK 4: Mechanism B technique week (T=3 exact fit, B2 guardrailed)
    {
      num: 4,
      title: 'Long-distance strain: three tools, and a plan',
      mechanism: 'B',
      kind: 'technique',
      retrievalCheck: null,
      touches: [
        {
          id: 'w4t1',
          title: 'Interpersonal Communication Scheduling',
          role: 'Technique B1 - IPT (Klerman & Weissman)',
          delayedRef: 'w3t5_apply',
          delayedPrompt: 'Last week, your if-then plan was:',
          relate: {
            text: [
              'This is the first tool for long-distance relationship strain: <b>interpersonal communication scheduling to structure connection across time zones</b>.',
              'Remember Arjun\'s chance-based contact? This tool deliberately structures when and how connection happens - a regular call time, a shared daily ritual - so connection doesn\'t depend on random alignment.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why might a deliberate structure for connection reduce strain, even without changing actual distance?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think of your own long-distance situation with a partner across a time-zone gap.',
            prompt: 'In two or three sentences: design a specific, realistic connection structure.',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer here - the tell is a specific, scheduled structure, not a vague intention to "talk more often."'
          },
          remember: {
            prompt: 'In a sentence or two: did designing a specific structure feel different from just intending to connect more?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w4t2',
          title: 'Reassurance and Attachment-Repair Conversations for Distance-Triggered Insecurity',
          role: 'Technique B2 - EFT (Sue Johnson) - guided',
          guardrail: true,
          delayedRef: 'w4t1_apply',
          delayedPrompt: 'Last touch, your structure was:',
          relate: {
            text: [
              'The second tool: <b>reassurance and attachment-repair conversations for distance-triggered insecurity</b> - naming an underlying attachment fear directly to a partner, rather than letting it surface sideways as irritability.',
              'Because this asks you to name a real, sometimes vulnerable fear directly, this touch checks in with you partway through.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why might naming an attachment fear directly be more likely to get you real reassurance than staying indirect?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think of a distance-triggered insecurity or fear that\'s shown up for you.',
            intensityPrompt: 'First, choose how far you want to go with this right now:',
            intensityOptions: [
              'Smaller version - just name the fear briefly, without drafting the full conversation yet',
              'Bigger version - name the fear and draft how you\'d actually say it to a partner'
            ],
            prompt: 'In two or three sentences: name the fear - or draft the conversation, depending on your choice above.',
            placeholder: 'Your answer...'
          },
          distressPrompt: 'You\'ve just named a real, sometimes vulnerable attachment fear. Before we continue - how are you feeling right now?',
          reveal: {
            text: 'There\'s no single model answer here - the tell is whether the fear is named specifically and directly.'
          },
          remember: {
            prompt: 'In a sentence or two: did naming the fear directly feel different from how it usually surfaces?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w4t3',
          title: 'Cognitive Restructuring of Jealousy- and Insecurity-Driven Thoughts',
          role: 'Technique B3 - CBT (Beck)',
          delayedRef: 'w4t2_apply',
          delayedPrompt: 'Last touch, you wrote this:',
          relate: {
            text: [
              'The third tool: <b>cognitive restructuring of jealousy- and insecurity-driven thoughts</b> - writing down a specific anxious thought that distance has amplified and testing it against real evidence.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why might distance leave more room for anxious, unverified stories to take hold, compared to being physically close?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think of a jealousy- or insecurity-driven thought distance has amplified for you.',
            prompt: 'In two or three sentences: write the exact thought, then test it against real, specific evidence.',
            placeholder: 'The thought: ... / The evidence: ...'
          },
          reveal: {
            text: 'There\'s no single model answer here - the tell is specific, real evidence, not vague reassurance.'
          },
          remember: {
            prompt: 'In a sentence or two: did testing the thought change how solid it felt?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w4t4',
          title: 'How did it go',
          role: 'Check-in',
          delayedRef: 'w4t3_apply',
          delayedPrompt: 'Last touch, your evidence was:',
          relate: {
            text: [
              'No new idea this touch - just a real check-in on the three tools from this week.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Which of the three did you actually try this week, if any - and what happened?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think back over the week\'s attempts, however small.',
            prompt: 'In two or three sentences: what actually happened when you tried one of these, compared to what you expected?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer here - the tell is whether you\'re comparing the real outcome honestly to what you expected.'
          },
          remember: {
            prompt: 'In a sentence or two: what surprised you most, if anything?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w4t5',
          title: 'A plan for next time',
          role: 'Pre-commitment',
          delayedRef: 'w4t4_apply',
          delayedPrompt: 'Last touch, you wrote this:',
          relate: {
            text: [
              'One more before we bring both patterns together next week: a plan built now, before the next distance-triggered insecurity shows up.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Of the three tools this week, which do you trust most to actually reach for?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Pick whichever tool felt most useful or realistic to use.',
            prompt: 'In two or three sentences, write an if-then plan: "If [specific cue], then I will [specific tool, specifically applied]."',
            placeholder: 'If [specific cue], then I will...'
          },
          reveal: {
            text: 'Something like: "If I notice an insecure thought spike after a missed call, then I\'ll test it against real evidence before naming the underlying fear directly."'
          },
          remember: {
            prompt: 'In a sentence or two: say the plan back to yourself - does it sound doable in a real moment?',
            placeholder: 'Your answer...'
          }
        }
      ],
      summary: 'This week: three named tools for long-distance relationship strain - communication scheduling, reassurance and attachment-repair conversations, and cognitive restructuring of insecurity-driven thoughts - plus a check-in and an if-then plan. Next week: bringing both patterns together.'
    },

    // WEEK 5: Integration + unscaffolded transfer test
    {
      num: 5,
      title: 'Integration & review',
      mechanism: 'both',
      kind: 'integration',
      retrievalCheck: null,
      touches: [
        {
          id: 'w5t1',
          title: 'When two patterns show up together',
          role: 'Integration',
          delayedRef: 'w4t5_apply',
          delayedPrompt: 'Last week, your if-then plan was:',
          relate: {
            text: [
              'Tanya is in the arranged-marriage meeting process (arranged marriage stress) - and her most promising match so far works abroad, meaning any decision to move forward would also mean starting a long-distance relationship or engagement (long-distance strain).'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Both patterns showed up here. Which one do you think is actually driving the other, and why?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Tanya\'s situation - combined evaluation process and long-distance question.',
            prompt: 'In two or three sentences: what would you recommend Tanya try out of all six tools you now know?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Some would start with the values-based decision matrix (A1) to see if distance is a real dealbreaker. Others say the decisional-balance exercise (A3) matters more directly. Either is defensible - what matters is she picks one and starts there.'
          },
          remember: {
            prompt: 'In a sentence or two: which would you have picked for yourself in her position?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w5t2',
          title: 'Designing a full response',
          role: 'Integration',
          delayedRef: 'w5t1_apply',
          delayedPrompt: 'Last touch, you said you\'d recommend:',
          relate: {
            text: [
              'Vikram got engaged through the arranged process six months ago (arranged marriage stress, resolved) - but his fiancée just left for a two-year program abroad, and distance-triggered insecurity is creeping in (long-distance strain, freshly emerging).'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Is this a genuinely new pattern, or is earlier decision-anxiety resurfacing in a new form?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Vikram\'s situation - resolved engagement decision and new distance strain.',
            prompt: 'In two or three sentences: design a full plan for Vikram, combining tools across patterns if needed.',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Communication scheduling (B1) addresses the structural gap directly. If insecurity surfaces sideways, the reassurance conversation approach (B2) is worth reaching for too.'
          },
          remember: {
            prompt: 'In a sentence or two: which pattern do you reach for tools on first, generally?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w5t3',
          title: 'One more, mixed',
          role: 'Integration',
          delayedRef: 'w5t2_apply',
          delayedPrompt: 'Last touch, your plan for Vikram was:',
          relate: {
            text: [
              'Ananya has been talking with a match for three weeks (arranged marriage stress) - he\'s mentioned he\'ll likely relocate abroad within the year, leading her to spiral about a long-distance future before there\'s even a relationship.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'How do both patterns seem to be feeding each other in Ananya\'s situation?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Ananya\'s situation - decision pressure and anticipatory spiral about a hypothetical future distance.',
            prompt: 'In two or three sentences: what\'s the one move that would help most right now, and why?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Spiralling about a hypothetical future distance before a decision is made is still Mechanism A territory - cognitive restructuring of catastrophic "wrong decision" thoughts (A2) fits better than jumping straight to distance tools.'
          },
          remember: {
            prompt: 'In a sentence or two: is there a real situation in your own life where both patterns show up together?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w5t4',
          title: 'A third scenario',
          role: 'Integration',
          delayedRef: 'w5t3_apply',
          delayedPrompt: 'Last touch, you wrote this:',
          relate: {
            text: [
              'Dev married through the arranged process two years ago and has navigated a long-distance marriage due to visa delays (long-distance strain, prolonged) - he notices original decision-anxiety resurfacing, wondering if distance means he made the wrong choice (arranged marriage stress, reactivated).'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Which pattern is loudest here, and what would you look for to check?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Dev\'s situation - prolonged distance and reactivated decision anxiety.',
            prompt: 'In two or three sentences: what\'s the one move that unblocks the most here?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Cognitive restructuring (A2) helps separate "marriage is hard right now due to distance" from "the marriage was the wrong choice," while ongoing distance strain still needs communication scheduling (B1) or direct reassurance (B2).'
          },
          remember: {
            prompt: 'In a sentence or two: does ongoing strain in a decision ever make you doubt the original decision itself?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w5t5',
          title: 'Your own situation - nothing pre-walked',
          role: 'Transfer test',
          transferTest: true,
          delayedRef: 'w5t4_apply',
          delayedPrompt: 'Last touch, your instinct was:',
          relate: {
            text: [
              'This is the one part of the module built with no scaffolding at all.',
              'You\'ve followed Ishita through the search for certainty in arranged marriage, Arjun through the strain of unstructured distance, and reflected on your own journey.',
              'Now it\'s just yours. You\'ve got a real situation right now - arranged marriage compatibility stress, long-distance relationship strain, or both. Don\'t simplify it.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Describe your actual situation in your own words - what\'s going on, as specifically as you can.',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'With nothing pre-walked this time.',
            prompt: 'In two or three sentences: what\'s your actual next move, and why that one - which of the six tools, and why not one of the others?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single right answer here - this touch was deliberately built to have no signaled answer. What matters is whether your reasoning traces back to the evidence-informed tools from this module.'
          },
          remember: {
            prompt: 'In a sentence or two: what do you actually want to remember from this module in your own words?',
            placeholder: 'Your answer...'
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
      scenario: 'A new prospective match or important relationship decision comes up again.',
      prompt: 'In two or three sentences: check it against your named priorities from before.',
      reveal: 'There\'s no single model answer here - the tell is whether priorities are actually being checked against, not re-invented each time.'
    },
    {
      code: 'A1',
      rep: 2,
      type: 'reflection',
      scenario: 'A different match or decision, maybe with different specific factors, comes up.',
      prompt: 'In two or three sentences: check this one against your priorities too.',
      reveal: 'There\'s no single model answer here - the tell is consistent, genuine use of the same named priorities.'
    },
    {
      code: 'A2',
      rep: 1,
      type: 'reflection',
      scenario: 'A catastrophic "wrong decision" thought shows up again about a decision.',
      prompt: 'In two or three sentences: write the thought, and test it against real, specific evidence.',
      reveal: 'There\'s no single model answer here - the tell is specific evidence, not vague reassurance.'
    },
    {
      code: 'A2',
      rep: 2,
      type: 'reflection',
      scenario: 'A different catastrophic thought, maybe at a different stage of the process, shows up.',
      prompt: 'In two or three sentences: write and test this one too.',
      reveal: 'There\'s no single model answer here - the tell is genuine, specific evidence for this particular thought.'
    },
    {
      code: 'A3',
      rep: 1,
      type: 'reflection',
      scenario: 'Ambivalence about a decision shows up again, feeling vague and overwhelming.',
      prompt: 'In two or three sentences: lay out the real considerations on both sides.',
      reveal: 'There\'s no single model answer here - the tell is specific, honest considerations on both sides.'
    },
    {
      code: 'A3',
      rep: 2,
      type: 'reflection',
      scenario: 'A different moment of ambivalence, maybe about a different decision, shows up.',
      prompt: 'In two or three sentences: lay this one out too.',
      reveal: 'There\'s no single model answer here - the tell is specificity to this particular ambivalence.'
    },
    {
      code: 'B3',
      rep: 1,
      type: 'reflection',
      scenario: 'A jealousy- or insecurity-driven thought about distance shows up again.',
      prompt: 'In two or three sentences: write the thought, and test it against real, specific evidence.',
      reveal: 'There\'s no single model answer here - the tell is specific evidence, not vague reassurance.'
    },
    {
      code: 'B3',
      rep: 2,
      type: 'reflection',
      scenario: 'A different insecurity-driven thought, maybe triggered differently, shows up.',
      prompt: 'In two or three sentences: write and test this one too.',
      reveal: 'There\'s no single model answer here - the tell is genuine, specific evidence for this particular thought.'
    }
  ],
  toolsData: {
    connection_schedule_log: {
      code: 'B1',
      title: 'Connection Structure Log',
      mechShort: 'Long-Distance Strain',
      kind: 'log_single',
      intro: 'Log how your deliberate connection structure - a set call time, a shared daily ritual - is actually going, to notice what\'s working and what needs adjusting.',
      logLabel: 'What was the structure, and how did it go this time?',
      firstPlaceholder: 'e.g. Kept our Sunday morning call even though I was tired - glad we stuck to it, felt more connected after',
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
    tier1: 'Any statement connecting arranged-marriage pressure or long-distance strain to intent or a plan to end one\'s life or self-harm ("I can\'t take the pressure anymore, I want it to stop", "I have a way to end it").',
    tier2: 'Persistent hopelessness about life broadly, or real functional collapse - not the ordinary, real anxiety of the arranged-marriage process or the real strain of distance. Also watch for language suggesting real coercion in the arranged-marriage process - being pressured or forced toward a match against one\'s will, not just feeling ordinary decision pressure.',
    systemPrompt: `You are a safety classifier inside a mental-health support app used in India. Classify the user's message into exactly one of: NONE, TIER1, TIER2.

TIER1 definition: Any statement connecting arranged-marriage pressure or long-distance strain to intent or a plan to end one's life or self-harm ("I can't take the pressure anymore, I want it to stop", "I have a way to end it").
TIER2 definition: Persistent hopelessness about life broadly, or real functional collapse - not the ordinary, real anxiety of the arranged-marriage process or the real strain of distance. Also watch for language suggesting real coercion in the arranged-marriage process - being pressured or forced toward a match against one's will, not just feeling ordinary decision pressure.

Critical context: Many people express anxiety, ambivalence, or strain about evaluating a match or managing a long-distance relationship ("I'm worried about choosing the wrong match", "I feel nervous about meeting them", "I miss my partner far away"). These are ordinary relationship realities and must be classified as NONE.

Only classify as TIER1 if there is genuine intent, a plan, or explicit self-harm/suicide risk. Only classify as TIER2 if there is persistent hopelessness, severe functional collapse, or actual forced marriage coercion (being forced to marry against one's will, physical safety threats, custody coercion, financial control).

Respond with ONLY a raw JSON object: {"tier": "NONE" | "TIER1" | "TIER2", "reason": "one short clause"}`,
    tier1FallbackWords: ['going to kill myself', 'planning to end my life', 'don\'t want to wake up tomorrow', 'have a plan to end my life', 'going to end it all tonight'],
    tier2FallbackWords: ['i am worthless', 'i feel like a burden to everyone', 'there is no point in trying anymore', 'forced to marry', 'threatened me if i refuse', 'not allowed to say no', 'controlling where i can go']
  },
  openQuestions: [
    { area: 'Clinical review', text: 'All 6 technique mappings across ACT values clarification, Beck\'s CBT, Motivational Interviewing, Interpersonal Psychotherapy (IPT), and Emotionally Focused Therapy (EFT) require clinical sign-off.' },
    { area: 'Clinical review - safety', text: 'Verify arranged-marriage decision pressure vs. actual coercion escalation (forced marriage, family threats, restriction of movement) to ensure crisis routing activates for coercion without pathologizing normal decision anxiety.' },
    { area: 'Arranged marriage representation', text: 'The arranged-marriage "meeting" process depicted here is written in a generalized pan-Indian way. Practice varies significantly across regions, communities, and families.' }
  ]
};
