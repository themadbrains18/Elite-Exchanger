
import DasboardLayout from "@/components/layout/dasboard-layout";
import { GetServerSidePropsContext } from "next";
import React, { useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import MaintenanceList from "@/admin/admin-component/sitemaintenance/list";

interface Session {
    list?: any;
}

const SiteMaintenance = (props: Session) => {

  return (
    <DasboardLayout>
      <MaintenanceList list={props?.list} />
    </DasboardLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();

  let list = await fetch(
    `${process.env.NEXT_PUBLIC_BASEURL}/sitemaintenance`,
    {
      method: "GET",
    }
  ).then((response) => response.json());


  return {
    props: {
      session: session,
      sessions: session,
      provider: providers,
      list: list?.data,
    },
  };

}

export default SiteMaintenance;
