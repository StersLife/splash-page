import EstimatedRevenue from "@/components/features/RevenueReport/EstimatedRevenue";
import Header from "@/components/features/RevenueReport/Header";
import LargeMap from "@/components/features/RevenueReport/LargeMap";
import ListingsMap from "@/components/features/RevenueReport/ListingsMap";
import MonthlyBreakpointsChart from "@/components/features/RevenueReport/MonthlyBreakpointsChart";
import { SectionHeader } from "@/components/features/RevenueReport/SectionHeader";
import SimilarListing from "@/components/features/RevenueReport/SimilarListing";
import ViewModeToggle from "@/components/features/RevenueReport/ViewModeToggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { handleReportData } from "@/service/revenueReportService";

// Prevent page from being statically optimized
export const dynamic = "force-dynamic";

async function ReportPage({ params: paramsPromise }) {
	// Await the params object
	const params = await paramsPromise;
	try {
		const report = await handleReportData(params.id);
		console.log({
			report,
		});

		if (
			!report ||
			report.error === "Report not found" ||
			report.analysis_data.error === "Email not verified"
		) {
			return (
				<div className="max-w-2xl mx-auto my-8 p-4  border rounded-lg">
					<h2 className="text-lg font-semibold text-center  mb-2">
						Data not available for this report
					</h2>
				</div>
			);
		}

		// If there's an error in the analysis data, show error alert
		if (report?.analysis_data?.error) {
			return (
				<div className="max-w-2xl mx-auto my-8 p-4 bg-red-50 border border-red-200 rounded-lg">
					<h2 className="text-lg font-semibold text-red-800 mb-2">
						Error Fetching Report Data
					</h2>
					<p className="text-red-700">{report.analysis_data.error}</p>
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

		let last_12_months_summary =
			report.analysis_data.message.last_12_months_summary;
		let monthly_summary = report.analysis_data.message.monthly_summary;
		let listings = report.analysis_data.message.comps;

		return (
			<div className="min-h-screen bg-gray-50">
				<Header
					bathrooms={report.bathrooms}
					bedrooms={report.bedrooms}
					address={report.location.address}
				/>
				<main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 md:grid-cols-2">
					<div className="space-y-6">
						<SectionHeader
							address={report.location.address}
							bathrooms={report.bathrooms}
							bedrooms={report.bedrooms}
						/>
						<Card className="overflow-hidden border-gray-200 bg-white">
							<CardContent className="p-6">
								<EstimatedRevenue
									averageHost={last_12_months_summary.average}
									professionalHost={
										last_12_months_summary.quartiles["75th_percentile"]
									}
								/>
							</CardContent>
							<Separator className="my-2 bg-gray-300" />
							<CardContent className="p-6 px-0 pt-0">
								<div className="mt-4 h-[400px]">
									<MonthlyBreakpointsChart monthlySummary={monthly_summary} />
								</div>
							</CardContent>
						</Card>


								<SimilarListing report={report} listings={listings} />
	
					</div>
				
		  <LargeMap report={report} compareableProperty={listings} />
 
				</main>

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
					{process.env.NODE_ENV === "development" && (
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
