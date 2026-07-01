import { type NextRequest } from 'next/server'
import { prisma } from '@lib/prisma'
import { successResponse, notFoundResponse, serverErrorResponse } from '@utils/api'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await params

    const business = await prisma.business.findUnique({
      where: { id: businessId, status: 'ACTIVE' },
    })

    if (!business) return notFoundResponse('Business')

    const services = await prisma.service.findMany({
      where: { businessId, status: 'ACTIVE' },
      orderBy: { name: 'asc' },
    })

    return successResponse({ business, services })
  } catch (error) {
    console.error('[PUBLIC_BUSINESS]', error)
    return serverErrorResponse()
  }
}
