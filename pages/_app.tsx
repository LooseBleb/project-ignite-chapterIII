import '../src/styles/globals.scss'
import { Header } from '../src/components/Header/Header';
import { SessionProvider } from "next-auth/react"
import { useResolvedPath } from 'react-router';

function MyApp({ Component, pageProps:{session, ...pageProps} }) {  
  return (
    <SessionProvider  session={session}>
      <Header/>
      <Component {...pageProps } />
    </SessionProvider>
  )
}

export default MyApp
