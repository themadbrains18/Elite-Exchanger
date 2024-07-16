import React, { useEffect, useState } from "react";
import FiliterSelectMenu from "../snippets/filter-select-menu";
import FilterSelectMenuWithCoin from "../snippets/filter-select-menu-with-coin";
import BuyTableDesktop from "./buy/buy-table-desktop";
import BuyTableMobile from "./buy/buy-table-mobile";

interface activeSection {
  setShow1: any;
  coinList?: any;
  posts?: any;
  setSelectedPost?: any;
  masterPayMethod?: any;
  assets?: any;
  session?: any;
}

const BuyCoinsTabs = (props: activeSection) => {
  const [firstCurrency, setFirstCurrency] = useState("");
  const [selectedToken, setSelectedToken] = useState(Object);
  const [listWithCoin, setListWithCoin] = useState(props.coinList);
  const [paymentId, setPaymentId] = useState("");
  const [value, setValue] = useState(""); // For currency dropdown
  const [resetValue, setResetValue] = useState(false)


  const list = props.masterPayMethod;

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

  const onPaymentMethodChange = (id: any) => {
    setPaymentId(id);
    setResetValue(false)
  };
  
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
