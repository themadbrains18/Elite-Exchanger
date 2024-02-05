import SideBarLayout from '@/components/layout/sideBarLayout'
import Referal from '@/components/profile/referal'
import React, { useState } from 'react'
import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface propsData {
    session: {
        user: any
    },
    referalList: any,
    userDetail: any,
    eventList?: any,
    rewardsList?: any;
}

const Refer = (props: propsData) => {
    const [active,setActive] = useState(1);
    console.log(props.rewardsList,'-------------rewards List');
    return (
        <SideBarLayout userDetail={props.userDetail} referalList={props.referalList} eventList={props.eventList}>
            <ToastContainer />
            <div className='p-5 md:p-40'>
                <h3 className='sec-title'>All Rewards</h3>
                <div className='flex items-center gap-[40px] mt-[40px]'>
                    <button onClick={()=>{setActive(1)}} className={`solid-button !px-[20px] !py-[10px] ${active == 1 ? '' : '!bg-[#5367ff42]'}`}>All Status</button>
                    <button onClick={()=>{setActive(2)}} className={`solid-button !px-[20px] !py-[10px] ${active == 2 ? '' : '!bg-[#5367ff42]'}`}>Available </button>
                    <button onClick={()=>{setActive(3)}} className={`solid-button !px-[20px] !py-[10px] ${active == 3 ? '' : '!bg-[#5367ff42]'} `}>Used</button>
                    <button onClick={()=>{setActive(4)}} className={`solid-button !px-[20px] !py-[10px] ${active == 4 ? '' : '!bg-[#5367ff42]'}`}>Expired</button>
                </div>
                <div className='grid grid-cols-2 mt-[40px]'>
                    <div className='rounded-[10px] bg-white'>
                        <div className='pl-[24px] py-[30px] pr-[0] rounded-[10px] bg-primary-400 relative z-[1]'>
                            <div className='flex items-center'>
                                <div>
                                    <h3 className='sec-title !text-white'>20 USDT</h3>
                                    <p className='sm-text !text-white mt-[8px]'>Coupon · Derivatives</p>
                                </div>
                            </div>
                        </div>
                        <div className='border border-[#e9edf2] pt-[40px] mt-[-40px] rounded-[10px] p-[24px]'>
                            <div className='flex items-center mt-[24px] gap-[20px] justify-between'>
                                <div>
                                    <div className='bg-[#3844520f] h-[8px] w-full max-w-[100px] rounded-[8px]'></div>
                                    <p className='sm-text '>Use before 2024-02-10</p>
                                </div>
                                <button className='solid-button !px-[20px] !py-[10px]'>Use</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SideBarLayout>
    )
}

export default Refer

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { req } = context;
    const session = await getServerSession(context.req, context.res, authOptions);
    const providers = await getProviders()

    if (session) {

        let referalList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/referal?userid=${session?.user?.user_id}`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());

        let profileDashboard = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/dashboard?userid=${session?.user?.user_id}`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());

        let eventList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/referal/customer`, {
            method: "GET"
        }).then(response => response.json());

        let rewardsList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/rewards?userid=${session?.user?.user_id}`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());

        return {
            props: {
                sessions: session,
                session: session,
                referalList: referalList?.data || [],
                userDetail: profileDashboard?.data || null,
                eventList: eventList?.data?.data || [],
                rewardsList: rewardsList?.data || []
            },
        };
    }
    return {
        redirect: { destination: "/" },
    };
}