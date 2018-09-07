// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"local_modules/hyperapp/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.app = app;
var DEFAULT = 0;
var RECYCLED_NODE = 1;
var TEXT_NODE = 2;

var XLINK_NS = "http://www.w3.org/1999/xlink";
var SVG_NS = "http://www.w3.org/2000/svg";

var EMPTY_OBJECT = {};
var EMPTY_ARRAY = [];

var map = EMPTY_ARRAY.map;
var isArray = Array.isArray;

var merge = function merge(a, b) {
  var target = {};

  for (var i in a) {
    target[i] = a[i];
  }for (var i in b) {
    target[i] = b[i];
  }return target;
};

var resolved = typeof Promise === "function" && Promise.resolve();

var defer = !resolved ? setTimeout : function (cb) {
  return resolved.then(cb);
};

var updateProperty = function updateProperty(element, name, lastValue, nextValue, eventProxy, isSvg) {
  if (name === "key") {} else if (name === "style") {
    for (var i in merge(lastValue, nextValue)) {
      var style = nextValue == null || nextValue[i] == null ? "" : nextValue[i];
      if (i[0] === "-") {
        element[name].setProperty(i, style);
      } else {
        element[name][i] = style;
      }
    }
  } else {
    if (name[0] === "o" && name[1] === "n") {
      name = name.slice(2).toLowerCase();

      if (!element.events) element.events = {};

      element.events[name] = nextValue;

      if (nextValue == null) {
        element.removeEventListener(name, eventProxy);
      } else if (lastValue == null) {
        element.addEventListener(name, eventProxy);
      }
    } else {
      var nullOrFalse = nextValue == null || nextValue === false;

      if (name in element && name !== "list" && name !== "draggable" && name !== "spellcheck" && name !== "translate" && !isSvg) {
        element[name] = nextValue == null ? "" : nextValue;
        if (nullOrFalse) {
          element.removeAttribute(name);
        }
      } else {
        var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ""));
        if (ns) {
          if (nullOrFalse) {
            element.removeAttributeNS(XLINK_NS, name);
          } else {
            element.setAttributeNS(XLINK_NS, name, nextValue);
          }
        } else {
          if (nullOrFalse) {
            element.removeAttribute(name);
          } else {
            element.setAttribute(name, nextValue);
          }
        }
      }
    }
  }
};

var createElement = function createElement(node, lifecycle, eventProxy, isSvg) {
  var element = node.type === TEXT_NODE ? document.createTextNode(node.name) : (isSvg = isSvg || node.name === "svg") ? document.createElementNS(SVG_NS, node.name) : document.createElement(node.name);

  var props = node.props;
  if (props.onCreate) {
    lifecycle.push(function () {
      props.onCreate(element);
    });
  }

  for (var i = 0, length = node.children.length; i < length; i++) {
    element.appendChild(createElement(node.children[i], lifecycle, eventProxy, isSvg));
  }

  for (var name in props) {
    updateProperty(element, name, null, props[name], eventProxy, isSvg);
  }

  return node.element = element;
};

var updateElement = function updateElement(element, lastProps, nextProps, lifecycle, eventProxy, isSvg, isRecycled) {
  for (var name in merge(lastProps, nextProps)) {
    if ((name === "value" || name === "checked" ? element[name] : lastProps[name]) !== nextProps[name]) {
      updateProperty(element, name, lastProps[name], nextProps[name], eventProxy, isSvg);
    }
  }

  var cb = isRecycled ? nextProps.onCreate : nextProps.onUpdate;
  if (cb != null) {
    lifecycle.push(function () {
      cb(element, lastProps);
    });
  }
};

var removeChildren = function removeChildren(node) {
  for (var i = 0, length = node.children.length; i < length; i++) {
    removeChildren(node.children[i]);
  }

  var cb = node.props.onDestroy;
  if (cb != null) {
    cb(node.element);
  }

  return node.element;
};

var removeElement = function removeElement(parent, node) {
  var remove = function remove() {
    parent.removeChild(removeChildren(node));
  };

  var cb = node.props && node.props.onRemove;
  if (cb != null) {
    cb(node.element, remove);
  } else {
    remove();
  }
};

var getKey = function getKey(node) {
  return node == null ? null : node.key;
};

var createKeyMap = function createKeyMap(children, start, end) {
  var out = {};
  var key;
  var node;

  for (; start <= end; start++) {
    if ((key = (node = children[start]).key) != null) {
      out[key] = node;
    }
  }

  return out;
};

