import UserDetails from "@/admin/admin-component/users/userDetails";
import DasboardLayout from "@/components/layout/dasboard-layout";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

interface Session{
  session:any,
 
}

const Details = (props:Session) => {

  return (
    <DasboardLayout>
      <UserDetails  session={props?.session}/>
    </DasboardLayout>
  );
};

export default Details;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  return {
    props: {
      session: session,
      sessions: session,
      provider: providers,


    },
  };
    

  // if (session) {

  // }
  // return {
  //   redirect: { destination: "/" },
  // };
}
