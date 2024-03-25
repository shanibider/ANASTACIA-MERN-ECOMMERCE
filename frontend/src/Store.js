// - Manages global state using the React context API and `useReducer`.

// It provides a centralized state (Store) and a set of actions to modify that state.
// The use of local storage ensures persistence of certain data across page refreshes.
// The <StoreProvider> component acts as a provider for the entire application, offering a consistent way to manage and share global state.
// This architecture enables components throughout the app to access and update the global state without the need for prop drilling.

// Defines a context (Store) and a provider (StoreProvider) that wraps the entire application. 

import { createContext, useReducer } from 'react';


/* Creates a React context named 'Store'. Contexts are used to share values like state and functions throughout a component tree. 
 allows components to consume the global state using 'useContext(Store)'. */
export const Store = createContext();

/* Sets up the initial state for the context - inital value for user info.
Retrieves user information, shipping address, payment method, and cart items from the local storage.
If data exists, it is parsed from a string using JSON.parse, 
otherwise, it defaults to null or an empty object/ array. */
const initialState = {              // initializes initialState with an object.
  // Defines first property named userInfo in the initialState object.
  userInfo: 
    localStorage.getItem ('userInfo')       // retrieve the value associated with the key 'userInfo' from the browser's local storage.
      ? JSON.parse (localStorage.getItem ('userInfo')) // If truthy, there is a stored user information string. It uses JSON.parse to convert this string into a JavaScript object.
      : null ,    // If falsy, it means there is no stored user information, and it assigns null to userInfo.

  cart:         // Defines second property named cart in the 'initialState'. It's an object representing the state of the cart
    {
      /* Defines a property named shippingAddress within the cart object.
      Retrieves the value associated with the key 'shippingAddress' from local storage. */
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



// Implement a reducer function to handle state changes based on different action types.
// The state parameter represents the current state of the application, and action represents the action to be performed.
// Actions include adding/removing items from the cart, user sign-in/sign-out, saving shipping/payment information, etc.
function reducer(state, action) {

  // Actions are objects that have a type property indicating the type of action to perform.
  // The type property is a string that indicates the type of action to be executed.
  switch (action.type) {

  // Add to cart    
  // checks if the new item already exists in the cart. If yes, it updates the quantity; if not, it adds the new item to the cart.
  // Then updates the local storage with the modified cart items. 
    case 'CART_ADD_ITEM':
      const newItem = action.payload;   // Extracts the payload from the action (information about the item to add)
      // It compares the item's id (_id) with the id of the new item.
      const existItem = state.cart.cartItems.find (
        (item) => item._id === newItem._id
      );

      // if the item exist (existItem is truthy), map over the cartItems array and replace the item with the same id with the new item
      // Updates the cartItems array based on whether the item already exists.
      // otherwise, it adds the new item to the end of the array.
      // 'state.cart.cartItems': represents the current array of items in the shopping cart.

      const cartItems = existItem
        ? state.cart.cartItems.map ( (item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem]; //using the spread (...) operator to create a new array by combining the existing items in state.cart.cartItems with a new item (newItem). 



      // save the items on the cart in the local storage so when we refreshing the page the items will still be there
      // parameters are- key is the local storage, and the string value to save in this key
      // (JSON.stringify=> convert the cartItems array to a string)
      localStorage.setItem ('cartItems', JSON.stringify(cartItems));    // array is converted to a JSON string 
      // Returns a new state object using the spread (...) operator to maintain the existing state.
      // Updates the cart property with a new object using the spread operator to maintain its existing properties, and updates the cartItems property with the new array.
      return { ...state, cart: { ...state.cart, cartItems } };




    // Handles the action type for removing an item from the cart.
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



    // clear the cart (after placing the order)
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
      return { ...state, userInfo: action.payload }; // return- keep the previos state and add the userInfo property to it (based on the data we get from backend)
   


    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null, // reset the userInfo property in the new state to null, indicating that there is no user information after signing out.
        cart: {
          //clears the contents.
          cartItems: [],          // cart sets to empty array, clearing the items in the shopping cart.
          shippingAddress: {},
          paymentMethod: '',
        },
      };



    //save the shipping address in the local storage
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,                  // shallow copy of the current state,
          shippingAddress: action.payload,     // updates 'shippingAddress' within the cart object with the value provided in action.payload, the new shipping address.
        },
      };



    //save the payment method in the local storage
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






/* 'StoreProvider', a custom provider component that wrap the entire app, and pass global props to children. (acts as a provider for the entire app).
  uses `useReducer` to manage the state and provides the state and dispatch function to its children via the `Store` context.
  'value' object ensures that both the current state and the function to update the state are available to its children.
  Used in index.js
 */
export function StoreProvider (props) {

  // hook used to manage 'state' of the app using the reducer function and an 'initial state'. Returns the current state and a dispatch function to trigger state changes.
  const [state, dispatch] = useReducer (reducer, initialState);

  // creates an object containing the current state and the dispatch function, will be used as the value for Store.Provider.
  const value = { state, dispatch };

  
  // context provider from React, provides the value (containing state and dispatch) to all its childs through the React context named <Store>.
  // 'props.children' refers to the child components nested within StoreProvider.
  return <Store.Provider value = {value}> {props.children} </Store.Provider>;

}






/*
INFO: 

The separation between <Store> and <Store.Provider>:

1. <Store> Component:
- The Store component represents the React 'context' created using createContext(). ("export const Store = createContext()")
- It serves as a reference to the context itself and provides a way for components to consume the global state.

Why is it needed?
This context allows components in the application to access the global state without having to pass props down through multiple levels of the component tree.
It's a way to share state without prop drilling.
For example in each screen we want to access the userInfo, we can use the Store component to access the userInfo from the global state;
  const { state } = useContext (Store);
  const { userInfo } = state;



2. <StoreProvider> Component:
- The StoreProvider component is responsible for setting up and managing the global state using the 'useReducer' hook.
- It acts as a provider for the entire app, wrapping the app's component tree and supplying the global state to its children.

Why is it needed?
The StoreProvider is essential for initializing and maintaining the application's global state.
It uses the useReducer hook to manage complex state logic in a more organized manner. The value object, which includes the state and dispatch function, is then provided to all its child components via the Store.Provider.


In Summary:
- Store is the context itself, allowing components to consume the global state.
- StoreProvider is a component that wraps the entire app, providing a centralized place for state management.
It uses useReducer to handle state changes and ensures that the global state is accessible to all its child components through the Store context.



<Store>:
Used where you want to consume the context (typically in components).
No rendering, just a reference to the context.

<Store.Provider>:
Wraps a portion of your component tree, providing the context values to its descendants.
Renders it's children.











LocalStorage is a web storage solution that allows web applications to store data locally within a user's browser. It provides a simple key-value storage mechanism and is part of the Web Storage API, along with SessionStorage.

Here are some key points about LocalStorage:

1. Key-Value Storage:
   - LocalStorage stores data in key-value pairs.
   - The keys and values are both strings.

2. Usage:
   - To store data in LocalStorage, you use the `localStorage` object in JavaScript.
   - Example of setting a key-value pair: `localStorage.setItem('key', 'value')`.
   - Example of retrieving the value associated with a key: `const value = localStorage.getItem('key')`.

3. Data Type Limitation:
   - While values can be retrieved as strings, it's common to use `JSON.stringify` to convert complex objects into strings when storing them, and `JSON.parse` to convert them back when retrieving.

Here's a simple example of using LocalStorage:

// Store data in LocalStorage
localStorage.setItem('username', 'JohnDoe');

// Retrieve data from LocalStorage
const storedUsername = localStorage.getItem('username');
console.log(storedUsername); // Output: JohnDoe

*/