var patchElement = function patchElement(parent, element, lastNode, nextNode, lifecycle, eventProxy, isSvg) {
  if (nextNode === lastNode) {} else if (lastNode != null && lastNode.type === TEXT_NODE && nextNode.type === TEXT_NODE) {
    if (lastNode.name !== nextNode.name) {
      element.nodeValue = nextNode.name;
    }
  } else if (lastNode == null || lastNode.name !== nextNode.name) {
    var newElement = parent.insertBefore(createElement(nextNode, lifecycle, eventProxy, isSvg), element);

    if (lastNode != null) removeElement(parent, lastNode);

    element = newElement;
  } else {
    updateElement(element, lastNode.props, nextNode.props, lifecycle, eventProxy, isSvg = isSvg || nextNode.name === "svg", lastNode.type === RECYCLED_NODE);

    var savedNode;
    var childNode;

    var lastKey;
    var lastChildren = lastNode.children;
    var lastChStart = 0;
    var lastChEnd = lastChildren.length - 1;

    var nextKey;
    var nextChildren = nextNode.children;
    var nextChStart = 0;
    var nextChEnd = nextChildren.length - 1;

    while (nextChStart <= nextChEnd && lastChStart <= lastChEnd) {
      lastKey = getKey(lastChildren[lastChStart]);
      nextKey = getKey(nextChildren[nextChStart]);

      if (lastKey == null || lastKey !== nextKey) break;

      patchElement(element, lastChildren[lastChStart].element, lastChildren[lastChStart], nextChildren[nextChStart], lifecycle, eventProxy, isSvg);

      lastChStart++;
      nextChStart++;
    }

    while (nextChStart <= nextChEnd && lastChStart <= lastChEnd) {
      lastKey = getKey(lastChildren[lastChEnd]);
      nextKey = getKey(nextChildren[nextChEnd]);

      if (lastKey == null || lastKey !== nextKey) break;

      patchElement(element, lastChildren[lastChEnd].element, lastChildren[lastChEnd], nextChildren[nextChEnd], lifecycle, eventProxy, isSvg);

      lastChEnd--;
      nextChEnd--;
    }

    if (lastChStart > lastChEnd) {
      while (nextChStart <= nextChEnd) {
        element.insertBefore(createElement(nextChildren[nextChStart++], lifecycle, eventProxy, isSvg), (childNode = lastChildren[lastChStart]) && childNode.element);
      }
    } else if (nextChStart > nextChEnd) {
      while (lastChStart <= lastChEnd) {
        removeElement(element, lastChildren[lastChStart++]);
      }
    } else {
      var lastKeyed = createKeyMap(lastChildren, lastChStart, lastChEnd);
      var nextKeyed = {};

      while (nextChStart <= nextChEnd) {
        lastKey = getKey(childNode = lastChildren[lastChStart]);
        nextKey = getKey(nextChildren[nextChStart]);

        if (nextKeyed[lastKey] || nextKey != null && nextKey === getKey(lastChildren[lastChStart + 1])) {
          if (lastKey == null) {
            removeElement(element, childNode);
          }
          lastChStart++;
          continue;
        }

        if (nextKey == null || lastNode.type === RECYCLED_NODE) {
          if (lastKey == null) {
            patchElement(element, childNode && childNode.element, childNode, nextChildren[nextChStart], lifecycle, eventProxy, isSvg);
            nextChStart++;
          }
          lastChStart++;
        } else {
          if (lastKey === nextKey) {
            patchElement(element, childNode.element, childNode, nextChildren[nextChStart], lifecycle, eventProxy, isSvg);
            nextKeyed[nextKey] = true;
            lastChStart++;
          } else {
            if ((savedNode = lastKeyed[nextKey]) != null) {
              patchElement(element, element.insertBefore(savedNode.element, childNode && childNode.element), savedNode, nextChildren[nextChStart], lifecycle, eventProxy, isSvg);
              nextKeyed[nextKey] = true;
            } else {
              patchElement(element, childNode && childNode.element, null, nextChildren[nextChStart], lifecycle, eventProxy, isSvg);
            }
          }
          nextChStart++;
        }
      }

      while (lastChStart <= lastChEnd) {
        if (getKey(childNode = lastChildren[lastChStart++]) == null) {
          removeElement(element, childNode);
        }
      }

      for (var key in lastKeyed) {
        if (nextKeyed[key] == null) {
          removeElement(element, lastKeyed[key]);
        }
      }
    }
  }

  return nextNode.element = element;
};

var createVNode = function createVNode(name, props, children, element, key, type) {
  return {
    name: name,
    props: props,
    children: children,
    element: element,
    key: key,
    type: type
  };
};

var createTextVNode = function createTextVNode(text, element) {
  return createVNode(text, EMPTY_OBJECT, EMPTY_ARRAY, element, null, TEXT_NODE);
};

var recycleChild = function recycleChild(element) {
  return element.nodeType === 3 // Node.TEXT_NODE
  ? createTextVNode(element.nodeValue, element) : recycleElement(element);
};

