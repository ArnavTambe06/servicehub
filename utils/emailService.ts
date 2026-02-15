import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: "arnavtambe006@gmail.com",
        pass: "fvaprowskypvzgrv"
    },
});

export const sendBookingConfirmation = async (customerEmail: string, bookingDetails: any) => {
    try {
        const mailOptions = {
            from: "arnavtambe006@gmail.com",
            to: customerEmail,
            subject: 'Booking Confirmation',
            html: `
        <h1>Booking Confirmation</h1>
        <p>Dear valued customer,</p>
        <p>Your booking has been confirmed with the following details:</p>
        <ul>
          <li>Service: ${bookingDetails.service}</li>
          <li>Date: ${bookingDetails.date}</li>
          <li>Time: ${bookingDetails.time}</li>
        </ul>
        <p>Thank you for choosing our services!</p>
      `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
