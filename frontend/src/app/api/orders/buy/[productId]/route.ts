import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest, { params }: { params: { productId: string } | Promise<{ productId: string }> }) => {
    try {
        const resolvedParams = await Promise.resolve(params);
        const tokenResult = await getAccessToken();
        const accessToken = tokenResult?.accessToken;

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        const nestRes = await fetch(`${apiUrl}/orders/buy/${resolvedParams.productId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });

        if (!nestRes.ok) {
            const errorData = await nestRes.json().catch(() => ({ message: 'Purchase failed' }));
            return NextResponse.json({ error: errorData.message || 'Purchase failed' }, { status: nestRes.status });
        }

        const data = await nestRes.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error('API Route Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
