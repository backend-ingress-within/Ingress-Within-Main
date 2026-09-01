import { ModuleContent } from '../../../types/moduleContent';

function opt(label: string, isTarget: boolean, explain: string) {
  return { label, isTarget, explain };
}

export const MODULE_14_CONTENT: ModuleContent = {
  moduleId: 'M14',
  slug: 'grief-loss-life-transitions',
  name: 'Grief, Loss & Life Transitions',
  duration_weeks: 7,
  tier: 'Common - 499 rupees - Life Experiences domain',
  brief: {
    moduleName: 'Grief, Loss & Life Transitions',
    moduleNumber: 14,
    tier: 'Common - 499 rupees - Life Experiences domain',
    scenarioSource: 'Pan-India, English-medium context - navigating bereavement (death of a parent, spouse, or loved one), major life transitions (relocation, career shifts, retirement, family role changes), and ambiguous loss (estrangement, caring for a family member with cognitive decline, or unfulfilled life dreams). Language is English-medium throughout.',
    mechanisms: [
      {
        key: 'A',
        name: 'Grief & Bereavement',
        short: 'Grief & Bereavement',
        def: 'The emotional, somatic, and practical adjustment following the death of someone important - including waves of grief, disruption to daily routines, identity shifts, continuing bonds with the deceased, and adapting to life after loss without forcing premature closure.',
        need: 'Space for grief, meaning, connection, and adaptation',
        contrast: {
          who: 'Vikram',
          text: 'faced the loss of his father - real pain, real emptiness - but rather than trying to force himself to "get over it" or perform false recovery for others, he gave himself permission to feel the waves of grief while maintaining a continuing bond through quiet, meaningful practices.'
        },
        techniques: [
          {
            code: 'A1',
            approach: 'ACT & Dual Process Model',
            format: 'A',
            name: 'Values-Based Dual-Process Adaptation to Bereavement',
            source: 'Stroebe & Schut (Dual Process Model of Bereavement) & Hayes (ACT)',
            what: 'Alternating between loss-orientation (permitting grief, remembering, feeling loss) and restoration-orientation (attending to life changes, new routines, values-based actions) at one\'s own pace.',
            how: 'Grief isn\'t a linear sequence of stages to complete - it moves in waves. Giving yourself permission to move between honoring loss and attending to ongoing life allows adaptation without guilt or forced closure.',
            why: 'Addresses the oscillation between grieving and living, preventing both total avoidance and complete paralysis.'
          },
          {
            code: 'A2',
            approach: 'Narrative Therapy & Continuing Bonds',
            format: 'A',
            name: 'Narrative Continuing Bonds & Memory Honor Practice',
            source: 'Klass, Silverman & Nickman (Continuing Bonds Theory) & Neimeyer (Meaning Reconstruction)',
            what: 'Cultivating an ongoing, meaningful internal relationship with the deceased through narrative reflection, honoring shared values and memories, rather than feeling forced to sever ties.',
            how: 'Healthy adaptation to loss does not require cutting emotional ties. Finding deliberate, active ways to keep a loved one\'s memory and values alive in your current life allows connection to endure.',
            why: 'Targets the belief that moving forward means forgetting or abandoning the person who was lost.'
          },
          {
            code: 'A3',
            approach: 'Behavioral Activation',
            format: 'A',
            name: 'Graded Re-Engagement with Values-Based Routines',
            source: 'Martell et al. (Behavioral Activation)',
            what: 'Gently re-introducing small, meaningful daily activities and social connections step-by-step when grief-related withdrawal or apathy leads to severe isolation.',
            how: 'When loss disrupts daily life, withdrawing completely can cause secondary low mood and isolation. Small, manageable steps back into routine preserve basic functioning without rushing emotional readiness.',
            why: 'Works on daily behavioral routines directly, providing stability when grief feels overwhelming.'
          },
          {
            code: 'A4',
            approach: 'Clinical Safety & Specialist Guidance',
            format: 'C',
            name: 'Clinical Support & Assessment for Prolonged Grief or Severe Traumatic Bereavement',
            source: 'Shear et al. (Complicated Grief Treatment / DSM-5-TR Prolonged Grief framework)',
            what: 'A structured reference guide outlining when grief is complicated by traumatic circumstances, persistent functional paralysis beyond expected adaptation, or intense self-blame, requiring specialized grief counseling.',
            how: 'When bereavement occurs under sudden traumatic circumstances or produces persistent, complete functional collapse, specialized professional therapy provides the targeted support self-guided materials cannot provide.',
            why: 'Because severe traumatic bereavement or prolonged paralysis requires individualized clinical care, this is provided as a reference card rather than an interactive worksheet.',
            professionalNote: 'If your loss involved traumatic circumstances or if grief has completely paralyzed your ability to manage basic daily needs for an extended period, working directly with a licensed grief counselor or psychotherapist is strongly recommended. Crisis resources are available in this app at any time.'
          }
        ]
      },
      {
        key: 'B',
        name: 'Major Life Transitions',
        short: 'Life Transitions',
        def: 'Distress and identity disorientation associated with major life changes - such as relocation, career shifts, graduation, retirement, changing family roles, or relationship endings - involving the loss of familiar routines, uncertainty, and adapting to new circumstances.',
        need: 'Stability, orientation, agency, and adaptation',
        contrast: {
          who: 'Meera',
          text: 'navigated a major career transition and city relocation - real uncertainty and loss of her old routine - but she focused on values-based anchor points and transition mapping rather than treating the disorientation as a sign she made a mistake.'
        },
        techniques: [
          {
            code: 'B1',
            approach: 'ACT',
            format: 'A',
            name: 'Values Clarification for Life Transitions & Identity Disorientation',
            source: 'Steven Hayes, Acceptance and Commitment Therapy',
            what: 'Identifying core values that remain constant across major life transitions, providing an internal compass when external roles, locations, or titles change.',
            how: 'When external roles change, feeling disoriented is natural. Grounding yourself in underlying values - what kind of person you want to be - creates stability even while external circumstances shift.',
            why: 'Addresses identity disorientation directly by separating your core values from temporary roles or environments.'
          },
          {
            code: 'B2',
            approach: 'CBT & Transition Mapping',
            format: 'A',
            name: 'Transition Structure Mapping & Cognitive Re-Framing of Uncertainty',
            source: 'William Bridges (Transition Framework) & Aaron Beck (CBT)',
            what: 'Mapping the transition into three clear phases (Ending, Neutral Zone, New Beginning) and identifying actionable stability anchors in daily routines to reduce uncertainty anxiety.',
            how: 'Transitions feel chaotic when experienced as a single overwhelming event. Categorizing where you stand and building predictable daily micro-routines restores a sense of agency.',
            why: 'Reduces uncertainty-driven anxiety by introducing concrete structure and cognitive clarity.'
          },
          {
            code: 'B3',
            approach: 'Narrative Therapy',
            format: 'A',
            name: 'Narrative Identity Integration Across Life Transitions',
            source: 'Dan McAdams (Narrative Identity) & White & Epston',
            what: 'Writing a coherent story connecting your past chapter, the current transition period, and your emerging future, recognizing strengths developed through past changes.',
            how: 'Major transitions often make life feel fragmented into "before" and "after." Constructing a continuous narrative highlights continuity and resilience across life chapters.',
            why: 'Works on the internal self-narrative, integrating major changes into your evolving identity.'
          }
        ]
      },
      {
        key: 'C',
        name: 'Ambiguous Loss & Unfinished Change',
        short: 'Ambiguous Loss',
        def: 'Distress arising when loss lacks clear closure or finality - such as family estrangement, a relationship changing without ending, caring for a relative with progressive cognitive decline, migration-related separation, or grieving an imagined future that did not happen.',
        need: 'Tolerance of uncertainty, meaning, emotional flexibility, and permission for mixed feelings',
        contrast: {
          who: 'Rohan',
          text: 'faced ambiguous loss when his parent experienced cognitive decline - the person was physically present but psychologically altered - but Rohan learned to hold two truths at once (grieving what was lost while connecting with what remains) without waiting for impossible closure.'
        },
        techniques: [
          {
            code: 'C1',
            approach: 'CFT & Ambiguous Loss Framework',
            format: 'B',
            guardrail: true,
            name: 'Both-And Thinking & Mixed-Emotion Acceptance for Ambiguous Loss',
            source: 'Pauline Boss (Ambiguous Loss Framework) & Paul Gilbert (CFT)',
            what: 'Practicing "both-and" cognitive flexibility (holding sadness and hope, presence and absence, love and boundaries) and accepting dialectical feelings without forcing artificial resolution.',
            how: 'Ambiguous loss resists clean closure because the situation itself remains unresolved. Learning to hold two opposing truths at once reduces the exhaustion of demanding impossible finality.',
            why: 'Because examining unresolved ambiguity can bring up intense mixed feelings, this touch includes intensity selection and a safety distress check.'
          },
          {
            code: 'C2',
            approach: 'ACT Defusion',
            format: 'A',
            name: 'Psychological Defusion from the "Search for Closure" Traps',
            source: 'Steven Hayes (ACT) & Pauline Boss',
            what: 'Recognizing when the mind gets caught in rumination or demanding final closure that the situation cannot provide, and unhooking from closure-seeking thoughts.',
            how: 'The mind naturally searches for clear answers, but demanding closure in an ambiguous situation keeps you stuck in repetitive rumination. Defusion helps you notice thoughts like "I need an explanation" without letting them dictate your life.',
            why: 'Targets repetitive rumination around closure directly, freeing up energy for present-focused living.'
          },
          {
            code: 'C3',
            approach: 'Narrative Therapy & Meaning Reconstruction',
            format: 'A',
            name: 'Re-Authoring the Imagined Future & Rebuilding Meaning',
            source: 'Robert Neimeyer (Meaning Reconstruction)',
            what: 'Grieving an unfulfilled dream or lost imagined future, and gradually building new meaningful commitments in the actual present.',
            how: 'Grieving a future that will never happen is a real, unseen loss. Naming the lost dream explicitly allows you to mourn it and then open up space for new, realistic goals.',
            why: 'Addresses intangible loss (the unlived life or unfulfilled expectation) directly through narrative re-authoring.'
          }
        ]
      }
    ],
    escalation: {
      tier1: "Any statement connecting grief, bereavement, or life transitions to intent or a plan to end one's life or self-harm (\"I can't go on without them, I want to end my life\", \"I have a plan to end it all\").",
      tier2: "Persistent hopelessness about life broadly, or severe functional collapse - extended inability to manage basic daily responsibilities (eating, hygiene, work) or extreme social withdrawal following loss."
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
      title: 'Three forms of loss and life change',
      body: [
        'Loss takes many shapes beyond death. This module covers three distinct experiences:',
        '1. Grief & Bereavement: adjusting to the death of someone important without forcing premature closure.',
        '2. Major Life Transitions: navigating disorientation and uncertainty during relocation, career shifts, or role changes.',
        '3. Ambiguous Loss: holding unresolved loss where clean closure isn\'t possible - like estrangement, cognitive decline in a loved one, or grieving an imagined future.'
      ],
      cta: 'Continue'
    },
    {
      eyebrow: 'What this is - and isn\'t',
      title: 'Between-session psychoeducation, not a replacement for therapy',
      body: [
        'This module does not attempt to "fix" or remove grief, nor does it prescribe a fixed sequence of stages to pass through.',
        'If you are experiencing severe functional collapse or thoughts of ending your life, please use the crisis support resources available in this app right away.',
        'This program offers evidence-informed tools to help you process loss, build stability, and adapt at your own pace.'
      ],
      cta: 'Continue',
      crisisButton: true
    },
    {
      eyebrow: 'Why this module',
      title: 'Why we\'re suggesting this one',
      body: [
        'You indicated you are navigating bereavement, a major life transition, or an unresolved loss without clear closure.',
        'This module brings together 10 specific, evidence-informed tools across three clear mechanisms to support your adaptation.'
      ],
      cta: 'Continue'
    },
    {
      eyebrow: 'What to expect',
      title: 'The next 7 weeks',
      body: [
        'Short term: a short teaching touch on weekdays, taking a few minutes each. Weekends bring a short summary, not new content.',
        'Long term: this won\'t erase your loss or undo major life changes. What it offers is 10 practical tools to help you make space for grief, anchor yourself through transitions, and rebuild meaning.'
      ],
      cta: 'Continue'
    },
    {
      eyebrow: 'Theory grounding',
      title: 'The evidence-informed foundations',
      body: [
        'Each mechanism is built on established psychological frameworks: Stroebe & Schut\'s Dual Process Model, Klass\'s Continuing Bonds Theory, Bridges\' Transition Framework, Boss\'s Ambiguous Loss Model, and ACT.',
        'Weeks 1-3 focus on recognizing each pattern clearly. Weeks 4-6 introduce the practical tools one by one. Week 7 brings them together in a final integration.'
      ],
      theory: true,
      cta: 'Start Week 1'
    }
  ],
  weeks: [
    // WEEK 1: Mechanism A (Grief & Bereavement) - Understanding
    {
      num: 1,
      title: 'Grief & bereavement: recognising the pattern',
      mechanism: 'A',
      kind: 'blocked',
      retrievalCheck: null,
      touches: [
        {
          id: 'w1t1',
          title: 'Recognition - grief comes in waves, not linear stages',
          role: 'Recognition #1',
          noDelayed: true,
          relate: {
            text: [
              'Welcome to Week 1. This week and the next two are about recognizing each pattern clearly before applying tools.',
              'This week\'s pattern: <b>Grief & Bereavement</b> - the emotional, somatic, and practical adjustment following the death of someone important.',
              'Here\'s what that looks like. <b class=\'who\'>Vikram</b> lost his father six months ago. Some days he feels relatively calm and able to focus at work; on other days, a sudden memory brings a fresh wave of heavy grief. He worries that having hard days after feeling okay means he\'s "regressing."'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'Which of these actually explains what Vikram is experiencing?',
            options: [
              opt('Grief naturally moves in waves and oscillation, not a neat linear sequence of stages', true, 'Right - modern grief science shows adaptation involves moving back and forth between missing the person and attending to daily life. Wave-like feelings are normal, not regression.'),
              opt('Vikram should be fully over his grief after six months', false, 'Grief has no fixed expiration date. Expecting complete resolution in six months creates unhelpful pressure.'),
              opt('Feeling okay on some days means he didn\'t truly care about his father', false, 'Experiencing moments of relief or focus is a healthy part of adaptation, not evidence of a lack of love.')
            ],
            whyPrompt: 'In a few words - why is grief moving in waves a normal part of adaptation?'
          },
          apply: {
            scenario: 'A friend lost her grandmother four months ago. She says: "Last week I felt fine, but today I cried all morning. Am I doing grief wrong?"',
            prompt: 'In two or three sentences: what would you actually say to your friend right now?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "You\'re not doing grief wrong at all. Grief naturally comes in waves - having a hard day after a lighter week is completely normal, not a sign of going backward."'
          },
          remember: {
            prompt: 'In a sentence or two: think of a time you expected your emotions to follow a neat timeline, but they came in waves instead.',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w1t2',
          title: 'Recognition - continuing bonds versus forced closure',
          role: 'Recognition #2',
          delayedRef: 'w1t1_apply',
          delayedPrompt: 'Last touch, on your friend\'s grief waves, you wrote:',
          relate: {
            text: [
              'A different moment with Vikram. A relative advises him: "You need to put his things away and stop talking about him so much so you can move on."',
              'Vikram feels guilty whenever he keeps his father\'s old watch on his desk or talks about a shared memory. He assumes moving on requires forgetting.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What does the advice to "stop talking about him so you can move on" actually miss?',
            options: [
              opt('Maintaining a continuing bond through memories and shared values is a healthy part of adaptation, not an obstacle to living', true, 'That\'s the key distinction - continuing bonds theory shows that holding a place for the deceased in your life supports long-term adjustment.'),
              opt('Putting away all personal belongings immediately is required for emotional health', false, 'Forcing premature removal of belongings often increases distress rather than helping.'),
              opt('Talking about a loved one means you are stuck in denial', false, 'Sharing memories and honoring a loved one is a natural way of keeping connection alive while adapting to the present.')
            ],
            whyPrompt: 'In a few words - why might keeping a loved one\'s memory active actually support moving forward?'
          },
          apply: {
            scenario: 'Pooja lost her sister a year ago. She keeps her sister\'s favorite book on her bedside table and reads a passage when she feels down. Someone calls it "dwelling on the past."',
            prompt: 'In two or three sentences: how would you reframe Pooja\'s choice using continuing bonds?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "Keeping her sister\'s book nearby isn\'t dwelling on the past - it\'s a meaningful way of maintaining a connection that gives her comfort while she lives her life."'
          },
          remember: {
            prompt: 'In a sentence or two: is there a memory, value, or object from someone you lost that brings you comfort rather than holding you back?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w1t3',
          title: 'What avoiding grief actually costs',
          role: 'Functional logic',
          delayedRef: 'w1t2_apply',
          delayedPrompt: 'Last touch, on Pooja\'s sister, you wrote:',
          relate: {
            text: [
              'Between the waves of grief and the pressure for closure, there\'s a pattern worth naming: trying to suppress grief entirely - keeping constantly busy, ignoring feelings, or avoiding any reminder - can feel like it\'s protecting you.',
              'What it actually costs: suppressed grief often resurfaces as unexplained fatigue, irritability, somatic tension, or sudden emotional overload later on.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What is constant busy-ness to avoid grief actually doing?',
            options: [
              opt('Delaying emotional processing while consuming continuous energy, causing cumulative exhaustion', true, 'Right - avoidance requires active energy. It pushes grief under the surface temporarily, but the underlying emotional weight remains.'),
              opt('Permanently resolving the grief by keeping the mind distracted', false, 'Distraction offers short-term relief, but constant avoidance does not resolve underlying emotional pain.'),
              opt('Proving that emotional pain disappears if you ignore it long enough', false, 'Research shows unaddressed grief tends to resurface through body symptoms or sudden emotional distress.')
            ],
            whyPrompt: 'In a few words - why does suppressing grief take a heavy physical and emotional toll?'
          },
          apply: {
            scenario: 'Rohan works 14-hour days to avoid thinking about his recent loss. At night, he can\'t sleep and feels a constant knot in his chest.',
            prompt: 'In two or three sentences: what would you point out to Rohan about what his strategy is currently costing him?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "Working 14-hour days might keep your mind busy during the day, but the physical exhaustion and chest tightness show that the grief is still there, taking a real toll on your body."'
          },
          remember: {
            prompt: 'In a sentence or two: have you ever tried to stay constantly busy to avoid a painful emotion? What happened?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w1t4',
          title: 'What dual-process adaptation can look like',
          role: 'Contrast / boundary case',
          delayedRef: 'w1t3_apply',
          delayedPrompt: 'Last touch, on Rohan\'s busy-ness, you noted:',
          relate: {
            text: [
              'Here\'s what a different approach looks like.',
              '<b class=\'who\'>Vikram</b> started setting aside quiet time in the evening to look at old photos or write down memories of his father (loss orientation). During the day, he focuses on his work projects and meets friends for dinner (restoration orientation), without feeling guilty for doing either.',
              'This is the module\'s contrast case: not the absence of pain, but a balanced movement between grieving and living.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What makes Vikram\'s current approach different from total avoidance or complete paralysis?',
            options: [
              opt('He creates deliberate space for grief while also allowing himself to participate in ongoing life', true, 'That\'s the dual-process model - honoring the loss without letting it shut down daily living entirely, and engaging in life without feeling guilty for taking a break from grief.'),
              opt('He has completely eliminated his sadness through positive thinking', false, 'Vikram still feels deep sadness - the difference is how he holds it, not the total absence of pain.'),
              opt('He only focuses on work and has stopped thinking about his father', false, 'The scenario explicitly shows him setting aside quiet time in the evening to look at photos and honor his father.')
            ],
            whyPrompt: 'In a few words - how does alternating between grief space and daily routine help?'
          },
          apply: {
            scenario: 'A colleague asks Vikram how he manages to stay focused at work while still mourning his loss. Vikram explains his approach.',
            prompt: 'In two or three sentences: how would you describe Vikram\'s balance in your own words?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is recognizing that making dedicated space for grief allows you to re-engage with daily life without feeling like you\'re abandoning the person you lost.'
          },
          remember: {
            prompt: 'In a sentence or two: what would making dedicated, gentle space for your own feelings look like today?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w1t5',
          title: 'What actually happened',
          role: 'Reinforcing rep',
          delayedRef: 'w1t4_apply',
          delayedPrompt: 'Last touch, your description of Vikram was:',
          relate: {
            text: [
              'One more touch before we look at major life transitions next week.',
              'Over the next few months, Vikram found that the waves of grief didn\'t disappear, but they became less overwhelming. Because he stopped fighting the hard days, he felt less exhausted.',
              'That\'s not a coincidence, and it previews the tools coming in Week 4: adaptation to loss isn\'t about reaching a state where you never feel sad - it\'s about building a life that has room for both memory and growth.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What does Vikram\'s experience teach us about the goal of grief work?',
            options: [
              opt('The goal is adaptation and meaningful living alongside loss, not total erasure of sadness', true, 'Right - healthy grief adaptation increases your capacity to carry loss while engaging in a fulfilling life.'),
              opt('The goal is to reach a point where memories no longer evoke any emotional response', false, 'Emotional resonance with meaningful memories is natural and enduring.'),
              opt('Grief work promises that loss will eventually feel like it never happened', false, 'Loss fundamentally changes your story; adaptation integrates that change rather than pretending it didn\'t happen.')
            ],
            whyPrompt: 'In a few words - why is adaptation a more realistic goal than total erasure of grief?'
          },
          apply: {
            scenario: 'A friend who lost her mentor a year ago says: "I still feel a ache in my chest when I accomplish something big and can\'t tell him. I thought I\'d be cured by now."',
            prompt: 'In two or three sentences: what would you say to reframe her expectation of being "cured"?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "That ache is a reflection of how much he meant to you, not a failure to heal. Adaptation means learning to carry that meaningful connection alongside your achievements."'
          },
          remember: {
            prompt: 'In a sentence or two: what is one realistic expectation you want to hold for your own emotional process?',
            placeholder: 'Your answer...'
          }
        }
      ],
      summary: 'This week: Grief & Bereavement, understanding that grief moves in waves rather than linear stages, and that continuing bonds support adaptation better than forced closure. Next week: Major Life Transitions.'
    },

    // WEEK 2: Mechanism B (Major Life Transitions) - Understanding
    {
      num: 2,
      title: 'Life transitions: recognising the pattern',
      mechanism: 'B',
      kind: 'blocked',
      retrievalCheck: null,
      touches: [
        {
          id: 'w2t1',
          title: 'Recognition - identity disorientation during major change',
          role: 'Recognition #1',
          delayedRef: 'w1t5_apply',
          delayedPrompt: 'Last week, on reframing grief expectations, you wrote:',
          relate: {
            text: [
              'This week\'s pattern: <b>Major Life Transitions</b> - distress and disorientation associated with major life changes (relocation, career change, retirement, relationship shifts, or new family roles).',
              'Here\'s what that looks like. <b class=\'who\'>Meera</b> recently relocated to a new city for a promotional role. On paper, it\'s an exciting step. In reality, she feels disoriented, disconnected, and questions who she is without her old neighborhood, daily team, and familiar routines.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'Which of these actually explains Meera\'s distress?',
            options: [
              opt('Major transitions temporarily disrupt external identity anchors, causing real disorientation even during positive changes', true, 'Right - roles, routines, and environments form a significant part of daily identity. When they shift, feeling disoriented is a normal transition response, not proof of a mistake.'),
              opt('Feeling disoriented proves that moving to the new city was a wrong decision', false, 'Disorientation during a major move is standard adaptation stress, not an indicator that the choice was wrong.'),
              opt('Meera is simply being ungrateful for her promotion', false, 'Navigating real transition stress and valuing a career opportunity exist at the same time.')
            ],
            whyPrompt: 'In a few words - why can positive life changes still cause significant emotional disorientation?'
          },
          apply: {
            scenario: 'Siddharth recently retired after 35 years in teaching. He finds himself pacing around the house at 9 AM feeling completely lost and anxious, asking: "Who am I if I\'m not teaching?"',
            prompt: 'In two or three sentences: how would you explain his disorientation to Siddharth?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "After 35 years, teaching was a core structure for your identity and daily routine. Feeling lost right now is a natural response to losing that structure, not a personal failing."'
          },
          remember: {
            prompt: 'In a sentence or two: think of a major transition in your past. What external anchor did you miss the most?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w2t2',
          title: 'Recognition - the neutral zone of uncertainty',
          role: 'Recognition #2',
          delayedRef: 'w2t1_apply',
          delayedPrompt: 'Last touch, on Siddharth\'s retirement, you wrote:',
          relate: {
            text: [
              'A different moment with Meera. She\'s in the second month of her move. The old life is ended, but the new life doesn\'t feel fully established yet.',
              'This uncomfortable middle space is called the "neutral zone" - where the old ways are gone, but new patterns haven\'t solidified. Meera tries to force immediate certainty by rushing into commitments she doesn\'t actually want.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What happens when someone tries to force immediate certainty during the neutral zone of a transition?',
            options: [
              opt('Rushing into premature commitments to escape uncomfortable ambiguity can create long-term mismatches', true, 'That\'s the pattern - the in-between phase of a transition is uncomfortable, but rushing to fix it often leads to choices made out of anxiety rather than true values.'),
              opt('Forcing quick certainty is the fastest way to achieve genuine stability', false, 'Premature certainty usually masks underlying disorientation without building real, values-based roots.'),
              opt('The neutral zone is a sign that the transition has failed completely', false, 'The neutral zone is an essential intermediate phase in William Bridges\' transition model where new learning happens.')
            ],
            whyPrompt: 'In a few words - why is the middle phase of a transition uncomfortable yet necessary?'
          },
          apply: {
            scenario: 'A friend who just ended a long-term relationship wants to immediately start dating someone new, saying: "I can\'t stand this empty, uncertain feeling for another week."',
            prompt: 'In two or three sentences: what perspective would you offer about sitting with the in-between phase?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer here - the tell is recognizing that the in-between phase feels uncomfortable because it\'s where real re-orientation happens, and rushing it can bypass needed clarity.'
          },
          remember: {
            prompt: 'In a sentence or two: have you ever rushed into a decision just to end an uncomfortable feeling of uncertainty?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w2t3',
          title: 'What treating transition as a personal failure costs',
          role: 'Functional logic',
          delayedRef: 'w2t2_apply',
          delayedPrompt: 'Last touch, on premature certainty, you noted:',
          relate: {
            text: [
              'Between identity disorientation and the neutral zone, there\'s a pattern worth naming: interpreting transition friction as personal weakness.',
              'Meera thinks: "Other people move cities smoothly. Why am I struggling to adjust?"',
              'What it actually costs: framing normal transition friction as personal inadequacy adds self-criticism on top of existing adaptation stress, making the adjustment twice as hard.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What is adding self-criticism to transition friction actually doing?',
            options: [
              opt('Doubling the emotional load by turning environment adaptation into a negative verdict on your capability', true, 'Right - adapting to a new city or role is hard work on its own. Blaming yourself for finding it hard drains the energy needed for actual adaptation.'),
              opt('Motivating faster adjustment through strict self-discipline', false, 'Self-criticism increases anxiety and cognitive load, which actually slows down adaptive learning.'),
              opt('Accurately identifying that you lack resilience compared to others', false, 'Transition difficulty is universal across major life changes; it is not evidence of a lack of resilience.')
            ],
            whyPrompt: 'In a few words - why does self-criticism worsen transition stress?'
          },
          apply: {
            scenario: 'An international student blames himself for feeling homesick and overwhelmed during his first semester, saying: "I should be stronger than this."',
            prompt: 'In two or three sentences: how would you help him separate normal transition friction from self-worth?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "Feeling overwhelmed in a new country is a normal response to massive environmental change, not a sign of weakness. Struggling with transition doesn\'t mean you aren\'t strong enough."'
          },
          remember: {
            prompt: 'In a sentence or two: what is a situation where you blamed yourself for finding a major change difficult?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w2t4',
          title: 'What grounding in core values looks like',
          role: 'Contrast / boundary case',
          delayedRef: 'w2t3_apply',
          delayedPrompt: 'Last touch, on separating friction from self-worth, you wrote:',
          relate: {
            text: [
              'Here\'s what a different response looks like.',
              '<b class=\'who\'>Meera</b> stopped asking why she wasn\'t adjusting instantly. Instead, she identified two daily stability anchors (morning coffee routine, evening calls with family) and focused on one core value (curiosity) to explore her new neighborhood twice a week.',
              'This is the contrast case: holding transition uncertainty while establishing daily anchor points grounded in enduring values.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What makes Meera\'s anchor-points strategy effective?',
            options: [
              opt('It builds micro-predictability in daily routines while linking actions to core values rather than fixed outcomes', true, 'That\'s the mechanism - micro-routines reduce neuro-cognitive uncertainty load, while values provide internal continuity.'),
              opt('It guarantees that she will feel 100% comfortable in her new city within a week', false, 'Anchor points don\'t eliminate transition timelines, but they make the process manageable.'),
              opt('It allows her to ignore the fact that her life has changed', false, 'Values-based anchors help you navigate change actively, not deny it.')
            ],
            whyPrompt: 'In a few words - why do daily anchor points provide stability during major change?'
          },
          apply: {
            scenario: 'Think of a transition you are currently facing or might face soon.',
            prompt: 'In two or three sentences: what is one daily micro-routine you could use as a stability anchor right now?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is identifying a specific, repeatable micro-action that remains within your control regardless of external changes.'
          },
          remember: {
            prompt: 'In a sentence or two: which core value remains true for you no matter what city, job, or role you are in?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w2t5',
          title: 'What actually happened',
          role: 'Reinforcing rep',
          delayedRef: 'w2t4_apply',
          delayedPrompt: 'Last touch, your stability anchor was:',
          relate: {
            text: [
              'One more touch before we look at ambiguous loss in Week 3.',
              'By month four, Meera\'s new city began to feel familiar. The disorientation didn\'t disappear overnight, but establishing anchor points allowed her to build a meaningful new chapter without destroying her self-confidence in the process.',
              'That previews the tools coming in Week 5: major life transitions require giving yourself time to pass through the neutral zone while leaning on values-based compasses.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What does Meera\'s trajectory show about navigating life transitions?',
            options: [
              opt('Adaptation is a gradual process of building new predictability alongside enduring values', true, 'Right - confidence during transitions comes from trusting the process of adaptation, not demanding instant comfort.'),
              opt('Transitions only succeed if every aspect of the new life turns out perfect', false, 'Real transitions involve trade-offs and gradual adjustment, not flawless perfection.'),
              opt('Feeling disoriented means you should immediately reverse your life decisions', false, 'Disorientation is a temporary phase of restructuring, not a signal to abandon change.')
            ],
            whyPrompt: 'In a few words - why is gradual adaptation more sustainable than demanding instant comfort?'
          },
          apply: {
            scenario: 'A friend who started a new business three months ago says: "I still feel nervous every morning. Does this mean I\'m not built for entrepreneurship?"',
            prompt: 'In two or three sentences: how would you reframe his morning nervousness?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "Nervousness three months in is a normal response to running a new business where routine is still forming. It\'s a sign of ongoing transition adaptation, not evidence about your long-term capability."'
          },
          remember: {
            prompt: 'In a sentence or two: what is one takeaway about transitions you want to keep in mind for your next major change?',
            placeholder: 'Your answer...'
          }
        }
      ],
      summary: 'This week: Major Life Transitions, understanding identity disorientation, the neutral zone of uncertainty, and how values-based stability anchors help you adapt. Next week: Ambiguous Loss & Unfinished Change.'
    },

    // WEEK 3: Mechanism C (Ambiguous Loss & Unfinished Change) - Understanding
    {
      num: 3,
      title: 'Ambiguous loss: recognising the pattern',
      mechanism: 'C',
      kind: 'blocked',
      retrievalCheck: null,
      touches: [
        {
          id: 'w3t1',
          title: 'Recognition - loss without clear closure',
          role: 'Recognition #1',
          delayedRef: 'w2t5_apply',
          delayedPrompt: 'Last week, on transition nervousness, you wrote:',
          relate: {
            text: [
              'This week\'s pattern: <b>Ambiguous Loss & Unfinished Change</b> - distress arising when a loss lacks clear finality or official closure.',
              'Here\'s what that looks like. <b class=\'who\'>Rohan</b>\'s mother has progressive dementia. She is physically present in the living room, but her memory and personality have altered significantly. Rohan feels caught in a painful conflict: he is grieving her loss while she is sitting right in front of him.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'Which of these explains why ambiguous loss feels uniquely frozen or confusing?',
            options: [
              opt('The lack of clear finality prevents traditional grief rituals, keeping the boundary between presence and absence unresolved', true, 'Right - Pauline Boss\'s framework shows that ambiguity freezes grief because society has no standard ritual for losses that are partial, ongoing, or unacknowledged.'),
              opt('Rohan is over-dramatizing a normal family situation', false, 'Caring for a relative with cognitive decline is a classic, documented form of ambiguous loss with deep psychological impact.'),
              opt('Rohan should pretend nothing has changed to avoid feeling sad', false, 'Denying the real psychological loss increases internal distress over time.')
            ],
            whyPrompt: 'In a few words - why does ambiguous loss freeze the traditional grieving process?'
          },
          apply: {
            scenario: 'Ananya\'s brother cut off all contact two years ago without explanation (estrangement). She says: "I don\'t know if I should mourn him or keep waiting for a text. I feel frozen."',
            prompt: 'In two or three sentences: how would you name Ananya\'s situation as ambiguous loss?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "What you\'re feeling is ambiguous loss - your brother is physically alive but absent from your life without closure. Feeling frozen is a natural reaction to an unresolved boundary, not a weakness in you."'
          },
          remember: {
            prompt: 'In a sentence or two: think of a situation in your life that lacks clear closure (a relationship shift, a lost opportunity, an ongoing uncertainty). How does the ambiguity feel?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w3t2',
          title: 'Recognition - grieving an imagined future',
          role: 'Recognition #2',
          delayedRef: 'w3t1_apply',
          delayedPrompt: 'Last touch, on Ananya\'s estrangement, you wrote:',
          relate: {
            text: [
              'Another form of ambiguous loss: grieving an <i>imagined future</i>.',
              'Kavya spent years planning to take over her family business, but economic shifts forced its sale. She didn\'t lose a person, but she lost the entire life trajectory she had pictured for her 30s. Other people tell her: "At least you have a job, stop complaining."',
              'Notice what\'s happening: an intangible loss (a expected future) is dismissed because no physical death occurred.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'Why is grieving an imagined future a genuine, valid form of loss?',
            options: [
              opt('Expectations and life trajectories shape our sense of identity and purpose; losing them requires real mourning', true, 'That\'s the insight - unfulfilled dreams, lost paths, and shattered expectations carry real emotional weight even when invisible to others.'),
              opt('Grieving an imagined future is just self-pity and should be ignored', false, 'Invalidating intangible losses leads to disenfranchised grief, where pain is buried rather than processed.'),
              opt('Only physical deaths qualify for legitimate emotional grief', false, 'Psychology recognizes symbolic and non-death losses as major sources of genuine grief.')
            ],
            whyPrompt: 'In a few words - why does grieving an unfulfilled expectation require real processing space?'
          },
          apply: {
            scenario: 'A friend had to give up her dream of competing professionally due to a chronic knee injury. She feels a deep, quiet sadness while everyone tells her to "be glad it\'s not worse."',
            prompt: 'In two or three sentences: how would you validate her loss of her athletic path?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "Giving up your athletic career is a profound loss of a identity and future you worked hard for. It makes complete sense to mourn that lost path, regardless of what others say."'
          },
          remember: {
            prompt: 'In a sentence or two: is there an unfulfilled goal or expected future in your life that you\'ve never given yourself permission to grieve?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w3t3',
          title: 'What demanding absolute closure costs',
          role: 'Functional logic',
          delayedRef: 'w3t2_apply',
          delayedPrompt: 'Last touch, on validating intangible loss, you wrote:',
          relate: {
            text: [
              'Between physical ambiguity and lost futures, there\'s a pattern worth naming: the relentless search for absolute closure.',
              'Rohan constantly demands of himself: "I need to decide once and for all how I feel about my mother\'s illness." Ananya searches for a final explanation for why her brother stopped talking to her.',
              'What it actually costs: in ambiguous situations, demanding 100% clarity or a neat ending locks you into endless rumination about a question that has no final answer.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What does demanding absolute closure in an ambiguous situation actually do?',
            options: [
              opt('Traps mental energy in continuous rumination over unanswerable questions', true, 'Right - when circumstances don\'t offer closure, demanding it creates an infinite mental loop that drains energy from current living.'),
              opt('Forces the other person or situation to finally provide a complete explanation', false, 'Demanding internal closure does not alter external unresolved circumstances.'),
              opt('Guarantees emotional peace once the exact explanation is discovered', false, 'In ambiguous loss, an exact explanation is often impossible; peace comes from learning to hold ambiguity, not solving it.')
            ],
            whyPrompt: 'In a few words - why is searching for absolute closure counterproductive in ambiguous loss?'
          },
          apply: {
            scenario: 'A cousin spends hours every night analyzing old messages trying to find the "one real reason" a close friendship drifted apart three years ago.',
            prompt: 'In two or three sentences: what would you share about the trap of searching for absolute closure?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "Searching for the single hidden reason after three years keeps you trapped in the past. Sometimes relationships drift without a neat answer, and freedom comes from accepting the ambiguity rather than solving it."'
          },
          remember: {
            prompt: 'In a sentence or two: what is an unanswerable question you\'ve been replaying in your mind recently?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w3t4',
          title: 'What holding "both-and" thinking looks like',
          role: 'Contrast / boundary case',
          delayedRef: 'w3t3_apply',
          delayedPrompt: 'Last touch, on the closure trap, you wrote:',
          relate: {
            text: [
              'Here\'s what holding ambiguous loss differently looks like.',
              '<b class=\'who\'>Rohan</b> stopped trying to force a single feeling about his mother. He practices "both-and" thinking: "She is both my mother whom I love <i>and</i> someone whose memory loss makes her a stranger to me today. I can mourn what is gone <i>and</i> cherish moments of quiet connection now."',
              'This is the module\'s contrast case for ambiguous loss: replacing either-or closure with both-and acceptance.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What makes Rohan\'s "both-and" approach different from either denial or despair?',
            options: [
              opt('It honors two opposing truths simultaneously without forcing a premature resolution', true, 'That\'s the core mechanism of Pauline Boss\'s work - dialectical thinking allows you to hold grief and connection, sadness and presence, at the same time.'),
              opt('It proves that his mother\'s illness has no impact on his daily life', false, 'Rohan acknowledges the impact directly; both-and thinking helps him carry it without being crushed by forced choices.'),
              opt('It demands that his mother recover her full memory immediately', false, 'Both-and thinking works with reality as it is, not wishful thinking.')
            ],
            whyPrompt: 'In a few words - why does "both-and" thinking ease the paralysis of ambiguous loss?'
          },
          apply: {
            scenario: 'Think of an unresolved situation in your own life (a distance with a relative, an uncertain path, a changed relationship).',
            prompt: 'In two or three sentences: try writing a "both-and" statement for that situation ("It is true that... AND it is also true that...").',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is holding two distinct, realistic truths together without trying to collapse one into the other.'
          },
          remember: {
            prompt: 'In a sentence or two: how did writing a "both-and" statement change how heavy the situation felt to think about?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w3t5',
          title: 'What actually happened',
          role: 'Reinforcing rep',
          delayedRef: 'w3t4_apply',
          delayedPrompt: 'Last touch, your both-and statement was:',
          relate: {
            text: [
              'One more touch before we begin technique weeks next week.',
              'Over time, Rohan found that using both-and thinking gave him relief. The disease continued, but he no longer wasted energy blaming himself for having mixed feelings of grief, frustration, and love.',
              'That previews the tools coming in Weeks 4-6: whether dealing with death, major life transitions, or ambiguous loss, the goal is building capacity to carry your real experience with self-compassion and clear values.'
            ]
          },
          think: {
            mode: 'tap',
            prompt: 'What does Rohan\'s progress show about living with ambiguous loss?',
            options: [
              opt('Relief comes from changing your relationship to ambiguity, not from waiting for external closure', true, 'Right - when circumstances remain unresolved, internal psychological flexibility provides the freedom to live meaningfully.'),
              opt('Ambiguous loss resolves automatically if you ignore it for a year', false, 'Ignoring ambiguous loss leaves it unprocessed; active flexibility is required.'),
              opt('You must eliminate all sad emotions before you can enjoy life again', false, 'Both-and thinking shows that joy and grief can exist alongside each other.')
            ],
            whyPrompt: 'In a few words - why is changing your relationship to ambiguity more effective than waiting for closure?'
          },
          apply: {
            scenario: 'A friend facing an ongoing, unresolved family legal dispute says: "I can\'t start living my life until this court case is completely finished."',
            prompt: 'In two or three sentences: how would you reframe her perspective on waiting for final closure?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "Legal cases can take years, and waiting for the end to start living puts your life on hold. You can take care of the legal requirements AND still build meaningful moments in your daily life today."'
          },
          remember: {
            prompt: 'In a sentence or two: what is one area of your life where you want to stop waiting for full closure before moving forward?',
            placeholder: 'Your answer...'
          }
        }
      ],
      summary: 'This week: Ambiguous Loss & Unfinished Change, recognizing non-death losses, unfulfilled futures, and how "both-and" thinking releases the trap of demanding absolute closure. Next week: tools for Grief & Bereavement.'
    },

    // WEEK 4: Mechanism A technique week (T=3 practicable + 1 Format C reference card)
    {
      num: 4,
      title: 'Grief & bereavement: tools for adaptation',
      mechanism: 'A',
      kind: 'technique',
      retrievalCheck: {
        prompt1: 'In your own words - what is the difference between ordinary Bereavement (Mechanism A), a Major Life Transition (Mechanism B), and Ambiguous Loss (Mechanism C)?',
        prompt2: 'And why might expecting grief to follow a neat linear sequence or demanding absolute closure in ambiguous loss cause extra distress?',
        reveal: 'Bereavement involves adjusting to the death of a loved one while maintaining continuing bonds; Major Life Transitions involve identity disorientation from environmental or role shifts (like relocation or career change); Ambiguous Loss involves unresolved, ongoing losses lacking finality (like estrangement, cognitive decline, or unfulfilled futures). Expecting linear stages causes guilt during normal grief waves, and demanding closure in ambiguity traps mental energy in unanswerable rumination.'
      },
      hasReferenceCard: true,
      touches: [
        {
          id: 'w4t1',
          title: 'Values-Based Dual-Process Adaptation',
          role: 'Technique A1 - ACT & Dual Process Model',
          delayedRef: 'w3t5_apply',
          delayedPrompt: 'Last week, your response on waiting for closure was:',
          relate: {
            text: [
              'This is the first of the tools for Grief & Bereavement: <b>Values-Based Dual-Process Adaptation</b>.',
              'Remember Vikram balancing quiet time to honor his father with returning to work projects? This tool helps you deliberately schedule both space for honoring loss (loss-orientation) and small values-based actions for living (restoration-orientation).'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why might scheduling dedicated time for both grief reflection AND daily routines help prevent feeling overwhelmed or guilty?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think of a loss or meaningful past connection you are carrying.',
            prompt: 'In two or three sentences: outline one small way you will honor that memory this week (loss-orientation) AND one small values-based routine you will maintain (restoration-orientation).',
            placeholder: 'Honor memory: ... / Maintain routine: ...'
          },
          reveal: {
            text: 'There\'s no single model answer here - the tell is explicitly naming both a gentle memory-honoring action and a daily living routine without treating them as contradictory.'
          },
          remember: {
            prompt: 'In a sentence or two: how does it feel to give yourself permission to engage in both loss and restoration?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w4t2',
          title: 'Narrative Continuing Bonds & Memory Honor',
          role: 'Technique A2 - Continuing Bonds & Meaning Reconstruction',
          delayedRef: 'w4t1_apply',
          delayedPrompt: 'Last touch, your dual-process actions were:',
          relate: {
            text: [
              'The second tool: <b>Narrative Continuing Bonds & Memory Honor Practice</b>.',
              'Instead of trying to "forget" or close the door on someone you lost, this tool focuses on identifying a core value or lesson you learned from them that you actively carry into your life today.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'How does focusing on values learned from a loved one keep their positive impact alive without forcing you to stay stuck in past pain?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think of someone important you have lost.',
            prompt: 'In two or three sentences: name one specific value or quality you admired in them, and how you will practice that quality in your own life this week.',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is identifying an enduring value from the person and translating it into a present-day practice.'
          },
          remember: {
            prompt: 'In a sentence or two: how does carrying their value forward change your relationship to their memory?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w4t3',
          title: 'Graded Re-Engagement with Routines',
          role: 'Technique A3 - Behavioral Activation',
          delayedRef: 'w4t2_apply',
          delayedPrompt: 'Last touch, your continuing value was:',
          relate: {
            text: [
              'The third tool: <b>Graded Re-Engagement with Values-Based Routines</b>.',
              'When grief leads to apathy or isolation, trying to jump back into a full schedule is overwhelming. This tool breaks re-engagement into micro-steps tied to basic self-care and social connection.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why are micro-steps in daily routine more effective during heavy grief than setting large, demanding goals?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think of one daily area (sleep, meals, physical movement, brief social contact) where grief has caused withdrawal.',
            prompt: 'In two or three sentences: pick one tiny micro-step (e.g., a 10-minute morning walk, drinking water, sending one text) that feels 100% doable today.',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is choosing a realistic micro-step that honors your current energy level without complete shutdown.'
          },
          remember: {
            prompt: 'In a sentence or two: did setting a micro-step feel more manageable than what you were expecting of yourself?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w4t4',
          title: 'When grief involves traumatic circumstances or total paralysis',
          role: 'A note before the check-in',
          delayedRef: 'w4t3_apply',
          delayedPrompt: 'Last touch, your micro-step was:',
          relate: {
            text: [
              'Before this week\'s check-in: the tools in this module are designed for healthy, adaptive grief processing.',
              'If your loss involved sudden traumatic circumstances, severe self-blame, or extended functional paralysis where basic self-care is impossible, there is a fourth item in Mechanism A\'s toolkit (Technique A4), provided as a reference card. Specialized grief therapy or clinical counseling offers support that self-guided material cannot provide.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why does traumatic bereavement or extended functional paralysis benefit from working directly with a trained professional?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Reflect on your current grief experience.',
            prompt: 'In a sentence or two: does your experience feel manageable with self-guided tools, or would reaching out to a grief counselor offer valuable additional support?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer - if your loss feels overwhelming or traumatic, accessing professional support alongside this module is a strong, courageous choice.'
          },
          remember: {
            prompt: 'In a sentence or two: is there a professional, helpline, or trusted resource you could contact if you needed extra support?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w4t5',
          title: 'How did it go, and a plan for next time',
          role: 'Check-in + pre-commitment',
          delayedRef: 'w4t4_apply',
          delayedPrompt: 'Last touch, you wrote:',
          relate: {
            text: [
              'No new teaching this touch - two quick things before we move to Life Transitions next week.',
              'First, a check-in on the Mechanism A tools (dual-process, continuing bonds, graded re-engagement). Then, an if-then plan for the coming week.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Which of the Mechanism A tools did you try this week, if any - and what did you notice?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Select the tool from this week that felt most relevant to your situation.',
            prompt: 'In two or three sentences, write an if-then plan: "If [grief cue or hard wave shows up], then I will [specific tool, e.g. alternate to restoration routine or practice memory honor]."',
            placeholder: 'If [specific cue], then I will...'
          },
          reveal: {
            text: 'Something like: "If a sudden wave of grief leaves me feeling stuck, then I will allow 15 minutes of quiet memory space and then take a 10-minute walk to re-engage with my daily routine."'
          },
          remember: {
            prompt: 'In a sentence or two: say your if-then plan to yourself - does it feel realistic and compassionate?',
            placeholder: 'Your answer...'
          }
        }
      ],
      summary: 'This week: three named tools for Grief & Bereavement - dual-process adaptation, continuing bonds memory honor, and graded re-engagement - plus a reference card for prolonged or traumatic grief, a check-in, and an if-then plan. Next week: tools for Life Transitions.'
    },

    // WEEK 5: Mechanism B technique week (T=3 practicable)
    {
      num: 5,
      title: 'Life transitions: tools for orientation',
      mechanism: 'B',
      kind: 'technique',
      retrievalCheck: null,
      touches: [
        {
          id: 'w5t1',
          title: 'Values Clarification Across Transitions',
          role: 'Technique B1 - ACT Values Clarification',
          delayedRef: 'w4t5_apply',
          delayedPrompt: 'Last week, your if-then plan was:',
          relate: {
            text: [
              'This is the first tool for Major Life Transitions: <b>Values Clarification Across Transitions</b>.',
              'Remember Meera disoriented after her city move? When job titles, locations, or family structures change, your core values remain constant. This tool helps you identify 2-3 core values that provide internal stability anywhere.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why does knowing your core values provide stability when external roles or surroundings are completely changing?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think of a transition you are experiencing.',
            prompt: 'In two or three sentences: list 2 core values (e.g. kindness, growth, autonomy, integrity) that stay true for you regardless of this change, and how you will express one today.',
            placeholder: 'Core values: ... / Expressed today by: ...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is naming values that are independent of your job title, marital status, or location.'
          },
          remember: {
            prompt: 'In a sentence or two: how does remembering your values change your feeling about the transition?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w5t2',
          title: 'Transition Structure Mapping & Stability Anchors',
          role: 'Technique B2 - CBT & Transition Mapping',
          delayedRef: 'w5t1_apply',
          delayedPrompt: 'Last touch, your core values were:',
          relate: {
            text: [
              'The second tool: <b>Transition Structure Mapping & Stability Anchors</b>.',
              'Transitions feel chaotic when experienced as a massive blur. Mapping your change into phases (Ending, Neutral Zone, New Beginning) and picking daily stability anchors creates concrete predictability.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'How does identifying which phase of transition you\'re in lower anxiety about not being "fully settled" yet?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Map your current transition situation.',
            prompt: 'In two or three sentences: identify which phase you are in (Ending, Neutral Zone, or New Beginning) and name two daily micro-routines that act as your stability anchors.',
            placeholder: 'Current phase: ... / Stability anchors: ...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is accurately identifying your current phase and picking concrete, manageable daily anchors.'
          },
          remember: {
            prompt: 'In a sentence or two: did mapping your phase reduce the urge to rush into forced certainty?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w5t3',
          title: 'Narrative Identity Integration',
          role: 'Technique B3 - Narrative Therapy',
          delayedRef: 'w5t2_apply',
          delayedPrompt: 'Last touch, your transition phase was:',
          relate: {
            text: [
              'The third tool: <b>Narrative Identity Integration Across Transitions</b>.',
              'Instead of viewing your life as broken into separate pieces before and after a change, this tool helps you write a connecting story that highlights continuity and personal growth.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why is viewing your life as a continuous story with evolving chapters more empowering than seeing it as broken fragments?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Look at the transition you are navigating.',
            prompt: 'In two or three sentences: write a brief narrative connecting what you learned in your previous chapter to how it helps you navigate your current transition chapter.',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is connecting past strengths or insights to your current transition chapter.'
          },
          remember: {
            prompt: 'In a sentence or two: what strength from your past chapter are you relying on most right now?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w5t4',
          title: 'Pacing your adjustment without self-criticism',
          role: 'A note before the check-in',
          delayedRef: 'w5t3_apply',
          delayedPrompt: 'Last touch, your narrative connection was:',
          relate: {
            text: [
              'A quick note before this week\'s check-in.',
              'Transitions take time. Research shows that adapting to a major environment or role change typically takes months, not days. Self-criticism for feeling disoriented only adds extra weight to the process.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why is self-compassion about your adjustment pace essential for long-term adaptation?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Reflect on how demanding you have been with yourself during your transition.',
            prompt: 'In a sentence or two: write a compassionate reminder to yourself about your adjustment pace.',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "Adjusting to this change takes time. I don\'t need to have everything figured out today; taking it step-by-step is completely okay."'
          },
          remember: {
            prompt: 'In a sentence or two: how can you practice patience with yourself this week?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w5t5',
          title: 'How did it go, and a plan for next time',
          role: 'Check-in + pre-commitment',
          delayedRef: 'w5t4_apply',
          delayedPrompt: 'Last touch, your compassionate reminder was:',
          relate: {
            text: [
              'No new teaching this touch - a check-in on the Mechanism B tools (values clarification, transition mapping, narrative integration) and an if-then plan.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Which of the Mechanism B tools was most helpful to try this week, and why?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Select the tool from this week that felt most practical.',
            prompt: 'In two or three sentences, write an if-then plan: "If [transition stress or disorientation arises], then I will [specific tool, e.g. ground in my stability anchors or reconnect with core values]."',
            placeholder: 'If [specific cue], then I will...'
          },
          reveal: {
            text: 'Something like: "If I feel overwhelmed by uncertainty in my new role, then I will pause, review my two daily stability anchors, and focus on my core value of growth for the rest of the day."'
          },
          remember: {
            prompt: 'In a sentence or two: say your plan to yourself - does it feel achievable when transition stress hits?',
            placeholder: 'Your answer...'
          }
        }
      ],
      summary: 'This week: three named tools for Major Life Transitions - values clarification, transition structure mapping with stability anchors, and narrative identity integration - plus a check-in and an if-then plan. Next week: tools for Ambiguous Loss.'
    },

    // WEEK 6: Mechanism C technique week (T=3 practicable, C1 Format B Guardrailed)
    {
      num: 6,
      title: 'Ambiguous loss: tools for flexibility',
      mechanism: 'C',
      kind: 'technique',
      retrievalCheck: null,
      touches: [
        {
          id: 'w6t1',
          title: 'Defusion from the Search for Closure',
          role: 'Technique C2 - ACT Defusion',
          delayedRef: 'w5t5_apply',
          delayedPrompt: 'Last week, your if-then plan was:',
          relate: {
            text: [
              'This is the first of the tools for Ambiguous Loss: <b>Defusion from the "Search for Closure" Traps</b>.',
              'Remember Rohan or Ananya searching endlessly for unanswerable explanations? This tool helps you notice thoughts like "I can\'t move on until I know why" and treat them as unhelpful mind-loops rather than mandatory commands.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why does unhooking from the demand for closure free up mental energy for present living?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think of a closure-seeking thought you frequently replay (e.g., "If only I knew why...", "They should have explained...").',
            prompt: 'In two or three sentences: state the closure thought, then write a defusion phrase (e.g. "I am having the thought that I need absolute closure, but I can choose to focus on what matters today anyway").',
            placeholder: 'Closure thought: ... / Defusion statement: ...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is explicitly labeling the closure demand as a thought, rather than treating it as an absolute requirement for living.'
          },
          remember: {
            prompt: 'In a sentence or two: did unhooking from the closure thought give you a sense of relief?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w6t2',
          title: 'Re-Authoring the Imagined Future',
          role: 'Technique C3 - Narrative Meaning Reconstruction',
          delayedRef: 'w6t1_apply',
          delayedPrompt: 'Last touch, your defusion statement was:',
          relate: {
            text: [
              'The second tool: <b>Re-Authoring the Imagined Future & Rebuilding Meaning</b>.',
              'When an unfulfilled dream, lost relationship, or broken trajectory leaves an empty space, this tool helps you explicitly grieve the unlived future and begin drafting new, realistic commitments in the present.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why is explicitly acknowledging and grieving an unlived future necessary before you can build a new meaningful direction?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think of an unfulfilled expectation or lost future path.',
            prompt: 'In two or three sentences: state what lost expectation you are giving yourself permission to grieve, and name one new small meaningful goal in your current present.',
            placeholder: 'Grieving expectation: ... / New present commitment: ...'
          },
          reveal: {
            text: 'There\'s no single model answer - the tell is honoring the unfulfilled dream while articulating a new, active commitment in reality.'
          },
          remember: {
            prompt: 'In a sentence or two: how does it feel to give yourself permission to mourn an unlived future?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w6t3',
          title: 'Both-And Thinking & Mixed-Emotion Acceptance',
          role: 'Technique C1 - CFT & Ambiguous Loss Framework',
          guardrail: true,
          delayedRef: 'w6t2_apply',
          delayedPrompt: 'Last touch, your new present commitment was:',
          relate: {
            text: [
              'The third tool: <b>Both-And Thinking & Mixed-Emotion Acceptance</b>.',
              'Because examining unresolved ambiguity can bring up complex, intense mixed emotions, this touch checks in with you partway through.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why is holding two opposing feelings (e.g. sadness and hope, love and distance) more realistic in ambiguous situations than forcing one single emotion?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Think of an unresolved situation in your life where ambiguity persists.',
            intensityPrompt: 'First, choose how far you want to go with this right now:',
            intensityOptions: [
              'Smaller version - explore both-and thinking for one mild aspect of ambiguity',
              'Bigger version - explore both-and thinking for the deeper unresolved loss'
            ],
            prompt: 'In two or three sentences: write a "both-and" statement for this situation ("I feel [Emotion A] AND I also feel [Emotion B], and both can exist together").',
            placeholder: 'Your answer...'
          },
          distressPrompt: 'Examining unresolved ambiguity can bring up mixed, intense feelings. How are you feeling right now?',
          reveal: {
            text: 'There\'s no single model answer - the tell is constructing a statement that validates both emotional truths without forcing fake resolution.'
          },
          remember: {
            prompt: 'In a sentence or two: did honoring both feelings reduce the internal struggle to pick just one side?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w6t4',
          title: 'Holding ambiguity with self-compassion',
          role: 'A note before the check-in',
          delayedRef: 'w6t3_apply',
          delayedPrompt: 'Last touch, your both-and statement was:',
          relate: {
            text: [
              'A quick note before this week\'s check-in.',
              'Living with ambiguous loss requires ongoing self-compassion. It is completely normal for ambiguity to feel heavy at times, especially during anniversaries or unexpected triggers.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why is self-compassion essential when dealing with situations that may never have neat closure?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Reflect on how you treat yourself when unresolved ambiguity feels heavy.',
            prompt: 'In a sentence or two: write a self-compassionate note to yourself for moments when ambiguity feels frustrating.',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "It makes complete sense that this situation feels heavy. I don\'t have to solve it today; offering myself warmth and patience is enough."'
          },
          remember: {
            prompt: 'In a sentence or two: how will you offer yourself warmth when unresolved ambiguity resurfaces?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w6t5',
          title: 'How did it go, and a plan for next time',
          role: 'Check-in + pre-commitment',
          delayedRef: 'w6t4_apply',
          delayedPrompt: 'Last touch, your self-compassionate note was:',
          relate: {
            text: [
              'No new teaching this touch - a check-in on Mechanism C tools (defusion from closure, re-authoring imagined futures, both-and thinking) and an if-then plan before our final integration week.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Which of the Mechanism C tools felt most helpful for your situation, and why?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Select the tool from this week that offered the most clarity.',
            prompt: 'In two or three sentences, write an if-then plan: "If [the urge for closure or unresolved grief arises], then I will [specific tool, e.g. practice defusion or use a both-and statement]."',
            placeholder: 'If [specific cue], then I will...'
          },
          reveal: {
            text: 'Something like: "If I find myself replaying unanswerable questions about my situation late at night, then I will notice the closure trap, use a defusion phrase, and practice a both-and statement."'
          },
          remember: {
            prompt: 'In a sentence or two: say your plan to yourself - does it feel supportive and doable?',
            placeholder: 'Your answer...'
          }
        }
      ],
      summary: 'This week: three named tools for Ambiguous Loss - closure defusion, re-authoring imagined futures, and both-and thinking with guardrailed distress check - plus a check-in and an if-then plan. Next week: final integration & review.'
    },

    // WEEK 7: Integration + unscaffolded transfer test
    {
      num: 7,
      title: 'Integration & review',
      mechanism: 'both',
      kind: 'integration',
      retrievalCheck: null,
      touches: [
        {
          id: 'w7t1',
          title: 'When loss and transition overlap',
          role: 'Integration',
          delayedRef: 'w6t5_apply',
          delayedPrompt: 'Last week, your if-then plan was:',
          relate: {
            text: [
              'Deepa experienced the death of her mother (Mechanism A: Grief & Bereavement) while also moving to a new city for work (Mechanism B: Life Transitions). The combination leaves her feeling both emotionally raw and environmentally disoriented.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'How do grief and transition stress compound each other when they happen at the same time?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Deepa\'s situation - bereavement and relocation occurring simultaneously.',
            prompt: 'In two or three sentences: which tool would you recommend she start with (e.g. A1 dual-process, B2 stability anchors, or B1 values), and why?',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'There are valid reasons for different choices: starting with B2 stability anchors builds immediate daily structure to handle disorientation, while A1 dual-process gives her permission to mourn without neglecting daily tasks. What matters is selecting one practical anchor step first.'
          },
          remember: {
            prompt: 'In a sentence or two: which tool would you reach for first if both bereavement and transition hit at once?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w7t2',
          title: 'Designing a full response for complex change',
          role: 'Integration',
          delayedRef: 'w7t1_apply',
          delayedPrompt: 'Last touch, your choice for Deepa was:',
          relate: {
            text: [
              'Kartik recently retired (Mechanism B: Life Transitions) while caring for his wife who has early-stage Alzheimer\'s (Mechanism C: Ambiguous Loss). He feels a loss of career purpose alongside the ongoing unresolved grief of cognitive decline.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'In Kartik\'s situation, how does transition identity loss interact with the ambiguous loss of caregiving?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Kartik\'s complex scenario - retirement transition plus caregiving ambiguous loss.',
            prompt: 'In two or three sentences: design a two-step plan combining tools across mechanisms (e.g. C1 both-and thinking for caregiving + B1 values clarification for retirement).',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "First, use C1 both-and thinking to hold love for his wife alongside grief for her memory loss. Second, use B1 values clarification to find new non-career outlets for his core values in retirement."'
          },
          remember: {
            prompt: 'In a sentence or two: how does combining tools across mechanisms address complex life situations?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w7t3',
          title: 'Navigating hidden and unacknowledged loss',
          role: 'Integration',
          delayedRef: 'w7t2_apply',
          delayedPrompt: 'Last touch, your plan for Kartik was:',
          relate: {
            text: [
              'Sunita experienced family estrangement from her parents (Mechanism C: Ambiguous Loss) after choosing her career path, while also grieving the death of a close childhood friend (Mechanism A: Bereavement) whom her parents never knew about.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Why might unacknowledged or hidden losses feel especially lonely, and how can continuing bonds (A2) and defusion (C2) help?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Sunita\'s double hidden loss.',
            prompt: 'In two or three sentences: suggest one move Sunita can make to honor her friend while managing estrangement ambiguity.',
            placeholder: 'Your answer...'
          },
          reveal: {
            text: 'Something like: "She can use A2 memory honor to create a private ritual celebrating her friend\'s impact, while using C2 defusion to unhook from closure demands regarding her estranged parents."'
          },
          remember: {
            prompt: 'In a sentence or two: what is one key insight about holding multiple losses with self-compassion?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w7t4',
          title: 'Reviewing your personal toolkit',
          role: 'Integration',
          delayedRef: 'w7t3_apply',
          delayedPrompt: 'Last touch, your suggestion for Sunita was:',
          relate: {
            text: [
              'You now know 10 evidence-informed tools across Grief & Bereavement, Life Transitions, and Ambiguous Loss.',
              'Before the final transfer test, review which tools have resonated most with your personal journey over these 7 weeks.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Looking back across all 7 weeks, which mechanism (A, B, or C) best describes your primary focus, and why?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'Reviewing your total experience.',
            prompt: 'In two or three sentences: pick the top two tools you plan to keep in your active toolkit going forward, and explain how you will use them.',
            placeholder: 'Top tools: ... / Planned usage: ...'
          },
          reveal: {
            text: 'There\'s no single right answer - what matters is choosing tools that genuinely match your actual situation and practice readiness.'
          },
          remember: {
            prompt: 'In a sentence or two: what is the most important lesson about loss and change you want to remember?',
            placeholder: 'Your answer...'
          }
        },
        {
          id: 'w7t5',
          title: 'Your own situation - nothing pre-walked',
          role: 'Transfer test',
          transferTest: true,
          delayedRef: 'w7t4_apply',
          delayedPrompt: 'Last touch, your top tools were:',
          relate: {
            text: [
              'This is the one part of the module built with no scaffolding at all.',
              'You\'ve followed Vikram through grief waves, Meera through transition disorientation, and Rohan through ambiguous loss - and hopefully reflected on your own journey too.',
              'Now it\'s just yours. You have your own real situation right now - bereavement, transition, ambiguous loss, or a combination of them. Don\'t simplify it.'
            ]
          },
          think: {
            mode: 'open',
            prompt: 'Describe your actual situation in your own words - what type of loss or change is occurring, and what makes it challenging?',
            placeholder: 'Your answer...'
          },
          apply: {
            scenario: 'With nothing pre-walked this time.',
            prompt: 'In two or three sentences: what is your actual next move, and why that one - which of the 10 tools will you use, and what will you specifically do?',
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
      code: 'A1',
      rep: 1,
      type: 'reflection',
      scenario: 'A wave of grief resurfaces when you least expect it, making daily routines feel heavy.',
      prompt: 'In two or three sentences: outline your loss-orientation action (honoring feelings) and your restoration-orientation action (a values-based daily step).',
      reveal: 'There\'s no single model answer - the tell is balancing space for grief with a gentle daily living step.'
    },
    {
      code: 'A1',
      rep: 2,
      type: 'reflection',
      scenario: 'You feel guilty for enjoying a social moment or focusing on a personal project after a loss.',
      prompt: 'In two or three sentences: reframe your participation in daily life using the dual-process model.',
      reveal: 'There\'s no single model answer - the tell is recognizing that living is a healthy part of adaptation, not disloyalty.'
    },

    {
      code: 'A2',
      rep: 1,
      type: 'reflection',
      scenario: 'You miss someone you lost and want to keep their positive influence active in your life.',
      prompt: 'In two or three sentences: name a core value or lesson you learned from them and how you will practice it today.',
      reveal: 'There\'s no single model answer - the tell is translating their memory into a present-day values practice.'
    },
    {
      code: 'A2',
      rep: 2,
      type: 'reflection',
      scenario: 'Someone suggests you should "move on and stop talking about the past."',
      prompt: 'In two or three sentences: articulate why continuing bonds through shared values is a healthy choice for you.',
      reveal: 'There\'s no single model answer - the tell is validating continuing bonds over forced, artificial closure.'
    },

    {
      code: 'B1',
      rep: 1,
      type: 'reflection',
      scenario: 'You feel disoriented because your daily job, location, or role has fundamentally shifted.',
      prompt: 'In two or three sentences: name 2 core values that remain unchanged regardless of your external environment.',
      reveal: 'There\'s no single model answer - the tell is grounding identity in internal values rather than temporary roles.'
    },
    {
      code: 'B1',
      rep: 2,
      type: 'reflection',
      scenario: 'A major life transition makes you question your capabilities or decisions.',
      prompt: 'In two or three sentences: reconnect with a core value and describe how it guides your next small step.',
      reveal: 'There\'s no single model answer - the tell is using values as a stable compass during change.'
    },

    {
      code: 'B3',
      rep: 1,
      type: 'reflection',
      scenario: 'Your life feels fragmented into "before the change" and "after the change."',
      prompt: 'In two or three sentences: write a brief narrative bridging your past chapter and your current transition.',
      reveal: 'There\'s no single model answer - the tell is creating a continuous storyline of personal evolution.'
    },
    {
      code: 'B3',
      rep: 2,
      type: 'reflection',
      scenario: 'You feel uncertain about what your future chapter will look like.',
      prompt: 'In two or three sentences: describe how a strength developed in a past transition helps you navigate today.',
      reveal: 'There\'s no single model answer - the tell is drawing on past transition wisdom for current change.'
    },

    {
      code: 'C2',
      rep: 1,
      type: 'reflection',
      scenario: 'You catch yourself replaying unanswerable "why" questions about an unresolved situation late at night.',
      prompt: 'In two or three sentences: state the closure thought and write a defusion phrase unhooking from the demand for an answer.',
      reveal: 'There\'s no single model answer - the tell is treating the closure demand as a thought rather than an absolute rule.'
    },
    {
      code: 'C2',
      rep: 2,
      type: 'reflection',
      scenario: 'You feel frustrated because an ambiguous relationship shift offers no clear explanation.',
      prompt: 'In two or three sentences: practice defusion by noticing the closure trap and refocusing on what you can control today.',
      reveal: 'There\'s no single model answer - the tell is releasing the search for closure to focus on present action.'
    },

    {
      code: 'C3',
      rep: 1,
      type: 'reflection',
      scenario: 'You feel a quiet sadness for an unfulfilled goal or imagined future that will not happen.',
      prompt: 'In two or three sentences: acknowledge and mourn the lost expectation, then name one small goal in your actual present.',
      reveal: 'There\'s no single model answer - the tell is giving permission to grieve the unlived life while committing to reality.'
    },
    {
      code: 'C3',
      rep: 2,
      type: 'reflection',
      scenario: 'You find yourself comparing your current real path to an ideal path you had planned years ago.',
      prompt: 'In two or three sentences: re-author the narrative by honoring the old plan while affirming value in your real path today.',
      reveal: 'There\'s no single model answer - the tell is balancing grief for the lost path with active meaning-building now.'
    }
  ],
  toolsData: {
    reengagement_log: {
      code: 'A3',
      title: 'Re-Engagement Activity Log',
      mechShort: 'Grief & Bereavement',
      kind: 'log_single',
      intro: 'Log a small, manageable daily step (self-care, brief social contact, or daily routine) taken to maintain basic functioning during grief.',
      logLabel: 'What small micro-step did you take today, and how did it feel?',
      firstPlaceholder: 'e.g. Took a 10-minute morning walk despite feeling heavy - helped clear my head slightly',
      placeholder: 'Your answer...'
    },
    transition_map_log: {
      code: 'B2',
      title: 'Transition Stability Log',
      mechShort: 'Life Transitions',
      kind: 'log_single',
      intro: 'Log a daily stability anchor (micro-routine or predictable habit) used to maintain structure during a major transition.',
      logLabel: 'What stability anchor did you practice today, and what phase of transition are you in?',
      firstPlaceholder: 'e.g. Kept my 8 AM coffee and reading routine (Neutral Zone) - gave me a predictable start to the day',
      placeholder: 'Your answer...'
    }
  },
  mhpiConfig: {
    baselineQuestions: [
      { id: 'q1', label: 'Problem Severity', prompt: 'Overall, how much is grief, loss, or life transition distress affecting you right now?', min: 0, max: 10, minLabel: 'Not at all', maxLabel: 'Extremely', reverse: false },
      { id: 'q2', label: 'Functional Impact', prompt: 'How much is this issue interfering with your daily life (work, studies, relationships, or routine)?', min: 0, max: 10, minLabel: 'Not at all', maxLabel: 'Extremely', reverse: false },
      { id: 'q3', label: 'Avoidance', prompt: 'Because of this issue, how often do you avoid situations or memories you would otherwise engage with?', min: 0, max: 10, minLabel: 'Never', maxLabel: 'Always', reverse: false },
      { id: 'q4', label: 'Self-Efficacy', prompt: 'How confident are you that you can manage this loss or transition effectively?', min: 0, max: 10, minLabel: 'Not confident', maxLabel: 'Extremely confident', reverse: true },
      { id: 'q5', label: 'Hope', prompt: 'How hopeful are you that you can adapt and build meaning after this change?', min: 0, max: 10, minLabel: 'Not hopeful', maxLabel: 'Extremely hopeful', reverse: true }
    ],
    weeklyQuestions: [
      { id: 'w1', prompt: 'How much has grief or transition distress affected you this week?', min: 0, max: 10, minLabel: 'Not at all', maxLabel: 'Extremely' },
      { id: 'w2', prompt: 'How confident do you feel managing loss or change this week?', min: 0, max: 10, minLabel: 'Not confident', maxLabel: 'Extremely confident' },
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
    tier1: 'Any statement connecting grief, bereavement, or life transitions to intent or a plan to end one\'s life or self-harm ("I can\'t go on without them, I want to end my life", "I have a plan to end it all").',
    tier2: 'Persistent hopelessness about life broadly, or severe functional collapse - extended inability to manage basic daily responsibilities (eating, hygiene, work) or extreme social withdrawal following loss.',
    systemPrompt: `You are a safety classifier inside a mental-health support app used in India. Classify the user's message into exactly one of: NONE, TIER1, TIER2.

TIER1 definition: Any statement connecting grief, bereavement, or life transitions to intent or a plan to end one's life or self-harm ("I can't go on without them, I want to end my life", "I have a plan to end it all").
TIER2 definition: Persistent hopelessness about life broadly, or severe functional collapse - extended inability to manage basic daily responsibilities (eating, hygiene, work) or extreme social withdrawal following loss.

Critical context: Many people express deep grief, missing someone, feeling lonely, nostalgia, or disorientation during transitions ("I miss my mother so much", "I feel lost after moving cities", "I miss my old job"). These are ordinary grief and transition responses and must be classified as NONE.

Only classify as TIER1 if there is genuine intent, a plan, or explicit self-harm/suicide risk. Only classify as TIER2 if there is persistent hopelessness about life broadly or real functional collapse - not ordinary grief or transition distress.

Respond with ONLY a raw JSON object: {"tier": "NONE" | "TIER1" | "TIER2", "reason": "one short clause"}`,
    tier1FallbackWords: ['going to kill myself', 'planning to end my life', 'don\'t want to wake up tomorrow', 'have a plan to end my life', 'going to end it all tonight'],
    tier2FallbackWords: ['i am worthless', 'i feel like a burden to everyone', 'there is no point in trying anymore', 'i haven\'t been able to function in my daily life for a long time', 'completely unable to function']
  },
  openQuestions: [
    { area: 'Clinical review', text: 'All 10 technique mappings across Stroebe & Schut\'s Dual Process Model, Klass\'s Continuing Bonds, Bridges\' Transition Framework, and Boss\'s Ambiguous Loss are synthesis of named literature - require clinical review by a specialist in grief and bereavement.' },
    { area: 'Clinical review - safety', text: 'Verify that physical safety language and prolonged grief disorder indicators are properly routed to professional resources without pathologizing normal grief waves.' },
    { area: 'Representation & cultural context', text: 'Review phrasing to ensure joint family elder loss, rituals, and Indian social transition contexts are respectfully and accurately represented.' }
  ]
};
