import React from 'react';
import GuestBookingView from '../../../views/therapy/GuestBookingView';

export const metadata = {
  title: 'Book Therapy Consultation | Ingress Within',
  description: 'Schedule a private clinical consultation with your assigned therapist.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function GuestBookingPage({ params }) {
  const { token } = await params;
  return <GuestBookingView token={token} />;
}
