import PropertyEstimator from "@/components/features/PropertyEstimator";
import Header from "@/components/shared/Header";
import Image from "next/image";

export default function Home() {
	return (
		<div>
    <Header />
    <div className="flex flex-col items-center px-5 md:px-8 pt-[20px] max-w-full w-[800px] mx-auto">
    <div className="flex flex-col items-center justify-center">
			<div className="flex items-center mt-4 md:mt-8 mb-5 p-1 px-4 py-[7px] rounded-[31px] shadow-[0_0_0_3px_rgba(210,4,125,0.05)] border border-[#fcd4f8] w-[320px] font-GTMedium max-w-full">
				<span className="text-[#f722db] font-medium">New</span>
				<div className="mx-[15px] w-[2px] h-[23px] bg-[#e2e8f0]"></div>
				<span className="text-black font-medium">
					Introducing advanced reports
				</span>
			</div>
        <PropertyEstimator />

			<div className="text-center text-[30px] md:text-[40px] font-GTBold font-bold mb-4 md:mb-8">
				<p>Find your next vacation</p>
				<p className="mt-[-10px]">
					rental investment
					<span className="text-[#f722db]">.</span>
				</p>
			</div>
      </div>

      <div className="w-full h-[500px] mt-24 relative">
              <Image
                src={'/images/companies.png'}
                layout="fill"
                objectFit="contain"
                alt="companies-image"
              />
      </div>

</div>


		</div>
	);
}
