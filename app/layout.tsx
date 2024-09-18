import "./global.css"
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
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="description" content={metadata.description} />
            <title>{metadata.title}</title>
            <link rel="icon" href="/favicon.ico" />
        </head>
      <body>
            {children}
      </body>
    </html>
  )
}
