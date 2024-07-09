'use client'

import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/command'
import {SelectPokemon} from '@/drizzle/schema'
import {MouseEvent, useEffect, useState} from 'react'
import {useDebounce} from 'use-debounce'

export interface SearchProps {
    searchPokedex: (
        content: string, recommendations: Array<string>
    ) => Promise<
        Array<Pick<SelectPokemon, 'id' | 'name'>>
    >,
    recommendPokemon: (query: string[]) => Promise<Array<Pick<SelectPokemon, "id" | "name"> & { similarity: number }>>
}


export function Search({searchPokedex, recommendPokemon}: SearchProps) {
    const [query, setQuery] = useState('')
    const [searchResults, setSearchResults] = useState<
        Array<Pick<SelectPokemon, 'id' | 'name'> & { similarity?: number }>
    >([])
    const [debouncedQuery] = useDebounce(query, 150)
    const [chosenPokemons, setChosenPokemons] = useState<string[]>([''])
    const [recommendations, setRecommendations] = useState<
        Array<Pick<SelectPokemon, 'id' | 'name'> & { similarity?: number }>
    >([])
    function addPokemon(name: string) {
        console.log("!!!")
        setChosenPokemons([...chosenPokemons, name].filter(function(item, pos, self) {return pos == self.indexOf(item)}))
        console.log(chosenPokemons)
    }
    useEffect(() => {
        recommendPokemon(chosenPokemons).then((results) => {
            setRecommendations(results)
        })
        let current = true
        if (debouncedQuery.trim().length > 0) {
            searchPokedex(debouncedQuery,chosenPokemons).then((results) => {
                if (current) {
                    console.log(results)
                    setSearchResults(results)
                }
            })
        }
        return () => {
            current = false
        }
    }, [debouncedQuery, searchPokedex, recommendPokemon, chosenPokemons])

    return (
        <div className="w-full">
            <Command label="Command Menu" shouldFilter={false} className="h-[200px]">
                <CommandInput
                    id="search"
                    placeholder="Search for Pokémon"
                    className="focus:ring-0 sm:text-sm text-base focus:border-0 border-0 active:ring-0 active:border-0 ring-0 outline-0"
                    value={query}
                    onValueChange={(q) => setQuery(q)}
                />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {searchResults.map((pokemon) => (
                        <CommandItem
                            key={pokemon.id}
                            value={pokemon.name}
                            className="flex items-center justify-between py-3"
                            onSelect={(value) => {
                                console.log('Selected', value)
                                //addPokemon(value)
                            }}>
                            <div className="flex items-center space-x-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-800">
                                        {pokemon.name.substring(0, 90)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-sm text-gray-800">
                                <button // Add button here
                                    className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                    onClick={() => addPokemon(pokemon.name)}
                                >
                                    Add
                                </button>
                            </div>
                        </CommandItem>
                    ))}
                </CommandList>
            </Command>
            <p>Some Recommendations</p>
            <Command label="Command Menu" shouldFilter={false} className="h-[200px]">
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {recommendations.map((pokemon) => (
                        <CommandItem
                            key={pokemon.id}
                            value={pokemon.name}
                            className="flex items-center justify-between py-3"
                            onSelect={(value) => {
                                console.log('Selected', value)
                                //addPokemon(value)
                            }}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-800">
                                        {pokemon.name.substring(0, 90)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-sm text-gray-800">
                                {pokemon.similarity ? (
                                    <div className="text-xs font-mono p-0.5 rounded bg-zinc-100">
                                        {pokemon.similarity.toFixed(3)}
                                    </div>
                                ) : (
                                    <div/>
                                )}
                                <button // Add button here
                                    className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                    onClick={() => addPokemon(pokemon.name)}
                                >
                                    Add
                                </button>
                            </div>
                        </CommandItem>
                    ))}
                </CommandList>
            </Command>
            <p>Your Chosen Pokemon</p>
            <Command label="Command Menu" shouldFilter={false} className="h-[200px]">
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {chosenPokemons.map((pokemon) => (
                        <CommandItem
                            key={pokemon}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-800">
                                        {pokemon}
                                    </p>
                                </div>
                            </div>
                        </CommandItem>
                    ))}
                </CommandList>
            </Command>
        </div>
    )
}

Search.displayName = 'Search'
