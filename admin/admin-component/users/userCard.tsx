import Cards from '../../admin-snippet/cards';
import React from 'react'

const UserCard = () => {
    let data = [
        {
          img: "allusers.svg",
          imgbg: "bg-[#3699FF]",
          title: "All Users",
          total: "2,19,51200",
          percent: "5%",
          bg: "bg-[#42A5F5]",
        },
        {
          img: "activeusers.svg",
          imgbg: "bg-[#F64E60]",
          title: "Active Users",
          total: "23232004",
          percent: "5%",
          bg: "bg-[#E57373]",
        },
        {
          img: "topHolders.svg",
          imgbg: "bg-[#131C2E]",
          title: "Top Holders",
          total: "12532232",
          percent: "5%",
          bg: "bg-[#1B283F]",
        }
      ];
  return (
    <>
    <Cards data={data}/>
    </>
  )
}

export default UserCard