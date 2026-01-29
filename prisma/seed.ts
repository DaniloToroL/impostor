import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categoriesWithWords: { name: string; words: string[] }[] = [
  {
    name: "Animales",
    words: [
      "Perro",
      "Gato",
      "Elefante",
      "León",
      "Delfín",
      "Águila",
      "Tigre",
      "Oso",
      "Lobo",
      "Jirafa",
      "Conejo",
      "Caballo",
      "Pájaro",
      "Serpiente",
      "Ballena",
    ],
  },
  {
    name: "Países",
    words: [
      "México",
      "España",
      "Francia",
      "Japón",
      "Brasil",
      "Italia",
      "Alemania",
      "Argentina",
      "Canadá",
      "Australia",
      "India",
      "China",
      "Rusia",
      "Portugal",
      "Colombia",
    ],
  },
  {
    name: "Comidas",
    words: [
      "Pizza",
      "Sushi",
      "Tacos",
      "Hamburguesa",
      "Pasta",
      "Ensalada",
      "Helado",
      "Paella",
      "Ceviche",
      "Croissant",
      "Tamal",
      "Empanada",
      "Ramen",
      "Curry",
      "Tostada",
    ],
  },
  {
    name: "Profesiones",
    words: [
      "Doctor",
      "Bombero",
      "Maestro",
      "Piloto",
      "Chef",
      "Arquitecto",
      "Ingeniero",
      "Abogado",
      "Policía",
      "Astronauta",
      "Artista",
      "Músico",
      "Periodista",
      "Veterinario",
      "Fotógrafo",
    ],
  },
];

async function main() {
  for (const { name, words } of categoriesWithWords) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    for (const text of words) {
      await prisma.word.upsert({
        where: {
          text_categoryId: { text, categoryId: category.id },
        },
        update: {},
        create: { text, categoryId: category.id },
      });
    }
  }

  console.log("Seed completed: categories and words created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
