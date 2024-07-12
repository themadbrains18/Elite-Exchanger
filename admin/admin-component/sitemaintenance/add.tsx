import Context from "@/components/contexts/context";
import React, { useContext } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { AES } from "crypto-js";
import { useSession } from "next-auth/react";

interface ActiveSession {
  data: any;
  show: boolean;
  setShow: Function;
  refreshPairList?: any;
  session?: any;
}

const schema = yup.object().shape({
  title: yup.string().required("Please enter title."),
  message: yup.string().required("Please enter message."),
});

const AddList = (props: ActiveSession) => {
  const { mode } = useContext(Context);
  const {data:session} = useSession()

  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onHandleSubmit = async (data: any) => {
    try {
      const ciphertext = AES.encrypt(
        JSON.stringify(data),
        `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
      );
      let record = encodeURIComponent(ciphertext.toString());

      let res = await fetch(`/api/sitemaintenance/create`, {
        headers: {
          "Content-type": "application/json",
          Authorization: session?.user?.access_token || "",
        },
        method: "POST",
        body: JSON.stringify(record),
      });
      let result = await res.json();
      if (result) {
        toast.success(result?.data?.message);
        props.refreshPairList();
        setTimeout(() => {
          props?.setShow(false);
        }, 1000);
      }
      if (result?.data?.status === 409) {
        toast.warning(result?.data?.message);
        setTimeout(() => {
          props?.setShow(false);
        }, 1000);
      }
    } catch (error) {
      console.log("error in add maintenance message", error);
    }
  };

  return (
    <div className="max-w-[calc(100%-30px)] md:max-w-[500px] max-h-[400px] h-full overflow-y-auto  w-full p-5 md:px-30 md:py-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="flex items-center justify-between ">
        <p className="sec-title">Add Site Maintenance Form</p>
        <svg
          onClick={() => {
            props?.setShow(false);
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
      <form className="pt-30" onSubmit={handleSubmit(onHandleSubmit)} onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}>
        <div className=" relative ">
          <p className="sm-text mb-2">Title</p>
          <input
            type="text"
            {...register("title")}
            name="title"
            placeholder="Please enter limit case fee"
            className="sm-text input-cta2 w-full"
          />
          {errors?.title && (
            <p className="errorMessage">{errors?.title?.message}</p>
          )}
        </div>
        <div className=" relative ">
          <p className="sm-text mb-2">Message</p>
          <input
            type="text"
            {...register("message")}
            name="message"
            placeholder="Please enter limit case fee"
            className="sm-text input-cta2 w-full"
          />
          {errors?.message && (
            <p className="errorMessage">{errors?.message?.message}</p>
          )}
        </div>

        <button className="solid-button w-full mt-30">Submit</button>
      </form>
    </div>
  );
};

export default AddList;
