import React, { useState } from 'react'
import FiliterSelectMenu from '@/components/snippets/filter-select-menu';
import FilterSelectMenuWithCoin from '@/components/snippets/filter-select-menu-with-coin';
import SellTableDesktop from './sell-table-desktop';
import SellTableMobile from './sell-table-mobile';

/**
 * Props for the SellCoinsTabs component.
 * 
 * This interface defines the structure of the props passed to the SellCoinsTabs component.
 * It includes methods for managing visibility and a list of available coins.
 * 
 * @interface SellCoinsTabsProps
 * 
 * @property {function} setShow1 - A function to manage visibility (likely to show or hide a modal or component).
 * @property {Array} [coinList] - An optional array of coins available for selling. Each coin could have properties such as symbol, price, etc.
 * 
 * @example
 * // Example usage of the SellCoinsTabsProps interface:
 * const props: SellCoinsTabsProps = {
 *   setShow1: toggleVisibilityFunction,
 *   coinList: coinDataArray,
 * };
 */
interface SellCoinsTabsProps {
    setShow1: any;
    coinList?: any;
}

const SellCoinsTabs = (props: SellCoinsTabsProps) => {
    const [firstCurrency, setFirstCurrency] = useState('');
    const [selectedToken, setSelectedToken] = useState(Object);

    const list = [{ fullname: 'All Payments' }, { fullname: 'Bank Transfer' }, { fullname: 'UPI' }, { fullname: 'Paytm' }, { fullname: 'Google Pay' }];
    const listWithCoin = props.coinList;

    /**
     * Sets the currency name and updates the selected token based on the provided symbol.
     * 
     * This function updates the first currency state and selects the token corresponding
     * to the provided symbol. It also filters the list of available tokens to find the 
     * one that matches the symbol and sets it as the selected token.
     * 
     * @function setCurrencyName
     * 
     * @param {string} symbol - The symbol of the currency to set (e.g., 'BTC', 'ETH').
     * @param {number} dropdown - A number indicating which dropdown (1 or another value).
     *                              If dropdown is 1, it updates the first currency and selected token.
     * 
     * @example
     * // Example usage of the setCurrencyName function:
     * setCurrencyName('BTC', 1);
     */
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
                <div className='flex md:flex-nowrap flex-wrap items-center gap-10 w-full lg:w-auto'>
                    <div className='relative max-w-full md:max-w-[50%] w-full'>
                        <FilterSelectMenuWithCoin data={listWithCoin} border={true} dropdown={1} setCurrencyName={setCurrencyName} />

                    </div>
                    <div className=' max-w-full md:max-w-[50%] w-full'>
                        <FiliterSelectMenu data={list} placeholder="Choose Payment Method"
                            auto={false}
                            widthFull={false} />
                    </div>
                </div>
            </div>

            <div>
                <div className='md:block hidden'>
                    <SellTableDesktop setShow1={props.setShow1} />
                </div>
                <div className='md:hidden'>
                    <SellTableMobile setShow1={props.setShow1} />
                </div>
            </div>


        </>
    )
}

export default SellCoinsTabs;