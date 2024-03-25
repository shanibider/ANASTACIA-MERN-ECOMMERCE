import jwt from 'jsonwebtoken'; //import jsonwebtoken module

//These functions and middleware are crucial for user authentication and authorization within a web application.
// They provide a secure way to handle user sessions and restrict access to certain routes based on user roles.


// Function to generate a JSON Web Token (JWT) for user authentication.
// takes a user object as a parameter, containing user information.
export const generateToken = (user) => {
  // The jwt.sign function is used to create the token with the user's details.
  return jwt.sign (
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  // The second parameter is the JWT secret, which is used to encrypt the data.
  // The third parameter is an options object specifying the expiration time of the token (30 days in this case).
};




export const isAuth = (req, res, next) => {
// This middleware checks if the request is authenticated by examining the authorization header.
const authorization = req.headers.authorization;
  if (authorization) {
// If the authorization header exists, it extracts the token from the header.
    const token = authorization.slice (7, authorization.length); // Bearer XXXXXX (7 characters)
// The jwt.verify function is used to verify the token's validity and decode its contents.
  jwt.verify (token, process.env.JWT_SECRET, (err, decode) => {
    // If there's no token or an error during verification, a 401 Unauthorized response is sent.
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
        //if the token is valid decode is the decrypted version of the token that include user information
      } else {
      // If the token is valid, the decoded user information is stored in req.user, and the request continues to the next middleware (next()).
      req.user = decode;
        //by calling next we go to the next middleware (expressAsyncHandler function from OrderRoutes)
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};



// This middleware checks if the user is an admin.
export const isAdmin = (req, res, next) => {
  // It verifies that req.user exists and has the isAdmin property set to true.
  if (req.user && req.user.isAdmin) {
    // If the user is an admin, the request proceeds to the next middleware.
    next();
  } else {
    //it means that this token is only for regular user costumers, not for admin
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};
