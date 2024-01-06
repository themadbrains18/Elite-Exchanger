import React, { useState } from "react";
import IconsComponent from "../snippets/icons";
import Image from "next/image";
import ReferPopup from "../snippets/referPopup";
import Link from "next/link";
import { toast } from 'react-toastify';
import moment from 'moment';

interface fixSection {
  fixed?: boolean;
  show?: number;
  setShow?: Function | any;
  session?: any;
  referalList?: any
}

const Referal = (props: fixSection) => {
  const [show, setShow] = useState(false)
  const [referList, setReferList] = useState(props.referalList);

// console.log(referList,'=================referList use state');

  let referalSteps = [
    {
      image: "link",
      text: "Share your referral link with friends",
    },
    {
      image: "gift",
      text: "Invite friends to sign up and accumulatively deposit more than $50   ",
    },
    {
      image: "usdt",
      text: "Receive 100 USDT trading fee rebate voucher each",
    },
  ];

  return (
    <>
      <div
        className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show ? "opacity-80 visible" : "opacity-0 invisible"
          }`}
      ></div>
      <section
        className={`${props.show == 5 && "!left-[50%]"} ${props.fixed &&
          "duration-300 fixed pt-[145px] top-0 left-[160%] translate-x-[-50%] bg-off-white dark:bg-black-v-1 z-[6] w-full h-full pb-[20px] lg:dark:bg-d-bg-primary overflow-y-scroll"
          } p-5 lg:p-40 `}
      >
        {/* only for mobile view */}
        <div className="lg:hidden flex dark:shadow-none shadow-lg shadow-[#c3c3c317] fixed top-0 left-0  w-full  rounded-bl-[20px] rounded-br-[20px]  z-[6] dark:bg-omega bg-white  h-[105px]">
          <div className="grid grid-cols-[auto_1fr_auto] m-auto w-full px-[20px] items-center">
            <div
              onClick={() => {
                props.setShow(0);
              }}
            >
              <IconsComponent type="backIcon" hover={false} active={false} />
            </div>
            <div className="text-center">
              <p className="sec-title">Refer Friends</p>
            </div>
            <div>
              <IconsComponent type="editIcon" hover={false} active={false} />
            </div>
          </div>
        </div>

        <div className="max-[1023px] dark:bg-omega bg-white  rounded-[10px]">
          <div className="lg:pb-[50px] border-b p-20 border-[transparent] lg:border-grey-v-2 lg:dark:border-[#e9eaf026]">
            <p className="sec-title lg:px-0  py-20 mb-[20px] border-b-[0.5px]  border-grey-v-2 dark:border-[#e9eaf026] lg:border-[transparent]">
              Refer Friends
            </p>
            <div className="flex xl:flex-row flex-col gap-10 lg:gap-[30px] mb-30 lg:mt-0 mt-20">
              <div className=" w-full">
                <label className="sm-text">Lite Referral ID</label>
                <div className="mt-[5px] lg:mt-[10px] items-center flex justify-between gap-[10px] border rounded-5 border-grey-v-1 dark:border-opacity-[15%] py-2 px-[15px]">
                  <p className="sec-text text-gamma">{props?.session?.user?.refer_code}</p>
                  <button className="solid-button py-2 sec-text font-normal" onClick={() => { navigator.clipboard.writeText(props?.session?.user?.refer_code); toast.success('copy to clipboard') }}>
                    Copy
                  </button>
                </div>
              </div>
              <div className=" w-full">
                <label  className="sm-text mb-[10px]">Lite Referral Link</label>
                <div className="mt-[5px] lg:mt-[10px] items-center flex justify-between gap-[10px] border rounded-5 border-grey-v-1 dark:border-opacity-[15%] py-2 px-[15px]">
                  <p className="sec-text text-gamma">{`http://...?r=${props?.session?.user?.refer_code}`}</p>
                  <button className="solid-button py-2 sec-text font-normal" onClick={() => { navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_DOMAIN}/register?r=${props?.session?.user?.refer_code}`); toast.success('copy to clipboard') }}>
                    Copy
                  </button>
                </div>
              </div>
            </div>
            <button className="solid-button mb-30 w-full lg:max-w-[207px] max-w-full" onClick={() => setShow(true)}>Invite Friends</button>
            {/* <div className="bg-[#FAFAFA] dark:bg-black rounded p-[10px] flex items-center gap-[6px]">
              <IconsComponent type="warn" active={false} hover={false} />
              <p className="w-full info-10 lg:info-14-18 text-cancel dark:text-[#F87171]">
                You have not completed KYC
              </p>
              <Link href="/profile/kyc" className="underline md-text !text-primary whitespace-nowrap">
                Verify now
              </Link>
            </div> */}
          </div>
          <div className="lg:py-[50px] p-20 border-b border-[transparent] lg:border-grey-v-2 lg:dark:border-[#e9eaf026]">
            <div className="flex gap-60 justify-between items-center lg:px-0 px-20 mb-30 lg:mb-0  pb-[15px] lg:pb-[30px] border-b-[0.5px]  border-grey-v-2 dark:border-[#e9eaf026] lg:border-[transparent]">
              <p className="sec-title ">
                Overview
              </p>
              <div className="flex gap-[1px] lg:gap-[10px] items-center">
                <p className="info-10 lg:info-14-18 !text-primary">
                  View Activity History & Overview
                </p>
                <IconsComponent type="rytarrow" active={false} hover={false} />
              </div>
            </div>
            <div className="lg:py-30 lg:px-20 p-[15px] grid grid-cols-1 lg:grid-cols-3 gap-[15px] lg:gap-30 rounded-10 bg-bg-secondary dark:bg-[#080808]">
              <div className="py-0 lg:py-[5px]">
                <p className="mb-10 info-10-14 !text-sm dark:text-grey-v-1">
                  Trading Fee Rebate Voucher (USDT)
                </p>
                <p className="p-10 lg:p-[15px] info-14-18 dark:text-grey-v-1 text-h-primary">
                  0
                </p>
              </div>
              <div className="py-0 lg:py-[5px]">
                <p className="mb-10 info-10-14 !text-sm dark:text-grey-v-1">
                  Trading Fee Rebate Voucher (USDT)
                </p>
                <p className="p-10 lg:p-[15px] info-14-18 dark:text-grey-v-1 text-h-primary">
                  0
                </p>
              </div>
              <div className="py-0 lg:py-[5px]">
                <p className="mb-10 info-10-14 !text-sm dark:text-grey-v-1">
                  Trading Fee Rebate Voucher (USDT)
                </p>
                <p className="p-10 lg:p-[15px] info-14-18 dark:text-grey-v-1 text-h-primary">
                  0
                </p>
              </div>
            </div>
          </div>
          <div className="p-20 lg:py-[50px] border-b border-[transparent] lg:border-grey-v-2 lg:dark:border-[#e9eaf026]">
            <p className="sec-title mb-20 lg:mb-0  border-b-[0.5px] lg:border-none border-grey-v-2  dark:border-[#e9eaf026]   pb-[15px] lg:pb-[30px]">
              How To Refer Your Friends
            </p>

            <div className="lg:py-30 lg:px-20 p-0 grid grid-cols-1 xl:grid-cols-3 gap-20 lg:gap-30  ">
              {referalSteps?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="py-20 lg:py-40 px-[13px] lg:px-20 bg-bg-secondary dark:bg-[#080808] flex gap-20 rounded-10 items-center"
                  >
                    <div className="rounded-10 bg-primary-100 min-w-[40px]  min-h-[40px] flex ">
                      <IconsComponent
                        type={item?.image}
                        active={false}
                        hover={false}
                      />
                    </div>
                    <div>
                      <p className="mb-10 !text-[16px] md-text">Step {index + 1}</p>
                      <p className="info-12 dark:text-grey-v-1 text-h-primary">
                        {item?.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-20 lg:py-[50px] border-b border-[transparent] lg:border-grey-v-2 lg:dark:border-[#e9eaf026]">
            <div className="flex gap-60 justify-between items-center   pb-[15px] lg:pb-[30px]">
              <p className="sec-title">
                My Referrals
              </p>
              <div className="flex gap-[10px] items-center">
                <IconsComponent type="calender" active={false} hover={false} />
                <p className="sm-text lg:block hidden">
                  Month
                </p>
                <div className=" lg:block hidden">
                  <IconsComponent type="downArrow" active={false} hover={false} />
                </div>
              </div>
            </div>

            <div className="pb-10 md:pb-40 px-10 md:px-40  rounded-10 bg-bg-secondary dark:bg-[#080808]  mb-20 lg:block">
              <table width="100%">
                <thead>
                  <tr>
                    <th className="text-left py-10 md:py-20 sm-text">Registered Time</th>
                    <th className="text-left py-10 md:py-20 sm-text">
                    Invite ID
                    </th>
                    <th className="text-left py-10 md:py-20 sm-text">
                    Sub_Invite ID
                    </th>
                    <th className="text-left py-10 md:py-20 sm-text">
                    Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {referList && referList.length > 0 && referList.map((item: any) => {
                    return <tr>
                      <td className="text-left py-10 md:py-20 sm-text text-black dark:text-white">{moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                      <td className="text-left py-10 md:py-20 sm-text text-black dark:text-white">{props?.session?.user?.refer_code}</td>
                      <td className="text-left py-10 md:py-20 sm-text text-black dark:text-white">{props?.session?.user?.refer_code === item?.refeer_code ? '' : item?.refeer_code}</td>
                      <td className="text-left py-10 md:py-20 sm-text !text-[#52c41a]">Valid</td>
                    </tr>
                  })}

                  {referList && referList.length === 0 &&
                    <tr>
                      <td colSpan={4}>
                        <div className="pt-[10px] flex flex-col gap-20 items-center justify-center">
                          <Image
                            src="/assets/refer/empty.svg"
                            alt="emplty table"
                            width={107}
                            height={104}
                          />
                          <p className="sm-text">
                            Log in to view your referral history.
                          </p>
                        </div>
                      </td>
                    </tr>
                  }

                </tbody>
              </table>
            </div>
            
            <div className="pb-40 px-40  rounded-10 bg-bg-secondary dark:bg-[#080808]  mb-20 block hidden ">
              <div className="pt-[10px] flex flex-col gap-20 items-center justify-center">
                <Image
                  src="/assets/refer/empty.svg"
                  alt="emplty table"
                  width={107}
                  height={104}
                />
                <p className="sm-text">
                  Log in to view your referral history.
                </p>
              </div>
            </div>

            <div className="text-center ">
              <button className="solid-button max-w-full lg:max-w-[244px] w-full" onClick={() => setShow(true)}>Invite Friends</button>
            </div>
          </div>
          
          <div className="p-20 lg:pt-[50px] ">
            <div className="flex gap-60 justify-between items-center   pb-[15px] lg:pb-[30px]">
              <p className="sec-title  ">
                Referral Commision
              </p>
              <div className="flex gap-[10px] items-center">
                <IconsComponent type="calender" active={false} hover={false} />
                <p className="sm-text lg:block hidden">
                  Month
                </p>
                <div className=" lg:block hidden">
                  <IconsComponent type="downArrow" active={false} hover={false} />

                </div>
              </div>
            </div>

            <div className="pb-40 px-40  rounded-10 bg-bg-secondary dark:bg-[#080808]  mb-20 lg:block hidden">
              <table width="100%">
                <thead>
                  <tr>
                    <th className="text-center py-20 sm-text">ID</th>
                    <th className="text-center sm-text">
                      <div className="flex items-center gap-[5px] justify-center">
                        <p>Distribution Date</p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          className="rotate-[180deg] "
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                    <th className="text-center sm-text">
                      <div className="flex items-center gap-[5px] justify-center">
                        <p>Bonus</p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          className="rotate-[180deg] "
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                    <th className="text-center sm-text">
                      <div className="flex items-center gap-[5px] justify-center">
                        <p>Reward Type</p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          className="rotate-[180deg] "
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                    <th className="text-center sm-text">
                      <div className="flex items-center gap-[5px] justify-center">
                        <p>Status</p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          className="rotate-[180deg] "
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td colSpan={5}>

                      <div className="pt-[10px] flex flex-col gap-20 items-center justify-center">
                        <Image
                          src="/assets/refer/empty.svg"
                          alt="emplty table"
                          width={107}
                          height={104}
                        />
                        <p className="sm-text">
                          Log in to view your referral history.
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="pb-40 px-40  rounded-10 bg-bg-secondary dark:bg-[#080808]  mb-20 block lg:hidden">
              <div className="pt-[10px] flex flex-col gap-20 items-center justify-center">
                <Image
                  src="/assets/refer/empty.svg"
                  alt="emplty table"
                  width={107}
                  height={104}
                />
                <p className="sm-text">
                  Log in to view your referral history.
                </p>
              </div>
            </div>

            <div className="text-center ">
              <button className="solid-button max-w-full lg:max-w-[244px] w-full" onClick={() => setShow(true)}>Invite Friends</button>

            </div>
          </div>
        </div>
      </section>
      {
        show &&
        <ReferPopup setShow={setShow} session={props.session} />
      }
    </>
  );
};

export default Referal;
