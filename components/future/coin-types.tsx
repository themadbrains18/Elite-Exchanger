import React, { useContext, useEffect, useState } from 'react'
import IconsComponent from '../snippets/icons';
import Context from "../contexts/context";

interface propsData {
    coins?: any;
}

const CoinTypes = (props: propsData) => {
    const [show, setShow] = useState(1);
    const [fill, setFill] = useState(false);

    let { mode } = useContext(Context);

    function fillSvg(e: any) {
        console.log(e.currentTarget);
        // if(mode == "dark"){
        //     e.currentTarget.classList.add("dark:fill-[#fff]")
        // }else{
        //     e.currentTarget.classList.add("fill-[#000]")
        // }
        // setFill(!fill)
    }

  return (
    <div className='h-[600px] max-[1499px]:overflow-x-auto p-[16px] dark:bg-[#1f2127] bg-[#fff] max-w-[380px] w-full max-[991px]:border-b border-r dark:border-[#25262a] border-[#e5e7eb]'>
        <div className='mb-[15px]'>
            <input type="search" placeholder='search...' className='max-w-full w-full  dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] py-[6px] outline-none dark:text-white text-black text-[12px] px-[10px]' />
        </div>
        <div className='flex items-center gap-[20px] mb-[20px]'>
            <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-0 after:w-full after:h-[2px] ${show === 1 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(1) }}>Favorites</button>
            <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-0 after:w-full after:h-[2px] ${show === 2 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(2) }}>USDⓈ-M</button>
            <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-0 after:w-full after:h-[2px] ${show === 3 ? '!text-black after:block  dark:!text-white' : '!text-[#a3a8b7] after:hidden'}`} onClick={() => { setShow(3) }}>COIN-M</button>
        </div>
        <div className='h-[480px] overflow-y-auto'>
            {/* head */}
            <div className='grid grid-cols-4 dark:bg-[#1f2127] bg-[#fff] gap-[10px] sticky top-0 '>
                <p className='top-label text-start py-[5px]'>Symbol</p>
                <p className='top-label text-center py-[5px]'>Latest Price</p>
                <p className='top-label text-end  py-[5px]'>24h%</p>
                <p className='top-label text-end  py-[5px]'>24h Vol</p>
            </div>
            <div className='flex items-center gap-[20px] mb-[20px]'>
                <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-0 after:w-full after:h-[2px] ${show === 1 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(1) }}>Favorites</button>
                <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-0 after:w-full after:h-[2px] ${show === 2 ? 'after:block !text-black dark:!text-white' : 'after:hidden !text-[#a3a8b7]'}`} onClick={() => { setShow(2) }}>USDⓈ-M</button>
                {/* <button className={`admin-body-text relative after:dark:bg-white after:bg-black after:absolute after:bottom-[-3px]  after:left-0 after:w-full after:h-[2px] ${show === 3 ? '!text-black after:block  dark:!text-white' : '!text-[#a3a8b7] after:hidden'}`} onClick={() => { setShow(3) }}>COIN-M</button> */}
            </div>
            <div>
                {/* head */}
                <div className='grid grid-cols-4 gap-[10px] sticky top-0 '>
                    <p className='top-label text-start py-[5px]'>Symbol</p>
                    <p className='top-label text-center py-[5px]'>Latest Price</p>
                    <p className='top-label text-end  py-[5px]'>24h%</p>
                    <p className='top-label text-end  py-[5px]'>24h Vol</p>
                </div>

                {show == 1 &&
                    <div className='grid grid-cols-4 gap-[10px]rounded mb-[4px]'>
                        <p className='top-label text-start !text-black dark:!text-white flex items-center gap-[5px]'>
                            KASUSDT
                        </p>
                        <p className='top-label text-center !text-black dark:!text-white'>0.12920</p>
                        <p className='top-label text-end !text-black dark:!text-white'>0.32%</p>
                        <p className='top-label text-end !text-black dark:!text-white'>33.2M<span>USDT</span></p>
                    </div>
                }
                {show == 2 &&
                    <>
                        {props?.coins && props?.coins.length > 0 && props?.coins.map((item: any) => {
                            return <div className='grid grid-cols-4 gap-[10px]rounded mb-[4px]'>
                                <p className='top-label text-start !text-black dark:!text-white flex items-center gap-[5px]'>
                                    <div className='cursor-pointer'>
                                        <svg
                                            onClick={(e) => { fillSvg(e) }}
                                            width={11}
                                            height={10}
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`dark:stroke-white stroke-black`}
                                            stroke-width="0.4"

                                            fill='transparent'
                                        >
                                            <path d="M4.503.431a.7.7 0 0 1 1.293 0l1.073 2.58 2.785.223a.7.7 0 0 1 .399 1.23L7.931 6.28 8.58 9a.7.7 0 0 1-1.045.76L5.149 8.302 2.765 9.76a.7.7 0 0 1-1.046-.76l.648-2.718L.246 4.464a.7.7 0 0 1 .4-1.23l2.784-.223L4.503.43Z" />
                                        </svg>
                                    </div>
                                    <span>{item?.coin_symbol}{item?.usdt_symbol}</span>
                                </p>
                                <p className='top-label text-center !text-black dark:!text-white'>{item?.token!==null ? item?.token?.price : item?.global_token?.price}</p>
                                <p className='top-label text-end !text-black dark:!text-white'>0.32%</p>
                                <p className='top-label text-end !text-black dark:!text-white'>33.2M<span>USDT</span></p>
                            </div>
                        })}
                    </>
                }
                {show == 3 &&
                    <>
                        <div className='grid grid-cols-4 gap-[10px]rounded mb-[4px]'>
                            <p className='top-label text-start !text-black dark:!text-white flex items-center gap-[5px]'>
                                <div className='cursor-pointer'>
                                    <svg
                                        onClick={() => { setFill(!fill) }}
                                        width={11}
                                        height={10}
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`dark:stroke-white stroke-black ${fill ? "dark:fill-[#fff] fill-[#000]" : "fill-[transparent]"}`}
                                        stroke-width="0.4"

                                        fill='transparent'
                                    >
                                        <path d="M4.503.431a.7.7 0 0 1 1.293 0l1.073 2.58 2.785.223a.7.7 0 0 1 .399 1.23L7.931 6.28 8.58 9a.7.7 0 0 1-1.045.76L5.149 8.302 2.765 9.76a.7.7 0 0 1-1.046-.76l.648-2.718L.246 4.464a.7.7 0 0 1 .4-1.23l2.784-.223L4.503.43Z" />
                                    </svg>
                                </div>
                                <span>KASUSDT</span>
                            </p>
                            <p className='top-label text-center !text-black dark:!text-white'>0.12920</p>
                            <p className='top-label text-end !text-black dark:!text-white'>0.32%</p>
                            <p className='top-label text-end !text-black dark:!text-white'>33.2M<span>USDT</span></p>
                        </div>
                        <div className='grid grid-cols-4 gap-[10px]rounded mb-[4px]'>
                            <p className='top-label text-start !text-black dark:!text-white flex items-center gap-[5px]'>
                                <div className='cursor-pointer'>
                                    <svg
                                        onClick={() => { setFill(!fill) }}
                                        width={11}
                                        height={10}
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`dark:stroke-white stroke-black ${fill ? "dark:fill-[#fff] fill-[#000]" : "fill-[transparent]"}`}
                                        stroke-width="0.4"

                                        fill='transparent'
                                    >
                                        <path d="M4.503.431a.7.7 0 0 1 1.293 0l1.073 2.58 2.785.223a.7.7 0 0 1 .399 1.23L7.931 6.28 8.58 9a.7.7 0 0 1-1.045.76L5.149 8.302 2.765 9.76a.7.7 0 0 1-1.046-.76l.648-2.718L.246 4.464a.7.7 0 0 1 .4-1.23l2.784-.223L4.503.43Z" />
                                    </svg>
                                </div>
                                <span>KASUSDT</span>
                            </p>
                            <p className='top-label text-center !text-black dark:!text-white'>0.12920</p>
                            <p className='top-label text-end !text-black dark:!text-white'>0.32%</p>
                            <p className='top-label text-end !text-black dark:!text-white'>33.2M<span>USDT</span></p>
                        </div>
                        <div className='grid grid-cols-4 gap-[10px]rounded mb-[4px]'>
                            <p className='top-label text-start !text-black dark:!text-white flex items-center gap-[5px]'>
                                <div className='cursor-pointer'>
                                    <svg
                                        onClick={() => { setFill(!fill) }}
                                        width={11}
                                        height={10}
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`dark:stroke-white stroke-black ${fill ? "dark:fill-[#fff] fill-[#000]" : "fill-[transparent]"}`}
                                        stroke-width="0.4"

                                        fill='transparent'
                                    >
                                        <path d="M4.503.431a.7.7 0 0 1 1.293 0l1.073 2.58 2.785.223a.7.7 0 0 1 .399 1.23L7.931 6.28 8.58 9a.7.7 0 0 1-1.045.76L5.149 8.302 2.765 9.76a.7.7 0 0 1-1.046-.76l.648-2.718L.246 4.464a.7.7 0 0 1 .4-1.23l2.784-.223L4.503.43Z" />
                                    </svg>
                                </div>
                                <span>KASUSDT</span>
                            </p>
                            <p className='top-label text-center !text-black dark:!text-white'>0.12920</p>
                            <p className='top-label text-end !text-black dark:!text-white'>0.32%</p>
                            <p className='top-label text-end !text-black dark:!text-white'>33.2M<span>USDT</span></p>
                        </div>
                        <div className='grid grid-cols-4 gap-[10px]rounded mb-[4px]'>
                            <p className='top-label text-start !text-black dark:!text-white flex items-center gap-[5px]'>
                                <div className='cursor-pointer'>
                                    <svg
                                        onClick={() => { setFill(!fill) }}
                                        width={11}
                                        height={10}
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`dark:stroke-white stroke-black ${fill ? "dark:fill-[#fff] fill-[#000]" : "fill-[transparent]"}`}
                                        stroke-width="0.4"

                                        fill='transparent'
                                    >
                                        <path d="M4.503.431a.7.7 0 0 1 1.293 0l1.073 2.58 2.785.223a.7.7 0 0 1 .399 1.23L7.931 6.28 8.58 9a.7.7 0 0 1-1.045.76L5.149 8.302 2.765 9.76a.7.7 0 0 1-1.046-.76l.648-2.718L.246 4.464a.7.7 0 0 1 .4-1.23l2.784-.223L4.503.43Z" />
                                    </svg>
                                </div>
                                <span>KASUSDT</span>
                            </p>
                            <p className='top-label text-center !text-black dark:!text-white'>0.12920</p>
                            <p className='top-label text-end !text-black dark:!text-white'>0.32%</p>
                            <p className='top-label text-end !text-black dark:!text-white'>33.2M<span>USDT</span></p>
                        </div>
                    </>
                }
            </div>
        </div>
        </div>
    )
}

export default CoinTypes;