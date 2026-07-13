import { type NextRequest } from 'next/server'
import { getAnalyticsOverview, isValidRange } from '@features/analytics/services/analytics.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import { successResponse, errorResponse, unauthorizedResponse, serverErrorResponse } from '@utils/api'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const range = request.nextUrl.searchParams.get('range') ?? 'month'
    if (!isValidRange(range)) return errorResponse('Invalid range', 400)
    const { customers } = await getAnalyticsOverview(user.id, range)
    return successResponse({ customers })
  } catch (error) {
    console.error('[ANALYTICS_CUSTOMERS]', error)
    return serverErrorResponse()
  }
}
