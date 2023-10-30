import Earning from '@/components/refer/earning';
import Events from '@/components/refer/events';
import Hero from '@/components/refer/hero';
import ReferFriends from '@/components/refer/referFriends';
import Safe from '@/components/refer/safe';
import React from 'react'

const Refer = () => {
  return (
    <>
        <Hero />
        <ReferFriends />
        <Safe />
        <Events />
        <Earning />
    </>
  )
}

export default Refer;