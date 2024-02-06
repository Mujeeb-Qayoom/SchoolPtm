const nodemailer = require("nodemailer");

module.exports = {

    sendMailforForgetPassword: async (email, otp) => {
        try {

            const transporter = nodemailer.createTransport({
                service: "outlook",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                },
            });

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "OTP Verification",
                text: `Hi, your OTP is: ${otp}`,
            }

            const info = await transporter.sendMail(mailOptions);
            console.log(info);

            if (info) {
                return info;
            }
            return false;
        }
        catch (err) {
            return err;
        }
    },

    sendMailforBookApppointment: async (email) => {
        try {

            const transporter = nodemailer.createTransport({
                service: "outlook",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                },
            });

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "appoitment booked",
                text: `appointment booked on `,
            }

            const info = await transporter.sendMail(mailOptions);
            console.log(info);

            if (info) {
                return info;
            }
            return false
        }
        catch (err) {
            return err;
        }
    },
}

