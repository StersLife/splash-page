'use client'

export default function Error({ error }: { error: Error }) {
  return (
    <div className="p-8 bg-red-100 text-red-800">
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <p>{error.message}</p>
    </div>
  )
}
