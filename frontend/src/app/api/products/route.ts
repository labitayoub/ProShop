/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        // Attempt to get the Auth0 access token securely server-side
        const tokenResult = await getAccessToken();
        const accessToken = tokenResult?.accessToken;

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized : No Access Token' }, { status: 401 });
        }

        // Read the Form Data (Images + Text) from the frontend client request
        const formData = await req.formData();

        // Forward the exact same Form Data to our NestJS Backend securely
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const nestRes = await fetch(`${apiUrl}/products`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData, // the Fetch API correctly sets the multipart/form-data boundary
        });

        if (!nestRes.ok) {
            const errorText = await nestRes.text();
            return NextResponse.json({ error: errorText }, { status: nestRes.status });
        }

        const data = await nestRes.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        console.error('API Route Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
};
