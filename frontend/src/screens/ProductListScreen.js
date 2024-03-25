import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { Store } from "../Store";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";


// Admin interface for managing products, providing functionality for viewing, creating, updating, and deleting products, along with pagination and error handling.
// The use of useReducer helps manage complex state logic related to different asynchronous actions.



// manages the state related to the ProductListScreen component, handling loading, error, and success states for fetching products, creating products, and deleting products.
const reducer = (state, action) => {
  switch (action.type) {
    // Signals the start of fetching products. Sets loading to true.
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    
    // Signals successful product fetching, updating products, page, and total pages. Sets loading to false.
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };

    // Sets loading to false.
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    // Signals the start of creating a product.
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };

    // Signals successful product creation.
    case "CREATE_SUCCESS":
      return {
        ...state,
        loadingCreate: false,
      };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    
    // Signals the start of deleting a product.
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };

    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };

    // Resets delete-related states. 
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};






export default function ProductListScreen() {
  
  // State and Dispatch:
  // useReducer manage component state with multiple variables (loading, error, products, pages, loadingCreate, loadingDelete, successDelete).
  // Initializes state with default values (loading: true, error: "").
  const [ {loading, error, products, pages, loadingCreate, loadingDelete, successDelete, }, dispatch, ] = useReducer(reducer, { loading: true, error: "", });

  // Fetching Products:
  // using useNavigate hook to get navigate function, which is used to programmatically navigate to different pages.
  // It also uses the useLocation hook to get the current location, extracts the page parameter from the URL, and initializes the limit state using useState.
  // The page and limit values are used in the HTTP request parameters and for rendering the current page and limit in the UI.

  // Retrieves page number from the URL using useLocation and useParams.

  // 'http://localhost:3000/admin/products?page=2'
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);  // search property contains the query string part of the URL, which is ?page=2 in this app.
  const page = sp.get("page") || 1;        //2

  // useContext access the global state managed by the Store context. The state object contains various pieces of state information relevant to the application.
  // (contains info about the currently logged-in user, including details such as username, role, and authentication token).
  const { state } = useContext(Store);
  const { userInfo } = state;

  // initializes a state variable 'limit'. The default value is set to "all." This state variable used to control the number of items displayed per page or limit in the application.
  const [limit, setLimit] = useState("all");




  // Fetches product data from the server using axios (GET request), dispatches FETCH_SUCCESS or FETCH_FAIL actions based on the result,
  // and configured to re-run whenever there are changes to the specified dependencies (ensures that the component remains up-to-date with the latest data based on the user's actions or changes in the application state).
 // When any of these values change, the useEffect hook will be triggered.
  useEffect(() => {
    const fetchData = async () => {
      try {

        // protected routes - The Authorization header is set to include a bearer token. The server requires a valid user token (userInfo.token) to access protected routes, such as fetching the list of products for an admin.
        const { data } = await axios.get(`/api/products/admin?page=${page}&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );


        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {}
    };
    //fetch data
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [page, limit, userInfo, successDelete]);   // When any of these values change, the useEffect hook will be triggered.
/*
If the user navigates to a different page/ changes the limit/ the user logs in or out,
the effect should run again to fetch data for the new page/ on the new limit/ to ensure the correct user info is used in the request headers.
If a product is deleted, it triggers a reset action (dispatch({ type: "DELETE_RESET" })). If this flag changes, the effect may need to run again to fetch the updated data.
*/



  const handleLimitChange = (e) => {
    setLimit(e.target.value);
  };





  // create a new product by sending a POST request to the server.
  const createHandler = async () => {
    // Uses window.confirm for user confirmation.
    if (window.confirm("Are you sure to create?")) {
      try {
        // Dispatches CREATE_REQUEST on initiation.
        dispatch({ type: "CREATE_REQUEST" });
        const { data } = await axios.post ("/api/products", {}, { headers: { Authorization: `Bearer ${userInfo.token}` },  } );
        toast.success("product created successfully");

        // Dispatch CREATE_SUCCESS on success
        dispatch({ type: "CREATE_SUCCESS" });
        navigate(`/admin/product/${data.product._id}`);
      } 

      // Dispatches CREATE_FAIL on failure.
      catch (err) {
        toast.error(getError(error));
        dispatch({
          type: "CREATE_FAIL",
        });
      }
    }
  };



  // Deleting Products handler:
  const deleteHandler = async (product) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        //  delete a product by sending a DELETE request to the server.
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("product deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } 
      
      catch (err) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };




  return (
    <div>
      <Helmet>
        <title>Product Admin</title>
      </Helmet>
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="col text-end">
          <div>
            <Button
              type="button"
              className="btn-create-product"
              onClick={createHandler}
            >
              Create Product
            </Button>
          </div>
        </Col>
      </Row>


      {/* The && operator is used for conditional rendering. If loadingCreate is true, the component <LoadingBox></LoadingBox> will be rendered.
      If loadingCreate is false, the second part of the expression (<LoadingBox></LoadingBox>) will not be evaluated or rendered.
      Provide visual feedback to the user while an asynchronous operation (like creating or deleting a product) is in progress. */}
      {loadingCreate && <LoadingBox></LoadingBox>}
      {loadingDelete && <LoadingBox></LoadingBox>}


      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>

          <div>
          {/* Allows the user to select the number of products per page with a dropdown. */}
            <select value={limit} onChange={handleLimitChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="all">All</option>
            </select>
          </div>

          {/* Table */}
          <table className="table table-striped">
            <thead className="thead-products">
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
            {/* generate table row for each product in the products array. map iterates over each product, and for each product, it generates a table row with "Edit" and "Delete" buttons.
            Clicking the "Edit" button navigates to the product edit page in the admin section. */}
              {products.map ( (product) => (
                <tr key={product._id}>
                  <td>{product._id.slice(-5)}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>

                  <td>
                    <button
                      type="button"
                      className="btn-edit"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                    >
                      Edit
                    </button>
                    &nbsp;
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => deleteHandler(product)}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>


          {/* Generates pagination links based on the total number of pages, to navigate between pages.
          uses the Link component from 'react-router-dom' */}
          <div>
          {/*React JSX*/}
          {/* Array(pages).keys() - Creates an array with a length equal to the pages variable, and returns an iterator over the indices of the array.
          The spread (...) operator is used to convert the iterator into an array. This creates an array of length pages with values [0, 1, 2, ..., pages-1].
          map() - Iterates over each element in the array and returns a Link component for each element.
                    */}
            {[...Array(pages).keys()].map( (x) => (
              <Link
                //conditionally set to highlight the current page.
                className={x + 1 === Number(page) ? "btn text-bold" : "btn"}  // styling based on whether the current page (x + 1) is equal to the page variable.
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}    // destination URL, x + 1 represents the page number.
              >
                {x + 1}
              </Link>              
            ))}
          </div>

        </>
      )}
    </div>
  );
}
