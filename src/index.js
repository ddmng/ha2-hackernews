/** @jsx h */

import { h, app } from "/local_modules/hyperapp/src";
import * as fx from "/local_modules/hyperapp-fx/src";

import "@fortawesome/fontawesome-free/css/all.css";
import "../styles/style.scss";

import * as utils from "./utils/utils";
import * as navs from "./navs";
import * as article from "./article";

import { LoadLocalStorageEffect } from "./fx/LocalStorage";

const FetchedStories = (state, data) =>
  FetchArticles({
    ...state,
    articles: utils.toObject(utils.slice(data, state.maxNumArticles))
  });

const FetchStories = state => [
  {
    ...state,
    articles: {},
    status: "fetching stories",
    fetching: true
  },
  fx.Http({
    url: `https://hacker-news.firebaseio.com/v0/${state.list}stories.json`,
    action: FetchedStories
  })
];

const FetchedArticles = (state, data) => ({
  ...state,
  status: "fetched-all",
  fetching: false,
  articles: {
    ...state.articles,
    [data.id]: {
      fetched: true,
      by: data.by,
      score: data.score,
      title: data.title,
      type: data.type,
      url: data.url
    }
  }
});

const FetchArticles = state => [
  {
    ...state,
    status: "fetching articles",
    fetching: true
  },
  fx.BatchFx(
    ...Object.keys(state.articles).map(item =>
      fx.Http({
        url: `https://hacker-news.firebaseio.com/v0/item/${item}.json`,
        action: FetchedArticles
      })
    )
  )
];

const SetList = (state, { list }) => {
  return FetchStories({
    ...state,
    list: list
  });
};

const initialState = {
  articles: {},
  status: "idle",
  autoreload: true,
  list: "new",
  maxNumArticles: 20,
  fetching: false,
  bookmarks: {},
  init: true
};

const BookmarksLoaded = (state, { data }) => ({
  ...state,
  bookmarks: data,
  init: false
});

const LoadBookmarks = state => [
  {
    ...state,
    status: "loading_bookmarks"
  },
  LoadLocalStorageEffect({
    action: BookmarksLoaded,
    key: "ha2-bookmarks",
    toObject: true
  })
];

app({
  init: FetchStories(initialState),
  container: document.querySelector("body"),
  view: state => (
    <main>
      <header>Hacker news Feed in HAv2</header>
      <nav>
        <navs.view
          state={state}
          onSetList={SetList}
          onFetchStories={FetchStories}
        />
      </nav>
      <div>
        {Object.entries(state.articles).map(item => (
          <article.view state={state} item={item} />
        ))}
      </div>

      <hr />
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </main>
  ),
  subscriptions:
    state => [
      console.log("STATE", state),
      state.init && fx.Time({now: true, action: LoadBookmarks})
    ]
  
  //  <hr/>
  //      <pre>{JSON.stringify(state, null, 2)}</pre>
  // subscriptions:
  //   (state) => console.log("STATE", state)
});
