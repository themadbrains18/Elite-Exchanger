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
  const [active, setActive] = useState(1);
  const [firstCurrency, setFirstCurrency] = useState("");
  const [selectedToken, setSelectedToken] = useState(Object);
  const [posts, setPosts] = useState(props.posts);
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

      let postData = [];
      let filter_posts = props.posts.filter((item: any) => {
        return token[0]?.id === item?.token_id;
      });

      if (paymentId !== "") {
        for (const post of filter_posts) {
          for (const upid of post.user_p_method) {
            if (paymentId === upid?.pmid) {
              postData.push(post);
            }
          }
        }
      } else {
        postData = filter_posts;
      }

      setPosts(postData);
    }
  };

  const onPaymentMethodChange = (id: any) => {
    let filter_posts = [];
    for (const post of props.posts) {
      for (const upid of post.user_p_method) {
        if (id === upid?.pmid) {
          filter_posts.push(post);
        }
      }
    }

    if (firstCurrency !== "") {
      filter_posts = filter_posts.filter((item: any) => {
        return selectedToken?.id === item?.token_id;
      });
    }
    setPaymentId(id);
    setPosts(filter_posts);
  };

  return (
    <>
      <div className="flex flex-wrap gap-20 items-center justify-end mt-30 md:mt-40 mb-20">
        {/* <div className="flex gap-5 md:gap-30 w-full lg:w-auto">
          <button
            className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${
              active === 1 && "border-primary !text-primary"
            }`}
            onClick={() => {
              setActive(1);
            }}
          >
            USDT
          </button>
          <button
            className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${
              active === 2 && "border-primary !text-primary"
            }`}
            onClick={() => {
              setActive(2);
            }}
          >
            BTC
          </button>
          <button
            className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${
              active === 3 && "border-primary !text-primary"
            }`}
            onClick={() => {
              setActive(3);
            }}
          >
            ETC
          </button>
          <button
            className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${
              active === 4 && "border-primary !text-primary"
            }`}
            onClick={() => {
              setActive(4);
            }}
          >
            KCS
          </button>
          <button
            className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${
              active === 5 && "border-primary !text-primary"
            }`}
            onClick={() => {
              setActive(5);
            }}
          >
            USDC
          </button>
        </div> */}
        <div className="flex md:flex-nowrap flex-wrap  items-center gap-10 w-full lg:w-auto ">
          <div className="relative max-w-full md:max-w-[50%] w-full">
            <FilterSelectMenuWithCoin
              data={listWithCoin}
              border={true}
              dropdown={1}
              setCurrencyName={setCurrencyName}
            />
          </div>
          <div className="max-w-full md:max-w-[50%] w-full">
            <FiliterSelectMenu
              data={list}
              placeholder="Choose Payment Method"
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
              posts={posts}
              setSelectedPost={props.setSelectedPost}
            />
          </div>
          <div className="md:hidden">
            <BuyTableMobile setShow1={props.setShow1} />
          </div>
        </div>

      {/* {active === 2 && (
        <div>
          <div className="md:block hidden">
            <BuyTableDesktop setShow1={props.setShow1} />
          </div>
          <div className="md:hidden">
            <BuyTableMobile setShow1={props.setShow1} />
          </div>
        </div>
      )}
      {active === 3 && (
        <div>
          <div className="md:block hidden">
            <BuyTableDesktop setShow1={props.setShow1} />
          </div>
          <div className="md:hidden">
            <BuyTableMobile setShow1={props.setShow1} />
          </div>
        </div>
      )}
      {active === 4 && (
        <div>
          <div className="md:block hidden">
            <BuyTableDesktop setShow1={props.setShow1} />
          </div>
          <div className="md:hidden">
            <BuyTableMobile setShow1={props.setShow1} />
          </div>
        </div>
      )}
      {active === 5 && (
        <div>
          <div className="md:block hidden">
            <BuyTableDesktop setShow1={props.setShow1} />
          </div>
          <div className="md:hidden">
            <BuyTableMobile setShow1={props.setShow1} />
          </div>
        </div>
      )} */}
    </>
  );
};

export default BuyCoinsTabs;
