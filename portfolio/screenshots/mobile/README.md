# Mobile portfolio captures

22 projects represented: 44 framed PNGs and 20 animated GIFs. [Open the gallery](index.html).

Local apps are rendered in a composed mobile Reddit post frame, with editorial captions and explicit preview labels. Syllo uses attributed published screenshots, fitted without changing their aspect ratio; it is not a newly captured mobile layout. All framed exports are 393 × 850 px. Original Syllo images are retained in `sources/`.

Sample-data previews use saved puzzle/projection data or explicitly described local demo metadata. E*TRADE uses real public Coinbase snapshots as an alternate preview data provider. Source app files were not modified. Tracking and publishing requests were blocked locally; public PrizePicks image requests were allowed.

| Project | PNG | GIF | Source / limitation |
| --- | --- | --- | --- |
| ABC Scrubs | [View](abc-scrubs.png) | [Play](abc-scrubs.gif) | Local Scrubs prototype; uses its existing mock API. |
| Google Shopping | [View](google-shopping.png) | [Play](google-shopping.gif) | Local Google Shopping build; community choices and product results. No purchases or external product links opened. |
| Royal Canin | [View](royal-canin.png) | [Play](royal-canin.gif) | Local Royal Canin build; dog selection and details. No live votes submitted. |
| PrizePicks | [View](prizepicks.png) | [Play](prizepicks.gif) | Local PrizePicks build using saved app-projections.json reference data. Category names normalized to the app schema. Player images loaded from static.prizepicks.com. Sample selection window; no live votes or bets. |
| Adobe Firefly | [View](adobe-firefly.png) | [Play](adobe-firefly.gif) | Fresh frontend build from 152-reddit-adobe source. Actual local selection flow and bundled result images; no AI image generation was performed for this capture. |
| E*TRADE | [View](etrade.png) | [Play](etrade.gif) | Local E*TRADE frontend with real public Coinbase Exchange BTC-USD, ETH-USD and SOL-USD stats and hourly candles retrieved September 7, 2026. Alternate data provider for this preview, not the linked post’s backend. |
| FanDuel Dynamic Parlay | [View](fanduel-dynamic-parlay.png) | — | Local frontend with three sample selections from fixtures/player-props.json. Sample odds and default offer copy; not a live parlay. Static capture only; buttons lead to external betting actions. |
| McDonald's | [View](mcdonalds.png) | [Play](mcdonalds.gif) | Local frontend built from source into a temporary directory. |
| Vital Farms | [View](vital-farms.png) | [Play](vital-farms.gif) | Local frontend with empty initialization metadata; completion count 0, empty histogram, admin disabled. |
| NBA | [View](nba.png) | [Play](nba.gif) | Local frontend with the repository’s saved summary-closed.json: Clippers vs Rockets, February 11, 2026. Does not depict the linked Knicks post. |
| Levi's | [View](levis.png) | [Play](levis.gif) | Local frontend; community metrics unavailable. |
| Arby's | [View](arbys.png) | [Play](arbys.gif) | Local frontend quiz. |
| FanDuel Predicts | [View](fanduel-predicts.png) | [Play](fanduel-predicts.gif) | Local 141-reddit-fanduel2 build with a sample Clippers/Rockets matchup and empty voting data. Odds are unavailable, not invented. Default offer copy belongs to this local build; not a live promotion. |
| Sephora | [View](sephora.png) | [Play](sephora.gif) | Local frontend gift quiz and product result. |
| Paramount | [View](paramount.png) | [Play](paramount.gif) | Local Running Man frontend and gameplay. |
| Letterset | [View](letterset.png) | [Play](letterset.gif) | Fresh local frontend with daily-puzzles.sample.json puzzle 1 and the repository’s letter/bonus definitions. Neutral user metadata; no community scores submitted. |
| PocketGrids | [View](pocketgrids.png) | [Play](pocketgrids.gif) | Local PocketGrids inline and game entrypoints with the first saved 5x5 crossword from pgtools/backup_puzzle_data/puzzles_5X5_with_clues.json. Neutral progress metadata; inline-to-game navigation emulated locally. |
| Dictionary Fills | [View](dictionary-fills.png) | [Play](dictionary-fills.gif) | Local Dictionary Fills word-builder and information panel with neutral local post metadata. No word post submitted. |
| Fillables | [View](fillables.png) | [Play](fillables.gif) | Fresh Fillables frontend. Explicit sample story, neutral user metadata and local completion response generated from the selected words. No Reddit comment submitted. |
| Karma Crunch | [View](karma-crunch.png) | [Play](karma-crunch.gif) | Local Karma Crunch launcher with a sample Preview identity; report-type controls only. No personal report or portrait generated. |
| Apple | [View](apple.png) | [Play](apple.gif) | Frontend built from hftf-apple with existing compatible dependencies. Original bundled event creative and sticker animations; event countdown reflects the historical creative. No outbound CTA opened. |
| Syllo | [View](syllo.png) | — | Published stills, not a fresh mobile gameplay capture. Portrait leaderboard from Reddit developer documentation; gameplay screenshot from MobyGames. Original aspect ratios preserved inside the composed mobile frame. Live post blocked in capture browser; no gameplay GIF available. |

Syllo sources: [Reddit developer documentation](https://developers.reddit.com/docs/guides/best-practices/community_games), [MobyGames screenshot collection](https://www.mobygames.com/game/249597/syllo/). The supplied live Syllo post and ad URLs were blocked by Reddit in the isolated capture browser. No live Reddit vote, comment, post, purchase, or bet was submitted.

Samsung is only a starter screen; Paddy Power has API documentation but no runnable creative located. These are not counted as captured ads.

[Manifest](manifest.json) records the source post URLs, local projects, data sources, files and animation checks. Existing unframed captures in sibling folders are preserved.
