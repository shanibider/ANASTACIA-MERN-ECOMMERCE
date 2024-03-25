import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';

//for protected route- check if user is logged in or not
export default function ProtectedRoute ({ children }) {


  const { state } = useContext(Store);
  const { userInfo } = state;


  //if userInfo exist return 'children' (components/ content passed as children to this component) otherwise navigate user to "/signin" screen
  return userInfo ? children : <Navigate to="/signin" />;
}


/*
Using in the code, it would render <ProfileScreen /> as children in the ProtectedRoute component.

app.js:
     <main>
      ...
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
      ...
      </main>
*/