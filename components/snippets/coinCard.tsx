import React from 'react'
import Image from 'next/image'
import ChartImage from './chart-image';
import IconsComponent from './icons';
import Link from 'next/link';

interface cardData{
    coinCardData: any 
}
const CoinCard = (props:cardData) => {
  return (
    <>
        <Link href={`/chart/${props.coinCardData.symbol}`} className='block'>
            <div className='max-w-[375px] w-full rounded-[15px] p-[30px] pb-[5px] bg-white dark:bg-omega border border-grey dark:border-[transparent] duration-300 hover:drop-shadow-xl'>
                    <div>
                        <div className='flex items-center gap-[8px] md:gap-[15px] mb-[16px] md:mb-[40px]'>
                            <span className='block coinCard_logo'>
                                <Image src={`${props.coinCardData?.image}`} alt="Coin Logo" className="block w-[30px] md:w-[50px]" width={50} height={50}/>
                            </span>
                            <span className='coinCard_fname block md-heading  !text-[23px] dark:text-white !font-normal'> {props.coinCardData.fullName}</span>  
                            <span className='coinCard_sortName block bg-[#E9EAF0] rounded-[8px] px-[15px] py-[8px]'>{props.coinCardData.symbol}</span>  
                        </div>

                        <div className='coinCard_Cost flex items-center gap-[20px]'>
                            <h2 className="md-heading md:!text-[28px] !font-bold dark:text-white">{props.coinCardData.price?.toFixed(5)}</h2>
                            <div className={`flex items-center gap-[10px] `}>
                                <p className={`footer-text-secondary  ${props.coinCardData.status == "high" ? "!text-[#03A66D]":"!text-[#DC2626]" }`}>{props.coinCardData.change24h}</p>
                                <IconsComponent type={props.coinCardData.status} active={false} hover={false}/>
                            </div>
                        </div>
                    </div>
                    <div className='coinCard_Graph'>
                        <div className='max-w-full w-full'>
                            <IconsComponent type={props.coinCardData.chartImg} active={false} hover={false}/>
                        </div>
                    </div>
            </div>
        </Link>

    </>
  )
}

export default CoinCard
