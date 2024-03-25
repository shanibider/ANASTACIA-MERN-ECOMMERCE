import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutUs = () => {
  return (
    <div className="AboutUsContainer">
      <Helmet>
        <title>About Us</title>
      </Helmet>
      <h1>About Us</h1>
      <div className="AboutUs">
        <p>
          <h6 className="summery">
            We are passionate and highly motivated software developers. We like
            to challenge ourselves, learn, develop and explore existing and new
            fields. We specialize in Full-Stack/ Backend/ Frontend development.
            and highly knowledgeable in- React.js, Node.js,express, JavaScript,
            MongoDB, Java.
          </h6>
        </p>

        <p>
          <h6 className="summery">
            In this project, we demonstrated our programming abilities, and
            gained additional knowledge and experience in this field. We enjoyed
            working in a team and creating this beautiful site, which can be
            used by a wide variety of people.
          </h6>
        </p>
        <ul className="teamList">
          <h3>Meet the Team</h3>

          <li className="person">
            <strong>Shani Bider</strong> - Full Stack Developer
            <br />
            <a href="https://www.linkedin.com/in/shani-bider-0848b8177/">
              View Shani's linkedin
            </a>
            <p className="role">Lead Developer</p>
            <img
              src="https://media.licdn.com/dms/image/D4D03AQGYZLdHyRlnYA/profile-displayphoto-shrink_200_200/0/1683093302504?e=1710979200&v=beta&t=g7Nz4XN9YISaQlxr86kcvJjF7fedSb9A7y-r5_vttJU"
              alt="Shani Bider"
              width="200"
              height="200"
            />
            <br />
            <br></br>
          </li>
          <li className="person">
            <strong>Shira Balali</strong> - Full Stack Developer
            <br />
            <a href="https://www.linkedin.com/in/shira-balali-39917a1b2/">
              View Shira's linkedin
            </a>
            <p className="role">Content Manager</p>
            <img
              src="https://media.licdn.com/dms/image/D4D35AQFItEE6fqeIDA/profile-framedphoto-shrink_200_200/0/1653036155024?e=1706018400&v=beta&t=ZnJni374I0GT-29stT5SM1A6BU8NouPXTjD7xzZoFYI"
              alt="Shira"
              width="200"
              height="200"
            />
            <br />
            <br></br>
          </li>
          <li className="person">
            <strong>Rafael Navon</strong> - Full Stack Developer
            <br />
            <a href="https://www.linkedin.com/in/rafael-navon/">
              View Rafael's linkedin
            </a>
            <p className="role">Lead Designer</p>
            <img
              src="https://media.licdn.com/dms/image/C4E03AQHEw_eJ8c3JMw/profile-displayphoto-shrink_200_200/0/1616965892206?e=1710979200&v=beta&t=S7jDwsGQ_4ixAJCFq3F7XwAd_wxEqYjslpMlOwBJ8yM"
              alt="Refael Navon"
              width="200"
              height="200"
            />
            <br />
            <br></br>
          </li>
          <li className="person">
            <strong>Or Reuven</strong> - Full Stack Developer
            <br />
            <a href="https://www.linkedin.com/in/or-reuven/">
              View Or's linkedin
            </a>
            <p className="role">Founder and CEO</p>
            <img
              src="https://media.licdn.com/dms/image/C5603AQEpgoWEFh_DkQ/profile-displayphoto-shrink_200_200/0/1606381030583?e=1710979200&v=beta&t=1__LCaI8gxAxo6RK4y-xfS08xQuflSL4wWlRCwtBs6Y"
              alt="Or Reuven"
              width="200"
              height="200"
            />
            <br />
            <br></br>
          </li>
        </ul>
      </div>
      <h3>Contact Us</h3>
      <ul className="ContactList">
        <li>Email: contact@anastacia.com</li>
        <li>Phone: (555) 555-5555</li>
        <li>Address: Tel-Aviv, Israel</li>
      </ul>
    </div>
  );
};

export default AboutUs;
