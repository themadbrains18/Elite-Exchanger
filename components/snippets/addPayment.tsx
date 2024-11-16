import React, { Fragment, useContext, useRef, useState } from "react";
import Context from "../contexts/context";
import FiliterSelectMenu from "./filter-select-menu";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import clickOutSidePopupClose from "./clickOutSidePopupClose";

/**
 * Interface representing the props for the AddPayment component.
 * This interface includes properties to manage the state and form for adding payment methods.
 */
interface AddPaymentProps {
  /**
   * Function to set the active state of the component.
   * Used to toggle visibility or activation status of elements.
   */
  setActive: Function,
  /**
  * Function to toggle the visibility of the component or modal.
  * Can be used to show or hide the payment method form or popup.
  */
  setShow: Function;
  /**
  * Optional property representing the master payment method.
  * This could hold a reference to a specific payment method object when editing or pre-filling the form.
  */
  masterPayMethod?: any,
  /**
   * Optional function to set the form's payment method.
   * Used for controlling the payment method that the user selects or enters in the form.
   */
  setFormMethod?: any,
  /**
   * Optional list of payment methods or related data.
   * This can be used to display available methods or for rendering related information in the form.
   */
  list?: any;
}

const AddPayment = (props: AddPaymentProps) => {
  const { mode } = useContext(Context);
  const [paymentFields, setPaymentFields] = useState([]);
  const [enableFront, setEnableFront] = useState(false);
  const [disable, setDisable] = useState(false)
  const [qrCode, setQrCode] = useState("notValid");
  const [errMsg, setErrMsg] = useState(false)

  let {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    setError,
    getValues,
    clearErrors,
    unregister,
    formState,
    formState: { errors },
  } = useForm();

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
 * Function to handle the change of the payment method.
 * It updates the form fields and resets the form based on the selected payment method.
 *
 * @param {any} id - The ID of the selected payment method. Used to filter the available methods.
 */
  const onPaymentMethodChange = (id: any) => {
    // Unregister all existing form fields and clear their values
    for (let nn in getValues()) {
      unregister(nn)
      setValue(nn, '')
    }
    reset();
    // Find the selected payment method based on the ID
    let fieldsItem = props?.masterPayMethod?.filter((item: any) => {
      return item?.id === id;
    })

    setPaymentFields(fieldsItem[0]?.fields);
    setValue('selectPayment', fieldsItem[0]);
  }

  /**
 * Handles the file input change event, validating the file type and size before uploading.
 * It uploads the valid image file to the server and handles errors related to file type or size.
 *
 * @param {any} e - The event object that contains the selected file.
 */
  const handleFileChange = async (e: any) => {
    try {
      // Clear any existing errors for the 'qr_code' field
      clearErrors('qr_code');
      // Get the selected file
      let file = e.target.files[0];
      const fileType = file['type'];
      // Validate file type
      if (!validImageTypes.includes(fileType)) {
        // invalid file type code goes here.
        setError("qr_code", {
          type: "custom",
          message: "Invalid file type, upload only (png, jpg,jpeg).",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Clear the input
        }
        setTimeout(() => {
          clearErrors('qr_code')
        }, 3000);
        return;
      }

      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 2) {
        setError("qr_code", {
          type: "custom",
          message: 'File size upto 2 MB',
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Clear the input
        }
        setTimeout(() => {
          clearErrors('qr_code')
        }, 3000);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'my-uploads');
      setEnableFront(true);
      const data = await fetch(`${process.env.NEXT_PUBLIC_FILEUPLOAD_URL}`, {
        method: 'POST',
        body: formData
      }).then(r => r.json());

      if (data.error !== undefined) {
        setError("qr_code", {
          type: "custom",
          message: data?.error?.message,
        });
        setEnableFront(false);
        return;
      }

      setQrCode(data.secure_url);
      setEnableFront(false);

    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Handles the form submission, performs validation on the input data, checks if the phone number is already added, 
   * and processes the payment method selection.
   *
   * @param {any} data - The form data containing payment method and phone number information.
   * 
   * @returns {void} - Does not return a value; it updates the state and calls external functions on form validation.
   */
  const onHandleSubmit = (data: any) => {
    // If form data is empty, show an error message and prevent submission
    if (Object.values(data).length == 0) {
      setErrMsg(true)
      return;
    }
    setDisable(true)
    // Validate phone number length (must be 10 digits)
    if (data?.phonenumber?.length !== 10) {
      toast.error("Number contain 10 digits", { autoClose: 2000 });
      setTimeout(() => {
        setDisable(false)
      }, 3000)
      return;
    }
    else {
      // Check if the phone number is already associated with the selected payment method
      let pmt = props?.list?.filter((item: any) => {
        return item.pm_name === data?.selectPayment?.payment_method && item.pmObject.phonenumber === data.phonenumber
      })
       // If the number is already added, show an error message
      if (pmt.length > 0) {
        toast.error("This Number is already added.", { autoClose: 2000 });
        setTimeout(() => {
          setDisable(false)
        }, 3000)
        return;
      }
      // Extract and clean up data to prepare for submission
      let pmid = data?.selectPayment?.id;
      let pm_name = data?.selectPayment?.payment_method;
      let master_method = data?.selectPayment;

      // Check if a QR code is provided and valid
      if (qrCode !== "notValid" || data?.qr_code?.length > 0) {
        data.qr_code = qrCode;
      }
      else {
        delete data.qr_code
      }
      // Remove selectPayment from the data before submission
      delete data.selectPayment;
      // Prepare the object to be passed to the parent component
      let obj = {
        pmid: pmid,
        pm_name: pm_name,
        pmObject: data,
        master_method: master_method
      }
      props.setFormMethod(obj);
      props.setActive(2);
    }

  }

  const closePopup = () => {
    props?.setShow(false);
    props.setActive(0)
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });

  return (
    <div ref={wrapperRef} className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="flex items-center justify-between ">
        <p className="sec-title">Payment Method Setting</p>
        <svg
          onClick={() => {
            props.setShow(false),
              props.setActive(0)
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
      <p className="pt-40 info-14-18">When you sell your cryptocurrency, the added payment method will be shown to the buyer during the transaction. To accept cash transfer, please make sure the information is correct.</p>

      <form onSubmit={handleSubmit(onHandleSubmit)} onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}>
        <div className="py-30 md:py-40">
          <div className="flex flex-col mb-[15px] md:mb-5 gap-10">
            <label className="sm-text">Payment Method</label>
            <FiliterSelectMenu data={props.masterPayMethod}
              placeholder="Choose Payment Method"
              auto={false}
              widthFull={true} type="pmethod" onPaymentMethodChange={onPaymentMethodChange} />
            {
              errMsg && (
                <p className="errorMessage">Please select payment method.</p>
              )
            }


          </div>

          {paymentFields && paymentFields.length > 0 && paymentFields.map((item: any, index: number) => {
            // console.log(typeof item?.required,'===field require');

            return <Fragment key={index}>
              <div className="flex flex-col mb-[15px] md:mb-5 ">
                <label className="sm-text mb-[10px]">{item?.label} {item?.required === 'true' && <span className="text-red dark:text-[#9295a6]">*</span>}</label>
                <div className="border relative border-grey-v-1 dark:border-opacity-[15%]  rounded-5 p-[11px] md:p-[15px] mb-[5px]">
                  {item?.name === "qr_code" &&

                    <>
                      {enableFront &&
                        <>
                          <div className="bg-black  z-[1] duration-300 absolute top-0 left-0 h-full w-full opacity-80 visible"></div>
                          <div className='loader w-[35px] z-[2] h-[35px] absolute top-[calc(50%-10px)] left-[calc(50%-10px)] border-[6px] border-[#d9e1e7] rounded-full animate-spin border-t-primary '></div>
                        </>
                      }

                      <input type={item?.type} placeholder={item?.placeholder} {...register(`${item?.name}`, { required: item?.required === 'true' ? true : false })} ref={fileInputRef} onChange={(e) => {
                        handleFileChange(e);
                      }} className="outline-none sm-text w-full bg-[transparent]" />
                    </>

                  }
                  {item?.name !== "qr_code" &&
                    <input type={item?.type} placeholder={item?.placeholder} {...register(`${item?.name}`, { required: item?.required === 'true' ? true : false })} className="outline-none sm-text w-full bg-[transparent]" />
                  }

                </div>
                {errors?.[item?.name] && (
                  <>
                    {errors?.[item?.name]?.type === 'custom' && (
                      <p className="errorMessage">{String(errors?.[item?.name]?.message)}</p>
                    )}
                    {errors?.[item?.name]?.type !== 'custom' &&
                      <p className="errorMessage">{item.err_msg}</p>
                    }

                  </>

                )}
              </div>


            </Fragment>
          })}

        </div>
        <button disabled={enableFront || disable || paymentFields.length === 0} className={`solid-button w-full ${(enableFront === true || disable || paymentFields.length === 0) ? 'opacity-25 cursor-not-allowed' : ''}`} >Submit</button>
      </form>
    </div>
  );
};





export default AddPayment;
