import React from 'react';
import { Helmet } from 'react-helmet-async';

const HowTo = () => {
  return (
    <div className="how-to">
      <Helmet>
        <title>How To</title>
      </Helmet>

      <title>How to Wear Clothes Tutorial</title>
      <h1 className="title-how-to">How to Wear Clothes</h1>
      <p>
        Wearing clothes is an important part of daily life, and it can be a lot
        of fun too! Here are some tips and ideas for how to wear clothes:
      </p>
      <div className="how-to-methods">
        <h2 className="how-to-title">1. Start with the Basics</h2>
        <p>
          When putting together an outfit, it's important to start with the
          basics. This includes things like a plain t-shirt, a pair of jeans, or
          a simple dress. Once you have the basics in place, you can start to
          add in more interesting pieces.
        </p>
        <h2 className="how-to-title">2. Mix and Match</h2>
        <p>
          Don't be afraid to mix and match different patterns and textures. For
          example, you could wear a striped shirt with a floral skirt, or a
          leather jacket with a silk blouse. Just make sure that the colors and
          patterns complement each other.
        </p>
        <h2 className="how-to-title">3. Accessorize</h2>
        <p>
          Accessories can really make an outfit pop. Try adding a scarf, a
          statement necklace, or a fun pair of earrings to your outfit. Just
          make sure not to overdo it, and keep the rest of your outfit
          relatively simple.
        </p>
        <h2 className="how-to-title">4. Layer Up</h2>
        <p>
          Layering is a great way to add interest to an outfit. Try layering a
          sweater over a collared shirt, or wearing a denim jacket over a dress.
          This can also be practical in colder weather.
        </p>
        <h2 className="how-to-title">5. Be Confident</h2>
        <p>
          At the end of the day, the most important thing is to be confident in
          what you're wearing. Wear clothes that make you feel good, and don't
          worry too much about what other people might think. If you feel good,
          you'll look good too!
        </p>
      </div>
    </div>
  );
};

export default HowTo;
