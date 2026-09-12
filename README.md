# Space War

A simple browser space shooter. Fly the ship, shoot enemies and meteors, and survive as long as you can.

## Play

Play online: [https://tharun-111.github.io/space_war_game-tn01/](https://tharun-111.github.io/space_war_game-tn01/)

Or run it locally:

```bash
python -m http.server 8080
```

Then visit [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

## Controls

| Action | Keyboard | On-screen |
| --- | --- | --- |
| Move left | Left arrow or A | ◀ |
| Move right | Right arrow or D | ▶ |
| Shoot | Space | FIRE |
| Restart after game over | R | — |

## Scoring

- Enemy ship: **100** points
- Meteor: **50** points
- Level goes up every **500** points
- You start with **3** lives

## Project layout

```
index.html    # Game page
css/style.css # Layout and HUD styles
js/game.js    # Game loop, drawing, collisions, controls
```
