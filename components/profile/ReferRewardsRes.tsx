import React from 'react'

interface fixSection {
    fixed?: boolean;
    show?: number;
    setShow?: Function | any;
    session?: any;
    referalList?: any,
    eventList?: any,
}
const ReferRewardsRes = (props:fixSection) => {
  return (
    <div className={` ${props.show == 4 && "!left-[50%]"} ${
        props.fixed
          ? " duration-300 p-5 md:p-40 fixed pt-[145px] top-0 left-[160%] translate-x-[-50%] bg-off-white dark:bg-black-v-1 z-[6] w-full h-full pb-[20px] lg:dark:bg-d-bg-primary "
          : "p-5 md:p-40  block"
      }} overflow-y-auto`}>ReferRewardsRes</div>
  )
}

export default ReferRewardsRes