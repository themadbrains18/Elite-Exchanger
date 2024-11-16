import ContactForm from '@/components/news/contactForm'
import NewsDetail from '@/components/news/newsDetail'
import RecentPosts from '@/components/news/recent-posts'
import Meta from '@/components/snippets/meta'
import React from 'react'

/**
 * Detail Component.
 * This component renders the detailed page for crypto news, including the main news content,
 * recent posts, and a contact form for user engagement. The page also sets meta tags for SEO 
 * to ensure it is properly indexed by search engines with relevant title and description.
 * 
 * @returns {JSX.Element} The rendered News Detail page.
 */
const Detail = () => {
  return (
    <>
    <Meta title='Latest Crypto News | Stay Informed on Market Trends and Updates' description='Get the latest news and insights in the world of cryptocurrency! Our Crypto News page covers market trends, expert analysis, regulatory updates, and breaking stories to keep you informed. Stay ahead of the curve and make informed trading decisions with timely information from the crypto landscape.'/>
    <NewsDetail />
    <RecentPosts/>
    <ContactForm />
    </>
  )
}

export default Detail