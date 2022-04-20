import { useState } from 'react';
import { FaGithub } from 'react-icons/fa'
import { FiX } from "react-icons/fi";
import styles from './Button.module.scss';
import { useSession, signIn, signOut } from "next-auth/react"

export function SignInButton() {

    const {data: session} = useSession();
    

    return (
        session ? (
            <button className={styles.signInButton}>
                <FaGithub color='#04D361' />
                <span>{session.session.user.name}</span>
                <FiX color='737380' className={styles.closeIcon}  onClick={() => signOut()}/>
            </button> ) : (
            <button className={styles.signInButton} onClick={() => signIn()} >
                <FaGithub color='#EBA417' />
                <span>Sign in with GitHub</span>
            </button>)
    )
}