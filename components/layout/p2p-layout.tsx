import React from 'react';
import Head from '../p2p/head';
import { useRouter } from 'next/router';

interface child {
    children: any;
}
  
const P2pLayout = (props: child) => {
    const router = useRouter();
  return (
    <>
    <div className='dark:bg-black-v-1 bg-bg-secondary pt-[20px] md:pt-[80px] pb-[40px]'>
        <div className='container px-[15px] md:px-20'>
            <div className='p-20 md:p-40 rounded-10  bg-white dark:bg-d-bg-primary '>
                <Head />
                <div className="children_wrapper">
                    {props.children}
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default P2pLayout;