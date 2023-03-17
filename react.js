function createElement(tags, attrs, ...children) {
  return {
    tags,
    attrs,
    children
  }
}

function _render (elem) {
  if (elem === undefined || elem === null || typeof elem === 'boolean') elem = '';
  if (typeof elem === 'number') elem = String(elem);
  if (typeof elem === 'string') {
    const textNode = document.createTextNode(elem);
    return textNode;
  }
  if (typeof elem.tags === 'function') {
    const component = createComponent(elem.tags, elem.attrs);
    setComponentProps(component, elem.attrs);
    return component.base;
  }
  const { tags, attrs, children } = elem;
  const val = document.createElement(tags);
  if (attrs) {
    Object.keys(attrs).forEach(key => {
      const value = elem.attrs[key];
      setAttribute(val, key, value);
    })
  }
  children.forEach(element => ReactDOM.render(element, val));
  return val;
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

function createComponent(component, props) {
  let inst;
  console.log(props)
  console.log(component)
  if (component.prototype && component.prototype.render) {
    inst = new component(props);
  } else {
    inst = new Component(props);
    inst.constructor = component;
    inst.render = function() {
      return this.constructor(props);
    }
  }
  return inst;
}

function setComponentProps(component, props) {
  if(!component.base) {
    if (component.componentWillMount) component.componentWillMount();
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props);
  }
  component.props = props;
  renderComponent(component);
}

function renderComponent(component) {
  let base;
  const renderer = component.render();

  if(component.base&&component.compontWillUpdate) {
    component.componentWillUpdate();
  }
  base = _render(renderer);

  if(component.base) {
    if(component.componentDidUpdate) {
      component.componentDidUpdate();
    }
  } else if (component.componentDidMount) {
    component.componentDidMount();
  }

  if (component.base && component.base.parentNode) {
    component.base.parentNode.replaceChild(base, component.base);
  }

  component.base = base;
  base._component = component;
}

class Component {
  constructor(props = {}) {
    this.isReactComponent = true;
    this.state = {};
    this.props = props;
  }

  setState(stateChange) {
    Object.assign(this.state, stateChange);
    renderComponent();
  }
}

export const React = {
  createElement,
  Component
}

export const ReactDOM = {
  render(el, container) {
    container.appendChild(_render(el));
  }
}