var recycleElement = function recycleElement(element) {
  return createVNode(element.nodeName.toLowerCase(), EMPTY_OBJECT, map.call(element.childNodes, recycleChild), element, null, RECYCLED_NODE);
};

var patch = function patch(container, element, lastNode, nextNode, eventProxy) {
  var lifecycle = [];

  element = patchElement(container, element, lastNode, nextNode, lifecycle, eventProxy);

  while (lifecycle.length > 0) {
    lifecycle.pop()();
  }return element;
};

var h = exports.h = function h(name, props) {
  var node;
  var rest = [];
  var children = [];
  var length = arguments.length;

  while (length-- > 2) {
    rest.push(arguments[length]);
  }if ((props = props == null ? {} : props).children != null) {
    if (rest.length <= 0) {
      rest.push(props.children);
    }
    delete props.children;
  }

  while (rest.length > 0) {
    if (isArray(node = rest.pop())) {
      for (length = node.length; length-- > 0;) {
        rest.push(node[length]);
      }
    } else if (node === false || node === true || node == null) {} else {
      children.push((typeof node === "undefined" ? "undefined" : _typeof(node)) === "object" ? node : createTextVNode(node));
    }
  }

  return typeof name === "function" ? name(props, props.children = children) : createVNode(name, props, children, null, props.key, DEFAULT);
};

var cancel = function cancel(sub) {
  sub.cancel();
};

var isSameValue = function isSameValue(a, b) {
  if (a !== b) {
    for (var k in merge(a, b)) {
      if (a[k] !== b[k]) return false;
    }
  }
  return true;
};

var isSameAction = function isSameAction(a, b) {
  return (typeof a === "undefined" ? "undefined" : _typeof(a)) === (typeof b === "undefined" ? "undefined" : _typeof(b)) && isArray(a) && a[0] === b[0] && isSameValue(a[1], b[1]);
};

var restart = function restart(sub, oldSub, dispatch) {
  for (var k in merge(sub, oldSub)) {
    if (k === "cancel") {} else if (sub[k] === oldSub[k] || isSameAction(sub[k], oldSub[k])) {} else {
      cancel(oldSub);
      return start(sub, dispatch);
    }
  }
  return oldSub;
};

var start = function start(sub, dispatch) {
  return merge(sub, {
    cancel: sub.effect(sub, dispatch)
  });
};

var refresh = function refresh(sub, oldSub, dispatch) {
  if (isArray(sub) || isArray(oldSub)) {
    var out = [];
    var subs = isArray(sub) ? sub : [sub];
    var oldSubs = isArray(oldSub) ? oldSub : [oldSub];

    for (var i = 0; i < subs.length || i < oldSubs.length; i++) {
      out.push(refresh(subs[i], oldSubs[i], dispatch));
    }

    return out;
  }

  return sub ? oldSub ? restart(sub, oldSub, dispatch) : start(sub, dispatch) : oldSub ? cancel(oldSub) : oldSub;
};

function app(props) {
  var state;
  var view = props.view;
  var subs = props.subscriptions;
  var container = props.container;
  var element = container.children[0];
  var lastNode = element && recycleElement(element);
  var lastSub = [];
  var updateInProgress = false;

  var setState = function setState(newState) {
    if (state !== newState) {
      state = newState;

      if (!updateInProgress) {
        updateInProgress = true;
        defer(render);
      }
    }
  };

  var dispatch = function dispatch(obj, data) {
    if (obj == null) {} else if (typeof obj === "function") {
      dispatch(obj(state, data));
    } else if (isArray(obj)) {
      if (typeof obj[0] === "function") {
        dispatch(obj[0](state, obj[1], data));
      } else {
        obj[1].effect(obj[1], dispatch, setState(obj[0]));
      }
    } else {
      setState(obj);
    }
  };

  var eventProxy = function eventProxy(event) {
    dispatch(event.currentTarget.events[event.type], event);
  };

  var render = function render() {
    updateInProgress = false;

    if (subs) {
      lastSub = refresh(subs(state), lastSub, dispatch);
    }

    if (view) {
      element = patch(container, element, lastNode, lastNode = view(state), eventProxy);
    }
  };

  dispatch(props.init);
}
},{}],"utils/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var toObject = exports.toObject = function toObject(data) {
  var sliced = data.map(function (i) {
    return _defineProperty({}, i, "");
  });
  var remapped = sliced.reduce(function (obj, e) {
    obj[Object.keys(e)[0]] = { loaded: false };
    return obj;
  }, {});
  return remapped;
};

var slice = exports.slice = function slice(data, size) {
  return data.slice(0, size);
};
},{}],"hyperapp/hav2.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.app = app;
var DEFAULT = 0;
var RECYCLED_NODE = 1;
var TEXT_NODE = 2;

var XLINK_NS = "http://www.w3.org/1999/xlink";
var SVG_NS = "http://www.w3.org/2000/svg";

