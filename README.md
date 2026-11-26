# shinmeijoudai.github.io

Website for **Momo Kids Lab**: educational games where kids play and learn basic skills at the same time.

🌐 Live site: https://shinmeijoudai.github.io

## Games

- **Momo Math Island** (coming soon): an Android math adventure for young learners.
- **Momo Puzzle World** (in development, ages 3–7): a gentle puzzle adventure with Momo and Bibi through five worlds, with 100 adventure levels, 100 quick puzzles, a daily puzzle, Puzzle Book, Collection, Closet and My Room.
- **Momo's Yummy World** (in development, ages 3–7): a cooking adventure with Momo and Bibi through six food worlds.
- **Momo Dreamy Puzzleland** (in development, ages 3–7): a gentle picture-jigsaw game with Momo and Bibi through 10 worlds, including ABC World and Number World.
- More games in different learning modes are planned.

## Site structure

- `index.html` – home page with Momo (games, Meet Momo outfit switcher, For Parents, contact)
- `momo-math-island/index.html` – Momo Math Island game page
- `momo-puzzle-world/`, `momo-yummy-world/`, `momo-dreamy-puzzleland/` – privacy-policy links for those games (open the shared policy)
- `assets/site.css` – shared styles; `assets/img/` – game art; `assets/fonts/` – Fredoka (self-hosted, OFL)
- No third-party scripts, fonts or trackers are loaded.

## Privacy Policy

One privacy policy covers all Momo Kids Lab games, including Momo Math Island, Momo Puzzle World, Momo's Yummy World and Momo Dreamy Puzzleland:
https://shinmeijoudai.github.io/momo-math-island/privacy-policy.html

Momo Puzzle World link (opens the same policy):
https://shinmeijoudai.github.io/momo-puzzle-world/privacy-policy.html

Momo's Yummy World link (opens the same policy):
https://shinmeijoudai.github.io/momo-yummy-world/privacy-policy.html

Momo Dreamy Puzzleland link (opens the same policy):
https://shinmeijoudai.github.io/momo-dreamy-puzzleland/privacy-policy.html

## Music

The homepage background music was made by Momo Kids Lab with Suno on a paid plan. Licence, credits, song list and the steps for adding a song: [MUSIC-LICENSE.md](MUSIC-LICENSE.md).

## Contact

momokidslab@gmail.com

## Immersive layer and registration pop-up

- `assets/immersive.css` / `assets/immersive.js` – hero sunlight, drifting mist, petals and sparkles, foreground depth, glowing buttons and section reveals. Momo's artwork itself is never moved. Motion pauses off screen, is lighter on phones, and is switched off for visitors who prefer reduced motion.
- `assets/register-popup.js` + `assets/register-popup-text.js` – the Momo & Bibi registration pop-up. It sends the same data as the registration site's form to `https://momo-kids-lab-register.pages.dev/api/register`, so registrations are saved and the notification email still arrives. Form wording in all four languages is copied from the registration site.
- **Required setting:** in Cloudflare (registration site → Settings → Variables), `ALLOWED_ORIGINS` must include `https://momokidslab.com,https://www.momokidslab.com`. If Turnstile is switched on there, add `momokidslab.com` to the widget's hostnames too. Until then, the pop-up shows a link to the registration page instead.
- **Blinking and waving:** when separate frames are ready (Momo eyes closed, wave poses, Momo and Bibi cut out on transparent backgrounds), add them to `assets/img/` and they can be layered into the hero without stretching the current image.
