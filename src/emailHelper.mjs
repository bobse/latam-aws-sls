const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class Email {
  constructor(to, from, subject, html) {
    this.to = to || process.env.EMAIL_TO;
    this.from = from || process.env.EMAIL_FROM;
    this.subject = subject || " ";
    this.text = html
      .replace(/<br\s*\/?\s*>/g, "")
      .replace(/<[A-Za-z]+[\s*]+\/>/g, "");
    this.html = html;
  }
  async send() {
    const msg = {
      to: this.to,
      from: this.from,
      subject: this.subject,
      text: this.text,
      html: this.html,
    };
    await sgMail.send(msg);
    return `Message ${this.subject} sent to ${this.to}`;
  }
}

export { Email };
