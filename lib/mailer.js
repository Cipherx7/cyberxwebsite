import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Configure SMTP transport for Gmail
// Note: To use Gmail, you must configure a Gmail App Password
const getTransporter = () => {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;

    if (!user || !pass) {
        console.warn('GMAIL_USER or GMAIL_PASS environment variables are missing. Mailer will run in mock mode.');
        return null;
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    });
};

/**
 * Reads a template file and replaces template placeholders with actual values
 * Supports simple placeholders like {{key}} and conditional block {{#if key}}...{{/if}}
 */
function compileTemplate(templateName, variables) {
    try {
        const filePath = path.join(process.cwd(), templateName);
        let html = fs.readFileSync(filePath, 'utf8');

        // Replace basic variables
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            html = html.replace(regex, value || '');
        }

        // Process simple block conditionals: {{#if key}} content {{/if}}
        const conditionalRegex = /{{#if\s+(\w+)\s*}}([\s\S]*?){{\/if}}/g;
        html = html.replace(conditionalRegex, (match, conditionKey, content) => {
            const conditionValue = variables[conditionKey];
            if (conditionValue && conditionValue.trim() !== '') {
                // Keep the content but replace any placeholders inside it
                let renderedContent = content;
                for (const [key, value] of Object.entries(variables)) {
                    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                    renderedContent = renderedContent.replace(regex, value || '');
                }
                return renderedContent;
            }
            return ''; // Remove the block if condition is false/empty
        });

        return html;
    } catch (error) {
        console.error(`Failed to compile template ${templateName}:`, error);
        throw new Error(`Template rendering failed: ${error.message}`);
    }
}

/**
 * Sends a generic notification email
 */
export async function sendNotificationEmail({ to, name, title, messageContent, ctaLink, ctaText, highlightTitle, highlightText }) {
    const transporter = getTransporter();
    
    const html = compileTemplate('notification_gmail.html', {
        name,
        title,
        messageContent,
        ctaLink: ctaLink || '',
        ctaText: ctaText || 'View Details',
        highlightTitle: highlightTitle || '',
        highlightText: highlightText || ''
    });

    if (!transporter) {
        console.log(`[MOCK EMAIL] To: ${to} | Subject: ${title}`);
        return { success: true, mock: true };
    }

    const mailOptions = {
        from: `"CyberX Community" <${process.env.GMAIL_USER}>`,
        to,
        subject: title,
        html
    };

    return transporter.sendMail(mailOptions);
}

/**
 * Sends an RSVP confirmation email
 */
export async function sendRsvpEmail({ to, name, eventName, eventDate, anonymousQuestion, joinLink, calendarLink, qrCode }) {
    const transporter = getTransporter();
    
    // Default values if not specified
    const defaultJoinLink = 'https://cyberx.community/events/live';
    const defaultCalendarLink = 'https://calendar.google.com';

    const html = compileTemplate('rsvp_gmail.html', {
        name,
        email: to,
        eventName: eventName || 'How Investigators Find Anyone Online using Open Source Intelligence (OSINT)',
        eventDate: eventDate || '25th July | 3 PM IST (11:30 AM CET)',
        anonymousQuestion: anonymousQuestion || '',
        joinLink: joinLink || defaultJoinLink,
        calendarLink: calendarLink || defaultCalendarLink,
        qrCode: qrCode || ''
    });

    const subject = `RSVP Confirmed: ${eventName || 'CyberX Event'}`;

    if (!transporter) {
        console.log(`[MOCK RSVP EMAIL] To: ${to} | Subject: ${subject}`);
        return { success: true, mock: true };
    }

    const mailOptions = {
        from: `"CyberX Community" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html
    };

    return transporter.sendMail(mailOptions);
}

/**
 * Sends an Application submission confirmation email
 */
export async function sendApplicationConfirmationEmail({ to, fullName, applicationId, submittedDate }) {
    const transporter = getTransporter();
    
    const html = compileTemplate('gmail.html', {
        fullName,
        email: to,
        applicationId,
        submittedDate: submittedDate || new Date().toLocaleDateString('en-US', { dateStyle: 'long' })
    });

    const subject = 'Application Submitted Successfully! - CyberX';

    if (!transporter) {
        console.log(`[MOCK APPLICATION CONFIRMATION] To: ${to} | Subject: ${subject}`);
        return { success: true, mock: true };
    }

    const mailOptions = {
        from: `"CyberX Community" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html
    };

    return transporter.sendMail(mailOptions);
}
