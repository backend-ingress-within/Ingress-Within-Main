import AppClient from '../[[...slug]]/AppClient';

export const metadata = {
  title: 'Clinical Therapy Intake & Consultations | Ingress Within',
  description: 'Connect with verified clinical psychologists and psychotherapists. Evidence-based care tailored to your therapeutic goals.',
};

export default function TherapyRootPage() {
  return <AppClient initialRoute="therapy" />;
}
