import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import IconsComponent from './icons';
import Link from 'next/link';
import MainResponsivePage from '../profile/responsive/main';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

interface profileSec {
    profileSec: boolean;
    profileInfo?: any;
    kycInfo?: any;
    referalList?: any;
    activity?: any;
    eventList?: any;
    rewardsList?: any;
}

const SideBar = (props: profileSec) => {

    const [show, setShow] = useState(0);
    const [profileImg, setProfileImg] = useState(props?.profileInfo && props?.profileInfo?.image !== null && props?.profileInfo?.messgae === undefined ? props?.profileInfo?.image : '');
    const router = useRouter()
    const [enableDp, setEnableDP] = useState(false);
    const { status, data: session } = useSession();
    const [imgSrc, setImgSrc] = useState(false);

    const [duserName, setduserName] = useState('');
    const [demail, setdemail] = useState('');
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    let data = [
        {
            "title": "Profile",
            "svgType": "profileIcon",
            "link": "/profile"
        },
        {
            "title": "Security",
            "svgType": "securityIcon",
            "link": "/profile/security"
        },
        // {
        //     "title": "Notification Preferences",
        //     "svgType": "notificationIcon",
        //     "link": "/profile/notification"
        // },
        {
            "title": "KYC Verification",
            "svgType": "kycIcon",
            "link": "/profile/kyc"
        },
        {
            "title": "My Rewards",
            "svgType": "refer",
            "link": "/profile/rewards"
        },
        {
            "title": "Referral Program",
            "svgType": "refer",
            "link": "/profile/refer"
        },

    ]
    // const readFile = (file: any) => {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);

    //         reader.onload = () => {
    //             resolve(reader.result);
    //         };
    //         reader.onerror = reject;
    //     });
    // };

    const handleProfiledpChange = async (e: any) => {

        if (status === 'unauthenticated') {
            toast.error('Your session is expired. You are auto redirect to login page!!');
            setTimeout(() => {
                signOut();
            }, 3000);
            return;
        }

        // const file = await readFile(e.target.files[0]);
        try {
            let file = e.target.files[0];
            const fileSize = file.size / 1024 / 1024;
            const fileType = file['type'];
            if (!validImageTypes.includes(fileType)) {
                // invalid file type code goes here.
                toast.error("Invalid file type, upload only (png, jpg,jpeg).")
                setEnableDP(false);
                return;
            }
            if (fileSize > 2) {
                toast.error("Upload file upto 2 mb.")
                setEnableDP(false);
                return;
            }
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'my-uploads');
            setEnableDP(true);
            const data = await fetch(`${process.env.NEXT_PUBLIC_FILEUPLOAD_URL}`, {
                method: 'POST',
                body: formData
            }).then(r => r.json());

            if (data.error !== undefined) {
                toast.error(data?.error?.message)
                setEnableDP(false);
                return;
            }

            if (data.format === 'pdf') {
                toast.error('Unsupported pdf file when upload dp')
                setEnableDP(false);
                return;
            }

            let obj = { image: data.secure_url };
            let response2 = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/profile/dp`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": session?.user?.access_token
                    },
                    body: JSON.stringify(obj),
                }
            ).then((response) => response.json());
            if (response2?.data?.status === 200) {
                setProfileImg(data.secure_url);
                setEnableDP(false);
            }
        } catch (error) {
            console.error(error);
            setEnableDP(false);
        }
        // let files = e.target.files[0];
        // var reader = new FileReader();
        // if (files) {
        //     reader.readAsDataURL(files);
        //     reader.onloadend = async function (e: any) {
        //         setProfileImg(reader.result as string);

        //         var formData = new FormData();
        //         formData.append("image", files);

        //         let response = await fetch(
        //             `${process.env.NEXT_PUBLIC_BASEURL}/profile/dp`,
        //             {
        //                 method: "POST",
        //                 headers: {
        //                     "Authorization": session?.user?.access_token
        //                 },
        //                 body: formData,
        //             }
        //         ).then((response) => response.json());

        //         if (response?.data?.status === 200) {
        //             const websocket = new WebSocket('ws://localhost:3001/');
        //             let profile = {
        //                 ws_type: 'profile',
        //                 user_id: session?.user?.user_id,
        //             }
        //             websocket.onopen = () => {
        //                 websocket.send(JSON.stringify(profile));
        //             }
        //         }

        //     }.bind(this);
        // }

    };

    useEffect(() => {
        if (props.profileInfo && props?.profileInfo?.messgae === undefined && props.profileInfo?.dName !== null) {
            setduserName(props.profileInfo?.dName?.[0].toUpperCase() + props.profileInfo?.dName?.slice(1));
        }
        if (session) {
            if (session?.user?.email !== null && session?.user?.email !== "") {
                let str = session?.user?.email.split('@');
                let substring = str[0].substring(0, 3);
                setdemail(substring + '****@' + str[1])
            }
            else if (session?.user?.number !== null && session?.user?.number !== "") {
                setdemail(session?.user?.number)
            }
        }
    }, [props.profileInfo]);

    return (
        <>
            <div className='max-w-full lg:max-w-[352px] rounded-10 w-full bg-white dark:bg-d-bg-primary shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]' >

                <div className='p-[19px] lg:p-[40px]'>
                    {
                        props.profileSec &&
                        <div className='mb-30 relative text-center'>
                            <div className='relative inline-block  mb-5 clip-bg'>
                                {enableDp &&
                                    <>
                                        <div className="bg-black  z-[1] duration-300 absolute top-0 left-0 h-full w-full opacity-80 visible"></div>
                                        <div className='loader w-[35px] z-[2] h-[35px] absolute top-[calc(50%-10px)] left-[calc(50%-10px)] border-[6px] border-[#d9e1e7] rounded-full animate-spin border-t-primary '></div>
                                    </>
                                }
                                {profileImg === '' && <Image src={`${process.env.NEXT_PUBLIC_AVATAR_PROFILE}`} width={125} height={125} alt='avtar profile' className='m-auto' />}
                                {profileImg !== '' &&
                                    <div
                                        className={`${profileImg !== ""
                                            ? "flex items-center  justufy-center"
                                            : "hidden"
                                            }`}
                                    >
                                        {profileImg && (
                                            <Image
                                                src={imgSrc?process.env.NEXT_PUBLIC_AVATAR_PROFILE : profileImg}
                                                width={125}
                                                height={125}
                                                alt="selfie Image"
                                                className="w-[133px] object-cover h-[133px] object-top"
                                                onError={() => setImgSrc(true)}
                                            />
                                        )}
                                    </div>
                                }
                                <div className="absolute bottom-0 left-0 bg-[#000000b3] w-full text-center  py-[8px] cursor-pointer">
                                    <input
                                        type="file"
                                        placeholder="Type Here...."
                                        id={`profiledp`}
                                        name="profiledp"
                                        autoComplete="off"
                                        className="hidden "
                                        onChange={(e) => {
                                            handleProfiledpChange(e);
                                        }}
                                    />
                                    <label
                                        htmlFor={`profiledp`}
                                        className="cursor-pointer block h-full items-stretch"
                                    >
                                        <p className="info-12 !text-white text-center  mb-2">
                                            Edit
                                        </p>
                                    </label>
                                </div>
                            </div>
                            <p className='sec-title text-center'>{duserName}</p>
                            <p className='info-14-18 text-center mt-[5px]'>{demail}</p>

                        </div>
                    }

                    <div className='hidden lg:block'>
                        {
                            data?.map((item, index) => {

                                return (
                                    <Link prefetch={false} href={item?.link} key={index} className={`${(router?.pathname === item?.link || router?.pathname.endsWith(item?.link)) && 'dark:bg-black-v-1 bg-primary-100'} rounded-[5px]  flex gap-[10px]  w-full cursor-pointer mb-[15px] items-center group md:mb-[10px] py-[15px] px-5`}>
                                        <div className='min-w-[22px]'>
                                            <IconsComponent type={item?.svgType} hover={true} active={(router?.pathname === item?.link || router?.pathname.endsWith(item?.link))? true : false} />
                                        </div>
                                        <p className={`info-14-18 whitespace-nowrap group-hover:text-primary ${(router?.pathname === item?.link || router?.pathname.endsWith(item?.link)) && 'text-primary'}`}>{item.title}</p>
                                    </Link>
                                )
                            })
                        }

                    </div>

                    {/* This is for mobile view */}
                    <div className='mt-[30px] lg:hidden block'>
                        {
                            data?.map((item, index) => {

                                return (
                                    <button onClick={() => { setShow(index + 1) }} type='button' key={index} className='flex gap-[10px] w-full cursor-pointer mb-[15px] items-center group md:mb-[10px] py-[15px] px-5'>
                                        <IconsComponent type={item.svgType} hover={true} active={false} />
                                        <p className='info-14-18 whitespace-nowrap group-hover:text-primary'>{item.title}</p>
                                    </button>
                                )
                            })
                        }

                    </div>
                    <div className='mt-30'>
                        <button className='solid-button w-full max-w-full' onClick={() => signOut()}>Log Out</button>
                    </div>
                </div>

            </div>
            {/* responsive tabs for profile pages */}
            <div className='lg:hidden block'>
                <MainResponsivePage show={show} setShow={setShow} profileInfo1={props.profileInfo} kycInfo={props.kycInfo} referalList={props.referalList} activity={props?.activity} eventList={props.eventList} rewardsList={props.rewardsList} />
            </div>
        </>
    )
}

export default SideBar
