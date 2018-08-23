import React from 'react';

import Citation from './Citation';
import Aside from './Aside';
import Header from '../Header';
import Carousel from '../Carousel';

const About = () => {
  return (
    <main>
      <Header />



      <div className="main-content">
        <h1>Sample H1 (e.g. Case Study)</h1>
        <p>Paragraph for reference</p>
        <h2>Sample H2 (e.g. 4 Synchronizing Networked Game State)</h2>
        <p>Paragraph for reference</p>
        <h3>Sample H3 (e.g. 4.2 Transmitting the Entire Game State)</h3>
        <p>Paragraph for reference</p>
        <h4>Sample H4 (e.g. 4.2.1 Network Jitter)</h4>
        <p>Paragraph for reference</p>
        <h5>Sample H5 (e.g. Solution: Snapshot Buffer)</h5>
        <p>Paragraph for reference</p>
        <h6>Sample H6 (e.g. Implementation)</h6>
        <p>Paragraph for reference</p>

        <hr></hr>

        <Aside>
          <p>This is a sample Aside component, which may hold any child elements. </p>
        </Aside>

        <Carousel title={"Sample Carousel"}/>

        <br></br>
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
