import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';    // importing the Bootstrap CSS file into the React application.
import { HelmetProvider } from 'react-helmet-async';
import { StoreProvider } from './Store';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';   // for integrating PayPal scripts into the application.

// Entry point for rendering the React application.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renders the main `App` component wrapped in `StoreProvider`, `HelmetProvider`, and `PayPalScriptProvider`.
//This setup allows to manage the global state of tha app and share it efficiently across different parts of my React component tree.

root.render(
  //<React.StrictMode>

  // `StoreProvider` wraps the entire application - providing global state management through the React context.
  // Context providers in React are used to pass down data to all the components in the tree without having to explicitly pass props at each level.
  // responsible for providing the application with a shared state (state) and a way to update that state (dispatch).
  <StoreProvider>
    <HelmetProvider>
      {/* HelmetProvider and PayPalScriptProvider are also wrapping the application */}
      {/* deferLoading=true because we dont loading paypal in the begining of the application*/}
      <PayPalScriptProvider deferLoading={true}>
        <App />
      </PayPalScriptProvider>
    </HelmetProvider>
  </StoreProvider>
  //</React.StrictMode>
);

// for measuring performance in your app, pass a function, to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();