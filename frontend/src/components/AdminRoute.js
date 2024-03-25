import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';

// component designed to protect routes that should only be accessible to admin.
// If so, it renders the children; otherwise, it redirects to the sign-in page


//  AdminRoute takes a single prop children. The component intended to be used for rendering certain content only if the user is an admin.
export default function AdminRoute ({ children }) {

  // access the global state from the context named Store. The state variable contains the current state.
  const { state } = useContext (Store);
  const { userInfo } = state;

 // If userInfo exists and isAdmin is true, renders the children (admin content. content wrapped by AdminRoute). Otherwise, it redirects to the "/signin" route using the Navigate component.
 //  (? :) is a shorthand for an if-else statement in javaScript.  
 return userInfo && userInfo.isAdmin ? children : <Navigate to="/signin" />;
}   



/*
children in React - 
In React, the term "children" refers to the components, elements, or content that are passed as the child elements between the opening and closing tags of a React component.
The 'AdminRoute' component is designed to be a wrapper around other components or content.
The content that you want to conditionally render for admin users is passed as the 'children' prop.


Example of how you might use this AdminRoute component:

<AdminRoute>
  <AdminDashboard />      // children
</AdminRoute>

In this example, <AdminDashboard /> is the content that you want to be rendered conditionally for admin users.
It is passed as the 'children' prop to the 'AdminRoute' component.

So, when the 'userInfo' indicates that the user is an admin, the 'children' (in this case, <AdminDashboard />)
will be rendered. If the user is not an admin, the code redirects the user to the "/signin" route.
*/
