import Context from '@/components/contexts/context';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

interface activeSection {
    setShow1: any;
    posts?: any;
    setSelectedPost?: any;
}

const BuyTableMobile = (props: activeSection) => {
    const [itemOffset, setItemOffset] = useState(0);
    const { mode } = useContext(Context);
    const { status, data: session } = useSession();

    const [list, setList] = useState([])
    let data = props?.posts || [];
    let itemsPerPage = 20;
 
    useEffect(() => {
      getAllPosts(itemOffset);
    }, [itemOffset]);
  
  
    const getAllPosts = async (itemOffset: number) => {
      try {
        if (itemOffset === undefined) {
          itemOffset = 0;
        }
        let posts = await fetch(
          `/api/p2p/buy?itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`,
          {
            method: "GET",
            headers: {
              "Authorization": session?.user?.access_token
            },
          }
        ).then((response) => response.json());
  
  
        setList(posts?.data?.data);
  
      } catch (error) {
        console.log("error in get token list", error);
  
      }
    };
  
    // const endOffset = itemOffset + itemsPerPage;
    // const currentItems = data?.data?.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(data.totalLength / itemsPerPage);

    const handlePageClick = async (event: any) => {
        const newOffset = (event.selected * itemsPerPage) % data?.totalLength;
        setItemOffset(newOffset);

    };

    return (
        <>
            {
              list.length>0 && list?.map((item: any, ind: number) => {
                    if (session?.user?.user_id !== item?.user_id) {
                        const profileImg = item?.user?.profile && item?.user?.profile?.image !== null ? `${item?.user?.profile?.image}` : `/assets/orders/user1.png`;
                        const userName = item?.user?.profile && item?.user?.profile?.dName !== null ? item?.user?.profile?.dName : item?.user?.user_kyc?.fname;
                        let payment_method: any = [];

                        for (const upid of item?.user?.user_payment_methods) {
                            item?.p_method.filter((e: any) => {
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
                                        <p className='sm-text !text-[14px] dark:!text-white !text-h-primary mt-[5px]'>{item?.price} <span className='sm-text !text-[10px] dark:!text-[#9295A6] !text-banner-text'>INR/USDT</span></p>
                                    </div>
                                    <div className='mt-[12px]'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[10px]'>Limit:</p>
                                        <p className='sm-text !text-[14px] dark:!text-white !text-h-primary mt-[5px]'>{item?.min_limit} ~ ${item?.max_limit}<span className='sm-text !text-[14px] !text-h-primary dark:!text-beta'>INR</span></p>
                                    </div>
                                    <div className='mt-[12px]'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[10px]'>Available:</p>
                                        <p className='sm-text !text-[14px] dark:!text-white !text-h-primary mt-[5px]'>{Number(item?.quantity).toFixed(4)} {item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
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
            {list.length === 0 &&
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
        </>
    )
}

export default BuyTableMobile;