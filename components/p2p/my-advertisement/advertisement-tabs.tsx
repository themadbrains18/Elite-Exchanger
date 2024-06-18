import FiliterSelectMenu from '@/components/snippets/filter-select-menu';
import React, { useState } from 'react'
import DesktopTable from './desktop-table';
import MobileTable from './mobile-table';
import FilterSelectMenuWithCoin from '@/components/snippets/filter-select-menu-with-coin';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

interface propsData {
    posts?: any;
    published?: any;
    unpublished?: any;
    userPaymentMethod?: any;
    coinList?: any;
    masterPayMethod?: any;
}

const AdvertisementTabs = (props: propsData) => {
    const [active, setActive] = useState(1);

    const [firstCurrency, setFirstCurrency] = useState('');
    const [selectedToken, setSelectedToken] = useState(Object);
    // const [posts, setPosts] = useState(props?.posts);
    const [paymentId, setPaymentId] = useState('');

    const [publishedData, setPublishedData] = useState(props.published);

    const [unpublishedData, setUnpublishedData] = useState(props.unpublished);

    const [adsHistory, setAdsHistory] = useState(props?.posts);

    const [startDate, setStartDate] = useState();

    const setCurrencyName = (symbol: string, dropdown: number) => {
        
        if (dropdown === 1) {
            setFirstCurrency(symbol);
            let token = props?.coinList?.filter((item: any) => {
                return item.symbol === symbol
            });
            setSelectedToken(token[0]);

            // let postData = [];
            // let filterRecord = props.published;
            // if (active === 2) {
            //     filterRecord = props.unpublished;
            // }
            // if (active === 3) {
            //     filterRecord = props?.posts;
            // }

            // let filter_posts = filterRecord.filter((item: any) => {
            //     return token[0]?.id === item?.token_id
            // });
            // if (paymentId !== '') {
            //     for (const post of filter_posts) {
            //         for (const upid of post.user_p_method) {
            //             if (paymentId === upid?.pmid) {
            //                 postData.push(post);
            //             }
            //         }
            //     }
            // }
            // else {
            //     postData = filter_posts;
            // }

            // if(startDate !==null && startDate !==undefined){
            //     postData = postData.filter((item: any) => {
            //         let postDate = moment(item?.createdAt).format('LL');
            //         let compareDate = moment(startDate).format('LL');
            //         if(compareDate  === postDate){
            //             return item
            //         }  
            //     });
            // }

            // if (active === 1) {
            //     setPublishedData(postData);
            // }
            // if (active === 2) {
            //     setUnpublishedData(postData);
            // }
            // if (active === 3) {
            //     setAdsHistory(postData);
            // }
        }
    }

    const onPaymentMethodChange = (id: any) => {

        // let filter_posts = [];
        // let filterRecord = props.published;
        // if (active === 2) {
        //     filterRecord = props.unpublished;
        // }
        // if (active === 3) {
        //     filterRecord = props?.posts;
        // }


        // for (const post of filterRecord) {
        //     for (const upid of post.user_p_method) {
        //         if (id === upid?.pmid) {
        //             filter_posts.push(post);
        //         }
        //     }
        // }
        // if (firstCurrency !== '') {
        //     filter_posts = filter_posts.filter((item: any) => {
        //         return selectedToken?.id === item?.token_id
        //     });
        // }
        setPaymentId(id);

        // if(startDate !==null && startDate !==undefined){
        //     filter_posts = filter_posts.filter((item: any) => {
        //         let postDate = moment(item?.createdAt).format('LL');
        //         let compareDate = moment(startDate).format('LL');
        //         if(compareDate  === postDate){
        //             return item
        //         }  
        //     });
        // }
        
        // if (active === 1) {
        //     setPublishedData(filter_posts);
        // }
        // if (active === 2) {
        //     setUnpublishedData(filter_posts);
        // }
        // if (active === 3) {
        //     setAdsHistory(filter_posts);
        // }
    }

    const handleDate = (date: any) => {
        setStartDate(date);
        // let filter_posts = [];
        // let filterRecord = props.published;
        // if (active === 2) {
        //     filterRecord = props.unpublished;
        // }
        // if (active === 3) {
        //     filterRecord = props?.posts;
        // }

        // if (paymentId !== '') {
        //     for (const post of filterRecord) {
        //         for (const upid of post.user_p_method) {
        //             if (paymentId === upid?.pmid) {
        //                 filter_posts.push(post);
        //             }
        //         }
        //     }
        // }

        // if (firstCurrency !== '') {
        //     filter_posts = filter_posts.filter((item: any) => {
        //         return selectedToken?.id === item?.token_id
        //     });
        // }

        
        // if(filter_posts.length > 0){
        //     filter_posts = filter_posts.filter((item: any) => {
        //         let postDate = moment(item?.createdAt).format('LL');
        //         let compareDate = moment(date).format('LL');
        //         if(compareDate  === postDate){
        //             return item
        //         }  
        //     });
        // }
        // else{
        //     filter_posts = filterRecord.filter((item: any) => {
        //         let postDate = moment(item?.createdAt).format('LL');
        //         let compareDate = moment(date).format('LL');
        //         if(compareDate  === postDate){
        //             return item
        //         }                
        //     });
        // }

        // if (active === 1) {
        //     setPublishedData(filter_posts);
        // }
        // if (active === 2) {
        //     setUnpublishedData(filter_posts);
        // }
        // if (active === 3) {
        //     setAdsHistory(filter_posts);
        // }
    };

    return (
        <>
            <div className='flex flex-wrap gap-20 items-center justify-between  mt-30 md:mt-40'>
                <div className="flex gap-5 md:gap-30 w-full lg:w-auto ">
                    <button
                        className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 1 && "border-primary !text-primary"}`}
                        onClick={() => {
                            setActive(1);
                        }}
                    >
                        Published
                    </button>
                    <button
                        className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 2 && "border-primary !text-primary"}`}
                        onClick={() => {
                            setActive(2);
                        }}
                    >
                        To Publish
                    </button>
                    <button
                        className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 3 && "border-primary !text-primary"}`}
                        onClick={() => {
                            setActive(3);
                        }}
                    >
                        Ad History
                    </button>
                </div>
                <div className='flex md:flex-nowrap flex-wrap items-center gap-10 w-full lg:w-auto md:p-0 pb-[15px] md:!border-none border-b-[0.5px]  dark:border-[#efefef26] border-grey-v-2'>
                <div className='relative max-w-full md:max-w-[40%] w-full'>
                    <FilterSelectMenuWithCoin data={props.coinList} border={true} dropdown={1} setCurrencyName={setCurrencyName} />
                    </div>
                    <div className=' max-w-full md:max-w-[40%] w-full'>
                    <FiliterSelectMenu data={props.masterPayMethod}
                        placeholder="Choose Payment Method"
                        auto={false}
                        widthFull={false} type="pmethod" onPaymentMethodChange={onPaymentMethodChange} />
                    </div>
                    <div className=' max-w-full md:max-w-[20%] w-full'>
                        <DatePicker
                            placeholderText={'Select a date'} 
                            selected={startDate}
                            onChange={(date: any) => handleDate(date)}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            className="sm-text input-cta2 w-full border border-grey-v-1 dark:border-[#ccced94d] rounded-[5px] !bg-[transparent] h-[43px]"
                        />
                        {/* <input type="date" className='md:w-fit w-full border w-full border-grey-v-1 dark:border-[#ccced94d] dark:bg-d-bg-primary  dark:!text-white  bg-transparent rounded-[5px] py-[8px] px-[15px]' /> */}
                    </div>
                </div>
            </div>

            {/* Table Data */}
            {/* {
                active === 1 && */}
                <div>
                    <div className='md:block hidden'>
                        <DesktopTable active={active} userPaymentMethod={props?.userPaymentMethod} selectedToken={selectedToken} firstCurrency={firstCurrency} paymentId={paymentId} startDate={startDate}/>
                    </div>
                    <div className='md:hidden'>
                        <MobileTable active={active} userPaymentMethod={props?.userPaymentMethod} selectedToken={selectedToken} firstCurrency={firstCurrency} paymentId={paymentId} startDate={startDate}/>
                    </div>
                </div>
{/* 
            }

            {
                active === 2 &&
                <div>
                    <div className='md:block hidden'>
                        <DesktopTable data={unpublishedData} updatePublishedPsot={updatePublishedPsot} />
                    </div>
                    <div className='md:hidden'>
                        <MobileTable data={unpublishedData} updatePublishedPsot={updatePublishedPsot}/>
                    </div>
                </div>

            }

            {
                active === 3 &&
                <div>
                    <div className='md:block hidden'>
                        <DesktopTable data={adsHistory} updatePublishedPsot={updatePublishedPsot} active={active} />
                    </div>
                    <div className='md:hidden'>
                        <MobileTable data={adsHistory} updatePublishedPsot={updatePublishedPsot} active={active} />
                    </div>
                </div>

            } */}
        </>
    )
}

export default AdvertisementTabs;