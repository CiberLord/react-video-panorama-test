import React from 'react';
// import { Charts } from './Charts';
import { Playground } from './Playground';

function App() {
  const pathname = window.location.pathname;

  // if(pathname === '/charts') {
  //   return <Charts />
  // }

  return <Playground />
}

export default App;
