import { type NextRequest } from 'next/server'
import { businessSettingsSchema } from '@features/business/validation'
import { updateBusinessSettings } from '@features/business/services/business.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import {
  successResponse, validationErrorResponse,
  unauthorizedResponse, serverErrorResponse,
} from '@utils/api'

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const body = await request.json()
    const parsed = businessSettingsSchema.safeParse(body)
    if (!parsed.success) {
      const details = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v ?? []])
      )
      return validationErrorResponse(details)
    }
    const business = await updateBusinessSettings(user.id, parsed.data)
    return successResponse({ business }, 'Settings updated successfully')
  } catch (error) {
    console.error('[UPDATE_SETTINGS]', error)
    return serverErrorResponse()
  }
}
