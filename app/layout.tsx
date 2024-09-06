import {Providers} from "./providers";


export const metadata = {
  metadataBase: new URL('https://books-find.vercel.app'),
  title: 'Books-Find',
  description:
    '📕🔎🔥',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  )
}
