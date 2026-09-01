import { ModuleContent } from '../../../types/moduleContent';

function opt(label: string, isTarget: boolean, explain: string) {
  return { label, isTarget, explain };
}

export const MODULE_15_CONTENT: ModuleContent = {
  moduleId: 'M15',
  slug: 'loss-endings',
  name: 'Loss & Endings',
  duration_weeks: 5,
  tier: 'Specialized - 599 rupees - Relationships domain',
  brief: {
    moduleName: 'Loss & Endings',
    moduleNumber: 15,
    tier: 'Specialized - 599 rupees - Relationships domain',
    scenarioSource: 'Pan-India, English-medium context - navigating emotional distress, rumination, and identity reconstruction after romantic breakups, as well as structural adjustment, social stigma, and routine rebuilding following marital separation or divorce across urban and traditional family settings.',
    mechanisms: [
      {
        key: 'A',
        name: 'Breakup Distress',
        short: 'Breakup Distress',
        def: 'The acute emotional distress, rumination, and identity disruption following the end of a romantic relationship - including grieving the loss of an imagined future, difficulty disengaging from repetitive counterfactual thinking, and reconstructing one\'s self-narrative after romantic breakup.',
        need: 'Emotional validation, meaning reconstruction, cognitive unhooking, and values reconnection',
        contrast: {
          who: 'Aisha',
          text: 'faced a painful romantic breakup - real grief and sudden emptiness - but rather than spending hours replaying old conversations or blaming herself for finding it hard, she gave herself permission to mourn the expected future while taking small, values-based steps in her daily life.'
        },
        techniques: [
          {
            code: 'A1',
            approach: 'Psychoeducation & Normalization',
            format: 'A',
            name: 'Grief-Stage Psychoeducation for Relationship Loss',
            source: 'Kübler-Ross stage model',
            what: 'Understanding common emotional responses to breakup distress (shock, bargaining, anger, sadness) as a descriptive, non-linear process rather than a rigid sequence of stages you must complete in order.',
            how: 'Emotional responses after a breakup move unpredictably. Recognizing that feelings come in waves helps normalize your experience and reduces guilt about having hard days.',
            why: 'Normalizes breakup grief descriptive framework without forcing a linear progression.'
          },
          {
            code: 'A2',
            approach: 'Constructivist Grief Work',
            format: 'A',
            name: 'Meaning-Making & Relationship Narrative Reconstruction',
            source: 'Robert Neimeyer, Constructivist Grief Work',
            what: 'Reframing the relationship story - naming what was meaningful, what did not work, and what lessons you carry forward - to build a coherent narrative rather than viewing the breakup as a total wasted effort.',
            how: 'When a relationship ends, the mind often oscillates between idealizing the past or feeling utter regret. Constructing an honest, integrated story restores perspective and meaning.',
            why: 'Targets the internal relationship narrative directly, integrating the ending into your life story.'
          },
          {
            code: 'A3',
            approach: 'CBT',
            format: 'A',
            name: 'Cognitive Restructuring of Breakup Rumination & Counterfactuals',
            source: 'Aaron Beck, CBT',
            what: 'Identifying and testing repetitive breakup thoughts - "If only I had acted differently," "I will never find love again" - against objective evidence to reduce self-blame and catastrophic predictions.',
            how: 'Rumination keeps you stuck in imaginary past scenarios. Examining automatic thoughts critically breaks the cycle of unhelpful self-criticism.',
            why: 'Works directly on repetitive counterfactual thinking and catastrophic breakup predictions.'
          },
          {
            code: 'A4',
            approach: 'ACT',
            format: 'A',
            name: 'Grief Processing for the Imagined Future & Values Reconnection',
            source: 'Steven Hayes, Acceptance and Commitment Therapy',
            what: 'Grieving the loss of plans, shared dreams, and expected milestones built with an ex-partner, and gently reconnecting with your core values in present daily life.',
            how: 'Part of breakup pain is mourning a future that will not happen. Naming the lost future explicitly allows you to grieve it and open up space for new personal commitments.',
            why: 'Addresses the loss of expected future milestones through acceptance and values-consistent action.'
          }
        ]
      },
      {
        key: 'B',
        name: 'Divorce / Separation Adjustment',
        short: 'Divorce / Separation Adjustment',
        def: 'Distress, identity changes, social stigma, and routine restructuring following legal or formal marital separation - including navigating changed family roles, coping with societal judgment or "failure" beliefs, and rebuilding an autonomous life after separation.',
        need: 'Autonomy, identity reconstruction, stigma resistance, and routine rebuilding',
        contrast: {
          who: 'Sanjay',
          text: 'navigated a difficult marital separation - real social pressure, changed housing, and financial adjustment - but rather than treating the separation as a personal failure or hiding from relatives, he focused on rebuilding autonomous daily routines grounded in his core values.'
        },
        techniques: [
          {
            code: 'B1',
            approach: 'Constructivist Grief Work',
            format: 'A',
            name: 'Meaning-Making & Identity Reconstruction After Separation',
            source: 'Robert Neimeyer, Constructivist Grief Work',
            what: 'Re-authoring your personal identity after the formal end of a marriage or long-term partnership - recognizing that your self-worth extends beyond marital status or social role.',
            how: 'Separation disrupts long-standing social roles and family structures. Rebuilding identity involves recognizing who you are beyond the marital title.',
            why: 'Distinct from A2: focuses specifically on identity reconstruction after marriage/separation structure changes.'
          },
          {
            code: 'B2',
            approach: 'CBT',
            format: 'A',
            name: 'Cognitive Restructuring of Divorce-Stigma Beliefs & Failure Myths',
            source: 'Aaron Beck, CBT',
            what: 'Challenging internalized social stigma and global self-blame thoughts ("I am a failure," "My life is ruined," "What will relatives say?") with balanced, evidence-based cognitive restructuring.',
            how: 'Social stigma can make separation feel like a public verdict on your worth. Separating cultural pressure from your actual reality protects your self-esteem.',
            why: 'Distinct from A3: targets internalized divorce stigma, failure myths, and social judgment.'
          },
          {
            code: 'B3',
            approach: 'ACT',
            format: 'A',
            name: 'Values-Based Life Rebuilding & Autonomous Routine Planning',
            source: 'Steven Hayes, Acceptance and Commitment Therapy',
            what: 'Designing new daily routines, living arrangements, financial habits, and social connections grounded in your personal values after marital separation.',
            how: 'When a shared household or routine ends, building intentional new micro-habits restores agency, independence, and daily stability.',
            why: 'Distinct from A4: focuses on practical routine rebuilding, autonomy, and living arrangements after separation.'
          }
        ]
      }
    ],
    escalation: {
      tier1: "Any statement connecting relationship loss, breakup distress, or separation to intent or a plan to end one's life or self-harm (\"I can't live without them, I want to end my life\", \"I have a plan to kill myself\").",
      tier2: "Persistent hopelessness, severe functional collapse (inability to work, eat, or sleep for extended periods), or separation-related safety concerns - including threats of violence from a partner or partner's family, unsafe living arrangements, custody coercion, or severe financial control/coercion."
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
      title: 'Two mechanisms of relationship loss',
      body: [
        'Relationship endings take different forms. This module covers two core experiences:',
        '1. Breakup Distress: coping with acute emotional pain, rumination, and grieving an imagined future after a romantic breakup.',
        '2. Divorce / Separation Adjustment: navigating identity changes, societal stigma, altered routines, and rebuilding life after marital separation.'
      ],
      cta: 'Continue'
    },
    {
      eyebrow: 'What this is - and isn\'t',
      title: 'Between-session psychoeducation, not therapy or legal counsel',
      body: [
        'This module does not promise that breakups are easy, nor does it prescribe a rigid timeline for healing.',
        'It is not a substitute for clinical psychotherapy, crisis intervention, or legal advice regarding separation.',
        'If you are experiencing severe functional collapse, thoughts of ending your life, or physical safety threats from a former partner, please access immediate support resources.'
      ],
      cta: 'Continue',
      crisisButton: true
    },
    {
      eyebrow: 'Why this module',
      title: 'Why we\'re suggesting this one',
      body: [
        'You indicated you are navigating a romantic breakup or marital separation.',
        'This module brings together 7 evidence-informed tools across two targeted mechanisms to support your adaptation and rebuilding.'
      ],
      cta: 'Continue'
    },
    {
      eyebrow: 'What to expect',
      title: 'The next 5 weeks',
      body: [
        'Short term: a short teaching touch on weekdays, taking a few minutes each. Weekends bring a short summary, not new content.',
        'Long term: this won\'t undo the ending, but it will offer 7 practical tools to help you process grief, challenge unhelpful thoughts, resist stigma, and rebuild your life.'
      ],
      cta: 'Continue'
    },
    {
      eyebrow: 'Theory grounding',
      title: 'The evidence-informed foundations',
      body: [
        'Each mechanism is built on established frameworks: Kübler-Ross stage model (descriptive), Neimeyer\'s Constructivist Grief Work, Beck\'s Cognitive Behavioral Therapy, and Hayes\'s Acceptance and Commitment Therapy.',
        'Weeks 1-2 focus on understanding each pattern clearly. Weeks 3-4 introduce the practical tools. Week 5 brings them together in a final integration.'
      ],
      theory: true,
      cta: 'Start Week 1'
    }
  ],
  weeks: [
    // WEEK 1: Mechanism A (Breakup Distress) - Understanding
    {
      num: 1,
      title: 'Breakup distress: recognising the pattern',
      mechanism: 'A',
      kind: 'blocked',
      retrievalCheck: null,
      touches: [
        {
          id: 'w1t1',
          title: 'Recognition - emotional waves after a breakup',
          role: 'Recognition #1',
          noDelayed: true,
          relate: {
            text: [
              'Welcome to Week 1. This week and next are about recognizing each pattern clearly before practicing tools.',
              'This week\'s pattern: <b>Breakup Distress</b> - the emotional pain, rumination, and disorientation following the end of a romantic relationship.',
              'Here\'s what that looks like. <b class=\'who\'>Aisha</b> broke up with her partner three months ago. Some days she feels composed; on other days, seeing a photo or visiting a familiar cafe brings a sudden wave of deep sadness. She worries that having hard days means she\'s "making no progress."'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'Which of these actually explains what Aisha is experiencing?',
            options: [
              opt('Breakup grief naturally comes in unpredictable waves; having hard days after feeling okay is normal adaptation, not regression', true, 'Right - emotional recovery after a breakup is non-linear. Experiencing painful waves alongside lighter days is standard, not a sign of going backward.'),
              opt('Aisha should be completely over the breakup after three months', false, 'Expecting emotional pain to disappear on a fixed schedule creates unnecessary self-criticism.'),
              opt('Feeling okay on some days means she never truly loved her partner', false, 'Moments of relief or focus are healthy signs of adaptation, not evidence of lack of care.')
            ],
            whyPrompt: 'In a few words - why is emotional recovery after a breakup non-linear?'
          },
          apply: {
            scenario: 'A friend who broke up with her partner two months ago says: "I was fine all week, but today I cried for an hour. Am I back at square one?"',
            prompt: 'In two or three sentences: what would you say to reframe her expectations about breakup progress?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "You\'re not back at square one at all. Breakup grief naturally moves in waves - having a hard day after a lighter week is completely normal adaptation, not regression."'
          },
          remember: {
            prompt: 'In a sentence or two: think of a time your emotions after a loss moved in waves rather than a straight line.',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w1t2',
          title: 'Recognition - the trap of breakup rumination',
          role: 'Recognition #2',
          delayedRef: 'w1t1_apply',
          delayedPrompt: 'Last touch, on your friend\'s breakup waves, you wrote:',
          relate: {
            text: [
              'Another part of breakup distress: <b class=\'who\'>Meera</b> spends hours every night replaying old text messages and conversations in her head.',
              'She asks herself endless counterfactual questions: "What if I hadn\'t brought up that argument?", "What if I had compromised more?" She hopes that finding the exact mistake will ease the painful feeling of rejection.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What does replaying old conversations and counterfactuals actually do?',
            options: [
              opt('It traps mental energy in unanswerable past scenarios, keeping emotional pain active without changing reality', true, 'That\'s the insight - rumination feels like problem-solving, but replaying past scenarios cannot alter the outcome and prolongs distress.'),
              opt('It guarantees that you will figure out the exact secret to preventing future breakups', false, 'Counterfactual rumination focuses on idealized past scenarios rather than realistic learning.'),
              opt('It proves that you were 100% responsible for the breakup occurring', false, 'Breakups usually involve complex dynamics from both partners; self-blaming rumination distorts reality.')
            ],
            whyPrompt: 'In a few words - why does breakup rumination feel like problem-solving while actually increasing pain?'
          },
          apply: {
            scenario: 'A coworker broke up a month ago and says: "If I just analyze every conversation from our last month, I\'ll understand why it happened and feel better."',
            prompt: 'In two or three sentences: how would you explain the rumination trap to him?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "Analyzing old texts feels like searching for an answer, but it keeps your mind stuck in the pain of the past. Real peace comes from accepting the ending rather than replaying the past."'
          },
          remember: {
            prompt: 'In a sentence or two: what is one counterfactual thought ("if only...") you\'ve caught yourself replaying after a loss?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w1t3',
          title: 'What grieving the imagined future involves',
          role: 'Functional logic',
          delayedRef: 'w1t2_apply',
          delayedPrompt: 'Last touch, on breakup rumination, you noted:',
          relate: {
            text: [
              'Between emotional waves and rumination, there\'s a core aspect of breakup distress to name: grieving the <i>imagined future</i>.',
              'Aisha realized she wasn\'t just missing her ex-partner; she was mourning the planned vacation next summer, the mutual friend group, and the life trajectory she had pictured with them.',
              'Notice what\'s happening: a breakup is not only the loss of a person in the present, but the loss of an expected future.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'Why is grieving an imagined future a central part of breakup distress?',
            options: [
              opt('Because we build identity, security, and plans around expected milestones; losing them requires real mourning', true, 'Right - relationship endings disrupt expected life trajectories. Acknowledging the loss of future plans allows you to grieve them explicitly.'),
              opt('Because grieving future plans proves that you can never build new goals again', false, 'Grieving a lost future path opens up space to eventually create new, authentic present goals.'),
              opt('Because future plans are imaginary, they should not cause any real sadness', false, 'Intangible expectations and shared dreams carry genuine emotional weight.')
            ],
            whyPrompt: 'In a few words - why does mourning an expected future path require explicit space?'
          },
          apply: {
            scenario: 'A friend who broke off an engagement says: "The wedding was six months away. I feel so silly crying over guest lists and honeymoon plans that won\'t happen."',
            prompt: 'In two or three sentences: how would you validate her grief over those future plans?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "You\'re not silly at all. You\'re mourning a future and shared milestones you had invested in. It makes complete sense to grieve those lost plans."'
          },
          remember: {
            prompt: 'In a sentence or two: what is one future expectation you had to let go of after a breakup or relationship change?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w1t4',
          title: 'What balanced breakup adaptation looks like',
          role: 'Contrast / boundary case',
          delayedRef: 'w1t3_apply',
          delayedPrompt: 'Last touch, on validating lost futures, you wrote:',
          relate: {
            text: [
              'Here\'s what a different response looks like.',
              '<b class=\'who\'>Aisha</b> stopped expecting herself to be "completely fine" right away. When sadness hit, she allowed herself 20 minutes to journal or feel the loss, and then re-engaged with her evening routine or met a friend for tea.',
              'This is the contrast case: not pretending the breakup didn\'t hurt, but allowing space for grief while continuing daily values-based living.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What makes Aisha\'s approach effective compared to total suppression or endless rumination?',
            options: [
              opt('She gives herself permission to feel grief while maintaining active engagement with present routines', true, 'That\'s the core balance - acknowledging pain without letting it paralyze daily living, and living without feeling guilty for taking a break from grief.'),
              opt('She has completely erased all memories of her ex-partner within a month', false, 'Aisha still feels sadness; the difference is how she responds to it, not the absence of memory.'),
              opt('She ignores her feelings completely during the day', false, 'The scenario explicitly shows her giving dedicated space to journal and feel the loss.')
            ],
            whyPrompt: 'In a few words - how does balancing grief space with daily routine support adaptation?'
          },
          apply: {
            scenario: 'A colleague asks Aisha how she handles hard days after her breakup without falling apart at work.',
            prompt: 'In two or three sentences: how would you describe Aisha\'s balance in your own words?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is recognizing that making dedicated space for feelings allows you to carry on with daily life without suppressing your emotions.'
          },
          remember: {
            prompt: 'In a sentence or two: what is one small way you can give yourself permission to feel your emotions without getting stuck in them?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w1t5',
          title: 'What actually happened',
          role: 'Reinforcing rep',
          delayedRef: 'w1t4_apply',
          delayedPrompt: 'Last touch, your description of Aisha was:',
          relate: {
            text: [
              'One more touch before we look at divorce and separation adjustment next week.',
              'Over four months, Aisha found that the emotional waves after her breakup became less intense. She still felt occasional sadness, but she no longer feared the hard days.',
              'That previews the tools coming in Week 3: breakup adaptation isn\'t about reaching a state where you feel zero sadness - it\'s about rebuilding meaning and moving forward with self-compassion.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What does Aisha\'s process show about breakup recovery?',
            options: [
              opt('Recovery is about building capacity to carry loss while engaging in a fulfilling present life', true, 'Right - healthy adaptation increases your ability to carry relationship loss without letting it dictate your self-worth.'),
              opt('Recovery means you must never think about your ex-partner again', false, 'Memories may remain; recovery changes your relationship to those memories.'),
              opt('Recovery requires proving to everyone that the breakup didn\'t bother you', false, 'Performing recovery for others adds pressure rather than aiding real adaptation.')
            ],
            whyPrompt: 'In a few words - why is building capacity to carry loss more realistic than total erasure?'
          },
          apply: {
            scenario: 'A friend who broke up six months ago says: "I still felt sad when I saw his photo today. Does this mean I\'m not healed?"',
            prompt: 'In two or three sentences: how would you reframe her understanding of being "healed"?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "Feeling sad when you see a photo doesn\'t mean you aren\'t healed. Healing means you can feel that momentary sadness without letting it ruin your day or dictate your self-worth."'
          },
          remember: {
            prompt: 'In a sentence or two: what is one realistic expectation you want to hold for your own recovery process?',
            placeholder: 'Your answer...'
          }
        }
      ],
      summary: 'This week: Breakup Distress, understanding non-linear emotional waves, unhooking from counterfactual rumination, and grieving the imagined future. Next week: Divorce / Separation Adjustment.'
    },

    // WEEK 2: Mechanism B (Divorce / Separation Adjustment) - Understanding
    {
      num: 2,
      title: 'Separation adjustment: recognising the pattern',
      mechanism: 'B',
      kind: 'blocked',
      retrievalCheck: null,
      touches: [
        {
          id: 'w2t1',
          title: 'Recognition - structural and identity disruption',
          role: 'Recognition #1',
          delayedRef: 'w1t5_apply',
          delayedPrompt: 'Last week, on reframing healing expectations, you wrote:',
          relate: {
            text: [
              'This week\'s pattern: <b>Divorce / Separation Adjustment</b> - distress, identity shifts, social stigma, and routine changes following legal or formal marital separation.',
              'Here\'s what that looks like. <b class=\'who\'>Sanjay</b> recently separated from his spouse after eight years of marriage. Beyond emotional pain, he faces structural disruptions: moving to a new apartment, splitting finances, and explaining the separation to relatives who offer unsolicited judgment.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'Which of these explains why marital separation carries distinct challenges compared to a casual breakup?',
            options: [
              opt('Separation involves legal, financial, living, and social structure changes alongside identity disruption and societal stigma', true, 'Right - marital separation disrupts formal legal, financial, housing, and family systems, often triggering social stigma alongside emotional grief.'),
              opt('Separation is easier because legal processes provide clear rules', false, 'Legal and administrative processes often increase stress and financial strain.'),
              opt('Sanjay should ignore all structural changes and focus only on his emotions', false, 'Addressing practical living and financial adjustments is necessary for building stability.')
            ],
            whyPrompt: 'In a few words - why does marital separation involve complex structural and social challenges?'
          },
          apply: {
            scenario: 'A cousin going through a divorce says: "I\'m struggling enough with missing my spouse, but changing my housing, bank accounts, and dealing with relative gossip is making me break down."',
            prompt: 'In two or three sentences: how would you validate the multiple layers of stress he is navigating?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "You\'re dealing with emotional grief AND massive structural, financial, and social changes all at once. Feeling overwhelmed is a natural response to that multi-layered stress."'
          },
          remember: {
            prompt: 'In a sentence or two: think of a major structural change in your life (housing, family role, finances). What was the hardest practical part to adapt to?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w2t2',
          title: 'Recognition - internalized divorce stigma & failure myths',
          role: 'Recognition #2',
          delayedRef: 'w2t1_apply',
          delayedPrompt: 'Last touch, on multi-layered separation stress, you wrote:',
          relate: {
            text: [
              'A different moment with <b class=\'who\'>Rekha</b>. She separated six months ago. At family gatherings, she senses quiet pity and whispers from relatives.',
              'She internalizes these messages, thinking: "My marriage failed, which means I am a failure. I\'ve ruined my life and my family\'s reputation." She avoids seeing friends because she feels ashamed.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What happens when someone internalizes societal divorce stigma as a personal verdict of "failure"?',
            options: [
              opt('It transforms a complex relationship ending into a global flaw in self-worth, causing severe shame and social withdrawal', true, 'That\'s the pattern - internalized stigma turns a structural relationship incompatibility into a personal badge of shame, increasing isolation.'),
              opt('Internalizing stigma motivates you to work harder to fix the past', false, 'Internalized stigma increases shame and self-criticism, which hampers constructive rebuilding.'),
              opt('Societal judgment is always an accurate reflection of personal character', false, 'Cultural stigma surrounding divorce often reflects traditional conformity pressures rather than individual worth.')
            ],
            whyPrompt: 'In a few words - why is separating cultural stigma from personal self-worth crucial?'
          },
          apply: {
            scenario: 'A friend who recently filed for divorce says: "Everyone in my community looks at me like a broken person. Maybe they\'re right and I couldn\'t make it work."',
            prompt: 'In two or three sentences: how would you challenge her belief that divorce equals personal failure?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "A relationship ending doesn\'t mean you are a failure or broken. Marriage incompatibility happens, and cultural stigma reflects old social pressures, not your personal worth."'
          },
          remember: {
            prompt: 'In a sentence or two: what is one area where you\'ve felt pressure from societal or family expectations?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w2t3',
          title: 'What avoiding life rebuilding costs',
          role: 'Functional logic',
          delayedRef: 'w2t2_apply',
          delayedPrompt: 'Last touch, on challenging failure myths, you noted:',
          relate: {
            text: [
              'Between structural disruption and social stigma, there\'s a pattern worth naming: putting life on hold indefinitely.',
              'Sanjay spends weekends sitting in his new apartment avoiding unpacking boxes, waiting until he feels "completely settled and un-bothered by the separation" before starting new routines or hobbies.',
              'What it actually costs: waiting for total emotional certainty before rebuilding routines keeps you in a state of suspended animation, prolonging disorientation.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What is putting daily routine rebuilding on hold actually doing?',
            options: [
              opt('Extending the disorienting "in-between" phase by withholding the daily anchors needed to feel settled', true, 'Right - rebuilding micro-routines and living space is what creates stability, not waiting for feelings to change spontaneously.'),
              opt('Protecting you from making any mistakes while adjusting to separation', false, 'Avoidance creates stagnation rather than protection.'),
              opt('Proving that you cannot handle new routines until legal processes end', false, 'Practical daily routines can be established independently of ongoing legal or administrative timelines.')
            ],
            whyPrompt: 'In a few words - why does building daily routines help create stability during separation?'
          },
          apply: {
            scenario: 'A neighbor who separated four months ago leaves his apartment un-decorated and eats takeaway every night, saying: "What\'s the point of setting up a home when I\'m alone?"',
            prompt: 'In two or three sentences: what perspective would you offer him about building a personal space?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "Setting up your home and cooking a decent meal isn\'t about who else is there - it\'s about creating a stable, supportive space for yourself right now."'
          },
          remember: {
            prompt: 'In a sentence or two: what is one small routine in your living space that brings you comfort?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w2t4',
          title: 'What autonomous rebuilding looks like',
          role: 'Contrast / boundary case',
          delayedRef: 'w2t3_apply',
          delayedPrompt: 'Last touch, on creating a supportive space, you wrote:',
          relate: {
            text: [
              'Here\'s what a different approach looks like.',
              '<b class=\'who\'>Sanjay</b> decided to unpack his apartment and establish three core micro-routines: cooking a healthy dinner three nights a week, joining a weekend running group, and setting clear boundaries with inquisitive relatives.',
              'This is the contrast case: rejecting failure myths and actively building an autonomous life grounded in personal values.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What makes Sanjay\'s autonomous rebuilding strategy effective?',
            options: [
              opt('It restores personal agency and daily predictability while establishing healthy boundaries around external judgment', true, 'That\'s the mechanism - micro-routines build internal stability, while boundary setting protects self-worth from social stigma.'),
              opt('It guarantees that his relatives will immediately apologize for their gossip', false, 'Boundaries control your own exposure and response, not relatives\' behavior.'),
              opt('It allows him to pretend he was never married', false, 'Autonomous rebuilding integrates your past while creating a meaningful new present chapter.')
            ],
            whyPrompt: 'In a few words - why do autonomous micro-routines restore agency after separation?'
          },
          apply: {
            scenario: 'Think of a situation where you felt your routine or independence disrupted.',
            prompt: 'In two or three sentences: name one small autonomous choice or micro-routine you could establish this week.',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is choosing a specific, self-directed action within your control.'
          },
          remember: {
            prompt: 'In a sentence or two: which personal value (e.g. autonomy, health, peace) does your micro-routine support?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w2t5',
          title: 'What actually happened',
          role: 'Reinforcing rep',
          delayedRef: 'w2t4_apply',
          delayedPrompt: 'Last touch, your autonomous choice was:',
          relate: {
            text: [
              'One more touch before we begin technique weeks next week.',
              'Six months after establishing his routines, Sanjay felt a renewed sense of confidence. The separation was still a significant life chapter, but it no longer defined his entire identity.',
              'That previews the tools coming in Week 4: separation adjustment involves dismantling failure myths, establishing clear boundaries, and rebuilding an intentional, autonomous life.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What does Sanjay\'s progress show about separation adjustment?',
            options: [
              opt('Adjustment comes from actively creating a meaningful new chapter, not from seeking social approval', true, 'Right - confidence after separation comes from internal values and daily self-care, not external validation.'),
              opt('Separation adjustment requires erasing all memories of your marriage', false, 'Integrating past experiences into your life story is more realistic than forced amnesia.'),
              opt('You should wait until everyone in your family agrees with your decision before moving on', false, 'Waiting for unanimous family approval can paralyze personal progress indefinitely.')
            ],
            whyPrompt: 'In a few words - why is active life rebuilding more effective than seeking social approval?'
          },
          apply: {
            scenario: 'A friend who separated eight months ago says: "I\'m finally starting to enjoy my weekends again without feeling guilty."',
            prompt: 'In two or three sentences: how would you affirm his milestone in autonomous rebuilding?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "That is a huge milestone. Enjoying your weekends without guilt shows that you are actively building a meaningful, autonomous life for yourself."'
          },
          remember: {
            prompt: 'In a sentence or two: what is one takeaway about separation adjustment you want to keep in mind?',
            placeholder: 'Your answer...'
          }
        }
      ],
      summary: 'This week: Divorce / Separation Adjustment, recognizing structural and identity disruption, unhooking from internalized stigma, and building autonomous daily routines. Next week: tools for Breakup Distress.'
    },

    // WEEK 3: Mechanism A technique week (T=4 practicable)
    {
      num: 3,
      title: 'Breakup distress: tools for recovery',
      mechanism: 'A',
      kind: 'technique',
      retrievalCheck: {
        prompt1: 'In your own words - what is the difference between Breakup Distress (Mechanism A) and Divorce / Separation Adjustment (Mechanism B)?',
        prompt2: 'And why might treating grief as a rigid sequence of stages or internalizing divorce as a personal failure cause extra distress?',
        reveal: 'Breakup Distress focuses on romantic loss, emotional waves, rumination over counterfactuals, and grieving an imagined future. Separation Adjustment involves structural legal/financial changes, identity reconstruction after marital role shifts, and resisting social stigma. Rigid stage expectations create guilt during natural emotional waves, and failure myths turn structural relationship incompatibility into a false verdict on personal self-worth.'
      },
      touches: [
        {
          id: 'w3t1',
          title: 'Grief-Stage Psychoeducation & Non-Linear Normalization',
          role: 'Technique A1 - Kübler-Ross stage model (Descriptive)',
          delayedRef: 'w2t5_apply',
          delayedPrompt: 'Last week, your response on autonomous milestones was:',
          relate: {
            text: [
              'This is the first tool for Breakup Distress: <b>Grief-Stage Psychoeducation</b>.',
              'Remember Aisha realizing her breakup grief moved in waves? Common responses - shock, bargaining, anger, sadness - are descriptive benchmarks, not a rigid checklist you must pass through in order.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why is viewing grief responses as descriptive options rather than a rigid linear checklist helpful when hard days happen?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think of an emotional wave you experienced after a breakup or relationship loss.',
            prompt: 'In two or three sentences: identify which response was active (e.g. sadness, bargaining, anger) and write a normalizing statement accepting that feeling without self-criticism.',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is normalizing the emotional wave as a natural part of adaptation.'
          },
          remember: {
            prompt: 'In a sentence or two: how does normalizing emotional waves reduce the impulse to panic when sadness hits?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w3t2',
          title: 'Meaning-Making & Relationship Narrative Reconstruction',
          role: 'Technique A2 - Neimeyer Constructivist Grief Work',
          delayedRef: 'w3t1_apply',
          delayedPrompt: 'Last touch, your normalizing statement was:',
          relate: {
            text: [
              'The second tool: <b>Meaning-Making & Relationship Narrative Reconstruction</b>.',
              'Instead of viewing your past relationship as either flawless or a complete waste of time, this tool helps you write an honest, balanced summary: what was good, what didn\'t work, and what you learned.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'How does writing a balanced relationship story (acknowledging both positive memories and real incompatibilities) help you move forward?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Reflect on a past relationship that ended.',
            prompt: 'In two or three sentences: write a balanced summary naming one thing you appreciated, one clear incompatibility, and one personal lesson you carry forward.',
            placeholder: 'Appreciated: ... / Incompatibility: ... / Lesson: ...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is holding both positive aspects and real incompatibilities together to form an integrated narrative.'
          },
          remember: {
            prompt: 'In a sentence or two: how does framing the relationship as a learning chapter change how you view its ending?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w3t3',
          title: 'Cognitive Restructuring of Breakup Rumination',
          role: 'Technique A3 - CBT Cognitive Restructuring',
          delayedRef: 'w3t2_apply',
          delayedPrompt: 'Last touch, your balanced summary was:',
          relate: {
            text: [
              'The third tool: <b>Cognitive Restructuring of Breakup Rumination</b>.',
              'Remember Meera replaying "if only" counterfactuals late at night? This tool helps you catch repetitive breakup thoughts and challenge them with balanced, evidence-based reasoning.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why does testing thoughts like "I ruined everything" against objective facts help break rumination loops?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think of a repetitive breakup thought you have experienced (e.g. "If only I had compromised more, we\'d still be together").',
            prompt: 'In two or three sentences: write the rumination thought, then write a balanced response looking at the situation objectively.',
            placeholder: 'Rumination thought: ... / Balanced response: ...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is replacing an all-or-nothing self-blame thought with a realistic, balanced evaluation.'
          },
          remember: {
            prompt: 'In a sentence or two: how does challenging rumination thoughts relieve emotional weight?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w3t4',
          title: 'Grief Processing for the Imagined Future & Values Reconnection',
          role: 'Technique A4 - ACT Acceptance & Values Reconnection',
          delayedRef: 'w3t3_apply',
          delayedPrompt: 'Last touch, your balanced response was:',
          relate: {
            text: [
              'The fourth tool: <b>Grief Processing for the Imagined Future</b>.',
              'Instead of ignoring the future plans you had built with a partner, this tool encourages explicitly naming the lost milestones, accepting the grief, and reconnecting with your personal values in the present.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why is grieving lost future plans explicitly necessary before you can set new, authentic personal goals?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think of an expected future milestone or shared plan that ended with the breakup.',
            prompt: 'In two or three sentences: name the lost future plan, acknowledge the grief, and state one small values-consistent action you will take for yourself this week.',
            placeholder: 'Lost future plan: ... / Present values action: ...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is naming the unfulfilled expectation honestly while committing to a present-day values action.'
          },
          remember: {
            prompt: 'In a sentence or two: how does choosing a present values action give you a sense of agency?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w3t5',
          title: 'How did it go, and a plan for next time',
          role: 'Check-in + pre-commitment',
          delayedRef: 'w3t4_apply',
          delayedPrompt: 'Last touch, your present values action was:',
          relate: {
            text: [
              'No new teaching this touch - two quick things before we move to Separation Adjustment next week.',
              'First, a check-in on Mechanism A tools (grief normalization, narrative reconstruction, CBT rumination restructuring, imagined future processing). Then, an if-then plan.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Which of the Mechanism A tools felt most helpful for your breakup recovery process, and why?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Select the tool from this week that offered the most clarity.',
            prompt: 'In two or three sentences, write an if-then plan: "If [breakup rumination or grief wave arises], then I will [specific tool, e.g. use CBT restructuring or practice values reconnection]."',
            placeholder: 'If [specific cue], then I will...'
          },
          reveal: {
            text: 'Something like: "If I catch myself replaying old arguments late at night, then I will pause, write down the rumination thought, and challenge it with my balanced CBT response."'
          },
          remember: {
            prompt: 'In a sentence or two: say your plan to yourself - does it feel achievable when breakup pain hits?',
            placeholder: 'Your answer...'
          }
        }
      ],
      summary: 'This week: four named tools for Breakup Distress - grief-stage normalization, narrative reconstruction, CBT rumination restructuring, and imagined future grief processing - plus a check-in and an if-then plan. Next week: tools for Separation Adjustment.'
    },

    // WEEK 4: Mechanism B technique week (T=3 practicable)
    {
      num: 4,
      title: 'Separation adjustment: tools for rebuilding',
      mechanism: 'B',
      kind: 'technique',
      retrievalCheck: null,
      touches: [
        {
          id: 'w4t1',
          title: 'Meaning-Making & Identity Reconstruction After Separation',
          role: 'Technique B1 - Neimeyer Constructivist Grief Work (Separation)',
          delayedRef: 'w3t5_apply',
          delayedPrompt: 'Last week, your if-then plan was:',
          relate: {
            text: [
              'This is the first tool for Separation Adjustment: <b>Meaning-Making & Identity Reconstruction</b>.',
              'Distinct from breakup narrative work, this tool focuses specifically on re-authoring your identity after the formal end of a marriage or long-term structural partnership.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why is defining your identity beyond marital status or family roles essential after separation?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Reflect on how your sense of self was tied to your marital or partnership status.',
            prompt: 'In two or three sentences: write an identity statement affirming who you are, your strengths, and your values independent of your relationship status.',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is grounding identity in internal qualities and values rather than a relationship title.'
          },
          remember: {
            prompt: 'In a sentence or two: how does affirming your independent identity change how you feel about the future?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w4t2',
          title: 'Cognitive Restructuring of Divorce-Stigma Beliefs',
          role: 'Technique B2 - CBT Restructuring of Stigma & Failure Myths',
          delayedRef: 'w4t1_apply',
          delayedPrompt: 'Last touch, your identity statement was:',
          relate: {
            text: [
              'The second tool: <b>Cognitive Restructuring of Divorce-Stigma Beliefs</b>.',
              'Remember Rekha internalizing judgment from relatives? This tool targets thoughts like "I failed" or "My life is ruined," replacing them with objective, balanced reframing.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why is separating cultural stigma surrounding divorce from your actual personal worth critical for rebuilding self-esteem?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think of a stigma belief or social judgment thought about separation (e.g., "People will think I failed at marriage").',
            prompt: 'In two or three sentences: state the stigma belief, then write a balanced CBT reframing separating social pressure from your true worth.',
            placeholder: 'Stigma belief: ... / Balanced reframing: ...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is dismantling the failure myth with realistic, self-compassionate evidence.'
          },
          remember: {
            prompt: 'In a sentence or two: how does dismantling divorce stigma protect your emotional peace?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w4t3',
          title: 'Values-Based Life Rebuilding & Autonomous Routines',
          role: 'Technique B3 - ACT Values & Autonomous Routine Planning',
          delayedRef: 'w4t2_apply',
          delayedPrompt: 'Last touch, your balanced reframing was:',
          relate: {
            text: [
              'The third tool: <b>Values-Based Life Rebuilding & Autonomous Routines</b>.',
              'Remember Sanjay setting up his apartment and establishing micro-routines? This tool focuses on designing practical daily habits, housing arrangements, and social connections grounded in your values.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'How do intentional daily micro-routines restore stability and independence after separation?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Look at your current daily living situation post-separation.',
            prompt: 'In two or three sentences: pick one specific area (living space, meals, exercise, social time) and outline two micro-routines you will practice this week.',
            placeholder: 'Target area: ... / Micro-routines: ...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is picking actionable micro-routines within your direct control.'
          },
          remember: {
            prompt: 'In a sentence or two: how does practicing autonomous micro-routines build your confidence?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w4t4',
          title: 'Establishing boundaries around social judgment',
          role: 'A note before the check-in',
          delayedRef: 'w4t3_apply',
          delayedPrompt: 'Last touch, your micro-routines were:',
          relate: {
            text: [
              'A quick note before this week\'s check-in.',
              'Separation adjustment often requires setting firm, compassionate boundaries with relatives or acquaintances who offer unsolicited opinions or judgment. You have the right to limit discussions about your personal life.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why are clear boundaries around social judgment necessary for protecting your adjustment space?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Reflect on intrusive questions or unsolicited comments from relatives or acquaintances.',
            prompt: 'In a sentence or two: write a simple, polite boundary phrase you can use (e.g., "I appreciate your concern, but I\'m not discussing my separation details right now").',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "Thank you for asking, but I\'m keeping details private right now and focusing on my day-to-day routine."'
          },
          remember: {
            prompt: 'In a sentence or two: how will using this boundary phrase protect your energy this week?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w4t5',
          title: 'How did it go, and a plan for next time',
          role: 'Check-in + pre-commitment',
          delayedRef: 'w4t4_apply',
          delayedPrompt: 'Last touch, your boundary phrase was:',
          relate: {
            text: [
              'No new teaching this touch - a check-in on Mechanism B tools (identity reconstruction, CBT stigma restructuring, values-based routine rebuilding) and an if-then plan.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Which of the Mechanism B tools was most helpful to try this week, and why?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Select the tool from this week that felt most practical.',
            prompt: 'In two or three sentences, write an if-then plan: "If [divorce stigma or isolation stress arises], then I will [specific tool, e.g. use CBT stigma restructuring or practice my autonomous micro-routine]."',
            placeholder: 'If [specific cue], then I will...'
          },
          reveal: {
            text: 'Something like: "If I feel ashamed about my separation at a family function, then I will remember my identity statement, use my polite boundary phrase, and focus on my core values."'
          },
          remember: {
            prompt: 'In a sentence or two: say your plan to yourself - does it feel empowering and realistic?',
            placeholder: 'Your answer...'
          }
        }
      ],
      summary: 'This week: three named tools for Separation Adjustment - identity reconstruction, CBT stigma restructuring, and autonomous routine rebuilding - plus a boundary note, a check-in, and an if-then plan. Next week: final integration & review.'
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
          title: 'Navigating complex relationship endings',
          role: 'Integration',
          delayedRef: 'w4t5_apply',
          delayedPrompt: 'Last week, your if-then plan was:',
          relate: {
            text: [
              'Farah experienced a breakup after a long-term cohabiting relationship (Mechanism A: Breakup Distress) that also involved shared housing and mutual friends (Mechanism B: Separation Adjustment dynamics). She feels both deep emotional heartbreak and practical lifestyle confusion.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'How do romantic grief and practical routine disruption interact when a long-term relationship ends?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Farah\'s situation - combined emotional heartbreak and practical lifestyle change.',
            prompt: 'In two or three sentences: suggest two tools across mechanisms (e.g. A4 imagined future processing + B3 autonomous routine rebuilding) that can help her navigate both sides.',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "Use A4 imagined future processing to mourn shared plans, combined with B3 autonomous routine rebuilding to establish new living habits and independent daily structure."'
          },
          remember: {
            prompt: 'In a sentence or two: how does combining emotional processing with practical routine building support recovery?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w5t2',
          title: 'Overcoming social stigma and self-doubt',
          role: 'Integration',
          delayedRef: 'w5t1_apply',
          delayedPrompt: 'Last touch, your combination plan for Farah was:',
          relate: {
            text: [
              'Rohan separated from his spouse after five years of marriage (Mechanism B: Separation Adjustment) and struggles with repetitive rumination over past arguments (Mechanism A: Breakup Distress) alongside fear of judgment from relatives.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'In Rohan\'s scenario, how does breakup rumination reinforce internalized social stigma?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Rohan\'s situation - rumination plus divorce stigma.',
            prompt: 'In two or three sentences: outline a step combining A3 CBT rumination restructuring with B2 stigma reframing.',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "Challenge counterfactual thoughts about past arguments using A3, while actively dismantling the \'I failed\' stigma belief using B2 to protect self-esteem."'
          },
          remember: {
            prompt: 'In a sentence or two: what key insight helps protect self-worth during separation?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w5t3',
          title: 'Rebuilding narrative and identity',
          role: 'Integration',
          delayedRef: 'w5t2_apply',
          delayedPrompt: 'Last touch, your step for Rohan was:',
          relate: {
            text: [
              'Deepika ended a long-term engagement (Mechanism A) and is adapting to living on her own while dealing with unsolicited advice from family (Mechanism B). She wants to integrate this experience into her life story with dignity.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why is combining narrative reconstruction (A2/B1) with firm social boundaries effective for long-term growth?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Deepika\'s situation - narrative integration and family boundaries.',
            prompt: 'In two or three sentences: suggest how she can re-author her narrative while setting boundaries with relatives.',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "Re-author her narrative to view the engagement ending as a courageous choice for compatibility, while using clear boundary phrases to politely decline unsolicited family opinions."'
          },
          remember: {
            prompt: 'In a sentence or two: how does owning your relationship narrative build long-term resilience?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w5t4',
          title: 'Reviewing your personal relationship toolkit',
          role: 'Integration',
          delayedRef: 'w5t3_apply',
          delayedPrompt: 'Last touch, your suggestion for Deepika was:',
          relate: {
            text: [
              'You now know 7 evidence-informed tools across Breakup Distress and Divorce / Separation Adjustment.',
              'Before the final transfer test, review which tools have offered the most clarity for your personal journey.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Looking back across all 5 weeks, which mechanism (A or B) best describes your primary focus, and why?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Reviewing your total experience.',
            prompt: 'In two or three sentences: pick the top two tools you plan to keep in your active toolkit going forward, and explain how you will use them.',
            placeholder: 'Top tools: ... / Planned usage: ...'
          },
          reveal: {
            text: 'There\'s no single right answer - what matters is choosing tools that match your actual situation and practice readiness.'
          },
          remember: {
            prompt: 'In a sentence or two: what is the most important lesson about relationship endings you want to remember?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w5t5',
          title: 'Your own situation - nothing pre-walked',
          role: 'Transfer test',
          transferTest: true,
          delayedRef: 'w5t4_apply',
          delayedPrompt: 'Last touch, your top tools were:',
          relate: {
            text: [
              'This is the one part of the module built with no scaffolding at all.',
              'You\'ve followed Aisha through breakup grief waves, Meera through rumination, Sanjay through separation routines, and Rekha through stigma reframing - and reflected on your own journey.',
              'Now it\'s just yours. You have your own real situation right now - romantic breakup, separation adjustment, or relationship transition. Don\'t simplify it.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Describe your actual situation in your own words - what relationship ending or transition are you navigating, and what makes it challenging?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'With nothing pre-walked this time.',
            prompt: 'In two or three sentences: what is your actual next move, and why that one - which of the 7 tools will you use, and what will you specifically do?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single right answer here - this final touch has no pre-walked answer options on purpose. What matters is whether your reasoning traces back to the evidence-informed tools from this module and fits your real situation.'
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
      code: 'A2',
      rep: 1,
      type: 'reflection',
      scenario: 'You find yourself idealizing a past romantic relationship or feeling total regret about it.',
      prompt: 'In two or three sentences: write a balanced relationship summary naming one good memory, one real incompatibility, and one personal lesson.',
      reveal: 'There\'s no single model answer - the tell is integrating both positive memories and real incompatibilities into a balanced summary.'
    },
    {
      code: 'A2',
      rep: 2,
      type: 'reflection',
      scenario: 'You worry that a past breakup means the relationship was a complete waste of time.',
      prompt: 'In two or three sentences: reframe the relationship ending as a meaningful learning chapter in your life story.',
      reveal: 'There\'s no single model answer - the tell is connecting lessons learned to your ongoing personal growth.'
    },

    {
      code: 'A3',
      rep: 1,
      type: 'reflection',
      scenario: 'You catch yourself replaying "if only" counterfactual thoughts about a breakup late at night.',
      prompt: 'In two or three sentences: state the rumination thought, then write a balanced CBT response evaluating the situation objectively.',
      reveal: 'There\'s no single model answer - the tell is challenging all-or-nothing self-blame with objective evidence.'
    },
    {
      code: 'A3',
      rep: 2,
      type: 'reflection',
      scenario: 'You feel a wave of anxiety, thinking: "I ruined my best chance at love."',
      prompt: 'In two or three sentences: test that catastrophic thought against facts and write a realistic re-evaluation.',
      reveal: 'There\'s no single model answer - the tell is unhooking from catastrophic predictions about your future.'
    },

    {
      code: 'B1',
      rep: 1,
      type: 'reflection',
      scenario: 'You feel disoriented about your personal identity after a marital separation.',
      prompt: 'In two or three sentences: write an identity statement affirming your self-worth, strengths, and values independent of marital status.',
      reveal: 'There\'s no single model answer - the tell is grounding identity in internal qualities rather than a relationship title.'
    },
    {
      code: 'B1',
      rep: 2,
      type: 'reflection',
      scenario: 'You struggle with feeling like your life story was broken by a separation.',
      prompt: 'In two or three sentences: re-author your separation narrative to view it as a courageous step toward compatibility and peace.',
      reveal: 'There\'s no single model answer - the tell is integrating separation into a continuous, dignified life narrative.'
    },

    {
      code: 'B2',
      rep: 1,
      type: 'reflection',
      scenario: 'You experience shame or worry about social judgment and divorce stigma from relatives.',
      prompt: 'In two or three sentences: state the failure myth thought, then write a balanced CBT reframing separating social pressure from your true worth.',
      reveal: 'There\'s no single model answer - the tell is dismantling divorce stigma with realistic self-compassion.'
    },
    {
      code: 'B2',
      rep: 2,
      type: 'reflection',
      scenario: 'You feel anxious about attending a social gathering after a separation.',
      prompt: 'In two or three sentences: prepare a mental reframing and a polite boundary phrase to protect your peace.',
      reveal: 'There\'s no single model answer - the tell is pairing cognitive reframing with a practical social boundary.'
    }
  ],
  toolsData: {
    grief_processing_log: {
      code: 'A4',
      title: 'Imagined Future & Grief Processing Log',
      mechShort: 'Breakup Distress',
      kind: 'log_single',
      intro: 'Log a specific lost milestone or future expectation you grieved today, and name one present values-consistent action taken for yourself.',
      logLabel: 'What lost milestone did you acknowledge today, and what values action did you take?',
      firstPlaceholder: 'e.g. Acknowledged grief over the summer trip we planned - booked a weekend trip with my sister instead',
      placeholder: 'Your answer...'
    },
    life_rebuilding_log: {
      code: 'B3',
      title: 'Values-Based Life Rebuilding Log',
      mechShort: 'Divorce / Separation Adjustment',
      kind: 'log_single',
      intro: 'Log an autonomous micro-routine or daily habit established to build independence and stability after separation.',
      logLabel: 'What autonomous micro-routine did you practice today, and what value did it serve?',
      firstPlaceholder: 'e.g. Cooked a nutritious dinner and set up my reading nook (Value: Health and Autonomy)',
      placeholder: 'Your answer...'
    }
  },
  mhpiConfig: {
    baselineQuestions: [
      { id: 'q1', label: 'Problem Severity', prompt: 'Overall, how much is breakup distress or separation adjustment affecting you right now?', min: 0, max: 10, minLabel: 'Not at all', maxLabel: 'Extremely', reverse: false },
      { id: 'q2', label: 'Functional Impact', prompt: 'How much is this issue interfering with your daily life (work, studies, relationships, or routine)?', min: 0, max: 10, minLabel: 'Not at all', maxLabel: 'Extremely', reverse: false },
      { id: 'q3', label: 'Avoidance', prompt: 'Because of this issue, how often do you avoid social situations, memories, or daily activities?', min: 0, max: 10, minLabel: 'Never', maxLabel: 'Always', reverse: false },
      { id: 'q4', label: 'Self-Efficacy', prompt: 'How confident are you that you can navigate this relationship ending effectively?', min: 0, max: 10, minLabel: 'Not confident', maxLabel: 'Extremely confident', reverse: true },
      { id: 'q5', label: 'Hope', prompt: 'How hopeful are you that you can rebuild a meaningful life after this ending?', min: 0, max: 10, minLabel: 'Not hopeful', maxLabel: 'Extremely hopeful', reverse: true }
    ],
    weeklyQuestions: [
      { id: 'w1', prompt: 'How much has breakup or separation distress affected you this week?', min: 0, max: 10, minLabel: 'Not at all', maxLabel: 'Extremely' },
      { id: 'w2', prompt: 'How confident do you feel rebuilding your life this week?', min: 0, max: 10, minLabel: 'Not confident', maxLabel: 'Extremely confident' },
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
    tier1: 'Any statement connecting relationship loss, breakup distress, or separation to intent or a plan to end one\'s life or self-harm ("I can\'t live without them, I want to end my life", "I have a plan to kill myself").',
    tier2: 'Persistent hopelessness, severe functional collapse (inability to work, eat, or sleep for extended periods), or separation-related safety concerns - including threats of violence from a partner or partner\'s family, unsafe living arrangements, custody coercion, or severe financial control/coercion.',
    systemPrompt: `You are a safety classifier inside a mental-health support app used in India. Classify the user's message into exactly one of: NONE, TIER1, TIER2.

TIER1 definition: Any statement connecting relationship loss, breakup distress, or separation to intent or a plan to end one's life or self-harm ("I can't live without them, I want to end my life", "I have a plan to kill myself").
TIER2 definition: Persistent hopelessness, severe functional collapse (inability to work, eat, or sleep for extended periods), or separation-related safety concerns - including threats of violence from a partner or partner's family, unsafe living arrangements, custody coercion, or severe financial control/coercion.

Critical context: Many people express sadness, grief, missing an ex-partner, anger, regret, loneliness, or uncertainty after a breakup or divorce ("I miss my ex so much", "I feel sad about my divorce", "I don't know who I am without them"). These are ordinary breakup and separation distress responses and must be classified as NONE.

Only classify as TIER1 if there is genuine intent, a plan, or explicit self-harm/suicide risk. Only classify as TIER2 if there is persistent hopelessness, severe functional collapse, or separation safety threats (partner violence threats, unsafe housing, custody coercion, financial control).

Respond with ONLY a raw JSON object: {"tier": "NONE" | "TIER1" | "TIER2", "reason": "one short clause"}`,
    tier1FallbackWords: ['going to kill myself', 'planning to end my life', 'don\'t want to wake up tomorrow', 'have a plan to end my life', 'cannot live without them and i know how i would kill myself'],
    tier2FallbackWords: ['i am worthless', 'i feel like a burden to everyone', 'there is no point in trying anymore', 'threatened to hurt me', 'coercing custody', 'financial control', 'unsafe at home']
  },
  openQuestions: [
    { area: 'Clinical review', text: 'All 7 technique mappings across Kübler-Ross stage model (descriptive), Neimeyer\'s Constructivist Grief Work, Beck\'s CBT, and Hayes\'s ACT require clinical sign-off by a specialist in relationship loss and separation adjustment.' },
    { area: 'Clinical review - safety', text: 'Verify separation and divorce safety-risk escalation (partner threats, family threats, custody coercion, financial control) to ensure crisis routing activates for safety threats without pathologizing normal separation distress.' },
    { area: 'Reinforcement accounting framework', text: 'Verify the deliberate exclusion of normalizing psychoeducation techniques (A1) from reinforcement bank practice assignments.' }
  ]
};
