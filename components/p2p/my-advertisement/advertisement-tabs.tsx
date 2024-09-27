import FiliterSelectMenu from '@/components/snippets/filter-select-menu';
import React, { useState } from 'react'
import DesktopTable from './desktop-table';
import MobileTable from './mobile-table';
import FilterSelectMenuWithCoin from '@/components/snippets/filter-select-menu-with-coin';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from 'next/router';

interface propsData {
    posts?: any;
    published?: any;
    unpublished?: any;
    userPaymentMethod?: any;
    coinList?: any;
    masterPayMethod?: any;
    session?: any;
}

const AdvertisementTabs = (props: propsData) => {
    const router = useRouter();
    const initialTab = parseInt(router.query.t as string) || 1;
    const [active, setActive] = useState(initialTab);

    const [firstCurrency, setFirstCurrency] = useState('');
    const [selectedToken, setSelectedToken] = useState(Object);
    // const [posts, setPosts] = useState(props?.posts);
    const [paymentId, setPaymentId] = useState('');

    const [startDate, setStartDate] = useState<any>();
    const [value, setValue] = useState(""); // For currency dropdown
    const [resetValue, setResetValue] = useState(false)


    const setCurrencyName = (symbol: string, dropdown: number) => {

        if (dropdown === 1) {
            setFirstCurrency(symbol);
            let token = props?.coinList?.filter((item: any) => {
                return item.symbol === symbol
            });
            setSelectedToken(token[0]);
            setValue(symbol)
        }
    }

    const onPaymentMethodChange = (id: any) => {

        setPaymentId(id);

    }

    const handleDate = (date: any) => {
        setStartDate(date);

    };

    const clearAll = () => {
        setValue('');
        setPaymentId('');
        setSelectedToken('');
        setFirstCurrency("");
        setStartDate(null)
        setResetValue(true);
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
                        <FilterSelectMenuWithCoin data={props.coinList} border={true} dropdown={1} setCurrencyName={setCurrencyName} value={value} />
                    </div>
                    <div className=' max-w-full md:max-w-[40%] min-w-[250px] w-full max-[767px]:hidden'>
                        <FiliterSelectMenu data={props.masterPayMethod}
                            placeholder="Choose Payment Method"
                            auto={false}
                            widthFull={false} type="pmethod"
                            onPaymentMethodChange={onPaymentMethodChange}
                            resetValue={resetValue} // Controlled value for the currency dropdown
                        />
                    </div>
                    <div className=' max-w-full md:max-w-[20%] w-full'>
                        <DatePicker
                            placeholderText={'Select date'}
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
                    <div className="p-[5px] flex items-center gap-[10px] cursor-pointer" onClick={clearAll}>
                        <p className="nav-text-sm whitespace-nowrap hover:!text-primary">Clear Filter</p>
                    </div>
                </div>
            </div>

            {/* Table Data */}
            {/* {
                active === 1 && */}
            <div>
                <div className='md:block hidden'>
                    <DesktopTable active={active} userPaymentMethod={props?.userPaymentMethod} selectedToken={selectedToken} session={props?.session} firstCurrency={firstCurrency} paymentId={paymentId} startDate={startDate} />
                </div>
                <div className='md:hidden'>
                    <MobileTable active={active} userPaymentMethod={props?.userPaymentMethod} selectedToken={selectedToken} session={props?.session} firstCurrency={firstCurrency} paymentId={paymentId} startDate={startDate} />
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