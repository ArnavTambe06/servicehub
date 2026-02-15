const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'arnavtambe006@gmail.com',
        pass: 'fvaprowskypvzgrv'
    }
});

// Email sending endpoint
app.post('/api/send-booking-confirmation', async (req, res) => {
    const { customerEmail, userName, serviceTitle, bookedDate, timeslot } = req.body;

    const mailOptions = {
        from: 'arnavtambe006@gmail.com',
        to: customerEmail,
        subject: 'Booking Confirmation - ServiceHub',
        text: `Hello ${userName},

Your booking for ${serviceTitle} has been accepted!

Booking Details:
Date: ${bookedDate}
Time: ${timeslot}

Thank you for choosing ServiceHub!

Best regards,
ServiceHub Team`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Confirmation email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send confirmation email' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});