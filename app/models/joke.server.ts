import { prisma } from "~/.server/db";
import type { User, Joke } from "@prisma/client";


export async function getJokes(userId:  User["id"]) {
    
  
    return await prisma.joke.findMany({
      where:{
        userId 
      },
      
      orderBy: [
        {
          updatedAt: "desc",
        },
        {
          name: "desc",
        },
      ],
    });
  }

  export const getJoke = async ({
    id,
    userId,
  }: Pick<Joke, "id"> & { userId: User["id"] }) => {
    return await prisma.joke.findUnique({
      where: { id, userId },

    });
  };

  

  export const getRandJoke = async (userId: User["id"]) => {

    const count = await prisma.joke.count();

  const randomRowNumber = Math.floor(Math.random() * count);

  const [joke] = await prisma.joke.findMany({
    where:{
        userId 
      },
    
    skip: randomRowNumber,
    take: 1,
  });

  // no json({joke}) !!
  return  joke ;

  };

  export type JokeUpsert = {
    name: string;
    content: string;
  };

  export async function createJoke(
    userId: User["id"],
    jokeInfo: JokeUpsert,
  ) {
    const joke = await prisma.joke.create({
      data: {
        ...jokeInfo,
        userId,
      },
    });
    return joke;
  }