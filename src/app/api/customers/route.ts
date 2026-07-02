import { type NextRequest } from 'next/server'
import { getCustomers } from '@features/customers/services/customer.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@utils/api'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') ?? undefined
    const customers = await getCustomers(user.id, search)
    return successResponse({ customers })
  } catch (error) {
    console.error('[GET_CUSTOMERS]', error)
    return serverErrorResponse()
  }
}
