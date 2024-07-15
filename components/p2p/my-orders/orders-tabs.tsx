import React, { useState } from 'react'
import OrdersTableDesktop from './orders-table-desktop';
import OrdersTableMobile from './orders-table-mobile';
import ReactDatePicker from 'react-datepicker';
import FiliterSelectMenu from '@/components/snippets/filter-select-menu';
import FilterSelectMenuWithCoin from '@/components/snippets/filter-select-menu-with-coin';

interface propsData {
    orderList?: any;
    setOrderId?: any;
    coinList?: any;
    masterPayMethod?: any;
    userPaymentMethod?: any;
}

const OrdersTabs = (props: propsData) => {

    const [active, setActive] = useState(1);

    const [firstCurrency, setFirstCurrency] = useState('');
    const [selectedToken, setSelectedToken] = useState(Object);
    const [paymentId, setPaymentId] = useState('');
    const [startDate, setStartDate] = useState<any>();
    const [value, setValue] = useState(""); // For currency dropdown


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
        setValue('')
        setSelectedToken('')
        setStartDate(null)
    };

    return (
        <>
            <div className='flex flex-wrap gap-20 items-center justify-between  mt-30 md:mt-40'>
                <div className="flex gap-5 md:gap-30 w-full lg:w-auto  mt-30 md:mt-40">
                    <button
                        className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 1 && "border-primary !text-primary"}`}
                        onClick={() => {
                            setActive(1);
                        }}
                    >
                        All
                    </button>
                    <button
                        className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 2 && "border-primary !text-primary"}`}
                        onClick={() => {
                            setActive(2);
                        }}
                    >
                        In Process
                    </button>
                    <button
                        className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 3 && "border-primary !text-primary"}`}
                        onClick={() => {
                            setActive(3);
                        }}
                    >
                        Completed
                    </button>
                    <button
                        className={`pb-20 md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 4 && "border-primary !text-primary"}`}
                        onClick={() => {
                            setActive(4);
                        }}
                    >
                        Canceled
                    </button>
                </div>
                <div className='flex md:flex-nowrap flex-wrap items-center gap-10 w-full lg:w-auto md:p-0 pb-[15px] md:!border-none border-b-[0.5px]  dark:border-[#efefef26] border-grey-v-2'>
                    <div className='relative max-w-full md:max-w-[50%] w-full'>
                        <FilterSelectMenuWithCoin data={props?.coinList} border={true} dropdown={1} setCurrencyName={setCurrencyName} value={value}/>
                    </div>

                    <div className=' max-w-full md:max-w-[50%] w-full'>
                        <ReactDatePicker
                            placeholderText={'MM/DD/YYYY'}
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
            <div>
                <div className='md:block hidden'>
                    <OrdersTableDesktop active={active} setOrderId={props.setOrderId} userPaymentMethod={props?.userPaymentMethod} selectedToken={selectedToken} firstCurrency={firstCurrency} paymentId={paymentId} startDate={startDate} />
                </div>
                <div className='md:hidden'>
                    <OrdersTableMobile active={active} setOrderId={props.setOrderId} userPaymentMethod={props?.userPaymentMethod} selectedToken={selectedToken} firstCurrency={firstCurrency} paymentId={paymentId} startDate={startDate} />
                </div>
            </div>
            {/* {
                active === 1 &&
            }
            {
                active === 2 &&
                <div>
                    <div className='md:block hidden'>
                        <OrdersTableDesktop data={pendingOrder} setOrderId={props.setOrderId} />
                    </div>
                    <div className='md:hidden'>
                        <OrdersTableMobile data={pendingOrder} setOrderId={props.setOrderId} />
                    </div>
                </div>
            }
            {
                active === 3 &&
                <div>
                    <div className='md:block hidden'>
                        <OrdersTableDesktop data={CompletedOrder} setOrderId={props.setOrderId} />
                    </div>
                    <div className='md:hidden'>
                        <OrdersTableMobile data={CompletedOrder} setOrderId={props.setOrderId} />
                    </div>
                </div>
            }
            {
                active === 4 &&
                <div>
                    <div className='md:block hidden'>
                        <OrdersTableDesktop data={CanceledOrder} setOrderId={props.setOrderId} />
                    </div>
                    <div className='md:hidden'>
                        <OrdersTableMobile data={CanceledOrder} setOrderId={props.setOrderId} />
                    </div>
                </div>
            } */}
        </>
    )
}

export default OrdersTabs