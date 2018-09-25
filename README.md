# HackerNews clone in Hyperapp V2

This is yet another Ycombinator news clone, made in [Hyperapp](https://github.com/jorgebucaran/hyperapp), v2 branch.

Features the 6 feeds provided by HN (new, top, best, ask, show and jobs) and allows to set bookmarks; bookmarks are saved in browser's LocalStorage.

Published at: https://ha2-hackernews.netlify.com/

TODO List:

* [x] load feeds
* [x] switch feeds
* [x] save bookmarks in localstorage
* [x] load bookmarks from localstorage ar startup
* [ ] pagination
* [ ] load contents without URL in a collapsable box between the lines
* [ ] login && upvote??? --> see if there's an API for these

### Build & develop

To start working, just clone the repo, run `npm install` and start it with `npm start`.
