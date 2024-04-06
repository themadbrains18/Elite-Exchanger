import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react';
import Context from '../components/contexts/context';
import Header from '../components/header-footer/header';
import Preference from '../components/sidebars/preference';
import { useRouter } from 'next/router';
import Footer from '@/components/header-footer/footer';
import { SessionProvider } from 'next-auth/react';
import { WebSocketProvider } from '@/libs/WebSocketContext';

interface ModeProps {
  mode: string;
}

export default function App({ Component, pageProps: { sessions, ...pageProps } }: AppProps) {
  const [mode, setMode] = useState<string>('dark');

  const router = useRouter()


  useEffect(() => {
    let currentMode: string = localStorage.getItem("mode") || 'dark';
    setMode(currentMode);

  }, [mode])

  return (
    <div className={mode === "dark" ? "dark bg-black" : "light"}>
      <WebSocketProvider>
      <SessionProvider session={pageProps.session} refetchInterval={1 * 60}
        refetchOnWindowFocus={false}>
        <Context.Provider value={{ mode, setMode }}>
          {
            !router.pathname.includes('/register') && !router.pathname.includes('/login') && !router.pathname.includes('/forget') && !router.pathname.includes('/admin') &&
            <div className={mode === "dark" ? "dark bg-black" : "light"}>
              <Header session={sessions} />
              <Preference />
            </div>
          }
          <div className={` ${!router.pathname.includes('/register') && !router.pathname.includes('/login') && !router.pathname.includes('/forget') && !router.pathname.includes('/future/') && !router.pathname.includes('/admin') ? "pt-[95px] lg:pt-0 lg:mt-[121px]" : ""} `}>
            
              <Component {...pageProps} />
          </div>
          {
            !router.pathname.includes('/register') && !router.pathname.includes('/login') && !router.pathname.includes('/forget') && !router.pathname.includes('/admin') && !router.pathname.includes('/future') && <Footer />
          }
        </Context.Provider>
      </SessionProvider>
      </WebSocketProvider>
    </div>
  )
}
