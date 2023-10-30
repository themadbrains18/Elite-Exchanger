import Image from "next/image";
import React from "react";
import IconsComponent from "../snippets/icons";

interface fixSection{
  fixed?:boolean;
  show?:number;
  setShow?:Function;
}

const NotificationSettings = (props:fixSection) => {
  let data = [
    {
      image: "price.svg",
      bg: "red",
      title: "Price Alerts",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      image: "referal.svg",
      bg: "green",
      title: "Referral Commission Alerts",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      image: "device.svg",
      bg: "blue",
      title: "Device Login Alerts",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      image: "mail.svg",
      bg: "blue",
      title: "Email Notification",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      image: "device.svg",
      bg: "blue",
      title: "Device Login Alerts",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      image: "device.svg",
      bg: "blue",
      title: "Device Login Alerts",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
  ];
  return (
    <section className={`${props.show == 3 && "!left-[50%]"} ${props.fixed && "duration-300 fixed pt-[145px] top-0 left-[160%] translate-x-[-50%] bg-off-white dark:bg-black-v-1 z-[6] w-full h-full pb-[20px] lg:dark:bg-d-bg-primary overflow-y-scroll"} p-5 md:p-40 `}>
        {/* only for mobile view */}
        <div className="lg:hidden flex dark:shadow-none shadow-lg shadow-[#c3c3c317] fixed top-0 left-0  w-full  rounded-bl-[20px] rounded-br-[20px]  z-[6] dark:bg-omega bg-white  h-[105px]">
          <div className="grid grid-cols-[auto_1fr_auto] m-auto w-full px-[20px] items-center">
            <div onClick={()=>{props?.setShow !== undefined && props?.setShow(0)}}>
              <IconsComponent type="backIcon" hover={false} active={false}/>
            </div>
            <div className="text-center">
              <p className="sec-title">Notification Perferences</p>
            </div>
            <div>
              <IconsComponent type="editIcon" hover={false} active={false}/>
            </div>
          </div>
        </div>

        <div className="max-[1023px] lg:p-0 p-20 dark:bg-omega bg-white rounded-[10px]"> 
      <div className="flex items-center gap-5 justify-between">
        <p className="sec-title">Notification Preferences</p>
        <div className="lg:flex hidden py-[13px] px-[15px] border dark:border-opacity-[15%] border-grey-v-1 items-center rounded-5  gap-[10px]">
          <Image src="/assets/profile/edit.svg" width={24} height={24} alt="edit" />
          <p className="nav-text-sm">Edit</p>
        </div>
      </div>
      <div className="py-[30px] md:py-[50px]">
        {data.map((item, index) => {
          return (
            <div key={index} className="flex flex-row gap-[15px] md:gap-5 py-0 md:py-[15px] mb-[30px] last:mb-0">
              <div className="flex items-start w-full gap-5">
                <div className={`p-[13px] rounded-5 max-w-[50px] w-full ${item.bg === "blue" ? "bg-primary-400" : item.bg === "red" ? "bg-[#FCA5A5]" : "bg-[#6EE7B7]"}`}>
                  <Image src={`/assets/notification/${item.image}`} width={24} height={24} alt="security" />
                </div>
                <div className="w-full">
                  <p className="info-14-18 mb-[10px] dark:text-white text-h-primary">{item.title}</p>
                  <p className="info-12">{item.desc}</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-[50px] h-6 bg-grey-v-1 rounded-full  peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[50%] after:translate-y-[-50%] after:left-[2px] after:bg-white after:border-grey-v-1 after:border after:rounded-full after:h-[19px] after:w-[19px] after:transition-all dark:border-gray-600 peer-checked:after:right-[21px] peer-checked:after:left-auto peer-checked:bg-primary"></div>
              </label>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
};

export default NotificationSettings;
