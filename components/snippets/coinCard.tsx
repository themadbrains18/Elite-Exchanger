import React, { useState } from 'react'
import Image from 'next/image'
import ChartImage from './chart-image';
import IconsComponent from './icons';
import Link from 'next/link';
import { currencyFormatter } from './market/buySellCard';

interface cardData {
    coinCardData: any
}

const CoinCard = (props: cardData) => {
    const [imgSrc, setImgSrc] = useState(false);


    return (
        <>
            <Link href={`/chart/${props.coinCardData.symbol}`} className='block'>
                <div className='max-w-[375px] w-full rounded-[15px] p-[20px] pb-[5px] bg-white dark:bg-omega border border-grey dark:border-[transparent] duration-300 hover:drop-shadow-xl'>
                    <div>
                        <div className='flex items-center gap-[8px] md:gap-[15px] mb-[16px] md:mb-[20px] justify-between'>
                            <div className='flex items-center gap-[8px] '>
                                <span className={`block coinCard_logo ${props.coinCardData.symbol == "XRP" && 'bg-white rounded-full relative overflow-hidden'}`}>
                                    <Image src={`${imgSrc ? '/assets/history/Coin.svg' : props.coinCardData?.image}`} alt="Coin Logo" className="block w-[30px] md:w-[50px]" width={50} height={50} onError={() => setImgSrc(true)} />
                                </span>
                                <span className='coinCard_fname block md-heading !text-[16px] md:!text-[23px] leading-[17px] md:leading-[28px] text-black dark:text-white !font-normal'> {props.coinCardData.fullName}</span>
                            </div>
                            <span className='coinCard_sortName block bg-[#E9EAF0] dark:bg-[#080808] dark:text-primary rounded-[8px] px-[15px] py-[5px]'>{props.coinCardData.symbol}</span>
                        </div>

                        <div className='coinCard_Cost flex items-center gap-[10px] justify-between'>
                            <h2 className="md-heading !text-[14px] md:!text-[23px] !font-bold text-black dark:text-white">${currencyFormatter(props.coinCardData.price?.toFixed(5))}</h2>
                            <div className={`flex items-center gap-[4px] flex-wrap`}>
                                <p className={`footer-text-secondary  !text-[12px] md:!text-base ${Number(props.coinCardData?.hlocv?.changeRate) > 0 ? '!text-buy' : '!text-sell'}`}>{Number(props.coinCardData?.hlocv?.changeRate) > 0 ? '+' : ''}{props.coinCardData?.hlocv?.changeRate !== undefined ? (Number(props.coinCardData?.hlocv?.changeRate) * 100).toFixed(3) : '0.0'}%</p>

                                {Number(props.coinCardData?.hlocv?.changeRate) > 0 &&
                                    <IconsComponent type="high" active={false} hover={false} />
                                }
                                {Number(props.coinCardData?.hlocv?.changeRate) < 0 &&
                                    <IconsComponent type="low" active={false} hover={false} />
                                }
                            </div>

                        </div>
                    </div>
                    <div className='coinCard_Graph'>
                        <div className='max-w-full w-full'>
                            <IconsComponent type={props.coinCardData.chartImg} active={false} hover={false} />
                            {/* <svg width={350} height={123}  viewBox="0 0 350 123" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><defs><linearGradient id="yurb9vlbp7" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style={{stopColor: 'rgb(36, 174, 100)', stopOpacity: '0.5'}} /><stop offset="90%" style={{stopColor: 'rgb(36, 174, 100)', stopOpacity: 0}} /></linearGradient></defs><path d="M-1 20L-1 9.43L0 9.43L2.17 8.96L4.34 14.26L6.51 16.1L8.68 18L10.85 17.04L13.02 15.22L15.19 14.22L17.36 13.45L19.53 10.39L21.7 9.98L23.87 11.09L26.04 14.34L28.21 16.59L30.38 11.12L32.55 9.68L34.72 8.96L36.89 7.27L39.06 5L41.23 6.05L43.4 5.17L45.57 6.84L47.74 7.54L49.91 8.59L51 21 Z" fill="url(#yurb9vlbp7)" stroke="rgba(24, 22, 55, .11)" strokeWidth={1} /></svg> */}
                        </div>
                    </div>
                </div>
            </Link>

        </>
    )
}

export default CoinCard
