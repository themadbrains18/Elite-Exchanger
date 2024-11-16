import Context from '@/components/contexts/context';
import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import { truncateNumber } from '@/libs/subdomain';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

/**
 * Props for the BuyTableMobile component that manages the buy table display on mobile devices.
 * It contains information related to the user's session, selected token, payment method, 
 * and actions such as showing modals or selecting posts.
 * 
 * @interface BuyTableMobileProps
 * 
 * @property {Function} setShow1 - A function to control the visibility of a modal or table.
 * @property {Function} [setSelectedPost] - Optional function to set the selected post for further actions.
 * @property {string} [paymentId] - Optional string representing the payment method ID.
 * @property {any} [selectedToken] - Optional selected token object, could be a specific cryptocurrency or token.
 * @property {string} [firstCurrency] - Optional string representing the first selected currency in the transaction.
 * @property {any} [session] - Optional session object that contains the user’s session details, such as user information and authentication status.
 * 
 * @example
 * // Example usage:
 * const props: BuyTableMobileProps = {
 *   setShow1: (show: boolean) => { console.log(show); },
 *   setSelectedPost: (post: any) => { console.log(post); },
 *   paymentId: '123abc',
 *   selectedToken: { id: 'token1', name: 'Bitcoin' },
 *   firstCurrency: 'USD',
 *   session: { user: { id: 'user1', name: 'John Doe' } }
 * };
 */
interface BuyTableMobileProps {
    setShow1: any;
    setSelectedPost?: any;
    paymentId?: string;
    selectedToken?: any;
    firstCurrency?: string;
    session?: any;
}

