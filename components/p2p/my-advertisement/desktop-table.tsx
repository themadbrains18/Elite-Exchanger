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
import ReactPaginate from 'react-paginate';
import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import { truncateNumber } from '@/libs/subdomain';

interface dataTypes {

    firstCurrency?: string;
    paymentId?: string;
    startDate?: string;
    userPaymentMethod?: any;
    selectedToken?: any;
    active?: any;
    session?: any;
}
const DesktopTable = (props: dataTypes) => {
    const { mode } = useContext(Context);
    const [postList, setPostList] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);
    const [total, setTotal] = useState(0)

    let itemsPerPage = 10;
    const [postId, setPostId] = useState('');
    const [active, setActive] = useState(0);
    const [showPopup, setShowPopup] = useState(false)
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('Are you sure you want to delete your ads with remaining quantity?');
    const [title, setTitle] = useState('Delete Ads');
const [disable, setDisable]= useState(false)
    const { status, data: session } = useSession();

    const route = useRouter();

    useEffect(() => {
        setItemOffset(0); // Reset itemOffset to 0 when filters change
    }, [props.active, props?.firstCurrency, props?.paymentId, props?.startDate]);

    useEffect(() => {
        getAds(itemOffset);
    }, [props.active, itemOffset, props?.firstCurrency, props?.paymentId, props?.startDate])


    const getAds = async (itemOffset: number) => {
        try {
            // console.log("called");
            let paymentMethod = props?.paymentId !== undefined && props?.paymentId !== "" ? props?.paymentId : "all"
            let currency = props?.selectedToken !== undefined && props?.selectedToken !== "" ? props?.selectedToken?.id : "all"
            let date = props?.startDate !== undefined && props?.startDate !== "" ? new Date(props?.startDate).toISOString() : "all"

            if (itemOffset === undefined) {
                itemOffset = 0;
            }


            let userAllOrderList: any = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/advertisement?status=${props?.active === 1 ? true : props?.active === 2 ? false : "all"}&itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}&currency=${currency || "all"}&pmMethod=${paymentMethod}&date=${date}`, {
                method: "GET",
                headers: {
                    "Authorization": props?.session?.user?.access_token
                },
            }).then(response => response.json());

            if (userAllOrderList?.data?.totalLength <= 10) {
                setItemOffset(0)
            }
            for (const post of userAllOrderList?.data?.data) {
                let payment_method: any = [];
                for (const upid of post.p_method) {
                    props.userPaymentMethod.filter((item: any) => {
                        if (item.id === upid?.upm_id) {
                            payment_method.push(item);

                        }
                    })
                }
                post.user_p_method = payment_method;
            }

            setTotal(userAllOrderList?.data?.totalLength);
            setPostList(userAllOrderList?.data?.data);

        } catch (error) {
            console.log("error in get token list", error);

        }
    };
    const pageCount = Math.ceil(total / itemsPerPage);

    const handlePageClick = async (event: any) => {
        const newOffset = (event.selected * itemsPerPage) % total;
        setItemOffset(newOffset);

    };


    const actionPerform = async () => {

        if (status === 'authenticated') {
            setDisable(true)
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
                    "Authorization": props?.session?.user?.access_token
                },
                body: JSON.stringify(record)
            }).then(response => response.json());

            if (postResponse?.data) {

                if(postResponse?.data?.message){
                    toast.warning(postResponse?.data?.message,{autoClose:2000})
                }

                let remainingPost = postList.filter((item: any) => {
                    return item.id !== postResponse?.data?.id
                })
                setTimeout(()=>{
                    setDisable(false)
                },3000)
                setPostList(remainingPost);
                setShowPopup(false);
                setShow(false);
            }
            else {
                toast.error(postResponse?.data, {autoClose:2000})
                setTimeout(()=>{
                    setDisable(false)
                },3000)
            }
        }
        else if (status === 'unauthenticated') {
            toast.error('Unauthorized user!!')
            signOut();
        }
    }

    const updateAdsStatus = async (postid: any) => {

        if (status === 'authenticated') {
            setDisable(true)
            if (postid?.quantity == 0) {
                setDisable(false)
                return
            }
            else {
                let obj = {
                    post_id: postid?.id,
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
                    getAds(0)
                    toast.success(`Post ${putResponse?.data?.result?.status === true ? "Active" : "Inactive"}  successfully`,{autoClose:2000})
                    setTimeout(()=>{
                        setDisable(false)
                    },3000)
                    setPostList(remainingPost);
                    setActive(0);
                    setShow(false);
                }
                else {
                    toast.error(putResponse?.data,{autoClose:2000})
                    setTimeout(()=>{
                        setDisable(false)
                    },3000)
                }

            }
        }
        else if (status === 'unauthenticated') {
            toast.error('Unauthorized user!!')
        }

    }


    return (
        <>
            <ToastContainer limit={1} />
            <div className='mt-20 asdasdasdasd'>
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
                                    <p className="nav-text-sm">Remaining Qty.</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="bg-white dark:bg-d-bg-primary py-5">
                                <div className="flex ">
                                    <p className="nav-text-sm">Date & Time  </p>
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
                            postList && postList.length > 0 && postList?.map((item: any, ind: any) => {
                                return (
                                    <Fragment key={ind}>
                                        <tr>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className={`info-14-18 !text-buy`}>BUY</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{currencyFormatter(truncateNumber(item.price, 6))} INR</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{truncateNumber(parseFloat(item?.quantity), 6)}  {item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <div className='flex items-center '>
                                                    {
                                                        item?.user_p_method && item?.user_p_method.length > 0 && item?.user_p_method.map((elem: any, ind: number) => {
                                                            const iconClass = ind === 0 ? '' : 'ml-[-10px]';
                                                            return (
                                                                <Fragment key={ind}>
                                                                    <Image src={`${elem.master_payment_method.icon}`} alt='error' width={30} height={30} className={iconClass} />
                                                                </Fragment>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5 cursor-pointer">
                                                {/* {item?.status === true ? 'Active' : 'InActive'} */}

                                                <div className="flex items-center justify-start w-full" >
                                                    <label htmlFor={item?.id} className="flex items-center cursor-pointer">
                                                        <input type="checkbox" id={item?.id} disabled={disable} className={`sr-only peer `} checked={item?.status} onChange={() => { (props.active === undefined || props.active !== 3) && updateAdsStatus(item) }} />
                                                        <div className={`block relative bg-[#CCCED9] w-[50px] h-[25px] p-1 rounded-full before:absolute before:top-[3px] ${disable && 'cursor-not-allowed'} before:bg-blue-600 before:w-[19px] before:h-[19px] before:p-1 before:rounded-full before:transition-all before:duration-500 before:left-1 peer-checked:before:left-[27px] before:bg-white peer-checked:!bg-primary peer-checked:before:!bg-white `} ></div>
                                                    </label>
                                                </div>
                                            </td>

                                            {(props.active === undefined || props.active !== 3) &&
                                                <td>
                                                    <div className='flex items-center gap-10'>
                                                        {item?.status === false &&
                                                            <button onClick={() => route.push(`/p2p/editpostad?postid=${item?.id}`)}>
                                                                <IconsComponent type='editIcon' hover={false} active={false} />
                                                            </button>
                                                        }
                                                        <button className={` ${disable && 'cursor-not-allowed'}`} disabled={disable} onClick={() => { setShowPopup(true); setShow(true); setPostId(item?.id) }}>
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

                        {postList && postList?.length === 0 &&
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
            <div className="flex pt-[25px] items-center justify-end">
                <ReactPaginate
                    className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""}`}
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                    forcePage={Math.floor(itemOffset / itemsPerPage)} />
            </div>
            {showPopup &&
                <ConfirmationModel setActive={setShowPopup} setShow={setShow} title={title} message={message} show={show} actionPerform={actionPerform} />
            }
        </>
    )
}

export default DesktopTable