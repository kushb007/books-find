import 'dotenv/config'
import { db } from './db'
import { pokemons, books } from './schema'
import { eq } from 'drizzle-orm'
import { openai } from '../lib/openai'
import pokemon from './pokemon-with-embeddings.json'
import book_1 from './part_1.json'
import book_2 from './part_2.json'
import book_3 from './part_3.json'
import book_4 from './part_4.json'
import book_5 from './part_5.json'
import book_6 from './part_6.json'
import book_7 from './part_7.json'
import book_8 from './part_8.json'
import book_9 from './part_9.json'
import book_10 from './part_10.json'
import { embed } from 'ai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('process.env.OPENAI_API_KEY is not defined. Please set it.')
}

if (!process.env.POSTGRES_URL) {
  throw new Error('process.env.POSTGRES_URL is not defined. Please set it.')
}

async function storeBooks(file: {} ){
  console.log(`Starting a storing`)
  for (const record of (file as any)) {
    // In order to save time, we'll just use the embeddings we've already generated
    // for each Pokémon. If you want to generate them yourself, uncomment the
    // following line and comment out the line after it.
    // const embedding = await generateEmbedding(p.name);
    // await new Promise((r) => setTimeout(r, 500)); // Wait 500ms between requests;
    const { embedding, ...p } = record

    // Create the pokemon in the database
    const [book] = await db.insert(books).values(p).returning()

    await db
      .update(books)
      .set({
        embedding,
      })
      .where(eq(books.id, book.id))

    console.log(`Added ${book.id} ${book.title}`)

  }
}

async function main() {

  for (const record of (pokemon as any).data) {
    // In order to save time, we'll just use the embeddings we've already generated
    // for each Pokémon. If you want to generate them yourself, uncomment the
    // following line and comment out the line after it.
    // const embedding = await generateEmbedding(p.name);
    // await new Promise((r) => setTimeout(r, 500)); // Wait 500ms between requests;
    const { embedding, ...p } = record

    // Create the pokemon in the database
    const [pokemon] = await db.insert(pokemons).values(p).returning()

    await db
      .update(pokemons)
      .set({
        embedding,
      })
      .where(eq(pokemons.id, pokemon.id))

    console.log(`Added ${pokemon.number} ${pokemon.name}`)

  }

  // Uncomment the following lines if you want to generate the JSON file
  // fs.writeFileSync(
  //   path.join(__dirname, "./pokemon-with-embeddings.json"),
  //   JSON.stringify({ data }, null, 2),
  // );
  console.log('Pokédex seeded successfully!')
  storeBooks(book_1)
  storeBooks(book_2)
  storeBooks(book_3)
  storeBooks(book_4)
  storeBooks(book_5)
  storeBooks(book_6)
  storeBooks(book_7)
  storeBooks(book_8)
  storeBooks(book_9)
}
main()
  .then(async () => {
    process.exit(0)
  })
  .catch(async (e) => {
    console.error(e)

    process.exit(1)
  })

async function generateEmbedding(_input: string) {
  const input = _input.replace(/\n/g, ' ')
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-ada-002'),
    value: input,
  })
  return embedding
}
