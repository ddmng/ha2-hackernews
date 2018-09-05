/** @jsx h */
import { h, app } from './hyperapp/hav2'

export default (map, callbacks = {}) => {
  const initial = { f: '' }

  const __updateF = (state, {target}) => map( (s) => ({
    ...s, 
    f: target.value,
  }))


  const UpdateF = (state, event) => 
    typeof(callbacks.onFilter)=="function"?
      callbacks.onFilter((__updateF(state, event)(state)), state.f)
      : __updateF(state, event)


  const view = (state) => (
    <div>
      <input class="searchbox" type="text" value={state.q} onChange={UpdateF} />
    </div>
  )

  return { initial, view }
}