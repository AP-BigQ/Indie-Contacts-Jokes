import { User, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";
  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await seed_notes(user);

  await seed_contacts(user);

  await seed_jokes(user);

  console.log(`Database has been seeded. 🌱`);
}

async function seed_notes(user: User) {
  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });
  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });
}

async function seed_contacts(user: User) {
  await Promise.all(
    getContactsData().map((contact) => {
      const data = {
        userId: user.id,
        ...contact,
      };

      return prisma.contact.create({ data });
    }),
  );
}

async function seed_jokes(user: User) {
  await Promise.all(
    getJokes().map((joke) => {
      const data = {
        userId: user.id,
        ...joke,
      };

      return prisma.joke.create({ data });
    }),
  );
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

function getContactsData() {
  return [
    {
      avatar:
        "https://sessionize.com/image/124e-400o400o2-wHVdAuNaxi8KJrgtN3ZKci.jpg",
      first: "Shruti",
      last: "Kapoor",
      twitter: "@shrutikapoor08",
    },
    {
      avatar:
        "https://sessionize.com/image/1940-400o400o2-Enh9dnYmrLYhJSTTPSw3MH.jpg",
      first: "Glenn",
      last: "Reyes",
      twitter: "@glnnrys",
    },
    {
      avatar:
        "https://sessionize.com/image/9273-400o400o2-3tyrUE3HjsCHJLU5aUJCja.jpg",
      first: "Ryan",
      last: "Florence",
    },
    {
      avatar:
        "https://sessionize.com/image/d14d-400o400o2-pyB229HyFPCnUcZhHf3kWS.png",
      first: "Oscar",
      last: "Newman",
      twitter: "@__oscarnewman",
    },
    {
      avatar:
        "https://sessionize.com/image/fd45-400o400o2-fw91uCdGU9hFP334dnyVCr.jpg",
      first: "Michael",
      last: "Jackson",
    },
    {
      avatar:
        "https://sessionize.com/image/b07e-400o400o2-KgNRF3S9sD5ZR4UsG7hG4g.jpg",
      first: "Christopher",
      last: "Chedeau",
      twitter: "@Vjeux",
    },
    {
      avatar:
        "https://sessionize.com/image/262f-400o400o2-UBPQueK3fayaCmsyUc1Ljf.jpg",
      first: "Cameron",
      last: "Matheson",
      twitter: "@cmatheson",
    },
    {
      avatar:
        "https://sessionize.com/image/820b-400o400o2-Ja1KDrBAu5NzYTPLSC3GW8.jpg",
      first: "Brooks",
      last: "Lybrand",
      twitter: "@BrooksLybrand",
    },
    {
      avatar:
        "https://sessionize.com/image/df38-400o400o2-JwbChVUj6V7DwZMc9vJEHc.jpg",
      first: "Alex",
      last: "Anderson",
      twitter: "@ralex1993",
    },
    {
      avatar:
        "https://sessionize.com/image/5578-400o400o2-BMT43t5kd2U1XstaNnM6Ax.jpg",
      first: "Kent C.",
      last: "Dodds",
      twitter: "@kentcdodds",
    },
    {
      avatar:
        "https://sessionize.com/image/c9d5-400o400o2-Sri5qnQmscaJXVB8m3VBgf.jpg",
      first: "Nevi",
      last: "Shah",
      twitter: "@nevikashah",
    },
    {
      avatar:
        "https://sessionize.com/image/2694-400o400o2-MYYTsnszbLKTzyqJV17w2q.png",
      first: "Andrew",
      last: "Petersen",
    },
    {
      avatar:
        "https://sessionize.com/image/907a-400o400o2-9TM2CCmvrw6ttmJiTw4Lz8.jpg",
      first: "Scott",
      last: "Smerchek",
      twitter: "@smerchek",
    },
    {
      avatar:
        "https://sessionize.com/image/08be-400o400o2-WtYGFFR1ZUJHL9tKyVBNPV.jpg",
      first: "Giovanni",
      last: "Benussi",
      twitter: "@giovannibenussi",
    },
    {
      avatar:
        "https://sessionize.com/image/f814-400o400o2-n2ua5nM9qwZA2hiGdr1T7N.jpg",
      first: "Igor",
      last: "Minar",
      twitter: "@IgorMinar",
    },
    {
      avatar:
        "https://sessionize.com/image/fb82-400o400o2-LbvwhTVMrYLDdN3z4iEFMp.jpeg",
      first: "Brandon",
      last: "Kish",
    },
    {
      avatar:
        "https://sessionize.com/image/fcda-400o400o2-XiYRtKK5Dvng5AeyC8PiUA.png",
      first: "Arisa",
      last: "Fukuzaki",
      twitter: "@arisa_dev",
    },
    {
      avatar:
        "https://sessionize.com/image/c8c3-400o400o2-PR5UsgApAVEADZRixV4H8e.jpeg",
      first: "Alexandra",
      last: "Spalato",
      twitter: "@alexadark",
    },
    {
      avatar:
        "https://sessionize.com/image/7594-400o400o2-hWtdCjbdFdLgE2vEXBJtyo.jpg",
      first: "Cat",
      last: "Johnson",
    },
    {
      avatar:
        "https://sessionize.com/image/5636-400o400o2-TWgi8vELMFoB3hB9uPw62d.jpg",
      first: "Ashley",
      last: "Narcisse",
      twitter: "@_darkfadr",
    },
    {
      avatar:
        "https://sessionize.com/image/6aeb-400o400o2-Q5tAiuzKGgzSje9ZsK3Yu5.JPG",
      first: "Edmund",
      last: "Hung",
      twitter: "@_edmundhung",
    },
    {
      avatar:
        "https://sessionize.com/image/30f1-400o400o2-wJBdJ6sFayjKmJycYKoHSe.jpg",
      first: "Clifford",
      last: "Fajardo",
      twitter: "@cliffordfajard0",
    },
    {
      avatar:
        "https://sessionize.com/image/6faa-400o400o2-amseBRDkdg7wSK5tjsFDiG.jpg",
      first: "Erick",
      last: "Tamayo",
      twitter: "@ericktamayo",
    },
    {
      avatar:
        "https://sessionize.com/image/feba-400o400o2-R4GE7eqegJNFf3cQ567obs.jpg",
      first: "Paul",
      last: "Bratslavsky",
      twitter: "@codingthirty",
    },
    {
      avatar:
        "https://sessionize.com/image/c315-400o400o2-spjM5A6VVfVNnQsuwvX3DY.jpg",
      first: "Pedro",
      last: "Cattori",
      twitter: "@pcattori",
    },
    {
      avatar:
        "https://sessionize.com/image/eec1-400o400o2-HkvWKLFqecmFxLwqR9KMRw.jpg",
      first: "Andre",
      last: "Landgraf",
      twitter: "@AndreLandgraf94",
    },
    {
      avatar:
        "https://sessionize.com/image/c73a-400o400o2-4MTaTq6ftC15hqwtqUJmTC.jpg",
      first: "Monica",
      last: "Powell",
      twitter: "@indigitalcolor",
    },
    {
      avatar:
        "https://sessionize.com/image/cef7-400o400o2-KBZUydbjfkfGACQmjbHEvX.jpeg",
      first: "Brian",
      last: "Lee",
      twitter: "@brian_dlee",
    },
    {
      avatar:
        "https://sessionize.com/image/f83b-400o400o2-Pyw3chmeHMxGsNoj3nQmWU.jpg",
      first: "Sean",
      last: "McQuaid",
      twitter: "@SeanMcQuaidCode",
    },
    {
      avatar:
        "https://sessionize.com/image/a9fc-400o400o2-JHBnWZRoxp7QX74Hdac7AZ.jpg",
      first: "Shane",
      last: "Walker",
      twitter: "@swalker326",
    },
    {
      avatar:
        "https://sessionize.com/image/6644-400o400o2-aHnGHb5Pdu3D32MbfrnQbj.jpg",
      first: "Jon",
      last: "Jensen",
      twitter: "@jenseng",
    },
  ];
}

function getJokes() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: "Road worker",
      content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
    },
    {
      name: "Frisbee",
      content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
    },
    {
      name: "Trees",
      content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
    },
    {
      name: "Skeletons",
      content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
    },
    {
      name: "Hippos",
      content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
    },
    {
      name: "Dinner",
      content: `What did one plate say to the other plate? Dinner is on me!`,
    },
    {
      name: "Elevator",
      content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
    },
  ];
}