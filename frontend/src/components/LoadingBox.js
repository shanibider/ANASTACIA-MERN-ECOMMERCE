import React from 'react';
import { Spinner } from 'react-bootstrap';


// 'export default' means that this component can be imported and used in other parts of the app.
export default function LoadingBox() {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden"> Loading... </span>
    </Spinner>
  );
}


/*
use of <loadingBox> in the app:
 {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        ...
      )}

*/