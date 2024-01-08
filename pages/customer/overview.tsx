import Image from 'next/image'
import React from 'react'

import { getProviders } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';

const Overview = ({ sessions }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <section className="p-5 md:p-10 ">
      <div className="flex items-center gap-5 justify-between">
        <p className="sec-title">My Profile</p>
        <div className="py-[13px] px-[15px] border border-grey-v-1 items-center rounded-5 flex gap-[10px]">
          <Image src="/assets/profile/edit.svg" width={24} height={24} alt="edit" />
          <p className="nav-text-sm">Edit</p>
        </div>
      </div>
      <div className="py-[30px] md:py-[50px]">
        <p className="info-14-18 dark:text-white text-h-primary mb-[10px]">Personal Information</p>
        <p className="sm-text "></p>
        <div className="mt-[30px] ">
          <div className="flex md:flex-row flex-col gap-[30px]">
            <div className=" w-full">
              <p className="sm-text mb-[10px]">First Name</p>
              <input type="text" value="Allie" placeholder="Enter first name" className="sm-text input-cta2 w-full" />
            </div>
            <div className=" w-full">
              <p className="sm-text mb-[10px]">Last Name</p>
              <input type="text" value="Joe" placeholder="Enter last name" className="sm-text input-cta2 w-full" />
            </div>
          </div>
          <div className="mt-5 flex gap-[30px] md:flex-row flex-col">
            <div className=" w-full">
              <p className="sm-text mb-[10px]">Display Name</p>
              <div className="relative">
                <input type="text" value="Allie Joe" placeholder="Enter display name" className="sm-text input-cta2 w-full" />
                <Image src="/assets/profile/edit.svg" alt="editicon" width={22} height={22} className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]" />
              </div>
            </div>
            <div className=" w-full">
              <p className="sm-text mb-[10px]">User Name</p>
              <input type="text" value="AllieJoe" placeholder="Enter user name" className="sm-text input-cta2 w-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="h-[1px] w-full bg-grey-v-2 dark:bg-opacity-[15%]"></div>

      <div className="py-[30px] md:py-[50px]">
        <p className="info-14-18 dark:text-white text-h-primary mb-[10px]">Contact Information</p>
        <p className="sm-text "></p>
        <div className="mt-[30px] ">
          <div className="flex md:flex-row flex-col gap-[30px]">
            <div className=" w-full">
              <p className="sm-text mb-[10px]">Email</p>
              <div className="relative">
                <input type="email" id='contactEmail' name='contactEmail' value="Allie" placeholder="AllieGrater12345644@gmail.com" className="sm-text input-cta2 w-full" />
                <Image src="/assets/profile/mail.svg" alt="mail" width={22} height={22} className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]" />
              </div>
            </div>
            <div className=" w-full">
              <p className="sm-text mb-[10px]">Phone Number</p>
              <div className="relative">
                <input type="number" value="+91 7777777777" id="contactNumber"
                      name="contactNumber" placeholder="Enter phone number" className="sm-text input-cta2 w-full" />
                <Image src="/assets/profile/phone.svg" alt="phone" width={22} height={22} className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]" />
              </div>
            </div>
          </div>
          <div className="mt-5 flex gap-[30px] md:flex-row flex-col">
            <div className=" w-full">
              <p className="sm-text mb-[10px]">Location</p>
              <div className="relative">
                <input type="text" value="abc" id='overviewLocation' name='overviewLocation' placeholder="Enter location" className="sm-text input-cta2 w-full" />
                <Image src="/assets/profile/downarrow.svg" alt="editicon" width={24} height={24} className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]" />
              </div>
            </div>
            <div className=" w-full">
              <p className="sm-text mb-[10px]">User Name</p>
              <div className="relative">
                <input type="text" value="US Dollar" id="overviewcurrency"
                      name="overviewcurrency" placeholder="Enter currency" className="sm-text input-cta2 w-full" />
                <Image src="/assets/profile/downarrow.svg" alt="editicon" width={24} height={24} className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[1px] w-full bg-grey-v-2 dark:bg-opacity-[15%]"></div>

      <div className="flex items-center justify-between pt-5 md:pt-[30px]">
        <p className="sm-text">This account was created on January 10, 2022, 02:12 PM</p>
        <div className="flex gap-[30px]">
          <button className="solid-button2 ">Cancel</button>
          <button className="solid-button px-[51px]">Save Changes</button>
        </div>
      </div>
    </section>
  )
}

export default Overview;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders()
  if (session){
    return {
      props: {
        providers: providers,
        sessions: session
      },
    };
  }
  return {
    redirect: { destination: "/" },
  };
}
