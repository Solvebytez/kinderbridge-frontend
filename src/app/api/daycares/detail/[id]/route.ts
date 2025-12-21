import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    // Proxy to backend MongoDB
    const backendUrl = getApiBaseUrl();
    
    const response = await fetch(`${backendUrl}/api/daycares/detail/${id}`, {
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
      const daycare = daycaresData.default.find((d: { id: string }) => d.id === id);
      
      if (!daycare) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Daycare not found',
            message: `No daycare found with ID: ${id}`
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: daycare,
        note: 'Using static data (backend unavailable)'
      });
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch daycare details',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  }
}
