import { getAutomationHealth, getRecentReminders } from '@features/reminders/operations/automation-health.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@utils/api'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()

    const [health, recent] = await Promise.all([
      getAutomationHealth(user.id),
      getRecentReminders(user.id, 20),
    ])

    return successResponse({ health, recent })
  } catch (error) {
    console.error('[AUTOMATION_HEALTH]', error)
    return serverErrorResponse()
  }
}
