import { NextResponse } from 'next/server';
import { getApprovedEvents } from '@/lib/services/events';

export async function GET(request: Request) {
  try {
    // Lấy các query params từ URL
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const fromDate = searchParams.get('from_date');
    const toDate = searchParams.get('to_date');

    // Gọi service để lấy dữ liệu
    const result = await getApprovedEvents({
      page,
      limit,
      search: search ? decodeURIComponent(search) : undefined,
      status: status || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    });

    // Trả về kết quả theo cấu trúc chuẩn
    return NextResponse.json({
      code: 200,
      result: {
        data: result.events,
        pagination: result.pagination
      }
    });
  } catch (error: any) {
    console.error('Error in GET /api/events:', error);
    
    // Trả về lỗi theo cấu trúc chuẩn
    return NextResponse.json(
      {
        code: 500,
        message: error.message || 'Có lỗi xảy ra khi lấy danh sách sự kiện'
      },
      { status: 500 }
    );
  }
} 