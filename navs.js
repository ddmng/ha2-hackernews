import { h, app } from "./local_modules/hyperapp/src/index";
import * as fx from "./local_modules/hyperapp-fx/src/index";

import * as navbutton from "./navbuttons";

export const view = ({ state, onSetList, onFetchStories }) => (
  <div class="lists">
    <navbutton.list
      state={state}
      title="New stories"
      tag="new"
      text="New"
      onSelect={onSetList}
    />

    <navbutton.list
      state={state}
      title="Top trending stories"
      tag="top"
      text="Top"
      onSelect={onSetList}
    />

    <navbutton.list
      state={state}
      title="Best stories"
      tag="best"
      text="Best"
      onSelect={onSetList}
    />

    <navbutton.list
      state={state}
      title="Ask HackerNews"
      tag="ask"
      text="AskHN"
      onSelect={onSetList}
    />

    <navbutton.list
      state={state}
      title="Show HackerNews"
      tag="show"
      text="ShowHN"
      onSelect={onSetList}
    />

    <navbutton.list
      state={state}
      title="Jobs list"
      tag="job"
      text="Jobs"
      onSelect={onSetList}
    />

    <navbutton.refresh state={state} onRefresh={onFetchStories} />
  </div>
);
