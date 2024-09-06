import {recommendBook, recommendPokemon, searchBooks, searchPokedex} from '@/app/actions'
import ExpandingArrow from '@/components/expanding-arrow'
import { Search } from '@/components/search'
import Image from 'next/image'
import Link from 'next/link'
import './global.css'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">

      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        Book Search
      </h1>
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">
              Search the Catalog (full text)
            </h2>
            <p className="text-sm text-gray-500 leading-5">
              Try searching and adding "Harry Potter" or "Dune" Cosine similarity is used to find the most
              similar next Book.
            </p>
          </div>
        </div>
        <div className="divide-y divide-gray-900/5">
          <Search searchBooks={searchBooks} recommendBook={recommendBook}/>
        </div>
      <p className="font-light text-gray-600 w-full max-w-lg text-center mt-6">
        <Link
          href="https://vercel.com/postgres"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          Vercel Postgres
        </Link>{' '}
        semantic search demo with{' '}
        <Link
          href="https://github.com/pgvector/pgvector-node#drizzle-orm"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          pgvector
        </Link>
        {' '}and{' '}
        <Link
          href="https://orm.drizzle.team"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          Drizzle ORM
        </Link>
        . Built with{' '}
        <Link
          href="https://nextjs.org/docs"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          Next.js App Router
        </Link>
        .
      </p>
      <div className="mt-12 w-full flex items-center justify-between px-6 ">

        <Link
          href="https://github.com/kushb007/books-find/tree/main"
          className="lg:absolute bottom-12 right-12 flex items-center space-x-2"
        >
          <Image
            src="/github.svg"
            alt="GitHub Logo"
            width={24}
            height={24}
            priority
          />
          <span className="font-light">Source</span>
        </Link>
      </div>
    </main>
  )
}
