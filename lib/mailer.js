const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    }
})

async function mailer(receiver) {
    let link = 'http://localhost:3069/users/activate/' + receiver.dataValues.id
    const info = await transporter.sendMail({
        from: process.env.MAILER_USER,
        to: receiver.dataValues.email,
        subject: 'activate user account',
        html: `<a href="${link}">Click Here</a>`
    })

    console.log("Message sent: %s", info.messageId);
}

module.exports = { mailer }