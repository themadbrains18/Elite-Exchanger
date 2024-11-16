
import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import { formatDate, truncateNumber } from '@/libs/subdomain';

interface setState {
    /** Controls visibility or other show-related behavior, represented as a number */
    show?: number;

    /** Function to update the `show` state, expected to be a function type */
    setShow?: (value: any) => void;

    /** If true, the table or component adjusts to full height */
    fullHeight?: boolean;

    /** If true, displays the price column */
    showPrice?: boolean;

    /** If true, applies a full-width style to certain components */
    widthFull?: boolean;

    /** Position records containing trading or financial data */
    positionRecord?: any;

    /** Data of the current token, typically includes token properties like symbol */
    currentToken?: any;

    /** Identifier or slug for routing or data filtering, type can vary */
    slug?: any;
}

/**
 * Displays a list of recent trades with price, quantity, and time columns.
 * Adjusts the width and appearance based on the provided props.
 *
 * @param {setState} props - The properties controlling the display of trades.
 * @param {number} [props.show] - Optional property to control visibility or related state.
 * @param {(value: any) => void} [props.setShow] - Optional function to update `show` state.
 * @param {boolean} [props.fullHeight] - If true, adjusts the table's height to full.
 * @param {boolean} [props.showPrice] - If true, includes the price column.
 * @param {boolean} [props.widthFull] - If true, sets the component to full width.
 * @param {any[]} [props.positionRecord] - Array of trade records containing price, qty, and timestamp.
 * @param {any} [props.currentToken] - Data for the current token (symbol, details).
 * @param {any} [props.slug] - Optional identifier or filter used for routing or filtering data.
 * @returns {JSX.Element} - The JSX element rendering the MarketTrades component.
 */
const MarketTrades = (props: setState) => {
    return (
        <div className={`bg-[#fafafa] dark:bg-[#1a1b1f] min-[990px]:border-l dark:border-[#25262a] border-[#e5e7eb] py-[14px] px-[16px]  ${props.widthFull ? "max-w-full " : "max-w-[300px]"}  w-full`}>
            <h3 className='top-label dark:!text-white !text-[#000] max-[991px]:hidden'>Recent Trades</h3>
            <div className={`overflow-y-auto orderTable max-h-[320px] md:max-h-[675px]`}>
                {/* head */}
                <div className='grid grid-cols-3 gap-[10px] sticky top-0 bg-light bg-[#fafafa] dark:bg-[#1a1b1f]'>
                    <p className='top-label text-start py-[5px]'>Price (USDT)</p>
                    <p className='top-label text-center py-[5px]'>Qty (USDT)</p>
                    <p className='top-label text-end  py-[5px]'>Time</p>
                </div>

                {props?.positionRecord && props?.positionRecord.length > 0 && props?.positionRecord.map((item: any, index: number) => {
                    return <>
                        <div key={index} className={`grid grid-cols-3 gap-[10px] ${item?.direction === 'long' ? 'bg-[#25e39e0a]' : 'bg-[#fc47471c]'} rounded mb-[4px]`}>
                            <p className={`top-label text-start ${item?.direction === 'long' ? '!text-buy' : '!text-sell'}`}>{currencyFormatter(item?.entry_price?.toFixed(6))}</p>
                            <p className='top-label text-center !text-black dark:!text-white'>{truncateNumber(item?.margin, 6)}</p>
                            <p className='top-label text-end !text-black dark:!text-white'>{formatDate(item?.createdAt)}</p>
                        </div>
                    </>
                })}

                {props?.positionRecord?.length === 0 &&
                    <div className={` py-[50px] flex flex-col items-center justify-center text-[#000000]`}>
                        <p className="sm-text"> No Record Found </p>
                    </div>
                }

            </div>
        </div>
    )
}

export default MarketTrades;