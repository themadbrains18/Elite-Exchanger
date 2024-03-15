import IconsComponent from '@/components/snippets/icons';
import Image from 'next/image';
import React from 'react'
import Avtar from '../../../public/assets/header/Avatar.png';
import { useSession } from 'next-auth/react';

interface propsData {
    userDetail?: any;
}

const UserCenterProfile = (props: propsData) => {

    const { status, data: session } = useSession();

    // console.log(props?.userDetail?.User,'============userDetail User================');
    

    return (
        <div>
            <div className='mt-40 mb-30'>
                <div className='flex items-center md:justify-between'>

                    <div className='flex md:flex-row flex-col items-center gap-[20px] cursor-pointer  relative'>
                        <div>
                            {props?.userDetail && props?.userDetail?.image &&
                                <Image src={`${props?.userDetail?.image}`} alt='profile' width={100} height={100} className='rounded-full h-[130px] w-[130px] object-cover' />
                            }
                            {props?.userDetail?.fName === undefined &&
                                <Image src={`${process.env.NEXT_PUBLIC_AVATAR_PROFILE}`} alt='error' width={100} height={100} className='rounded-full' />
                            }

                        </div>
                        <div className='md:text-start text-center'>
                            <p className='sec-title'>{props?.userDetail ? props?.userDetail.fName : session?.user?.name}</p>
                            <p className='sec-text !text-gamma'>{props?.userDetail ? props?.userDetail.dName : session?.user?.name}</p>
                        </div>
                    </div>

                    {/* <div className="py-[13px] px-[15px] border cursor-pointer dark:border-opacity-[15%] border-grey-v-1 items-center rounded-5 hidden md:flex gap-[10px]">

                        <Image src="/assets/profile/edit.svg" width={24} height={24} alt="edit"></Image>
                        <p className="nav-text-sm">Edit</p>
                    </div> */}

                </div>
            </div>
            <div className='overflow-x-auto'>
                <div className='flex items-center gap-[24px] w-fit'>
                    <div className='flex items-center gap-[15px] border dark:border-opacity-[15%] border-grey-v-1 p-10 md:px-[20px] md:py-[14px] rounded-[5px]'>
                        <IconsComponent type='verified' hover={false} active={false} />
                        <p className='info-14-18 !text-[18px] dark:!text-white !text-banner-text whitespace-nowrap'>E-mail</p>
                    </div>
                    <div className='flex items-center gap-[15px] border dark:border-opacity-[15%] border-grey-v-1 p-10 md:px-[20px] md:py-[14px] rounded-[5px]'>
                        <IconsComponent type={( props?.userDetail && props?.userDetail?.user !==undefined && (props?.userDetail?.user?.tradingPassword!== "" || props?.userDetail?.user?.tradingPassword!== null ||  props?.userDetail?.user?.tradingPassword!== undefined) )?'verified':'infoIconRed'} hover={false} active={false} />
                        <p className='info-14-18 !text-[18px] dark:!text-white !text-banner-text whitespace-nowrap'>Trade Password</p>
                    </div>
                    <div className='flex items-center gap-[15px] border dark:border-opacity-[15%] border-grey-v-1 p-10 md:px-[20px] md:py-[14px] rounded-[5px]'>
                        <IconsComponent type={(props?.userDetail && props?.userDetail?.user !==undefined && props?.userDetail?.user?.user_kyc!== "" && props?.userDetail?.user?.user_kyc!== null)?'verified':'infoIconRed'} hover={false} active={false} />
                        <p className='info-14-18 !text-[18px] dark:!text-white !text-banner-text'>KYC</p>
                    </div>
                    <div className='flex items-center gap-[15px] border dark:border-opacity-[15%] border-grey-v-1 p-10 md:px-[20px] md:py-[14px] rounded-[5px]'>
                        <IconsComponent type={( props?.userDetail && props?.userDetail?.user !==undefined &&props?.userDetail?.user?.number!== "" && props?.userDetail?.user?.number!== null)?'verified':'infoIconRed'} hover={false} active={false} />
                        <p className='info-14-18 !text-[18px] dark:!text-white !text-banner-text'>SMS</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCenterProfile;