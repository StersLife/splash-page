import { CaptivePortalComponent } from "@/components/captive-portal"

const makeUrl = process.env.NEXT_PUBLIC_MAKE_URL || 'https://hook.us1.make.com/ytgjc3373u413as7bfmeru9scdjmfxap'

export default function Page() {
  return <CaptivePortalComponent makeUrl={makeUrl} />
}