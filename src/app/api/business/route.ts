import { type NextRequest } from 'next/server'
import { createBusinessSchema, updateBusinessSchema } from '@features/business/validation'
import {
  createBusiness,
  getBusinessByUserId,
  updateBusiness,
} from '@features/business/services/business.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@utils/api'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()

    const body = await request.json()
    const parsed = createBusinessSchema.safeParse(body)

    if (!parsed.success) {
      const details = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [
          k,
          v ?? [],
        ])
      )
      return validationErrorResponse(details)
    }

    const business = await createBusiness(user.id, parsed.data)
    return successResponse({ business }, 'Business created successfully', 201)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('already have')) {
        return errorResponse(error.message, 409)
      }
    }
    console.error('[CREATE_BUSINESS]', error)
    return serverErrorResponse()
  }
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()

    const business = await getBusinessByUserId(user.id)
    return successResponse({ business })
  } catch (error) {
    console.error('[GET_BUSINESS]', error)
    return serverErrorResponse()
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()

    const body = await request.json()
    const parsed = updateBusinessSchema.safeParse(body)

    if (!parsed.success) {
      const details = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [
          k,
          v ?? [],
        ])
      )
      return validationErrorResponse(details)
    }

    const business = await updateBusiness(user.id, parsed.data)
    return successResponse({ business }, 'Business updated successfully')
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return errorResponse(error.message, 404)
      }
    }
    console.error('[UPDATE_BUSINESS]', error)
    return serverErrorResponse()
  }
}