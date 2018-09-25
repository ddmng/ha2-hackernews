/** @jsx h */
import { h, app } from "/local_modules/hyperapp/src";

export default (map, callbacks = {}) => {
  const initial = { data: [] };

  const __bookmark = (state, id) => 
    map(s => {
      if (s[id]) {
        return {
          ...s,
          [id]: undefined
        };
      } else {
        return {
          ...s,
          [id]: new Date()
        };
      }
    })

  const Bookmark = (state, {id, callbacks}) => {
    console.log(typeof callbacks.onBookmark )

    return typeof callbacks.onBookmark == "function"
      ? callbacks.onBookmark(__bookmark(state, id)(state), state.f)
      : __bookmark(state, id);
    }

  const icon = (state, id) =>
    state[id] ? "fas fa-bookmark" : "far fa-bookmark";

  const view = ({ state, id , callbacks}) => (
    <div class="bookmark" onClick={[Bookmark, { id , callbacks}]}>
      <i class={icon(state, id)} />
    </div>
  );

  return { initial, view };
};
