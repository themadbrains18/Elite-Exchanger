import React, { Fragment, useContext, useEffect, useState } from "react";
import Image from "next/image";
import Favorites from "../snippets/market/favorites";
import AllCrypto from "../snippets/market/allCrypto";
import Spot from "../snippets/market/spot";
import Future from "../snippets/market/future";
// import TopGainers from "../snippets/market/topGainers";
import NewListing from "../snippets/market/newListing";

interface propsData {
  coins: any,
  networks:any,  
  session:any,  

}

const CoinList = (props: propsData) => {

  const [active1, setActive1] = useState(2);
  // const [topgainer, setTopGainers] = useState([]);
  const [favouriteToken, setFavouriteToken] = useState([]);

  const [spotTrade, SetSpotTrade] = useState([]);
  const [futureTrade, SetFutureTrade] = useState([]);

  let tabsData = [
    {
      id: 1,
      name: "Favorites"
    },
    {
      id: 2,
      name: "All Crypto"
    },
    {
      id: 3,
      name: "Spot"
    },
    {
      id: 4,
      name: "Future"
    },
    {
      id: 6,
      name: "New Listing"
    }
  ];

  let newCoins = props.coins.filter((item: any) => {
    return item.tokenType === 'mannual'
  })

  useEffect(() => {
    // get favorite tokens
    let favItems = localStorage.getItem('favToken');
    if (favItems) {
      favItems = JSON.parse(favItems);
      let array: any = [];
      for (const item of props.coins) {
        if (favItems && favItems.indexOf(item?.id) !== -1) {
          array.push(item);
        }
      }
      setFavouriteToken(array);
    }

    // spot trade token
    let spot = props.coins.filter((item: any) => {
      return item.tradePair !== null
    });
    SetSpotTrade(spot);

    //Get future trade token list
    getFutureTardeList();

    // Get top gainer token list
    // getTopGainersList();
  }, [props?.coins]);

  // const getTopGainersList = async () => {
  //   try {
  //     let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token/topgainer`, {
  //       method: "GET"
  //     }).then(response => response.json());

  //     setTopGainers(tokenList);
  //   } catch (error) {

  //   }
  // }

  const getFutureTardeList = async () => {
    try {
      let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future`, {
        method: "GET"
      }).then(response => response.json());

      SetFutureTrade(tokenList?.data);
    } catch (error) {

    }
  }


  return (
    <section className="mt-30">
      <div className="p-20 md:p-40 rounded-10  bg-white dark:bg-d-bg-primary">
        <div className="flex justify-between max-[1350px]:gap-20 max-[1350px]:flex-wrap mb-[20px]">
          <div className="overflow-auto flex gap-30 max-[1200px]:flex-wrap ">

            <div className="flex  gap-[25px]  w-max">
              {tabsData.map((item, ind) => {
                return (
                  <Fragment key={ind}>
                    <button className={`sec-text text-center whitespace-nowrap text-gamma border-b-2 border-[transparent] pb-[25px]  ${active1 === item.id && "!text-primary border-primary"}`} onClick={() => setActive1(item.id)}>
                      {item.name}
                    </button>
                  </Fragment>
                )
              })}
            </div>
          </div>
          {/* <div className="flex items-center gap-5">
            <div className="p-[5px] flex gap-[10px] items-center">
              <p className="nav-text-sm">Show 10</p>
              <Image src="/assets/profile/downarrow.svg" width={24} height={24} alt="arrow" />
            </div>
          </div> */}
        </div>
        {active1 === 1 &&
          <Favorites coins={favouriteToken} networks={props?.networks} session={props?.session}/>
        }
        {active1 === 2 &&
          <AllCrypto coins={props.coins} networks={props?.networks} session={props?.session}/>
        }
        {active1 === 3 &&
          <Spot coins={spotTrade}  networks={props?.networks} session={props?.session}/>
        }
        {active1 === 4 &&
          <Future coins={futureTrade}  networks={props?.networks} session={props?.session}/>
        }
        {active1 === 6 &&
          <NewListing coins={newCoins}  networks={props?.networks} session={props?.session}/>
        }

      </div>
    </section>
  )
};

export default CoinList;