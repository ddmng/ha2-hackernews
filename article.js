/** @jsx h */
import { h, app } from './hyperapp/hav2'
import * as http from './hyperapp/Http'

const icon = (itemType, url) => {
  switch(itemType) {
    case "job": return "fas fa-building"
    case "story": return !url?"fas fa-question":"fas fa-book-open"
    case "comment": return "fas fa-comments"
    case "poll": return "fas fa-poll"
    case "pollopt": return "fas fa-poll"
  }
}
  
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
        <div class="bookmark"><i class="far fa-bookmark"></i></div>
      </div>
    )
  } else { 
    return (
      <div class="li loading">Loading...</div>
    )
  }
}

