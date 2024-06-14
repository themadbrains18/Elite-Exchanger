import Image from "next/image";
import React, { useContext, useState } from "react";
import IconsComponent from "../snippets/icons";
import ReactPaginate from "react-paginate";
import Context from "../contexts/context";
import ConfirmationModel from "../snippets/confirmation";
import { useSession } from "next-auth/react";
import AES from "crypto-js/aes";
import moment from "moment";

interface propsData {
  coinsList: any;
  openOrder?: any;
  tradehistory?: any;
  getUserOpenOrder?: any;
  getUserTradeHistory?: any;
  slug?: any;
}

const ChartTabs = (props: propsData) => {

  const { status, data: session } = useSession();

  const [activeTab, setActiveTab] = useState(1);
  const [itemOffset, setItemOffset] = useState(0);
  const [openItemOffset, setOpenItemOffset] = useState(0);
  const [tradeItemOffset, setTradeItemOffset] = useState(0);
  const { mode } = useContext(Context);
  const [cancelItemSymbol, setCancelItemSymbol] = useState('');

  const [active, setActive] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(
    "Are you sure you want to delete your order?"
  );
  const [title, setTitle] = useState("Cancel Order");
  const [orderId, setOrderId] = useState("");

  let data = props.coinsList; //token list

  let itemsPerPage = 10;

  // Coin List paggination code
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = data.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    setItemOffset(newOffset);
  };

  const setHeight = (e: any) => {
    let nexElm = e.currentTarget.nextElementSibling;
    let nexElmHeight = nexElm.scrollHeight;

    let iconImg = e.currentTarget?.querySelector("svg");
    iconImg?.classList.toggle("rotate-180");

    if (nexElm.getAttribute("style")) {
      nexElm.removeAttribute("style");
    } else {
      nexElm.setAttribute("style", `height:${nexElmHeight}px`);
    }
  };

  // Open order paggination code here
  const endOpenOffset = openItemOffset + itemsPerPage;
  const currentOpenItems =
    props?.openOrder && props?.openOrder.length > 0
      ? props.openOrder.slice(openItemOffset, endOpenOffset)
      : [];
  const pageOpenCount = Math.ceil(
    props.openOrder && props.openOrder.length / itemsPerPage
  );

  const handleOpenPageClick = async (event: any) => {
    const newOffset =
      (event.selected * itemsPerPage) %
      (props.openOrder && props.openOrder.length);
    setOpenItemOffset(newOffset);
  };

  // Trade History Tab
  const endTradeOffset = tradeItemOffset + itemsPerPage;
  const currentTradeItems =
    props?.tradehistory && props?.tradehistory.length > 0
      ? props.tradehistory.slice(tradeItemOffset, endTradeOffset)
      : [];
  const pageTradeCount = Math.ceil(
    props.tradehistory && props.tradehistory.length / itemsPerPage
  );

  const handleTradePageClick = async (event: any) => {
    const newOffset =
      (event.selected * itemsPerPage) %
      (props.tradehistory && props.tradehistory.length);
    setTradeItemOffset(newOffset);
  };

  /**
   * Cancel order
   */
  const actionPerform = async () => {
    try {
      let cancelObj = {
        user_id: session?.user?.user_id,
        order_id: orderId,
      };

      const ciphertext = AES.encrypt(
        JSON.stringify(cancelObj),
        `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
      );
      let record = encodeURIComponent(ciphertext.toString());

      let cancelReponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/market/order`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: session?.user?.access_token,
          },
          body: JSON.stringify(record),
        }
      ).then((response) => response.json());

      if (cancelReponse?.data?.result) {
        setActive(false);
        setShow(false);
        setOrderId("");
        props.getUserOpenOrder(props.slug);
        props.getUserTradeHistory(props.slug);
      }

    } catch (error) {
      console.log("error in chart page trade history", error);
    }
  };

  return (
    <div className="mt-30 p-20 lg:px-30 lg:py-40 rounded-10  bg-white dark:bg-d-bg-primary">
      {/* ta cta */}
      <div className="overflow-x-auto">
        <div className="flex border-b border-[#e9eaf026] gap-30 justify-start min-w-max md:min-w-[1000px]">
          {/* Coin List */}
          <div>
            <button
              className={`w-full max-w-full sec-text text-center text-gamma border-b-2 border-[transparent] pb-[32px]  ${activeTab === 1 && "!text-primary border-primary"
                }`}
              onClick={() => setActiveTab(1)}
            >
              Listed Coin
            </button>
          </div>
          {/* User Open Order */}
          <div>
            <button
              className={`w-full max-w-full sec-text text-center text-gamma border-b-2 border-[transparent] pb-[32px]  ${activeTab === 2 && "!text-primary border-primary"
                }`}
              onClick={() => setActiveTab(2)}
            >
              Open Order
            </button>
          </div>
          {/* User trade history ask/bids list */}
          <div>
            <button
              className={`w-full max-w-full sec-text text-center text-gamma border-b-2 border-[transparent] pb-[32px]  ${activeTab === 3 && "!text-primary border-primary"
                }`}
              onClick={() => setActiveTab(3)}
            >
              Trade History
            </button>
          </div>
        </div>
      </div>

      <div>

        {/* Trade pair token listing */}
        {activeTab === 1 && (
          <div>
            <div className="overflow-x-auto">
              <table width="100%" className="lg:min-w-[1018px] w-full">
                <thead>
                  <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">
                    <th className="lg:sticky left-0 bg-white dark:bg-d-bg-primary py-5">
                      <div className="flex ">
                        <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">
                          Coin Name
                        </p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                    <th className="lg:hidden py-5">
                      <div className="flex justify-center">
                        <p className="text-center  nav-text-sm md:nav-text-lg dark:text-gamma">
                          Chart
                        </p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                    <th className=" py-5">
                      <div className="flex max-[767px]:justify-end">
                        <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                          Coin Price
                        </p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                    <th className="max-[1023px]:hidden py-5">
                      <div className="flex">
                        <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                          Volume
                        </p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                    <th className="max-[1023px]:hidden py-5">
                      <div className="flex">
                        <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                          Total Supply{" "}
                        </p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                    <th className="max-[1023px]:hidden py-5">
                      <div className="flex">
                        <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                          Max Supply{" "}
                        </p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                    <th className="max-[1023px]:hidden py-5">
                      <div className="flex">
                        <p className="text-center  nav-text-sm md:nav-text-lg dark:text-gamma">
                          Chart
                        </p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.map((item: any, index: number) => {
                    return (
                      <tr
                        key={index}
                        className=" dark:hover:bg-black-v-1  group rounded-5 hover:bg-[#FEF2F2] cursor-pointer"
                        onClick={() => {
                          item?.tradepair !== null
                            ? (window.location.href = `/chart/${item.symbol}`)
                            : "";
                          props.getUserOpenOrder(item?.symbol);
                          props.getUserTradeHistory(item?.symbol);
                        }}
                      >
                        <td className="group-hover:bg-[#FEF2F2] dark:group-hover:bg-black-v-1 lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                          <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                            <Image
                              src={`${item.image}`}
                              width={30}
                              height={30}
                              alt="coins"
                              className="w-[30px] h-[30px]"
                            />
                            <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                              <p className="info-14-18 dark:text-white">
                                {item.symbol}
                              </p>
                              <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">
                                {item.symbol}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="lg:hidden">
                          <p className="info-14-18 dark:text-white">
                            <Image
                              src="/assets/market/Graph.svg"
                              width={114}
                              height={48}
                              alt="graph"
                            />
                          </p>
                        </td>
                        <td>
                          <p className="info-14-18 dark:text-white  max-[767px]:text-end">
                            ${item.price.toFixed(6)}
                          </p>
                        </td>
                        <td className="max-[1023px]:hidden">
                          <div className={` items-center gap-[10px] flex`}>
                            <p
                              className={`footer-text-secondary  `}
                            >
                              {item.volume && item.volume}
                            </p>
                            <IconsComponent
                              type={item.status}
                              active={false}
                              hover={false}
                            />
                          </div>
                        </td>

                        <td className="max-[1023px]:hidden">
                          <p className="info-14-18 dark:text-white">
                            ${item.totalSupply && item.totalSupply}
                          </p>
                        </td>
                        <td className="max-[1023px]:hidden">
                          <p className="info-14-18 dark:text-white">
                            ${item.maxSupply && item.maxSupply}
                          </p>
                        </td>
                        <td className="max-[1023px]:hidden ">
                          <p className="info-14-18 dark:text-white">
                            <Image
                              src="/assets/market/Graph.svg"
                              width={114}
                              height={48}
                              alt="graph"
                            />
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex pt-[25px] gap-[10px] items-center justify-between flex-wrap xl:flex-nowrap">
              <p className="info-12 md:footer-text !text-gamma">{props?.coinsList?.length} assets</p>

              <ReactPaginate
                className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""
                  }`}
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
              />
            </div>
          </div>
        )}

        {/* Open Order Data Listing */}
        {activeTab === 2 && (
          <div>
            <div className="overflow-x-auto">
              <table width="100%" className="lg:min-w-[1018px] w-full">
                <thead>
                  <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">
                    <th className="lg:sticky left-0 bg-white dark:bg-d-bg-primary py-5">
                      <div className="flex ">
                        <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">
                          Coin Name
                        </p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                    <th className="lg:sticky left-0 py-5">
                      <div className="flex justify-center">
                        <p className="text-center  nav-text-sm md:nav-text-lg dark:text-gamma">
                          Market Type
                        </p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                    <th className=" py-5">
                      <div className="flex">
                        <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                          Order Type
                        </p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                    <th className="max-[1023px]:hidden py-5">
                      <div className="flex">
                        <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                          Amount
                        </p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                    <th className="max-[1023px]:hidden py-5">
                      <div className="flex">
                        <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                          Bid Value{" "}
                        </p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                    <th className="max-[1023px]:hidden py-5">
                      <div className="flex">
                        <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                          USDT Amount
                        </p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                    <th className="max-[1023px]:hidden py-5">
                      <div className="flex">
                        <p className="text-center  nav-text-sm md:nav-text-lg dark:text-gamma">
                          Status
                        </p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                    <th className="max-[1023px]:hidden py-5">
                      <div className="flex">
                        <p className="text-center  nav-text-sm md:nav-text-lg dark:text-gamma">
                          Action
                        </p>
                        <Image
                          src="/assets/history/uparrow.svg"
                          width={15}
                          height={15}
                          alt="uparrow"
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentOpenItems.length > 0 &&
                    currentOpenItems?.map((item: any, index: number) => {
                      return (
                        <tr
                          key={index}
                          className={`dark:hover:bg-black-v-1  group rounded-5 hover:bg-[#FEF2F2] cursor-pointer`}
                        >
                          <td className="group-hover:bg-[#FEF2F2] dark:group-hover:bg-black-v-1 lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                            <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                              <Image
                                src={`${item?.token
                                  ? item?.token.image
                                  : item?.global_token.image
                                  }`}
                                width={30}
                                height={30}
                                alt="coins"
                                className="min-w-[30px]"
                              />
                              <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                <p className="info-14-18 dark:text-white">
                                  {item?.token
                                    ? item?.token.fullName
                                    : item?.global_token.fullName}
                                </p>
                                <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">
                                  {item?.token
                                    ? item?.token?.symbol
                                    : item?.global_token?.symbol}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p className="info-14-18 dark:text-white">
                              {item?.market_type}
                            </p>
                          </td>
                          <td>
                            <p
                              className={`info-14-18 ${item.order_type === "sell"
                                ? "text-[#ff0000]"
                                : "text-[#008000]"
                                }`}
                            >
                              {item.order_type.toUpperCase()}
                            </p>
                          </td>
                          <td className="max-[1023px]:hidden">
                            <div className={` items-center gap-[10px] flex`}>
                              <p className={`info-14-18 dark:text-white`}>
                                {item?.token_amount?.toFixed(5)}
                              </p>
                            </div>
                          </td>

                          <td className="max-[1023px]:hidden">
                            <p className="info-14-18 dark:text-white">
                              ${item?.limit_usdt}
                            </p>
                          </td>
                          <td className="max-[1023px]:hidden">
                            <p className="info-14-18 dark:text-white">
                              ${item.volume_usdt.toFixed(5)}
                            </p>
                          </td>
                          <td className="max-[1023px]:hidden">
                            <p className="info-14-18 dark:text-white">
                              {item?.status === false ? "Pending" : ""}
                            </p>
                          </td>
                          <td className="max-[1023px]:hidden">
                            <button
                              className="admin-outline-button !text-[#F44336] !border-[#f443361f] !px-[10px] !py-[4px] whitespace-nowrap"
                              onClick={(e) => {
                                setActive(true);
                                setShow(true);
                                setOrderId(item?.id);
                              }}
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  {currentOpenItems.length === 0 && (
                    <tr>
                      <td colSpan={8}>
                        <div
                          className={` py-[50px] flex flex-col items-center justify-center ${mode === "dark"
                            ? "text-[#ffffff]"
                            : "text-[#000000]"
                            }`}
                        >
                          <Image
                            src="/assets/refer/empty.svg"
                            alt="emplty table"
                            width={107}
                            height={104}
                          />
                          <p> No Record Found </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex pt-[25px] items-center justify-end">
              <ReactPaginate
                className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""
                  }`}
                breakLabel="..."
                nextLabel=">"
                onPageChange={handleOpenPageClick}
                pageRangeDisplayed={1}
                marginPagesDisplayed={2}
                pageCount={pageOpenCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
              />
            </div>
          </div>
        )}

        {/* Trade History Data Listing */}
        {activeTab === 3 && (
          <div>
            <div className="overflow-x-auto">
              <div className="table lg:min-w-[1018px] w-full ">
                <div
                  className={`head_row border-b border-t border-grey-v-3 dark:border-opacity-[15%] grid grid-cols-3 md:grid-cols-9  justify-between`}
                >
                  <div className="flex py-5 md:col-span-2 items-center">
                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma  ">
                      Pair
                    </p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                  <div className="flex  py-5 items-center">
                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma  ">
                      Side
                    </p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                  <div className="hidden md:flex py-5 items-center">
                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                      Type
                    </p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>

                  <div className="hidden md:flex py-5 items-center">
                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                      Fee
                    </p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                  <div className="hidden md:flex py-5 items-center">
                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                      Bid
                    </p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                  <div className="hidden md:flex py-5 items-center">
                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                      Amount
                    </p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                  <div className="hidden md:flex py-5 items-center">
                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                      Total Qty.
                    </p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                  <div className="flex py-5 items-center">
                    <p className="text-end  nav-text-sm md:nav-text-lg dark:text-gamma">
                      Status
                    </p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </div>
                {/* =========================== */}
                {currentTradeItems?.length > 0 ? (
                  currentTradeItems?.map((item: any, index: number) => {

                    const sortBlogPostsByDate = item?.market_order_histroys.sort((a: any, b: any) => {
                      return b.entry_id - a.entry_id
                    })

                    return (
                      <div
                        key={index}
                        className=" dark:hover:bg-black-v-1  group rounded-5 hover:bg-[#FEF2F2] relative"
                      >
                        <div
                          className={`grid grid-cols-3 relative md:grid-cols-9 items-center  justify-between `}
                        >
                          <div className="flex gap-2 md:col-span-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                            <Image
                              src={`${item?.token !== null
                                ? item?.token?.image
                                : item?.global_token?.image
                                }`}
                              width={30}
                              height={30}
                              alt="coins"
                            />
                            <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                              <p className="info-14-18 dark:text-white">
                                {item?.token !== null
                                  ? item?.token?.fullName
                                  : item?.global_token?.fullName}
                              </p>
                              <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">
                                {item?.token !== null
                                  ? item?.token?.symbol
                                  : item?.global_token?.symbol}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                            <div
                              className={`p-0 md:p-[5px] rounded-5 bg-[transparent] ${item.order_type === "sell"
                                ? "md:bg-sell"
                                : "md:bg-buy"
                                } `}
                            >
                              {item.order_type === "buy" ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={20}
                                  height={21}
                                  viewBox="0 0 20 21"
                                  fill="none"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M14.9944 6.18667C14.9944 5.72917 14.6244 5.35667 14.166 5.35417L7.50521 5.3125H7.50021C7.04188 5.3125 6.67021 5.6825 6.66688 6.14083C6.66354 6.60083 7.03438 6.97667 7.49521 6.97917L12.1269 7.00833L5.24438 13.89C4.91854 14.2158 4.91854 14.7433 5.24438 15.0683C5.40688 15.2317 5.62021 15.3125 5.83354 15.3125C6.04688 15.3125 6.26021 15.2317 6.42271 15.0683L13.3294 8.16167L13.3335 12.8133C13.3335 13.2733 13.7069 13.6458 14.1669 13.6458H14.1677C14.6277 13.6458 15.0002 13.2717 15.0002 12.8117L14.9944 6.18667Z"
                                    className="fill-buy md:fill-white"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={20}
                                  height={21}
                                  viewBox="0 0 20 21"
                                  fill="none"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M14.7558 5.55687C14.43 5.23104 13.9033 5.23104 13.5775 5.55687L6.66667 12.4677V7.81271C6.66667 7.35271 6.29417 6.97938 5.83333 6.97938C5.3725 6.97938 5 7.35271 5 7.81271V14.4794C5 14.9394 5.3725 15.3127 5.83333 15.3127H12.5C12.9608 15.3127 13.3333 14.9394 13.3333 14.4794C13.3333 14.0194 12.9608 13.646 12.5 13.646H7.845L14.7558 6.73521C15.0817 6.40937 15.0817 5.88271 14.7558 5.55687"
                                    className="fill-sell md:fill-white"
                                  />
                                </svg>
                              )}
                            </div>
                            <div className="hidden md:block py-[10px] md:py-[15px] px-0 md:px-[5px]">
                              <p className="info-14-18 dark:text-white">
                                {item.order_type}
                              </p>
                              <p className="info-10">
                                {moment(item?.createdAt).format("YYYY-MM-DD")}
                              </p>
                            </div>
                            <div className="block md:hidden py-[10px] md:py-[15px] px-0 md:px-[5px]">
                              <p className="info-14-18 dark:text-white">
                                {item.market_type}
                              </p>
                              <p className="info-10">{item.token_amount.toFixed(4)}</p>
                            </div>
                          </div>
                          <div className="py-[10px] md:py-[15px] px-0 md:px-[5px]  md:block hidden">
                            <p className="info-14-18 dark:text-white  ">
                              {item.market_type}
                            </p>
                          </div>

                          <div className="py-[10px] md:py-[15px] px-0 md:px-[5px]  md:block hidden">
                            <p className="info-14-18 dark:text-white ">
                              {item?.fee?.toFixed(8)}
                            </p>
                          </div>
                          <div className="py-[10px] md:py-[15px] px-0 md:px-[5px]  md:block hidden">
                            <p className="info-14-18 dark:text-white ">
                              {item?.limit_usdt?.toFixed(2)}
                            </p>
                          </div>
                          <div className="py-[10px] md:py-[15px] px-0 md:px-[5px]  md:block hidden">
                            <p className="info-14-18 dark:text-white ">
                              ${item.volume_usdt?.toFixed(6)}
                            </p>
                          </div>
                          <div className="py-[10px] md:py-[15px] px-0 md:px-[5px]  md:block hidden">
                            <p className="info-14-18 dark:text-white ">
                              ${item.token_amount?.toFixed(6)}
                            </p>
                          </div>

                          <div className="py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                            <p
                              className={`info-14-18  ${item.status === true
                                ? "text-buy"
                                : item.isCanceled === true
                                  ? "text-cancel"
                                  : "text-gamma"
                                }`}
                            >
                              {item?.status === false
                                ? item?.isCanceled === true
                                  ? "Canceled"
                                  : "Pending"
                                : "Success"}
                            </p>
                          </div>
                        </div>

                        {/* Sub transaction record listing */}
                        {sortBlogPostsByDate &&
                          <div
                            className="absolute top-[43px]  right-[10px]  max-w-[10px] w-full cursor-pointer"
                            onClick={setHeight}
                          >
                            <svg
                              className="duration-300"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 129 129"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              enableBackground="new 0 0 129 129"
                            >
                              <g>
                                <path
                                  fill={mode === "dark" ? "white" : "#000"}
                                  d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z"
                                />
                              </g>
                            </svg>
                          </div>
                        }
                        <div className={`h-0 overflow-hidden duration-300 flex flex-col-reverse`} >

                          {sortBlogPostsByDate && sortBlogPostsByDate.map((elm: any, ind: number) => {

                            let classByStatus = "";
                            let status = "";
                            // if (elm?.status === false && (item?.market_order_histroys.length === (ind+1) || ind === 0)) {
                            //   classByStatus = 'text-gamma';
                            //   status = "Initial"
                            // }
                            if (elm?.status === false && elm?.isCanceled === false) {
                              classByStatus = 'text-gamma'
                              status = "Initial"
                            }
                            else if (elm?.status === false && elm?.isCanceled === true) {
                              classByStatus = 'text-cancel'
                              status = "Canceled"
                            }
                            else if (elm?.status === true && elm?.isCanceled === false) {
                              classByStatus = 'text-buy'
                              status = "Success"
                            }

                            return (
                              <div className={`grid grid-cols-3 md:grid-cols-9 items-center  justify-between `}>
                                <div className="flex gap-2 md:col-span-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                                </div>
                                <div className="flex items-center py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                                  <div
                                    className={`p-0 md:p-[5px] rounded-5 bg-[transparent] ${item.order_type === "sell"
                                      ? "md:bg-sell"
                                      : "md:bg-buy"
                                      } `}
                                  >
                                    {item.order_type === "buy" ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={21}
                                        viewBox="0 0 20 21"
                                        fill="none"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M14.9944 6.18667C14.9944 5.72917 14.6244 5.35667 14.166 5.35417L7.50521 5.3125H7.50021C7.04188 5.3125 6.67021 5.6825 6.66688 6.14083C6.66354 6.60083 7.03438 6.97667 7.49521 6.97917L12.1269 7.00833L5.24438 13.89C4.91854 14.2158 4.91854 14.7433 5.24438 15.0683C5.40688 15.2317 5.62021 15.3125 5.83354 15.3125C6.04688 15.3125 6.26021 15.2317 6.42271 15.0683L13.3294 8.16167L13.3335 12.8133C13.3335 13.2733 13.7069 13.6458 14.1669 13.6458H14.1677C14.6277 13.6458 15.0002 13.2717 15.0002 12.8117L14.9944 6.18667Z"
                                          className="fill-buy md:fill-white"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={21}
                                        viewBox="0 0 20 21"
                                        fill="none"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M14.7558 5.55687C14.43 5.23104 13.9033 5.23104 13.5775 5.55687L6.66667 12.4677V7.81271C6.66667 7.35271 6.29417 6.97938 5.83333 6.97938C5.3725 6.97938 5 7.35271 5 7.81271V14.4794C5 14.9394 5.3725 15.3127 5.83333 15.3127H12.5C12.9608 15.3127 13.3333 14.9394 13.3333 14.4794C13.3333 14.0194 12.9608 13.646 12.5 13.646H7.845L14.7558 6.73521C15.0817 6.40937 15.0817 5.88271 14.7558 5.55687"
                                          className="fill-sell md:fill-white"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <div className="hidden md:block py-[10px] md:py-[15px] px-0 md:px-[5px]">
                                    <p className="info-14-18 dark:text-white">
                                      {elm.order_type}
                                    </p>
                                    <p className="info-10">
                                      {moment(elm?.createdAt).format("YYYY-MM-DD")}
                                    </p>
                                  </div>
                                  <div className="block md:hidden py-[10px] md:py-[15px] px-0 md:px-[5px]">
                                    <p className="info-14-18 dark:text-white">
                                      {elm.market_type}
                                    </p>
                                    <p className="info-10">{elm.token_amount.toFixed(4)}</p>
                                  </div>
                                </div>
                                <div className="py-[10px] md:py-[15px] px-0 md:px-[5px]  md:block hidden">
                                  <p className="info-14-18 dark:text-white  ">
                                    {elm.market_type}
                                  </p>
                                </div>
                                <div className="py-[10px] md:py-[15px] px-0 md:px-[5px]  md:block hidden">
                                  <p className="info-14-18 dark:text-white ">
                                    {elm?.fee?.toFixed(8)}
                                  </p>
                                </div>
                                <div className="py-[10px] md:py-[15px] px-0 md:px-[5px]  md:block hidden">
                                  <p className="info-14-18 dark:text-white">
                                    {elm?.limit_usdt?.toFixed(2)}
                                  </p>
                                </div>
                                <div className="py-[10px] md:py-[15px] px-0 md:px-[5px]  md:block hidden">
                                  <p className="info-14-18 dark:text-white ">
                                    ${elm?.volume_usdt?.toFixed(2)}
                                  </p>
                                </div>
                                <div className="py-[10px] md:py-[15px] px-0 md:px-[5px]  md:block hidden">
                                  <p className="info-14-18 dark:text-white ">
                                    ${elm.token_amount?.toFixed(5)}
                                  </p>
                                </div>

                                <div className="py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                                  <p className={`info-14-18  ${classByStatus}`}>
                                    {status}
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="xl:grid xl:place-content-center w-full p-4">
                    <div className={`inline-grid ${mode === "dark"
                      ? "text-[#ffffff]"
                      : "text-[#000000]"
                      }`}>
                      <Image
                        src="/assets/refer/empty.svg"
                        alt="emplty table"
                        width={107}
                        height={104}
                      />
                      <p> No Record Found </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex pt-[25px] items-center justify-end">
              <ReactPaginate
                className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""
                  }`}
                breakLabel="..."
                nextLabel=">"
                onPageChange={handleTradePageClick}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                pageCount={pageTradeCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
              />
            </div>
          </div>
        )}

        {active === true && (
          <ConfirmationModel
            setActive={setActive}
            setShow={setShow}
            title={title}
            message={message}
            show={show}
            actionPerform={actionPerform}
          />
        )}
      </div>
    </div>
  );
};

export default ChartTabs;
