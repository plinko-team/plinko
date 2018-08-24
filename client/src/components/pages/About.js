import React from 'react';
import Citation from './Citation';
import Header from '../Header';

import { Carousel } from 'react-responsive-carousel';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

const About = () => {
  return (
    <main>
      <Header />



      <div className="main-content">
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
