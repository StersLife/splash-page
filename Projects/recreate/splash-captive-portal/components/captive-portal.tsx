'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  checkoutDate: Date | undefined;
  baseGrantUrl: string;
  userContinueUrl: string;
  nodeMac: string;
  clientIp: string;
  clientMac: string;
}

export function CaptivePortalComponent({ makeUrl }: { makeUrl: string }) {
  console.log({
    makeUrl
  })
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    checkoutDate: undefined,
    baseGrantUrl: "",
    userContinueUrl: "",
    nodeMac: "",
    clientIp: "",
    clientMac: "",
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setFormData(prev => ({
      ...prev,
      baseGrantUrl: decodeURIComponent(searchParams.get("base_grant_url") || ""),
      userContinueUrl: decodeURIComponent(searchParams.get("user_continue_url") || ""),
      nodeMac: searchParams.get("node_mac") || "",
      clientIp: searchParams.get("client_ip") || "",
      clientMac: searchParams.get("client_mac") || "",
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, checkoutDate: date }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!formData.fullName || !formData.email || !formData.phone || !formData.checkoutDate) {
       
      return;
    }
    
    try {
      const response = await fetch(makeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      
      console.log("Form submitted successfully:", formData);
      alert("Thank you for submitting! Redirecting...");
      
      window.location.href = 
        formData.baseGrantUrl +
        "?continue_url=" +
        encodeURIComponent(formData.userContinueUrl);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5f3] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8 space-y-6">
        <div className="text-center">
          <div className="relative mx-auto h-16 w-52">
            <Image
              src="/images/cohosting.png"
              alt="Logo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 208px, 208px"
              priority
            />
          </div>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
              Full Name
            </Label>
            <Input 
              id="fullName" 
              placeholder="John Doe" 
              required 
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
              Email
            </Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="john@example.com" 
              required 
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
              Phone Number
            </Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="+1 (555) 123-4567" 
              required 
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="checkoutDate" className="text-sm font-semibold text-gray-700">
              Checkout Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!formData.checkoutDate && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.checkoutDate ? format(formData.checkoutDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.checkoutDate}
                  onSelect={(date) => {
                    handleDateChange(date);
                    const popoverTrigger = document.querySelector('[data-state="open"]');
                    if (popoverTrigger instanceof HTMLElement) {
                      popoverTrigger.click();
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button 
            className="w-full bg-[#1b6ac9] hover:bg-[#1659a9] text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
            type="submit"
          >
            Connect
          </Button>
        </form>
        <p className="text-xs text-center text-gray-500">
          By connecting, you agree to our{" "}
          <a href="#" className="underline text-[#1b6ac9] hover:text-[#1659a9]">
            Terms and Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="underline text-[#1b6ac9] hover:text-[#1659a9]">
            Privacy Policy
          </a>
          .
        </p>
      </div>
      <div className="mt-8">
        <div className="relative h-8 w-24">
          <Image
            src="/images/cohosting.png"
            alt="StayWifi"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 96px, 96px"
            priority
          />
        </div>
      </div>
    </div>
  )
}