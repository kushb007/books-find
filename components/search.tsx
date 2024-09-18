'use client'

import {SelectBook} from '@/drizzle/schema'
import React, {useEffect, useState} from 'react'
import {useDebounce} from 'use-debounce'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
    Command,
    CommandEmpty,
    CommandItem,
    CommandList,
} from '@/components/command'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Chat from "./chat"


export interface SearchProps {
    searchBooks: (
        content: string, recommendations: Array<string>
    ) => Promise<
        Array<Pick<SelectBook, 'id' | 'title'>>
    >
    //recommendPokemon: (query: string[]) => Promise<Array<Pick<SelectPokemon, "id" | "name"> & { similarity: number }>>,
    recommendBook: (query: string[]) => Promise<Array<Pick<SelectBook, "id" | "title"> & { similarity: number }>>
}

export function Search({searchBooks, recommendBook}: SearchProps) {
    const [query, setQuery] = useState('')
    const [searchResults, setSearchResults] = useState<
        Array<Pick<SelectBook, 'id' | 'title'> & { similarity?: number }>
    >([])
    const [debouncedQuery] = useDebounce(query, 150)
    const [chosenBooks, setChosenBooks] = useState<string[]>([])
    const [recommendations, setRecommendations] = useState<
        Array<Pick<SelectBook, 'id' | 'title'> & { similarity?: number }>
    >([])
    function addBook(title: string) {
        setChosenBooks([...chosenBooks, title].filter(function(item, pos, self) {return pos == self.indexOf(item)}))
    }
    function removeBook(title: string) {
        setChosenBooks(chosenBooks.filter(function(item) {return item != title}))
    }
    useEffect(() => {
        recommendBook(chosenBooks).then((results) => {
            setRecommendations(results)
        })
        let current = true
        if (debouncedQuery.trim().length > 0) {
            searchBooks(debouncedQuery,chosenBooks).then((results) => {
                if (current) {
                    setSearchResults(results)
                }
            })
        }
        return () => {
            current = false
        }

    }, [debouncedQuery, searchBooks, recommendBook, chosenBooks])

    return (
        <div className="w-full">
            <SearchBox query={query} setQuery={setQuery} searchResults={searchResults} addBook={addBook}/>
            <br></br>
            <p>Some Recommendations</p>
            <Suggest recommendations={recommendations} addBook={addBook}/>
            <br></br>
            <p>Your Chosen Books</p>
            <Chosen chosenBooks={chosenBooks} removeBook={removeBook}/>
        </div>
    )
}

Search.displayName = 'Search'

export function SearchBox({ query, setQuery, searchResults, addBook }: { query: string, setQuery: (q: string) => void, searchResults: Array<Pick<SelectBook, 'id' | 'title'>>, addBook: (title: string) => void }) {
    return (
        <Command label="Command Menu" shouldFilter={false} >
            <Input
                id="search"
                placeholder="Search for Pokémon"
                value={query}
                onChange={(q) => setQuery(q.target.value)}
            >
            </Input>
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <ScrollArea>
                {searchResults.map((book) => (
                    <CommandItem
                        key={book.id}
                        value={book.title}
                        className="flex items-center justify-between py-3"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="space-y-1">
                                <p>
                                    {book.title.substring(0, 90)}
                                </p>
                            </div>
                        </div>
                        <div>
                            <Button onClick={() => addBook(book.title)}>Add</Button>
                        </div>
                    </CommandItem>
                ))}
                </ScrollArea>
            </CommandList>
        </Command>
    )
}

export function Suggest({recommendations, addBook}: { recommendations: Array<Pick<SelectBook, 'id' | 'title'> & { similarity?: number }>, addBook: (title: string) => void }) {
    return (
        <Command label="Command Menu" shouldFilter={false}>
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <ScrollArea>
                    {recommendations.map((book) => (
                        <CommandItem
                            key={book.id}
                            value={book.title}
                            className="flex items-center justify-between py-3"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="space-y-1">
                                    <p>
                                        {book.title.substring(0, 90)}
                                    </p>
                                </div>
                            </div>
                            <div>
                                {book.similarity ? (
                                    <div className="text-xs font-mono p-0.5 rounded bg-zinc-100">
                                        {book.similarity.toFixed(3)}
                                    </div>
                                ) : (
                                    <div/>
                                )}
                                <Button onClick={() => addBook(book.title)}>Add</Button>
                            </div>
                        </CommandItem>
                    ))}
                    </ScrollArea>
                </CommandList>
            </Command>
    )
}

export function Chosen({chosenBooks, removeBook}: { chosenBooks: string[], removeBook: (title: string) => void }) {
    return (
        <Tabs defaultValue="account" className="flex w-full space-x-8 p-8">
      <TabsList className="flex flex-col h-100 basis-1/3">
          {chosenBooks.map((book) => (
                <TabsTrigger value={book} className="justify-start">{book}</TabsTrigger>
          ))}
      </TabsList>
      <div className="flex-1 basis-2/3">
          {chosenBooks.map((book) => (
              <TabsContent value={book}>
                  <Card>
                      <CardHeader>
                          <CardTitle>{book}</CardTitle>
                          <CardDescription>
                              Ado about {book}
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                            <Chat/>
                      </CardContent>
                      <CardFooter>
                          <Button onClick={() => removeBook(book)}>Remove</Button>
                      </CardFooter>
                  </Card>
                </TabsContent>
          ))}
      </div>
    </Tabs>
)
}