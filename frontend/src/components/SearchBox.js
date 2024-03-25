import {React, useState} from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

 

export default function SearchBox() {

    const navigate = useNavigate();
    // using useState to manage the local state of 'query'. This state holds the value of the search query entered by the user.
    
    // using useState for the query state is necessary because it allows the component to keep track of the user's input. With regular functions or variables, you wouldn't have a way to trigger a re-render when the state changes, and the UI wouldn't reflect the current value of the search query. 
    const [query, setQuery] = useState('');

    const submitHandler = (e) => {
      e.preventDefault();   // prevent the page from reloading when the form is submitted.
      // Navigating to the search page with the provided query parameter
      navigate( query ? `/search/?query=${query}` : '/search');
    };
  


    return (
      <Form className="d-flex me-auto" onSubmit = {submitHandler}>
        <InputGroup>

          <FormControl
            type="text"
            name="q"
            id="q"
            onChange = {(e) => setQuery (e.target.value)}
            placeholder="search products..."
            aria-label="Search Products"
            aria-describedby="button-search"
          ></FormControl>

          <Button variant="outline-primary" type="submit" id="button-search">
            <i className="fas fa-search"></i>
          </Button>
        </InputGroup>
      </Form>
    );
}
