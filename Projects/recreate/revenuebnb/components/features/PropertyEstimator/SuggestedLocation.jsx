'use client'

import React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css/bundle'
import 'swiper/css/navigation'
import { carouselData } from '@/constants'
import useMediaQuery from '@/hooks/useMediaQuery'

// Custom arrow component
const CustomNextArrow = () => (
  <div
    className="swiper-button-next custom-button shadow-md"
    style={{
      boxShadow: '0px 3px 3px 0px rgba(158, 157, 164, 0.3)',
    }}
  >
    Next
  </div>
)

const CustomPrevArrow = () => (
  <div
    className="swiper-button-prev custom-button shadow-md"
    style={{
      boxShadow: '0px 3px 3px 0px rgba(158, 157, 164, 0.3)',
    }}
  >
    Prev
  </div>
)

const isEven = (n) => n % 2 === 0

export const SuggestedLocation = ({ 
  setLocation, 
  setPropertyCoordinates, 
}) => {
  const isLessThan680 = useMediaQuery('(max-width: 680px)')
  return (
    <div className="w-full max-w-screen-lg mx-auto">
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={isLessThan680 ? 2 : 3}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        onSwiper={(swiper) => {
          swiper.params.navigation.nextEl = '.swiper-button-next';
          swiper.params.navigation.prevEl = '.swiper-button-prev';
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        {carouselData.map((el, idx) => (
          <SwiperSlide key={idx}>
            <div className={`${isLessThan680 ? 'w-[130px]' : 'w-[150px]'} mx-2`}>
              <div
                onClick={() => {
                  setLocation(el.text)
                  setPropertyCoordinates(el.coordinates)
                }}
                className={`cursor-pointer pt-${isEven(idx) ? '12' : '0'}`}
              >
                <Image
                  src={el.imageUrl}
                  alt={`Image of ${el.text}`}
                  width={250}
                  height={170}
                  className="rounded-lg object-cover"
                />
                <p
                  className="text-center mt-2 font-medium text-xs"
                  style={{ fontFamily: 'GTMedium' }}
                >
                  Search location
                </p>
                <p
                  className="text-center font-semibold text-sm md:text-base"
                  style={{ fontFamily: 'GTBold' }}
                >
                  {el.text}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <CustomPrevArrow />
      <CustomNextArrow />
    </div>
  )
}
