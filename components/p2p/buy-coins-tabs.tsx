import React, { useState } from "react";
import FiliterSelectMenu from "../snippets/filter-select-menu";
import FilterSelectMenuWithCoin from "../snippets/filter-select-menu-with-coin";
import BuyTableDesktop from "./buy/buy-table-desktop";
import BuyTableMobile from "./buy/buy-table-mobile";

interface activeSection {
  setShow1: any;
  coinList?: any;
  posts?: any;
  setSelectedPost?: any;
  masterPayMethod?: any;
}

const BuyCoinsTabs = (props: activeSection) => {
  const [firstCurrency, setFirstCurrency] = useState("");
  const [selectedToken, setSelectedToken] = useState(Object);
  const [listWithCoin, setListWithCoin] = useState(props.coinList);
  const [paymentId, setPaymentId] = useState("");

  const list = props.masterPayMethod;
  // const listWithCoin = props.coinList;

  const setCurrencyName = (symbol: string, dropdown: number) => {
    if (dropdown === 1) {
      setFirstCurrency(symbol);
      let token = props?.coinList?.filter((item: any) => {
        return item.symbol === symbol;
      });
      setSelectedToken(token[0]);
    }
  };

  const onPaymentMethodChange = (id: any) => {
    // console.log(id,"==id");

    // for (const post of props?.posts) {
    //   for (const upid of post.user.user_payment_methods) {
    //     if (id === upid?.pmid) {
    //       filter_posts.push(post);
    //     }
    //   }
    // }
    // filter_posts = [...new Set(filter_posts)]

    // if (firstCurrency !== "") {
    //   filter_posts = filter_posts.filter((item: any) => {
    //     return selectedToken?.id === item?.token_id;
    //   });
    // }
    setPaymentId(id);

  };

  return (
    <>
      <div className="flex flex-wrap gap-20 items-center justify-end mt-30 md:mt-40 mb-20">

        <div className="flex md:flex-nowrap flex-wrap  items-center gap-10 w-full lg:w-auto ">
          <div className="relative max-w-full md:max-w-[50%] w-full">
            <FilterSelectMenuWithCoin
              data={listWithCoin}
              border={true}
              dropdown={1}
              setCurrencyName={setCurrencyName}
            />
          </div>
          <div className="max-w-full  md:max-w-[50%] w-full">
            <FiliterSelectMenu
              data={list}
              placeholder="Payment Method"
              auto={false}
              widthFull={false}
              type="pmethod"
              onPaymentMethodChange={onPaymentMethodChange}
            />
          </div>
        </div>
      </div>

      {/* Table Data */}

      <div>
        <div className="md:block hidden">
          <BuyTableDesktop
            setShow1={props.setShow1}
            paymentId={paymentId}
            selectedToken={selectedToken}
            firstCurrency={firstCurrency}
            setSelectedPost={props.setSelectedPost}
          />
        </div>
        <div className="md:hidden">
          <BuyTableMobile setShow1={props.setShow1}
            paymentId={paymentId}
            selectedToken={selectedToken}
            firstCurrency={firstCurrency} setSelectedPost={props.setSelectedPost} />
        </div>
      </div>


    </>
  );
};

export default BuyCoinsTabs;
