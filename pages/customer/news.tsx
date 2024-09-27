// import FeatureNews from '@/components/news/feature-news';
// import NewsHero from '@/components/news/hero';
// import NewsGrid from '@/components/news/news-grid';
// import RecentPosts from '@/components/news/recent-posts';
import React from 'react'
import dynamic from 'next/dynamic';

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
        <NewsHero />
        <FeatureNews />
        <NewsGrid />
        <RecentPosts />
    </>
  )
}

export default News;