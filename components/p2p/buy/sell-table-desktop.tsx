import Image from 'next/image';
import React, { Fragment, useContext, useState } from 'react';
import ReactPaginate from "react-paginate";
import IconsComponent from '../../snippets/icons';
import Context from "../../contexts/context";
import Link from 'next/link';
import { currencyFormatter } from '@/components/snippets/market/buySellCard';

interface activeSection {
  setShow1: any;
}

const SellTableDesktop = (props: activeSection) => {
  const { mode } = useContext(Context);

  const [itemOffset, setItemOffset] = useState(0);

  let data = [
    {
      name: "Jerry Smith",
      image: "user1.png",
      orders: "94.14% 144 Orders",
      pricePerCoin: "₹ 82.00INR/USDT",
      limit: "5,000 ~ 9,000 INR",
      Available: '9.000342',
      PaymentMethod: ['phonepay.png', 'paytm.png', 'gpay.png'],
      sell: "Sell"
    },
    {
      name: "Jerry Smith",
      image: "user1.png",
      orders: "94.14% 144 Orders",
      pricePerCoin: "₹ 82.00INR/USDT",
      limit: "5,000 ~ 9,000 INR",
      Available: '9.000342',
      PaymentMethod: ['phonepay.png', 'gpay.png', 'paytm.png'],
      sell: "Sell"
    },
    {
      name: "Jerry Smith",
      image: "user1.png",
      orders: "94.14% 144 Orders",
      pricePerCoin: "₹ 82.00INR/USDT",
      limit: "5,000 ~ 9,000 INR",
      Available: '9.000342',
      PaymentMethod: ['paytm.png', 'gpay.png', 'phonepay.png'],
      sell: "Sell"
    },
    {
      name: "Jerry Smith",
      image: "user1.png",
      orders: "94.14% 144 Orders",
      pricePerCoin: "₹ 82.00INR/USDT",
      limit: "5,000 ~ 9,000 INR",
      Available: '9.000342',
      PaymentMethod: ['phonepay.png', 'paytm.png', 'gpay.png'],
      sell: "Sell"
    },
    {
      name: "Jerry Smith",
      image: "user1.png",
      orders: "94.14% 144 Orders",
      pricePerCoin: "₹ 82.00INR/USDT",
      limit: "5,000 ~ 9,000 INR",
      Available: '9.000342',
      PaymentMethod: ['phonepay.png', 'paytm.png', 'gpay.png'],
      sell: "Sell"
    },
    {
      name: "Jerry Smith",
      image: "user1.png",
      orders: "94.14% 144 Orders",
      pricePerCoin: "₹ 82.00INR/USDT",
      limit: "5,000 ~ 9,000 INR",
      Available: '9.000342',
      PaymentMethod: ['phonepay.png', 'paytm.png', 'gpay.png'],
      sell: "Sell"
    },
    {
      name: "Jerry Smith",
      image: "user1.png",
      orders: "94.14% 144 Orders",
      pricePerCoin: "₹ 82.00INR/USDT",
      limit: "5,000 ~ 9,000 INR",
      Available: '9.000342',
      PaymentMethod: ['phonepay.png', 'paytm.png', 'gpay.png'],
      sell: "Sell"
    },
    {
      name: "Jerry Smith",
      image: "user1.png",
      orders: "94.14% 144 Orders",
      pricePerCoin: "₹ 82.00INR/USDT",
      limit: "5,000 ~ 9,000 INR",
      Available: '9.000342',
      PaymentMethod: ['phonepay.png', 'paytm.png', 'gpay.png'],
      sell: "Sell"
    },
    {
      name: "Jerry Smith",
      image: "user1.png",
      orders: "94.14% 144 Orders",
      pricePerCoin: "₹ 82.00INR/USDT",
      limit: "5,000 ~ 9,000 INR",
      Available: '9.000342',
      PaymentMethod: ['phonepay.png', 'paytm.png', 'gpay.png'],
      sell: "Sell"
    },
  ];

  let itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = data.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(data.length / itemsPerPage);

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
            {currentItems?.map((item, index) => {
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
                      <Image src={`/assets/orders/${item.image}`} width={30} height={30} alt="coins" />
                      <div>
                        <p className="info-14-18 text-black dark:text-white">{item.name}</p>
                        <p className="sm-text dark:text-white">{item.orders}</p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <p className="info-14-18 dark:text-white  "> {isNaN(Number(item.pricePerCoin))
                      ? 'Invalid number'
                      : currencyFormatter(Number(item.pricePerCoin))}</p>
                  </td>

                  <td>
                    <p className="info-14-18 dark:text-white  ">{currencyFormatter(Number(item.limit))}</p>
                  </td>

                  <td>
                    <p className="info-14-18 dark:text-white  ">{currencyFormatter(Number(item.Available))}</p>
                  </td>

                  <td>
                    <div className='flex items-center gap-10'>
                      {
                        item.PaymentMethod.map((elem, ind) => {
                          return (
                            <Fragment key={ind}>
                              <Image src={`/assets/payment-methods/${elem}`} alt='error' width={30} height={30} />
                            </Fragment>
                          )
                        })
                      }
                    </div>
                  </td>

                  <td>
                    <Link href="/p2p/postad" className="info-14-18 text-cancel px-[20px] py-[9px] rounded-[4px]  dark:bg-black-v-1 bg-orange">{item.sell}</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex pt-[25px] items-center justify-between">
        <p className="info-12 md:footer-text !text-gamma">52 assets</p>
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

export default SellTableDesktop;