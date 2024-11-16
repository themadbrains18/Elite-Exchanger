import React, { useRef } from "react";
import Image from "next/image";
import clickOutSidePopupClose from "../snippets/clickOutSidePopupClose";

/**
 * Interface for managing the state and actions of the whitelist success screen.
 * 
 * This interface defines the props needed to control the visibility of the whitelist success screen, 
 * as well as enabling/disabling actions related to the whitelist process.
 */
interface WhitelistSuccessfulProps {
  /**
   * Function to enable/disable features or UI elements based on the whitelist status.
   * 
   * @type {Function}
   */
  setEnable: Function;
  /**
   * Function to set the active state, typically used to manage the visibility 
   * or active status of a component or screen.
   * 
   * @type {Function}
   */
  setActive: Function;
  /**
   * Function to control the visibility of the whitelist success screen or related modal/popup.
   * 
   * @type {Function}
   */
  setShow: Function;
  /**
   * Boolean value indicating the current status of the whitelist (active or inactive).
   * 
   * @type {boolean}
   */
  whitelist: boolean

}
const WhitelistSuccessful = (props: WhitelistSuccessfulProps) => {
  /**
  * Closes the popup and resets the relevant states.
  */
  const closePopup = () => {
    props.setActive(false);
    props.setShow(false);
    props.setEnable(0);
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });

  return (
    <>
      <div ref={wrapperRef} className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="flex items-center justify-center ">
          <Image src='/assets/profile/successful.gif' width={60} height={60} alt="success" />
        </div>
        <p className="py-20 info-14-18 text-center">WhiteList {props?.whitelist === true ? "Enabled" : "Disabled"}</p>
        <p className="pb-20 info-14 text-center">You have successfuly {props?.whitelist === true ? "enabled" : "disabled"} whitelist</p>

        <button
          className="solid-button w-full hover:bg-primary-800"
          onClick={() => {
            props.setActive(false);
            props.setShow(false);
            props.setEnable(0);
          }}
        >
          OK
        </button>

      </div>
    </>
  );
};

export default WhitelistSuccessful;
