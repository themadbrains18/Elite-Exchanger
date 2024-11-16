import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../contexts/context";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AES } from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import ConfirmPopupNew from "../snippets/confirm-popup-new";
import VerificationNew from "../snippets/verificationNew";
import clickOutSidePopupClose from "../snippets/clickOutSidePopupClose";

/**
 * AntiPhishingCodeProps - Interface defining the props for the AntiPhishingCode component.
 * 
 * This interface is used to define the expected props for the component handling anti-phishing code logic.
 * It includes properties for controlling visibility, session management, enabling/disabling actions,
 * and setting the anti-phishing code.
 * 
 * @interface AntiPhishingCodeProps
 */
interface AntiPhishingCodeProps {
  /**
   * setShow - Function to control the visibility of the anti-phishing code component.
   * 
   * This function is typically used to show or hide the component based on certain conditions.
   * @type {Function}
   */
  setShow?: any;
  /**
   * session - Current session data, potentially containing user-related information.
   * 
   * This session object might include details like user authentication data or session token.
   * @type {any}
   */
  session?: any;
  /**
   * setEnable - Function to enable or disable actions or states within the component.
   * 
   * This can be used to toggle certain features or states in the component (like enabling/disabling buttons).
   * @type {Function}
   */
  setEnable?: any;
  /**
   * setAntiFishingCode - Function to set the anti-phishing code in the component's state.
   * 
   * This function is used to store the anti-phishing code that the user will input for security purposes.
   * @type {Function}
   */
  setAntiFishingCode?: any;
}

type UserSubmitForm = {
  antiphishing?: string;
};

const schema2 = yup.object().shape({
  antiphishing: yup
    .string().required("Antiphishing code is required.")
    .min(4)
    .max(20)
    .matches(/^([a-zA-Z0-9_/_])+$/, 'Please enter valid code(letters, number).').typeError('Please enter 4-20 character.'),
});


