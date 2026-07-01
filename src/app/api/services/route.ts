import { type NextRequest } from 'next/server'
import { createServiceSchema } from '@features/services/validation'
import { createService, getServices } from '@features/services/services/service.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import {
  successResponse, errorResponse, validationErrorResponse,
  unauthorizedResponse, serverErrorResponse,
} from '@utils/api'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const services = await getServices(user.id)
    return successResponse({ services })
  } catch (error) {
    console.error('[GET_SERVICES]', error)
    return serverErrorResponse()
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const body = await request.json()
    const parsed = createServiceSchema.safeParse(body)
    if (!parsed.success) {
      const details = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v ?? []])
      )
      return validationErrorResponse(details)
    }
    const service = await createService(user.id, parsed.data)
    return successResponse({ service }, 'Service created successfully', 201)
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return errorResponse(error.message, 409)
    }
    console.error('[CREATE_SERVICE]', error)
    return serverErrorResponse()
  }
}
