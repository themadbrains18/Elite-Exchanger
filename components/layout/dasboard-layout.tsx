import DashboardFooter from '@/admin/admin-component/header-footer/footer';
import DashboardHeader from '@/admin/admin-component/header-footer/header';
import React, { useEffect } from 'react'
import SideBar from '@/admin/admin-snippet/side-bar';
import { signOut, useSession } from 'next-auth/react';
interface child {
    children: any;
}

const DasboardLayout = (props: child) => {
    const { data: session, status } = useSession();
    let userPermission = ['admin','superadmin'];

    useEffect(() => {

        console.log(session?.user?.role,'===========session user roel====');
        
        if (session !== null && userPermission.includes(session?.user?.role)) {

            // console.log('=============heher============');
            // signOut({
            //     redirect: true,
            //     callbackUrl: '/login'
            // })
        } else {

            signOut({
                redirect: true,
                callbackUrl: '/login'
            })
        }

    }, [])

    return (
        <>
            <div className='flex'>
                <div className='max-w-[240px] w-full bg-white shadow-[0px_0px_20px_0px_#38476d08] dark:shadow-[0px_0px_20px_0px_#38476d08] dark:bg-grey-v-4 min-h-[100vh] overflow-y-auto h-full fixed top-0 left-0 '>
                    <SideBar />
                </div>
                <div className='max-w-[calc(100%-240px)] w-full ml-auto bg-light-v-2  dark:bg-grey-v-5 h-screen'>
                    <DashboardHeader />
                    <div className='pt-[158px] px-[24px] pb-[100px] bg-light-v-2 dark:bg-grey-v-5'>{props.children}</div>
                    <DashboardFooter />
                </div>
            </div>
        </>
    )
}

export default DasboardLayout;