var EMPTY_OBJECT = {};
var EMPTY_ARRAY = [];

var map = EMPTY_ARRAY.map;
var isArray = Array.isArray;

var merge = function merge(a, b) {
  var target = {};

  for (var i in a) {
    target[i] = a[i];
  }for (var i in b) {
    target[i] = b[i];
  }return target;
};

var resolved = typeof Promise === "function" && Promise.resolve();

var defer = !resolved ? setTimeout : function (cb) {
  return resolved.then(cb);
};

var updateProperty = function updateProperty(element, name, lastValue, nextValue, eventProxy, isSvg) {
  if (name === "key") {} else if (name === "style") {
    for (var i in merge(lastValue, nextValue)) {
      var style = nextValue == null || nextValue[i] == null ? "" : nextValue[i];
      if (i[0] === "-") {
        element[name].setProperty(i, style);
      } else {
        element[name][i] = style;
      }
    }
  } else {
    if (name[0] === "o" && name[1] === "n") {
      name = name.slice(2).toLowerCase();

      if (!element.events) element.events = {};

      element.events[name] = nextValue;

      if (nextValue == null) {
        element.removeEventListener(name, eventProxy);
      } else if (lastValue == null) {
        element.addEventListener(name, eventProxy);
      }
    } else {
      var nullOrFalse = nextValue == null || nextValue === false;

      if (name in element && name !== "list" && name !== "draggable" && name !== "spellcheck" && name !== "translate" && !isSvg) {
        element[name] = nextValue == null ? "" : nextValue;
        if (nullOrFalse) {
          element.removeAttribute(name);
        }
      } else {
        var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ""));
        if (ns) {
          if (nullOrFalse) {
            element.removeAttributeNS(XLINK_NS, name);
          } else {
            element.setAttributeNS(XLINK_NS, name, nextValue);
          }
        } else {
          if (nullOrFalse) {
            element.removeAttribute(name);
          } else {
            element.setAttribute(name, nextValue);
          }
        }
      }
    }
  }
};

var createElement = function createElement(node, lifecycle, eventProxy, isSvg) {
  var element = node.type === TEXT_NODE ? document.createTextNode(node.name) : (isSvg = isSvg || node.name === "svg") ? document.createElementNS(SVG_NS, node.name) : document.createElement(node.name);

  var props = node.props;
  if (props.onCreate) {
    lifecycle.push(function () {
      props.onCreate(element);
    });
  }

  for (var i = 0, length = node.children.length; i < length; i++) {
    element.appendChild(createElement(node.children[i], lifecycle, eventProxy, isSvg));
  }

  for (var name in props) {
    updateProperty(element, name, null, props[name], eventProxy, isSvg);
  }

  return node.element = element;
};

var updateElement = function updateElement(element, lastProps, nextProps, lifecycle, eventProxy, isSvg, isRecycled) {
  for (var name in merge(lastProps, nextProps)) {
    if ((name === "value" || name === "checked" ? element[name] : lastProps[name]) !== nextProps[name]) {
      updateProperty(element, name, lastProps[name], nextProps[name], eventProxy, isSvg);
    }
  }

  var cb = isRecycled ? nextProps.onCreate : nextProps.onUpdate;
  if (cb != null) {
    lifecycle.push(function () {
      cb(element, lastProps);
    });
  }
};

var removeChildren = function removeChildren(node) {
  for (var i = 0, length = node.children.length; i < length; i++) {
    removeChildren(node.children[i]);
  }

  var cb = node.props.onDestroy;
  if (cb != null) {
    cb(node.element);
  }

  return node.element;
};

var removeElement = function removeElement(parent, node) {
  var remove = function remove() {
    parent.removeChild(removeChildren(node));
  };

  var cb = node.props && node.props.onRemove;
  if (cb != null) {
    cb(node.element, remove);
  } else {
    remove();
  }
};

var getKey = function getKey(node) {
  return node == null ? null : node.key;
};

var createKeyMap = function createKeyMap(children, start, end) {
  var out = {};
  var key;
  var node;

  for (; start <= end; start++) {
    if ((key = (node = children[start]).key) != null) {
      out[key] = node;
    }
  }

  return out;
};

