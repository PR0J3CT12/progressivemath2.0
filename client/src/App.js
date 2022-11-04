import {useRoutes} from "./routes";
import {BrowserRouter as Router} from 'react-router-dom'
import React, { FC, useMemo } from "react"

function App() {
  const routes = useRoutes()
  return (
      <Router>
            {routes}
      </Router>
  );
}

export default App;
