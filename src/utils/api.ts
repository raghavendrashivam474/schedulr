import { NextResponse } from 'next/server'
import type { ApiSuccess, ApiError } from '@appTypes/index'

export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    { success: true, data, ...(message && { message }) },
    { status }
  )
}

export function errorResponse(
  error: string,
  status: number = 400,
  details?: Record<string, string[]>
): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error, ...(details && { details }) },
    { status }
  )
}

export function validationErrorResponse(
  details: Record<string, string[]>
): NextResponse<ApiError> {
  return errorResponse('Validation failed', 422, details)
}

export function unauthorizedResponse(): NextResponse<ApiError> {
  return errorResponse('Authentication required', 401)
}

export function forbiddenResponse(): NextResponse<ApiError> {
  return errorResponse('Insufficient permissions', 403)
}

export function notFoundResponse(resource: string): NextResponse<ApiError> {
  return errorResponse(resource + ' not found', 404)
}

export function serverErrorResponse(): NextResponse<ApiError> {
  return errorResponse('An unexpected error occurred', 500)
}
