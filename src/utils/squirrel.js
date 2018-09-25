/*
  
  Squirrel helps you work with data held in deeply nested objects
  
  It creates a mapping based on a given `path`. The mapping transforms a unary function `f`
  into a function that applies f to the given path of a given object.
  
  The path is given as a string, with each nesting level separated by a '.' 
  
  Some examples:
  
  ```
  const increment = x => x + 1
  const fooMap = squirrel('foo')
  const incrementFoo = fooMap(increment)
  incrementFoo({foo: 1, bar:1}) // returns: {foo: 2, bar:1}
  ```
  Paths are not limited to one level deep:
  ```
  const valueMap = squirrel('foo.bar.value')
  const incrementValue = valueMap(x => x + 1)
  incrementValue({foo: {bar: {value: 1}, baz: 1}})
    // returns: {foo: {bar: {value: 2}, baz: 1}}
  ```
  
  Your path can build on a previously existing mapping:
  
  ```
  const data = {
    foo: {
      doors: {
        'front': 'closed',
        'back': 'open',
        'garage': 'closed',
      }
    }
  }
  const doorMap = squirrel('foo.doors')
  const setDoorOpen = (doorId, data) => squirrel(doorId, doorMap)(_ => 'open')(data)
  setDoorOpen('front', data)
    // returns {foo: {doors: {front: 'open', ...}}}
  ```
  Why "Squirrel" ?
  – Squirrels run up (data-)trees with acorns (=new data) to put in specific places
  ...what *you* call it is up to you of course ;)
  
*/

export default function squirrel (path, map) {
    const [key, ...rest] = Array.isArray(path) ? path : path.split('.').reverse()
    if (rest.length) map = squirrel(rest, map)
    const F = f => x => ({...x, [key]: f(x[key])})
    return map ? x => map(F(x)) : F
}
