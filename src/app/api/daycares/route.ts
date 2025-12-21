import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api';

export async function GET() {
  try {
    // Proxy to backend MongoDB
    const backendUrl = getApiBaseUrl();
    
    const response = await fetch(`${backendUrl}/api/daycares`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    
    // Fallback to static data if backend is unavailable
    try {
      const daycaresData = await import('@/data/daycares.json');
      return NextResponse.json({
        success: true,
        data: daycaresData.default,
        metadata: {
          totalCount: daycaresData.default.length,
          timestamp: new Date().toISOString(),
          note: 'Using static data (backend unavailable)'
        }
      });
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to load daycare data',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  }
}
