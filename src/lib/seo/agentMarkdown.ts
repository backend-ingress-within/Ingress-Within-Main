/**
 * Agent-Ready Markdown Generator
 * Renders concise, high-density, token-efficient Markdown representations
 * of Ingress Within public pages for autonomous agents and LLM crawlers
 * negotiating with `Accept: text/markdown` (RFC 7763).
 */

export function getPageMarkdown(pathname: string): string {
  const cleanPath = (pathname || '/').replace(/\/$/, '') || '/';

  switch (cleanPath) {
    case '/about':
      return `# About Ingress Within
> Mission, clinical philosophy, and ethics behind Ingress Within.

Ingress Within was built to eliminate the divide between solitary self-reflection and professional psychotherapy. We believe psychological growth is continuous: personal reflection informs therapeutic sessions, and clinical insights guide everyday independent practice.

## Core Philosophy
1. **Dignity & Agency**: The client remains the expert in their lived experience. Self-guided tools respect personal autonomy.
2. **Clinical Rigor**: All practicing therapists on Ingress Within are independently licensed clinical psychologists or certified psychotherapists.
3. **Data Sovereignity**: User reflection entries are encrypted, never sold, never used for advertising, and strictly excluded from AI model training.
4. **Continuity of Care**: Concluded care cycles retain a 6-month continuous access window for clients while clinician statutory medical records remain permanently preserved.

## Contact & Location
- **Organization**: Ingress Within
- **Location**: Mumbai, Maharashtra, India
- **Contact Email**: contactus@ingresswithin.com
- **Contact Phone**: +91 89556 05569
- **Website**: https://ingresswithin.com
`;

    case '/contact':
      return `# Contact Ingress Within
> Connect with the Ingress Within care coordination team, user support, and clinical administration.

## Direct Channels
- **General & Support Email**: [contactus@ingresswithin.com](mailto:contactus@ingresswithin.com)
- **Care Coordination Phone**: [+91 89556 05569](tel:+918955605569)
- **Privacy Inquiries**: [privacy@ingresswithin.com](mailto:privacy@ingresswithin.com)
- **Feedback & Issue Reporting**: [https://ingresswithin.com/feedback](https://ingresswithin.com/feedback)
- **Website**: [https://ingresswithin.com](https://ingresswithin.com)

## Operating Hours & Location
- **Hours**: Monday to Saturday, 09:00 AM – 09:00 PM IST
- **Registered City**: Mumbai, Maharashtra, India (Postal Code: 400053)

## Emergency Crisis Support
Ingress Within is not an emergency crisis intervention service. If you or someone you know is in acute distress or experiencing thoughts of self-harm, please contact national 24/7 helplines immediately:
- **Tele-MANAS (Govt. of India)**: Call 14416 (Toll-Free, Multi-lingual, 24/7)
- **KIRAN Mental Health Helpline**: Call 1800-599-0019
- **Vandrevala Foundation**: Call 9999 666 555
`;

    case '/therapy':
      return `# Professional Therapy Care | Ingress Within
> Telehealth psychotherapy with verified licensed clinical psychologists and counselors.

## How Therapy Works on Ingress Within
1. **Intake & Clinical Matching**: Complete a guided clinical questionnaire or select your preferred clinician based on specialization, therapeutic modality, and language.
2. **Zero-Login First Consultation**: Clients can review clinical disclosures, sign telehealth consent, and book their initial session with no upfront friction.
3. **Integrated Care Space**: With client consent, insights and emotional patterns from self-guided reflection can be shared directly with your therapist.
4. **Continuous Caseload Record**: Homework assignments, session notes, and treatment milestones stay organized in your therapy portal.

## Clinician Qualifications
All participating practitioners undergo credential verification, licensing audit, and compliance checks before clinical authorization.

- **Intake Portal**: [https://ingresswithin.com/therapy](https://ingresswithin.com/therapy)
- **Support**: contactus@ingresswithin.com | +91 89556 05569
`;

    case '/solution':
    case '/what-it-is':
      return `# Our Solution | Ingress Within
> A unified continuum connecting independent self-inquiry and professional psychotherapeutic care.

## The Problem
Mental health care today is polarized: on one side are solitary journaling apps with no professional oversight; on the other are weekly therapy sessions disconnected from everyday life.

## The Ingress Within Solution
1. **Self-Guided Practice**: Structured reflection rhythms and cognitive inquiry.
2. **Professional Telehealth**: Licensed clinical care with secure video consultations.
3. **The Bridge**: Consensual sharing of emotional vocabulary and recurring patterns between client and clinician.

- **Explore More**: [https://ingresswithin.com/solution](https://ingresswithin.com/solution)
`;

    case '/how-it-works':
    case '/how':
      return `# How It Works | Ingress Within
> The 4-stage psychological rhythm guiding self-reflection and professional care.

1. **Inquiry**: Engaging with evidence-informed prompts designed for clarity.
2. **Pattern Recognition**: Uncovering recurring emotional vocabulary and behavioral triggers over time.
3. **Clinical Collaboration**: Optionally integrating self-reflection data into telehealth sessions with your therapist.
4. **Integration & Grounding**: Practicing targeted micro-interventions between sessions.

- **Learn More**: [https://ingresswithin.com/how-it-works](https://ingresswithin.com/how-it-works)
`;

    case '/pricing':
      return `# Pricing & Plans | Ingress Within
> Transparent, ethical pricing for self-guided modules and professional therapy consultations.

- **Self-Guided Reflection**: Complimentary core journaling and guided reflection prompts.
- **Therapy Consultations**: Set directly by licensed clinicians (typically ₹1,000 to ₹2,500 per 50-minute clinical consultation).
- **No Lock-in**: Pay per consultation with verified payment gateways (Razorpay, UPI, Cards).

- **Pricing Page**: [https://ingresswithin.com/pricing](https://ingresswithin.com/pricing)
`;

    case '/ai-data':
      return `# AI & Data Ethics Policy | Ingress Within
> Our strict privacy-first architecture, boundaries, and data protections.

## Key Commitments
- **Zero AI Model Training**: We NEVER train, fine-tune, or evaluate public or proprietary AI models on your private journal entries or therapy notes.
- **Explicit Consent**: Sharing patterns or reflection summaries with a therapist requires explicit, revocable client consent.
- **Data Minimization**: Calendar integrations only check busy/free timestamps—never attendee lists, event titles, or descriptions.

- **Full Policy**: [https://ingresswithin.com/ai-data](https://ingresswithin.com/ai-data)
`;

    case '/privacy-policy':
    case '/privacy':
      return `# Privacy Policy | Ingress Within
> Comprehensive summary of data collection, processing, and protection standards.

Ingress Within complies with the Digital Personal Data Protection (DPDP) Act, Google API Services User Data Policy, and international health data protection guidelines.

- **Data Controller**: Ingress Within (Mumbai, Maharashtra, India)
- **Grievance Officer**: privacy@ingresswithin.com
- **Client Rights**: Access, rectification, consent withdrawal, and account deletion. Concluded care cycles maintain a 6-month access retention period while statutory therapist clinical records are permanently safeguarded.
- **Full Policy**: [https://ingresswithin.com/privacy-policy](https://ingresswithin.com/privacy-policy)
`;

    case '/terms':
    case '/terms-of-service':
      return `# Terms of Service | Ingress Within
> Governing terms for self-directed reflection tools and telehealth therapy services.

- **Service Scope**: Ingress Within provides self-reflection tools and telehealth infrastructure connecting users with independent licensed mental health practitioners.
- **Non-Emergency Notice**: Ingress Within is not an emergency psychiatric hotline.
- **Full Terms**: [https://ingresswithin.com/terms-of-service](https://ingresswithin.com/terms-of-service)
`;

    case '/':
    default:
      return `# Ingress Within — Understand · Grow · Continue

> One platform for different ways of working on your mental health. Start on your own, work with a therapist, or move between the two.

## Platform Overview
Ingress Within is a psychological care platform providing structured self-reflection, emotional pattern discovery, and professional telehealth psychotherapy. Built for individuals seeking evidence-informed self-care and licensed therapeutic guidance within a single continuous care space.

## Pathways of Care

### 1. Self-Guided Psychological Reflection
- **Evidence-Based Journaling**: Structured inquiry prompts inspired by Cognitive Behavioral Therapy (CBT), Acceptance and Commitment Therapy (ACT), and narrative psychology.
- **Pattern Synthesis**: Consensual, private identification of recurring emotional vocabulary and thinking cycles.
- **Micro-Interventions**: Grounding tools, emotional regulation exercises, and cognitive defusion practices.

### 2. Professional Telehealth Therapy
- **Licensed Practitioners**: Verified clinical psychologists and licensed psychotherapists.
- **Seamless Care Continuum**: Clients can securely share consented reflection insights and emotional patterns with their therapist to accelerate clinical progress.
- **Encrypted Consultations**: Zero-login client video access, verified telehealth consents, and dedicated SOAP notes archived permanently.

### 3. Integrated Continuum
- Move fluidly between independent self-work and clinician sessions without losing historical continuity, reflection milestones, or past session archives.

## Core Navigation & Links
- [Therapy Care & Clinician Matching](https://ingresswithin.com/therapy)
- [Our Solution](https://ingresswithin.com/solution)
- [How It Works](https://ingresswithin.com/how-it-works)
- [Pricing](https://ingresswithin.com/pricing)
- [AI & Data Philosophy](https://ingresswithin.com/ai-data)
- [Evidence & Research](https://ingresswithin.com/evidence)
- [About Ingress Within](https://ingresswithin.com/about)
- [Contact Support](https://ingresswithin.com/contact)
- [Privacy Policy](https://ingresswithin.com/privacy-policy)
- [Terms of Service](https://ingresswithin.com/terms-of-service)
- [Emergency Crisis Resources](https://ingresswithin.com/crisis)

## Business Information & Contact
- **Entity**: Ingress Within
- **Location**: Mumbai, Maharashtra, India
- **Support Email**: contactus@ingresswithin.com
- **Support Phone**: +91 89556 05569
- **Website**: https://ingresswithin.com
`;
  }
}
