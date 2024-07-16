import React, { useEffect, useLayoutEffect, useState } from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AES from 'crypto-js/aes';
import moment from 'moment';
import { useWebSocket } from '@/libs/WebSocketContext';
import { toast } from 'react-toastify';
import IconsComponent from '../snippets/icons';

const schema = yup.object().shape({
  fName: yup.string().optional(),
  lName: yup.string().optional(),
  dName: yup.string().min(4, 'Display name must be at least 4 characters.').max(20, 'Display name must be at most 20 characters.').required('This field is required.').matches(/^([a-zA-Z0-9_\- ])+$/, 'Please enter only letters, numbers, and periods(-).'),
  uName: yup.string().min(4, 'User name must be at least 4 characters').max(20, 'User name must be at most 20 characters.').required('This field is required.').matches(/^([a-zA-Z0-9_\- ])+$/, 'Please enter only letters, numbers, and periods(-).'),
});

interface FixSection {
  fixed?: boolean;
  show?: number;
  setShow?: Function;
  profileInfo?: any;
  session?: any;
  userDetail?: any;
}

const Dashboard = (props: FixSection) => {
  const [editable, setEditable] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [userDetails, setUserDetails] = useState(props.userDetail);
  const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm({
    resolver: yupResolver(schema),
  });

  const websocket = useWebSocket();

  useEffect(() => {
    // console.log('userDetails:', userDetails);  // Log userDetails to verify data
    if (userDetails) {
      reset(userDetails);
    }
  }, [userDetails, reset]);

  const onHandleSubmit = async (data: any) => {
    setDisabled(true)
    // Create a new object with only the required fields
    const filteredData = {
      fName: data.fName.trim(),
      lName: data.lName.trim(),
      dName: data.dName.trim(),
      uName: data.uName.trim(),
    };

    const ciphertext = AES.encrypt(JSON.stringify(filteredData), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`);
    const record = encodeURIComponent(ciphertext.toString());

    // Log the filtered data being sent
    // console.log('Submitting data:', filteredData);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/dashboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': props?.session?.user?.access_token,
        },
        body: JSON.stringify(record),
      }).then(response => response.json());

      if (response?.data?.status === 200) {
        if (response?.data?.data?.status === false) {
          toast.error(response?.data?.data?.message, { autoClose: 2000 })
          setTimeout(() => {
            setDisabled(false)
          }, 3000)
        }
        else {

          setEditable(false)
          setDisabled(false)
          setUserDetails(filteredData);  // Update userDetails state with the latest data
          reset(filteredData);  // Reset form with the latest data
          if (websocket) {
            websocket.send(JSON.stringify({
              ws_type: 'profile',
              user_id: props?.session?.user?.user_id,
            }));
          }
        }
      } else {
        // Log and show error messages from the server
        console.error('Error response:', response);
        toast.error(`Error: ${response?.data?.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(`Submission error: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setEditable(false);
    reset(userDetails);  // Reset form with the latest userDetails state
  };





  return (
    <>
      <section className={`${props.show == 1 && "!left-[50%]"} ${props.fixed && "duration-300 fixed pt-[145px] top-0 left-[160%] translate-x-[-50%] bg-off-white dark:bg-black-v-1 z-[6] w-full h-full pb-[20px] lg:dark:bg-d-bg-primary overflow-y-scroll"} p-5 md:p-40`}>
        {/* Mobile Header */}
        <div className="lg:hidden flex dark:shadow-none shadow-lg shadow-[#c3c3c317] fixed top-0 left-0 bg-black-v-1 w-full rounded-bl-[20px] rounded-br-[20px] z-[6] dark:bg-omega bg-white h-[105px]">
          <div className="grid grid-cols-[auto_1fr_auto] m-auto w-full px-[20px] items-center">
            <div onClick={() => props?.setShow?.(0)}>
              <IconsComponent type="backIcon" hover={false} active={false} />
            </div>
            <div className="text-center">
              <p className="sec-title">My Profile</p>
            </div>
            {editable === false && (
              <div onClick={() => setEditable(true)} className="cursor-pointer">
                <IconsComponent type="editIcon" hover={false} active={false} />
              </div>
            )}
          </div>
        </div>

        <div className="max-[1023px] lg:p-0 p-20 dark:bg-omega bg-white rounded-[10px]">
          <div className="flex items-center gap-5 justify-between">
            <p className="sec-title">My Profile</p>
            {editable === false && (
              <div className="py-[13px] px-[15px] border dark:border-opacity-[15%] border-grey-v-1 items-center rounded-5 hidden md:flex gap-[10px] cursor-pointer solid-button" onClick={() => setEditable(true)}>
                <Image src="/assets/profile/edit.svg" width={24} height={24} alt="edit" />
                <p>Edit</p>
              </div>
            )}
          </div>
          <div className="py-[30px] md:py-[50px]">
            <form onSubmit={handleSubmit(onHandleSubmit)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
            >
              <div className="mt-[30px]">
                <div className="flex md:flex-row flex-col gap-[30px]">
                  <div className="w-full">
                    <p className="sm-text mb-[10px]">First Name</p>
                    <div className={editable ? 'cursor-auto' : 'cursor-not-allowed pointer-events-none'}>
                      <input type="text" {...register('fName')} placeholder="Enter first name" className="sm-text input-cta2 w-full" />
                    </div>
                  </div>
                  <div className="w-full">
                    <p className="sm-text mb-[10px]">Last Name</p>
                    <div className={editable ? 'cursor-auto' : 'cursor-not-allowed pointer-events-none'}>
                      <input type="text" {...register('lName')} placeholder="Enter last name" className="sm-text input-cta2 w-full" />
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex gap-[30px] md:flex-row flex-col">
                  <div className="w-full">
                    <p className="sm-text mb-[10px]">Display Name<span className="text-red-dark dark:text-[#9295a6]">*</span></p>
                    <div className="relative">
                      <div className={editable ? 'cursor-auto' : 'cursor-not-allowed pointer-events-none'}>
                        <input type="text" maxLength={20} {...register('dName')} placeholder="Enter display name" className="sm-text input-cta2 w-full" />
                      </div>
                      {errors.dName && <p className="errorMessage">{errors.dName.message}</p>}
                    </div>
                  </div>
                  <div className="w-full">
                    <p className="sm-text mb-[10px]">User Name<span className="text-red-dark dark:text-[#9295a6]">*</span></p>
                    <div className={`${editable ? 'cursor-auto' : 'cursor-not-allowed pointer-events-none'}   `}>
                      <input type="text" maxLength={20} {...register('uName')} placeholder="Enter user name" className="sm-text  input-cta2  w-full" />
                    </div>
                    {errors.uName && <p className="errorMessage">{errors.uName.message}</p>}
                  </div>
                </div>
                <div className="mt-5 flex md:flex-row flex-col gap-[30px]">
                  <div className="w-full">
                    <p className="sm-text mb-[10px]">Email</p>
                    <div className="cursor-not-allowed">
                      <div className="relative pointer-events-none">
                        <input id="dashEmail" name="dashEmail" type="email" defaultValue={props.session?.user?.email || ''} placeholder="AllieGrater12345644@gmail.com" className="sm-text input-cta2 w-full cursor-not-allowed focus:outline-none focus:border-none" />
                        <Image src="/assets/profile/mail.svg" alt="mail" width={22} height={22} className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <p className="sm-text mb-[10px]">Phone Number</p>
                    <div className="cursor-not-allowed">
                      <div className="relative pointer-events-none">
                        <input id="dashNumber" name="dashNumber" type="number" onWheel={(e) => (e.target as HTMLElement).blur()} defaultValue={props.session?.user?.number || ''} placeholder="Enter phone number" className="sm-text input-cta2 w-full cursor-not-allowed" readOnly />
                        <Image src="/assets/profile/phone.svg" alt="phone" width={22} height={22} className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {editable && (
                <div className="flex md:flex-row flex-col-reverse items-center gap-[10px] justify-between pt-5 md:pt-[30px]">
                  <p className="sm-text">
                    This account was created on {moment(props.session?.user?.createdAt).format('YYYY-MM-DD HH:mm:ss A')}
                  </p>
                  <div className="flex gap-[30px]">
                    <button type="button" className="solid-button2" onClick={handleCancel}>Cancel</button>
                    <button type="submit" disabled={disabled} className={`solid-button px-[23px] md:px-[51px] ${disabled ? "cursor-not-allowed" : ""}`}>   {disabled &&
                      <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                      </svg>
                    }Save Changes</button>
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
