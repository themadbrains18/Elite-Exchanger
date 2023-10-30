import React from "react";
import IconsComponent from "../snippets/icons";

const ReferFriends = () => {

    let data=[
        {
            image:"refer1",
            title:"Refer Friends",
            desc:'Invite friends to sign up and  deposit more than $50'
        },
        {
            image:"refer2",
            title:"Share Commission",
            desc:'Share your referral link or QR code with your friends and social media.'
        },
        {
            image:"refer3",
            title:"Earn Crypto!",
            desc:"You earn up to 40% of your friends' trading fees every time they trade!"
        }

    ]

  return (
  <section className="py-40 md:py-[100px]">
    <div className="container">
        <p className="text-lg leading-6 font-normal text-primary text-center mb-[10px] md:mb-[15px]">Refer</p>
        <p className="sec-subTitle dark:!text-white !text-black pb-[50px] md:pb-[60px] text-center">How To Refer Your Friends</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 md:gap-30">
            {
                data?.map((item,index)=>{
                    return(
                        <div key={index} className="p-20 md:p-40 rounded-10 bg-[#FFF9E7]">
                            <div className="py-[5px] px-[18px] mb-20 md:mb-40">
                                <IconsComponent type={item?.image} hover={false} active={false}/>
                            </div>
                            <p className="text-[19px] md:text-[28px] leading-[23px] md:leading-[34px] font-normal text-black pb-10 md:pb-[15px]">{item?.title}</p>
                            <p className="info-12 md:info-14-18 !text-[#000000b3]">{item?.desc}</p>
                        </div>
                    )
                })
            }
        </div>

    </div>
  </section>
  )
};

export default ReferFriends;
