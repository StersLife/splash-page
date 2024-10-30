'use server'
import { validateReportId } from '@/utils/revenueReportValidation';
import { createClient } from '@/utils/supabase/server';
import axios from 'axios';

const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  API_KEY:  process.env.NEXT_PUBLIC_API_KEY,
  AUTH_TOKEN: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
};

 
const validateInputParams = (bedrooms, bathrooms, coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    throw new Error('Invalid coordinates format. Expected [longitude, latitude]');
  }

  if (!coordinates[0] || !coordinates[1]) {
    throw new Error('Coordinates cannot be undefined or zero');
  }

  if (!Number.isFinite(bedrooms) || bedrooms < 1) {
    throw new Error('Invalid number of bedrooms');
  }

  if (!Number.isFinite(bathrooms) || bathrooms < 1) {
    throw new Error('Invalid number of bathrooms');
  }
};

/**
 * Fetches annual report and monthly breakdown for a property
 * @param {number} bedrooms - Number of bedrooms
 * @param {number} bathrooms - Number of bathrooms
 * @param {[number, number]} coordinates - Array of [longitude, latitude]
 * @returns {Promise<Object>} The API response data
 * @throws {Error} If the request fails or validation fails
 */
export const fetchAnnualAndMonthlyReport = async (
  bedrooms,
  bathrooms,
  coordinates,
) => {
  try {
    // Validate input parameters
    validateInputParams(bedrooms, bathrooms, coordinates);

    const options = {
      method: 'GET',
      url: API_CONFIG.BASE_URL,
      params: {
        coordinate: `(${coordinates[1]}, ${coordinates[0]})`,
        bedrooms: Math.floor(bedrooms),
        bathrooms: Math.floor(bathrooms),
        no_of_sample: 25,
        apiResponseType: 'estimator_with_comps',
        returnQuartiles: 'true',
      },
      headers: {
        'x-api-key': API_CONFIG.API_KEY,
        'Authorization': API_CONFIG.AUTH_TOKEN,
      },
      timeout: 10000, // 10 second timeout
    };

    const response = await axios.request(options);

    // Check for API error response
    if (response.data?.message?.error_reason) {
      throw new Error(`API Error: ${response.data.message.error_reason}`);
    }

    // Validate response structure
    if (!response.data) {
      throw new Error('API Error: Invalid API response. missing data');
    }

    return response.data;

  } catch (error) {
    // Handle specific types of errors
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }
      if (error.response) {
        throw new Error(`API request failed: ${error.response.status} - ${error.response.statusText}`);
      }
    }

    // Rethrow the error with additional context
    throw new Error(`Failed to fetch annual report: ${error.message}`);
  }
};

 export const storeRevenueReport = async (propertyData, email) => {
  let supabase = await createClient()
  const { data: revenue_reports, error} = await supabase.from('revenue_reports').insert([
    {
      ...propertyData,
      analysis_data: {},
      created_by_email:  email
    },
  ]).select()

  if (error) {
    throw new Error(error.message)
  }
  console.log({
    revenue_reports
  })
  return revenue_reports[0]

}


export const handleReportData = async (reportId) => {
  const supabase = await createClient();
  let existingReport = null; // Declared at function scope

  try {
    // 1. First, validate the report ID format
    validateReportId(reportId);

    // 2. Initialize database connection
    // skipped
    // 3. Check if report exists and get its data
    const { data: reportData, error: fetchError } = await supabase
      .from('revenue_reports')
      .select('*, created_by: created_by_email(email_verified, id)')
      .eq('id', reportId)
      .single();

    // 4. Handle database fetch errors
    if (fetchError?.code === 'PGRST116') {
      throw new Error('Report not found');
    }
    if (fetchError) {
      throw new Error(`Database fetch failed: ${fetchError.message}`);
    }
 
    existingReport = reportData; // Assign to outer scope variable

    // 6. Verify user email status
    if (!existingReport?.created_by?.email_verified) {
      throw new Error('Email not verified');
    }

    // 7. Check if we already have analysis data (success or error)
    if (existingReport.analysis_data && Object.keys(existingReport.analysis_data).length > 0) {
      return existingReport;
    }

    // 8. If no analysis data exists, fetch from API
    const apiData = await fetchAnnualAndMonthlyReport(
      existingReport.bedrooms,
      existingReport.bathrooms,
      existingReport.location.coordinates
    );

    // 9. Update database with new API data
    const { error: updateError } = await supabase
      .from('revenue_reports')
      .update({
        analysis_data: apiData,
      })
      .eq('id', reportId);

    if (updateError) {
      throw new Error(`Database update failed: ${updateError.message}`);
    }

    // 10. Return updated report
    return {
      ...existingReport,
      analysis_data: apiData,
    };

  } catch (error) {
    // Error handling in order of specificity
    
    // 11. Handle specific known errors first
    if (error.message === 'Report not found') {
      return undefined;
    }

    // Only try to use existingReport if it was successfully fetched
    if (existingReport) {
      if (error.message === 'Email not verified') {
        return {
          ...existingReport,
          analysis_data: { error: error.message }
        };
      }
      if(error?.message?.startsWith('API Error:')) {
      // 12. Handle all other errors with existing report
      const { error: updateError } = await supabase
        .from('revenue_reports')
        .update({
          analysis_data: { error: error.message }
        })
        .eq('id', reportId);

      if (updateError) {
        console.error('Failed to store error in database:', updateError);
      }

      // Return existing report with error message
      return {
        ...existingReport,
        analysis_data: { error: error.message }
      };
    }



      return {
        ...existingReport,
        analysis_data: { error: 'Something Went wrong!' }
      };
    } else {
    // 13. If we don't have existingReport, return a basic error object
    return {
      error: 'Report not found',
      id: reportId
    };
    }

    


  }
};