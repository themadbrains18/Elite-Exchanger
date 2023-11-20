import React, { useContext, useState } from "react";
import Context from "../contexts/context";
import FiliterSelectMenu from "./filter-select-menu";

import { useForm } from "react-hook-form";


interface activeSection {
  setActive: Function,
  setShow: Function;
  masterPayMethod?: any,
  setFormMethod?: any,
}

const AddPayment = (props: activeSection) => {
  const { mode } = useContext(Context);
  const [paymentFields, setPaymentFields] = useState([]);



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

  /**
   * On payment method change
   * @param id 
   */
  const onPaymentMethodChange = (id: any) => {
    for (let nn in getValues()) {
      unregister(nn)
      setValue(nn, '')
    }
    reset();

    let fieldsItem = props.masterPayMethod.filter((item: any) => {
      return item?.id === id;
    })
    setPaymentFields(fieldsItem[0]?.fields);
    setValue('selectPayment', fieldsItem[0]);
  }

  const onHandleSubmit = (data: any) => {

    let pmid = data?.selectPayment?.id;
    let pm_name = data?.selectPayment?.payment_method;
    let master_method = data?.selectPayment;

    delete data.selectPayment;

    let obj = {
      pmid: pmid,
      pm_name: pm_name,
      pmObject: data,
      master_method: master_method
    }

    props.setFormMethod(obj);
    props.setActive(2);
  }

  return (
    <div className="max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
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

      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <div className="py-30 md:py-40">
          <div className="flex flex-col mb-[15px] md:mb-5 gap-10">
            <label className="sm-text">Name</label>
            <FiliterSelectMenu data={props.masterPayMethod}
              placeholder="Choose Payment Method"
              auto={false}
              widthFull={true} type="pmethod" onPaymentMethodChange={onPaymentMethodChange} />
          </div>

          {paymentFields && paymentFields.length > 0 && paymentFields.map((item: any) => {
            // console.log(typeof item?.required,'===field require');
            
            return <>
              <div className="flex flex-col mb-[15px] md:mb-5 gap-10">
                <label className="sm-text">{item?.label}</label>
                <div className="border  border-grey-v-1 dark:border-opacity-[15%]  rounded-5 p-[11px] md:p-[15px]">
                  <input type={item?.type} placeholder={item?.placeholder} {...register(`${item?.name}`, { required: item?.required === 'true'?true:false })} className="outline-none sm-text w-full bg-[transparent]" />
                </div>
              </div>
              {errors?.[item?.name] && (
                <p style={{ color: "#ff0000d1" }}>{item.err_msg}</p>
              )}
            </>
          })}

        </div>
        <button className="solid-button w-full" >Submit</button>
      </form>
    </div>
  );
};





export default AddPayment;
