import Context from '@/components/contexts/context';
import ConfirmationModel from '@/components/snippets/confirmation';
import IconsComponent from '@/components/snippets/icons';
import { AES } from 'crypto-js';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { Fragment, useContext, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
interface MobileTableProps {
    firstCurrency?: string;
    paymentId?: string;
    startDate?: string;
    userPaymentMethod?: any;
    selectedToken?: any;
    active?: any;
    session?: any;
}

const MobileTable = (props: MobileTableProps) => {
    const { mode } = useContext(Context)
    const route = useRouter();
    const [postList, setPostList] = useState([]);
    let itemsPerPage = 10;
    const [itemOffset, setItemOffset] = useState(0);
    const [total, setTotal] = useState(0)
    const [postId, setPostId] = useState('');
    const [active, setActive] = useState(0);
    const [show, setShow] = useState(false);
    const { data: session, status } = useSession()

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
     * Performs an action related to the advertisement.
     * 
     * This function handles the action of performing a POST request to update or perform an operation
     * related to an advertisement. The function checks if the user is authenticated, prepares the request 
     * object, encrypts the data using AES encryption, and sends the request. On success, it updates the 
     * post list and resets certain UI states. If the request fails, it shows an error message. 
     * If the user is unauthenticated, it signs out the user and shows an unauthorized error.
     * 
     * @async
     */
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
                    "Authorization": props?.session?.user?.access_token
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

    /**
     * Updates the status of an advertisement.
     * 
     * This function updates the status of a specific advertisement by making a PUT request to the 
     * server. It checks if the user is authenticated, prepares the request with necessary data, 
     * encrypts it using AES encryption, and sends the request to the server. On successful response, 
     * the function updates the post list, shows a success message, and resets certain UI states. 
     * If the user is unauthenticated, an error message is displayed.
     * 
     * @async
     * @param {string} postid - The ID of the advertisement to update.
     */
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
                getAds(0)
                toast.success(`Post ${putResponse?.data?.result?.status === true ? "Active" : "Inactive"}  successfully`)

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
            <ToastContainer limit={1} />
            <div>
                {
                    postList && postList.length > 0 && postList?.map((item: any, ind: any) => {
                        return (
                            <Fragment key={ind}>
                                <div className='grid grid-cols-2 py-[15px] border-b-[0.5px]  dark:border-[#efefef26] border-grey-v-2'>
                                    <div className=''>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Assets</p>
                                        <p className='info-14-18 !text-nav-primary dark:!text-white'>{item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                                    </div>
                                    <div className='text-end'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Type</p>
                                        <p className={`info-14-18  !text-buy `}>BUY</p>
                                    </div>
                                    <div className='mt-[15px]'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Remaining</p>
                                        <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.quantity} {item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                                    </div>
                                    {/* <div  className='text-end mt-[15px]'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Payment</p>
                                        <div className='flex items-center gap-10 justify-end'>
                                            {
                                                item?.p_method?.map((elem:any,ind:number)=>{
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
                                    <div className='mt-[15px] '>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Status</p>
                                        <div className="flex items-center justify-start w-full" >
                                            <label htmlFor={item?.id} className="flex items-center cursor-pointer">
                                                <input type="checkbox" id={item?.id} className="sr-only peer" checked={item?.status} onChange={() => { (props.active === undefined || props.active !== 3) && updateAdsStatus(item?.id) }} />
                                                <div className={`block relative bg-[#CCCED9] w-[50px] h-[25px] p-1 rounded-full before:absolute before:top-[3px] before:bg-blue-600 before:w-[19px] before:h-[19px] before:p-1 before:rounded-full before:transition-all before:duration-500 before:left-1 peer-checked:before:left-[27px] before:bg-white peer-checked:!bg-primary peer-checked:before:!bg-white `} ></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className=' mt-[15px] text-end'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px] mb-[5px]'>Actions</p>
                                        <div className='flex items-center gap-10 justify-end'>
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
            {postList && postList?.length === 0 &&
                <div className={` py-[50px] flex flex-col items-center justify-center ${mode === "dark" ? 'text-[#ffffff]' : 'text-[#000000]'}`}>
                    <Image
                        src="/assets/refer/empty.svg"
                        alt="emplty table"
                        width={107}
                        height={104}
                    />
                    <p > No Record Found </p>
                </div>
            }
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
                        renderOnZeroPageCount={null} />
                </div>
            }
            {active === 1 &&
                <ConfirmationModel setActive={setActive} setShow={setShow} title='Delete Ads' message='Are you sure you want to delete your ads with remaining quantity?' show={show} actionPerform={actionPerform} />
            }
        </>
    )
}

export default MobileTable;