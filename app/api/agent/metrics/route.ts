import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const MetricSchema = z.object({
  host: z.string().min(1).max(100),
  source: z.enum(['browser', 'agent', 'simulated']),
  cpu: z.number().min(0).max(100),
  ram: z.number().min(0).max(100),
  ramTotalGb: z.number().optional(),
  disk: z.number().min(0).max(100),
  diskTotalGb: z.number().optional(),
  gpu: z.number().min(0).max(100).nullable().optional(),
  gpuName: z.string().optional(),
  timestamp: z.string().optional(),
});

// In-memory ring buffer for live host metrics
const hostMetricsStore: z.infer<typeof MetricSchema>[] = [
  {
    host: 'ip-10-0-4-12.us-east-2.compute.internal',
    source: 'agent',
    cpu: 18.4,
    ram: 64.2,
    ramTotalGb: 64.0,
    disk: 52.1,
    diskTotalGb: 500.0,
    gpu: null,
    gpuName: 'Unavailable / Not detected',
    timestamp: new Date().toISOString(),
  },
];

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    // Token check for agent
    if (!token && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Missing organization agent token' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = MetricSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid metric payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const metricWithTime = {
      ...parsed.data,
      timestamp: parsed.data.timestamp || new Date().toISOString(),
    };

    hostMetricsStore.unshift(metricWithTime);
    if (hostMetricsStore.length > 50) {
      hostMetricsStore.pop();
    }

    return NextResponse.json({
      success: true,
      message: 'Metric ingested successfully',
      storedCount: hostMetricsStore.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    metrics: hostMetricsStore,
    totalCount: hostMetricsStore.length,
  });
}

