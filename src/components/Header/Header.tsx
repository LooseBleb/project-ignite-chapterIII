import { useRouter } from 'next/router';
import styles from './Header.module.scss'
import { SignInButton } from './SignInButton/signInButton';
import Link from 'next/link'

export function Header() {

    const {asPath} = useRouter()


    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="logo" />
                <nav>
                    <Link href='/' prefetch>
                        <a className={asPath === '/' ? styles.active : ''}>Home</a>
                    </Link>
                    <Link href='/posts' prefetch>
                        <a className={asPath === '/posts' ? styles.active : ''}>Posts</a>
                    </Link>
                </nav>
                <SignInButton />
            </div>
        </header>
    )
}