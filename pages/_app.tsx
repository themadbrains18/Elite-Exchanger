import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react';
import Context from '../components/contexts/context';
import Header from '../components/header-footer/header';
import Preference from '../components/sidebars/preference';
import { useRouter } from 'next/router';
import Footer from '@/components/header-footer/footer';
import { SessionProvider } from 'next-auth/react';

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
      <SessionProvider session={pageProps.session} refetchInterval={1 * 60}
          refetchOnWindowFocus={false}>
        <Context.Provider value={{ mode, setMode }}>
          {
            router.pathname != '/register' && router.pathname != '/login' && router.pathname != '/forget' && !router.pathname.includes('/admin') &&
            <>
              <Header session={sessions}/>
              <Preference />
            </>
          }
          <div className={` ${router.pathname != '/register' && router.pathname != '/login' && router.pathname != '/forget' && !router.pathname.includes('/admin') ? "mt-[80px] lg:mt-[100px]" : ""} `}>
            <Component {...pageProps} />
          </div>
          {
            router.pathname != '/register' && router.pathname != '/login' && router.pathname != '/forget' && !router.pathname.includes('/admin') && <Footer />
          }
        </Context.Provider>
      </SessionProvider>
    </div>
  )
}
