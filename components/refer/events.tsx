import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

interface propsData {
  eventList?: any;
}

const Events = (props: propsData) => {

  const router = useRouter();

  return (
    <section className="py-40 md:py-[100px]">
      <div className="container">
        <p className="sec-subTitle md:text-start text-center pb-50 md:pb-60">
          Popular events
        </p>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-20">
          {props.eventList && props.eventList.map((item: any) => {
            return <div className="flex bg-[#E5F1FF] rounded-10 pt-[26px] md:pt-[36px] pb-20 md:pb-[31px] pr-[13px] pl-10 md:pl-40 items-center">
              <div className="max-w-[342px]">
                <p className="mb-[13px] md:mb-[30px] text-sm font-medium leading-5 md:md-heading md:font-semibold">
                  {item.name}
                </p>
                <p className="text-primary text-[10px] md:text-[19px] leading-normal md:leading-[23px] font-normal">
                  {item.description}
                </p>
              </div>
              <div className="text-center">
                <Image
                loading="lazy"
                  src="/assets/refer/event1.png"
                  width={401}
                  height={291}
                  alt="event1 image"
                />
                <button className="py-[10px] px-[15px] bg-primary rounded-[10px] text-white max-w-full sm:max-w-[144px] w-full inline-block text-center mt-[20px]" onClick={()=>router.push(`/events/${(item.name).replace(/ /g,"-")}`)}>Check Detail</button>
              </div>
            </div>
          })}

        </div>
      </div>
    </section>
  );
};

export default Events;
