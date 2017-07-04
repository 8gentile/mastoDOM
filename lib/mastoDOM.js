/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// mastoDOM

class DOMNodeCollection {
  constructor(nodes){
    this.nodes = nodes;
  }

  each(el) {
    this.nodes.forEach(el);
  }

   on(eventName, callback) {
    this.each(node => {
      node.addEventListener(eventName, callback);
      const eventKey = `jqliteEvents-${eventName}`;
      if (typeof node[eventKey] === "undefined") {
        node[eventKey] = [];
      }
      node[eventKey].push(callback);
    });
  }

  off(eventName) {
    this.each(node => {
      const eventKey = `jqliteEvents-${eventName}`;
      if (node[eventKey]) {
        node[eventKey].forEach(callback => {
          node.removeEventListener(eventName, callback);
        });
      }
      node[eventKey] = [];
    });
  }

  html(string){
    if(typeof string !== 'string'){
      return this.nodes[0].innerHTML;
    } else {
      this.nodes.forEach( node => {
        node.innerHTML = string;
      });
    }
    return this;
  }

  empty() {
    this.nodes.forEach(node => {
      node.innerHTML = "";
    });

    return this;
  }

  append(arg) {
    this.nodes.forEach(node => {
      if (typeof arg === 'string') {
        node.innerHTML += arg;
      } else {
        arg.forEach( arg2 => {
          node.innerHTML += arg2.outerHTML;
        });
      }
    });

    return this;
  }

  remove() {
    this.nodes.forEach(node => node.parentNode.removeChild(node));
  }

  attr(key, value) {
    if(typeof val === 'string') {
      this.nodes.forEach(node => {
        node.setAttribute(key, value);
      });
    } else {
      return this.nodes[0].getAttribute(key);
    }
  }

  addClass(newClass) {
    this.nodes.forEach( node => node.classList.add(newClass));
  }

  removeClass(target) {
    this.nodes.forEach(node => node.classList.remove(target));
  }

  toggleClass(toggleClass) {
    this.nodes.forEach(node => node.classList.toggle(toggleClass));
  }

  find(selector) {
    let foundNodes = [];
    this.nodes.forEach(node => {
      const nodeList = node.querySelectorAll(selector);
      foundNodes = foundNodes.concat(Array.from(nodeList));
    });
    return new DOMNodeCollection(foundNodes);
  }

  children() {
    let childNodes = [];
    this.each(node => {
      const childNodeList = node.children;
      childNodes = childNodes.concat(Array.from(childNodeList));
    });
    return new DOMNodeCollection(childNodes);
  }

  parent() {
    let parentNodes = [];
    this.each( node => {
      node.parentNode.visited ? parentNodes.push(node.parentNode) : node.parentNode.visited = true;
    });

    parentNodes.forEach( node => node.visited = false);
    return new DOMNodeCollection(parentNodes);
  }


}
/* harmony export (immutable) */ __webpack_exports__["a"] = DOMNodeCollection;
 // end of class

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dom_node_collection_js__ = __webpack_require__(0);


let docReady = false;
const executeCallbacks = [];

function $l (selector) {
  let array = [];
  if (selector instanceof HTMLElement) {
    array = [selector];
  } else {
    let nodeList = document.querySelectorAll(selector);
    array = Array.prototype.slice.call(nodeList);
  }

  return new __WEBPACK_IMPORTED_MODULE_0__dom_node_collection_js__["a" /* default */](array);
}

window.$l = arg => {
  switch(typeof(arg)){
    case "function":
      return registerCallback(arg);
    case "string":
      return getDOMNodes(arg);
    case "object":
      if(arg instanceof HTMLElement){
        return new __WEBPACK_IMPORTED_MODULE_0__dom_node_collection_js__["a" /* default */](arg);
      }
  }
};

const registerCallback = callback => {
  if (!docReady){
    executeCallbacks.push(callback);
  } else {
    callback();
  }
}

const getDOMNodes = selector => {
  const nodes = document.querySelectorAll(selector);
  const nodes_array = Array.from(nodes);
  return new __WEBPACK_IMPORTED_MODULE_0__dom_node_collection_js__["a" /* default */](nodes_array);
}

document.addEventListener('DOMContentLoaded', () => {
  docReady = true;
  executeCallbacks.forEach( callback => callback() );
});

/***/ })
/******/ ]);