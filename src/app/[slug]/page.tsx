import { notFound } from 'next/navigation'
import { getPublicBusinessBySlug } from '@features/business/services/business.service'
import PublicProfileClient from './PublicProfileClient'

export default async function PublicBusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const reserved = ['overview', 'bookings', 'customers', 'services', 'availability', 'business', 'settings', 'login', 'register', 'book', 'api']
  if (reserved.includes(slug)) notFound()

  const result = await getPublicBusinessBySlug(slug)
  if (!result) notFound()

  return <PublicProfileClient data={result} />
}
