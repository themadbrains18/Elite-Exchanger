import React, { useEffect, useState } from "react";
import FiliterSelectMenu from "../snippets/filter-select-menu";
import FilterSelectMenuWithCoin from "../snippets/filter-select-menu-with-coin";
import BuyTableDesktop from "./buy/buy-table-desktop";
import BuyTableMobile from "./buy/buy-table-mobile";

/**
 * Interface for the properties (props) passed to the `BuyCoinsTabs` component.
 * This interface defines the various props required by the component to handle different UI states and functionalities.
 */
interface BuyCoinsTabsProps {
  /**
   * A function to set the visibility of the first tab.
   * This will be used to control the UI state of the first tab.
   */
  setShow1: any;
  /**
  * A list of coins available for purchase.
  * This is an optional prop that contains the available coin data, which is used to display the coins in the UI.
  */
  coinList?: any;
  /**
   * The list of posts related to the user's transactions or coins.
   * This is an optional prop that can be used to display posts or related information in the component.
   */
  posts?: any;
  /**
   * A function to set the selected post.
   * This is an optional function that allows the component to update the selected post in the parent component's state.
   */
  setSelectedPost?: any;
  /**
   * A list of available payment methods for the user.
   * This is an optional prop that provides the available payment methods for the user to choose from.
   */
  masterPayMethod?: any;
  /**
   * The user's asset balance or details.
   * This is an optional prop that contains the user's asset data, which may be used to display the balance or asset-related information.
   */
  assets?: any;
  /**
   * The session data of the logged-in user.
   * This is an optional prop that holds the session information, which may be used to manage authentication and user-specific actions.
   */
  session?: any;
}

const BuyCoinsTabs = (props: BuyCoinsTabsProps) => {
  const [firstCurrency, setFirstCurrency] = useState("");
  const [selectedToken, setSelectedToken] = useState(Object);
  const [listWithCoin, setListWithCoin] = useState(props.coinList);
  const [paymentId, setPaymentId] = useState("");
  const [value, setValue] = useState(""); // For currency dropdown
  const [resetValue, setResetValue] = useState(false)

  const list = props.masterPayMethod;

  /**
 * Sets the currency name and updates the selected token and value based on the dropdown choice.
 * This function is used to handle the selection of a currency symbol from the dropdown and updates the corresponding states.
 * 
 * @param {string} symbol - The symbol of the selected currency.
 * @param {number} dropdown - The identifier of the dropdown (e.g., 1 for the first dropdown).
 */
  const setCurrencyName = (symbol: string, dropdown: number) => {
    if (dropdown === 1) {
      setFirstCurrency(symbol);
      let token = props?.coinList?.filter((item: any) => {
        return item.symbol === symbol;
      });
      setSelectedToken(token[0]);
      setValue(symbol);
    }
  };

  /**
 * Updates the selected payment method ID and resets the value flag.
 * This function is triggered when a user selects a payment method, updating the payment ID and resetting 
 * a value flag used for conditional rendering or logic flow.
 *
 * @param {any} id - The ID of the selected payment method.
 */
  const onPaymentMethodChange = (id: any) => {
    setPaymentId(id);
    setResetValue(false)
  };

  /**
 * Resets all relevant state values to their initial or empty states.
 * This function is typically used for clearing form fields, payment details, 
 * and resetting flags when a user initiates a reset or cancellation action.
 *
 * @returns {void} 
 */
  const clearAll = () => {
    setValue('');
    setPaymentId('');
    setSelectedToken('');
    setFirstCurrency("");
    setResetValue(true);
  };


  return (
    <>
      <div className="flex flex-wrap gap-20 items-center justify-end mt-30 md:mt-40 mb-20">
        <div className="flex md:flex-nowrap flex-wrap items-center gap-10 w-full lg:w-auto">
          <div className="relative max-w-full md:max-w-[50%] w-full">
            <FilterSelectMenuWithCoin
              data={listWithCoin}
              border={true}
              dropdown={1}
              setCurrencyName={setCurrencyName}
              value={value} // Controlled value for the currency dropdown
            />
          </div>
          <div className="max-w-full min-w-max md:max-w-[50%] w-full">
            <FiliterSelectMenu
              data={list}
              placeholder="Payment Method"
              auto={false}
              widthFull={false}
              type="pmethod"
              onPaymentMethodChange={onPaymentMethodChange}
              resetValue={resetValue} // Controlled value for the payment method dropdown 
            />
          </div>
          <div className="p-[5px] flex items-center gap-[10px] cursor-pointer" onClick={clearAll}>
            <p className="nav-text-sm whitespace-nowrap hover:!text-primary">Clear Filter</p>
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div>
        <div className="md:block hidden">
          <BuyTableDesktop
            assets={props?.assets}
            setShow1={props.setShow1}
            paymentId={paymentId}
            selectedToken={selectedToken}
            firstCurrency={firstCurrency}
            setSelectedPost={props.setSelectedPost}
            session={props?.session}
          />
        </div>
        <div className="md:hidden">
          <BuyTableMobile
            setShow1={props.setShow1}
            paymentId={paymentId}
            selectedToken={selectedToken}
            firstCurrency={firstCurrency}
            session={props?.session}
            setSelectedPost={props.setSelectedPost}
          />
        </div>
      </div>
    </>
  );
};

export default BuyCoinsTabs;
