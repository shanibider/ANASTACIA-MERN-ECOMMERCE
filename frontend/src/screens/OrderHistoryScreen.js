import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import Button from 'react-bootstrap/esm/Button';


// Reducer function to handle state changes based on dispatched actions.
// responds to three action types: 'FETCH_REQUEST', 'FETCH_SUCCESS', and 'FETCH_FAIL'.
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      // Returns a new state object using the spread operator (...state) to retain the existing state properties.
      // Updates the loading property to true to indicate the start of data fetching.
      return { ...state, loading: true };     
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };  // updates state with fetched orders (action.payload) and sets loading to false.
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};



// OrderHistoryScreen component
export default function OrderHistoryScreen() {

  // uses useContext hook to access global state (userInfo) from the Store context.
  const { state } = useContext(Store);
  const { userInfo } = state;

  // useNavigate hook from React Router for programmatic navigation
  const navigate = useNavigate();

  // useReducer hook manages state (loading, error, orders) and dispatches actions using the reducer function.
  // Destructuring to extract values from the array returned by useReducer. { loading, error, orders } represents the state properties, and dispatch represents the dispatch function.
  // useReducer is used to manage state and actions with the reducer function.
  // The initial state is set with loading: true and error: ''.
  const [{ loading, error, orders }, dispatch] = useReducer (reducer, {
    loading: true,
    error: '',
  });



  // useEffect hook for asynchronous data fetching when the component mounts or userInfo changes.
  // It dispatches actions to update the state based on the outcome of the data fetching operation.
  useEffect(() => {
    const fetchData = async () => {   // asynchronous function
      // dispatch is a function provided by useReducer to update the state based on actions.        
      //dispatch PAY_REQUEST to show loading box
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        // Fetching order data from the backend API using axios to make an asynchronous GET request to the backend API endpoint /api/orders/mine.
        // Passes the user's token in the request headers for authorization.
        // Destructures the data property from the response.
        const { data } = await axios.get(
          `/api/orders/mine`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        // Dispatches an action of type 'FETCH_SUCCESS' with the fetched data as the payload.
        // updates the state based on the successful data fetching
        dispatch({ type: 'FETCH_SUCCESS', payload: data });

      } catch (error) {
        // Dispatching FETCH_FAIL action with the error message if data fetching fails
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();      //Invokes the fetchData function immediately when the useEffect runs.
  }, [userInfo]);     // The dependency array [userInfo] specifies that this effect should run when the userInfo variable changes. Ensures that the effect is triggered when there is a change in the userInfo state.






  // Component rendering
  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h1>Order History</h1>


      {/*Conditional rendering- displaying loading indicator while data is being fetched, or error */}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">   {/* Displaying a table with order details */}
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>

            {/* Mapping through orders and rendering table rows */}
            {orders.map ( (order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                {/* Button to navigate to order details page */}
                <td>

              {/* Utilizes the navigate function to create a button for navigating to the details page of each order. */}
                  <Button
                    type="button"
                    variant="light"
                    onClick = { () => {
                      navigate (`/order/${order._id}`);
                    } }
                  >
                    Details
                  </Button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