var patchElement = function patchElement(parent, element, lastNode, nextNode, lifecycle, eventProxy, isSvg) {
  if (nextNode === lastNode) {} else if (lastNode != null && lastNode.type === TEXT_NODE && nextNode.type === TEXT_NODE) {
    if (lastNode.name !== nextNode.name) {
      element.nodeValue = nextNode.name;
    }
  } else if (lastNode == null || lastNode.name !== nextNode.name) {
    var newElement = parent.insertBefore(createElement(nextNode, lifecycle, eventProxy, isSvg), element);

    if (lastNode != null) removeElement(parent, lastNode);

    element = newElement;
  } else {
    updateElement(element, lastNode.props, nextNode.props, lifecycle, eventProxy, isSvg = isSvg || nextNode.name === "svg", lastNode.type === RECYCLED_NODE);

    var savedNode;
    var childNode;

    var lastKey;
    var lastChildren = lastNode.children;
    var lastChStart = 0;
    var lastChEnd = lastChildren.length - 1;

    var nextKey;
    var nextChildren = nextNode.children;
    var nextChStart = 0;
    var nextChEnd = nextChildren.length - 1;

    while (nextChStart <= nextChEnd && lastChStart <= lastChEnd) {
      lastKey = getKey(lastChildren[lastChStart]);
      nextKey = getKey(nextChildren[nextChStart]);

      if (lastKey == null || lastKey !== nextKey) break;

      patchElement(element, lastChildren[lastChStart].element, lastChildren[lastChStart], nextChildren[nextChStart], lifecycle, eventProxy, isSvg);

      lastChStart++;
      nextChStart++;
    }

    while (nextChStart <= nextChEnd && lastChStart <= lastChEnd) {
      lastKey = getKey(lastChildren[lastChEnd]);
      nextKey = getKey(nextChildren[nextChEnd]);

      if (lastKey == null || lastKey !== nextKey) break;

      patchElement(element, lastChildren[lastChEnd].element, lastChildren[lastChEnd], nextChildren[nextChEnd], lifecycle, eventProxy, isSvg);

      lastChEnd--;
      nextChEnd--;
    }

    if (lastChStart > lastChEnd) {
      while (nextChStart <= nextChEnd) {
        element.insertBefore(createElement(nextChildren[nextChStart++], lifecycle, eventProxy, isSvg), (childNode = lastChildren[lastChStart]) && childNode.element);
      }
    } else if (nextChStart > nextChEnd) {
      while (lastChStart <= lastChEnd) {
        removeElement(element, lastChildren[lastChStart++]);
      }
    } else {
      var lastKeyed = createKeyMap(lastChildren, lastChStart, lastChEnd);
      var nextKeyed = {};

      while (nextChStart <= nextChEnd) {
        lastKey = getKey(childNode = lastChildren[lastChStart]);
        nextKey = getKey(nextChildren[nextChStart]);

        if (nextKeyed[lastKey] || nextKey != null && nextKey === getKey(lastChildren[lastChStart + 1])) {
          if (lastKey == null) {
            removeElement(element, childNode);
          }
          lastChStart++;
          continue;
        }

        if (nextKey == null || lastNode.type === RECYCLED_NODE) {
          if (lastKey == null) {
            patchElement(element, childNode && childNode.element, childNode, nextChildren[nextChStart], lifecycle, eventProxy, isSvg);
            nextChStart++;
          }
          lastChStart++;
        } else {
          if (lastKey === nextKey) {
            patchElement(element, childNode.element, childNode, nextChildren[nextChStart], lifecycle, eventProxy, isSvg);
            nextKeyed[nextKey] = true;
            lastChStart++;
          } else {
            if ((savedNode = lastKeyed[nextKey]) != null) {
              patchElement(element, element.insertBefore(savedNode.element, childNode && childNode.element), savedNode, nextChildren[nextChStart], lifecycle, eventProxy, isSvg);
              nextKeyed[nextKey] = true;
            } else {
              patchElement(element, childNode && childNode.element, null, nextChildren[nextChStart], lifecycle, eventProxy, isSvg);
            }
          }
          nextChStart++;
        }
      }

      while (lastChStart <= lastChEnd) {
        if (getKey(childNode = lastChildren[lastChStart++]) == null) {
          removeElement(element, childNode);
        }
      }

      for (var key in lastKeyed) {
        if (nextKeyed[key] == null) {
          removeElement(element, lastKeyed[key]);
        }
      }
    }
  }

  return nextNode.element = element;
};

var createVNode = function createVNode(name, props, children, element, key, type) {
  return {
    name: name,
    props: props,
    children: children,
    element: element,
    key: key,
    type: type
  };
};

var createTextVNode = function createTextVNode(text, element) {
  return createVNode(text, EMPTY_OBJECT, EMPTY_ARRAY, element, null, TEXT_NODE);
};

var recycleChild = function recycleChild(element) {
  return element.nodeType === 3 // Node.TEXT_NODE
  ? createTextVNode(element.nodeValue, element) : recycleElement(element);
};

var recycleElement = function recycleElement(element) {
  return createVNode(element.nodeName.toLowerCase(), EMPTY_OBJECT, map.call(element.childNodes, recycleChild), element, null, RECYCLED_NODE);
};

var patch = function patch(container, element, lastNode, nextNode, eventProxy) {
  var lifecycle = [];

  element = patchElement(container, element, lastNode, nextNode, lifecycle, eventProxy);

  while (lifecycle.length > 0) {
    lifecycle.pop()();
  }return element;
};

