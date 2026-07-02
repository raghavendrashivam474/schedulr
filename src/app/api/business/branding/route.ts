import { type NextRequest } from 'next/server'
import { updateBusinessBranding } from '@features/business/services/business.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@utils/api'

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const body = await request.json()
    const business = await updateBusinessBranding(user.id, body)
    return successResponse({ business }, 'Branding updated successfully')
  } catch (error) {
    console.error('[UPDATE_BRANDING]', error)
    return serverErrorResponse()
  }
}
