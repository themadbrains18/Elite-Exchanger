import React, { useState } from 'react'
import FiliterSelectMenu from '@/components/snippets/filter-select-menu';
import FilterSelectMenuWithCoin from '@/components/snippets/filter-select-menu-with-coin';
import SellTableDesktop from './sell-table-desktop';
import SellTableMobile from './sell-table-mobile';



interface activeSection {
    setShow1: any;
    coinList?:any;
  }

const SellCoinsTabs = (props:activeSection) => {
  const [active, setActive] = useState(1);
  const [firstCurrency, setFirstCurrency] = useState('');
  const [selectedToken, setSelectedToken] = useState(Object);

  const list = [{ fullname: 'All Payments' }, { fullname: 'Bank Transfer' }, { fullname: 'UPI' }, { fullname: 'Paytm' }, { fullname: 'Google Pay' }];
  const listWithCoin =props.coinList;

  const setCurrencyName = (symbol: string, dropdown: number) => {
    if (dropdown === 1) {
        setFirstCurrency(symbol);
        let token = list.filter((item: any) => {
            return item.symbol === symbol
        });
        setSelectedToken(token[0]);
    }
}

  return (
    <>
        <div className='flex flex-wrap gap-20 items-center justify-end mt-30 md:mt-40 mb-20'>
            {/* <div className="flex gap-5 md:gap-30 w-full lg:w-auto">
                <button
                    className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 1 && "border-primary !text-primary"}`}
                    onClick={() => {
                    setActive(1);
                    }}
                >
                    USDT
                </button>
                <button
                    className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 2 && "border-primary !text-primary"}`}
                    onClick={() => {
                    setActive(2);
                    }}
                >
                    BTC
                </button>
                <button
                    className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 3 && "border-primary !text-primary"}`}
                    onClick={() => {
                    setActive(3);
                    }}
                >
                    ETC
                </button>
                <button
                    className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 4 && "border-primary !text-primary"}`}
                    onClick={() => {
                    setActive(4);
                    }}
                >
                    KCS
                </button>
                <button
                    className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 5 && "border-primary !text-primary"}`}
                    onClick={() => {
                    setActive(5);
                    }}
                >
                    USDC
                </button>
            </div> */}
            <div className='flex md:flex-nowrap flex-wrap items-center gap-10 w-full lg:w-auto'>
                <div className='relative max-w-full md:max-w-[50%] w-full'>
                <FilterSelectMenuWithCoin data={listWithCoin} border={true} dropdown={1} setCurrencyName={setCurrencyName}/> 

                </div>
                <div className=' max-w-full md:max-w-[50%] w-full'>
                <FiliterSelectMenu data={list} placeholder="Choose Payment Method"
                        auto={false}
                        widthFull={false} />
                        </div>
            </div>
        </div>

        {/* Table Data */}
     
            <div>
                <div className='md:block hidden'>
                    <SellTableDesktop  setShow1={props.setShow1} />
                </div>
                <div className='md:hidden'>
                    <SellTableMobile  setShow1={props.setShow1} />
                </div>
            </div>
      
    
    </>
  )
}

export default SellCoinsTabs;