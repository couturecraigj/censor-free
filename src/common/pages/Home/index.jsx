import React from 'react';
import { Helmet } from 'react-helmet';
// import VideoPlayer from '../../components/VideoPlayer';

// const url = 'public/5bb3b25e69b02ed5724ab2ac/89b705ad-3b00-4b1c-93d6-fc2b5c60ad84/bd48e4ec-6b87-4507-8af6-aca633d88021'.replace(
//   'public/',
//   ''
// );

// TODO: Make it so main pages gives a good overview

export default () => {
  return (
    <div>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div>
        <h1>Welcome to the Anti-Facebook</h1>
        <h2>What does that even mean?</h2>
        <div>Well that means many things</div>
        <ul>
          <li>You do not have to store your data on our servers</li>
          <li>
            We do not design things to keep you angry and arguing all the time
          </li>
          <li>
            We allow you to filter out what you do not want to see instead of
            making the choice of what we want YOU to see.
          </li>
          <li>
            We are transparent as all of our source code is open-source and
            anybody can look at it.
          </li>
          <li>
            {`We even have an option that we are working on that will store all
            your data in a 'Block-Chain' which means we will not be storing any
            of the data in our servers and ultimately means more control for you
            and less for us.`}
          </li>
          <li>
            We are implementing Artificial Intelligence and Filtering for all
            post types to make sure that you can filter out things you do not
            like. Some things that we are trying to filter out currently are:
            <ul>
              <li>Smoking</li>
              <li>Guns</li>
              <li>Violence</li>
              <li>Political Incorrectness</li>
              <li>Etc.</li>
            </ul>
          </li>
          <li>We are paid for through Patreon and Affiliation Links</li>
          <li>We will not sell your data</li>
          <li>
            We use the data that you provide to make YOU smarter by providing
            better understanding of products, companies and yourself. As
            Examples:
            <ul>
              <li>
                We have an area to enter reviews of Products, Companies,
                Compatibility of Products with One another and a Confidence
                Metric regarding whether a Score is to be considered Accurate
              </li>
              <li>
                We allow you to track inventory on our site to better keep track
                of what you own, who you lent it to and what you are looking to
                by
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};
