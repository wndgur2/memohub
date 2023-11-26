import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Memohub',
  description: 'Anyone can leave memos anywhere!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js"
          integrity="sha384-kYPsUbBPlktXsY6/oNHSUDZoTX6+YI51f63jCPEIPFP09ttByAdxd2mEjKuhdqn4" crossorigin="anonymous">
        </script>
      </head>
      <body className={inter.className}>{children}</body>



    </html>
  )
}
