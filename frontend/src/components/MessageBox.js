import React from 'react';
import Alert from 'react-bootstrap/Alert';

// MessageBox component is a wrapper around <Alert>. It allows to easily create alert messages with different styles by specifying the variant prop.
// The actual content of the alert (text or other components) is passed as children to the MessageBox component.

export default function MessageBox (props) {

// what the component will render.
// The variant prop of the Alert component is set based on the variant prop received by <MessageBox>.
// If props.variant is provided, it uses that value; otherwise, it defaults to 'info'. This is a way to customize the style/appearance of the alert.
// {props.children} is a special prop in React that represents the content between the opening and closing tags of the component.
// In this case, it represents the children components or text that are passed inside the MessageBox component. The Alert component will render this content.  

return <Alert variant = {props.variant || 'info'}> {props.children} </Alert>;   // {props.children} is prop that passed inside <MessageBox>...</MessageBox>.
// content placed between the opening and closing tags of the MessageBox component when it's used,
// will be rendered at the location where '{props.children}' is placed within the MessageBox component's definition.


}




/*
Use of <MessageBox> component in <CartScreen> component:

{cartItems.length === 0 ? (
  <MessageBox>
    Cart is empty. <Link to="/">Go Shopping</Link>
  </MessageBox>
) : (
      ...
)}

<MessegaeBox> use {props.children} to display the content passed inside it.
Whatever content is placed between the opening and closing tags of the MessageBox component when it's used will be rendered at the location where '{props.children}' is placed within the MessageBox component's definition.








The concept of {props.children} -

<MessageBox variant="info"> This is the message </MessageBox>

The text "This is the message" between the opening <MessageBox> tag and the closing </MessageBox> tag is referred to as the 'children' of the MessageBox component.

Now, in the implementation of the MessageBox component:
export default function MessageBox (props) {
  return <Alert variant = {props.variant || 'info'}> {props.children} </Alert>;
}

Here, {props.children} is a special React prop that represents the content (children) passed between the opening and closing tags of the MessageBox component.
In this case, it refers to the text or components (like other React elements) passed inside <MessageBox>...</MessageBox>.


So, if you use the MessageBox component like this: <MessageBox variant="info"> This is the message </MessageBox>,
the MessageBox component will render an Alert component with the specified variant (or a default of 'info'), and the content "This is the message" will be placed inside the Alert component.
The Alert component is responsible for rendering the actual message.

*/