'use server'

import { db } from '@/drizzle/db'
import {SelectPokemon, pokemons, SelectBook} from '@/drizzle/schema'
import {desc, sql, cosineDistance, gt, eq, and, notInArray, inArray} from 'drizzle-orm'
import {randomUUID} from "crypto";

export async function searchPokedex(
  query: string, chosenPokemons: Array<string>
): Promise<Array<Pick<SelectPokemon, 'id' | 'name'>>> {
  try {
    if (query.trim().length === 0) return []
    return await db
  .select()
  .from(pokemons)
  .where(and(sql`to_tsvector('english', ${pokemons.name}) @@ websearch_to_tsquery('english', ${query})`,notInArray(pokemons.name,chosenPokemons)));

  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function recommendPokemon(
  chosenPokemon: string[]
): Promise<Array<Pick<SelectPokemon, 'id' | 'name'> & { similarity: number }>> {
  try {
    let embedding = new Array(1536).fill(0)
    const selectObjects = await db
        .select({number: pokemons.number, embedding: pokemons.embedding})
        .from(pokemons)
        .where(inArray(pokemons.name,chosenPokemon))
    if(selectObjects.length==0) return []
    for (let selectObject of selectObjects) {
        const selectEmbedding = selectObject['embedding']
        if (selectEmbedding!=null) {
            for (let i = 0; i<1536; i++) {
              embedding[i] = embedding[i]+selectEmbedding[i]
            }
        }
    }
    for (let i = 0; i<1536; i++) {
        embedding[i] = embedding[i]/selectObjects.length
    }
    const vectorQuery = `[${embedding.join(',')}]`
    const similarity = sql<number>`1 - (${cosineDistance(
      pokemons.embedding,
      vectorQuery
    )})`
    const pokemon = await db
      .select({ id: pokemons.id, name: pokemons.name, similarity })
      .from(pokemons)
      .where(and(gt(similarity, 0.1),notInArray(pokemons.name,chosenPokemon)))
      .orderBy((t) => desc(t.similarity))
      .limit(8)
    console.log("recommendations:",pokemon)
    return pokemon
  } catch (error) {
    console.error(error)
    throw error
  }
}