export interface Lake {
  slug: string;
  name: string;
  region: string;
  description: string;
  image?: string;
}

export const lakes: Lake[] = [
  {
    slug: "emigrant-lake",
    name: "Emigrant Lake",
    region: "Southern Oregon",
    description:
      "A Medford staple with wide open water and classic rope swing spots. Popular for summer hangouts, paddle sessions, and sunset floats.",
  },
  {
    slug: "lost-creek-lake",
    name: "Lost Creek Lake",
    region: "Southern Oregon",
    description:
      "Large and scenic with plenty of coves to explore. Great for longer paddle routes and quieter morning sessions.",
  },
  {
    slug: "applegate-lake",
    name: "Applegate Lake",
    region: "Southern Oregon",
    description:
      "Clear water and forested shoreline. A favorite for laid-back days, cliff jumps, and finding calm glassy water.",
  },
  {
    slug: "howard-prairie",
    name: "Howard Prairie Lake",
    region: "Southern Oregon",
    description:
      "Higher elevation and cooler temps. Known for peaceful mornings and wide-open paddling when the wind stays down.",
  },
  {
    slug: "hyatt-lake",
    name: "Hyatt Lake",
    region: "Southern Oregon",
    description:
      "A smaller mountain lake with chill vibes. Perfect for relaxed paddling and low-key weekend meetups.",
  },
  {
    slug: "echo-lake",
    name: "Echo Lake",
    region: "Southern Oregon",
    description:
      "A quiet hidden gem near Howard Prairie. Ideal for calm water sessions and smaller group hangouts.",
    image: "/lakes/echo.jpg",
  },
  {
    slug: "fish-lake",
    name: "Fish Lake",
    region: "Southern Oregon",
    description:
      "Tucked in the woods near Lake of the Woods. Calm water, beautiful reflections, and great sunrise paddle spots.",
  },
  {
    slug: "diamond-lake",
    name: "Diamond Lake",
    region: "Southern Oregon",
    description:
      "Bigger water with incredible views of Mount Thielsen. Great for longer paddle routes and scenic photo posts.",
  },
  {
    slug: "willow-lake",
    name: "Willow Lake",
    region: "Southern Oregon",
    description:
      "A smaller local reservoir with open shoreline access. Good for quick sessions and spontaneous afternoon meetups.",
  },
  {
    slug: "lake-of-the-woods",
    name: "Lake of the Woods",
    region: "Southern Oregon",
    description:
      "Clear mountain water and beautiful surroundings. A summer favorite for paddleboarding, boating, and social lake days.",
    image: "/lakes/lake-of-the-woods.jpg",
  },
];

export function getLakeBySlug(slug: string): Lake | undefined {
  return lakes.find((lake) => lake.slug === slug);
}
