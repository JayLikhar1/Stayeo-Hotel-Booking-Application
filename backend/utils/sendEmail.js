const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"StayEo" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error.message);
    return { success: false, error: error.message };
  }
};

// Booking confirmation email template
const bookingConfirmationEmail = (booking, hotel, user) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed, #2563eb); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: #1a1a2e; padding: 30px; border-radius: 0 0 12px 12px; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #333; }
        .badge { background: #7c3aed; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏨 StayEo</h1>
          <h2>Booking Confirmed!</h2>
        </div>
        <div class="content">
          <p>Hi ${user.name},</p>
          <p>Your booking at <strong>${hotel.name}</strong> has been confirmed.</p>
          <div class="detail-row">
            <span>Booking ID</span>
            <span>${booking._id}</span>
          </div>
          <div class="detail-row">
            <span>Hotel</span>
            <span>${hotel.name}</span>
          </div>
          <div class="detail-row">
            <span>Check-in</span>
            <span>${new Date(booking.checkIn).toDateString()}</span>
          </div>
          <div class="detail-row">
            <span>Check-out</span>
            <span>${new Date(booking.checkOut).toDateString()}</span>
          </div>
          <div class="detail-row">
            <span>Total Amount</span>
            <span>₹${booking.finalAmount}</span>
          </div>
          <br/>
          <p>Thank you for choosing StayEo. Have a wonderful stay!</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = { sendEmail, bookingConfirmationEmail };
