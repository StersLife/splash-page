import { handleReportData } from "@/service/revenueReportService";

// Prevent page from being statically optimized
export const dynamic = 'force-dynamic';

async function ReportPage({ params: paramsPromise }) {
  // Await the params object
  const params = await paramsPromise;
    try {
    const report = await handleReportData(params.id);
console.log({
  report
})
 
 
    if(!report || report.error === 'Report not found' || report.analysis_data.error ===  'Email not verified') {
      return(
        <div className="max-w-2xl mx-auto my-8 p-4  border rounded-lg">
          <h2 className="text-lg font-semibold text-center  mb-2">
             Data not available for this report
          </h2>

        </div>
        
      )
    }

    // If there's an error in the analysis data, show error alert
    if (report?.analysis_data?.error) {
      return (
        <div className="max-w-2xl mx-auto my-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Error Fetching Report Data
          </h2>
          <p className="text-red-700">
            {report.analysis_data.error}
          </p>
        </div>
      );
    }

    // If no report or no analysis data, show error
    if (!report || !report.analysis_data) {
      return (
        <div className="max-w-2xl mx-auto my-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Report Not Found
          </h2>
          <p className="text-red-700">
            The requested report could not be found or has no data.
          </p>
        </div>
      );
    }

    // Render successful report data
    return (
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">
              Revenue Report
            </h1>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Property Details
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>Bedrooms: {report.bedrooms}</p>
                  <p>Bathrooms: {report.bathrooms}</p>
                  <p>Location: {report.location.address}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Analysis Results
                </h3>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm text-gray-700">
                  {JSON.stringify(report.analysis_data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // Handle any unexpected errors
    return (
      <div className="max-w-2xl mx-auto my-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-800 mb-2">
          Unexpected Error
        </h2>
        <p className="text-red-700">
          An unexpected error occurred while loading the report.
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-2 text-sm bg-red-100 p-2 rounded">
              {error.message}
            </pre>
          )}
        </p>
      </div>
    );
  }
}
export default ReportPage;