var h = exports.h = function h(name, props) {
  var node;
  var rest = [];
  var children = [];
  var length = arguments.length;

  while (length-- > 2) {
    rest.push(arguments[length]);
  }if ((props = props == null ? {} : props).children != null) {
    if (rest.length <= 0) {
      rest.push(props.children);
    }
    delete props.children;
  }

  while (rest.length > 0) {
    if (isArray(node = rest.pop())) {
      for (length = node.length; length-- > 0;) {
        rest.push(node[length]);
      }
    } else if (node === false || node === true || node == null) {} else {
      children.push((typeof node === "undefined" ? "undefined" : _typeof(node)) === "object" ? node : createTextVNode(node));
    }
  }

  return typeof name === "function" ? name(props, props.children = children) : createVNode(name, props, children, null, props.key, DEFAULT);
};

var cancel = function cancel(sub) {
  sub.cancel();
};

var isSameValue = function isSameValue(a, b) {
  if (a !== b) {
    for (var k in merge(a, b)) {
      if (a[k] !== b[k]) return false;
    }
  }
  return true;
};

var isSameAction = function isSameAction(a, b) {
  return (typeof a === "undefined" ? "undefined" : _typeof(a)) === (typeof b === "undefined" ? "undefined" : _typeof(b)) && isArray(a) && a[0] === b[0] && isSameValue(a[1], b[1]);
};

var restart = function restart(sub, oldSub, dispatch) {
  for (var k in merge(sub, oldSub)) {
    if (k === "cancel") {} else if (sub[k] === oldSub[k] || isSameAction(sub[k], oldSub[k])) {} else {
      cancel(oldSub);
      return start(sub, dispatch);
    }
  }
  return oldSub;
};

var start = function start(sub, dispatch) {
  return merge(sub, {
    cancel: sub.effect(sub, dispatch)
  });
};

var refresh = function refresh(sub, oldSub, dispatch) {
  if (isArray(sub) || isArray(oldSub)) {
    var out = [];
    var subs = isArray(sub) ? sub : [sub];
    var oldSubs = isArray(oldSub) ? oldSub : [oldSub];

    for (var i = 0; i < subs.length || i < oldSubs.length; i++) {
      out.push(refresh(subs[i], oldSubs[i], dispatch));
    }

    return out;
  }

  return sub ? oldSub ? restart(sub, oldSub, dispatch) : start(sub, dispatch) : oldSub ? cancel(oldSub) : oldSub;
};

function app(props) {
  var state;
  var view = props.view;
  var subs = props.subscriptions;
  var container = props.container;
  var element = container.children[0];
  var lastNode = element && recycleElement(element);
  var lastSub = [];
  var updateInProgress = false;

  var setState = function setState(newState) {
    if (state !== newState) {
      state = newState;

      if (!updateInProgress) {
        updateInProgress = true;
        defer(render);
      }
    }
  };

  var dispatch = function dispatch(obj, data) {
    if (obj == null) {} else if (typeof obj === "function") {
      dispatch(obj(state, data));
    } else if (isArray(obj)) {
      if (typeof obj[0] === "function") {
        dispatch(obj[0](state, obj[1], data));
      } else {
        obj[1].effect(obj[1], dispatch, setState(obj[0]));
      }
    } else {
      setState(obj);
    }
  };

  var eventProxy = function eventProxy(event) {
    dispatch(event.currentTarget.events[event.type], event);
  };

  var render = function render() {
    updateInProgress = false;

    if (subs) {
      lastSub = refresh(subs(state), lastSub, dispatch);
    }

    if (view) {
      element = patch(container, element, lastNode, lastNode = view(state), eventProxy);
    }
  };

  dispatch(props.init);
}
},{}],"hyperapp/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assign = assign;
exports.makeRemoveListener = makeRemoveListener;
function assign(source, assignments) {
  var result = {},
      i;
  for (i in source) {
    result[i] = source[i];
  }for (i in assignments) {
    result[i] = assignments[i];
  }return result;
}

function makeRemoveListener(attachTo, dispatch, action, eventName) {
  var handler = dispatch.bind(null, action);
  attachTo.addEventListener(eventName, handler);
  return function () {
    attachTo.removeEventListener(eventName, handler);
  };
}
},{}],"hyperapp/Http.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Http = Http;

var _utils = require("./utils");

function httpEffect(props, dispatch) {
  fetch(props.url, props.options).then(function (response) {
    if (!response.ok) {
      throw response;
    }
    return response;
  }).then(function (response) {
    return response[props.response]();
  }).then(function (result) {
    dispatch(props.action, result);
  }).catch(function (error) {
    dispatch(props.error, error);
  });
}

