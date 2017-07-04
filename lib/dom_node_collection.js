// mastoDOM

export default class DOMNodeCollection {
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


} // end of class