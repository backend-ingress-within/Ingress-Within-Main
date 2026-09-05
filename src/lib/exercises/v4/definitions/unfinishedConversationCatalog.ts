import { ExerciseDefinition } from '../types/exercise.types';

export const UNFINISHED_CONVERSATION_DEFINITION: ExerciseDefinition = {
  id: 'unfinished_conversation',
  exercise_type: 'unfinished_conversation',
  title: 'Unfinished Conversation',
  description: 'Examine an unfinished interpersonal conversation, what silence is protecting, and what it costs.',
  unlock_rules: { day: 213, cycle: 7, strategy: 'entries_and_day', min_entries: 18 },
  cycle: 7,
  frequency: 'once_per_cycle',
  estimated_duration: 12,
  version: '1.0',
  active_status: true
};

export const UNFINISHED_CONVERSATION_CONFIG = {
  exercise_id: 'unfinished_conversation',
  exercise_number: '10A',
  title: 'Unfinished Conversation',
  slug: 'unfinished-conversation',
  timing: 'Month 7',
  unlock_day: 213,
  min_entries: 18,
  branch: 'A',
  duration: '10–14 min',
  description: 'Examine an unfinished interpersonal conversation, what silence is protecting, and what it costs.'
};

export interface CoreQuestionItem {
  id: number;
  text: string;
  short: string;
  guidance?: string;
}

export const UNFINISHED_CONVERSATION_QUESTIONS: CoreQuestionItem[] = [
  {
    id: 1,
    text: "Who is the conversation with, and how long has it been unfinished?",
    short: "Who & duration",
    guidance: "Name the person, your relationship to them (e.g. brother, partner, friend, manager), and roughly how long this has remained unsaid."
  },
  {
    id: 2,
    text: "Say the thing directly to them, as if they were in front of you right now — in one honest sentence.",
    short: "Direct statement",
    guidance: "Speak directly TO the person (using 'You...'), as if they were sitting in front of you right now, rather than describing the situation."
  },
  {
    id: 3,
    text: "What are you protecting by not saying it — for yourself and for them?",
    short: "What silence protects",
    guidance: "Consider what keeping quiet protects for yourself (e.g. avoiding conflict, rejection, guilt, or discomfort) and for them (e.g. protecting their feelings or surface peace)."
  },
  {
    id: 4,
    text: "What is the cost of it remaining unsaid?",
    short: "Cost of remaining unsaid",
    guidance: "Reflect on what keeping this unsaid appears to cost you emotionally, relationally, or cognitively (e.g. ongoing tension, distance, resentment, or mental energy)."
  }
];
