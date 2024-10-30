
'use client'
import React, { useEffect, useState } from 'react';
// import { Minus, Plus } from 'lucide-react';
import { LocationInput } from '@/components/ui/LocationInput';
import Counter from '@/components/ui/Counter';
import AuthModeSwitcher from '../auth/AuthModeSwitcher';
import { useUser } from '@/context/authContext';
import { useDisclosure } from '@/hooks/useDisclosure';
import { createClient } from '@/utils/supabase/client';
import { storeRevenueReport } from '@/service/revenueReportService';
import { useRouter } from 'next/navigation';
 

const PropertyCalculator = () => {
  const [location, setLocation] = useState('');
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useUser();
  const { isOpen, onToggle } = useDisclosure();

  const createRevenueReport = async (email) => {
  console.log('Creating revenue report');
  if (loading) return;

  try {
    setLoading(true);
    let dataObject = {
      location,
      bedrooms,
      bathrooms,
    }
    return await storeRevenueReport(dataObject, email);
  } catch (error) {
    console.log(`Error creating revenue report: ${error.message}`);
    throw error;  // Rethrow the error to be handled by the calling function if needed
  } finally {
    setLoading(false);
  }
};

const handleCreateAndRedirectReport = async () => {
  try {
    const revenueReport = await createRevenueReport(user.email);
    router.push(`/revenue-report/${revenueReport.id}`);
  } catch (error) {
    console.log('Error in create and redirect:', error.message);
  }
};

  useEffect(() => {
    if(error) {
      setError(null);
    }
  }
  , [location, bedrooms, bathrooms]);

  return (
    <div className="max-w-3xl mx-auto p-4">
    <AuthModeSwitcher createRevenueReport={createRevenueReport} isOpen={isOpen} onToggle={onToggle} />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 ">
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className="  px-4 py-3">
            <LocationInput
              onLocationSelect={(loc) => setLocation(loc)}
              initialValue={location}
            />
          </div>
          
          <div className="flex items-center justify-between px-4 py-3 gap-3">
            <span className="text-gray-600">
              Bedrooms
            </span>
            <Counter
              value={bedrooms}
              onChange={setBedrooms}
            />
          </div>
          
          <div className="flex items-center justify-between px-4 py-3 gap-3">
            <span className="text-gray-600">
              Bathrooms
            </span>
            <Counter
              value={bathrooms}
              onChange={setBathrooms}
            />
          </div>
          
          <div className="px-4 py-3">
            <button
            
              onClick={() => {
                if (!location) {
                  setError('Please select a location');
                  return
                }
                !user ? onToggle(): handleCreateAndRedirectReport()
              }}
              className={`w-full px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl transition-colors ${loading && 'cursor-not-allowed '} `}
            >
              {
                loading ? 'Creating report...' : 'Create report'
              }
            </button>
          </div>
        </div>
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}
    </div>
  );
};

export default PropertyCalculator;