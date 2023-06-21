import '@/styles/globals.scss';
import 'react-chat-bot/src/assets/scss/_app.scss'
import { Metadata } from 'next'
import Providers from '@/app/provider'

import Header from '@/components/header';
import styles from './layout.module.scss';
import { inter } from '@/styles/fonts';


export const metadata: Metadata = {
  title: 'Ceragem',
  description: 'Ceragem',
  openGraph: {
    images: '/favicon.ico',
  },
}

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <div className={`${styles.container} ${inter.variable} col-a-center is-10`}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}