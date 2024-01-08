import React from "react";

import SideBar from "../snippets/sideBar";

interface child {
  children: any;
  userDetail ? :any;
  kycInfo?:any;
  referalList?:any;
  activity?:any
}

const SideBarLayout = (props: child) => {

  return (
    <div className=" bg-light-v-1 py-[20px] md:py-[80px]  dark:bg-black-v-1 ">
      <div className="flex flex-row container items-start ">
        <SideBar profileSec={true} profileInfo={props.userDetail} kycInfo={props.kycInfo} referalList={props.referalList} activity={props?.activity}/>
        <div className="md:w-[calc(100%-382px)] ml-[30px] bg-white dark:bg-d-bg-primary rounded-10 lg:block hidden">{props.children}</div>
      </div>
    </div>
  );
};

export default SideBarLayout;
