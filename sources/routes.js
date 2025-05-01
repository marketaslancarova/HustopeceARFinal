export const route = {
  routeId: "ztraceny_tricatek",
  title: "Ztracený třicátek",
  description: "Pomoz Hermíně najít ukradený svitek!",
  distance: "0,4 km",
  duration: "1,5 h",
  intro: {
    text: "Někdo ukradl svitek a bez něj nemohou začít trhy!",
    audio: "intro_audio.mp3",
  },
  stops: [
    {
      name: "Radnice",
      coordinates: [48.9401, 16.7371],
      story: {
        text: "Na radnici kdysi vybírali daně...",
        audio: "radnice_story.mp3",
      },
      task: {
        type: "puzzle",
        instruction: "Slož městskou pečeť správně!",
      },
    },
    {
      name: "Tržiště",
      coordinates: [48.9405, 16.7365],
      story: {
        text: "Na tržišti se prodávalo ovoce...",
        audio: "trziste_story.mp3",
      },
      task: {
        type: "quiz",
        instruction: "Vyber správný sud s kouzelnými jablky.",
        options: ["Červený sud", "Zelený sud", "Modrý sud"],
        solution: "Zelený sud",
      },
    },
  ],
  ending: {
    text: "Svitek byl nalezen, trhy mohou začít!",
    optionPhoto: true,
  },
};
