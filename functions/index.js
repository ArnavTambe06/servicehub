const functions = require("firebase-functions/v1"); // Use v1 explicitly
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Firestore trigger: Send email when provider accepts a booking
exports.sendBookingConfirmationEmail = functions.firestore
    .document("bookings/{bookingId}")
    .onUpdate(async (change, context) => {
      const newValue = change.after.data();
      const previousValue = change.before.data();

      if (previousValue.status !== "accepted" &&
      newValue.status === "accepted") {
        const userEmail = newValue.userEmail;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "arnavtambe01@gmail.com",
          },
        });

        const mailOptions = {
          from: "your-email@gmail.com",
          to: userEmail,
          subject: "Booking Confirmation",
          text: `Hello,

Your booking for ${newValue.serviceTitle} with 
${newValue.providerName} on ${newValue.bookedDate} at 
${newValue.timeslot} has been confirmed!

Thank you for choosing ServiceHub.

Best regards,
ServiceHub Team`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log("Booking confirmation email sent to", userEmail);
        } catch (error) {
          console.error("Error sending email:", error);
        }
      }
    });
