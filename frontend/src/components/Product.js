import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext, useState } from 'react';
import { Store } from '../Store';



// The Product component receives a 'product' prop containing information about a specific product.
function Product (props) {

  const { product } = props;

  // Extracting cartItems from the global state using useContext
  const { state, dispatch: ctxDispatch } = useContext (Store);
  const { cart: { cartItems },  } = state;

  // State to manage the "Add to Cart" button click animation
  const [isClicked, setIsClicked] = useState (false);

  
// Function to handle adding the product to the cart
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find( (x) => x._id === product._id);

    const quantity = existItem ? existItem.quantity + 1 : 1;

    
    // Fetch product details, including updated quantity, from the server
    const { data } = await axios.get (`/api/products/${item._id}`, { quantity });


    // Check if the product is still in stock
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }

        // Dispatch an action to add the item to the cart
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });



        // Set the state to trigger the "Add to Cart" button click animation
    setIsClicked(true);

        // Reset the animation state after a short delay
    setTimeout(() => {
      setIsClicked(false);
    }, 200);

  };






  // <Card> ussed to display product information.
  return (
    <Card>
          {/* <Link> from react-router-dom used to navigate to the individual product page. */}
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>

      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>

        <Rating rating={product.rating} numReviews={product.numReviews} />

        <Card.Text>${product.price}</Card.Text>

        {/* Conditionally render either a disabled button (if out of stock) or an "Add to Cart" button */}
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (

            // onClick triggers addToCartHandler when the button is clicked
            <Button
            onClick = { () => addToCartHandler (product) }
            // Styling includes a transition effect for visual feedback on button click
            style = { {
              position: 'relative',
              transition: 'transform 200ms ease-out',
              transform: isClicked ? 'scale(0.95)' : 'none',
            } }
          >
            Add to cart
          </Button>

        )}
      </Card.Body>

    </Card>
  );
}

export default Product;