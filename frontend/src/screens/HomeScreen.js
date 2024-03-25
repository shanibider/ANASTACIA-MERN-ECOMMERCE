import React from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import { useEffect, useReducer } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';


// Common pattern code (useReducer, reducer, useEffect) for handling asynchronous operations, such fetching data. (helps in organizing and handling state logic).
// useReducer hook used with a reducer function to manage state changes based on different actions.
// The useEffect hook is employed to initiate data fetching when the component mounts (create), and the results are then rendered conditionally based on the loading and error states.


// Reducer function to handle state changes based on dispatched actions. responds to 3 action types: 'FETCH_REQUEST', 'FETCH_SUCCESS', and 'FETCH_FAIL'.
// takes the current state and an action as parameters, and returns the new state based on the action's 'type'.
const reducer = (state, action) => {
  switch (action.type) {
    //this case happen when we send an ajax request to backend
    //then we return ...state (keep the previous state values) and only update loading to true (so we can show the loading box)
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    //here we need to update product equal to data that coming from action.payload
    //action.payload contains all data from backend
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};



// HomeScreen component
export default function HomeScreen() {

  // useReducer hook manages state (loading, error, product) and dispatches actions using the reducer function.
  // takes 2 parameters- a reducer function (reducer) and an initial state object ({ product: [], loading: true, error: '' }).
  // The initial state includes product (initially an empty array), loading (initially true), and error (initially an empty string).
  // returns an 'array' with the current state and the 'dispatch function'.
  // 'dispatch' used to call an action and update the state.
  const [{ loading, error, product }, dispatch] = useReducer (logger(reducer), {
    product: [],
    loading: true,
    error: '',
  });
  //(logger used to log the state changes in the console)




  // useEffect hook for asynchronous data fetching when the component mounts.
  // takes 2 parameters - a function and an array of dependencies, and sends an AJAX request to fetch products from the backend.
  useEffect(() => {

    // asynchronous function responsible for fetching data from the backend.
    // Before starting the data fetching process, it dispatches an action of type 'FETCH_REQUEST'.
    // This action is an indicator that the data fetching is in progress, and the UI can show a loading state.
    const fetchData = async () => {
      // Dispatching FETCH_REQUEST action to indicate the start of data fetching
      dispatch({ type: 'FETCH_REQUEST' });            
      try {
        // performs the actual data fetching 
        const result = await axios.get('/api/products');      // response from the server (data.products)
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });      // On success, it dispatches FETCH_SUCCESS with the fetched data.
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });         // On failure, it dispatches FETCH_FAIL with the error message.
      }
    };
    fetchData();

  }, []);     // The empty dependency array [] ensures that the effect runs *only once* when the component mounts.




  // Component rendering
  return (
    <div>
      <Helmet>
        <title>Anastacia</title>
      </Helmet>
      <h1>Features Products</h1>
      <br></br>
      <div className="products">
        {/*Conditional rendering- if loading is true show loading box*/}
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (

          <Row>
          {/* If neither (true/ flase), maps over the product array and renders the Product component for each product. */}
            {product.map ((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>

        )}
      </div>
    </div>
  );
}

/*If we were using useState:
const [products, setProducts] = useState([]);
setProducts(result.data);
*/
