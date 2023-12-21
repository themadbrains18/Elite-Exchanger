import Link from "next/link";
import React from "react";
import { useSession } from 'next-auth/react';

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
  console.log("error in notification",error);
  
}
  }

  return (
    <div className="max-w-full lg:min-w-[352px] rounded-10 w-full bg-white dark:bg-d-bg-primary shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]">
      <div className="p-[19px] ">
        <div className='hidden lg:block'>
          {
            props.notificationData?.map((item: any, index: number) => {
              return (
                <Link href={"/notification"} onClick={() => updateNotificationStatus(item?.id, item?.user_id)} key={index} className={`block hover:dark:bg-black-v-1 hover:bg-primary-100 rounded-[5px] w-full cursor-pointer mb-[15px] items-center group md:mb-[10px] 
                            py-[15px] px-5`}>
                  <div className='min-w-[22px] lg:mb-[10px]'>
                    <p className={`info-14-18 whitespace-nowrap group-hover:text-primary`}>{item?.type?.toUpperCase()}</p>
                  </div>
                  <p className={`info-14 group-hover:text-primary w-full`}>{item?.message?.message.substring(0, 70)}</p>
                </Link>
              )
            })
          }
        </div>
      </div>
    </div>
  );
};

export default Notification;
