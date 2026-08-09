import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  async sendApplicationStatusEmail(
    email: string,
    status: string,
    firstName?: string,
    jobTitle?: string,
    companyName?: string,
  ) {
   const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    const loginLink = `${appBaseUrl}/login`;
    const helpCenterLink = `${appBaseUrl}/help`;
    const unsubscribeLink = `${appBaseUrl}/unsubscribe?email=${encodeURIComponent(email)}`;
    const privacyLink = `${appBaseUrl}/privacy`;

    const statusColor = this.getStatusColor(status);
    const statusEmoji = this.getStatusEmoji(status);
    const statusMessage = this.getStatusMessage(status);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Application Status Update</title>
</head>
<body style="margin:0; padding:0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f4f7fc;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7fc; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.05); overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a3b5d 0%, #2a5f7a 100%); padding:28px 30px; text-align:left;">
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:600; letter-spacing:0.5px;">Job Portal</h1>
              <p style="margin:4px 0 0 0; color:rgba(255,255,255,0.8); font-size:13px; font-weight:300;">
                Your Career Journey Matters
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 30px 24px 30px;">
              <p style="margin:0 0 8px 0; font-size:16px; color:#1e2a3a; line-height:1.6;">
                Hello ${firstName ? firstName : 'there'},
              </p>

              ${jobTitle ? `<p style="margin:0 0 4px 0; font-size:15px; color:#4a5b6e; line-height:1.5;">
                Regarding your application for <strong>${jobTitle}</strong> ${companyName ? `at <strong>${companyName}</strong>` : ''}
              </p>` : ''}

              <p style="margin:16px 0 20px 0; font-size:16px; color:#1e2a3a; line-height:1.6;">
                We’re pleased to provide you with an update on your application status.
              </p>

              <!-- Status Badge -->
              <div style="background-color:#f8fafc; padding:16px 20px; border-radius:10px; border-left:6px solid ${statusColor}; margin-bottom:24px; border:1px solid #eef2f6;">
                <p style="margin:0; font-size:14px; color:#5a6b7e; font-weight:500; text-transform:uppercase; letter-spacing:0.5px;">
                  Current Status
                </p>
                <p style="margin:6px 0 0 0; font-size:20px; color:#1a3b5d; font-weight:700;">
                  ${statusEmoji} ${status}
                </p>
                ${statusMessage ? `<p style="margin:6px 0 0 0; font-size:14px; color:#4a5b6e;">${statusMessage}</p>` : ''}
              </div>

              <p style="margin:0 0 8px 0; font-size:15px; color:#1e2a3a; line-height:1.6;">
                To view the complete details and any next steps, please log in to your Job Portal account.
              </p>

              <!-- CTA Button -->
              <div style="margin:28px 0 20px 0;">
                <a href="${loginLink}" style="display:inline-block; background-color:#2a7de1; color:#ffffff; text-decoration:none; padding:14px 32px; border-radius:8px; font-weight:600; font-size:15px; letter-spacing:0.3px; box-shadow:0 2px 8px rgba(42,125,225,0.3);">
                  Log In to Your Account
                </a>
              </div>

              <div style="background-color:#f8fafc; padding:16px 20px; border-radius:8px; margin:20px 0; border:1px solid #eef2f6;">
                <p style="margin:0; font-size:13px; color:#5a6b7e; line-height:1.5;">
                  <strong>💡 Tip:</strong> Keep your profile updated to get matched with the best opportunities.
                  <a href="${appBaseUrl}/profile" style="color:#2a7de1; text-decoration:underline;">Update Profile</a>
                </p>
              </div>

              <p style="margin:20px 0 0 0; font-size:14px; color:#4a5b6e; line-height:1.6;">
                If you have any questions, feel free to reply to this email or visit our
                <a href="${helpCenterLink}" style="color:#2a7de1; text-decoration:underline;">Help Center</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc; padding:20px 30px; border-top:1px solid #e2e8f0; text-align:center;">
              <p style="margin:0 0 6px 0; font-size:14px; color:#5a6b7e;">
                Thank you for being part of <strong>Job Portal</strong>
              </p>
              <p style="margin:0; font-size:13px; color:#8a9aa8;">
                &copy; ${new Date().getFullYear()} Job Portal. All rights reserved.
              </p>
              <p style="margin:10px 0 0 0; font-size:12px; color:#a0b0be;">
                <a href="${unsubscribeLink}" style="color:#8a9aa8; text-decoration:underline;">Unsubscribe</a> &bull;
                <a href="${privacyLink}" style="color:#8a9aa8; text-decoration:underline;">Privacy Policy</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    `;

    await this.mailerService.sendMail({
      to: email,
      subject: this.getSubjectLine(status, jobTitle),
      html: htmlContent,
    });
  }

  private getStatusColor(status: string): string {
    const statusMap: Record<string, string> = {
      'Applied': '#2a7de1',
      'Under Review': '#f59e0b',
      'Interview Scheduled': '#8b5cf6',
      'Interview Completed': '#6366f1',
      'Shortlisted': '#10b981',
      'Offered': '#059669',
      'Hired': '#0d9488',
      'Rejected': '#ef4444',
      'Withdrawn': '#6b7280',
    };
    return statusMap[status] || '#2a7de1';
  }

  private getStatusEmoji(status: string): string {
   const emojiMap: Record<string, string> = {
      'Applied': '📄',
      'Under Review': '🔍',
      'Interview Scheduled': '📅',
      'Interview Completed': '✅',
      'Shortlisted': '⭐',
      'Offered': '🎯',
      'Hired': '🎉',
      'Rejected': '📩',
      'Withdrawn': '↩️',
    };
    return emojiMap[status] || '📌';
  }

  private getStatusMessage(status: string): string {
   const messageMap: Record<string, string> = {
      'Applied': 'Your application has been received and is being processed.',
      'Under Review': 'Our team is carefully reviewing your qualifications.',
      'Interview Scheduled': 'An interview has been scheduled. Check your dashboard for details.',
      'Interview Completed': 'Thank you for completing the interview. We\'ll update you soon.',
      'Shortlisted': 'Congratulations! You\'ve been shortlisted for the next stage.',
      'Offered': 'We\'re pleased to extend an offer. Check your dashboard for the offer letter.',
      'Hired': 'Welcome aboard! Please check your dashboard for onboarding steps.',
      'Rejected': 'We appreciate your interest. Keep applying for other opportunities.',
      'Withdrawn': 'Your application has been withdrawn as requested.',
    };
    return messageMap[status] || '';
  }

  private getSubjectLine(status: string, jobTitle?: string): string {
    const base = `Application Status Update: ${status}`;
    return jobTitle ? `${base} - ${jobTitle}` : base;
  }
}