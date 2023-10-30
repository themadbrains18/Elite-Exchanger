import FeatureNews from '@/components/news/feature-news';
import NewsHero from '@/components/news/hero';
import NewsGrid from '@/components/news/news-grid';
import RecentPosts from '@/components/news/recent-posts';
import React from 'react'

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