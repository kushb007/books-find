import {
    bigint,
    boolean,
    index,
    integer,
    pgTable,
    text,
    vector,
} from 'drizzle-orm/pg-core'
import { randomUUID } from 'crypto'

export const pokemons = pgTable(
  'pokemon',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$defaultFn(() => randomUUID()),
    number: integer('number').notNull(),
    name: text('name').notNull(),
    type1: text('type1').notNull(),
    type2: text('type2'),
    total: integer('total').notNull(),
    hp: integer('hp').notNull(),
    attack: integer('attack').notNull(),
    defense: integer('defense').notNull(),
    spAtk: integer('spAtk').notNull(),
    spDef: integer('spDef').notNull(),
    speed: integer('speed').notNull(),
    generation: integer('generation').notNull(),
    legendary: boolean('legendary').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }),
  },
  (table) => ({
    embeddingIndex: index().using(
      'hnsw',
      table.embedding.op('vector_cosine_ops')
    ),
  })
)

export type SelectPokemon = typeof pokemons.$inferSelect

export const books = pgTable(
  'book',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$defaultFn(() => randomUUID()),
    bookID: integer('bookID').notNull().default(0),
    index: integer('index').notNull().default(0),
    num_pages: integer('num_pages').notNull().default(0),
    isbn: text('isbn').notNull().default(''),
    isbn13: text('isbn13').notNull().default(''),
    authors: text('authors').notNull().default(''),
    publication_date: text('publication_date').notNull().default(''),
    title: text('title').notNull().default(''),
    language_code: text('language_code').notNull().default(''),
    ratings_count: integer('ratings_count'),
    text_reviews_count: integer('work_text_reviews_count'),
    image_url: text('image_url'),
    small_image_url: text('small_image_url'),
    embedding: vector('embedding', { dimensions: 512 }),
    publisher: text('publisher'),
  },
  (table) => ({
    embeddingIndex: index().using(
      'hnsw',
      table.embedding.op('vector_cosine_ops')
    ),
  })
)

export type SelectBook = typeof books.$inferSelect
