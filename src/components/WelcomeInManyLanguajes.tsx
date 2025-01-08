import { useEffect, useState } from "react";

const welcomes = [
  "Welcome",
  "Bienvenido",
  "Willkommen",
  "Benvenuto",
  "ようこそ",
  "환영합니다",
  "欢迎",
  "Bienvenue",
  "Välkommen",
  "Hoşgeldiniz",
  "ברוך הבא",
  "خوش آمدید",
  "स्वागत हे",
  "ยินดีต้อนรับ",
  "Chào mừng",
  "Croeso",
  "خوش آمدید",
  "ಸ್ವಾಗತ",
  "ਜੀ ਆਇਆ ਨੂੰ",
  "خوش آمدید",
  "స్వాగతం",
  "Hoan nghênh",
  "خوش آمدید",
  "ברוך הבא",
  "خوش آمدید",
];

export const WelcomeInManyLanguajes = () => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [blink, setBlink] = useState(true);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (index === welcomes.length) {
      setIndex(0);
    }

    if (subIndex === welcomes[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => prev + 1);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 75 : subIndex === welcomes[index].length ? 1000 : 150, Math.floor(Math.random() * 350)));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  useEffect(() => {
    const blinkTimeout = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);

    return () => clearTimeout(blinkTimeout);
  }, [blink]);

  return <>{`${welcomes[index].substring(0, subIndex)}${blink ? "|" : " "}`}</>;
};
