 import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { MapPin, Search, Bookmark } from 'lucide-react'
import LoadingSteps  from  './loadingStep'


import { Suspense } from "react"

// This is now a Server Component
export default function DashboardLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-teal-600" />
            <span className="text-xl font-semibold">RevenueBnB</span>
          </div>
          <div className="hidden md:flex flex-1 items-center justify-center gap-4 px-8">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="w-full rounded-full border-gray-200 bg-gray-50 pl-10 pr-4"
                placeholder="Loading..."
                type="text"
                disabled
              />
            </div>
            <Badge variant="outline" className="rounded-full border-gray-200 animate-pulse">
              Loading...
            </Badge>
            <Badge variant="outline" className="rounded-full border-gray-200 animate-pulse">
              Loading...
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 lg:grid-cols-2">
        <div className="space-y-6 lg:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
              <h1 className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2" />
            </div>
            <Button size="icon" variant="ghost" className="rounded-full" disabled>
              <Bookmark className="h-5 w-5" />
            </Button>
          </div>

          <Card className="overflow-hidden border-gray-200">
            <CardContent className="p-6 pt-6">
              <h2 className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="mt-6 grid grid-cols-2 gap-8">
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
            <Separator className="my-2" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-[300px] bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6 pt-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                  <p className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-32 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="flex flex-1 flex-col space-y-2">
                      <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                      <div className="mt-auto flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-[5.5rem] h-[calc(100vh-6rem)] overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="relative h-full w-full bg-gray-200 animate-pulse">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-md">
                {/* <div className="text-2xl md:text-2xl font-bold text-teal-600 text-center mb-8">
                  Analyzing Your Property
                </div>
 
                  <LoadingSteps /> */}
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}