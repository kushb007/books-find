import {db} from "@/drizzle/db";
import {pokemons} from "@/drizzle/schema";
import {and, notInArray, sql} from "drizzle-orm";



export default function Page({ params }: { params: { name: string } }) {
  return <p>My Post: {params.name}</p>

}

