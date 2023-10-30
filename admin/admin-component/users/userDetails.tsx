import AdminIcons from '@/admin/admin-snippet/admin-icons'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
// import DetailsTable from './detailsTable'
import { useRouter } from 'next/router'
import WalletTable from '../wallet/walletTable'

interface Details{
  session:any,

}


const UserDetails = (props:Details) => {
  const router = useRouter()
  // console.log(router?.query);
  const [withdrawList, setWithdrawList] = useState([])
  const [orderList, setOrderList] = useState([])
  const [depositList, setDepositList] = useState([])
  const [marketOrderList, setMarketOrderList] = useState([])
  const [assetList, setAssetList] = useState([])
  const [activityList, setActivityList] = useState([])
  const [referalList, setReferalList] = useState([])

  useEffect(()=>{
    getDetailsData()

  },[])
   
  const getDetailsData=async()=>{
    
    let userDetail = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/detial/${router?.query?.id}`, {
      method: "GET",    
    }).then(response => response.json());
    
    let referalDetail = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/refer/getbyuser/${router?.query?.id}`, {
      method: "GET",    
    }).then(response => response.json());
    console.log(referalDetail,"==referalDetail");
    
    
    setWithdrawList(userDetail?.withdraws);
    setDepositList(userDetail?.user_deposit);
    setOrderList(userDetail?.order);
    setAssetList(userDetail?.user_assets);
    setMarketOrderList(userDetail?.marketOrders)
    setActivityList(userDetail?.lastlogins)
    setReferalList(referalDetail)


  }
  
  return (
    <WalletTable  orders={orderList} deposit={depositList} marketOrders={marketOrderList} withdraw={withdrawList} session={props?.session} assets={assetList} activity={activityList} referalList={referalList}/>

  )
}

export default UserDetails