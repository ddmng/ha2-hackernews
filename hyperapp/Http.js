import { assign } from "./utils"

function httpEffect(props, dispatch) {
  fetch(props.url, props.options)
    .then(function(response) {
      if (!response.ok) {
        throw response
      }
      return response
    })
    .then(function(response) {
      return response[props.response]()
    })
    .then(function(result) {
      dispatch(props.action, result)
    })
    .catch(function(error) {
      dispatch(props.error, error)
    })
}

export function Http(props) {
  return assign(
    {
      options: {},
      response: "json",
      error: props.action,
      effect: httpEffect
    },
    props
  )
}
