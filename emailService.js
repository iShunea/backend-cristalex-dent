const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT || 465;

if (!EMAIL_USER || !EMAIL_PASSWORD || !EMAIL_HOST) {
  console.warn('Warning: Email configuration incomplete. Email notifications will be disabled.');
}

const transporter = EMAIL_USER && EMAIL_PASSWORD && EMAIL_HOST
  ? nodemailer.createTransport({
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT),
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      }
    })
  : null;

const sendContactFormNotification = async (formName, formData, submissionId) => {
  if (!transporter) {
    console.warn('Email transporter not configured. Skipping email notification.');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const formFields = Object.entries(formData)
      .map(([key, value]) => `<tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${key}</td><td style="padding: 8px; border: 1px solid #ddd;">${value}</td></tr>`)
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .footer { background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Nouă solicitare de contact</h1>
          </div>
          <div class="content">
            <p><strong>Formular:</strong> ${formName}</p>
            <p><strong>ID Submission:</strong> ${submissionId}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString('ro-RO')}</p>
            
            <h3>Detalii solicitare:</h3>
            <table>
              <thead>
                <tr>
                  <th style="padding: 8px; border: 1px solid #ddd; background-color: #4CAF50; color: white;">Câmp</th>
                  <th style="padding: 8px; border: 1px solid #ddd; background-color: #4CAF50; color: white;">Valoare</th>
                </tr>
              </thead>
              <tbody>
                ${formFields}
              </tbody>
            </table>
          </div>
          <div class="footer">
            <p>Această notificare a fost generată automat de sistemul EasyReserv.</p>
            <p>Pentru a răspunde clientului, folosește adresa de email din formular.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"EasyReserv Contact Form" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: `📩 Nouă solicitare de contact - ${formName}`,
      html: htmlContent,
      text: `Nouă solicitare de contact din ${formName}\n\nDetalii:\n${Object.entries(formData).map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nID: ${submissionId}\nData: ${new Date().toLocaleString('ro-RO')}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully:', info.messageId);
    
    return { 
      success: true, 
      messageId: info.messageId,
      message: 'Email notification sent successfully' 
    };
  } catch (error) {
    console.error('Error sending email notification:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Failed to send email notification' 
    };
  }
};

const verifyEmailConnection = async () => {
  if (!transporter) {
    return { success: false, message: 'Email transporter not configured' };
  }

  try {
    await transporter.verify();
    console.log('✅ Email server connection verified successfully');
    return { success: true, message: 'Email server ready' };
  } catch (error) {
    console.error('❌ Email server connection failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendContactFormNotification,
  verifyEmailConnection,
  transporter
};
