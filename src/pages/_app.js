import { SessionProvider } from 'next-auth/react';

import '@styles/globals.scss'

function MyApp({ Component, pageProps }) {
  const  { session, ...props } = pageProps;
  return (
    <SessionProvider session={session}>
      <Component {...props} />
    </SessionProvider>
  );
}

export default MyApp;