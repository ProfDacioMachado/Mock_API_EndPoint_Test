import React from 'https://esm.sh/react@18.2.0'
import ReactDOM from 'https://esm.sh/react-dom@18.2.0'

const Title = props => (
  <h1 className="title">{props.text}</h1>
);

function Copy() {
  return <p>You can learn more about React at the documentation site <a href="https://react.dev/">react.dev</a>.</p>;
}

const App = () => {
  return(
    <div className="box">
      <Title text="Hello, World!" />
      <Copy />
    </div>
  );
}

ReactDOM.render(<App />,
document.getElementById("node"))
