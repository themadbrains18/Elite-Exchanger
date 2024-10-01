// import FeatureNews from '@/components/news/feature-news';
// import NewsHero from '@/components/news/hero';
// import NewsGrid from '@/components/news/news-grid';
// import RecentPosts from '@/components/news/recent-posts';
import React from 'react'
import dynamic from 'next/dynamic';
import Meta from '@/components/snippets/meta';

const FeatureNews = dynamic(() => import('@/components/news/feature-news'), {
  loading: () => <p>Loading...</p>,
})
const NewsHero = dynamic(() => import('@/components/news/hero'), {
  loading: () => <p>Loading...</p>,
})
const NewsGrid = dynamic(() => import('@/components/news/news-grid'), {
  loading: () => <p>Loading...</p>,
})
const RecentPosts = dynamic(() => import('@/components/news/recent-posts'), {
  loading: () => <p>Loading...</p>,
})


const News = () => {
  return (
    <>
    <Meta title='Latest Crypto News | Stay Informed on Market Trends and Updates' description='Get the latest news and insights in the world of cryptocurrency! Our Crypto News page covers market trends, expert analysis, regulatory updates, and breaking stories to keep you informed. Stay ahead of the curve and make informed trading decisions with timely information from the crypto landscape.'/>
        <NewsHero />
        <FeatureNews />
        <NewsGrid />
        <RecentPosts />
    </>
  )
}

export default News;