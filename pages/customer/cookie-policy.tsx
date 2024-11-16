import Meta from '@/components/snippets/meta'
import React from 'react'

/**
 * CookiePolicy Component.
 * This component displays the Cookie Policy page, providing information about the platform's cookie usage,
 * including how cookies are used for improving functionality, analyzing traffic, and personalizing content.
 * 
 * @returns {JSX.Element} The rendered Cookie Policy page with a title and description.
 */
const CookiePolicy = () => {
    return (
        <>
        <Meta title='Cookie Policy | Crypto Planet' description='Learn about our Cookie Policy and how we use cookies to enhance your experience on our crypto platform. Discover how cookies help us improve functionality, analyze traffic, and personalize content. Your privacy is important to us, and we provide transparency about our data practices.'/>
        <section className="md:py-[100px] py-[60px] bg-white dark:bg-black">
            <div className="flex items-center gap-5 justify-between w-full my-auto">
                <p className="sec-title text-center w-full">Cookie Policy</p>
            </div>
        </section>
        </>
    )
}

export default CookiePolicy
