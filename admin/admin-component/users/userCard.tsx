import Cards from '../../admin-snippet/cards';
import React from 'react'

interface propsData {
  usersCounts?: any
}

const UserCard = (props: propsData) => {

  let data = [
    {
      img: "allusers.svg",
      imgbg: "bg-[#3699FF]",
      title: "All Users",
      total: props.usersCounts.total,
      percent: "5%",
      bg: "bg-[#42A5F5]",
    },
    {
      img: "activeusers.svg",
      imgbg: "bg-[#F64E60]",
      title: "Active Users",
      total: props.usersCounts.activeUser,
      percent: "5%",
      bg: "bg-[#E57373]",
    },
    {
      img: "topHolders.svg",
      imgbg: "bg-[#131C2E]",
      title: "Top Holders",
      total: props.usersCounts.activeUser,
      percent: "5%",
      bg: "bg-[#1B283F]",
    }
  ];
  return (
    <>
      <Cards data={data} />
    </>
  )
}

export default UserCard