const BuyTableMobile = (props: BuyTableMobileProps) => {
    const [itemOffset, setItemOffset] = useState(0);
    const { mode } = useContext(Context);
    const { status, data: session } = useSession();
    const [total, setTotal] = useState(0)
    const [list, setList] = useState([])
    let itemsPerPage = 10;

    /**
     * useEffect hook that triggers the fetching of posts whenever the item offset, 
     * selected currency, or payment ID changes.
     * 
     * @useEffect
     * The effect fetches posts based on pagination and filters (payment method and selected token).
     * 
     * @param {number} itemOffset - The offset for pagination to fetch the correct set of posts.
     * @param {string} [props?.firstCurrency] - Optional currency for filtering posts by the first currency.
     * @param {string} [props?.paymentId] - Optional payment method ID for filtering posts by payment method.
     * @param {any} [props?.selectedToken] - The selected token object used to filter posts based on currency.
     * @param {any} [props?.session] - The session object containing user details for authentication.
     */
    useEffect(() => {
        getAllPosts(itemOffset);
    }, [itemOffset, props?.firstCurrency, props?.paymentId]);

    /**
     * Asynchronous function that fetches all posts from the API based on pagination and filters.
     * The function retrieves posts from a backend API and applies filters for the currency and payment method.
     * It also processes the response to include user payment methods for each post.
     * 
     * @async
     * @function getAllPosts
     * @param {number} itemOffset - The offset for pagination to fetch posts.
     * 
     * @returns {void}
     * 
     * @throws {Error} Will throw an error if fetching posts fails.
     * 
     * @example
     * // Example usage:
     * getAllPosts(0);  // Fetch posts starting from the first item
     */
    const getAllPosts = async (itemOffset: number) => {
        try {
            if (itemOffset === undefined) {
                itemOffset = 0;
            }

            let paymentMethod = props?.paymentId !== undefined && props?.paymentId !== "" ? props?.paymentId : "all"
            let currency = props?.selectedToken !== undefined && props?.selectedToken !== "" ? props?.selectedToken?.id : "all"

            let posts = await fetch(
                `/api/p2p/buy?user_id=${props?.session?.user?.user_id}&itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}&currency=${currency || "all"}&pmMethod=${paymentMethod}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": props?.session?.user?.access_token
                    },
                }
            ).then((response) => response.json());
            for (const post of posts?.data?.data) {
                let payment_method: any = [];
                for (const upid of post.p_method) {
                    post?.user?.user_payment_methods?.filter((item: any) => {
                        if (item.id === upid?.upm_id) {
                            payment_method.push(item);
                        }
                    })
                }
                post.user_p_method = payment_method;
            }
            // Update totalLength based on filtered data length
            const totalLength = posts.data.data.length;
            setTotal(totalLength);
            setList(posts.data.data);
            setTotal(posts?.data?.totalLength)
        } catch (error) {
            console.log("error in get token list", error);
        }
    };


    // const endOffset = itemOffset + itemsPerPage;
    // const currentItems = data?.data?.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(total / itemsPerPage);

    /**
     * Handles the page click event for pagination.
     * 
     * This function is triggered when a user clicks a page number in a pagination component.
     * It calculates the new offset based on the selected page and updates the item offset 
     * to fetch the corresponding data.
     * 
     * @async
     * @function handlePageClick
     * @param {object} event - The event object triggered by the page click.
     * @param {number} event.selected - The index of the selected page.
     * 
     * @returns {void}
     * 
     * @example
     * // Example usage: 
     * handlePageClick({ selected: 2 });  // Moves to the third page and fetches the data
     */
    const handlePageClick = async (event: any) => {
        const newOffset = (event.selected * itemsPerPage) % total;
        setItemOffset(newOffset);

    };

    return (
        <>
            {
                list && list?.length > 0 && list?.map((item: any, ind: number) => {
                    if (session?.user?.user_id !== item?.user_id) {
                        const profileImg = item?.user?.profile && item?.user?.profile?.image !== null ? `${item?.user?.profile?.image}` : `/assets/orders/user1.png`;
                        const userName = item?.user?.profile && item?.user?.profile?.dName !== null ? item?.user?.profile?.dName : item?.user?.user_kyc?.fname;
                        let payment_method: any = [];

                        for (const upid of item?.user?.user_payment_methods) {
                            item?.p_method?.filter((e: any) => {
                                if (e?.upm_id === upid?.id) {
                                    payment_method.push(upid);
                                }
                            })
                        }
                        return (
                            <Fragment key={ind}>
                                {/* row */}
                                <div className='grid grid-cols-2 py-[15px] border-b-[0.5px]  dark:border-[#efefef26] border-grey-v-2'>

                                    <div>
                                        <div className="flex gap-2 md:py-[15px] items-center px-0 md:px-[5px] ">
                                            <Image src={profileImg} width={30} height={30} alt="coins" className='rounded-full w-[40px] h-[40px] object-cover object-top' />
                                            <div>
                                                <p className="info-14-18 !text-[14px] text-black dark:text-white">{userName}</p>
                                                <p className="sm-text !text-[10px] dark:text-beta">{item?.orders}</p>
                                            </div>
                                        </div>
                                    </div>


                                    <div className=' flex items-center justify-end'>
                                        <button className="info-14-18 text-buy px-[20px] py-[9px] rounded-[4px]   bg-green" onClick={() => { props.setShow1(true); props.setSelectedPost(item); }}>Buy</button>
                                    </div>
                                    <div className='mt-[12px]'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[10px]'>Price:</p>
                                        <p className='sm-text !text-[14px] dark:!text-white !text-h-primary mt-[5px]'>{currencyFormatter(truncateNumber(item?.price, 6))} <span className='sm-text !text-[10px] dark:!text-[#9295A6] !text-banner-text'>INR/USDT</span></p>
                                    </div>
                                    <div className='mt-[12px]'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[10px]'>Limit:</p>
                                        <p className='sm-text !text-[14px] dark:!text-white !text-h-primary mt-[5px]'>{`${currencyFormatter(truncateNumber(item?.min_limit, 6))} ~ ${currencyFormatter(truncateNumber(item?.max_limit, 6))}`}<span className='sm-text !text-[14px] !text-h-primary dark:!text-beta'>INR</span></p>
                                    </div>
                                    <div className='mt-[12px]'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[10px]'>Available:</p>
                                        <p className='sm-text !text-[14px] dark:!text-white !text-h-primary mt-[5px]'>{truncateNumber(Number(item?.quantity), 4)} {item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                                    </div>
                                    <div className='mt-[12px]'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[10px]'>Payment Method:</p>
                                        <div className='flex items-center gap-10 mt-[5px]'>
                                            {
                                                payment_method?.map((elem: any, ind: any) => {
                                                    return (
                                                        <Fragment key={ind}>
                                                            <Image src={`${elem.master_payment_method.icon}`} alt='error' width={30} height={30} />
                                                        </Fragment>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        )
                    }

                })
            }
            {list && list?.length === 0 &&
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
        </>
    )
}

export default BuyTableMobile;