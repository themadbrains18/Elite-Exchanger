import React, { useContext, useEffect, useState } from 'react';
import Context from "../contexts/context";
import { useRouter } from "next/router";
import { currencyFormatter } from '../snippets/market/buySellCard';

/**
 * Interface defining the expected properties for the component.
 * 
 * - `coins` (optional): Represents data related to coins, could be any type of data depending on the usage (e.g., array of coin objects).
 * - `show1` (optional): A boolean flag to conditionally render or control the display of a component or feature.
 */
interface propsData {
    coins?: any;
    show1?:boolean;
}

const CoinTypes = (props: propsData) => {
    const [show, setShow] = useState(1);
    const [fill, setFill] = useState(false);
    const [favCoin, setfavCoin] = useState([]);
    const [filteredCoins, setFilteredCoins] = useState([]);
    
    let { mode } = useContext(Context);

    const router = useRouter();

    /**
     * Effect hook to manage the filtering and setting of favorite coins.
     * 
     * This hook checks if any favorite coins are stored in localStorage and filters
     * the coins passed through `props.coins` based on the saved favorite coin IDs.
     * 
     * Dependencies:
     * - `mode`: This will trigger the effect when it changes.
     * - `props?.coins`: The list of coins passed from the parent component.
     */
    useEffect(() => {
        let existItem: any = localStorage.getItem('futurefavToken');
        if (existItem) {
            existItem = JSON.parse(existItem);
        }
        let coinsItem = props?.coins?.filter((item: any) => {
            if (existItem?.includes(item?.id)) {
                return item;
            }
        })
        setfavCoin(coinsItem);
        setFilteredCoins(coinsItem);
    }, [mode, props?.coins]);

    /**
     * Toggles the fill color of an SVG element and manages the list of favorite coins in localStorage.
     * 
     * This function checks the current mode (dark or light) and applies a corresponding fill color to
     * the clicked SVG element. It also updates the list of favorite coins stored in localStorage based
     * on whether the coin ID is already present. The list of favorite coins is then updated in the state.
     * 
     * @param {Object} e - The event object triggered by clicking the SVG element.
     * @param {Object} item - The coin object associated with the clicked SVG.
     */
    function fillSvg(e: any, item: any) {
        if (mode == "dark") {
            e.currentTarget.classList.add("dark:fill-[#fff]");
        } else {
            e.currentTarget.classList.add("fill-[#000]");
        }
        setFill(!fill)

        let existItem: any = localStorage.getItem('futurefavToken');
        if (existItem) {
            existItem = JSON.parse(existItem);
        }
        if (existItem && existItem?.indexOf(item?.id) !== -1) {
            existItem = existItem?.filter((j: any) => {
                return j !== item?.id
            })
        }
        else if (existItem) {
            existItem.push(`${item?.id}`)
        }
        else {
            existItem = [`${item?.id}`];
        }

        let coinsItem = props?.coins?.filter((item: any) => {
            if (existItem?.includes(item?.id)) {
                return item;
            }
        })
        setfavCoin(coinsItem);
        // setFilteredCoins(coinsItem);
        localStorage.setItem('futurefavToken', JSON.stringify(existItem));
    }

    /**
     * Filters the list of coins based on the search term entered by the user.
     * 
     * This function listens for input changes and filters the coins based on whether the `coin_symbol` 
     * or `usdt_symbol` contains the search term (case insensitive). The coins are filtered from either
     * the `favCoin` list (if `show` is 1) or the `props.coins` list (if `show` is 2), and the filtered 
     * results are stored in the `filteredCoins` state.
     * 
     * @param {Object} e - The event object triggered by the input field change.
     */
    const filterCoin = (e:any) =>{
        const searchTerm = e.target.value.toLowerCase();
        let record = [];
        if (show === 1) {
            record = favCoin.filter((item: any) => {
                return item.coin_symbol.toLowerCase().includes(searchTerm) || item.usdt_symbol.toLowerCase().includes(searchTerm);
            });
        } else if (show === 2) {
            record = props?.coins?.filter((item: any) => {
                return item.coin_symbol.toLowerCase().includes(searchTerm) || item.usdt_symbol.toLowerCase().includes(searchTerm);
            });
        }
        setFilteredCoins(record);
    }

    return (
        <div className='h-[780px] max-[1499px]:overflow-x-auto p-[16px] dark:bg-[#1f2127] bg-[#fff] max-w-[380px] w-full max-[991px]:border-b border-r dark:border-[#25262a] border-[#e5e7eb]'>
            <div className='mb-[15px]'>
                <input type="search" onChange={(e)=>{filterCoin(e)}}  placeholder='search...' className='max-w-full w-full dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] py-[6px] outline-none dark:text-white text-black text-[12px] px-[10px]' />
            </div>

            <div className='h-[480px] overflow-y-auto'>
                {/* head */}

                <div className='flex items-center gap-[20px] mb-[20px]'>
                    <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-0 after:w-full after:h-[2px] ${show === 1 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(1); setFilteredCoins(favCoin); }}>Favorites</button>
                    <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-0 after:w-full after:h-[2px] ${show === 2 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(2); setFilteredCoins(props.coins); }}>USDⓈ-M</button>
                </div>
                <div>
                    {/* head */}
                    <div className='flex gap-[20px] items-center   '>
                  
                            <div className='items-center  '>
                                <svg
                                    width={11}
                                    height={10}
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`dark:stroke-white stroke-black`}
                                    strokeWidth="0.4"

                                    fill='transparent'
                                >
                                    <path d="M4.503.431a.7.7 0 0 1 1.293 0l1.073 2.58 2.785.223a.7.7 0 0 1 .399 1.23L7.931 6.28 8.58 9a.7.7 0 0 1-1.045.76L5.149 8.302 2.765 9.76a.7.7 0 0 1-1.046-.76l.648-2.718L.246 4.464a.7.7 0 0 1 .4-1.23l2.784-.223L4.503.43Z" />
                                </svg>
                            </div>
                        

                        <div className='grid grid-cols-4 gap-[10px] sticky top-0 w-full'>
                            <p className='top-label text-start py-[5px]'>Symbol</p>
                            <p className='top-label text-center py-[5px]'>Latest Price</p>
                            <p className='top-label text-end  py-[5px]'>24h%</p>
                            <p className='top-label text-end  py-[5px]'>24h Vol</p>
                        </div>
                    </div>


                    {show == 1 &&
                        <>
                            {filteredCoins && filteredCoins.length > 0 ? filteredCoins.map((item: any) => {
                                  let color = 'transparent';
                                  let existItem: any = localStorage !==undefined && localStorage.getItem('futurefavToken');
  
                                  if (existItem) {
                                      existItem = JSON.parse(existItem);
                                  }
  
                                  if (existItem?.includes(item?.id)) {
                                      if (mode == "dark") {
                                          color = "fill-[#fff]";
                                      } else {
                                          color = "fill-[#000]"
                                      }
                                  }
                                return <a key={item.id} href={`/future/${item.coin_symbol}${item.usdt_symbol}`}>
                                     <div className='flex gap-[20px] items-center mb-[4px]'>
                                    <div className='cursor-pointer items-center'>
                                        <svg
                                            onClick={(e) => {e.preventDefault(); fillSvg(e, item) }}
                                            width={11}
                                            height={10}
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`dark:stroke-white stroke-black ${color}`}
                                            strokeWidth="0.4"
                                            fill='transparent'
                                        >
                                            <path d="M4.503.431a.7.7 0 0 1 1.293 0l1.073 2.58 2.785.223a.7.7 0 0 1 .399 1.23L7.931 6.28 8.58 9a.7.7 0 0 1-1.045.76L5.149 8.302 2.765 9.76a.7.7 0 0 1-1.046-.76l.648-2.718L.246 4.464a.7.7 0 0 1 .4-1.23l2.784-.223L4.503.43Z" />
                                        </svg>
                                    </div>
                                    <div  className='grid grid-cols-4 gap-[10px]rounded  cursor-pointer w-full'>
                               
                                        <p className='top-label text-start !text-black dark:!text-white flex items-center gap-[5px]'>
                                            <span>{item?.coin_symbol}{item?.usdt_symbol}</span>
                                        </p>
                                        <p className='top-label text-center !text-black dark:!text-white'>{item?.token !== null ? currencyFormatter(item?.token?.price?.toFixed(5)) : currencyFormatter(item?.global_token?.price?.toFixed(5))}</p>
                                        <p className='top-label text-end !text-black dark:!text-white'>0.32%</p>
                                        <p className='top-label text-end !text-black dark:!text-white'>33.2M<span>USDT</span></p>
                                    </div>
                  </div>
                                </a>

                            }
                        ) :

                        <p className='top-label text-center mt-2 !text-black dark:!text-white '>No record Found</p>
                    
                    }
                        </>
                    }
                    {show == 2 &&
                        <>
                            {filteredCoins && filteredCoins.length > 0 && filteredCoins.map((item: any) => {

                                let color = 'transparent';
                                let existItem: any = localStorage !==undefined && localStorage.getItem('futurefavToken');

                                if (existItem) {
                                    existItem = JSON.parse(existItem);
                                }

                                if (existItem?.includes(item?.id)) {
                                    if (mode == "dark") {
                                        color = "fill-[#fff]";
                                    } else {
                                        color = "fill-[#000]"
                                    }
                                }

                                return <a key={item.id} href={`/future/${item.coin_symbol}${item.usdt_symbol}`}>
                                
                                <div className='flex gap-[20px] items-center mb-[4px]'>
                                    <div className='cursor-pointer '>
                                        <svg
                                            onClick={(e) => {e.preventDefault(); fillSvg(e, item) }}
                                            width={11}
                                            height={10}
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`dark:stroke-white stroke-black ${color}`}
                                            strokeWidth="0.4"
                                            fill='transparent'
                                        >
                                            <path d="M4.503.431a.7.7 0 0 1 1.293 0l1.073 2.58 2.785.223a.7.7 0 0 1 .399 1.23L7.931 6.28 8.58 9a.7.7 0 0 1-1.045.76L5.149 8.302 2.765 9.76a.7.7 0 0 1-1.046-.76l.648-2.718L.246 4.464a.7.7 0 0 1 .4-1.23l2.784-.223L4.503.43Z" />
                                        </svg>
                                    </div>

                                    <div className='grid grid-cols-4 gap-[10px] rounded  cursor-pointer w-full'>
                                        <p className='top-label text-start !text-black dark:!text-white flex items-center gap-[5px]'>
                                            <span>{item?.coin_symbol}{item?.usdt_symbol}</span>
                                        </p>
                                        <p className='top-label text-center !text-black dark:!text-white'>{item?.token !== null ? currencyFormatter(item?.token?.price?.toFixed(5)) : currencyFormatter(item?.global_token?.price?.toFixed(5))}</p>
                                        <p className='top-label text-end !text-black dark:!text-white'>0.32%</p>
                                        <p className='top-label text-end !text-black dark:!text-white'>33.2M<span>USDT</span></p>
                                    </div>
                                </div>
                                </a>

                            })
                            }

                        </>
                    }
                </div>
            </div>
        </div>
    )
}
export default CoinTypes;
