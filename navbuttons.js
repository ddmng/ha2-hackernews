/** @jsx h */
import { h, app } from "./local_modules/hyperapp/src/index";

export const list = ({ state, tag, title, text, onSelect }) => (
  <button
    title={title}
    class={state.list == tag ? "selected" : ""}
    onClick={[onSelect, { list: tag }]}
    disabled={state.fetching}
  >
    {text}
  </button>
);

export const refresh = ({ state, onRefresh }) => (
  <button
    title="refresh"
    class="refresh"
    disabled={state.fetching}
    onClick={onRefresh}
  >
    <i class={state.fetching ? "fa fa-sync-alt fa-spin" : "fa fa-sync-alt"} />
  </button>
);
