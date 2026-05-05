import React from "react";

type props = {
  title: string;
  description: string;
  iconComponent?: React.ReactNode;
  iconClose?: React.ReactNode;
  event?: (...args: any[]) => void;
};

const GeneralInfoSection = ({ title, description, iconComponent, iconClose, event }: props) => {
  return (
    <div className="Content-1 w-full">
      <div className="Section-header flex w-full mb-5 mt-6">
        <div className="content-center">{iconComponent}</div>
        <div className="ml-3 w-full content-center">
          <div className="flex justify-between h-6 font-inter text-lg text-18 font-semibold text-left">
            <div> {title}</div>
            <div onClick={event} className="ml-8 pl-8 ">
              {iconClose}
            </div>
          </div>
          <div className="text-neutral-600 text-sm pt-1 font-inter">{description}</div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoSection;
