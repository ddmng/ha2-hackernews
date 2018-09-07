/** @jsx h */
import { h, app } from './hyperapp/hav2'

export default (map, callbacks = {}) => {
  const initial = { data: [] }

  const __bookmark = (state, id, {target}) => map( (s) => {
    if(s[id.id]) {
      return ({
        ...s,
        [id.id]: undefined
      })
    } else {
      return ({
        ...s,
        [id.id]: new Date()
      })
    }
  })


  const Bookmark = (state, id, event) => 
    typeof(callbacks.onBookmark)=="function"?
      callbacks.onBookmark((__bookmark(state, id, event)(state)), state.f)
      : __bookmark(state, id, event)

  const icon = (state, id) => state[id] ? "fas fa-bookmark" : "far fa-bookmark" 

  const view = ({state, id}) => (
    <div class="bookmark">
      <i class={icon(state, id)}
         onClick={[Bookmark, {id: id}]}></i>
    </div>
  )

  return { initial, view }
}