import IconsComponent from '@/components/snippets/icons';
import Image from 'next/image'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react';
import AES from 'crypto-js/aes';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/router';
import Context from "../../contexts/context";
import ReactPaginate from 'react-paginate';
import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import { formatDate, truncateNumber } from '@/libs/subdomain';

/**
 * Interface for the props passed to the DesktopTable component.
 * 
 * This interface defines the optional props that the DesktopTable component can accept.
 * - firstCurrency: Represents the selected currency for the table.
 * - paymentId: The ID of the selected payment method.
 * - startDate: The start date for filtering or displaying data.
 * - userPaymentMethod: A list or object representing the payment methods of the user.
 * - selectedToken: The token currently selected by the user.
 * - active: Represents an active state or flag used for conditional rendering or logic.
 * - session: Contains session data, usually including user info and authentication details.
 */
interface DesktopTableProps {
    firstCurrency?: string;
    paymentId?: string;
    startDate?: string;
    userPaymentMethod?: any;
    selectedToken?: any;
    active?: any;
    session?: any;
}

import dynamic from 'next/dynamic';

const ConfirmationModel = dynamic(() => import('@/components/snippets/confirmation'), {
    loading: () => <p>Loading...</p>,
})

const DesktopTable = (props: DesktopTableProps) => {
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
    const [disable, setDisable] = useState(false)
    const { status, data: session } = useSession();

    const route = useRouter();

    /**
     * Effect to reset the item offset when the relevant filter properties change.
     * 
     * This effect runs whenever the `props.active`, `props.firstCurrency`, `props.paymentId`, or `props.startDate` change.
     * It resets the `itemOffset` to 0, ensuring the list view starts from the top when the filters change.
     */
    useEffect(() => {
        setItemOffset(0); // Reset itemOffset to 0 when filters change
    }, [props.active, props?.firstCurrency, props?.paymentId, props?.startDate]);

    /**
     * Effect to fetch advertisements when filters or item offset change.
     * 
     * This effect runs whenever any of the filter properties (`props.active`, `props.firstCurrency`, `props.paymentId`, `props.startDate`) or 
     * the `itemOffset` changes. It calls the `getAds` function to fetch the ads based on the updated filters and offset.
     */
    useEffect(() => {
        getAds(itemOffset);
    }, [props.active, itemOffset, props?.firstCurrency, props?.paymentId, props?.startDate])


    /**
     * Asynchronously fetches advertisements based on the provided filters and item offset.
     * 
     * This function retrieves a list of advertisements by calling an API endpoint with the relevant filter parameters:
     * - `status`: Determines whether the advertisements are active, inactive, or all.
     * - `itemOffset`: Used for pagination to fetch the corresponding set of ads.
     * - `itemsPerPage`: Defines the number of ads to fetch per page.
     * - `currency`: The token's ID (selectedToken) or "all" if no token is selected.
     * - `pmMethod`: The payment method ID (paymentId) or "all" if no payment method is selected.
     * - `date`: Filters by date, or "all" if no date is selected.
     * 
     * Once the data is fetched, it processes the payment methods for each post, matching them to user payment methods.
     * It then updates the state with the total number of posts and the list of advertisements.
     * 
     * @param {number} itemOffset - The offset for pagination.
     */
    const getAds = async (itemOffset: number) => {
        try {
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

    /**
     * Handles page click events for pagination and updates the item offset based on the selected page.
     * 
     * This function is triggered when the user clicks on a page number in the pagination component. 
     * It calculates the new offset for the items to be displayed based on the selected page.
     * The offset is calculated as the product of the selected page number and the number of items per page, 
     * ensuring that the correct set of items is shown for the selected page.
     * 
     * @param {Object} event - The event object containing the selected page information.
     * @param {number} event.selected - The index of the selected page (starts from 0).
     */
    const handlePageClick = async (event: any) => {
        const newOffset = (event.selected * itemsPerPage) % total;
        setItemOffset(newOffset);

    };

    /**
     * Performs an action based on the authentication status of the user.
     * 
     * This function is called when the user attempts to perform an action related to a post. 
     * It checks the user's authentication status and, if authenticated, performs a POST request 
     * to update the post details. The post's ID and the user’s ID are encrypted before sending the request.
     * If the request is successful, it updates the state to reflect the change; otherwise, it displays an error.
     * If the user is unauthenticated, they are signed out and an error message is shown.
     * 
     * @async
     */
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

                if (postResponse?.data?.message) {
                    toast.warning(postResponse?.data?.message, { autoClose: 2000 })
                }

                let remainingPost = postList.filter((item: any) => {
                    return item.id !== postResponse?.data?.id
                })
                setTimeout(() => {
                    setDisable(false)
                }, 3000)
                setPostList(remainingPost);
                setShowPopup(false);
                setShow(false);
            }
            else {
                toast.error(postResponse?.data, { autoClose: 2000 })
                setTimeout(() => {
                    setDisable(false)
                }, 3000)
            }
        }
        else if (status === 'unauthenticated') {
            toast.error('Unauthorized user!!')
            signOut();
        }
    }

    /**
     * Updates the status of an advertisement based on its availability.
     * 
     * This function handles the logic for updating the status of an advertisement. 
     * It first checks if the user is authenticated. If the advertisement's quantity is zero, 
     * it returns early without making any changes. If the advertisement is available, 
     * it sends an encrypted request with the post ID and user ID to update the advertisement status 
     * using a PUT request. On success, it updates the post list and shows a success message. 
     * If the update fails or the user is unauthenticated, an error message is displayed.
     * 
     * @async
     * @param {any} postid - The advertisement post object containing the ID and quantity.
     */
    const updateAdsStatus = async (postid: any) => {
        // Check if the user is authenticated
        if (status === 'authenticated') {
            setDisable(true)
            // If the post's quantity is zero, do nothing and re-enable the button
            if (postid?.quantity == 0) {
                setDisable(false)
                return
            }
            else {
                // Prepare the request object containing the post ID and user ID
                let obj = {
                    post_id: postid?.id,
                    user_id: session?.user?.user_id
                }

                // Encrypt the request object using AES encryption with a secret passphrase
                const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
                let record = encodeURIComponent(ciphertext.toString());

                // Send a PUT request to the server to update the advertisement status
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
                    toast.success(`Post ${putResponse?.data?.result?.status === true ? "Active" : "Inactive"}  successfully`, { autoClose: 2000 })
                    setTimeout(() => {
                        setDisable(false)
                    }, 3000)
                    setPostList(remainingPost);
                    setActive(0);
                    setShow(false);
                }
                else {
                    toast.error(putResponse?.data, { autoClose: 2000 })
                    setTimeout(() => {
                        setDisable(false)
                    }, 3000)
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
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{formatDate(item?.createdAt, "yyyy-MM-dd HH:mm:ss")}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <div className='flex items-center '>
                                                    {
                                                        item?.user_p_method && item?.user_p_method.length > 0 && item?.user_p_method.map((elem: any, ind: number) => {
                                                            const iconClass = ind === 0 ? '' : 'ml-[-10px]';
                                                            return (
                                                                <Fragment key={ind}>
                                                                    <Image loading='lazy' src={`${elem.master_payment_method.icon}`} alt='error' width={30} height={30} className={iconClass} />
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
                                            loading='lazy'
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
            {
                pageCount > 1 &&
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
            }
            {showPopup &&
                <ConfirmationModel setActive={setShowPopup} setShow={setShow} title={title} message={message} show={show} actionPerform={actionPerform} />
            }
        </>
    )
}

export default DesktopTable