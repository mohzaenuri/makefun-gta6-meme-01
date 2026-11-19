// make.fun GTA 6 meme entry (competition: gta6-meme-x-01)
// Regenerates the meme from its source assets:
//   assets/gta6-meme-base-v2.webp — AI-generated base scene (two gangster
//     ghosts in a white convertible, Vice City at sunset)
//   assets/press-icon-192.png    — the official make.fun ghost logo
// The script composites the logo + "make.fun" wordmark in the top-left
// corner and the giant "PAID" headline (the GTA "WASTED" death-screen flip)
// across the sky, then writes gta6-meme-final.png.
//
// Run with Node >= 22 (type stripping handles this .ts file directly):
//   npm install
//   node main.ts
import sharp from "sharp";
import { readFileSync } from "node:fs";

const W = 1920;
const H = 1280;

// Circular mask for the logo, matching the PIL composite used for the post.
const circleMask = Buffer.from(
  `<svg width="150" height="150"><circle cx="75" cy="75" r="72" fill="white"/></svg>`,
);

const logo = await sharp("assets/press-icon-192.png")
  .resize(150, 150)
  .composite([{ input: circleMask, blend: "dest-in" }])
  .png()
  .toBuffer();

const wordmark = Buffer.from(
  `<svg width="400" height="60">
     <text x="0" y="46" font-family="DejaVu Sans" font-size="44" font-weight="bold"
       fill="white" stroke="black" stroke-width="3">make.fun</text>
   </svg>`,
);

const paid = Buffer.from(
  `<svg width="1920" height="280">
     <text x="960" y="235" text-anchor="middle" font-family="DejaVu Sans"
       font-size="250" font-weight="bold" fill="white" stroke="black"
       stroke-width="10">PAID</text>
   </svg>`,
);

await sharp("assets/gta6-meme-base-v2.webp")
  .resize(W, H)
  .composite([
    { input: logo, top: 36, left: 36 },
    { input: wordmark, top: 196, left: 36 },
    { input: paid, top: 18, left: 0 },
  ])
  .modulate({ saturation: 1.08 })
  .sharpen()
  .png()
  .toFile("gta6-meme-final.png");

console.log("wrote gta6-meme-final.png (1920x1280)");
