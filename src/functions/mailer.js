const nodemailer = require("nodemailer");

module.exports = {

    sendMailforForgetPassword: async (email, otp) => {
        try {

            const transporter = nodemailer.createTransport({
                service: "outlook",
                auth: {
                    user: "mujeebqayoom@outlook.com",
                    pass: "@M01942406085"
                },
            });

            const mailOptions = {
                from: "mujeebqayoom@outlook.com",
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
    }
}

