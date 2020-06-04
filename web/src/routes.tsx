import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/home';
import CreatePoints from './pages/poinsts/Create';

 const Routes = () => {
   return(
     <BrowserRouter>
      <Route component={Home} path="/" exact />
      <Route component={CreatePoints} path="/points-create" />
    </BrowserRouter>
   );
 }

 export default Routes;