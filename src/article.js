/** @jsx h */
import { h, app } from "/local_modules/hyperapp/src";
import * as fx from "/local_modules/hyperapp-fx/src";

import squirrel from "./utils/squirrel";

import Bookmark from "./bookmark";

const icon = (itemType, url) => {
  switch (itemType) {
    case "job":
      return "fas fa-building";
    case "story":
      return !url ? "fas fa-question" : "fas fa-book-open";
    case "comment":
      return "fas fa-comments";
    case "poll":
      return "fas fa-poll";
    case "pollopt":
      return "fas fa-poll";
    default:
      return "fas fa-question";
  }
};

const bookmark = Bookmark(squirrel("bookmarks"), {});

const saveBookmark = (props, dispatch) => {
  console.log("props", props)

  localStorage.setItem('bookmarks', JSON.stringify(props.bookmarks) )

  dispatch(props.action)
}

const BookmarkSaved = (state) => ({
  ...state,
  status: "bookmark_saved"
})

const SaveBookmarkEffect = (props) => ({
  effect: saveBookmark,
  action: props.action,
  id: props.id,
  bookmarks: props.bookmarks
}) 

const SaveBookmark = ({id}) => (state) => [({
  ...state,
}),
  SaveBookmarkEffect({
    action: BookmarkSaved,
    id,
    bookmarks: state.bookmarks
  })
]


export const view = ({ state, item }) => {
  if (item[1].fetched) {
    return (
      <div class="li">
        <div>
          <i class={icon(item[1].type, item[1].url)} />
        </div>
        <div>
          <a href={item[1].url} target="_blank">
            {item[1].title}
          </a>
        </div>
        <div class="by">{item[1].by}</div>
        <div class="score">{item[1].score}</div>
        <bookmark.view
          state={state.bookmarks}
          id={item[0]}
          callbacks={{ onBookmark: SaveBookmark({id: item[0]}) }}
        />
      </div>
    );
  } else {
    return <div class="li loading">Loading...</div>;
  }
};

//         <div class="bookmark"><i class="far fa-bookmark"></i></div>
