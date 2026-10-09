/**
 * Ingress Within — Support & Feedback Configuration
 * Centralized contact information and public support definitions.
 */

export const SUPPORT_CONFIG = {
  // Primary operational support contact
  supportEmail: 'contactus@ingresswithin.com',

  // Temporary public contact number for support
  temporaryContactNumber: '+91 89556 05569',
  temporaryContactNumberRaw: '+918955605569',

  // Direct internal routing URL for user feedback
  feedbackUrl: '/feedback',

  // Standard user-facing notice
  supportNotice:
    'Found a bug or having an issue? Report it through our feedback form or email contactus@ingresswithin.com. You can also contact us at +91 89556 05569.',

  // Feedback categories available to users
  categories: [
    'General Feedback',
    'UI/UX Experience',
    'Technical Issue',
    'Feature Request',
    'Performance',
    'Accessibility',
    'Other'
  ] as const,

  // Submission types
  submissionTypes: [
    { id: 'feedback', label: 'General Feedback', description: 'Share your thoughts, suggestions, or ideas' },
    { id: 'bug_report', label: 'Bug Report', description: 'Report something that is broken or behaving incorrectly' },
    { id: 'issue', label: 'Account / Technical Issue', description: 'Need assistance with your account, sessions, or billing' }
  ] as const
} as const;

export type FeedbackCategory = (typeof SUPPORT_CONFIG.categories)[number];
export type FeedbackSubmissionType = 'feedback' | 'bug_report' | 'issue';
export type FeedbackStatus = 'new' | 'in_review' | 'in_progress' | 'resolved' | 'closed';
export type FeedbackPriority = 'low' | 'normal' | 'high' | 'critical';
