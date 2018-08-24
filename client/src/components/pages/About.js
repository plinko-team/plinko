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
        <Carousel showArrows={true}>
            <div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Jard%C3%ADn_de_Fin%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_17.jpg/300px-Jard%C3%ADn_de_Fin%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_17.jpg" />
                <p className="legend">Legend 1</p>
            </div>
            <div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Jard%C3%ADn_de_Fin%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_17.jpg/300px-Jard%C3%ADn_de_Fin%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_17.jpg" />
                <p className="legend">Legend 2</p>
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