const AntiPhishingCode = (props: AntiPhishingCodeProps) => {
  const { mode } = useContext(Context);
  const [enable, setEnable] = useState(1);
  const [formData, setFormData] = useState<UserSubmitForm | null>();


  let { register, handleSubmit, clearErrors, formState: { errors } } = useForm({
    resolver: yupResolver(schema2),
  });

  /**
 * useEffect hook to clear the 'antiphishing' error after 2.5 seconds.
 * This runs whenever there is a change in the 'errors' object.
 * 
 * @param {object} errors - The form error state that tracks validation issues.
 * @returns {void}
 */
  useEffect(() => {
    setTimeout(() => {
      clearErrors('antiphishing');
    }, 2500);
  }, [errors]);

  /**
 * Handles form submission for security settings.
 * This function updates the form data and sets the enable state to 4 upon submission.
 *
 * @param {object} data - The form data containing user input values.
 * @returns {void}
 */
  const onHandleSubmit = async (data: any) => {
    try {
      setEnable(4);
      setFormData(data);
    } catch (error) {
      console.log(error, "security settings");
    }
  };

  /**
 * Handles the final OTP verification and anti-phishing code validation.
 * This function sends the OTP and anti-phishing code to the backend for validation and handles the response accordingly.
 *
 * @param {any} otp - The OTP entered by the user for final verification.
 * @returns {void}
 */
  const finalOtpVerification = async (otp: any) => {
    try {
      // Determine the username based on whether email or phone number is available
      let username = props.session?.user.email !== "null" ? props.session?.user.email : props.session?.user?.number;
      let request = { username: username, antiphishing: formData?.antiphishing, otp: otp, };

      // Encrypt the request data for security before sending it to the server
      const ciphertext = AES.encrypt(
        JSON.stringify(request),
        `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
      );

      let record = encodeURIComponent(ciphertext.toString());
      // Send the request to the backend for anti-phishing validation
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/user/antiPhishing`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: props?.session?.user?.access_token,
          },
          body: JSON.stringify(record),
        }
      ).then((response) => response.json());
      if (response.data.result) {
        toast.success(response.data.message, { autoClose: 2000 });
        props.setAntiFishingCode(true);
        setTimeout(() => {
          setEnable(1);
          props.setEnable(0);
          props.setShow(false);
        }, 3000);
      } else {
        toast.error(response.data.message, { autoClose: 2000 });
      }
    } catch (error) { }
  };

  /**
 * closePopup - Function to handle the closing of a popup or modal.
 * 
 * This function will set the visibility of the popup to false and reset
 * the enable status to 0 when called. It is typically used to close the 
 * popup and reset its associated state.
 * 
 * @function closePopup
 */
  const closePopup = () => {
    props?.setShow(false);
    props.setEnable(0);
  }

  /**
* wrapperRef - Reference to the wrapper element.
* 
* The `useRef` hook is used to reference the wrapper element that contains
* the popup/modal to detect clicks outside of it. This allows the component
* to close the popup when a user clicks outside the wrapper.
* 
* @type {React.RefObject<HTMLElement>}
*/
  const wrapperRef = useRef(null);

  /**
 * clickOutSidePopupClose - Hook to close the popup when clicking outside.
 * 
 * This function is triggered when the user clicks outside the popup wrapper.
 * It listens for a click event outside the referenced wrapper and invokes
 * the `closePopup` function to close the popup.
 * 
 * @function clickOutSidePopupClose
 */
  clickOutSidePopupClose({ wrapperRef, closePopup });

  return (
    <>
      <ToastContainer position="top-right" limit={1} />
      {enable === 1 && (
        <div ref={wrapperRef} className="max-w-[calc(100%-30px)] md:max-w-[500px] w-full p-6 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="flex items-center justify-between ">
            <p className="sec-title">

              {props?.session?.user?.antiphishing === null ? "Create" : "Change"} Anti-Phishing Code
            </p>
            <svg
              onClick={() => {
                props?.setShow(false);
                props.setEnable(0);
                //   props.setActive(0);
              }}
              enableBackground="new 0 0 60.963 60.842"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 60.963 60.842"
              xmlSpace="preserve"
              className="max-w-[18px] cursor-pointer w-full"
            >
              <path
                fill={mode === "dark" ? "#fff" : "#9295A6"}
                d="M59.595,52.861L37.094,30.359L59.473,7.98c1.825-1.826,1.825-4.786,0-6.611
                            c-1.826-1.825-4.785-1.825-6.611,0L30.483,23.748L8.105,1.369c-1.826-1.825-4.785-1.825-6.611,0c-1.826,1.826-1.826,4.786,0,6.611
                            l22.378,22.379L1.369,52.861c-1.826,1.826-1.826,4.785,0,6.611c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                            l22.502-22.502l22.501,22.502c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                            C61.42,57.647,61.42,54.687,59.595,52.861z"
              />
            </svg>
          </div>

          <form onSubmit={handleSubmit(onHandleSubmit)} onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}>
            <div className="py-[30px] ">
              <div className="">
                <div
                  className={` md:flex-row flex-col gap-[30px] flex`}
                >
                  <div className=" w-full">
                    <p className="sm-text mb-[10px]">Anti-Phishing Code</p>

                    <input
                      type="text"
                      {...register("antiphishing")}
                      maxLength={20}
                      placeholder="Anti-Phishing Code"
                      className="sm-text input-cta2 w-full"
                    />

                  </div>
                </div>

                {
                  errors?.antiphishing?.message && (
                    <p className={`${errors.antiphishing ? "text-red-dark" : "text-[#b7bdc6]"} text-[16px] mt-[10px] errorMessage`}>
                      {errors?.antiphishing?.message}
                    </p>
                  )
                }
              </div>
            </div>

            <button type="submit" className="solid-button px-[51px] w-full">
              Submit
            </button>
          </form>
        </div>
      )}
      {enable === 2 && (
        <VerificationNew
          setShow={props?.setShow}
          setEnable={setEnable}
          parentSetEnable={props.setEnable}
          type="email"
          data={formData}
          session={props?.session}
          finalOtpVerification={finalOtpVerification}
        />
      )}
      {enable === 4 && (
        <ConfirmPopupNew
          setEnable={setEnable}
          setShow={props?.setShow}
          parentSetEnable={props.setEnable}
          type="number"
          data={formData}
          session={props?.session}
        />
      )}
    </>
  );
};

export default AntiPhishingCode;
