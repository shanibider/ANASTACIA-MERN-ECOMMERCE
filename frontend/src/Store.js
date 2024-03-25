// Store -Manages global state using the React context API and `useReducer`.

// The <StoreProvider> component acts as a provider for the entire application, offering a consistent way to manage and share global state.
// Defines a context (Store) and a provider (StoreProvider) that wraps the entire application. 

import { createContext, useReducer } from 'react';

// Creates a React context named 'Store'. Contexts are used to share values like state and functions throughout a component tree.
// allows components to consume the global state using 'useContext(Store)'. 
export const Store = createContext();

// Sets up the initial state for the context - user info, and cart.
// retrieves user information, shipping address, payment method, and cart items from the local storage.
// If data exists, it is parsed from a string using JSON.parse, 
// otherwise, it defaults to null or an empty object/ array.
const initialState = {              // initializes initialState with an object.
  // Defines first property named userInfo 
  userInfo: 
    localStorage.getItem ('userInfo')       // retrieve the value associated with the key 'userInfo' from the browser's local storage.
      ? JSON.parse (localStorage.getItem ('userInfo')) // If truthy, there is a stored user information string. It uses JSON.parse to convert this string into a JavaScript object.
      : null ,    // If falsy, it means there is no stored user information, and it assigns null to userInfo.
    cart:         // Defines second property named cart
    {
      // Defines a property named shippingAddress within the cart object. and retrieves the value associated with the key 'shippingAddress' from local storage. 
      shippingAddress: localStorage.getItem ('shippingAddress')
        ? JSON.parse(localStorage.getItem ('shippingAddress'))
        : {},
      paymentMethod: localStorage.getItem ('paymentMethod')
        ? localStorage.getItem ('paymentMethod')
        : '',
      cartItems: localStorage.getItem ('cartItems')
        ? JSON.parse(localStorage.getItem ('cartItems'))
        : [],
    },
};



// Implement reducer to handle state changes based on different action types. Include logic for adding/removing items from the cart, user sign-in/sign-out, and saving shipping/payment information.
// The reducer function takes two parameters: state and action. (action to be performed).
function reducer(state, action) {

  // Actions are objects that have a type property, indicating the type of action to perform.
  // The payload property contains additional data needed to perform the action.
  switch (action.type) {

  // checks if the new item already exists in the cart. If yes, it updates the quantity; if not, it adds the new item to the cart.
  // Then updates the local storage with the modified cart items. 



    case 'CART_ADD_ITEM':
      const newItem = action.payload;   // Extracts the payload from the action (info about the item to add)
      const existItem = state.cart.cartItems.find (      // Compares the item's id (_id) with the id of the new item.
        (item) => item._id === newItem._id
      );

      // If the item already exists in the cart, it updates the quantity of the existing item by mapping over the cartItems array and replacing the existing item with the new item.
      // If the item does not exist in the cart, it adds the new item to the cartItems array.
      // The updated cartItems array is then saved to local storage as a JSON string. (so when refreshing the page the items will still be there).
      const cartItems = existItem
        ? state.cart.cartItems.map ( (item) =>
            item._id === existItem._id ? newItem : item )
        : [...state.cart.cartItems, newItem]; //using the spread (...) operator to create a new array by combining the existing items in state.cart.cartItems 
        // (represents the current array of items in the shopping cart), with a new item (newItem). 
      localStorage.setItem ('cartItems', JSON.stringify(cartItems));     // parameters - key is the local storage, and the string value to save in this key
      // Updates the cart property with a new object using the spread operator to maintain its existing properties, and updates the cartItems property with the new array.
      return { ...state, cart: { ...state.cart, cartItems } };


    case 'CART_REMOVE_ITEM': {
      // filter out the cartItems array, if the item id is not equal to the current id, return it otherwise remove it
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      // Saves the updated cartItems array to local storage after converting it to a JSON string.
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      // Updates the state with the new cartItems.
      return { ...state, cart: { ...state.cart, cartItems } };
    }



    // clear cart (after placing the order)
    // here we keep the state of the context, and the cart, and change the cartItems to an empty array.
    // overall result is a new state object where the cart property is updated with a new cart object, and the cartItems property within the cart object is set to an empty array.
    case 'CART_CLEAR':
      //  "{ ...state }": uses the spread operator to create a shallow copy of the existing state object.
      // ", cart: { ...state.cart, cartItems: [] }": updating the 'cart' property in the new state object. 
        // "{ ...state.cart }": uses the spread operator to create a shallow copy of the existing 'cart' object within the state. Again, this ensures that the original cart object is not modified directly.
        // "cartItems: []": updates the 'cartItems' property of the cart object by assigning it a new empty array ([]). This essentially clears the items in the shopping cart.
      return { ...state, cart: { ...state.cart, cartItems: [] } };



    // Handles the action type for user sign-in.
    case 'USER_SIGNIN':
      // Updates the state with the user information received from the payload.
      return { ...state, userInfo: action.payload }; // in return keep the previous state and add the userInfo property to it (based on data we get from backend)
   

    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null, // reset the userInfo property in the new state to null, indicating that there is no user information after signing out.
        cart: {
          //clears the contents.
          cartItems: [],          // cart sets to empty array
          shippingAddress: {},
          paymentMethod: '',
        },
      };


    //save the shipping address in the local storage
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {   
          ...state.cart,                      // shallow copy of current state,
          shippingAddress: action.payload,   // updates 'shippingAddress' within the cart object with the value provided in action.payload, the new shipping address.
        },
      };


    //save payment method in local storage
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    default:
      return state;
  }
}


// The StoreProvider component is responsible for setting up and managing the global state using the 'useReducer' hook.
// It acts as a provider for the entire app, wrapping the app's component tree and supplying the global state to its children.
// It uses the useReducer hook to manage complex state logic in a more organized manner.
// The 'value' object, which includes *state* and *dispatch* function, is then provided to all its child components via the <Store.Provider>. 
// 'props.children' refers to the child components nested within StoreProvider.
export function StoreProvider (props) {

  // 'reducer' is the function that handles state changes based on different action types.
  // 'initialState' is the initial state of the app, which includes user information, shipping address, payment method, and cart items.
  const [state, dispatch] = useReducer (reducer, initialState);

  // The value object contains the state and dispatch function, which are then provided to all child components through the Store context.
  const value = { state, dispatch };
  
  // context provider from React, provides the value (containing state and dispatch) to all its childs through the React context named <Store>.
  // 'props.children' refers to the child components nested within StoreProvider.
  return <Store.Provider value = {value}> {props.children} </Store.Provider>;
}






/*
Separation between <Store> and <Store.Provider>:

Store component represents the React 'context' and serves as a reference to the context itself.
It provides a way for components to consume the global state.
It is created using the createContext function from React.

StoreProvider component is responsible for setting up and managing the global state using the 'useReducer' hook.
//It acts as a provider for the entire app, wrapping the app's component tree and supplying the global state to its children.
It uses the useReducer hook to manage complex state logic in a more organized manner.
The 'value' object, which includes state and dispatch function, is then provided to all its child components via the <Store.Provider>.

examples of how these components are used in the application:
 const { state } = useContext(Store);
  const { userInfo } = state;

  <StoreProvider>
    <App />
  </StoreProvider>;


  
local storage:
stores data with no expiration date, and gets cleared only through JavaScript, or clearing the Browser cache / Locally Stored Data.
localStorage.setItem('key', 'value') - to store data
localStorage.getItem('key') - to retrieve data
in this case, we are storing user info, shipping address, payment method, and cart items in the local storage.

// Example of using LocalStorage:
localStorage.setItem('username', 'JohnDoe');
*/