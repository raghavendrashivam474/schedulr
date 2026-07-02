'use client'

import { useState, useEffect, useRef } from 'react'
import DashboardLayout from '@components/dashboard/DashboardLayout'
import type { Business } from '@appTypes/index'

export default function SharePage() {
  const [business, setBusiness] = useState<Business | null>(null)
  const [slug, setSlug] = useState('')
  const [slugError, setSlugError] = useState('')
  const [slugSaving, setSlugSaving] = useState(false)
  const [slugMessage, setSlugMessage] = useState('')
  const [copied, setCopied] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const qrRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    void fetch('/api/business').then((r) => r.json()).then((data: { success: boolean; data: { business: Business } }) => {
      if (data.success && data.data.business) {
        setBusiness(data.data.business)
        setSlug(data.data.business.slug ?? '')
      }
    })
  }, [])

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const profileUrl = business?.slug ? appUrl + '/' + business.slug : appUrl + '/book/' + business?.id
  const bookingUrl = appUrl + '/book/' + business?.id

  async function generateQR() {
    try {
      const QRCode = (await import('qrcode')).default
      const url = await QRCode.toDataURL(profileUrl, { width: 300, margin: 2 })
      setQrUrl(url)
    } catch (error) {
      console.error('QR generation failed', error)
    }
  }

  async function copyToClipboard(text: string, label: string) {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  async function handleSlugSave(e: React.FormEvent) {
    e.preventDefault()
    setSlugError('')
    setSlugMessage('')
    setSlugSaving(true)
    try {
      const res = await fetch('/api/business/slug', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSlugError(data.error)
      } else {
        setBusiness(data.data.business)
        setSlugMessage('URL updated successfully')
      }
    } finally {
      setSlugSaving(false)
    }
  }

  if (!business) return <DashboardLayout><p className="p-8 text-sm text-gray-500">Loading...</p></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Share Your Business</h1>
          <p className="mt-1 text-sm text-gray-600">Share these links with customers to let them book appointments</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-semibold text-gray-900">Your Business URL</h2>
          <p className="mb-3 text-xs text-gray-400">Choose a memorable URL for your business profile</p>
          <form onSubmit={handleSlugSave} className="flex gap-2">
            <div className="flex flex-1 items-center rounded-md border border-gray-300 px-3 py-2 text-sm">
              <span className="text-gray-400 mr-1">{appUrl}/</span>
              <input value={slug} onChange={(e) => setSlug(e.target.value)}
                placeholder="your-business"
                className="flex-1 focus:outline-none text-gray-900" />
            </div>
            <button type="submit" disabled={slugSaving}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {slugSaving ? 'Saving...' : 'Save'}
            </button>
          </form>
          {slugError && <p className="mt-2 text-sm text-red-600">{slugError}</p>}
          {slugMessage && <p className="mt-2 text-sm text-green-600">{slugMessage}</p>}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Share Links</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md bg-gray-50 px-4 py-3">
              <div>
                <div className="text-xs font-medium text-gray-500">Profile Page</div>
                <div className="text-sm text-blue-600 truncate max-w-xs">{profileUrl}</div>
              </div>
              <button onClick={() => copyToClipboard(profileUrl, 'profile')}
                className="text-xs font-medium text-gray-600 hover:text-gray-900 ml-2">
                {copied === 'profile' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="flex items-center justify-between rounded-md bg-gray-50 px-4 py-3">
              <div>
                <div className="text-xs font-medium text-gray-500">Direct Booking Link</div>
                <div className="text-sm text-blue-600 truncate max-w-xs">{bookingUrl}</div>
              </div>
              <button onClick={() => copyToClipboard(bookingUrl, 'booking')}
                className="text-xs font-medium text-gray-600 hover:text-gray-900 ml-2">
                {copied === 'booking' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-base font-semibold text-gray-900">QR Code</h2>
          <p className="mb-4 text-sm text-gray-500">Generate a QR code to print on business cards or posters</p>
          <button onClick={generateQR}
            className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900">
            Generate QR Code
          </button>
          {qrUrl && (
            <div className="mt-4">
              <img ref={qrRef} src={qrUrl} alt="QR Code" className="rounded-md border border-gray-200" />
              <a href={qrUrl} download="schedulr-qr.png"
                className="mt-2 inline-block text-sm text-blue-600 hover:underline">
                Download QR Code
              </a>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
