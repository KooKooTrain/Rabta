# Credits and licences

## Photos (`public/photos/`)
Downloaded from Wikimedia Commons and served locally (never hotlinked). Machine-readable copy:
`src/config/photo-credits.json`, rendered on the site at **/credits** (linked in the footer), which
satisfies the attribution terms of the CC BY / CC BY-SA images. On the site, photos are cropped,
greyscaled, tinted or cut into shapes.

| File | Author | Licence | Source |
| --- | --- | --- | --- |
| family-01.jpg | National Cancer Institute | Public domain | https://commons.wikimedia.org/wiki/File:Family_eating_meal.jpg |
| family-02.jpg | Jim McKinney | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Granddaughter%27s_Love_for_the_Grandmother_Raising_Her.jpg |
| family-03.jpg | Daisy Romwall | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:April_and_her_little_niece_Lorelei.jpg |
| family-04.jpg | Hlmb | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:%D7%99%D7%93%D7%99%D7%99%D7%9D_%D7%A9%D7%9C_%D7%99%D7%9C%D7%93%D7%99%D7%9D_%D7%A2%D7%9C_%D7%99%D7%93_%D7%A9%D7%9C_%D7%A1%D7%91%D7%AA%D7%90.jpg |
| family-05.jpg | Shixart1985 | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:A_mother_and_her_young_daughter_spend_time_together_in_a_sunny_park,_tending_to_vibrant_flowers_in_a_wooden_planter.jpg |
| family-06.jpg | Rod Waddington | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:Brother_and_Sister,_Yemen_(10569460956).jpg |
| family-07.jpg | Steve Hillebrand, U.S. Fish and Wildlife Service | Public domain | https://commons.wikimedia.org/wiki/File:Family_enjoys_strolling_on_the_paths_at_the_park.jpg |
| family-08.jpg | Shixart1985 | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Family_cooking_activity_with_kids_preparing_homemade_fries_in_a_cozy_kitchen_setting.jpg |
| family-09.jpg | Lifecirclehealthservices | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Home_Care_Services_in_New_Delhi.jpg |
| family-10.jpg | Personal Creations | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Family_watching_a_movie_on_the_couch_(14963809100).jpg |

Everything else visual (pixel fields, stamps' perforation, stripes, logo mark, charts) is generated in code.

## Fonts (self-hosted at build time via `next/font/google`)
| Font | Designer | Licence |
| --- | --- | --- |
| Archivo | Omnibus-Type | SIL Open Font License 1.1 |
| Instrument Sans | Instrument | SIL Open Font License 1.1 |
| Geist Mono | Vercel | SIL Open Font License 1.1 |

## Icons
- [Lucide](https://lucide.dev): ISC License.

## Libraries
- Next.js and React (MIT), Tailwind CSS (MIT), GSAP + @gsap/react (GSAP standard "no charge" licence),
  Lenis (MIT), motion (MIT), clsx (MIT), tailwind-merge (MIT).

## Design inspiration
Layout, typography and motion techniques were studied (not copied) from wastetide.ai and
chandebootcamp.com. No assets, code or copy were taken from either site.

If you add or swap photos: put them in `public/photos/`, add an entry to
`src/config/photo-credits.json` and this table, and update `site.media` in `src/config/site.ts`.
