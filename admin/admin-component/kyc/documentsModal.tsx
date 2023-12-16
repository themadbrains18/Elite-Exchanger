import Image from "next/image";
import React from "react";

interface Details {
  show: boolean;
  setShow: Function;
  data: any;
}

const DocumentsModal = (props: Details) => {
  return (
    <>
      <div
        className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${
          props.show ? "opacity-80 visible" : "opacity-0 invisible"
        }`}
        onClick={() => {
          props.setShow(false);
        }}
      ></div>
      <div
        className={`duration-300 max-w-[calc(100%-30px)] md:max-w-[500px] w-full z-10 fixed rounded-10 md:p-0 p-20 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] ${
          props.show
            ? " translate-y-[-50%] opacity-1 visible"
            : " translate-y-[-55%] opacity-0 invisible"
        }`}
      >
        <div className="flex items-center justify-between  md:px-20 md:py-10">
          <p className="admin-component-heading">Documents</p>
          <svg
            onClick={() => {
              props?.setShow(false);
            }}
            xmlns="http://www.w3.org/2000/svg"
            width={30}
            height={30}
            viewBox="0 0 30 30"
            className="max-w-[30px] cursor-pointer w-full"
          >
            <path
              fill="#9295A6"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.7678 15.0003L22.1341 9.63406C22.6228 9.14531 22.6228 8.35531 22.1341 7.86656C21.6453 7.37781 20.8553 7.37781 20.3666 7.86656L15.0003 13.2328L9.63406 7.86656C9.14531 7.37781 8.35531 7.37781 7.86656 7.86656C7.37781 8.35531 7.37781 9.14531 7.86656 9.63406L13.2328 15.0003L7.86656 20.3666C7.37781 20.8553 7.37781 21.6453 7.86656 22.1341C8.11031 22.3778 8.43031 22.5003 8.75031 22.5003C9.07031 22.5003 9.39031 22.3778 9.63406 22.1341L15.0003 16.7678L20.3666 22.1341C20.6103 22.3778 20.9303 22.5003 21.2503 22.5003C21.5703 22.5003 21.8903 22.3778 22.1341 22.1341C22.6228 21.6453 22.6228 20.8553 22.1341 20.3666L16.7678 15.0003Z"
            />
          </svg>
        </div>
        <div className="flex justify-between flex-wrap p-10 gap-10 md:p-20">
          <div>
            <p className="admin-table-data">Id Front</p>
            <Image
              src={
                process.env.NEXT_PUBLIC_APIURL + "/kyc/" + props?.data?.idfront
              }
              alt="idfront"
              width={200}
              height={200}
            />
          </div>
        <div>
        <p className="admin-table-data">Id Back</p>
        <Image
          src={process.env.NEXT_PUBLIC_APIURL + "/kyc/" + props?.data?.idback}
          alt="idback"
          width={200}
          height={200}
        />
      </div>
      <div>
        <p className="admin-table-data">Statement</p>
        <Image
          src={
            process.env.NEXT_PUBLIC_APIURL + "/kyc/" + props?.data?.statement
          }
          alt="statement"
          width={200}
          height={200}
        />
      </div>
      </div>
      </div>
    </>
  );
};

export default DocumentsModal;
