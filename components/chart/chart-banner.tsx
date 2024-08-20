import Image from 'next/image';
import React, { Fragment, useEffect, useRef, useState } from 'react'
import IconsComponent from '../snippets/icons';
import { useRouter } from 'next/router';
import { useWebSocket } from '@/libs/WebSocketContext';
import { currencyFormatter } from '../snippets/market/buySellCard';
import { truncateNumber } from '@/libs/subdomain';
// import Pusher from 'pusher-js';

// const pusher = new Pusher('b275b2f9e51725c09934', {
//   cluster: 'ap2'
// });

interface propsData {
  hlocData?: any;
}



const ChartBanner = (props: propsData) => {

  let [fillFav, setFillFav] = useState(false);
  const [currentToken, setCurrentToken] = useState<any>(Object);
  const [cardsData, setCardsData] = useState([]);
  // let [barWidth, setBarWidth] = useState(0);
  const router = useRouter();
  const { slug } = router.query;

  const wbsocket = useWebSocket();
  useEffect(() => {
    setFillFav(false);
    refreshTokenList();
  }, [slug])

  const socketListenerRef = useRef<(event: MessageEvent) => void>();
  useEffect(() => {
    const handleSocketMessage = (event: any) => {
      const data = JSON.parse(event.data).data;
      let eventDataType = JSON.parse(event.data).type;

      if (eventDataType === "price") {
        refreshTokenList()
      }
    };
    if (wbsocket && wbsocket.readyState === WebSocket.OPEN) {
      if (socketListenerRef.current) {
        wbsocket.removeEventListener('message', socketListenerRef.current);
      }
      socketListenerRef.current = handleSocketMessage;
      wbsocket.addEventListener('message', handleSocketMessage);
    }

    return () => {
      if (wbsocket) {
        wbsocket.removeEventListener('message', handleSocketMessage);
      }
    };
  }, [wbsocket])

  const refreshTokenList = async () => {
    let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
      method: "GET"
    }).then(response => response.json());

    let ccurrentToken = tokenList?.data?.filter((item: any) => {
      return item.symbol === slug
    })

    let obj: any = [
      {
        "cardTitle": "Market Cap",
        "titleIcon": "marketCap",
        "cardPrice": "$" + `${ccurrentToken[0]?.marketcap && ccurrentToken[0]?.marketcap?.toLocaleString('en-US')}`,
        "cardLowHigh": "+2%",
        "bg": "blue",
      },
      {
        "cardTitle": "Max Supply",
        "titleIcon": "infoIcon",
        "cardPrice": "$" + ccurrentToken[0]?.maxSupply !== null ? ccurrentToken[0]?.maxSupply?.toLocaleString('en-US') : ccurrentToken[0]?.circulatingSupply?.toLocaleString('en-US'),
        "cardLowHigh": "+2%",
        "bg": "red",
      },
      {
        "cardTitle": "24 Volume",
        "titleIcon": "watchIcon",
        "cardPrice": "$" + ccurrentToken[0]?.volume?.toLocaleString('en-US'),
        "cardLowHigh": "+2%",
        "bg": "green",
      },
      {
        "cardTitle": "Total Supply",
        "titleIcon": "infoIcon",
        "cardPrice": ccurrentToken[0]?.circulatingSupply?.toLocaleString('en-US'),
        "cardLowHigh": "+2%",
        "bg": "lightblue",
      }
    ]
    setCurrentToken(ccurrentToken[0]);
    setCardsData(obj);

    let favItems = localStorage.getItem('favToken');
    if (favItems) {
      favItems = JSON.parse(favItems);
    }
    if (favItems && favItems.indexOf(ccurrentToken[0]?.id) !== -1) {
      setFillFav(true);
    } else {
      setFillFav(false);
    }


  }

  // const styles = {
  //   width: `${barWidth}%`,
  // };

  // const BarWidth = () =>{

  //   const highPrice = props?.hlocData?.high;
  //   const lowPrice = props?.hlocData?.low;
  //   let currentPrice = currentToken?.price?.toFixed(5); 

  //   // Calculate ranges
  //   const totalRange = highPrice - lowPrice;
  //   // Check for negative price and set to 0 if negative
  //   if (currentPrice < 0) {
  //       currentPrice = 0;
  //   }
  //   const currentRange = currentPrice - lowPrice;
  //   console.log(currentRange,"==========currentRange");

  //   // Calculate bar width percentage
  //   const barWidthPercentage = (currentRange / totalRange) * 100;
  //   setBarWidth(barWidthPercentage);
  // }
  // useEffect(()=>{

  //     BarWidth();

  // },[props])


  return (
    <div className='p-20 rounded-10  bg-white dark:bg-d-bg-primary'>
      {/* head */}
      <div className='flex items-start lg:flex-row flex-col gap-30 md:gap-60'>

        <div className='max-w-full lg:max-w-[50%] w-full flex items-start lg:flex-row flex-col'>
          <div className='max-w-full lg:max-w-[100%] w-full'>
            <div className='flex gap-30 justify-between flex-wrap xl:flex-nowrap'>
              <div className="flex gap-[15px] max-w-full w-full lg:max-w-[50%] items-start lg:justify-start justify-between">
                <div className='flex gap-[15px] items-center'>
                  <Image
                    alt="coins"
                    loading="lazy"
                    width={50}
                    height={50}
                    decoding="async"
                    data-nimg={1}
                    style={{ color: "transparent" }}
                    src={`${currentToken?.image !== undefined ? currentToken?.image : '/assets/home/coinLogo.png'}`}
                    className={`${currentToken?.symbol === "XRP" && "bg-white rounded-full "}`}
                  />

                  <div>
                    <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px] ss">
                      <p className="info-14-18 dark:text-white">{`${currentToken?.fullName}`}</p>
                      <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">
                        {`${currentToken?.symbol}`}
                      </p>
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className='md:m-auto cursor-pointer'
                        onClick={() => {
                          let existItem: any = localStorage.getItem('favToken');
                          if (existItem) {
                            existItem = JSON.parse(existItem);
                          }
                          if (existItem && existItem.indexOf(currentToken?.id) !== -1) {
                            existItem = existItem?.filter((item: any) => {
                              return item !== currentToken?.id
                            })
                            setFillFav(false);
                          }
                          else if (existItem) {
                            setFillFav(true);
                            existItem.push(`${currentToken?.id}`)

                          }
                          else {
                            // localStorage.setItem('favToken', JSON.stringify([`${props?.token?.id}`]));
                            existItem = [`${currentToken?.id}`];
                          }
                          localStorage.setItem('favToken', JSON.stringify(existItem));
                        }}
                      >
                        <g id="Icon">
                          <path
                            id="Mask"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M17.7363 20.95C17.5867 20.95 17.4361 20.915 17.2979 20.843L12.4692 18.3202L7.64151 20.843C7.32143 21.0087 6.93506 20.9803 6.64528 20.7682C6.35361 20.5561 6.20873 20.1972 6.27028 19.842L7.1898 14.5124L3.28824 10.7387C3.02877 10.4878 2.93502 10.1109 3.04581 9.76617C3.15661 9.42336 3.45302 9.17241 3.81097 9.12128L9.20876 8.33718L11.6217 3.48296C11.9417 2.83901 12.9976 2.83901 13.3177 3.48296L15.7306 8.33718L21.1284 9.12128C21.4864 9.17241 21.7828 9.42336 21.8936 9.76617C22.0043 10.1109 21.9106 10.4878 21.6511 10.7387L17.7496 14.5124L18.6691 19.842C18.7306 20.1972 18.5848 20.5561 18.2941 20.7682C18.1293 20.8894 17.9333 20.95 17.7363 20.95Z"
                            fill={fillFav === true ? "#5367FF" : '#d3d3d3'}
                          />
                        </g>
                      </svg>
                    </div>
                    <div className='flex items-center gap-[20px] lg:max-w-[50%] lg:justify-start justify-between mt-[15px]'>
                      <p className="info-14-18 dark:text-white">${currentToken?.price !== undefined ? currencyFormatter(truncateNumber(currentToken?.price, 6)) : '0.0'}</p>
                      {/* <h4 className='md-heading dark:text-white'>${`${currentToken?.price?.toFixed(5)}`}</h4> */}
                      <div className={` items-center gap-[4px] flex`}>
                        <p className={`footer-text-secondary ${Number(props?.hlocData?.changeRate) > 0 ? '!text-buy' : '!text-sell'}`}>{Number(props?.hlocData?.changeRate) > 0 ? '+' : ''}{props?.hlocData?.changeRate !== undefined ? (Number(props?.hlocData?.changeRate) * 100).toFixed(3) : '0.0'}%</p>
                        {Number(props?.hlocData?.changeRate) > 0 &&
                          <IconsComponent type="high" active={false} hover={false} />
                        }
                        {Number(props?.hlocData?.changeRate) < 0 &&
                          <IconsComponent type="low" active={false} hover={false} />
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='max-w-full lg:max-w-[50%] w-full lg:mt-0 mt-20'>

                <div className='flex items-center justify-between '>
                  <div className='flex items-center gap-[4px]'>
                    <IconsComponent type='exchange' hover={false} active={false} />
                    <p className="info-10-14 !text-gamma">High / Low Price</p>
                  </div>
                  <p className="info-10-14 cursor-pointer !text-gamma py-0 md:py-[5px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5 flex items-center gap-[10px]">
                    <span>24h</span>
                    {/* <IconsComponent type='downArrow' hover={false} active={false} /> */}
                  </p>
                </div>
                <div className='mb-[15px] mt-[15px] w-full h-[5px] rounded-[5px] bg-grey-v-2'>
                  <div className={`w-[40%] h-[5px] rounded-[5px] bg-primary`}></div>
                </div>
                <div className='flex items-center justify-between'>
                  <p className="info-10-14 !text-gamma">Low : ${props?.hlocData?.changeRate !== undefined ? currencyFormatter(props?.hlocData?.low) : 0.0}</p>
                  <p className="info-10-14 !text-gamma">High : ${props?.hlocData?.changeRate !== undefined ? currencyFormatter(props?.hlocData?.high) : 0.0}</p>
                </div>
              </div>

            </div>

            {/* <div className='flex gap-30 justify-between flex-wrap xl:flex-nowrap'>
              <div className='flex items-center gap-[20px] lg:max-w-[50%] lg:justify-start justify-between'>
                <h3 className='md-heading dark:text-white'>${`${currentToken?.price?.toFixed(5)}`}</h3>
                <div className={` items-center gap-[10px] flex`}>
                  <p className={`footer-text-secondary ${Number(props?.hlocData?.changeRate) > 0 ? '!text-buy' : '!text-sell'}`}>{Number(props?.hlocData?.changeRate) > 0 ? '+' : ''}{props?.hlocData?.changeRate !== undefined ? (Number(props?.hlocData?.changeRate) * 100).toFixed(3) : '0.0'}%</p>
                  {Number(props?.hlocData?.changeRate) > 0 &&
                    <IconsComponent type="high" active={false} hover={false} />
                  }
                  {Number(props?.hlocData?.changeRate) < 0 &&
                    <IconsComponent type="low" active={false} hover={false} />
                  }
                </div>
              </div>
            </div> */}
          </div>
        </div>


        <div className='max-w-full lg:max-w-[50%] w-full lg:mt-0 mt-20'>
          <div className='grid grid-cols-2 xl:grid-cols-4 gap-20'>
            {
              cardsData.map((ele: any, ind: number) => {
                return (
                  <Fragment key={ind} >
                    <div className={`dark:bg-black-v-1 p-10 rounded-[5px] ${ele.bg === "blue" ? "bg-[#B9DDFF]" : ele.bg === "red" ? "bg-[#FEE2E2]" : ele.bg === "green" ? "bg-[#D1FAE5]" : "bg-[#E2F2FF]"}`} >
                      <div className='flex items-center gap-[4px] lg:mb-[15px] mb-[18px]'>
                        <IconsComponent type={ele.titleIcon} hover={false} active={false} />
                        <p className='info-10-14 !text-gamma'>{ele.cardTitle}</p>
                      </div>
                      <p className="md-text md:text-[14px] text-[12px] !font-bold">{ele.cardPrice ?? '$0'}</p>
                      {/* <div className={` items-center gap-[10px] flex`}>
                        <p className={`footer-text-secondary !text-[12px] lg:!text-[16px] !text-buy`}>{ele.cardLowHigh}</p>
                        <IconsComponent type="high" active={false} hover={false} />
                      </div> */}
                    </div>
                  </Fragment>
                )
              })
            }
          </div>
        </div>
      </div>

      {/* banner cards */}

    </div>
  )
}

export default ChartBanner;