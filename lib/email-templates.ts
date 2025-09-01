// Email templates for different submission statuses
export const emailTemplates = {
  approved: {
    subject: 'Welcome to cwru.wtf! 🎉',
    html: (name: string) => `
      <div style="font-family: monospace; background-color: #000000; color: #ffffff; padding: 20px;">
        <h1 style="color: #10B981;">Welcome to <span style="color: #EC4899;">cwru.wtf</span>, ${name}!</h1>
        
        <p>Congratulations! Your application has been approved and you're now officially part of the <strong>cwru.wtf</strong> community.</p>
        
        <h2 style="color: #10B981;">What's Next?</h2>
        <ul>
          <li>Join our Discord server: [Discord Link]</li>
          <li>Check out our upcoming build sessions</li>
          <li>Browse our project repository</li>
          <li>Start collaborating with fellow makers!</li>
        </ul>
        
        <p>We're excited to see what you'll build with us. Remember: <strong>We Tinker Fearlessly</strong>!</p>
        
        <p style="margin-top: 30px;">
          Best,<br>
          The cwru.wtf Team
        </p>
        
        <hr style="border-color: #374151; margin: 30px 0;">
        <p style="color: #6B7280; font-size: 12px;">
          This email was sent to you because you applied to join cwru.wtf at Case Western Reserve University.
        </p>
      </div>
    `,
    text: (name: string) => `
Welcome to cwru.wtf, ${name}!

Congratulations! Your application has been approved and you're now officially part of the cwru.wtf community.

What's Next?
- Join our Discord server: [Discord Link]
- Check out our upcoming build sessions
- Browse our project repository
- Start collaborating with fellow makers!

We're excited to see what you'll build with us. Remember: We Tinker Fearlessly!

Best,
The cwru.wtf Team
    `
  },
  
  rejected: {
    subject: 'Thank you for your interest in cwru.wtf',
    html: (name: string) => `
      <div style="font-family: monospace; background-color: #000000; color: #ffffff; padding: 20px;">
        <h1>Thank you, ${name}</h1>
        
        <p>Thank you for your interest in joining <strong>cwru.wtf</strong>.</p>
        
        <p>While we weren't able to accept your application at this time, we encourage you to:</p>
        <ul>
          <li>Keep building and learning</li>
          <li>Follow us on social media for updates</li>
          <li>Apply again in the future</li>
        </ul>
        
        <p>The maker community is always growing, and we hope to see you around campus!</p>
        
        <p style="margin-top: 30px;">
          Best,<br>
          The cwru.wtf Team
        </p>
      </div>
    `,
    text: (name: string) => `
Thank you, ${name}

Thank you for your interest in joining cwru.wtf.

While we weren't able to accept your application at this time, we encourage you to:
- Keep building and learning
- Follow us on social media for updates
- Apply again in the future

The maker community is always growing, and we hope to see you around campus!

Best,
The cwru.wtf Team
    `
  }
};

export function getEmailTemplate(status: 'approved' | 'rejected', name: string) {
  const template = emailTemplates[status];
  return {
    subject: template.subject,
    html: template.html(name),
    text: template.text(name)
  };
}
