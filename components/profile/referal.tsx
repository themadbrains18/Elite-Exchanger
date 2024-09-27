import React, { useState } from "react";
import IconsComponent from "../snippets/icons";
import Image from "next/image";
import ReferPopup from "../snippets/referPopup";
import { toast } from 'react-toastify';
import { useRouter } from "next/router";
import EventTaskPopup from "../snippets/eventTaskPopup";
import { formatDate } from "@/libs/subdomain";
interface fixSection {
  fixed?: boolean;
  show?: number;
  setShow?: Function | any;
  session?: any;
  referalList?: any,
  eventList?: any,
  rewardsList?: any;
}

const Referal = (props: fixSection) => {
  const [show, setShow] = useState(false)
  const [referList, setReferList] = useState(props.referalList);

  const [referProgamTask, setReferProgramTask] = useState();
  const [taskShow, setTaskShow] = useState(false);
  const router = useRouter();
  const [btnDisabled, setBtnDisabled] = useState(false);

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

  const copyCode = () => {
    setBtnDisabled(true);
    const input = document.createElement('textarea')
    input.value = props?.session?.user?.refer_code
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    toast.success('copy to clipboard', { autoClose: 2500 });
    setTimeout(() => {
      setBtnDisabled(false);
    }, 3000);
  }

  const copyLink = () => {
    setBtnDisabled(true);
    const input = document.createElement('textarea')
    input.value = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/register?r=${props?.session?.user?.refer_code}`
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    toast.success('copy to clipboard', { autoClose: 2500 });
    setTimeout(() => {
      setBtnDisabled(false);
    }, 3000);
  }

  return (
    <>
      <div
        className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show || taskShow ? "opacity-80 visible" : "opacity-0 invisible"
          }`}
      ></div>
      <section
        className={`${props.show == 5 && "!left-[50%]"} ${props.fixed &&
          "duration-300 fixed pt-[145px] top-0 left-[160%] translate-x-[-50%] bg-off-white dark:bg-black-v-1 z-[6] w-full h-full pb-[20px] lg:dark:bg-d-bg-primary overflow-y-scroll"
          } max-[767px]:px-[15px] p-5 lg:p-40 `}
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
            {/* <div>
              <IconsComponent type="editIcon" hover={false} active={false} />
            </div> */}
          </div>
        </div>

        <div className="max-[1023px] dark:bg-omega bg-white  rounded-[10px]">

          {/* Popular Referral program */}
          <div className=" border-b border-[transparent] lg:border-grey-v-2 lg:dark:border-[#e9eaf026]">
            <p className="sec-title pt-[20px] pl-[20px] mb-20 lg:mb-0  border-b-[0.5px] lg:border-none border-grey-v-2  dark:border-[#e9eaf026]   pb-[15px] lg:pb-[30px]">
              Popular Program Event
            </p>

            <div className="  grid grid-cols-1 xl:grid-cols-2 gap-20 lg:gap-30  ">
              {props.eventList && props.eventList.map((item: any, index: number) => {
                return <div key={index} className="flex bg-bg-secondary  dark:bg-[#080808] rounded-10 pt-[26px] md:pt-[36px] pb-20 md:pb-[31px] pr-[13px] pl-10 md:pl-40 items-center justify-between flex-col	 md:flex-row ">
                  <div className="max-w-full md:max-w-[70%] w-full">
                    <p className="mb-[13px] md:mb-[30px] text-center md:text-start md-text font-medium leading-5">
                      {item.name}
                    </p>
                    <p className="mb-[13px] md:mb-[30px] text-center md:text-start info-14 font-medium leading-5">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-center max-w-full md:min-w-[144px] md:max-w-[30%] w-full">

                    <Image
                      src="/assets/refer/event1.png"
                      width={101}
                      height={91}
                      className="m-auto"
                      alt="event1 image"
                    />
                    <button className=" py-[10px] px-[15px] bg-primary rounded-[10px] text-white max-w-full sm:max-w-[144px] w-full text-center mt-[20px]" onClick={() => router.push(`/events/${(item.name).replace(/ /g, "-")}`)}>Check Detail</button>
                  </div>
                </div>
              })}
            </div>
          </div>

          {/* How to Invite friends */}
          <div className="p-[15px] lg:py-[50px] border-b border-[transparent] lg:border-grey-v-2 lg:dark:border-[#e9eaf026]">
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

          {/* My Referral code and link */}
          <div className="lg:pb-[50px] border-b p-[15px] border-[transparent] lg:border-grey-v-2 lg:dark:border-[#e9eaf026]">
            <p className="sec-title lg:px-0  py-20 mb-[20px]">
              Refer Friends
            </p>
            <div className="flex xl:flex-row flex-col gap-10 lg:gap-[30px] mb-30 lg:mt-0 mt-20">
              <div className=" w-full">
                <label className="sm-text">Lite Referral ID</label>
                <div className="mt-[5px] lg:mt-[10px] items-center flex justify-between gap-[10px] border rounded-5 border-grey-v-1 dark:border-opacity-[15%] py-2 px-[15px]">
                  <p className="sec-text text-gamma">{props?.session?.user?.refer_code}</p>
                  <button disabled={btnDisabled} className={`solid-button py-2 sec-text font-normal ${btnDisabled === true ? 'cursor-not-allowed opacity-70':''}`} onClick={() => {
                    // navigator.clipboard.writeText(props?.session?.user?.refer_code);
                    btnDisabled === false ? copyCode() : '';
                  }}>
                    Copy
                  </button>
                </div>
              </div>
              <div className=" w-full">
                <label className="sm-text mb-[10px]">Lite Referral Link</label>
                <div className="mt-[5px] lg:mt-[10px] items-center flex justify-between gap-[10px] border rounded-5 border-grey-v-1 dark:border-opacity-[15%] py-2 px-[15px]">
                  <p className="sec-text text-gamma">{`http://...?r=${props?.session?.user?.refer_code}`}</p>
                  <button disabled={btnDisabled} className={`solid-button py-2 sec-text font-normal ${btnDisabled === true ? 'cursor-not-allowed opacity-70':''}`} onClick={() => {
                    // navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_DOMAIN}/register?r=${props?.session?.user?.refer_code}`);
                    btnDisabled === false ? copyLink() : '';
                  }}>
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Referral friend History */}
          <div className="p-[15px] lg:py-[50px] border-b border-[transparent] lg:border-grey-v-2 lg:dark:border-[#e9eaf026]">
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
                    <th className="text-left py-10 md:py-20 sm-text">
                      UID
                    </th>
                    <th className="text-left py-10 md:py-20 sm-text">
                      Registered Time
                    </th>
                    <th className="text-left py-10 md:py-20 sm-text hidden md:block">
                      Invite Id
                    </th>

                    <th className="text-left py-10 md:py-20 sm-text">
                      Status
                    </th>
                    <th className="text-left py-10 md:py-20 sm-text max-[767px]:text-end ">
                      Task View
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {referList && referList.length > 0 && referList.map((item: any, index: number) => {
                    return <tr key={index}>
                      <td className="text-left py-10 md:py-20 sm-text text-black dark:text-white">{(item?.referral_user)?.substring(0, 6)}</td>
                      <td className="text-left py-10 md:py-20 sm-text text-black dark:text-white">{formatDate(item?.createdAt,"yyyy-MM-dd HH:mm:ss")}</td>
                      <td className="text-left py-10 md:py-20 sm-text text-black dark:text-white hidden md:block">{(item?.user_id)?.substring(0, 6)}</td>
                      <td className="text-left py-10 md:py-20 sm-text !text-[#52c41a]">Register</td>
                      <td className="text-left py-10 md:py-20 sm-text !text-[#52c41a] cursor-pointer max-[767px]:text-end " onClick={() => { setReferProgramTask(item); setTaskShow(true); }}>view</td>
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
                            No Record found
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

          </div>

          {/* Collect commision from referral program history */}
          <div className="p-[15px] lg:pt-[50px] ">
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
                          No record found
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


          </div>

        </div>
      </section>

      {taskShow &&
        <EventTaskPopup setTaskShow={setTaskShow} referProgamTask={referProgamTask} rewardsList={props.rewardsList} />
      }

      {
        show &&
        <ReferPopup setShow={setShow} session={props.session} />
      }
    </>
  );
};

export default Referal;
