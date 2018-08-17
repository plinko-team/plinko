import React from 'react';

import Citation from './Citation';
import Header from '../Header';

const About = () => {
  return (
    <main>
      <Header />

      <div className="main-content">
        <p>About the project</p>
        <p>Citation will go somehere at the end of this sentence probably
          <Citation 
            creator={'Josh Nelson'}
            creationDate={"December xx, xxxx"}
            title={'A book by Josh'}
            contributingOrganization={'Myself'}
            url={"www.theotherjosh.com"}
            comment={'I guess comment goes here'}
          />
        </p>

        <p>Another example except some citations info is missing
          <Citation 
            creator={'Josh Nelson'}
            title={'A book by Josh'}
            contributingOrganization={'Myself'}
            url={"www.theotherjosh.com"}
          />
        </p>

      </div>

    </main>
  )
}

export default About;