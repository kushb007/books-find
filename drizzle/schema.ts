import {
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
    book_id: integer('book_id').notNull(),
    best_book_id: integer('best_book_id'),
    work_id: integer('work_id'),
    books_count: integer('books_count'),
    isbn: integer('isbn'),
    isbn13: integer('isbn13'),
    authors: text('authors'),
    original_publication_year: text('original_publication_year'),
    original_title: text('original_title'),
    title: text('title'),
    language_code: text('language_code'),
    average_rating: text('average_rating'),
    ratings_count: integer('ratings_count'),
    work_ratings_count: integer('work_ratings_count'),
    work_text_reviews_count: integer('work_text_reviews_count'),
    ratings_1: integer('ratings_1'),
    ratings_2: integer('ratings_2'),
    ratings_3: integer('ratings_3'),
    ratings_4: integer('ratings_4'),
    ratings_5: integer('ratings_5'),
    image_url: text('image_url'),
    small_image_url: text('small_image_url'),
    embedding: vector('embedding', { dimensions: 1024 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index().using(
      'hnsw',
      table.embedding.op('vector_cosine_ops')
    ),
  })
)

export type SelectBook = typeof books.$inferSelect
