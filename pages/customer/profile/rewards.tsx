import SideBarLayout from '@/components/layout/sideBarLayout'
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext } from 'next'
import { authOptions } from '../../api/auth/[...nextauth]';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Rewards from '@/components/profile/rewards'
import Meta from '@/components/snippets/meta';

interface propsData {
    session?: {
        user: any
    },
    referalList?: any,
    userDetail?: any,
    eventList?: any,
    rewardsList?: any;
    fixed?: boolean;
    show?: number;
    setShow?: Function | any;
}



const ReferRewards = (props: propsData) => {
    return (
        <>
        <Meta title='Earn Crypto Rewards | Unlock Benefits and Bonuses' description='Discover our Crypto Rewards program and start earning benefits for your trading activity! Explore various reward options, bonuses for referrals, and loyalty incentives. Maximize your crypto journey while enjoying exclusive offers tailored just for you. Join us and reap the rewards today!'/>
        <SideBarLayout userDetail={props.userDetail} referalList={props.referalList} eventList={props.eventList} rewardsList={props.rewardsList}>
            <ToastContainer limit={1}/>
            <Rewards rewardsList={props.rewardsList} />
        </SideBarLayout>
        </>
    )
}

export default ReferRewards

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);

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
                rewardsList: rewardsList?.data?.list || [],
                totalPoint: rewardsList?.data?.total || 0
            },
        };
    }
    return {
        redirect: { destination: "/" },
    };
}