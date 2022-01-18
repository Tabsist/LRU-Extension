import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
console.log("hi")
const insertionPoint = document.createElement("div");
insertionPoint.id = "insertion-point";
document.body.parentNode.insertBefore(insertionPoint, document.body);

window.onload = function() {
  // setInterval(() => {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      insertionPoint
      // document.getElementById('insertion-point')
    );
  // }, 5000);

}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
