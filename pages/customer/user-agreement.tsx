import Meta from '@/components/snippets/meta'
import React from 'react'

const UserAgreement = () => {
    return (
        <>
        <Meta title='User Agreement | Terms of Service for Crypto Trading' description='Review our User Agreement to understand the terms and conditions governing your use of our crypto trading platform. This document outlines your rights, responsibilities, and our commitment to security and transparency. Ensure a safe and informed trading experience by familiarizing yourself with our policies.'/>
        <section className="md:py-[100px] py-[60px] bg-white dark:bg-black">
            <div className="flex items-center gap-5 justify-between w-full my-auto">
                <p className="sec-title text-center w-full">User Agreement</p>
            </div>
        </section>
        </>
    )
}

export default UserAgreement

