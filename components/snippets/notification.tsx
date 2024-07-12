import Link from "next/link";
import React from "react";
import { useSession } from 'next-auth/react';
import Image from "next/image";
import IconsComponent from "./icons";

interface propsData {
  notificationData: any;
  getUserNotification?: any;
}

const Notification = (props: propsData) => {
  const { status, data: session } = useSession();

  const updateNotificationStatus = async (id: string, user_id: string) => {
    try {
      let obj = {
        userid: user_id,
        id: id,
      };

      let profileDashboard = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/notification`, {
        method: "PUT",
        headers: {
          "Authorization": session?.user?.access_token
        },
        body: JSON.stringify(obj),
      }).then(response => response.json());

      if (profileDashboard) {
        props.getUserNotification();
      }

    } catch (error) {
      console.log("error in notification", error);
    }
  }

  function containsImageUrl(str: string) {
    const imageUrlPattern = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))/i;
    return imageUrlPattern.test(str);
  }

  return (
    <div className="max-w-full border dark:border-[#25262a] border-[#e5e7eb] lg:min-w-[352px] rounded-10 w-full bg-white dark:bg-d-bg-primary shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] ">
      <div className="p-[19px] w-full overflow-y-auto max-h-[450px]">
        <div className='hidden lg:block'>
          {
            props.notificationData?.map((item: any, index: number) => {
              let isImage = containsImageUrl(item?.message?.message);
              return (
                // <div className="pb-3 mb-3 dark:border-[#25262a] border-[#e5e7eb] border-b">
                //   <div className="flex items-center gap-3 mb-3">
                //     <div className="w-6">
                //       <IconsComponent type="MessageIcon" />
                //     </div>
                //       <p className="admin-table-data !text-base">New Message from</p>
                //   </div>
                //   <div className="flex items-center gap-3 justify-between ">
                //     <p className="info-14-18 text-sm dark:text-[#a0a1a7]">2024-07-02 10:50:52</p>
                //     <Link href="#" className="info-14-18 text-sm dark:text-[#a0a1a7] hover:!text-primary">View More</Link>
                //   </div>
                // </div>
                <Link href={"/notification"} onClick={() => updateNotificationStatus(item?.id, item?.user_id)} key={index} className={`block hover:dark:bg-black-v-1 hover:bg-primary-100 rounded-[5px] w-full cursor-pointer mb-[15px] items-center group md:mb-[10px] 
                            py-[15px] px-5`}>
                  <div className='min-w-[22px] lg:mb-[10px]'>
                    <p className={`info-14-18 whitespace-nowrap group-hover:text-primary`}>{item?.type?.toUpperCase()}</p>
                  </div>
                  {isImage === true ?
                    <Image src={item?.message?.message} alt="" width={100} height={100} />
                    : <p className={`info-14 group-hover:text-primary w-full`}>{item?.message?.message.substring(0, 70)}</p>
                  }
                </Link>
              )
            })
          }
          <Link href="/notification" className="solid-button !py-2 !rounded-5 !w-full !block !text-center">View all</Link>
        </div>
      </div>
    </div>
  );
};

export default Notification;
