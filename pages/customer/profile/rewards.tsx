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


/**
 * Component for displaying referral rewards and user details.
 * This component shows the user's profile, referral list, rewards, and other related data.
 * 
 * @param {Object} props - The props passed to the component.
 * @param {Object} props.session - The current user session object.
 * @param {Array} props.referalList - The list of the user's referrals.
 * @param {Object} props.userDetail - The user's profile details.
 * @param {Array} props.eventList - The list of events related to the user.
 * @param {Array} props.rewardsList - The list of rewards available to the user.
 * @param {boolean} props.fixed - Whether the sidebar layout should be fixed.
 * @param {number} props.show - The state that controls which view is shown.
 * @param {Function} props.setShow - Function to update the `show` state.
 * @returns JSX.Element - The rendered component.
 */
const ReferRewards = (props: propsData) => {
    return (
        <>
            <Meta title='Earn Crypto Rewards | Unlock Benefits and Bonuses' description='Discover our Crypto Rewards program and start earning benefits for your trading activity! Explore various reward options, bonuses for referrals, and loyalty incentives. Maximize your crypto journey while enjoying exclusive offers tailored just for you. Join us and reap the rewards today!' />
            <SideBarLayout userDetail={props.userDetail} referalList={props.referalList} eventList={props.eventList} rewardsList={props.rewardsList}>
                <ToastContainer limit={1} />
                <Rewards rewardsList={props.rewardsList} />
            </SideBarLayout>
        </>
    )
}

export default ReferRewards

/**
 * Fetches necessary data for the ReferRewards page during SSR (Server-Side Rendering).
 * It checks if the user is authenticated, then fetches data related to referrals,
 * profile information, events, and rewards from the backend API.
 * 
 * @param {GetServerSidePropsContext} context - The context object containing the request and response.
 * @returns {Promise<Object>} - The result object containing the fetched data and props.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (session) {

        // Fetch referral list for the authenticated user
        let referalList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/referal?userid=${session?.user?.user_id}`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());

        // Fetch user profile dashboard data
        let profileDashboard = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/dashboard?userid=${session?.user?.user_id}`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());

        // Fetch event list for the user
        let eventList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/referal/customer`, {
            method: "GET"
        }).then(response => response.json());

        // Fetch the rewards list for the user
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
                referalList: referalList?.data || [],  // Default to empty array if no data
                userDetail: profileDashboard?.data || null,  // Default to null if no data
                eventList: eventList?.data?.data || [],  // Default to empty array if no data
                rewardsList: rewardsList?.data?.list || [],  // Default to empty array if no data
                totalPoint: rewardsList?.data?.total || 0  // Default to 0 if no data
            },
        };
    }
    return {
        redirect: { destination: "/" },
    };
}