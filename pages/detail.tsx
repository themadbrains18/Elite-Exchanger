import ContactForm from '@/components/news/contactForm'
import NewsDetail from '@/components/news/newsDetail'
import RecentPosts from '@/components/news/recent-posts'
import React from 'react'

const Detail = () => {
  return (
    <>
    <NewsDetail />
    <RecentPosts/>
    <ContactForm />
    </>
  )
}

export default Detail