import Meta from '@/components/snippets/meta'
import React from 'react'

/**
 * UserAgreement Component.
 * This component renders the User Agreement page for users to review the terms and conditions
 * governing their use of the crypto trading platform. It includes the Meta tags for SEO and a section 
 * displaying the title of the User Agreement.
 *
 * @returns {JSX.Element} The rendered User Agreement page with Meta tags and section content.
 */
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

