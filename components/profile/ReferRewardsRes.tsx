import React, { useState } from 'react'
import IconsComponent from '../snippets/icons';
import { useRouter } from 'next/router';
import moment from "moment";

interface fixSection {
  fixed?: boolean;
  show?: number;
  setShow?: Function | any;
  session?: any;
  rewardsList?: any;
}
const ReferRewardsRes = (props: fixSection) => {
  const [active, setActive] = useState(1);

  const router = useRouter();

  const [list, setList] = useState(props.rewardsList);

  const updateClaimData = async (data: any) => {

    try {
      const date = new Date();
      const theDayOfTheMonthOnNextWeek = date.getDate() + 7;
      date.setDate(theDayOfTheMonthOnNextWeek);

      let obj = {
        claimed_on: new Date(),
        expired_on: date,
        id: data?.id,
        claim: true
      }

      let rewardsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/rewards`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": props?.session?.user?.access_token
        },
        body: JSON.stringify(obj)
      }).then(response => response.json());

      if (rewardsResponse?.data) {
        const newState = list.map((obj: any) => {
          if (obj?.id === rewardsResponse?.data?.id) {
            return rewardsResponse?.data;
          }
          // 👇️ otherwise return the object as is
          return obj;
        });

        setList(newState);
      }
    } catch (error) {
      console.log(error);

    }
  }
  return (
    <div className={` ${props.show == 5 && "!left-[50%]"} ${props.fixed
      ? " duration-300 p-5 md:p-40 fixed pt-[145px] top-0 left-[160%] translate-x-[-50%] bg-off-white dark:bg-black-v-1 z-[6] w-full h-full pb-[20px] lg:dark:bg-d-bg-primary "
      : "p-5 md:p-40  block"
      }} overflow-y-auto`}>
      {/* only for mobile view */}
      <div className="lg:hidden flex dark:shadow-none shadow-lg shadow-[#c3c3c317] fixed top-0 left-0  w-full  rounded-bl-[20px] rounded-br-[20px]  z-[6] dark:bg-omega bg-white  h-[105px]">
        <div className="grid grid-cols-[auto_1fr_auto] m-auto w-full px-[20px] items-center">
          <div
            onClick={() => {
              props.setShow(0);
            }}
          >
            <IconsComponent type="backIcon" hover={false} active={false} />
          </div>
          <div className="text-center">
            <p className="sec-title">My Rewards</p>
          </div>
          <div>
            <IconsComponent type="editIcon" hover={false} active={false} />
          </div>
        </div>
      </div>

      <div className='p-5 md:p-40 dark:bg-omega bg-white rounded-[10px]'>
        <h3 className='sec-title'>All Rewards</h3>
        <div className='flex items-center gap-[20px] mt-[40px]'>
          <button type='button' onClick={() => { setActive(1) }} className={`solid-button !px-[20px] !py-[10px] ${active == 1 ? '' : '!bg-[#5367ff42]'}`}>All Status</button>
          <button type='button' onClick={() => { setActive(2) }} className={`solid-button !px-[20px] !py-[10px] ${active == 2 ? '' : '!bg-[#5367ff42]'}`}>Available </button>
          <button type='button' onClick={() => { setActive(3) }} className={`solid-button !px-[20px] !py-[10px] ${active == 3 ? '' : '!bg-[#5367ff42]'} `}>Used</button>
          <button type='button' onClick={() => { setActive(4) }} className={`solid-button !px-[20px] !py-[10px] ${active == 4 ? '' : '!bg-[#5367ff42]'}`}>Expired</button>
        </div>
        <div className='grid max-[1250px]:grid-cols-1 grid-cols-2 gap-[10px] mt-[40px]'>
          {list && list.map((item: any) => {
            if (item.claimed_on !== null) {
              // ----------------------------------
              // check if coupon expired or not
              // ----------------------------------
              const difference = +new Date(item.expired_on) - +new Date();

              return <div className='rounded-[10px] bg-white'>
                <div className='pl-[24px] py-[30px] pr-[0] rounded-[10px] bg-primary-400 relative z-[1] group relative after:w-[20px] after:h-[20px] after:absolute after:top-[calc(50%-10px)] after:left-[-10px] overflow-hidden after:bg-[#fff] after:dark:bg-d-bg-primary after:rounded-full before:w-[20px] before:h-[20px] before:absolute before:top-[calc(50%-10px)] before:right-[-10px] overflow-hidden before:bg-[#fff] before:dark:bg-d-bg-primary before:rounded-full'>
                  <div className='flex items-center justify-between gap-[15px]'>
                    <div>
                      <div className='flex items-center gap-[15px]'>
                        <h3 className='sec-title !text-white'>{item?.amount} USDT</h3>
                        <a href={`/profile/reward-detail?id=${item?.id}`} target='_blank' className='text-white underline opacity-0 group-hover:opacity-[1]'>Details</a>
                      </div>
                      <p className='sm-text !text-white mt-[8px]'>{item?.type} · Derivatives</p>
                    </div>
                    <div>
                      <svg
                        className='opacity-[0.3] mr-[24px]'
                        width={97}
                        height={74}
                        viewBox="0 0 97 74"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M87.7959 19.7317C89.6811 19.3993 90.9382 17.6179 90.6095 15.7541L89.4932 9.42318C88.4501 3.50758 81.6432 -0.072221 73.9969 1.27602L46.7253 6.08474L48.5114 16.2142C48.84 18.078 47.583 19.8594 45.6978 20.1918C43.8127 20.5242 42.0221 19.2802 41.6935 17.4164L39.9074 7.28692L12.6358 12.0956C4.98952 13.4439 -0.182563 19.1359 0.860516 25.0515L1.97683 31.3824C2.30547 33.2462 4.09599 34.4902 5.98114 34.1578C11.4286 33.1973 17.1124 37.4834 18.1429 43.3281C19.0913 48.7069 15.4781 53.372 9.55333 54.4167C7.66818 54.7491 6.41111 56.5305 6.73975 58.3943L8.0049 65.5693C8.96463 71.0122 15.7061 74.2206 23.3524 72.8723L50.624 68.0636L48.8379 57.9342C48.5092 56.0704 49.7663 54.289 51.6515 53.9566C53.5366 53.6242 55.3271 54.8682 55.6558 56.732L57.4419 66.8614L84.7135 62.0527C92.3597 60.7045 97.5973 55.3839 96.6376 49.941L95.3724 42.766C95.0438 40.9021 93.2533 39.6582 91.3681 39.9906C85.4434 41.0353 80.4524 37.8872 79.504 32.5085C78.4734 26.6638 82.3484 20.6922 87.7959 19.7317ZM53.8697 46.6025C54.1983 48.4664 52.9412 50.2477 51.0561 50.5801C49.1709 50.9125 47.3804 49.6685 47.0518 47.8047L46.4564 44.4282C46.1278 42.5644 47.3849 40.7831 49.27 40.4507C51.1551 40.1183 52.9457 41.3622 53.2743 43.2261L53.8697 46.6025ZM50.8929 29.7201C51.2215 31.5839 49.9644 33.3653 48.0793 33.6977C46.1941 34.0301 44.4036 32.7861 44.075 30.9223L43.4796 27.5458C43.1509 25.682 44.408 23.9007 46.2932 23.5682C48.1783 23.2358 49.9688 24.4798 50.2975 26.3436L50.8929 29.7201Z"
                          fill="#fff"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className='border border-[#e9edf2] pt-[40px] mt-[-40px] rounded-[10px] p-[24px]'>
                  <div className='flex items-center mt-[24px] gap-[20px] justify-between'>
                    <div>
                      <div className='bg-[#3844520f] h-[8px] w-full max-w-[100px] rounded-[8px]'></div>
                      <p className='sm-text '>Use before {moment(item?.expired_on).format("YYYY-MM-DD")}</p>

                    </div>
                    <button type='button' className='solid-button !px-[20px] !py-[10px]' onClick={() => difference > 0 ? router.push({ pathname: '/future/BTCUSDT' }) : ""}>{difference > 0 ? 'Use' : 'Expired'}</button>
                  </div>
                </div>
              </div>
            }
            else {
              return <div className='rounded-[10px] bg-white'>
                <div className='pl-[24px] py-[30px] pr-[0] rounded-[10px] bg-primary-400 relative z-[1] group relative after:w-[20px] after:h-[20px] after:absolute after:top-[calc(50%-10px)] after:left-[-10px] overflow-hidden after:bg-[#fff] after:dark:bg-d-bg-primary after:rounded-full before:w-[20px] before:h-[20px] before:absolute before:top-[calc(50%-10px)] before:right-[-10px] overflow-hidden before:bg-[#fff] before:dark:bg-d-bg-primary before:rounded-full'>
                  <div className='flex items-center justify-between gap-[15px]'>
                    <div>
                      <div className='flex items-center gap-[15px]'>
                        <h3 className='sec-title !text-white'>{item?.amount} USDT</h3>
                       
                      </div>
                      <p className='sm-text !text-white mt-[8px]'>{item?.type} · Derivatives</p>
                    </div>
                    <div>
                      <svg
                        className='opacity-[0.3] mr-[24px]'
                        width={97}
                        height={74}
                        viewBox="0 0 97 74"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M87.7959 19.7317C89.6811 19.3993 90.9382 17.6179 90.6095 15.7541L89.4932 9.42318C88.4501 3.50758 81.6432 -0.072221 73.9969 1.27602L46.7253 6.08474L48.5114 16.2142C48.84 18.078 47.583 19.8594 45.6978 20.1918C43.8127 20.5242 42.0221 19.2802 41.6935 17.4164L39.9074 7.28692L12.6358 12.0956C4.98952 13.4439 -0.182563 19.1359 0.860516 25.0515L1.97683 31.3824C2.30547 33.2462 4.09599 34.4902 5.98114 34.1578C11.4286 33.1973 17.1124 37.4834 18.1429 43.3281C19.0913 48.7069 15.4781 53.372 9.55333 54.4167C7.66818 54.7491 6.41111 56.5305 6.73975 58.3943L8.0049 65.5693C8.96463 71.0122 15.7061 74.2206 23.3524 72.8723L50.624 68.0636L48.8379 57.9342C48.5092 56.0704 49.7663 54.289 51.6515 53.9566C53.5366 53.6242 55.3271 54.8682 55.6558 56.732L57.4419 66.8614L84.7135 62.0527C92.3597 60.7045 97.5973 55.3839 96.6376 49.941L95.3724 42.766C95.0438 40.9021 93.2533 39.6582 91.3681 39.9906C85.4434 41.0353 80.4524 37.8872 79.504 32.5085C78.4734 26.6638 82.3484 20.6922 87.7959 19.7317ZM53.8697 46.6025C54.1983 48.4664 52.9412 50.2477 51.0561 50.5801C49.1709 50.9125 47.3804 49.6685 47.0518 47.8047L46.4564 44.4282C46.1278 42.5644 47.3849 40.7831 49.27 40.4507C51.1551 40.1183 52.9457 41.3622 53.2743 43.2261L53.8697 46.6025ZM50.8929 29.7201C51.2215 31.5839 49.9644 33.3653 48.0793 33.6977C46.1941 34.0301 44.4036 32.7861 44.075 30.9223L43.4796 27.5458C43.1509 25.682 44.408 23.9007 46.2932 23.5682C48.1783 23.2358 49.9688 24.4798 50.2975 26.3436L50.8929 29.7201Z"
                          fill="#fff"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className='border border-[#e9edf2] pt-[40px] mt-[-40px] rounded-[10px] p-[24px]'>
                  <div className='flex items-center mt-[24px] gap-[20px] justify-between'>
                    <div>
                      <div className='bg-[#3844520f] h-[8px] w-full max-w-[100px] rounded-[8px]'></div>

                    </div>
                    <button type='button' className='solid-button !px-[20px] !py-[10px]' onClick={() => updateClaimData(item)}>{'Claim Now'}</button>
                  </div>
                </div>
              </div>
            }
          })}

          {list && list.length === 0 &&
            <div className='rounded-[10px] bg-white'>
              No Records Found
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ReferRewardsRes