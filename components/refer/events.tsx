import Image from "next/image";
import React from "react";

interface propsData {
  eventList?: any;
}

const Events = (props: propsData) => {
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
              <div>
                <Image
                  src="/assets/refer/event1.png"
                  width={401}
                  height={291}
                  alt="event1 image"
                />
              </div>
            </div>
          })}

          {/* <div className="flex bg-[#FFEBEF] rounded-10  pr-[13px] pl-10 md:pl-40 items-center">
            <div className="max-w-[306px]">
              <p className="mb-[13px] md:mb-[30px] text-sm font-medium leading-5 md:md-heading md:font-semibold">
                Draw 100 USDT in the Fortune Wheel!
              </p>
              <p className="text-primary text-[10px] md:text-[19px] leading-normal md:leading-[23px] font-normal">
                Win 100% guaranteed prizes!
              </p>
            </div>
            <div>
              <Image
                src="/assets/refer/event2.png"
                width={401}
                height={291}
                alt="event1 image"
              />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Events;
