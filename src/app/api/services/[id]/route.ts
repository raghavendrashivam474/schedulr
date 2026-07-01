import { type NextRequest } from 'next/server'
import { updateServiceSchema } from '@features/services/validation'
import { updateService, deleteService } from '@features/services/services/service.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import {
  successResponse, errorResponse, validationErrorResponse,
  unauthorizedResponse, notFoundResponse, serverErrorResponse,
} from '@utils/api'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const { id } = await params
    const body = await request.json()
    const parsed = updateServiceSchema.safeParse(body)
    if (!parsed.success) {
      const details = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v ?? []])
      )
      return validationErrorResponse(details)
    }
    const service = await updateService(user.id, id, parsed.data)
    return successResponse({ service }, 'Service updated successfully')
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) return notFoundResponse('Service')
      if (error.message.includes('already exists')) return errorResponse(error.message, 409)
    }
    console.error('[UPDATE_SERVICE]', error)
    return serverErrorResponse()
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const { id } = await params
    await deleteService(user.id, id)
    return successResponse(null, 'Service archived successfully')
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return notFoundResponse('Service')
    }
    console.error('[DELETE_SERVICE]', error)
    return serverErrorResponse()
  }
}
