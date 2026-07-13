import { type NextRequest } from 'next/server'
import { getAnalyticsOverview, isValidRange } from '@features/analytics/services/analytics.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import { successResponse, errorResponse, unauthorizedResponse, serverErrorResponse } from '@utils/api'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const range = request.nextUrl.searchParams.get('range') ?? 'month'
    if (!isValidRange(range)) return errorResponse('Invalid range. Use today, week, or month', 400)
    const data = await getAnalyticsOverview(user.id, range)
    return successResponse(data)
  } catch (error) {
    console.error('[ANALYTICS_OVERVIEW]', error)
    return serverErrorResponse()
  }
}
