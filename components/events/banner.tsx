import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { formatDate } from "@/libs/subdomain";

interface propsData {
  eventData?: any;
}

const Banner = (props: propsData) => {

  const { status, data: session } = useSession();
  const calculateTimeLeft = () => {
    const difference = +new Date(props?.eventData?.end_date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 100);

    return () => clearTimeout(timer);
  });

  return (
    <div className="py-[20px] px-[16px] md:py-40">
      <div className="max-w-[1200px] w-full flex md:flex-row flex-col-reverse mx-auto items-center  gap-[30px] justify-between">
        <div>
          <div className="py-[9px] px-[16px] rounded-full bg-grey-v-2 dark:bg-[#40424a]">
            <p className="text-[12px] md:text-base font-medium leading-[21px] dark:text-white text-black-v-1">
              Start Event From : {formatDate(props?.eventData?.start_date)} – End Event To : {formatDate(props?.eventData?.end_date)}
            </p>
          </div>
          <p className="mt-[12px] text-[22px] md:text-[24px] font-semibold leading-[24px] dark:text-white text-black">
            {props?.eventData?.name}:
          </p>
          <p className="text-[38px] whitespace-nowrap md:text-[54px] font-bold leading-[42px] md:leading-[70px] text-primary">
            Earn {props?.eventData?.amount} USDT!
          </p>
          <p className="mt-[12px] text-[16px] md:text-[24px] font-medium leading-[28px] dark:text-white text-black">
            Invite friends and unlock USDT bonuses
          </p>
          <div className="mt-[12px]">
            <p className="text-[12px] leading-[18px] mb-0 md:mb-[8px] md:text-left text-center dark:text-white text-black">
              Event ends in:
            </p>
            <div className="flex items-center justify-between max-w-[352px] w-full">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className=" max-w-[70px] w-full ">
                  <div className="border border-grey-v-2 rounded-[16px] text-[32px] bg-nav-secondary text-white dark:bg-[#0c0e15b3] font-semibold leading-[50px] text-center">
                    {String(value).padStart(2, "0")}
                  </div>
                  <div className="mt-[8px] text-[12px] leading-[18px] dark:text-white text-center">
                    {unit.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {session === null &&
            <a href="/register" className="py-[10px] px-[15px] bg-primary rounded-[10px] text-white max-w-full sm:max-w-[144px] w-full inline-block text-center mt-[20px]">Register Now</a>
          }

        </div>
        <div className="relative">
          <Image
            src="/assets/refer/promo.webp"
            width={430}
            height={403}
            alt="promo-event"
          />
          <div className="absolute top-[34%] left-[39%]">
            <p className="text-[25px] md:text-[32px] font-semibold text-black">{props?.eventData?.amount} USDT</p>
            <p className="text-[25px] md:text-[32px] font-semibold text-black text-center">BONUS</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
