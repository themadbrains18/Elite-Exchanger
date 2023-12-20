import Cards from "../../admin-snippet/cards";

import React from "react";

interface list{
  userList:any;
  tradeList:any;
}

const DashboardCards = (props:list) => {

  const inactiveUser= props?.userList?.data?.filter((x:any)=>{
    return x.statusType === false
  })
  
  // console.log(props.tradeList,"==dhjhdj");
  
  let data = [
    {
      img: "users.svg",
      imgbg: "bg-[#3699FF]",
      title: "All Users",
      total: props.userList?.total,
      percent: "5%",
      bg: "bg-[#42A5F5]",
    },
    {
      img: "inactive.svg",
      imgbg: "bg-[#F64E60]",
      title: "Inactive Users",
      total: inactiveUser?.length,
      percent: "5%",
      bg: "bg-[#ED5868]",
    },
    {
      img: "trade.svg",
      imgbg: "bg-[#131C2E]",
      title: "Total Trades",
      total: props.tradeList?.total,
      percent: "5%",
      bg: "bg-[#1B283F]",
    },
    {
      img: "order.svg",
      imgbg: "bg-[#3699FF]",
      title: "Total Open Orders",
      total: "525265525",
      percent: "5%",
      bg: "bg-[#42A5F5]",
    },
  ];

  return (
    <>
  <Cards data={data} />
    </>
  )
};

export default DashboardCards;
