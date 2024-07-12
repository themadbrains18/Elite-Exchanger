import React, { useContext } from "react";
import Context from "../contexts/context";
import Image from "next/image";

interface activeSection {
  setActive: Function;
  setShow: Function;
}

const AddCard = (props: activeSection) => {
  const { mode } = useContext(Context);
  return (
    <div className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="flex items-center justify-between pb-[10px] md:pb-[15px] border-b border-grey-v-2 dark:border-opacity-[15%] dark:border-beta">
        <p className="sec-title">Add New Card</p>
        <svg
          onClick={() => {
            props.setShow(false), props.setActive(0);
          }}
          version="1.1"
          enableBackground="new 0 0 60.963 60.842"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 60.963 60.842"
          xmlSpace="preserve"
          className="max-w-[18px] cursor-pointer w-full"
        >
          <path
            fill={mode === "dark" ? "#fff" : "#000"}
            d="M59.595,52.861L37.094,30.359L59.473,7.98c1.825-1.826,1.825-4.786,0-6.611
                        c-1.826-1.825-4.785-1.825-6.611,0L30.483,23.748L8.105,1.369c-1.826-1.825-4.785-1.825-6.611,0c-1.826,1.826-1.826,4.786,0,6.611
                        l22.378,22.379L1.369,52.861c-1.826,1.826-1.826,4.785,0,6.611c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                        l22.502-22.502l22.501,22.502c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                        C61.42,57.647,61.42,54.687,59.595,52.861z"
          />
        </svg>
      </div>
      <form onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}>
        <div className="py-30 md:py-10">
          <div className="flex flex-col mb-[15px] md:mb-5 gap-[6px]">
            <label className="sm-text">Number</label>
            <div className="border border-grey-v-1 dark:border-opacity-[15%]  gap-[15px] items-center flex rounded-5 p-[11px] md:p-[15px]">
              <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()}   placeholder="Enter Card Number" className="outline-none max-w-[355px] sm-text w-full bg-[transparent]" />
              <Image src="/assets/payment/visa.svg" width={24} height={24} alt="visa" />
            </div>
          </div>
          <div className="flex md:flex-row flex-col gap-0 md:gap-30">
            <div className="flex flex-col mb-[15px] md:mb-5 gap-[6px] max-w-full md:max-w-[50%] w-full">
              <label className="sm-text">Valid</label>
              <div className="border border-grey-v-1 dark:border-opacity-[15%] rounded-5 p-[11px] md:p-[15px]">
                <input type="date" placeholder="Enter Card Number" className="outline-none max-w-full sm-text w-full bg-[transparent] relative after:absolute after:bg-calenderIcon after:w-[24px] after:h-[24px]  after:left-[92%] md:after:left-[82%] after:right-1 after:-z-10" />
              </div>
            </div>
            <div className="flex flex-col mb-[15px] md:mb-5 gap-[6px] max-w-full md:max-w-[50%] w-full">
              <label className="sm-text">CVV</label>
              <div className="border border-grey-v-1 dark:border-opacity-[15%]  gap-[15px] items-center flex rounded-5 p-[11px] md:p-[15px]">
                <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()}   placeholder="Enter Card Number" className="outline-none max-w-full md:max-w-[131px] sm-text w-full bg-[transparent]" />
                <Image src="/assets/payment/info.svg" width={24} height={24} alt="visa" />
              </div>
            </div>
          </div>
          <div className="flex flex-col  gap-[6px]">
            <label className="sm-text">Card Holder</label>
            <div className="border border-grey-v-1 dark:border-opacity-[15%]  rounded-5 p-[11px] md:p-[15px]">
              <input type="text" placeholder="Card Holder Name" className="outline-none sm-text w-full bg-[transparent]" />
            </div>
          </div>
        </div>
        <button className="solid-button w-full">Proceed</button>
      </form>
    </div>
  );
};

export default AddCard;
