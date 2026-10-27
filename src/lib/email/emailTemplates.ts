import { EmailRenderedContent } from './emailTypes';
import { renderBaseEmailLayout, escapeHtml } from './baseEmailLayout';
import { SUPPORT_CONFIG } from '../../config/supportConfig';

export { escapeHtml };

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return isoString;
  }
}

/**
 * Strict privacy boundary:
 * Emails contain ONLY operational data (date, time, meet links, policies).
 * Client health evaluations and clinical notes are strictly segregated and never emailed.
 */
export const EmailTemplates: Record<string, (data: Record<string, any>) => EmailRenderedContent> = {
  therapist_match_request: (data) => {
    const rawTherapistName = data.therapistName || 'Therapist';
    const therapistName = escapeHtml(rawTherapistName);
    const dashboardUrl = data.dashboardUrl || 'https://ingresswithin.com/therapist';
    const matchId = escapeHtml(data.matchId || '');
    const rank = escapeHtml(data.rank || '');

    const contentHtml = `
      <p style="margin: 0 0 12px 0;">Hello <strong>${therapistName}</strong>,</p>
      <p style="margin: 0 0 16px 0;">A new client has been matched to your profile based on the clinical information in your approved therapist profile and the client's intake criteria.</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 13px; color: #475569;"><strong>Match Request Reference:</strong> <span style="font-family: monospace; color: #0f172a;">${matchId}</span></p>
        ${rank ? `<p style="margin: 0; font-size: 13px; color: #475569;"><strong>Shortlist Rank:</strong> ${rank}</p>` : ''}
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 16px 0 0 0;">
        <strong>Privacy Notice:</strong> For client privacy and safety, clinical intake details are not transmitted over unencrypted email. Please sign in to your secure therapist dashboard to review the request and accept the connection.
      </p>
    `;

    return {
      subject: 'New client matching request on Ingress Within',
      html: renderBaseEmailLayout({
        title: 'New Client Matching Request',
        badge: 'New Match Request',
        badgeVariant: 'info',
        heading: 'New Client Matching Request',
        preheader: `A new client has been matched to your profile on Ingress Within. Match ID: ${matchId}`,
        contentHtml,
        ctaButton: {
          label: 'Open Therapist Dashboard',
          url: dashboardUrl,
        },
      }),
      text: `Hello ${rawTherapistName},\n\nA new client has been matched to your profile on Ingress Within.\n\nMatch request: ${data.matchId || ''}\n${data.rank ? `Shortlist rank: ${data.rank}\n` : ''}\nFor privacy, clinical intake details are not included in this email. Please sign in to the therapist dashboard to review the request.\n\nOpen Therapist Dashboard:\n${dashboardUrl}\n\nWarm regards,\nThe Ingress Within Care Team`,
    };
  },

  therapist_accepted_client: (data) => {
    const rawClientName = data.clientName || 'Valued Client';
    const clientName = escapeHtml(rawClientName);
    const rawTherapistName = data.therapistName || 'Your Therapist';
    const therapistName = escapeHtml(rawTherapistName);

    const contentHtml = `
      <p style="margin: 0 0 12px 0;">Hello <strong>${clientName}</strong>,</p>
      <p style="margin: 0 0 16px 0;">We are pleased to share that <strong>${therapistName}</strong> has accepted your care connection request on Ingress Within.</p>
      
      <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px 18px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 0; font-weight: 600; color: #166534; font-size: 14px;">Next Step: First Session Coordination</p>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #15803d; line-height: 1.5;">
          Our clinical coordination team will connect with you shortly to finalize your first session time and provide your booking link.
        </p>
      </div>

      <p style="margin: 0; font-size: 13.5px; color: #475569;">
        You can log in to your Ingress Within account anytime to view your care team status and explore self-guided reflection tools.
      </p>
    `;

    return {
      subject: `Ingress Within: ${rawTherapistName} has accepted your care connection`,
      html: renderBaseEmailLayout({
        title: 'Care Connection Accepted',
        badge: 'Care Connection Accepted',
        badgeVariant: 'success',
        heading: 'Care Connection Accepted',
        preheader: `${rawTherapistName} has accepted your care connection request on Ingress Within.`,
        contentHtml,
        ctaButton: {
          label: 'View Care Journey',
          url: 'https://ingresswithin.com',
        },
      }),
      text: `Hello ${rawClientName},\n\nWe are pleased to inform you that ${rawTherapistName} has accepted your care connection request.\n\nNext Step: Our clinical coordination team will connect with you shortly to finalize your first session time.\n\nWarm regards,\nThe Ingress Within Care Team`,
    };
  },

  therapist_accepted_therapist_confirmation: (data) => {
    const rawTherapistName = data.therapistName || 'Doctor/Counselor';
    const therapistName = escapeHtml(rawTherapistName);
    const rawClientName = data.clientName || 'your client';
    const clientName = escapeHtml(rawClientName);
    const dashboardUrl = data.dashboardUrl || 'https://ingresswithin.com/therapist';

    const contentHtml = `
      <p style="margin: 0 0 12px 0;">Hello <strong>${therapistName}</strong>,</p>
      <p style="margin: 0 0 16px 0;">You have successfully accepted the care matching request for <strong>${clientName}</strong>.</p>
      
      <div style="background-color: #f8fafc; border-left: 4px solid #4E7A66; padding: 16px 20px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 0; font-weight: 600; color: #132A24; font-size: 14px;">Next Operational Steps:</p>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.6;">
          <li>The client has been notified via email that you accepted their request.</li>
          <li>A care relationship is now active in your <strong>Active Clients</strong> caseload.</li>
          <li>You can review their intake notes and schedule availability in your practitioner workspace.</li>
        </ul>
      </div>
    `;

    return {
      subject: `Client Connection Confirmed: ${rawClientName} added to your caseload`,
      html: renderBaseEmailLayout({
        title: 'Client Connection Confirmed',
        badge: 'Caseload Update',
        badgeVariant: 'success',
        heading: 'New Client Added to Your Caseload',
        preheader: `You have accepted the connection request for ${rawClientName}. Caseload updated.`,
        contentHtml,
        ctaButton: {
          label: 'Open Therapist Workspace',
          url: dashboardUrl,
        },
      }),
      text: `Hello ${rawTherapistName},\n\nYou have successfully accepted the care matching request for ${rawClientName}.\n\nThe client has been notified via email and a care relationship is now active in your Active Clients caseload.\n\nOpen Therapist Workspace:\n${dashboardUrl}\n\nWarm regards,\nThe Ingress Within Care & Clinical Team`,
    };
  },

  first_session_coordination_team: (data) => {
    const rawTherapistName = data.therapistName || 'Therapist';
    const therapistName = escapeHtml(rawTherapistName);
    const rawClientEmail = data.clientEmail || 'Client';
    const clientEmail = escapeHtml(rawClientEmail);
    const rawMatchId = data.matchId || '';
    const matchId = escapeHtml(rawMatchId);

    const contentHtml = `
      <p style="margin: 0 0 16px 0;">A new care connection was accepted and requires operational scheduling coordination.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569; width: 140px;">Match ID:</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-family: monospace; color: #0f172a;">${matchId}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569;">Therapist:</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${therapistName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569;">Client Contact:</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${clientEmail}</td>
        </tr>
      </table>

      <p style="margin: 16px 0 0 0; font-size: 13.5px; color: #475569;">
        Please verify availability and dispatch the initial session scheduling order.
      </p>
    `;

    return {
      subject: `[ACTION REQUIRED] First Session Coordination: Match #${rawMatchId}`,
      html: renderBaseEmailLayout({
        title: 'First Session Coordination Required',
        badge: 'Internal Action Required',
        badgeVariant: 'warning',
        heading: 'First Session Coordination Required',
        preheader: `Coordination required for match #${rawMatchId} between ${rawTherapistName} and ${rawClientEmail}`,
        contentHtml,
      }),
      text: `First Session Coordination Required\n\nMatch ID: ${rawMatchId}\nTherapist: ${rawTherapistName}\nClient: ${rawClientEmail}\n\nPlease verify availability and dispatch the initial session payment order.`,
    };
  },

  session_confirmed: (data) => {
    const rawRecipientName = data.recipientName || 'there';
    const recipientName = escapeHtml(rawRecipientName);
    const rawOtherPartyName = data.otherPartyName || 'Therapist';
    const otherPartyName = escapeHtml(rawOtherPartyName);
    const formattedStart = formatDate(data.scheduledStart);
    const googleMeetUrl = data.googleMeetUrl || '';
    const rawBookingRef = data.bookingReference || '';
    const bookingRef = escapeHtml(rawBookingRef);

    const contentHtml = `
      <p style="margin: 0 0 12px 0;">Hello <strong>${recipientName}</strong>,</p>
      <p style="margin: 0 0 16px 0;">Your therapy session with <strong>${otherPartyName}</strong> has been successfully booked and confirmed.</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;">Booking Reference: <strong style="color: #0f172a; font-family: monospace;">${bookingRef}</strong></p>
        <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #0f172a;">Scheduled Time: ${escapeHtml(formattedStart)}</p>
        
        ${
          googleMeetUrl
            ? `<div style="margin-top: 14px;">
          <a href="${escapeHtml(googleMeetUrl)}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 500; font-size: 13.5px;">
            Join with Google Meet
          </a>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">Direct Link: <a href="${escapeHtml(googleMeetUrl)}" style="color: #2563eb;">${escapeHtml(googleMeetUrl)}</a></p>
        </div>`
            : `<p style="margin: 8px 0 0 0; font-size: 13px; color: #64748b;">Meeting link will synchronize to your calendar prior to the session.</p>`
        }
      </div>

      <h4 style="margin: 20px 0 8px 0; color: #132A24; font-size: 14px;">Policy Guidelines</h4>
      <ul style="margin: 0 0 16px 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.6;">
        <li><strong>Rescheduling:</strong> Permitted up to 24 hours before session start at no additional cost.</li>
        <li><strong>Cancellations:</strong> Cancellations made at least 48 hours prior receive a 100% refund. Cancellations made within 24 hours are non-refundable.</li>
      </ul>
    `;

    return {
      subject: `Confirmed: Therapy Session with ${rawOtherPartyName} (${formattedStart})`,
      html: renderBaseEmailLayout({
        title: 'Session Confirmed',
        badge: 'Session Confirmed',
        badgeVariant: 'success',
        heading: 'Session Confirmed',
        preheader: `Confirmed session with ${rawOtherPartyName} on ${formattedStart}. Booking reference: ${rawBookingRef}`,
        contentHtml,
        ctaButton: googleMeetUrl
          ? {
              label: 'Join with Google Meet',
              url: googleMeetUrl,
            }
          : undefined,
      }),
      text: `Hello ${rawRecipientName},\n\nYour therapy session with ${rawOtherPartyName} is confirmed for ${formattedStart}.\n\nBooking Reference: ${rawBookingRef}\nMeeting Link: ${googleMeetUrl || 'Will sync to your calendar'}\n\nRescheduling: Permitted up to 24h before start.\nCancellations: 48h prior for full refund.\n\nWarm regards,\nThe Ingress Within Care Team`,
    };
  },

  session_rescheduled: (data) => {
    const rawRecipientName = data.recipientName || 'there';
    const recipientName = escapeHtml(rawRecipientName);
    const rawOtherPartyName = data.otherPartyName || 'Therapist';
    const otherPartyName = escapeHtml(rawOtherPartyName);
    const oldStart = formatDate(data.previousStart);
    const newStart = formatDate(data.newStart);
    const googleMeetUrl = data.googleMeetUrl || '';

    const contentHtml = `
      <p style="margin: 0 0 12px 0;">Hello <strong>${recipientName}</strong>,</p>
      <p style="margin: 0 0 16px 0;">Your session with <strong>${otherPartyName}</strong> has been rescheduled.</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 13px; color: #94a3b8; text-decoration: line-through;">Previous Time: ${escapeHtml(oldStart)}</p>
        <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #16a34a;">New Time: ${escapeHtml(newStart)}</p>
        
        ${
          googleMeetUrl
            ? `<div style="margin-top: 12px;">
          <a href="${escapeHtml(googleMeetUrl)}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 500; font-size: 13.5px;">
            Join with Google Meet
          </a>
        </div>`
            : ''
        }
      </div>

      <p style="margin: 0; font-size: 13px; color: #64748b;">Your calendar event has been updated automatically.</p>
    `;

    return {
      subject: `Rescheduled: Therapy Session with ${rawOtherPartyName} (New Time: ${newStart})`,
      html: renderBaseEmailLayout({
        title: 'Session Rescheduled',
        badge: 'Session Rescheduled',
        badgeVariant: 'info',
        heading: 'Session Rescheduled',
        preheader: `Your session with ${rawOtherPartyName} has been rescheduled to ${newStart}`,
        contentHtml,
        ctaButton: googleMeetUrl
          ? {
              label: 'Join with Google Meet',
              url: googleMeetUrl,
            }
          : undefined,
      }),
      text: `Hello ${rawRecipientName},\n\nYour session with ${rawOtherPartyName} has been rescheduled from ${oldStart} to ${newStart}.\nMeeting Link: ${googleMeetUrl}\n\nWarm regards,\nThe Ingress Within Care Team`,
    };
  },

  session_cancelled: (data) => {
    const rawRecipientName = data.recipientName || 'there';
    const recipientName = escapeHtml(rawRecipientName);
    const rawOtherPartyName = data.otherPartyName || 'Therapist';
    const otherPartyName = escapeHtml(rawOtherPartyName);
    const scheduledStart = formatDate(data.scheduledStart);
    const rawReason = data.reason || 'Requested by user';
    const reason = escapeHtml(rawReason);
    const refundStatus = data.refundStatus || 'none';

    const contentHtml = `
      <p style="margin: 0 0 12px 0;">Hello <strong>${recipientName}</strong>,</p>
      <p style="margin: 0 0 16px 0;">The therapy session with <strong>${otherPartyName}</strong> scheduled for <strong>${escapeHtml(scheduledStart)}</strong> has been cancelled.</p>
      
      <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #991b1b;"><strong>Reason:</strong> ${reason}</p>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #991b1b;">
          <strong>Refund Status:</strong> ${
            refundStatus === 'full'
              ? 'A 100% full refund has been initiated to your original payment method.'
              : refundStatus === 'eligible'
              ? 'Your cancellation qualifies for a full refund and is processing.'
              : refundStatus === 'failed'
              ? 'Your refund is pending resolution by our care team and will be disbursed shortly.'
              : refundStatus === 'denied'
              ? 'Non-refundable (cancellation occurred within 24 hours of session).'
              : 'Pending administrative review under platform cancellation guidelines.'
          }
        </p>
      </div>

      <p style="margin: 0; font-size: 13.5px; color: #64748b;">
        If you have any questions or would like to schedule a replacement appointment, please contact our support team at <a href="mailto:contactus@ingresswithin.com" style="color: #4E7A66;">contactus@ingresswithin.com</a>.
      </p>
    `;

    return {
      subject: `Cancelled: Therapy Session on ${scheduledStart}`,
      html: renderBaseEmailLayout({
        title: 'Session Cancelled',
        badge: 'Session Cancelled',
        badgeVariant: 'error',
        heading: 'Session Cancelled',
        preheader: `The session with ${rawOtherPartyName} scheduled for ${scheduledStart} was cancelled.`,
        contentHtml,
      }),
      text: `Hello ${rawRecipientName},\n\nThe therapy session with ${rawOtherPartyName} on ${scheduledStart} has been cancelled.\nReason: ${rawReason}\nRefund Status: ${refundStatus}\n\nWarm regards,\nThe Ingress Within Care Team`,
    };
  },

  refund_initiated: (data) => {
    const rawRecipientName = data.recipientName || 'Valued Client';
    const recipientName = escapeHtml(rawRecipientName);
    const amountInr = (data.amountPaise ? (data.amountPaise / 100).toFixed(2) : data.amountInr) || '0.00';
    const rawRefundId = data.refundId || '';
    const refundId = escapeHtml(rawRefundId);

    const contentHtml = `
      <p style="margin: 0 0 12px 0;">Hello <strong>${recipientName}</strong>,</p>
      <p style="margin: 0 0 16px 0;">We have processed a refund of <strong>INR ${escapeHtml(amountInr)}</strong> for your session.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #166534;">Refund Reference: <strong style="font-family: monospace;">${refundId}</strong></p>
        <p style="margin: 8px 0 0 0; font-size: 13px; color: #166534;">Funds typically reflect in your bank account or original payment method within 5–7 business days.</p>
      </div>

      <p style="margin: 0; font-size: 13.5px; color: #64748b;">
        If you have any questions regarding your refund, please feel free to reach out to our team.
      </p>
    `;

    return {
      subject: `Refund Confirmation: INR ${amountInr} initiated`,
      html: renderBaseEmailLayout({
        title: 'Refund Processed',
        badge: 'Refund Processed',
        badgeVariant: 'success',
        heading: 'Refund Processed',
        preheader: `Refund of INR ${amountInr} initiated. Reference: ${rawRefundId}`,
        contentHtml,
      }),
      text: `Hello ${rawRecipientName},\n\nWe have processed a full refund of INR ${amountInr} for your session.\nRefund Reference: ${rawRefundId}\n\nFunds typically reflect within 5-7 business days.\n\nWarm regards,\nThe Ingress Within Care Team`,
    };
  },

  no_show_recorded: (data) => {
    const rawRecipientName = data.recipientName || 'there';
    const recipientName = escapeHtml(rawRecipientName);
    const attendanceStatus = data.attendanceStatus || '';
    const scheduledStart = formatDate(data.scheduledStart);
    const isClientNoShow = attendanceStatus === 'client_no_show';

    const contentHtml = `
      <p style="margin: 0 0 12px 0;">Hello <strong>${recipientName}</strong>,</p>
      <p style="margin: 0 0 16px 0;">Our records indicate that the session scheduled for <strong>${escapeHtml(scheduledStart)}</strong> was recorded as unattended (${escapeHtml(attendanceStatus)}).</p>
      
      <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          ${
            isClientNoShow
              ? 'Under our clinical scheduling terms, client unattended appointments are non-refundable to respect the clinician reserved time.'
              : 'A full refund has been initiated to your account due to therapist absence.'
          }
        </p>
      </div>

      <p style="margin: 0; font-size: 13.5px; color: #64748b;">
        Please reach out to <a href="mailto:contactus@ingresswithin.com" style="color: #4E7A66;">contactus@ingresswithin.com</a> if you believe this was recorded in error.
      </p>
    `;

    return {
      subject: `Notice: Missed Appointment on ${scheduledStart}`,
      html: renderBaseEmailLayout({
        title: 'Missed Appointment Notice',
        badge: 'Attendance Notice',
        badgeVariant: 'warning',
        heading: 'Missed Appointment Notice',
        preheader: `Notice regarding missed appointment on ${scheduledStart}.`,
        contentHtml,
      }),
      text: `Hello ${rawRecipientName},\n\nThe session scheduled for ${scheduledStart} was recorded as unattended (${attendanceStatus}).\n\nReach out to support@ingresswithin.com if you have any questions.\n\nWarm regards,\nThe Ingress Within Care Team`,
    };
  },

  // =========================================================================
  // THERAPIST ONBOARDING & VERIFICATION WORKFLOW TEMPLATES
  // =========================================================================

  therapist_application_submitted_admin: (data) => {
    const rawTherapistName = data.therapistName || 'Applicant';
    const therapistName = escapeHtml(rawTherapistName);
    const rawEmail = data.email || 'Not provided';
    const email = escapeHtml(rawEmail);
    const rawSpec = Array.isArray(data.specialization)
      ? data.specialization.join(', ')
      : data.specialization || 'Clinical Psychology';
    const specialization = escapeHtml(rawSpec);
    const rawExp =
      data.experience !== undefined && data.experience !== null
        ? `${data.experience} years`
        : 'Not specified';
    const experience = escapeHtml(rawExp);
    const submittedAt = data.submittedAt ? formatDate(data.submittedAt) : 'Recently';
    const adminReviewUrl = data.adminReviewUrl || 'https://ingresswithin.com/admin/applications';

    const contentHtml = `
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">A new clinician has submitted an onboarding application for credential verification and clinical review.</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #64748b; width: 140px;">Therapist:</td><td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${therapistName}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Email:</td><td style="padding: 6px 0; font-weight: 500; color: #0f172a;">${email}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Specialization:</td><td style="padding: 6px 0; color: #0f172a;">${specialization}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Experience:</td><td style="padding: 6px 0; color: #0f172a;">${experience}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Status:</td><td style="padding: 6px 0;"><span style="background-color: #fef3c7; color: #92400e; padding: 3px 8px; border-radius: 4px; font-weight: 600; font-size: 12px;">Submitted / Under Review</span></td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Submitted At:</td><td style="padding: 6px 0; color: #475569;">${escapeHtml(submittedAt)}</td></tr>
        </table>
      </div>
    `;

    return {
      subject: `New Therapist Application — ${rawTherapistName}`,
      html: renderBaseEmailLayout({
        title: 'New Therapist Application',
        badge: 'Admin Notification',
        badgeVariant: 'warning',
        heading: 'New Therapist Application',
        preheader: `New clinician application submitted by ${rawTherapistName}.`,
        contentHtml,
        ctaButton: {
          label: 'Review Application in Admin Portal',
          url: adminReviewUrl,
        },
        footerNote: 'Secure administrative link requires authenticated founder/admin session. Sensitive credentials and clinical notes are gated behind role authorization.',
      }),
      text: `Ingress Within — New Therapist Application\n\nA new therapist has submitted an application for review.\n\nTherapist: ${rawTherapistName}\nEmail: ${rawEmail}\nSpecialization: ${rawSpec}\nExperience: ${rawExp}\nStatus: Submitted / Under Review\nSubmitted: ${submittedAt}\n\nReview Application in Admin Portal:\n${adminReviewUrl}\n\nIngress Within Clinical Administration`,
    };
  },

  therapist_application_received: (data) => {
    const rawTherapistName = data.therapistName || 'Doctor/Counselor';
    const therapistName = escapeHtml(rawTherapistName);
    const statusUrl = data.statusUrl || 'https://ingresswithin.com/therapist/application/status';
    const answers = (data.answers || {}) as Record<string, any>;
    const rawDocs = Array.isArray(data.documents) ? data.documents : [];
    const submittedAtIso = data.submittedAt || new Date().toISOString();
    const formattedSubmittedDate = formatDate(submittedAtIso);

    // 1. Basic Applicant Information
    const applicantEmail = escapeHtml(answers.contact_email || answers.email || data.email || 'Registered account email');
    const applicantPhone = escapeHtml(answers.phone || 'Recorded in application');
    const city = answers.city ? escapeHtml(answers.city) : '';
    const state = answers.state ? escapeHtml(answers.state) : '';
    const location = [city, state].filter(Boolean).join(', ') || 'India';
    const gender = escapeHtml(answers.gender || 'Not specified');

    // 2. Professional Credentials & Licensure
    const credentials = escapeHtml(answers.credentials || 'Psychotherapist / Mental Health Professional');
    const experienceYears = answers.yearsOfExperience !== undefined
      ? `${escapeHtml(answers.yearsOfExperience)} years`
      : (data.experienceYears !== undefined ? `${escapeHtml(data.experienceYears)} years` : 'Not specified');
    const issuingBody = escapeHtml(answers.issuingBody || 'Accredited Board / University');
    const rawLicenseNumber = answers.licenseNumber ? String(answers.licenseNumber).trim() : '';
    const licenseNumberDisplay = rawLicenseNumber ? escapeHtml(rawLicenseNumber) : 'Not specified';
    const isRci = String(answers.issuingBody || '').toLowerCase().includes('rci') ||
      String(answers.issuingBody || '').toLowerCase().includes('rehabilitation council of india') ||
      Boolean(answers.rciNumber);
    const rciDisplay = isRci ? 'Yes (RCI Registered)' : 'Not RCI Registered';

    // 3. Clinical Practice & Modalities
    const specialtiesList: string[] = Array.isArray(answers.specialties) && answers.specialties.length > 0
      ? answers.specialties
      : (Array.isArray(answers.broadSpecialtyTags) && answers.broadSpecialtyTags.length > 0
        ? answers.broadSpecialtyTags
        : (Array.isArray(data.specialization) ? data.specialization : (data.specialization ? [String(data.specialization)] : [])));
    const specialtiesDisplay = specialtiesList.length > 0 ? escapeHtml(specialtiesList.join(', ')) : 'General Clinical Psychology';

    const modalitiesList: string[] = Array.isArray(answers.modalities) ? answers.modalities : [];
    const modalitiesDisplay = modalitiesList.length > 0 ? escapeHtml(modalitiesList.join(', ')) : 'Evidence-based Practice';

    const languagesList: string[] = Array.isArray(answers.languages) && answers.languages.length > 0 ? answers.languages : ['English'];
    const languagesDisplay = escapeHtml(languagesList.join(', '));

    const sessionFormatsList: string[] = Array.isArray(answers.sessionFormats) && answers.sessionFormats.length > 0 ? answers.sessionFormats : ['Telehealth (Video)'];
    const sessionFormatsDisplay = escapeHtml(sessionFormatsList.join(', '));

    const fee = answers.feePerSession || answers.perSessionFee;
    const feeDisplay = fee ? `₹${escapeHtml(fee)} per session` : 'Platform Standard';

    // 4. Caseload & Acuity Logistics
    const currentCaseload = answers.currentCapacity !== undefined ? `${escapeHtml(answers.currentCapacity)} clients` : 'Flexible';
    const maxCaseload = answers.maxCapacity !== undefined ? `${escapeHtml(answers.maxCapacity)} clients` : 'Flexible';
    const openingDays = answers.soonestOpeningDays !== undefined ? `Within ${escapeHtml(answers.soonestOpeningDays)} days` : 'Immediate';
    const severityCeiling = answers.severityCeiling !== undefined ? `Level ${escapeHtml(answers.severityCeiling)} of 5` : 'Standard Outpatient';
    const ageGroupsList: string[] = Array.isArray(answers.ageGroups) && answers.ageGroups.length > 0 ? answers.ageGroups : ['Adults (18+)'];
    const ageGroupsDisplay = escapeHtml(ageGroupsList.join(', '));
    const higherAcuityDisplay = answers.higherAcuityInterest === 'Yes'
      ? 'Interested in higher-acuity referral triage'
      : 'Standard outpatient care';

    // 5. Supervision & Declarations
    const supervisionDisplay = answers.supervision?.status
      ? escapeHtml(`${answers.supervision.status}${answers.supervision.format ? ` (${answers.supervision.format})` : ''}`)
      : 'Independent Practice / Direct Care';
    const ethicsConfirmed = answers.ethicsDeclaration ? 'Confirmed' : 'Recorded';
    const backgroundConsent = answers.backgroundCheckConsent ? 'Authorized' : 'Recorded';
    const truthConfirmed = answers.truthfulnessConfirmed ? 'Confirmed' : 'Recorded';

    // 6. Uploaded Documents Ledger (Privacy boundary: NO internal paths, NO bucket URLs, NO raw storage keys)
    const formatCategory = (cat?: string): string => {
      if (!cat) return 'Verification Document';
      const norm = cat.toLowerCase().trim();
      if (norm === 'profile_photo' || norm === 'photo') return 'Profile Photo';
      if (norm === 'degree_certificate' || norm === 'degree') return 'Degree / Qualification Certificate';
      if (norm === 'trauma_certification' || norm === 'trauma_certificate') return 'Trauma-Informed Certification';
      if (norm === 'primary_modality_certificate') return 'Primary Modality Certificate';
      if (norm === 'secondary_modality_certificate') return 'Secondary Modality Certificate';
      if (norm === 'supervision_confirmation' || norm === 'supervision') return 'Supervision Documentation';
      if (norm === 'government_id' || norm === 'identity_proof') return 'Identity Verification Document';
      if (norm === 'license_certificate' || norm === 'rci_certificate') return 'Clinical Licensure / RCI Certificate';
      return norm.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const docItems: Array<{ category: string; filename: string; status: string; sizeFormatted?: string }> = [];
    const seenFilenames = new Set<string>();

    for (const d of rawDocs) {
      if (!d) continue;
      const rawName = String(d.filename || d.name || d.title || '');
      const cleanFilename = rawName ? rawName.split('/').pop()!.split('\\').pop()! : 'verification-document.pdf';
      const category = formatCategory(d.category || d.type);
      const key = `${category}:${cleanFilename}`;
      if (!seenFilenames.has(key)) {
        seenFilenames.add(key);
        const sizeFormatted = typeof d.size === 'number' && d.size > 0
          ? (d.size < 1024 * 1024 ? `${(d.size / 1024).toFixed(1)} KB` : `${(d.size / (1024 * 1024)).toFixed(2)} MB`)
          : undefined;
        docItems.push({
          category,
          filename: cleanFilename,
          status: 'Uploaded (Pending Review)',
          sizeFormatted,
        });
      }
    }

    if (answers.photo && typeof answers.photo === 'object' && answers.photo.filename) {
      const clean = String(answers.photo.filename).split('/').pop()!.split('\\').pop()!;
      const key = `Profile Photo:${clean}`;
      if (!seenFilenames.has(key)) {
        seenFilenames.add(key);
        docItems.push({
          category: 'Profile Photo',
          filename: clean,
          status: 'Uploaded (Pending Review)',
        });
      }
    }

    if (answers.traumaCertificateDoc && typeof answers.traumaCertificateDoc === 'object' && answers.traumaCertificateDoc.filename) {
      const clean = String(answers.traumaCertificateDoc.filename).split('/').pop()!.split('\\').pop()!;
      const key = `Trauma-Informed Certification:${clean}`;
      if (!seenFilenames.has(key)) {
        seenFilenames.add(key);
        docItems.push({
          category: 'Trauma-Informed Certification',
          filename: clean,
          status: 'Uploaded (Pending Review)',
        });
      }
    }

    const docsTableHtml = docItems.length > 0
      ? `<table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 8px;">
          <thead>
            <tr style="background-color: #f1f5f9; text-align: left;">
              <th style="padding: 8px 12px; color: #475569; font-weight: 600; border-bottom: 1px solid #cbd5e1;">Document Category</th>
              <th style="padding: 8px 12px; color: #475569; font-weight: 600; border-bottom: 1px solid #cbd5e1;">Original Filename</th>
              <th style="padding: 8px 12px; color: #475569; font-weight: 600; border-bottom: 1px solid #cbd5e1; text-align: right;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${docItems.map((item, idx) => `
              <tr style="border-bottom: 1px solid #e2e8f0; ${idx % 2 === 1 ? 'background-color: #f8fafc;' : ''}">
                <td style="padding: 8px 12px; color: #0f172a; font-weight: 500;">${escapeHtml(item.category)}</td>
                <td style="padding: 8px 12px; color: #475569; font-family: monospace; font-size: 12px;">${escapeHtml(item.filename)}${item.sizeFormatted ? ` <span style="color: #94a3b8; font-size: 11px;">(${escapeHtml(item.sizeFormatted)})</span>` : ''}</td>
                <td style="padding: 8px 12px; text-align: right;"><span style="background-color: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600;">${escapeHtml(item.status)}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>`
      : `<p style="margin: 0; font-size: 13px; color: #64748b; font-style: italic;">No uploaded verification documents were recorded with this submission.</p>`;

    const contentHtml = `
      <p style="margin: 0 0 12px 0;">Hello <strong>${therapistName}</strong>,</p>
      <p style="margin: 0 0 16px 0; line-height: 1.6;">
        Thank you for submitting your application to join the Ingress Within mental healthcare network. We have safely received your application and uploaded verification records. A full copy of your submitted application is provided below for your records.
      </p>

      <!-- Status Banner -->
      <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 16px 20px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 0; font-weight: 700; color: #1e40af; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Current Status: SUBMITTED / UNDER REVIEW</p>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #1e3a8a; line-height: 1.5;">
          Submitted on <strong>${escapeHtml(formattedSubmittedDate)}</strong>. Our clinical governance and credentialing team is now reviewing your application, qualifications, and verification documents.
        </p>
      </div>

      <!-- Essential Regulatory Disclaimer -->
      <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 18px; margin: 20px 0; font-size: 13px; color: #92400e; line-height: 1.5;">
        <strong>Important Clinical Notice:</strong> Submitting an onboarding application and verification documents does not constitute authorization to practise. Your profile remains private and hidden from prospective clients until clinical verification and administrative approval are finalized.
      </div>

      <h2 style="font-size: 16px; font-weight: 700; color: #132A24; margin: 28px 0 12px 0; padding-bottom: 6px; border-bottom: 2px solid #e2e8f0;">
        Summary of Submitted Application
      </h2>

      <!-- Section 1: Basic Information & Contact -->
      <div style="margin: 16px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f8fafc; padding: 8px 16px; border-bottom: 1px solid #e2e8f0;">
          <h3 style="margin: 0; font-size: 13px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.05em;">1. Basic Information &amp; Contact</h3>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; background-color: #ffffff;">
          <tr><td style="padding: 8px 16px; color: #64748b; width: 35%; border-bottom: 1px solid #f1f5f9;">Full Name:</td><td style="padding: 8px 16px; color: #0f172a; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${therapistName}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Email Address:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${applicantEmail}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Phone Number:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${applicantPhone}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Location:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${location}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b;">Gender:</td><td style="padding: 8px 16px; color: #0f172a;">${gender}</td></tr>
        </table>
      </div>

      <!-- Section 2: Professional Credentials & Education -->
      <div style="margin: 16px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f8fafc; padding: 8px 16px; border-bottom: 1px solid #e2e8f0;">
          <h3 style="margin: 0; font-size: 13px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.05em;">2. Professional Credentials &amp; Licensure</h3>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; background-color: #ffffff;">
          <tr><td style="padding: 8px 16px; color: #64748b; width: 35%; border-bottom: 1px solid #f1f5f9;">Title / Credentials:</td><td style="padding: 8px 16px; color: #0f172a; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${credentials}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Clinical Experience:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${experienceYears}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Licensing / Issuing Body:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${issuingBody}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">License / Registration:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${licenseNumberDisplay}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b;">RCI Registration:</td><td style="padding: 8px 16px; color: #0f172a;">${escapeHtml(rciDisplay)}</td></tr>
        </table>
      </div>

      <!-- Section 3: Clinical Practice & Modalities -->
      <div style="margin: 16px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f8fafc; padding: 8px 16px; border-bottom: 1px solid #e2e8f0;">
          <h3 style="margin: 0; font-size: 13px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.05em;">3. Clinical Practice &amp; Modalities</h3>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; background-color: #ffffff;">
          <tr><td style="padding: 8px 16px; color: #64748b; width: 35%; border-bottom: 1px solid #f1f5f9;">Clinical Specialties:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${specialtiesDisplay}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Therapeutic Modalities:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${modalitiesDisplay}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Languages Spoken:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${languagesDisplay}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Session Formats:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${sessionFormatsDisplay}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b;">Consultation Fee:</td><td style="padding: 8px 16px; color: #0f172a; font-weight: 600;">${feeDisplay}</td></tr>
        </table>
      </div>

      <!-- Section 4: Caseload & Availability -->
      <div style="margin: 16px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f8fafc; padding: 8px 16px; border-bottom: 1px solid #e2e8f0;">
          <h3 style="margin: 0; font-size: 13px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.05em;">4. Caseload &amp; Availability</h3>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; background-color: #ffffff;">
          <tr><td style="padding: 8px 16px; color: #64748b; width: 35%; border-bottom: 1px solid #f1f5f9;">Current Caseload:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${currentCaseload}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Maximum Caseload:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${maxCaseload}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Soonest Opening:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${openingDays}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Severity Ceiling:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${severityCeiling}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Age Groups Served:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${ageGroupsDisplay}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b;">Higher-Acuity Referral:</td><td style="padding: 8px 16px; color: #0f172a;">${escapeHtml(higherAcuityDisplay)}</td></tr>
        </table>
      </div>

      <!-- Section 5: Supervision & Declarations -->
      <div style="margin: 16px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f8fafc; padding: 8px 16px; border-bottom: 1px solid #e2e8f0;">
          <h3 style="margin: 0; font-size: 13px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.05em;">5. Supervision &amp; Declarations</h3>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; background-color: #ffffff;">
          <tr><td style="padding: 8px 16px; color: #64748b; width: 35%; border-bottom: 1px solid #f1f5f9;">Supervision Pathway:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${supervisionDisplay}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Ethics Declaration:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${escapeHtml(ethicsConfirmed)}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Background Check Consent:</td><td style="padding: 8px 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${escapeHtml(backgroundConsent)}</td></tr>
          <tr><td style="padding: 8px 16px; color: #64748b;">Truthfulness Declaration:</td><td style="padding: 8px 16px; color: #0f172a;">${escapeHtml(truthConfirmed)}</td></tr>
        </table>
      </div>

      <!-- Section 6: Uploaded Documents Ledger -->
      <div style="margin: 16px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f8fafc; padding: 8px 16px; border-bottom: 1px solid #e2e8f0;">
          <h3 style="margin: 0; font-size: 13px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.05em;">6. Uploaded Verification Documents</h3>
        </div>
        <div style="padding: 12px 16px; background-color: #ffffff;">
          ${docsTableHtml}
          <p style="margin: 12px 0 0 0; font-size: 12px; color: #64748b; line-height: 1.5;">
            <strong>Document Privacy &amp; Security:</strong> For data security and privacy, sensitive credential and identity files are stored in an encrypted vault and never attached directly to unencrypted emails. You can securely view and manage your uploaded documents by logging in to your <a href="${statusUrl}" style="color: #4E7A66; font-weight: 600; text-decoration: underline;">Application Status Portal</a>.
          </p>
        </div>
      </div>

      <!-- Next Steps & Support -->
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px 20px; margin: 24px 0;">
        <p style="margin: 0 0 8px 0; font-weight: 700; color: #0f172a; font-size: 14px;">Next Steps in the Review Process:</p>
        <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.7;">
          <li><strong>Credential Verification:</strong> Our clinical review board will examine your degree credentials, state licensure, and submitted practice modalities.</li>
          <li><strong>Administrative Review:</strong> Once credential checks are complete, you will receive an email update with your application outcome.</li>
          <li><strong>Practice Activation:</strong> If approved, your account will be activated and you will be invited to configure your availability, Google Calendar integration, and practice settings.</li>
        </ol>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin: 20px 0; font-size: 13px; color: #475569;">
        <p style="margin: 0; font-weight: 600; color: #0f172a;">Need assistance or have corrections?</p>
        <p style="margin: 4px 0 0 0; line-height: 1.5;">
          If you have any questions or need to update your submitted details, please contact our support team at <a href="mailto:${SUPPORT_CONFIG.supportEmail}" style="color: #4E7A66; text-decoration: none; font-weight: 600;">${SUPPORT_CONFIG.supportEmail}</a> or call <strong>${SUPPORT_CONFIG.temporaryContactNumber}</strong>.
        </p>
      </div>
    `;

    const docsTextList = docItems.length > 0
      ? docItems.map((item) => `  - ${item.category}: ${item.filename} [${item.status}]${item.sizeFormatted ? ` (${item.sizeFormatted})` : ''}`).join('\n')
      : '  (No external document files attached with this submission)';

    return {
      subject: 'Your Ingress Within Therapist Application Has Been Received',
      html: renderBaseEmailLayout({
        title: 'Application Received',
        badge: 'Under Review',
        badgeVariant: 'info',
        heading: 'Application Received',
        preheader: `Thank you for applying to Ingress Within. Your application has been safely received and is under clinical review.`,
        contentHtml,
        ctaButton: {
          label: 'View Application Status',
          url: statusUrl,
        },
      }),
      text: `Hello ${rawTherapistName},\n\nThank you for submitting your application to join the Ingress Within mental healthcare network. We have safely received your application and uploaded verification records.\n\n============================================================\nCURRENT APPLICATION STATUS: SUBMITTED / UNDER REVIEW\n============================================================\nSubmitted on: ${formattedSubmittedDate}\nStatus Portal: ${statusUrl}\n\nIMPORTANT CLINICAL NOTICE:\nSubmitting an onboarding application and verification documents does not constitute authorization to practise. Your profile remains private and hidden from prospective clients until clinical verification and administrative approval are finalized.\n\n============================================================\nSUMMARY OF SUBMITTED APPLICATION\n============================================================\n\n1. BASIC INFORMATION & CONTACT\n- Full Name: ${rawTherapistName}\n- Email: ${answers.contact_email || answers.email || data.email || 'Registered account email'}\n- Phone: ${answers.phone || 'Recorded in application'}\n- Location: ${[answers.city, answers.state].filter(Boolean).join(', ') || 'India'}\n- Gender: ${answers.gender || 'Not specified'}\n\n2. PROFESSIONAL CREDENTIALS & LICENSURE\n- Title / Credentials: ${answers.credentials || 'Psychotherapist'}\n- Clinical Experience: ${answers.yearsOfExperience !== undefined ? `${answers.yearsOfExperience} years` : (data.experienceYears !== undefined ? `${data.experienceYears} years` : 'Not specified')}\n- Licensing / Issuing Body: ${answers.issuingBody || 'Accredited Board'}\n- License / Registration: ${answers.licenseNumber || 'Not specified'}\n- RCI Registration: ${isRci ? 'Yes (RCI Registered)' : 'Not RCI Registered'}\n\n3. CLINICAL PRACTICE & MODALITIES\n- Specialties: ${specialtiesList.length > 0 ? specialtiesList.join(', ') : 'General Clinical Psychology'}\n- Therapeutic Modalities: ${modalitiesList.length > 0 ? modalitiesList.join(', ') : 'Evidence-based Practice'}\n- Languages: ${languagesList.join(', ')}\n- Session Formats: ${sessionFormatsList.join(', ')}\n- Consultation Fee: ${fee ? `₹${fee} per session` : 'Platform Standard'}\n\n4. CASELOAD & AVAILABILITY\n- Current Caseload: ${answers.currentCapacity !== undefined ? `${answers.currentCapacity} clients` : 'Flexible'}\n- Maximum Caseload: ${answers.maxCapacity !== undefined ? `${answers.maxCapacity} clients` : 'Flexible'}\n- Soonest Opening: ${answers.soonestOpeningDays !== undefined ? `Within ${answers.soonestOpeningDays} days` : 'Immediate'}\n- Severity Ceiling: ${answers.severityCeiling !== undefined ? `Level ${answers.severityCeiling} of 5` : 'Standard Outpatient'}\n- Age Groups Served: ${ageGroupsList.join(', ')}\n- Higher-Acuity Referral: ${answers.higherAcuityInterest === 'Yes' ? 'Interested' : 'Standard outpatient'}\n\n5. SUPERVISION & DECLARATIONS\n- Supervision: ${answers.supervision?.status || 'Independent Practice'}\n- Ethics Declaration: ${ethicsConfirmed}\n- Background Check: ${backgroundConsent}\n- Truthfulness: ${truthConfirmed}\n\n6. UPLOADED VERIFICATION DOCUMENTS\n${docsTextList}\n\n(Document Privacy Notice: For data security and privacy, sensitive credential and identity files are stored in an encrypted vault and never attached directly to unencrypted emails. You can securely view and manage your uploaded documents after authenticating at ${statusUrl})\n\n============================================================\nNEXT STEPS IN THE REVIEW PROCESS\n============================================================\n1. Credential Verification: Our clinical review board will examine your degree credentials, state licensure, and submitted practice modalities.\n2. Administrative Review: Once credential checks are complete, you will receive an email update with your application outcome.\n3. Practice Activation: If approved, your account will be activated and you will be invited to configure your availability, Google Calendar integration, and practice settings.\n\nNeed assistance or have corrections?\nContact support at:\nEmail: ${SUPPORT_CONFIG.supportEmail}\nPhone: ${SUPPORT_CONFIG.temporaryContactNumber}\n\nView Application Status:\n${statusUrl}\n\nWarm regards,\nThe Ingress Within Clinical Team`,
    };
  },

  therapist_application_approved: (data) => {
    const rawTherapistName = data.therapistName || 'Doctor/Counselor';
    const therapistName = escapeHtml(rawTherapistName);
    const loginUrl = data.loginUrl || 'https://ingresswithin.com/auth?role=therapist';
    const dashboardUrl = data.dashboardUrl || 'https://ingresswithin.com/therapist';
    const supportEmail = escapeHtml(data.supportEmail || SUPPORT_CONFIG.supportEmail);
    const supportPhone = escapeHtml(data.supportPhone || SUPPORT_CONFIG.temporaryContactNumber);

    const contentHtml = `
      <p style="margin: 0 0 16px 0; font-size: 15px;">Hello <strong>${therapistName}</strong>,</p>

      <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #132A24;">
        <strong>Congratulations, and welcome to Ingress Within!</strong>
      </p>

      <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #334155;">
        We're happy to let you know that your therapist application has been approved. Thank you for completing the onboarding and verification process.
      </p>

      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 18px 20px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-weight: 700; color: #166534; font-size: 15px;">Your Therapist Account is Verified &amp; Practice Authorized</p>
        <p style="margin: 0; font-size: 13.5px; color: #15803d; line-height: 1.5;">
          You are now authorized to provide psychotherapy consultations on the Ingress Within platform in accordance with our clinical standards.
        </p>
      </div>

      <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #334155;">
        You can now sign in to your therapist account and continue setting up your professional profile, availability, and practice workflow.
      </p>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 12px 0; font-weight: 700; color: #0f172a; font-size: 14px;">Next Steps for Setting Up Your Practice:</p>
        <ol style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #334155; line-height: 1.8;">
          <li><strong>Log In to Your Therapist Dashboard:</strong> Sign in at <a href="${escapeHtml(loginUrl)}" style="color: #4E7A66; font-weight: 600; text-decoration: underline;">${escapeHtml(loginUrl)}</a> using your registered credentials.</li>
          <li><strong>Connect Google Calendar:</strong> Synchronize your calendar to automatically generate Google Meet consultation links for upcoming client sessions.</li>
          <li><strong>Configure Practice Hours &amp; Buffers:</strong> Set your weekly consultation windows, daily session caps, and appointment buffers.</li>
          <li><strong>Link Payout Details:</strong> Enter your bank account details under the Earnings tab to receive direct session disbursements.</li>
        </ol>
      </div>

      <p style="margin: 16px 0; font-size: 14px; color: #334155; line-height: 1.6;">
        Log in to your therapist dashboard:<br>
        <a href="${escapeHtml(loginUrl)}" style="color: #4E7A66; font-weight: 600; text-decoration: underline; word-break: break-all;">${escapeHtml(loginUrl)}</a>
      </p>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin: 20px 0; font-size: 13px; color: #475569;">
        <p style="margin: 0; font-weight: 600; color: #0f172a;">Need assistance getting started?</p>
        <p style="margin: 6px 0 0 0; line-height: 1.5;">
          If you need any assistance, please contact our support team at <a href="mailto:${supportEmail}" style="color: #4E7A66; text-decoration: none; font-weight: 600;">${supportEmail}</a> or call <strong>${supportPhone}</strong>.
        </p>
      </div>

      <p style="margin: 24px 0 0 0; font-size: 14px; color: #334155; line-height: 1.5;">
        We look forward to having you with us!
      </p>
    `;

    return {
      subject: 'Congratulations! Your Ingress Within therapist application is approved',
      html: renderBaseEmailLayout({
        title: 'Application Approved',
        badge: 'Practice Authorized',
        badgeVariant: 'success',
        heading: 'Congratulations! Your Ingress Within therapist application is approved',
        preheader: 'Congratulations and welcome to Ingress Within! Your therapist application has been approved.',
        contentHtml,
        ctaButton: {
          label: 'Log in to Therapist Dashboard',
          url: loginUrl,
        },
      }),
      text: `Hello ${rawTherapistName},\n\nCongratulations, and welcome to Ingress Within!\n\nWe're happy to let you know that your therapist application has been approved. Thank you for completing the onboarding and verification process.\n\nYour practitioner account has been verified, and clinical practice authorization has been granted on the Ingress Within platform.\n\nYou can now sign in to your therapist account and continue setting up your professional profile, availability, and practice workflow.\n\nNext steps for setting up your practice:\n1. Log in to your therapist dashboard: ${loginUrl}\n2. Connect Google Calendar to synchronize availability and automated Google Meet links.\n3. Configure Practice Hours and weekly session buffers.\n4. Link Payout Details under Earnings to receive direct session honorariums.\n\nLog in to your therapist dashboard:\n${loginUrl}\n\nIf you need any assistance, please contact our support team:\nEmail: ${data.supportEmail || SUPPORT_CONFIG.supportEmail}\nPhone: ${data.supportPhone || SUPPORT_CONFIG.temporaryContactNumber}\n\nWe look forward to having you with us!\n\nWarm regards,\nThe Ingress Within Clinical Team`,
    };
  },

  therapist_application_rejected: (data) => {
    const rawTherapistName = data.therapistName || 'Doctor/Counselor';
    const therapistName = escapeHtml(rawTherapistName);
    const rawRejectionReason = data.rejectionReason || 'Uploaded documentation was incomplete or could not be verified.';
    const rejectionReason = escapeHtml(rawRejectionReason);
    const reviewUrl = data.reviewUrl || 'https://ingresswithin.com/therapist/application/status';

    const contentHtml = `
      <p style="margin: 0 0 12px 0;">Hello <strong>${therapistName}</strong>,</p>
      <p style="margin: 0 0 14px 0;">Thank you for your patience while our clinical review board evaluated your onboarding application.</p>
      <p style="margin: 0 0 16px 0;">After careful examination of the credentials and submission provided, your application was not approved for platform practice at this time.</p>
      
      <div style="background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 16px 20px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 0 0 6px 0; font-weight: 600; color: #9a3412; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Clinical Review Feedback</p>
        <p style="margin: 0; font-size: 14px; color: #7c2d12; line-height: 1.5;">${rejectionReason}</p>
      </div>

      <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569;">
        If your application can be updated with supplementary certificates, revised license details, or updated documentation, you may review your submission and resubmit for reconsideration:
      </p>
    `;

    return {
      subject: 'Update Regarding Your Ingress Within Therapist Application',
      html: renderBaseEmailLayout({
        title: 'Application Review Update',
        badge: 'Application Update',
        badgeVariant: 'warning',
        heading: 'Application Review Update',
        preheader: `Update regarding your Ingress Within therapist application review.`,
        contentHtml,
        ctaButton: {
          label: 'Review Application & Resubmit',
          url: reviewUrl,
        },
      }),
      text: `Hello ${rawTherapistName},\n\nWe have completed the clinical review of your Ingress Within therapist application.\n\nYour application was not approved at this time.\n\nFeedback / Reason:\n${rawRejectionReason}\n\nIf your application can be updated and resubmitted, you can review the requested modifications and resubmit here:\n${reviewUrl}\n\nRespectfully,\nThe Ingress Within Clinical Review Team\ncontactus@ingresswithin.com`,
    };
  },

  feedback_team_notification: (data) => {
    const rawRefCode = data.referenceCode || 'FB-UNKNOWN';
    const refCode = escapeHtml(rawRefCode);
    const rawType = (data.submissionType || 'feedback').toUpperCase().replace('_', ' ');
    const type = escapeHtml(rawType);
    const rawCategory = data.category || 'General';
    const category = escapeHtml(rawCategory);
    const rawSubject = data.subject || 'Feedback submission';
    const subject = escapeHtml(rawSubject);
    const rawDescription = data.description || '';
    const description = escapeHtml(rawDescription);
    const rawContactEmail = data.contactEmail || 'Not provided (Anonymous / Signed-in)';
    const contactEmail = escapeHtml(rawContactEmail);
    const rawPageUrl = data.pageUrl || 'Not specified';
    const pageUrl = escapeHtml(rawPageUrl);
    const adminUrl = data.adminUrl || `https://ingresswithin.com/admin?tab=feedback&ref=${rawRefCode}`;
    const timestamp = data.createdAt ? formatDate(data.createdAt) : formatDate(new Date().toISOString());

    const contentHtml = `
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Reference Code:</strong></td>
          <td style="padding: 6px 0; color: #0f172a; font-family: monospace; font-weight: 600;">${refCode}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;"><strong>Category:</strong></td>
          <td style="padding: 6px 0; color: #0f172a;">${category}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;"><strong>Contact Email:</strong></td>
          <td style="padding: 6px 0; color: #0f172a;">${contactEmail}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;"><strong>Page / Feature:</strong></td>
          <td style="padding: 6px 0; color: #0f172a;">${pageUrl}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;"><strong>Timestamp:</strong></td>
          <td style="padding: 6px 0; color: #0f172a;">${escapeHtml(timestamp)}</td>
        </tr>
      </table>

      <div style="background: #f8fafc; border-left: 4px solid #4E7A66; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
        <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #4E7A66;">Description</p>
        <p style="margin: 0; font-size: 14px; color: #334155; white-space: pre-wrap;">${description}</p>
      </div>

      ${
        data.stepsToReproduce || data.expectedBehavior || data.actualBehavior
          ? `<div style="background: #fff7ed; border-left: 4px solid #ea580c; padding: 16px; border-radius: 6px; margin-bottom: 20px; font-size: 13px;">
        <p style="margin: 0 0 8px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #9a3412;">Diagnostic Bug Details</p>
        ${data.stepsToReproduce ? `<p style="margin: 0 0 6px 0;"><strong>Steps to Reproduce:</strong><br/><span style="white-space: pre-wrap; color: #431407;">${escapeHtml(data.stepsToReproduce)}</span></p>` : ''}
        ${data.expectedBehavior ? `<p style="margin: 0 0 6px 0;"><strong>Expected:</strong> ${escapeHtml(data.expectedBehavior)}</p>` : ''}
        ${data.actualBehavior ? `<p style="margin: 0;"><strong>Actual:</strong> ${escapeHtml(data.actualBehavior)}</p>` : ''}
      </div>`
          : ''
      }
    `;

    return {
      subject: `[${rawType}] ${rawSubject} (${rawRefCode})`,
      html: renderBaseEmailLayout({
        title: `${rawType}: ${rawSubject}`,
        badge: 'User Submission',
        badgeVariant: 'info',
        heading: `${type}: ${subject}`,
        preheader: `[${rawType}] ${rawSubject} (${rawRefCode}) received.`,
        contentHtml,
        ctaButton: {
          label: 'View in Admin Command Center →',
          url: adminUrl,
        },
      }),
      text: `[${rawType}] ${rawSubject} (${rawRefCode})\n\nCategory: ${rawCategory}\nContact: ${rawContactEmail}\nPage: ${rawPageUrl}\nDate: ${timestamp}\n\nDescription:\n${rawDescription}\n\n${data.stepsToReproduce ? `Steps to reproduce:\n${data.stepsToReproduce}\n` : ''}${data.expectedBehavior ? `Expected: ${data.expectedBehavior}\n` : ''}${data.actualBehavior ? `Actual: ${data.actualBehavior}\n` : ''}\n\nView in Admin:\n${adminUrl}`,
    };
  },

  feedback_user_acknowledgement: (data) => {
    const rawRefCode = data.referenceCode || 'FB-UNKNOWN';
    const refCode = escapeHtml(rawRefCode);
    const rawSubject = data.subject || 'Your submission';
    const subject = escapeHtml(rawSubject);
    const type = (data.submissionType || 'feedback').toLowerCase();
    const typeLabel = type === 'bug_report' ? 'bug report' : type === 'issue' ? 'technical report' : 'feedback';

    const contentHtml = `
      <p style="font-size: 14px; color: #475569; margin: 0 0 16px 0;">
        We have received your ${escapeHtml(typeLabel)} regarding <strong>"${subject}"</strong>. Every piece of input is read directly by our team to help improve Ingress Within.
      </p>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Your Reference Number</p>
        <p style="margin: 0; font-size: 18px; font-family: monospace; font-weight: 700; color: #132A24; letter-spacing: 0.05em;">${refCode}</p>
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">Please save this reference code if you need to follow up with us.</p>
      </div>

      <p style="font-size: 13.5px; color: #475569; line-height: 1.6; margin: 0;">
        If you need further assistance or want to provide additional details, you can reply directly to this email or contact us at <a href="mailto:contactus@ingresswithin.com" style="color: #4E7A66; text-decoration: none; font-weight: 600;">contactus@ingresswithin.com</a>.
      </p>
    `;

    return {
      subject: `We received your ${typeLabel} [${rawRefCode}] — Ingress Within`,
      html: renderBaseEmailLayout({
        title: 'Thank you for reaching out',
        badge: 'Feedback Received',
        badgeVariant: 'info',
        heading: 'Thank you for reaching out',
        preheader: `We received your ${typeLabel} [${rawRefCode}] regarding "${rawSubject}".`,
        contentHtml,
      }),
      text: `Hello,\n\nThank you for reaching out to Ingress Within.\n\nWe have received your ${typeLabel} regarding "${rawSubject}".\n\nYour Reference Code: ${rawRefCode}\nPlease keep this reference code for your records.\n\nIf you have any questions or additional details, you can contact us at contactus@ingresswithin.com or +91 89556 05569.\n\nWith appreciation,\nThe Ingress Within Team`,
    };
  },

  smoke_test: (data) => {
    const rawAdminName = data.therapistName || data.adminName || 'Authorized Administrator';
    const adminName = escapeHtml(rawAdminName);
    const statusUrl = data.statusUrl || 'https://ingresswithin.com/admin/emails';

    const contentHtml = `
      <p style="margin: 0 0 12px 0;">Hello <strong>${adminName}</strong>,</p>
      <p style="margin: 0 0 16px 0;">This is a live transactional email dispatched via the centralized MSG91 delivery pipeline using the unified base HTML layout.</p>
      
      <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-weight: 600; color: #166534;">Provider Status: MSG91 API Accepted</p>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #15803d;">Template Engine: Single Reusable Base HTML Layout Active</p>
      </div>

      <p style="font-size: 13px; color: #64748b; margin: 0;">
        This test confirms that your MSG91 sending domain, credentials, and base email layout are operating normally.
      </p>
    `;

    return {
      subject: 'Ingress Within — MSG91 Email Delivery Live Smoke Test',
      html: renderBaseEmailLayout({
        title: 'MSG91 Live Smoke Test',
        badge: 'Diagnostic Test',
        badgeVariant: 'success',
        heading: 'MSG91 Live Smoke Test Dispatch',
        preheader: 'Live diagnostic email sent via the centralized Ingress Within MSG91 email pipeline.',
        contentHtml,
        ctaButton: {
          label: 'Open Email Observability',
          url: statusUrl,
        },
      }),
      text: `Hello ${rawAdminName},\n\nThis is a live transactional email dispatched via MSG91.\nProvider Status: Accepted by MSG91.\n\nOpen Email Observability:\n${statusUrl}\n\nIngress Within Operations`,
    };
  },

  therapist_bulk_broadcast: (data) => {
    const rawName = data.therapistName || data.name || 'Therapist';
    const therapistName = escapeHtml(rawName);
    const rawSubject = (data.subject || 'Platform Announcement for Therapists').trim();
    const rawMessage = (data.message || data.msg || '').trim();

    // Split paragraphs safely and render escaped HTML with line breaks preserved
    const paragraphs = String(rawMessage)
      .split(/\n\n+/)
      .map(p => `<p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.6; color: #334155;">${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`)
      .join('');

    const contentHtml = `
      <p style="margin: 0 0 14px 0; font-size: 15px; color: #334155;">Dear <strong>${therapistName}</strong>,</p>
      ${paragraphs}
      <div style="margin-top: 24px; padding: 14px 16px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.5;">
        <p style="margin: 0 0 4px 0; font-weight: 600; color: #1e293b;">Ingress Within Administrative Communication</p>
        <p style="margin: 0;">This official update was sent to active practitioners on the Ingress Within platform from <a href="mailto:contactus@ingresswithin.com" style="color: #4E7A66; text-decoration: underline;">contactus@ingresswithin.com</a>. If you have questions regarding this announcement, reply directly to this email.</p>
      </div>
    `;

    return {
      subject: `${rawSubject} — Ingress Within`,
      html: renderBaseEmailLayout({
        title: rawSubject,
        badge: 'Therapist Notice',
        badgeVariant: 'info',
        heading: rawSubject,
        preheader: String(rawMessage).slice(0, 120).replace(/\s+/g, ' '),
        contentHtml,
        ctaButton: data.ctaUrl ? {
          label: data.ctaLabel || 'Open Therapist Portal',
          url: data.ctaUrl,
        } : undefined,
      }),
      text: `${rawSubject}\n\nDear ${rawName},\n\n${rawMessage}\n\n---\nIngress Within Administrative Team\ncontactus@ingresswithin.com\n+91 89556 05569`,
    };
  },
};
