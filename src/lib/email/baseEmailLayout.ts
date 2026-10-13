/**
 * Ingress Within — Reusable Base HTML Email Layout & Sanitization
 *
 * Provides a responsive, accessible, bulletproof email layout with consistent
 * Ingress Within branding, high-contrast typography, and legal/clinical footer.
 *
 * Compatible with all major email clients (Gmail, Apple Mail, Outlook, Yahoo)
 * and designed to receive dynamically rendered event content safely.
 */

export interface BaseEmailLayoutOptions {
  /** Page/document title inside <title> */
  title?: string;
  /** Eyebrow status badge text (e.g. "CARE CONNECTION ACCEPTED", "SESSION CONFIRMED") */
  badge?: string;
  /** Badge color styling */
  badgeVariant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  /** Primary heading inside the email card (e.g. "Therapy Session Confirmed") */
  heading: string;
  /** Hidden inbox preview snippet (preheader text) */
  preheader?: string;
  /** Safe HTML body content for the specific transactional event */
  contentHtml: string;
  /** Optional primary action call-to-action button */
  ctaButton?: {
    label: string;
    url: string;
  };
  /** Optional small footnote or operational disclaimer above the legal footer */
  footerNote?: string;
}

/**
 * Escapes unsafe characters to prevent HTML/XSS injection in rendered emails.
 * Handles null/undefined safely.
 */
export function escapeHtml(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const BADGE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  default: { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' },
  info: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  success: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  warning: { bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
  error: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
};

/**
 * Renders the single reusable Ingress Within base HTML layout.
 */
export function renderBaseEmailLayout(options: BaseEmailLayoutOptions): string {
  const currentYear = new Date().getFullYear();
  const title = options.title ? escapeHtml(options.title) : escapeHtml(options.heading);
  const heading = escapeHtml(options.heading);
  const preheader = options.preheader ? escapeHtml(options.preheader) : '';
  const badgeText = options.badge ? escapeHtml(options.badge) : '';
  const badgeStyle = BADGE_STYLES[options.badgeVariant || 'default'] || BADGE_STYLES.default;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>${title}</title>
  <!--[if mso]>
  <style>
    table {border-collapse:collapse;border-spacing:0;margin:0;}
    div, td {padding:0;}
    div {margin:0 !important;}
  </style>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    html, body {
      margin: 0 auto !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    * {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
    }
    table {
      border-spacing: 0 !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
      margin: 0 auto !important;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    a {
      text-decoration: none;
    }
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }
    @media only screen and (max-width: 620px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        padding-left: 12px !important;
        padding-right: 12px !important;
      }
      .email-card {
        padding: 24px 16px !important;
      }
      .email-heading {
        font-size: 20px !important;
      }
      .email-btn {
        width: 100% !important;
        display: block !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
    }
  </style>
</head>
<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f8fafc;">
  ${
    preheader
      ? `<div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
    ${preheader}
    &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy;
  </div>`
      : ''
  }

  <center style="width: 100%; background-color: #f8fafc; padding: 24px 0;">
    <!-- Main Email Container -->
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; width: 600px; max-width: 600px;" class="email-container">
      
      <!-- Brand Header -->
      <tr>
        <td style="padding: 16px 8px 20px 8px; text-align: left;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td>
                <a href="https://ingresswithin.com" target="_blank" style="text-decoration: none;">
                  <span style="font-family: 'Georgia', serif, -apple-system; font-size: 20px; font-weight: 700; letter-spacing: 0.12em; color: #132A24; text-transform: uppercase; display: inline-block;">
                    INGRESS WITHIN
                  </span>
                </a>
                <span style="display: block; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; color: #4E7A66; text-transform: uppercase; margin-top: 3px;">
                  Mental Health & Psychotherapy Practice
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Card Container -->
      <tr>
        <td style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <!-- Top Accent Bar -->
          <div style="background-color: #132A24; height: 4px; width: 100%;"></div>

          <!-- Card Content Body -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="padding: 32px 28px;" class="email-card">
                
                ${
                  badgeText
                    ? `<div style="margin-bottom: 14px;">
                  <span style="display: inline-block; background-color: ${badgeStyle.bg}; color: ${badgeStyle.text}; border: 1px solid ${badgeStyle.border}; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
                    ${badgeText}
                  </span>
                </div>`
                    : ''
                }

                <h1 class="email-heading" style="margin: 0 0 18px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 22px; font-weight: 700; color: #132A24; line-height: 1.35;">
                  ${heading}
                </h1>

                <!-- Dynamic Content Slot -->
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.65; color: #334155;">
                  ${options.contentHtml}
                </div>

                ${
                  options.ctaButton
                    ? `<div style="margin: 30px 0 10px 0; text-align: center;">
                  <!--[if mso]>
                  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${escapeHtml(
                    options.ctaButton.url
                  )}" style="height:44px;v-text-anchor:middle;width:240px;" arcsize="18%" stroke="f" fillcolor="#132A24">
                    <w:anchorlock/>
                    <center style="color:#ffffff;font-family:sans-serif;font-size:14px;font-weight:bold;">${escapeHtml(
                      options.ctaButton.label
                    )}</center>
                  </v:roundrect>
                  <![endif]-->
                  <!--[if !mso]><!-->
                  <a href="${escapeHtml(options.ctaButton.url)}" target="_blank" class="email-btn" style="background-color: #132A24; color: #ffffff; display: inline-block; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 8px; border: 1px solid #132A24;">
                    ${escapeHtml(options.ctaButton.label)}
                  </a>
                  <!--<![endif]-->
                </div>`
                    : ''
                }

                ${
                  options.footerNote
                    ? `<div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b; line-height: 1.5;">
                  ${options.footerNote}
                </div>`
                    : ''
                }

              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Consistent Legal & Clinical Footer -->
      <tr>
        <td style="padding: 24px 12px 12px 12px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; line-height: 1.6; color: #94a3b8;">
          <p style="margin: 0 0 8px 0; color: #64748b;">
            Questions or need assistance? Reach out to our care team directly at
            <a href="mailto:contactus@ingresswithin.com" style="color: #4E7A66; text-decoration: none; font-weight: 600;">contactus@ingresswithin.com</a>
          </p>
          <p style="margin: 0 0 8px 0; color: #94a3b8;">
            <strong>Confidentiality Notice:</strong> This communication may contain confidential or privileged health-related administrative information. If you received this transmission in error, please immediately notify the sender and delete it from your system.
          </p>
          <p style="margin: 0 0 4px 0; color: #94a3b8;">
            Ingress Within &bull; Ingress Healthcare Private Limited &bull; Bangalore &amp; Remote Telehealth &bull;
            <a href="https://ingresswithin.com" target="_blank" style="color: #94a3b8; text-decoration: underline;">ingresswithin.com</a>
          </p>
          <p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 10px;">
            &copy; ${currentYear} Ingress Within. All rights reserved.
          </p>
        </td>
      </tr>

    </table>
  </center>
</body>
</html>`;
}
