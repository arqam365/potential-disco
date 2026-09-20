// pages/api/getBase64.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getPlaiceholder } from 'plaiceholder';

type Data = {
    base64?: string;
    error?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'POST') {
        const { imageUrl } = req.body;
        if (typeof imageUrl !== 'string') {
            res.status(400).json({ error: 'Invalid image URL provided.' });
            return;
        }

        try {
            const buffer = await fetch(imageUrl).then(async (res) =>
                Buffer.from(await res.arrayBuffer())
            );
            const { base64 } = await getPlaiceholder(buffer);

            console.log(base64, typeof base64)

            res.status(200).json({ base64 });
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate base64 image.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}