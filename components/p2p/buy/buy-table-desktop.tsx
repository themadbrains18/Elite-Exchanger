import Image from 'next/image';
import React, { Fragment, useContext, useState } from 'react';
import ReactPaginate from "react-paginate";
import IconsComponent from '../../snippets/icons';
import Context from "../../contexts/context";
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface activeSection {
  setShow1: any;
  posts?: any;
  setSelectedPost?: any;
}

const BuyTableDesktop = (props: activeSection) => {
  const { mode } = useContext(Context);

  const [itemOffset, setItemOffset] = useState(0);

  const { status, data: session } = useSession();

  let data = props.posts;

  let itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = data?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(data?.length / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    setItemOffset(newOffset);

  };

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
            {currentItems?.map((item: any, index: number) => {

              // console.log(item, '========post list');
              if (session?.user?.user_id !== item?.user_id) {
                const profileImg = item?.User.profile && item?.User?.profile?.image !== null ? item?.User?.profile?.image : `/assets/orders/user1.png`;
                const userName = item?.User?.profile && item?.User?.profile?.fName !== null ? item?.User?.profile?.fName : item?.User?.user_kyc?.fname;

                return (
                  <tr key={index} className=" dark:hover:bg-black-v-1  group rounded-5 hover:bg-[#FAFAFA] cursor-pointer">
                    <td className="group-hover:bg-[#FAFAFA] dark:group-hover:bg-black-v-1 ">
                      <div className="flex items-center gap-[10px]">
                        <Image src='/assets/market/star.svg' width={24} height={24} alt="star" />
                        <p className="info-14-18 ">{index + 1}</p>
                      </div>
                    </td>

                    <td className="group-hover:bg-[#FAFAFA] dark:group-hover:bg-black-v-1 bg-white dark:bg-d-bg-primary">
                      <div className="flex gap-2 py-[10px] md:py-[15px] items-center px-0 md:px-[5px] ">
                        <Image src={profileImg} width={30} height={30} alt="coins" className="rounded-full" />
                        <div>
                          <p className="info-14-18 text-black dark:text-white">{userName}</p>
                          <p className="sm-text dark:text-white">{item?.orders}</p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <p className="info-14-18 dark:text-white  ">{item?.price} INR</p>
                    </td>

                    <td>
                      <p className="info-14-18 dark:text-white  ">{`${item?.min_limit} ~ ${item?.max_limit} INR`}</p>
                    </td>

                    <td>
                      <p className="info-14-18 dark:text-white  ">{item?.quantity} {item?.token!==null? item?.token?.symbol:item?.global_token?.symbol}</p>
                    </td>

                    <td>
                      <div className='flex items-center gap-10'>
                        {
                          item?.user_p_method.map((elem: any, ind: any) => {
                            return (
                              <Fragment key={ind}>
                                <Image src={`${process.env.NEXT_PUBLIC_APIURL}/payment_icon/${elem.master_payment_method.icon}`} alt='error' width={30} height={30} />
                              </Fragment>
                            )
                          })
                        }
                      </div>
                    </td>

                    <td>
                      <button className="info-14-18 text-buy px-[20px] py-[9px] rounded-[4px]  dark:bg-black-v-1 bg-green" onClick={() => { props.setShow1(true); props.setSelectedPost(item); }}>Buy</button>
                    </td>
                  </tr>
                );
              }

            })}

            {currentItems.length === 0 &&
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
    </>
  )
}

export default BuyTableDesktop;