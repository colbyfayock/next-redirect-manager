import Head from 'next/head';
import { useSession, signIn } from 'next-auth/react';

import Header from '@components/Header';
import Footer from '@components/Footer';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from './Layout.module.scss';

const Layout = ({ children, className, requireAuth = true, ...rest }) => {
  const { data: session } = useSession();

  let layoutClassName = styles.layout;

  if ( className ) {
    layoutClassName = `${layoutClassName} ${className}`
  }

  const isPermitted = !requireAuth || ( requireAuth && session );

  function handleOnSignInClick() {
    signIn();
  }

  return (
    <div className={layoutClassName} {...rest}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        { isPermitted && children }
        { !isPermitted && (
          <Container className={styles.unauthContainer}>
            <h2>Oops, you need to be logged in to see this page!</h2>
            <p>
              <Button onClick={handleOnSignInClick}>
                Sign In
              </Button>
            </p>
          </Container>
        ) }
      </main>
      <Footer />
    </div>
  )
}

export default Layout;