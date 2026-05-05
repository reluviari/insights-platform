import Upload from "@src/assets/icons/Upload";
import Image from "next/image";

import Input from "../common/Input";

const UploadBase64 = ({ iconBase64, name, setValue, image }: any) => {
  const updateFieldValue = (value: string) => {
    setValue(name, value);
  };

  return (
    <div className="w-72 h-36 Content self-stretch grow shrink basis-0 px-3  bg-white rounded-lg border border-dashed border-neutral-400 flex-col justify-center items-center gap-1 flex w-42 mt-2">
      <div
        id="Upload image"
        className="LogoText h-28 self-stretch flex-col justify-start items-center gap-3 flex"
      >
        <FeaturedIcon iconBase64={iconBase64} />
        <TextAndSupportingText updateFieldValue={updateFieldValue} image={image} />
      </div>
    </div>
  );
};

const FeaturedIcon = ({ iconBase64 }: any) => {
  return (
    <div className="FeaturedIcon w-10 h-10 rounded-3xl justify-center items-center inline-flex">
      <div className="UploadCloud flex-col justify-start items-start flex" />
      {iconBase64 ? (
        <Image
          alt="icon"
          className="w-10 h-10 rounded-3xl"
          src={iconBase64}
          width={40}
          height={40}
        />
      ) : (
        <Upload />
      )}
    </div>
  );
};

const TextAndSupportingText = ({ updateFieldValue, image }: any) => {
  return (
    <div className="TextAndSupportingText self-stretch h-10 flex-col justify-start items-center gap-1 flex">
      <div className="Action self-stretch justify-center items-start gap-1 inline-flex">
        <Button updateFieldValue={updateFieldValue} image={image} />
        <div className="Text text-neutral-900 tracking-wide text-sm font-normal font-inter flex items-center">
          <span className="">para enviar uma imagem.</span>
        </div>
      </div>
      <div className="SupportingText text-neutral-300 text-center text-xs font-normal font-inter ">
        SVG, PNG, JPG, ou GIF (max. 800x400px)
      </div>
    </div>
  );
};

const Button = ({ image }: any) => {
  return (
    <div className="Button justify-start items-start flex">
      <div className="ButtonBase justify-center items-center gap-2 flex">
        <div className="Text text-primary text-sm font-medium font-inter underline">
          <label htmlFor="file_icon_input" className="cursor-pointer">
            Clique aqui
          </label>
          <Input className="hidden" id="file_icon_input" type={"file"} onChange={image} />
        </div>
      </div>
    </div>
  );
};

export default UploadBase64;
