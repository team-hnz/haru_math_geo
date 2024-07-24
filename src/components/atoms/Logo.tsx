import localFont from "next/font/local";

const danjunghae = localFont({
  src: [
    {
      path: "../../app/fonts/CAFE24DANJUNGHAE.ttf",
      weight: "normal",
      style: "normal",
    },
  ],
});

export default function Logo() {
  return (
    <p className={`${danjunghae.className} font-sans text-9xl`}>HARU MATH</p>
  );
}
