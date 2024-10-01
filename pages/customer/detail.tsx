import ContactForm from '@/components/news/contactForm'
import NewsDetail from '@/components/news/newsDetail'
import RecentPosts from '@/components/news/recent-posts'
import Meta from '@/components/snippets/meta'
import React from 'react'

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