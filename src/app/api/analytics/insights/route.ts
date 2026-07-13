import { type NextRequest } from 'next/server'
import { getAnalyticsInsights, isValidRange } from '@features/analytics/services/analytics.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import { successResponse, errorResponse, unauthorizedResponse, serverErrorResponse } from '@utils/api'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const range = request.nextUrl.searchParams.get('range') ?? 'month'
    if (!isValidRange(range)) return errorResponse('Invalid range', 400)
    const insights = await getAnalyticsInsights(user.id, range)
    return successResponse({ insights })
  } catch (error) {
    console.error('[ANALYTICS_INSIGHTS]', error)
    return serverErrorResponse()
  }
}
