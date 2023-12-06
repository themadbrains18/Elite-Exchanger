import ConfirmationModel from '@/components/snippets/confirmation';
import IconsComponent from '@/components/snippets/icons';
import { AES } from 'crypto-js';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { Fragment, useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface dataTypes {
    data: any;
}
const MobileTable = (props: dataTypes) => {
    const route = useRouter();
    const [postList, setPostList] = useState(props.data);
    const [postId, setPostId] = useState('');
    const [active, setActive] = useState(0);
    const [show, setShow] = useState(false);
    const {data:session,status} = useSession()

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

    return (
        <>
          <ToastContainer />
            <div>
                {
                    props.data.map((item:any, ind:any) => {
                        return (
                            <Fragment key={ind}>

                                {/* assets:"6",
                                currency:"USDT",
                                type:"BUY",
                                exchangeRate:"80.54 INR ",
                                remaining:"15.25641 USDT",
                                createTime:"20 Mar, 2022 ( 22:40 )",
                                PaymentMethod: ['phonepay.png','paytm.png','gpay.png'] */}

                                <div className='grid grid-cols-2 py-[15px] border-b-[0.5px]  dark:border-[#efefef26] border-grey-v-2'>
                                    <div className=''>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Assets</p>
                                        <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.quantity}&nbsp;{item?.token?.symbol}</p>
                                    </div>
                                    <div className='text-end'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Type</p>
                                        <p className={`info-14-18  !text-buy `}>BUY</p>
                                    </div>
                                    <div className='mt-[15px]'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Remaining</p>
                                        <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.quantity} {item?.token?.symbol}</p>
                                    </div>
                                    {/* <div  className='text-end mt-[15px]'>
                                <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Payment</p>
                                <div className='flex items-center gap-10 justify-end'>
                                    {
                                        item.PaymentMethod.map((elem,ind)=>{
                                            return(
                                                <Fragment key={ind}>
                                                    <Image src={`/assets/payment-methods/${elem}`} alt='error' width={16} height={16} />
                                                </Fragment>
                                            )
                                        })
                                    }
                                </div>
                            </div> */}
                                    <div className='mt-[15px] text-end'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Create Time </p>
                                        <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.createdAt}</p>
                                    </div>
                                    <div className=' mt-[15px]'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Actions</p>
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
                                    </div>
                                </div>
                            </Fragment>
                        )
                    })
                }

            </div>
            {active === 1 &&
                <ConfirmationModel setActive={setActive} setShow={setShow} title='Delete Ads' message='Are you sure you want to delete your ads with remaining quantity?' show={show} actionPerform={actionPerform} />
            }
        </>
    )
}

export default MobileTable;