function Http(props) {
  return (0, _utils.assign)({
    options: {},
    response: "json",
    error: props.action,
    effect: httpEffect
  }, props);
}
},{"./utils":"hyperapp/utils.js"}],"utils/squirrel.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = squirrel;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

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

function squirrel(path, map) {
  var _ref = Array.isArray(path) ? path : path.split('.').reverse(),
      _ref2 = _toArray(_ref),
      key = _ref2[0],
      rest = _ref2.slice(1);

  if (rest.length) map = squirrel(rest, map);
  var F = function F(f) {
    return function (x) {
      return _extends({}, x, _defineProperty({}, key, f(x[key])));
    };
  };
  return map ? function (x) {
    return map(F(x));
  } : F;
}
},{}],"bookmark.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _hav = require("./hyperapp/hav2");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /** @jsx h */


exports.default = function (map) {
  var callbacks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var initial = { data: [] };

  var __bookmark = function __bookmark(state, id, _ref) {
    var target = _ref.target;
    return map(function (s) {
      if (s[id.id]) {
        return _extends({}, s, _defineProperty({}, id.id, undefined));
      } else {
        return _extends({}, s, _defineProperty({}, id.id, new Date()));
      }
    });
  };

  var Bookmark = function Bookmark(state, id, event) {
    return typeof callbacks.onBookmark == "function" ? callbacks.onBookmark(__bookmark(state, id, event)(state), state.f) : __bookmark(state, id, event);
  };

  var icon = function icon(state, id) {
    return state[id] ? "fas fa-bookmark" : "far fa-bookmark";
  };

  var view = function view(_ref2) {
    var state = _ref2.state,
        id = _ref2.id;
    return (0, _hav.h)(
      "div",
      { "class": "bookmark" },
      (0, _hav.h)("i", { "class": icon(state, id),
        onClick: [Bookmark, { id: id }] })
    );
  };

  return { initial: initial, view: view };
};
},{"./hyperapp/hav2":"hyperapp/hav2.js"}],"article.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /** @jsx h */


var _hav = require('./hyperapp/hav2');

var _Http = require('./hyperapp/Http');

var http = _interopRequireWildcard(_Http);

var _squirrel = require('./utils/squirrel');

var _squirrel2 = _interopRequireDefault(_squirrel);

var _bookmark = require('./bookmark');

var _bookmark2 = _interopRequireDefault(_bookmark);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var icon = function icon(itemType, url) {
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
  }
};

var bookmark = (0, _bookmark2.default)((0, _squirrel2.default)('bookmarks'), {});

var Bookmarked = function Bookmarked(state) {
  return _extends({}, state);
}; // TODO save to local storage???

var view = exports.view = function view(_ref) {
  var state = _ref.state,
      item = _ref.item;

  if (item[1].fetched) {
    return (0, _hav.h)(
      'div',
      { 'class': 'li' },
      (0, _hav.h)(
        'div',
        null,
        (0, _hav.h)('i', { 'class': icon(item[1].type, item[1].url) })
      ),
      (0, _hav.h)(
        'div',
        null,
        (0, _hav.h)(
          'a',
          { href: item[1].url, target: '_blank' },
          item[1].title
        )
      ),
      (0, _hav.h)(
        'div',
        { 'class': 'by' },
        item[1].by
      ),
      (0, _hav.h)(
        'div',
        { 'class': 'score' },
        item[1].score
      ),
      (0, _hav.h)(bookmark.view, {
        state: state.bookmarks,
        id: item[0],
        callbacks: { onBookmark: Bookmarked } })
    );
  } else {
    return (0, _hav.h)(
      'div',
      { 'class': 'li loading' },
      'Loading...'
    );
  }
};

//         <div class="bookmark"><i class="far fa-bookmark"></i></div>
},{"./hyperapp/hav2":"hyperapp/hav2.js","./hyperapp/Http":"hyperapp/Http.js","./utils/squirrel":"utils/squirrel.js","./bookmark":"bookmark.js"}],"navbuttons.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.refresh = exports.list = undefined;

var _hav = require("./hyperapp/hav2");

var list = exports.list = function list(_ref) {
    var state = _ref.state,
        tag = _ref.tag,
        title = _ref.title,
        text = _ref.text,
        onSelect = _ref.onSelect;
    return (0, _hav.h)(
        "button",
        {
            title: title,
            "class": state.list == tag ? "selected" : "",
            onClick: [onSelect, { list: tag }],
            disabled: state.fetching },
        text
    );
}; /** @jsx h */
var refresh = exports.refresh = function refresh(_ref2) {
    var state = _ref2.state,
        onRefresh = _ref2.onRefresh;
    return (0, _hav.h)(
        "button",
        {
            title: "refresh",
            "class": "refresh",
            disabled: state.fetching,
            onClick: onRefresh },
        (0, _hav.h)("i", { "class": state.fetching ? "fa fa-sync-alt fa-spin" : "fa fa-sync-alt" })
    );
};
},{"./hyperapp/hav2":"hyperapp/hav2.js"}],"../../../.nvm/versions/node/v8.11.3/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../.nvm/versions/node/v8.11.3/lib/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../.nvm/versions/node/v8.11.3/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"styles/style.css":[function(require,module,exports) {

