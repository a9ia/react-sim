import { React, ReactDOM } from './react.js'

function component() {
  const element = (
    <div style="font-size:300px" className="who">
      <span>hello world! {new Date().toLocaleTimeString()} </span>
    </div>
  )
  
  console.log(element)
  
  ReactDOM.render(element, document.getElementById('root'))
}
class Welcome extends React.Component {
  render() {
    return <div>Hello, {this.props.name}!</div>
  }
}
const el = <Welcome name="Sara"/>;
console.log(el);
ReactDOM.render(el, document.getElementById('root'));
// component()

// setInterval(component, 1000)

