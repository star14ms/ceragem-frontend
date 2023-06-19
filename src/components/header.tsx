'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react"
import styles from './header.module.scss';

export default function Header() {
  const { data: session } = useSession()

  return (
    <nav className={`${styles.navbar} navbar header has-background-white px-3`} role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link href="/" className="navbar-item">
          <Image src="/icons/pinata.png" alt="Pinata" width={32} height={28} />
          <b className="ml-2">Ceragem</b>
        </Link>

        {/* <div className="navbar-burger">
          <span />
          <span />
          <span />
        </div> */}
      </div>

      <div className="navbar-menu">
        <div className="navbar-end is-size-6">
          {session && (
            <a className="navbar-item" onClick={() => signOut()}>
              Logout
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
