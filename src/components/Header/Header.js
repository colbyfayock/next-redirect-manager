import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

import Container from '@components/Container';
import Button from '@components/Button';

import styles from './Header.module.scss';

const Header = ({ children, ...rest }) => {
  const { data: session } = useSession();

  /**
   * handleOnSignInClick
   */

  function handleOnSignInClick() {
    signIn();
  }

  /**
   * handleOnSignOutClick
   */

  function handleOnSignOutClick() {
    signOut();
  }

  return (
    <header className={styles.header} {...rest}>
      <Container className={styles.headerContainer}>
        <p className={styles.title}>
          <Link href="/">
            <a>Redirect Manager</a>
          </Link>
        </p>
        <ul className={styles.actions}>
          <li>
            { !session && (
              <>
                <Button className={styles.signInOut} onClick={handleOnSignInClick}>Sign in</Button>
              </>
            )}
            { session && (
              <>
                <span className={styles.email}>{session.user.email}</span>
                <Button className={styles.signInOut} color="gray" onClick={handleOnSignOutClick}>Sign Out</Button>
              </>
            )}
          </li>
        </ul>
      </Container>
    </header>
  )
}

export default Header;