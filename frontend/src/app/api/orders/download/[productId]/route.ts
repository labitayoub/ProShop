import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { productId: string } | Promise<{ productId: string }> }) => {
    try {
        const resolvedParams = await Promise.resolve(params);
        const tokenResult = await getAccessToken();
        const accessToken = tokenResult?.accessToken;

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        // Call the NestJS backend to retrieve the file stream
        const nestRes = await fetch(`${apiUrl}/orders/download/${resolvedParams.productId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });

        if (!nestRes.ok) {
            return NextResponse.json({ error: 'Failed to download asset' }, { status: nestRes.status });
        }

        // Proxy the precise headers from NestJS (Content-Disposition, Content-Type)
        const headers = new Headers();
        if (nestRes.headers.get('content-type')) {
            headers.set('Content-Type', nestRes.headers.get('content-type') as string);
        }
        if (nestRes.headers.get('content-disposition')) {
            headers.set('Content-Disposition', nestRes.headers.get('content-disposition') as string);
        }

        // Stream the body to the client
        return new NextResponse(nestRes.body, {
            status: 200,
            headers,
        });
    } catch (error: any) {
        console.error('API Route Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
