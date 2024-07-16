import Image from 'next/image';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
import Context from "../../contexts/context";
import { useSession } from 'next-auth/react';
import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import BuyAuthenticationModelPopup from '@/components/snippets/buyAuthenticationModelPopup';
import { truncateNumber } from '@/libs/subdomain';

interface activeSection {
  setShow1: any;
  setSelectedPost?: any;
  paymentId?: string;
  selectedToken?: any;
  firstCurrency?: string;
  assets?: any;

}

const BuyTableDesktop = (props: activeSection) => {
  const { mode } = useContext(Context);
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);
  const [itemOffset, setItemOffset] = useState(0);

  const { status, data: session } = useSession();
  const [list, setList] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [type, setType] = useState('')


  let itemsPerPage = 10;


  useEffect(() => {
    if(session){
      getAllPosts(itemOffset);
    }
  }, [itemOffset, props?.firstCurrency, props?.paymentId,session]);

  const getAllPosts = async (itemOffset: number) => {
    try {

      if (itemOffset === undefined) {
        itemOffset = 0;
      }

      let paymentMethod = props?.paymentId !== undefined && props?.paymentId !== "" ? props?.paymentId : "all"
      let currency = props?.selectedToken !== undefined && props?.selectedToken !== "" ? props?.selectedToken?.id : "all"


      let posts = await fetch(
        `/api/p2p/buy?user_id=${session?.user?.user_id}&itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}&currency=${currency || "all"}&pmMethod=${paymentMethod}`,
        {
          method: "GET",
          headers: {
            "Authorization": session?.user?.access_token
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

      // Filter out posts where user_p_method array is empty
      // posts.data.data = posts.data.data.filter((post: any) => post.user_p_method.length > 0);

      // Update totalLength based on filtered data length
      // const totalLength = posts.data.data.length;
      // setTotal(totalLength);

      setList(posts.data.data);

      if(posts?.data?.totalLength<=10){
        setItemOffset(0)
      }

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

  if (list?.length > 0) {

    for (const post of list) {
      let payment_method: any = [];
      for (const upid of post?.p_method) {
        post?.User?.user_payment_methods?.filter((item: any) => {
          if (item.id === upid?.upm_id) {
            payment_method.push(item);
          }
        })
      }
      post.user_p_method = payment_method;
    }
  }

  // const endOffset = itemOffset + itemsPerPage;
  // const currentItems = data?.data?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(total / itemsPerPage);

  const handlePageClick = async (event: any) => {
    // console.log(event.selected * itemsPerPage);

    const newOffset = (event.selected * itemsPerPage) % total;
    setItemOffset(newOffset);
  };

  const handleBuy = (item: any) => {
    try {


      if (session) {

        if (item?.complete_kyc === true) {

          if (session?.user?.kyc !== "approve") {
            setType('kyc')
            setShow(true)
            setActive(true)
          }
          else {

            props.setShow1(true); props.setSelectedPost(item);
          }
        }
        else if (item?.min_btc === true) {
          let btcBalanceItem = props?.assets?.find((item: any) => item?.token_id === "30c72375-b3a7-49ea-a17e-b6b530023cb7" && item?.account_type === "Main Account")
          let btcBalance = btcBalanceItem ? btcBalanceItem.balance : 0;

          if (btcBalance < 0.01) {
            setType('min_btc')
            setShow(true)
            setActive(true)
          }
          else {
            props.setShow1(true); props.setSelectedPost(item);
          }

        }

        else {
          props.setShow1(true); props.setSelectedPost(item);
        }
      }
      else {
        props.setShow1(true); props.setSelectedPost(item);
      }


    } catch (error) {

    }
  }
  const startIndex = itemOffset + 1; // Starting index for the current page

  return (
    <>
      <div className="overflow-x-auto md:block hidden">
        <table width="100%" className='min-w-[1000px]'>
          <thead>
            <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">
              <th className="bg-white dark:bg-d-bg-primary py-5">
                <div className="flex ">
                  <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">#</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className="bg-white dark:bg-d-bg-primary py-5">
                <div className="flex ">
                  <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Seller Name</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-5">
                <div className="flex">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Price Per Coin</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-5">
                <div className="flex">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Limit</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-5">
                <div className="flex">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Available</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className="py-5">
                <div className="flex">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Payment Method</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-5">
                <div className="flex">
                  <p className="text-center  nav-text-sm md:nav-text-lg dark:text-gamma">Action</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {list?.length > 0 && list?.map((item: any, index: number) => {
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
                  <tr key={index} className=" dark:hover:bg-black-v-1  group rounded-5 hover:bg-[#FAFAFA] cursor-pointer">
                    <td className="group-hover:bg-[#FAFAFA] dark:group-hover:bg-black-v-1 ">
                      <div className="flex items-center gap-[10px]">
                        {/* <Image src='/assets/market/star.svg' width={24} height={24} alt="star" /> */}
                        <p className="info-14-18 ">{startIndex + index}</p>
                      </div>
                    </td>

                    <td className="group-hover:bg-[#FAFAFA] dark:group-hover:bg-black-v-1 bg-white dark:bg-d-bg-primary">
                      <div className="flex gap-2 py-[10px] md:py-[15px] items-center px-0 md:px-[5px] ">
                        <Image src={profileImg} width={30} height={30} alt="coins" className="rounded-full w-[40px] h-[40px] object-cover object-top" />
                        <div>
                          <p className="info-14-18 text-black dark:text-white">{userName}</p>
                          <p className="sm-text dark:text-white">{item?.orders}</p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <p className="info-14-18 dark:text-white  ">{currencyFormatter(item?.price)} INR</p>
                    </td>

                    <td>
                      <p className="info-14-18 dark:text-white  ">{`${currencyFormatter(truncateNumber(item?.min_limit, 6))} ~ ${currencyFormatter(truncateNumber(item?.max_limit, 6))} INR`}</p>
                    </td>

                    <td>
                      <p className="info-14-18 dark:text-white  ">{truncateNumber(Number(item?.quantity), 6)} {item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                    </td>

                    <td>
                      <div className='flex items-center '>
                        {
                          payment_method && payment_method?.length > 0 && payment_method?.map((elem: any, ind: any) => {
                            return (
                              <Fragment key={ind}>
                                <Image src={`${elem.master_payment_method.icon}`} alt='error' width={30} height={30} className='ml-[-10px]' />
                              </Fragment>
                            )
                          })
                        }
                      </div>
                    </td>

                    <td>
                      <button className="info-14-18 text-buy px-[20px] py-[9px] rounded-[4px]  dark:bg-black-v-1 bg-green" onClick={() => { handleBuy(item) }}>Buy</button>
                    </td>
                  </tr>
                );
              }

            })}

            {list?.length === 0 &&
              <tr>
                <td colSpan={7}>
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
          renderOnZeroPageCount={null} />
      </div>

      {show &&
        <BuyAuthenticationModelPopup title='Confirmation' message='Please complete your kyc' setShow={setShow} setActive={setActive} show={show} type={type} />
      }

    </>
  )
}

export default BuyTableDesktop;