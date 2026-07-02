import { type NextRequest } from 'next/server'
import { updateBusinessSlug } from '@features/business/services/business.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import { successResponse, errorResponse, unauthorizedResponse, serverErrorResponse } from '@utils/api'

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const body = await request.json()
    const { slug } = body as { slug: string }
    if (!slug || slug.trim().length < 2) {
      return errorResponse('Slug must be at least 2 characters', 400)
    }
    const business = await updateBusinessSlug(user.id, slug)
    return successResponse({ business }, 'Business URL updated successfully')
  } catch (error) {
    if (error instanceof Error && error.message.includes('already taken')) {
      return errorResponse(error.message, 409)
    }
    console.error('[UPDATE_SLUG]', error)
    return serverErrorResponse()
  }
}
