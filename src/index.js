
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// import Appp from "./Appp";

ReactDOM.render(
  <BrowserRouter>
    <App />
    {/* <Appp /> */}
  </BrowserRouter>,
  document.getElementById("root"),
);
