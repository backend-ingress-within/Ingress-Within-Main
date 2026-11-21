import AppClient from '../[[...slug]]/AppClient';

export const metadata = {
  title: 'Practitioner Workspace | Ingress Within Clinicians',
  description: 'Clinical practitioner workspace, client records, appointment management, and SOAP clinical documentation.',
};

export default function TherapistRootPage() {
  return <AppClient initialRoute="therapist" />;
}
