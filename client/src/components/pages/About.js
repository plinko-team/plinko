import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

import Citation from './Citation';
import Aside from './Aside';

const About = () => {
  return (
    <main>
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
          <p>This is a sample Aside component, which may hold any child elements.</p>
          <p>Set its styles by selecting <code>aside</code>, or the wired-card's styles by selecting <code>.aside-container wired-card</code> in index.css.</p>
        </Aside>
        <p>Sample paragraph between two Asides</p>
        <Aside emphasized={true}>
          <p>This is an emphasized Aside component. Pass <code>true</code> to the prop <code>emphasized</code>.</p>
          <p>Style the aside itself using <code>.emphasized aside</code>, or the wired-card using <code>.emphasized wired-card</code>. Note that background colors must be set directly on the wired-card.</p>
        </Aside>
  
        <Carousel swipeable={true} emulateTouch={true} transitionTime={0} showThumbs={false} infiniteLoop={true} showStatus={false}>
            <div>
                <img src="https://i.imgur.com/is6kNv7.png" />
                <p className="legend">Legend 1</p>
            </div>
            <div>
                <img src="https://i.imgur.com/is6kNv7.png" />
                <p className="legend">Legend 1</p>
            </div>
        </Carousel>
    
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

        <p>Another example except some citations info is missing.
          <Citation
            creator={'Josh Nelson'}
            title={'A book by Josh'}
            contributingOrganization={'Myself'}
            url={"www.theotherjosh.com"}
          />
          Here is another sentence that happens to come after a citation.
        </p>
      </div>
    </main>
  )
}

export default About;
