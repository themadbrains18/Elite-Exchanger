import React, { useEffect, useState } from 'react'
import Dashboard from '../dashboard';
import SecuritySettings from '../securitySettings';
import NotificationSettings from '../notificationSettings';
import KycAuth from '../kycAuth';
import Referal from '../referal';
import Activity from '../activity/activity';
import { useSession } from 'next-auth/react';
import KycPending from '../kyc-pending';
import KycDone from '../kyc-done';
// import Rewards from '../rewards';
import ReferRewardsRes from '../ReferRewardsRes';

/**
 * Props for the MainResponsivePage component, containing data and state management for various sections.
 * 
 * - `show`: A number representing which section of the page should be shown.
 * - `setShow`: A function to update the `show` state.
 * - `profileInfo1`: Optional data for the user's profile information.
 * - `kycInfo`: Optional data for the user's KYC (Know Your Customer) information.
 * - `referalList`: Optional data for the user's referral list.
 * - `activity`: Optional data for displaying the user's activity.
 * - `eventList`: Optional data for the user's event list.
 * - `rewardsList`: Optional data for the user's rewards list.
 */
interface MainResponsivePageProps {
  show: number;
  setShow: any;
  profileInfo1?: any;
  kycInfo?: any;
  referalList?:any;
  activity?:any;
  eventList?:any;
  rewardsList?:any;
}

const MainResponsivePage = (props: MainResponsivePageProps) => {

  const { data: session } = useSession();
  const [verified, setVerified] = useState(props.kycInfo? props.kycInfo?.isVerified:undefined)

  return (
    <>

      {/* for profile page in mobile */}
      <Dashboard fixed={true} show={props.show} setShow={props.setShow} userDetail={props.profileInfo1} session={session}/>

      <SecuritySettings fixed={true} show={props.show} setShow={props.setShow} session={session} activity={props?.activity}/>
      {
        props.kycInfo && props.kycInfo.length === 0 && verified==undefined &&
        <KycAuth fixed={true} show={props.show} setShow={props.setShow} num={2} setVerified={setVerified}/>
      }

      {
       verified ==0  &&verified!=undefined &&
        <KycPending fixed={true} show={props.show} setShow={props.setShow} session={session} />
      }
      {
       verified ==1  &&
        <KycDone fixed={true} show={props.show} setShow={props.setShow} session={session} />
      }

      <ReferRewardsRes rewardsList={props.rewardsList} fixed={true} show={props.show} setShow={props.setShow} session={session}/>
      
      <Referal fixed={true} show={props.show} setShow={props.setShow} session={session} referalList={props.referalList} eventList={props.eventList} rewardsList={props.rewardsList}/>

    </>
  )
}

export default MainResponsivePage;