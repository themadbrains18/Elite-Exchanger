import Image from "next/image";
import ReferPopup from "../snippets/referPopup";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";

/**
 * Interface for props used in the Participate component
 * @param {any} eventData - Optional event data containing details for the referral program
 */
interface propsData {
  eventData?: any;
}

/**
 * Participate component to render event participation options and invitation cards.
 * Displays available tasks, referral bonuses, and a ReferPopup modal to invite friends.
 *
 * @param {propsData} props - Properties passed to the Participate component
 * @returns {JSX.Element} The rendered Participate component
 */
const Participate = (props: propsData) => {

  // Holds the list of referral program invites from eventData
  const participation = props?.eventData?.refer_program_invites;
  const [show, setShow] = useState(false);
  const [referEvent, setReferEvent] = useState('');
  const { status, data: session } = useSession();

  // Router instance to handle navigation to login if the user is not authenticated
  const router = useRouter();

  return (
    <>
    <ToastContainer limit={1}/>
      <div
        className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show ? "opacity-80 visible" : "opacity-0 invisible"
          }`}
      ></div>
      <div className="py-40 lg:px-0 px-[10px]">
        <div className="max-w-[1200px] w-full flex flex-col mx-auto items-center ">

          <h2 className="text-[32px] font-bold leading-[40px] mb-[60px] dark:text-white text-black text-center w-full">How to Participate</h2>
          <div className="p-[20px] max-w-[1200px] w-full mx-auto">
            <p className="text-[20px] md:text-[28px] leading-[30px] md:leading-[36px] font-semibold mb-[16px] md:mb-[20px] dark:text-white">Invite Qualified Referee to Earn Bonuses</p>
            <p className="text-[16px] md:text-[20px] leading-[150%] font-semibold mb-[16px] dark:text-white">Complete the tasks below to unlock the bonuses. The more Qualified Referees you invite, the more rewards you get.</p>

          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            {
            participation&& participation.length>0 && participation?.map((item: any, index: number) => {
                return (
                  <div key={index} className="rounded-[8px] overflow-hidden bg-bg-secondary dark:bg-white">
                    <div className="py-[19px] px-[23px] bg-primary  w-full whitespace-nowrap">
                      <div className="relative">
                        <p className="text-white text-[20px] tracking-[0.25px] leading-[42px] font-bold ">{item?.amount} USDT Bonus</p>

                        <Image src="/assets/refer/stars.png" width={40} height={40} alt="stars" className="absolute right-[-10px]  top-[-10px]  brightness-0 z-0" />
                      </div>

                    </div>
                    <div className="py-[19px] px-[23px] w-full ">
                      <p className="text-[14px] tracking-[0.25px]">{item?.description}</p>

                    </div>
                    <div className="text-center sticky bottom-5 absolute ">
                      <button className="py-[10px] px-[15px] bg-primary rounded-[10px] text-white max-w-[144px] w-full inline-block text-center mt-[20px]" onClick={() => {
                        if (session) {
                          setShow(true);
                          setReferEvent(item?.referral_id)
                        }
                        else {
                          router.push('/login');
                        }

                      }}>Invite</button>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
        {show &&
          <ReferPopup setShow={setShow} session={session} referEvent={referEvent} />
        }

      </div>
    </>

  );
};

export default Participate;
