function createElement(tags, attrs, ...children) {
  return {
    tags,
    attrs,
    children
  }
}

function _render (elem, target) {
  if (typeof elem == 'string') {
    const textNode = document.createTextNode(elem);
    return target.appendChild(textNode);
  }
  const { tags, attrs, children } = elem;
  const val = document.createElement(tags);
  if (attrs) {
    Object.keys(attrs).forEach(key => {
      const value = elem.attrs[key];
      setAttribute(val, key, value);
    })
  }
  children.forEach(element => _render(element, val));
  return target.appendChild(val);
}

function setAttribute(dom, name, value) {
  if (name === 'className') name = 'class';
  if (/on\w+/.test(name)) {
    name = name.toLowerCase();
    dom[name] = value || '';
  } else if (name === 'style') {
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || '';
    } else if (value && typeof value === 'object') {
      for (let name in value) {
        dom.style[name] = typeof value[name] === 'number' ? value[name] + 'px' : value[name];
      }
    }
  } else {
    if (name in dom) {
      dom[name] = value || '';
    }
    if (value) {
      dom.setAttribute(name, value);
    } else {
      dom.removeAttribute(name);
    }
  }
}

export const React = {
  createElement
}

export const ReactDOM = {
  render(el, container) {
    container.innerHTML = '';
    _render(el, container);
  }
}