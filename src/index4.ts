interface WindowSettings {
  theme: "light" | "dark";
}

interface WindowSettings {
  locale: "ru" | "en";
}

// interface WindowSettings {
//   theme: "light" | "dark";
//   locale: "ru" | "en";
// }

// const settings: WindowSettings = {
//   theme: "dark",
//   locale: "ru",
// };

// console.log(settings);

window.appVersion = "1.0.0";

declare global {
  interface Window {
    appVersion: string;
  }
}

export {};
