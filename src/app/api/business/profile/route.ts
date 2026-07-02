import { type NextRequest } from 'next/server'
import { updateBusinessProfile } from '@features/business/services/business.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@utils/api'

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const body = await request.json()
    const business = await updateBusinessProfile(user.id, body)
    return successResponse({ business }, 'Profile updated successfully')
  } catch (error) {
    console.error('[UPDATE_PROFILE]', error)
    return serverErrorResponse()
  }
}
