/** @jsx h */

import { h, app } from './hyperapp/hav2'
import * as http from './hyperapp/Http'
import * as batch from './hyperapp/Batch'
import * as time from './hyperapp/Time'
import * as logger from './hyperapp/Console'

import * as utils from './utils/utils'
import * as article from './article'
import * as navbutton from './navbuttons'

import './styles/style.css';


const FetchedStories = (state, data) => FetchArticles({
  ...state,
  articles: utils.toObject(utils.slice(data, state.maxNumArticles))
  // articles: utils.toObject(data)
})

const FetchStories = (state) => [{
    ...state,
    articles: {},
    status: 'fetching stories',
    fetching: true
  },
  http.Http({
    url: `https://hacker-news.firebaseio.com/v0/${state.list}stories.json`,
    action: FetchedStories
  })
]

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
      title:
      data.title,
      type: data.type,
      url: data.url
    }
  }
})

const FetchArticles = (state) => [{
    ...state,
    status: "fetching articles",
    fetching: true
  },
  batch.BatchFx(
    ...Object.keys(state.articles).map(item =>
      http.Http({
        url: `https://hacker-news.firebaseio.com/v0/item/${item}.json`,
        action: FetchedArticles,
      })
    )
  )
]

const SetList = ( state, {list} ) => { 
 console.log("Selected list: ", list) 
  return FetchStories({
  ...state,
  list: list
})
}

const initialState = {
  articles: {},
  status: "idle",
  autoreload: true,
  list: "new",
  maxNumArticles: 20,
  fetching: false,
  bookmarks: {}
}

app({
  init: FetchStories(initialState),
  container: document.querySelector("body"),
  view: state => (
    <main>
      <header>
        Hacker news Feed in HAv2
      </header>
      <nav>
        <div class="lists">
          <navbutton.list state={state} title="New stories" tag="new" text="New" onSelect={SetList}/>

          <navbutton.list state={state} title="Top trending stories" tag="top" text="Top" onSelect={SetList}/>

          <navbutton.list state={state} title="Best stories" tag="best" text="Best" onSelect={SetList}/>

          <navbutton.list state={state} title="Ask HackerNews" tag="ask" text="AskHN" onSelect={SetList}/>

          <navbutton.list state={state} title="Show HackerNews" tag="show" text="ShowHN" onSelect={SetList}/>

          <navbutton.list state={state} title="Jobs list" tag="job" text="Jobs" onSelect={SetList}/>

          <navbutton.refresh state={state} onRefresh={FetchStories}/>

        </div>
      </nav>
      <div>
        {Object.entries(state.articles).map(item =>
          <article.view state={state} item={item} />
        )}
      </div>
    <hr/>
        <pre>{JSON.stringify(state, null, 2)}</pre>
    </main>
  ),
  //  <hr/>
  //      <pre>{JSON.stringify(state, null, 2)}</pre>
  // subscriptions: 
  //   (state) => console.log("STATE", state)

})

