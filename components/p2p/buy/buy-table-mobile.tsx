import Context from '@/components/contexts/context';
import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import { truncateNumber } from '@/libs/subdomain';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

interface activeSection {
    setShow1: any;
    setSelectedPost?: any;
    paymentId?: string;
    selectedToken?: any;
    firstCurrency?: string;
    session?: any;
}

const BuyTableMobile = (props: activeSection) => {
    const [itemOffset, setItemOffset] = useState(0);
    const { mode } = useContext(Context);
    const { status, data: session } = useSession();
    const [total, setTotal] = useState(0)

    const [list, setList] = useState([])

    let itemsPerPage = 10;

    useEffect(() => {
        getAllPosts(itemOffset);
    }, [itemOffset, props?.firstCurrency, props?.paymentId]);


    const getAllPosts = async (itemOffset: number) => {
        try {
            //   console.log("=hereere", itemOffset);

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


            //   console.log(posts?.data?.data,"=posts?.data?.data");


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

            //   console.log(posts, "==posts"); 
            // Filter out posts where user_p_method array is empty
            // posts.data.data = posts.data.data.filter((post: any) => post.user_p_method.length > 0);

            // Update totalLength based on filtered data length
            const totalLength = posts.data.data.length;
            setTotal(totalLength);

            setList(posts.data.data);

            // let postData = [];
            // let filter_posts = posts?.data?.data;
            // postData= filter_posts
            // if (props?.firstCurrency !== "") {
            //   filter_posts = posts?.data?.data?.filter((item: any) => {
            //     return props?.selectedToken?.id === item?.token_id;
            //   });
            //   postData = filter_posts;
            // }
            //  if (props?.paymentId !== "") {
            //   let filterRecord=[]

            //   for (const post of filter_posts) {
            //     for (const upid of post.user_p_method) {

            //       if (props?.paymentId === upid?.pmid) {
            //         filterRecord.push(post);
            //       }
            //     }
            //   }
            //   postData = filterRecord;

            // } else {
            //   postData = filter_posts;
            // }
            // setList(postData)
            setTotal(posts?.data?.totalLength)
        } catch (error) {
            console.log("error in get token list", error);

        }
    };


    // const endOffset = itemOffset + itemsPerPage;
    // const currentItems = data?.data?.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(total / itemsPerPage);

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
                                            <Image src={profileImg} width={30} height={30} alt="coins" />
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