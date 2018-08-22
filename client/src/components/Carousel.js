import React, { Component } from 'react';
import Slider from 'react-slick';

export default class Carousel extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: false,
      speed: 0,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <div className="carousel">
        <h2>{this.props.title}</h2>
        <Slider {...settings}>
          <div>
            <figure><img src="/images/1.png"></img></figure>
            <figcaption>Hello this is an image I hope you like it</figcaption>
          </div>
          <div>
            <figure><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Stift_Zwettl_Kreuzgang_Nordfl%C3%BCgel_02.JPG/300px-Stift_Zwettl_Kreuzgang_Nordfl%C3%BCgel_02.JPG"></img></figure>
            <figcaption>Here is another one</figcaption>
          </div>
          <div>
            <figure><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Rufous-tailed_flycatcher_%28Myiarchus_validus%29.JPG/300px-Rufous-tailed_flycatcher_%28Myiarchus_validus%29.JPG"></img></figure>
            <figcaption>One more</figcaption>
          </div>
        </Slider>
      </div>
    )
  }
}
