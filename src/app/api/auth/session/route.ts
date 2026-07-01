import { getAuthenticatedUser } from '@utils/auth-context'
import { successResponse, unauthorizedResponse } from '@utils/api'

export async function GET() {
  const user = await getAuthenticatedUser()

  if (!user) {
    return unauthorizedResponse()
  }

  return successResponse({ user })
}