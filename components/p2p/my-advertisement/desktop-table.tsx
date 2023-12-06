import IconsComponent from '@/components/snippets/icons';
import Image from 'next/image'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import moment from 'moment';
import ConfirmationModel from '@/components/snippets/confirmation';
import { signOut, useSession } from 'next-auth/react';
import AES from 'crypto-js/aes';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/router';
import Context from "../../contexts/context";

interface dataTypes {
    data: any;
    updatePublishedPsot?: any;
    active?: any;
}
const DesktopTable = (props: dataTypes) => {
    const { mode } = useContext(Context);
    const [postList, setPostList] = useState(props.data);
    const [postId, setPostId] = useState('');
    const [active, setActive] = useState(0);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('Are you sure you want to delete your ads with remaining quantity?');
    const [title, setTitle] = useState('Delete Ads');

    const { status, data: session } = useSession();

    const route = useRouter();

    useEffect(()=>{
        setPostList(props.data);
    },[props.data])
    

    const actionPerform = async () => {

        if (status === 'authenticated') {
            let obj = {
                post_id: postId,
                user_id: session?.user?.user_id
            }

            const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
            let record = encodeURIComponent(ciphertext.toString());

            let postResponse: any = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/advertisement`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": session?.user?.access_token
                },
                body: JSON.stringify(record)
            }).then(response => response.json());

            if (postResponse?.data) {

                let remainingPost = postList.filter((item: any) => {
                    return item.id !== postResponse?.data?.id
                })

                setPostList(remainingPost);
                setActive(0);
                setShow(false);
            }
            else {
                toast.error(postResponse?.data)
            }
        }
        else if (status === 'unauthenticated') {
            toast.error('Unauthorized user!!')
            signOut();
        }
    }

    const updateAdsStatus = async (postid: string) => {
        if (status === 'authenticated') {
            let obj = {
                post_id: postid,
                user_id: session?.user?.user_id
            }

            const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
            let record = encodeURIComponent(ciphertext.toString());

            let putResponse: any = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/editadvertisement`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": session?.user?.access_token
                },
                body: JSON.stringify(record)
            }).then(response => response.json());

            if (putResponse?.data) {

                let remainingPost = postList.filter((item: any) => {
                    return item.id !== putResponse?.data?.result?.id
                })
                toast.success(`Post ${putResponse?.data?.result?.status=== true?"Active":"Inactive"}  successfully`)
                setPostList(remainingPost);
                props.updatePublishedPsot(putResponse?.data?.result);
                setActive(0);
                setShow(false);
            }
            else {
                toast.error(putResponse?.data)
            }
        }
        else if (status === 'unauthenticated') {
            toast.error('Unauthorized user!!')
        }
    }
    

    return (
        <>
            <ToastContainer />
            <div className='mt-20'>
                <table width="100%">
                    <thead>
                        <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">
                            <th className="bg-white dark:bg-d-bg-primary py-5">
                                <div className="flex ">
                                    <p className="nav-text-sm">Assets</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="bg-white dark:bg-d-bg-primary py-5">
                                <div className="flex ">
                                    <p className="nav-text-sm">Type</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="bg-white dark:bg-d-bg-primary py-5">
                                <div className="flex ">
                                    <p className="nav-text-sm">Exchange Rate</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="bg-white dark:bg-d-bg-primary py-5">
                                <div className="flex ">
                                    <p className="nav-text-sm">Remaining</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="bg-white dark:bg-d-bg-primary py-5">
                                <div className="flex ">
                                    <p className="nav-text-sm">Create Time  </p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="bg-white dark:bg-d-bg-primary py-5">
                                <div className="flex ">
                                    <p className="nav-text-sm">Payment Method</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="bg-white dark:bg-d-bg-primary py-5">
                                <div className="flex ">
                                    <p className="nav-text-sm">Status</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            {(props.active === undefined || props.active !== 3) &&
                                <th className="bg-white dark:bg-d-bg-primary py-5">
                                    <div className="flex ">
                                        <p className="nav-text-sm">Action</p>
                                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                    </div>
                                </th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            postList.map((item: any, ind: any) => {
                                return (
                                    <Fragment key={ind}>
                                        <tr>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.quantity}&nbsp;{item?.token?.symbol}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className={`info-14-18 !text-buy`}>BUY</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.price} INR</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.quantity} {item?.token?.symbol}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <div className='flex items-center gap-10'>
                                                    {
                                                        item.user_p_method.map((elem: any, ind: any) => {
                                                            return (
                                                                <Fragment key={ind}>
                                                                    <Image src={`${process.env.NEXT_PUBLIC_APIURL}/payment_icon/${elem.master_payment_method.icon}`} alt='error' width={30} height={30} />
                                                                </Fragment>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5 cursor-pointer">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white' onClick={() => { (props.active === undefined || props.active !== 3) ? updateAdsStatus(item?.id) : '' }}>{item?.status === true ? 'Active' : 'InActive'}</p>
                                            </td>
                                            {(props.active === undefined || props.active !== 3) &&
                                                <td>
                                                    <div className='flex items-center gap-10'>
                                                        {item?.status === false &&
                                                            <button onClick={() => route.push(`/p2p/editpostad?postid=${item?.id}`)}>
                                                                <IconsComponent type='editIcon' hover={false} active={false} />
                                                            </button>
                                                        }
                                                        <button onClick={() => { setActive(1); setShow(true); setPostId(item?.id) }}>
                                                            <IconsComponent type='deleteIcon' hover={false} active={false} />
                                                        </button>
                                                    </div>
                                                </td>
                                            }

                                        </tr>
                                    </Fragment>
                                )
                            })
                        }

                        {postList.length === 0 &&
                            <tr>
                                <td colSpan={8}>
                                    <div className={` py-[50px] flex flex-col items-center justify-center ${mode === "dark" ? 'text-[#ffffff]' : 'text-[#000000]'}`}>
                                        <Image
                                            src="/assets/refer/empty.svg"
                                            alt="emplty table"
                                            width={107}
                                            height={104}
                                        />
                                        <p > No Record Found </p>
                                    </div>

                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            {active === 1 &&
                <ConfirmationModel setActive={setActive} setShow={setShow} title={title} message={message} show={show} actionPerform={actionPerform} />
            }
        </>
    )
}

export default DesktopTable