var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../.nvm/versions/node/v8.11.3/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"index.js":[function(require,module,exports) {
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _index = require('./local_modules/hyperapp/src/index');

var _utils = require('./utils/utils');

var utils = _interopRequireWildcard(_utils);

var _article = require('./article');

var article = _interopRequireWildcard(_article);

var _navbuttons = require('./navbuttons');

var navbutton = _interopRequireWildcard(_navbuttons);

require('./styles/style.css');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /** @jsx h */

var FetchedStories = function FetchedStories(state, data) {
  return FetchArticles(_extends({}, state, {
    articles: utils.toObject(utils.slice(data, state.maxNumArticles))
    // articles: utils.toObject(data)
  }));
};

var FetchStories = function FetchStories(state) {
  return [_extends({}, state, {
    articles: {},
    status: 'fetching stories',
    fetching: true
  }), (0, _index.Http)({
    url: 'https://hacker-news.firebaseio.com/v0/' + state.list + 'stories.json',
    action: FetchedStories
  })];
};

var FetchedArticles = function FetchedArticles(state, data) {
  return _extends({}, state, {
    status: "fetched-all",
    fetching: false,
    articles: _extends({}, state.articles, _defineProperty({}, data.id, {
      fetched: true,
      by: data.by,
      score: data.score,
      title: data.title,
      type: data.type,
      url: data.url
    }))
  });
};

var FetchArticles = function FetchArticles(state) {
  return [_extends({}, state, {
    status: "fetching articles",
    fetching: true
  }), _index.BatchFx.apply(undefined, _toConsumableArray(Object.keys(state.articles).map(function (item) {
    return (0, _index.Http)({
      url: 'https://hacker-news.firebaseio.com/v0/item/' + item + '.json',
      action: FetchedArticles
    });
  })))];
};

var SetList = function SetList(state, _ref) {
  var list = _ref.list;

  console.log("Selected list: ", list);
  return FetchStories(_extends({}, state, {
    list: list
  }));
};

var initialState = {
  articles: {},
  status: "idle",
  autoreload: true,
  list: "new",
  maxNumArticles: 20,
  fetching: false,
  bookmarks: {}
};

(0, _index.app)({
  init: FetchStories(initialState),
  container: document.querySelector("body"),
  view: function view(state) {
    return (0, _index.h)(
      'main',
      null,
      (0, _index.h)(
        'header',
        null,
        'Hacker news Feed in HAv2'
      ),
      (0, _index.h)(
        'nav',
        null,
        (0, _index.h)(
          'div',
          { 'class': 'lists' },
          (0, _index.h)(navbutton.list, { state: state, title: 'New stories', tag: 'new', text: 'New', onSelect: SetList }),
          (0, _index.h)(navbutton.list, { state: state, title: 'Top trending stories', tag: 'top', text: 'Top', onSelect: SetList }),
          (0, _index.h)(navbutton.list, { state: state, title: 'Best stories', tag: 'best', text: 'Best', onSelect: SetList }),
          (0, _index.h)(navbutton.list, { state: state, title: 'Ask HackerNews', tag: 'ask', text: 'AskHN', onSelect: SetList }),
          (0, _index.h)(navbutton.list, { state: state, title: 'Show HackerNews', tag: 'show', text: 'ShowHN', onSelect: SetList }),
          (0, _index.h)(navbutton.list, { state: state, title: 'Jobs list', tag: 'job', text: 'Jobs', onSelect: SetList }),
          (0, _index.h)(navbutton.refresh, { state: state, onRefresh: FetchStories })
        )
      ),
      (0, _index.h)(
        'div',
        null,
        Object.entries(state.articles).map(function (item) {
          return (0, _index.h)(article.view, { state: state, item: item });
        })
      ),
      (0, _index.h)('hr', null),
      (0, _index.h)(
        'pre',
        null,
        JSON.stringify(state, null, 2)
      )
    );
  }
  //  <hr/>
  //      <pre>{JSON.stringify(state, null, 2)}</pre>
  // subscriptions:
  //   (state) => console.log("STATE", state)

});
},{"./local_modules/hyperapp/src/index":"local_modules/hyperapp/src/index.js","./utils/utils":"utils/utils.js","./article":"article.js","./navbuttons":"navbuttons.js","./styles/style.css":"styles/style.css"}],"../../../.nvm/versions/node/v8.11.3/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '37555' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../.nvm/versions/node/v8.11.3/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/index.map