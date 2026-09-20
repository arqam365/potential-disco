// pages/api/getBase64.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getPlaiceholder } from 'plaiceholder';
import nodemailer from 'nodemailer';
type Data = {
    base64?: string;
    error?: string;
};

type TicketRequest = {
    name : string,
    email : string,
    address: string,
    phone: string,
    travellers: number,
    message: string,
    pathname: string | null,
    destinationId: string,
    packageId: string | undefined | null
}


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_SENDER_EMAIL || process.env.NEXT_PUBLIC_SMTP_SENDER_EMAIL,
        pass: process.env.SMTP_SENDER_PASSWORD || process.env.NEXT_PUBLIC_SMTP_SENDER_EMAIL,
    },
});


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'POST') {
        let data : TicketRequest =req.body;
        console.log(data);

        const currentDate = new Date()

        const htmlContent = `
        <p><strong>Timestamp:</strong> ${new Date().toISOString()} (YYYY-MM-DD)</p>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
        <p><strong>MetaData:</strong></p>
        <ul>
            <li><strong>DestinationId:</strong> ${data.destinationId}</li>
            <li><strong>PackageId:</strong> ${data.packageId}</li>
            <li><strong>PageLink:</strong> <a href="packagefy.com${data.pathname}"> <b>Link</b></a></li>
        </ul>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
    `;

        const mailOptions = {
            from : process.env.SMTP_SENDER_EMAIL,
            to: process.env.SMTP_SENDER_EMAIL,
            subject: `[Inquiry Request] ${data.name} ${currentDate.getUTCDate()}-${currentDate.getUTCMonth() + 1}-${currentDate.getUTCFullYear()}`,
            html: htmlContent,
        }


        try {
            // Send email
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ', info.response);
            res.status(200).json({});
        } catch (error) {
            console.error('Error sending email: ', error);
            res.status(500).json({error : 'Server Error'})
        }

    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}