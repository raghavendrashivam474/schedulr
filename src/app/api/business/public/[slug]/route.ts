import { type NextRequest } from 'next/server'
import { getPublicBusinessBySlug } from '@features/business/services/business.service'
import { successResponse, notFoundResponse, serverErrorResponse } from '@utils/api'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const result = await getPublicBusinessBySlug(slug)
    if (!result) return notFoundResponse('Business')
    return successResponse(result)
  } catch (error) {
    console.error('[PUBLIC_BUSINESS_SLUG]', error)
    return serverErrorResponse()
  }
}
