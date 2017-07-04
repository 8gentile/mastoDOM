import DOMNodeCollection from './dom_node_collection.js';

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

  return new DOMNodeCollection(array);
}

window.$l = arg => {
  switch(typeof(arg)){
    case "function":
      return registerCallback(arg);
    case "string":
      return getDOMNodes(arg);
    case "object":
      if(arg instanceof HTMLElement){
        return new DOMNodeCollection(arg);
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
  return new DOMNodeCollection(nodes_array);
}

document.addEventListener('DOMContentLoaded', () => {
  docReady = true;
  executeCallbacks.forEach( callback => callback() );
});