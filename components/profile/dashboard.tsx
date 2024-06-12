import Image from "next/image";
import React, { useEffect, useState } from "react";
import IconsComponent from "../snippets/icons";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import AES from 'crypto-js/aes';
import moment from "moment";
import { useWebSocket } from "@/libs/WebSocketContext";

const schema = yup.object().shape({
  fName: yup.string().optional(),
  lName: yup.string().optional(),
  dName: yup.string().min(4,'Display Name must be at least 4 character').max(20).required('This field is required').matches(/^([a-zA-Z0-9_\- ])+$/, 'Please enter only(letters, number and period(-))'),
  uName: yup.string().min(4,'User Name must be at least 4 character').max(20).required('This field is required').matches(/^([a-zA-Z0-9_\- ])+$/, 'Please enter only(letters, number and period(-))'),
});

interface fixSection {
  fixed?: boolean;
  show?: number;
  setShow?: Function;
  profileInfo?: any;
  session?: any,
  userDetail?: any;
}

const Dashboard = (props: fixSection) => {
  const [editable, setEditable] = useState(false);

  let { register, setValue, getValues, handleSubmit, watch, setError, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const wbsocket = useWebSocket();

  useEffect(() => {
    if (props.userDetail) {
      setValue('fName', props?.userDetail?.fName);
      setValue('lName', props?.userDetail?.lName);
      setValue('dName', props?.userDetail?.dName);
      setValue('uName', props?.userDetail?.uName);
    }
  }, []);

  const onHandleSubmit = async (data: any) => {
    const ciphertext = AES.encrypt(JSON.stringify(data), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`);
    let record = encodeURIComponent(ciphertext.toString());

    let response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/profile/dashboard`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": props?.session?.user?.access_token
        },
        body: JSON.stringify(record),
      }
    ).then((response) => response.json());

    if (response?.data?.status === 200) {
      setEditable(false);
      if (wbsocket) {
        let profile = {
          ws_type: 'profile',
          user_id: props?.session?.user?.user_id,
        }
        wbsocket.send(JSON.stringify(profile));
      }
    }
    else {

    }
  }

  return (
    <>
      <section
        className={`${props.show == 1 && "!left-[50%]"} ${props.fixed &&
          "duration-300 fixed pt-[145px] top-0 left-[160%] translate-x-[-50%] bg-off-white dark:bg-black-v-1 z-[6] w-full h-full pb-[20px] lg:dark:bg-d-bg-primary overflow-y-scroll"
          } p-5 md:p-40 `}
      >
        {/* only for mobile view */}
        <div className="lg:hidden flex dark:shadow-none shadow-lg shadow-[#c3c3c317] fixed top-0 left-0 bg-black-v-1 w-full  rounded-bl-[20px] rounded-br-[20px]  z-[6] dark:bg-omega bg-white  h-[105px]">
          <div className="grid grid-cols-[auto_1fr_auto] m-auto w-full px-[20px] items-center">
            <div
              onClick={() => {
                props?.setShow !== undefined && props.setShow(0);
              }}
            >
              <IconsComponent type="backIcon" hover={false} active={false} />
            </div>
            <div className="text-center">
              <p className="sec-title">My Profile</p>
            </div>
            <div onClick={() => { setEditable(true) }} className="cursor-pointer">
              <IconsComponent type="editIcon" hover={false} active={false} />
            </div>
          </div>
        </div>

        <div className="max-[1023px] lg:p-0 p-20 dark:bg-omega bg-white rounded-[10px]">
          <div className="flex items-center gap-5 justify-between">
            <p className="sec-title">My Profile</p>
            <div className="py-[13px] px-[15px] border dark:border-opacity-[15%] border-grey-v-1 items-center rounded-5 hidden md:flex gap-[10px] cursor-pointer" onClick={() => { setEditable(true) }}>
              <Image
                src="/assets/profile/edit.svg"
                width={24}
                height={24}
                alt="edit"
              />
              <p className="nav-text-sm">Edit</p>
            </div>
          </div>
          <div className="py-[30px] md:py-[50px]">

            <form onSubmit={handleSubmit(onHandleSubmit)}>
              <div className="mt-[30px] ">
                <div className="flex md:flex-row flex-col gap-[30px]">
                  <div className=" w-full">
                    <p className="sm-text mb-[10px]">First Name</p>
                    <div className={`${editable ? 'cursor-auto' : 'cursor-not-allowed'}`}>
                      <input
                        type="text"
                        {...register('fName')} name="fName"
                        placeholder={editable ? "Enter first name" : "Enter first name"}
                        defaultValue={getValues('fName')} minLength={4} maxLength={20}
                        className={`sm-text input-cta2 w-full ${editable ? 'cursor-auto' : 'cursor-not-allowed pointer-events-none'}`}
                      />
                    </div>
                    {/* {errors.fName && <p style={{ color: 'red' }}>{errors.fName.message}</p>} */}
                  </div>
                  <div className=" w-full">
                    <p className="sm-text mb-[10px]">Last Name</p>
                    <div className={`${editable ? 'cursor-auto' : 'cursor-not-allowed'}`}>
                      <input
                        type="text"
                        {...register('lName')} name="lName"
                        placeholder={editable ? "Enter Last name" : "Enter Last name"}
                        defaultValue={getValues('lName')} minLength={4} maxLength={20}
                        className={`sm-text input-cta2 w-full ${editable ? 'cursor-auto' : 'cursor-not-allowed pointer-events-none'}`}
                      />
                    </div>
                    {/* {errors.lName && <p style={{ color: 'red' }}>{errors.lName.message}</p>} */}
                  </div>
                </div>
                <div className="mt-5 flex gap-[30px] md:flex-row flex-col">
                  <div className=" w-full">
                    <p className="sm-text mb-[10px]">Display Name</p>
                    <div className="relative">
                      <div className={`${editable ? 'cursor-auto' : 'cursor-not-allowed'}`}>
                        <input
                          type="text"
                          {...register('dName')} name="dName"
                          placeholder={editable ? "Enter display name" : "Enter display name"}
                          defaultValue={getValues('dName')} minLength={4} maxLength={20}
                          className={`sm-text input-cta2 w-full ${editable ? 'cursor-auto' : 'cursor-not-allowed pointer-events-none'}`}

                        />
                      </div>
                      {errors.dName && <p style={{ color: 'red' }}>{errors.dName.message}</p>}
                    </div>
                  </div>
                  <div className=" w-full">
                    <p className="sm-text mb-[10px]">User Name</p>
                    <div className={`${editable ? 'cursor-auto' : 'cursor-not-allowed'}`}>
                      <input
                        type="text"
                        {...register('uName')} name="uName"
                        placeholder={editable ? "Enter user name" : "Enter user name"}
                        defaultValue={getValues('uName')} minLength={4} maxLength={20}
                        className={`sm-text input-cta2 w-full ${editable ? 'cursor-auto' : 'cursor-not-allowed pointer-events-none'}`}
                      />
                    </div>
                    {errors.uName && <p style={{ color: 'red' }}>{errors.uName.message}</p>}
                  </div>
                </div>
                <div className="mt-5 flex md:flex-row flex-col gap-[30px]">
                  <div className=" w-full">
                    <p className="sm-text mb-[10px]">Email</p>
                    <div className="cursor-not-allowed">
                      <div className="relative pointer-events-none">
                        <input
                          id="dashEmail"
                          name="dashEmail"
                          type="email"
                          value={props.session?.user?.email}
                          placeholder="AllieGrater12345644@gmail.com"
                          className={`sm-text input-cta2 w-full cursor-not-allowed focus:outline-none focus:border-none`}
                        />
                        <Image
                          src="/assets/profile/mail.svg"
                          alt="mail"
                          width={22}
                          height={22}
                          className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" w-full">
                    <p className="sm-text mb-[10px]">Phone Number</p>
                    <div className="cursor-not-allowed">
                      <div className="relative pointer-events-none">
                        <input
                          id="dashNumber"
                          name="dashNumber"
                          type="number"
                          value={props.session?.user?.number}
                          placeholder="Enter phone number"
                          className={`sm-text input-cta2 w-full cursor-not-allowed`}
                          readOnly
                        />
                        <Image
                          src="/assets/profile/phone.svg"
                          alt="phone"
                          width={22}
                          height={22}
                          className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {editable && (
                <div className="flex md:flex-row flex-col-reverse items-center gap-[10px] justify-between pt-5 md:pt-[30px]">
                  <p className="sm-text">
                    This account was created on {moment(props.session?.user?.createdAt).format("YYYY-MM-DD HH:mm:ss  A")}
                  </p>
                  <div className="flex gap-[30px]">
                    <button type="button" className="solid-button2 " onClick={() => { setEditable(false) }}>Cancel</button>
                    <button type="submit" className="solid-button px-[23px] md:px-[51px]">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
       

        </div>
      </section>
    </>
  );
};

export default Dashboard;
