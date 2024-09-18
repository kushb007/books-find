'use client'

import { createContext } from 'react'

export const SearchContext = createContext({})

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <SearchContext.Provider value="dark">{children}</SearchContext.Provider>
}