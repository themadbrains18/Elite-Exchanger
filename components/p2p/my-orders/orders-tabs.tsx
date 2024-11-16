import React, { useState } from 'react'
import OrdersTableDesktop from './orders-table-desktop';
import OrdersTableMobile from './orders-table-mobile';
import ReactDatePicker from 'react-datepicker';
import FilterSelectMenuWithCoin from '@/components/snippets/filter-select-menu-with-coin';

/**
 * Props interface for the OrdersTabs component.
 *
 * This interface defines the props expected by the OrdersTabs component, including
 * data related to the order list, payment methods, and coin options.
 *
 * @interface OrdersTabsPropsData
 */
interface OrdersTabsPropsData {
    /**
     * The list of orders to display in the tab.
     * @type {any}
     */
    orderList?: any;

    /**
     * A function to set the selected order ID.
     * @type {any}
     */
    setOrderId?: any;

    /**
     * The list of available coins or tokens.
     * @type {any}
     */
    coinList?: any;

    /**
     * The master payment method list for the user.
     * @type {any}
     */
    masterPayMethod?: any;

    /**
     * The user’s selected payment method.
     * @type {any}
     */
    userPaymentMethod?: any;
}

const OrdersTabs = (props: OrdersTabsPropsData) => {

    const [active, setActive] = useState(1);

    const [firstCurrency, setFirstCurrency] = useState('');
    const [selectedToken, setSelectedToken] = useState(Object);
    const [paymentId, setPaymentId] = useState('');
    const [startDate, setStartDate] = useState<any>();
    const [value, setValue] = useState(""); // For currency dropdown

    /**
     * Sets the currency symbol and updates the related token information.
     *
     * This function updates the first currency symbol, filters the coin list to 
     * find the selected token based on the symbol, and sets the selected token and 
     * the input value accordingly.
     *
     * @param {string} symbol - The currency symbol to set (e.g., 'USD', 'BTC').
     * @param {number} dropdown - The dropdown identifier. If it's 1, the function
     *                             updates the first currency and selects the token.
     */
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

    /**
     * Updates the start date state with the selected date.
     *
     * This function is triggered when a date is selected. It updates the `startDate` 
     * state to the selected value.
     *
     * @param {any} date - The selected date to be set as the start date.
     */
    const handleDate = (date: any) => {
        setStartDate(date);
    };

    /**
     * Clears the form values and resets the state.
     *
     * This function resets the input value, selected token, and the start date 
     * to their initial states, effectively clearing the form.
     */
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
                        <FilterSelectMenuWithCoin data={props?.coinList} border={true} dropdown={1} setCurrencyName={setCurrencyName} value={value} />
                    </div>

                    <div className=' max-w-full md:max-w-[50%] w-full'>
                        <ReactDatePicker
                            placeholderText={'Select Date'}
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