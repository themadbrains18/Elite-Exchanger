import Meta from '@/components/snippets/meta'
import React from 'react'

/**
 * PrivacyPolicy Component.
 * This component renders the Privacy Policy page, including a meta tag for SEO.
 * It provides an overview of the privacy policy with a section displaying the page title.
 * 
 * @returns {JSX.Element} The rendered Privacy Policy page.
 */
const PrivacyPolicy = () => {
    return (
        <>
        <Meta title='Privacy Policy | Protecting Your Data in the Crypto Space' description='Your privacy matters to us. Review our Privacy Policy to understand how we collect, use, and protect your personal information while you trade cryptocurrencies. Learn about your rights, data security measures, and our commitment to maintaining transparency. Safeguarding your data is our top priority.'/>
        <section className="md:py-[100px] py-[60px] bg-white dark:bg-black">
            <div className="flex items-center gap-5 justify-between w-full my-auto">
                 <p className="sec-title text-center w-full">Privacy Policy</p>
            </div>
        </section>
        </>
    )
}

export default PrivacyPolicy
