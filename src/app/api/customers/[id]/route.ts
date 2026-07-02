import { type NextRequest } from 'next/server'
import { getCustomerById, updateCustomer, getCustomerHistory } from '@features/customers/services/customer.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import { successResponse, notFoundResponse, unauthorizedResponse, serverErrorResponse } from '@utils/api'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const { id } = await params
    const customer = await getCustomerById(user.id, id)
    if (!customer) return notFoundResponse('Customer')
    const history = await getCustomerHistory(id)
    return successResponse({ customer, history })
  } catch (error) {
    console.error('[GET_CUSTOMER]', error)
    return serverErrorResponse()
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const { id } = await params
    const body = await request.json()
    const customer = await updateCustomer(user.id, id, body)
    return successResponse({ customer }, 'Customer updated successfully')
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return notFoundResponse('Customer')
    }
    console.error('[UPDATE_CUSTOMER]', error)
    return serverErrorResponse()
  }
}
