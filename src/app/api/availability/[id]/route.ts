import { type NextRequest } from 'next/server'
import { deleteHoliday } from '@features/availability/services/availability.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import {
  successResponse, notFoundResponse,
  unauthorizedResponse, serverErrorResponse,
} from '@utils/api'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const { id } = await params
    await deleteHoliday(user.id, id)
    return successResponse(null, 'Holiday removed successfully')
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return notFoundResponse('Holiday')
    }
    console.error('[DELETE_HOLIDAY]', error)
    return serverErrorResponse()
  }
}
