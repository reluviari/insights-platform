import { Nunito_Sans } from "next/font/google";
import Image from "next/image";
// import Footer from "@src/components/common/footer"; // Comentando por enquanto

const nunito_Sans = Nunito_Sans({ subsets: ["latin"] });

interface ReportNotAvailableProps {
  message: string;
}

export default function ReportNotAvailable({ message }: ReportNotAvailableProps) {
  return (
    <div className="h-screen w-full bg-[#F7F7F7] relative">
      <div className="mt-5 mx-4 h-5/6 bg-[#FFFFFF] border border-[#E5E6EA] rounded flex items-center flex-row justify-center shadow-sm content-center grid">
        <div className="w-full col-start-1 row-start-1 flex justify-center items-center">
          <Image
            src={"/genericReportChart.svg"}
            alt="arrow icon"
            className="ml-4"
            width={295}
            height={239}
            priority
          />
        </div>
        <div
          className="text-lg leading-6 font-normal font-sans px-6 text-[#5C5F61] text-center col-start-1 row-start-2"
          style={nunito_Sans.style}
        >
          {message}
        </div>
      </div>
      {/* <div className="bottom-0 mx-4 absolute">
            <Footer backgroundColor="#F7F7F7" position="left" />
          </div> */}
    </div>
  );
}
