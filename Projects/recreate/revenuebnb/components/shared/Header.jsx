import React from 'react'
import AuthButton from '@/components/shared/AuthButton'
import RevenueHistoryDropdown from './RevenueHistoryDropdown'

const Header = () => {
  return (
    <div className="flex items-center justify-between px-[30px] py-[10px] font-medium shadow-[0_1px_6px_rgba(158,157,164,0.21)]">
  <div>
    <span>
      revenue<strong>bnb</strong>
    </span>
  </div>
  <div>
    <RevenueHistoryDropdown />
    <AuthButton />
  </div>
</div>
  )
}

export default Header