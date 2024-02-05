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
import ReferRewards from '@/pages/customer/profile/rewards';
import ReferRewardsRes from '../ReferRewardsRes';

interface showTabContent {
  show: number;
  setShow: any;
  profileInfo1?: any;
  kycInfo?: any;
  referalList?:any;
  activity?:any;
  eventList?:any;
}
const MainResponsivePage = (props: showTabContent) => {

  const { data: session } = useSession();
  const [verified, setVerified] = useState(props.kycInfo? props.kycInfo?.isVerified:undefined)


  return (
    <>

      {/* for profile page in mobile */}
      <Dashboard fixed={true} show={props.show} setShow={props.setShow} userDetail={props.profileInfo1} session={session}/>

      <SecuritySettings fixed={true} show={props.show} setShow={props.setShow} session={session} activity={props?.activity}/>

      <NotificationSettings fixed={true} show={props.show} setShow={props.setShow} />
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

      {/* <ReferRewards fixed={true} show={props.show} setShow={props.setShow} session={session} />   */}
      <ReferRewardsRes fixed={true} show={props.show} setShow={props.setShow} session={session} />
      
      <Referal fixed={true} show={props.show} setShow={props.setShow} session={session} referalList={props.referalList} eventList={props.eventList}/>

    </>
  )
}

export default MainResponsivePage;