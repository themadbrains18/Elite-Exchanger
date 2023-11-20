import { GetServerSidePropsContext } from "next";
import AllUsers from "../../../admin/admin-component/users/all-users";

import TopHolders from "../../../admin/admin-component/users/topHolders";
import UserCard from "../../../admin/admin-component/users/userCard";
import DasboardLayout from "../../../components/layout/dasboard-layout";
import Image from "next/image";
import React from "react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";

interface Session {
  users:any,
  networks:any
}

const User = (props:Session) => {
  
  return (
    <DasboardLayout>
      <UserCard />
      <div className="flex gap-6 ">
        <div className="max-w-[50%] w-full">
          <TopHolders users={props?.users}/>
        </div>
        <div className="max-w-[50%] w-full">
          <TopHolders users={props?.users}/>
        </div>
      </div>
      <AllUsers users={props?.users} networks={props?.networks}/>
      <div className="grid grid-cols-[auto_auto_auto] gap-6 pt-6 ">
        <Image
          src="/assets/admin/Statistics.svg"
          alt="img-description"
          width={436}
          height={314}
          className="  dark:block hidden w-full"
        />
        <Image
          src="/assets/admin/Statistics-light.svg"
          alt="img-description"
          width={436}
          height={314}
          className="  dark:hidden block w-full"
        />

          <Image
            src="/assets/admin/visitor.svg"
            alt="img-description"
            width={331}
            height={314}
            className="  dark:block hidden w-full"
          />
          <Image
            src="/assets/admin/visitor-light.svg"
            alt="img-description"
            width={331}
            height={314}
            className="  dark:hidden block w-full"
          />
        

        <Image
          src="/assets/admin/Traffic.svg"
          alt="img-description"
          width={331}
          height={314}
          className="  dark:block hidden w-full"
        />
        <Image
          src="/assets/admin/Traffic-light.svg"
          alt="img-description"
          width={331}
          height={314}
          className="  dark:hidden block w-full"
        />
      </div>
    </DasboardLayout>
  );
};

export default User;


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

   let users = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/admin/userList`, {
      method: "GET",    
    }).then(response => response.json());

   let networks = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/network`, {
      method: "GET",
    
    }).then(response => response.json());


  return {
    props: {
      session: session,
      sessions: session,
      provider: providers,
      users : users,
      networks:networks
    },
  };
  // if (session) {

  // }
  // return {
  //   redirect: { destination: "/" },
  // };
}
