/** @jsx h */
import { h, app } from './local_modules/hyperapp/src/index'
import * as fx from './local_modules/hyperapp-fx/src/index'

import squirrel from './utils/squirrel'

import Bookmark from './bookmark'

const icon = (itemType, url) => {
  switch(itemType) {
    case "job": return "fas fa-building"
    case "story": return !url?"fas fa-question":"fas fa-book-open"
    case "comment": return "fas fa-comments"
    case "poll": return "fas fa-poll"
    case "pollopt": return "fas fa-poll"
  }
}

const bookmark = Bookmark( squirrel('bookmarks') , {} )

const Bookmarked = (state) => ({
  ...state
}) // TODO save to local storage???

export const view = ({ state, item }) => {
  if(item[1].fetched) {
    return (
      <div class="li">
        <div>
          <i class={icon(item[1].type, item[1].url)}></i>
        </div>
        <div>
          <a href={item[1].url} target="_blank">{ item[1].title }</a>
        </div>
        <div class="by">{item[1].by}</div>
        <div class="score">{item[1].score}</div>
        <bookmark.view
            state={state.bookmarks}
            id={item[0]}
            callbacks={ {onBookmark: Bookmarked} } />
      </div>
    )
  } else {
    return (
      <div class="li loading">Loading...</div>
    )
  }
}

//         <div class="bookmark"><i class="far fa-bookmark"></i></div>
