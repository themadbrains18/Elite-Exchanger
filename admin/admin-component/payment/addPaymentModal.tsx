import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Context from "@/components/contexts/context";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { AES } from "crypto-js";

const AddPaymentModal = (props: any) => {
  const { mode } = useContext(Context);
  const schema = yup.object().shape({
    payment_method: yup.string().required("This field is required"),
    icon: yup.mixed().required("Icon is required"),
    numberOfFields: yup.string().required("Number of Fields is required"),
    paymentFields: yup.array().of(
      yup.object().shape({
        label: yup.string().required("This field is required"),
        type: yup.string().required("This field is required"),
        required: yup.string().required("This field is required"),
        ifoptional: yup.string().required("This field is required"),
        name: yup.string().required("This field is required"),
        placeholder: yup.string().required("This field is required"),
        err_msg: yup.string().required("This field is required"),
      })
    ).required("This field is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "paymentFields",
    control,
  });
  const numberOfFields = watch("numberOfFields");
  const { data: session } = useSession()
  useEffect(() => {
    // console.log("hii");

    const newVal = Number(numberOfFields || 0);
    const oldVal = fields.length;
    if (newVal > oldVal) {
      for (let i = oldVal; i < newVal; i++) {
        append({
          label: "",
          type: "",
          required: "",
          ifoptional: "",
          name: "",
          placeholder: "",
          err_msg: "",
        });
      }
    } else {
      for (let i = oldVal; i > newVal; i--) {
        remove(i - 1);
      }
    }
  }, [numberOfFields]);

  const [logo, setLogo] = useState('');



  const handleFileChange = async (e: any) => {
    try {
      let file = e.target.files[0];
      const fileSize = file.size / 1024 / 1024;

      if (fileSize > 2) {
        toast.warning('file size upto 2 mb');
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my-uploads");

      const data = await fetch(`${process.env.NEXT_PUBLIC_FILEUPLOAD_URL}`, {
        method: "POST",
        body: formData,
      }).then((r) => r.json());

      if (data.error !== undefined) {
        // toast.error(data?.error?.message)
        setError("icon", {
          type: "custom",
          message: data?.error?.message,
        });
        return;
      }
      setLogo(data.secure_url);
      setValue("icon", data.secure_url);
      clearErrors("icon");
    } catch (error) {
      console.error(error);
    }
    // let files = e.target.files[0];
    // setValue("image", files);
    // setTokenImg(files);
    // clearErrors("image");
    // if (files) {
    //   var reader = new FileReader();
    //   reader.readAsDataURL(files);
    //   reader.onloadend = function (e: any) {
    //     setTokenImage(reader?.result as string);
    //   }.bind(this);
    // }
  };

  let submitForm = async (data: any, e: any) => {
    e.preventDefault(e);
    let fields = [];
    let obj = {
      label: data.label,
      type: data.type,
      required: data.required,
      ifoptional: data.ifoptional,
      name: data.name,
      placeholder: data.placeholder,
      err_msg: data.err_msg,
    };

    fields.push(obj);
    data["region"] = "india";
    data["fields"] = data.paymentFields;

    data.icon = data.icon;
    delete data.numberOfFields
    delete data.paymentFields
    const ciphertext = AES.encrypt(
      JSON.stringify(data),
      `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
    );

    let record = encodeURIComponent(ciphertext.toString());
    let res = await fetch(`/api/payment/save`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": session?.user?.access_token || ''
      },
      body: JSON.stringify(record),
    });

    let result = await res.json();

    if (result?.data?.status === 200) {
      toast.success(result?.data?.data?.message);
      setTimeout(() => {
        props?.setOpen(false);
      }, 1000)
      // setValue("tokenType", "");
    } else {
      toast.error(result.data.data);
    }

  };

  return (
    <>
      <ToastContainer />
      <div
        className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-80 visible`}
      ></div>
      <div
        className={`max-h-[610px] overflow-auto duration-300 max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-[20px] z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`}
      >
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="px-3 py-2 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h6 className="sec-title"> Payment Method</h6>
              <button type="button" className="focus:outline-none">
                <svg
                  onClick={() => {
                    props.setOpen(false);

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
                    fill={mode === "dark" ? "#fff" : "#000"}
                    d="M59.595,52.861L37.094,30.359L59.473,7.98c1.825-1.826,1.825-4.786,0-6.611
                            c-1.826-1.825-4.785-1.825-6.611,0L30.483,23.748L8.105,1.369c-1.826-1.825-4.785-1.825-6.611,0c-1.826,1.826-1.826,4.786,0,6.611
                            l22.378,22.379L1.369,52.861c-1.826,1.826-1.826,4.785,0,6.611c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                            l22.502-22.502l22.501,22.502c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                            C61.42,57.647,61.42,54.687,59.595,52.861z"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="payment_method" className="block mb-1 dark:text-white">
                  Add Payment Name
                </label>
                <input
                  id="payment_method"
                  type="text"
                  placeholder="Enter payment Method"
                  {...register("payment_method")}
                  className="sm-text input-cta2 w-full"
                />
                <p className="text-red-dark text-[12px]">
                  {errors.payment_method?.message}
                </p>
              </div>

              <div>
                {/* {!logo ? (
                <div className="flex items-center">
                  <p className="text-sm text-gray-500 mr-2">Add Icon</p>
                  <button onClick={changeLogo} className="px-3 py-2 rounded-md bg-blue-500 text-white">
                    Change Logo
                  </button>
                </div>
              ) : ( */}
                <div className={` ${logo == "" ? " w-full" : "w-max"} relative min-h-[100px] hover:dark:bg-black-v-1 flex  mt-2 md:mt-5 border-[1.5px] border-dashed border-grey-v-1 dark:border-grey-v-2 dark:border-opacity-[15%] rounded-md`}>
                  <div className="m-auto ">
                    <input
                      type="file"
                      placeholder="Type Here...."
                      id="front1"
                      name="front"
                      autoComplete="off"
                      className="hidden"
                      onChange={(e) => handleFileChange(e)}
                    />
                    <label
                      htmlFor="front1"
                      className=" cursor-pointer block h-full items-stretch "
                    >
                      <Image
                        src={logo}
                        alt="payment icon"
                        width={50}
                        height={50}
                        className={`${logo == "" ? "hidden" : "flex"} w-full`}
                      />
                      <div className={`${logo != "" ? "hidden" : "block"}`}>
                        <p className="nav-text-sm md:nav-text-lg text-center  mb-2">
                          Drop your file upload or{" "}
                          <span className="text-primary">Browse</span>
                        </p>
                        <p className="info-12  text-center !text-[#808A9A]">
                          Maximum size of image 1MB
                        </p>
                      </div>
                      <div className="hidden"></div>
                    </label>
                  </div>
                </div>
                {/* )} */}
                <p className="text-red-dark text-[12px]">{errors.icon?.message}</p>
              </div>

              <div className="flex justify-between items-center">
                <h6 className="text-[18px]  dark:!text-white">Add Fields</h6>
              </div>

              <div className="card-body w-full">
                <div className="form-row">
                  <div className="form-group flex items-center justify-between">
                    <label className="mr-2 dark:text-white">Number of Fields</label>
                    <select
                      {...register("numberOfFields")}
                      className={`p-[8px] border rounded-[8px] max-w-[150px] outline-none w-full block border-grey-v-1 dark:border-grey-v-2 dark:border-opacity-[15%] `}
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <div className="text-red-500">{errors.numberOfFields?.message}</div> */}
                </div>
              </div>

              {fields.map((item, i) => (
                <div key={i} className="grid grid-cols-1 gap-4">
                  <h6 className="text-lg  dark:text-white">Field {i + 1} <sup className="text-red-dark text-[10px]">*(Required)</sup></h6>
                  <div className="grid grid-cols-3 gap-[10px]">
                    <input
                      type="text"
                      {...register(`paymentFields.${i}.label`)}
                      name={`paymentFields[${i}][label]`}
                      id="label"
                      placeholder="Label"
                      className={`sm-text input-cta2 w-full !px-[10px] !h-[40px] !rounded-[5px] !py-[8px] border border-grey-v-1 dark:border-grey-v-2 dark:border-opacity-[15%] ${errors?.paymentFields?.[i]?.label && "border-red-dark"}`}
                    />
                    <input
                      type="text"
                      {...register(`paymentFields.${i}.name`)}
                      name={`paymentFields[${i}][name]`}
                      id="name"
                      placeholder="name"
                      className={`sm-text input-cta2 w-full !px-[10px] !h-[40px] !rounded-[5px] !py-[8px] border border-grey-v-1 dark:border-grey-v-2 dark:border-opacity-[15%] ${errors?.paymentFields?.[i]?.name && "border-red-dark"}`}
                    />
                    <input
                      type="text"
                      {...register(`paymentFields.${i}.type`)}
                      name={`paymentFields[${i}][type]`}
                      id="type"
                      placeholder="type"
                      className={`sm-text input-cta2 w-full !px-[10px] !h-[40px] !rounded-[5px] !py-[8px] border border-grey-v-1 dark:border-grey-v-2 dark:border-opacity-[15%] ${errors?.paymentFields?.[i]?.type && "border-red-dark"}`}
                    />
                    <input
                      type="text"
                      {...register(`paymentFields.${i}.placeholder`)}
                      name={`paymentFields[${i}][placeholder]`}
                      id="placeholder"
                      placeholder="placeholder"
                      className={`sm-text input-cta2 w-full !px-[10px] !h-[40px] !rounded-[5px] !py-[8px] border border-grey-v-1 dark:border-grey-v-2 dark:border-opacity-[15%] ${errors?.paymentFields?.[i]?.placeholder && "border-red-dark"}`}
                    />
                    <input
                      type="text"
                      {...register(`paymentFields.${i}.ifoptional`)}
                      name={`paymentFields[${i}][ifoptional]`}
                      id="ifoptional"
                      placeholder="ifoptional"
                      className={`sm-text input-cta2 w-full !px-[10px] !h-[40px] !rounded-[5px] !py-[8px] border border-grey-v-1 dark:border-grey-v-2 dark:border-opacity-[15%] ${errors?.paymentFields?.[i]?.ifoptional && "border-red-dark"}`}
                    />
                    <input
                      type="text"
                      {...register(`paymentFields.${i}.required`)}
                      name={`paymentFields[${i}][required]`}
                      id="required"
                      placeholder="required"
                      className={`sm-text input-cta2 w-full !px-[10px] !h-[40px] !rounded-[5px] !py-[8px] border border-grey-v-1 dark:border-grey-v-2 dark:border-opacity-[15%] ${errors?.paymentFields?.[i]?.required && "border-red-dark"}`}
                    />
                    <input
                      type="text"
                      {...register(`paymentFields.${i}.err_msg`)}
                      name={`paymentFields[${i}][err_msg]`}
                      id="err_msg"
                      placeholder="err_msg"
                      className={`sm-text input-cta2 w-full !px-[10px] !h-[40px] !rounded-[5px] !py-[8px] border border-grey-v-1 dark:border-grey-v-2 dark:border-opacity-[15%] ${errors?.paymentFields?.[i]?.err_msg && "border-red-dark"}`}
                    />
                  </div>

                  {/* Add other fields similarly */}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4 gap-2">
              <button type="button" className="outline-button w-full" onClick={() => {
                props?.setOpen(false)
              }}>Cancel</button>
              <button type="submit" className="solid-button w-full">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddPaymentModal;
