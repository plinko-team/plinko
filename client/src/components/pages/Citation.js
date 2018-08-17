import React from 'react';
import propTypes from 'prop-types';

export default class Citation extends React.Component {
  state = {
    show: false,
  };

  static propTypes = {
    creator: propTypes.string,
    creationDate: propTypes.string,
    title: propTypes.string,
    contributingOrganization: propTypes.string,
    url: propTypes.string,
    comment: propTypes.string,
  };

  static defaultProps = {
    creator: '',
    creationDate: '',
    title: '',
    contributingOrganization: '',
    url: '',
    comment: '',
  };

  showDisplay = () => {
    this.setState({ show: true });
  };

  hideDisplay = () => {
    this.setState({ show: false });
  };

  render() {
    const creator = (
      <tr>
        <th>Author/Creator</th>
        <td>{this.props.creator}</td>
      </tr>
    );
    const creationDate = (
      <tr>
        <th>Creation Date</th>
        <td>{this.props.creationDate}</td>
      </tr>
    );
    const title = (
      <tr>
        <th>Title</th>
        <td>{this.props.title}</td>
      </tr>
    );
    const contributingOrganization = (
      <tr>
        <th>Contributing Organization</th>
        <td>{this.props.contributingOrganization}</td>
      </tr>
    );
    const url = (
      <tr>
        <th>Url</th>
        <td><a href={this.props.url}>{this.props.url}</a></td>
      </tr>
    );
    const comment = (
      <tr>
        <th>Additional Information</th>
        <td>{this.props.comment}</td>
      </tr>
    );
    const display = (
      <div>
        <p>Citation</p>
        <table>
          <tbody>
            {this.props.creator ? creator : undefined}
            {this.props.creationDate ? creationDate : undefined}
            {this.props.title ? title : undefined}
            {this.props.contributingOrganization ? contributingOrganization : undefined}
            {this.props.url ? url : undefined}
            {this.props.comment ? comment : undefined}
          </tbody>
        </table>
      </div>
    );

    return (
      <span
        className='citation'
        onMouseOver={this.showDisplay}
        onMouseLeave={this.hideDisplay}
      >
        <a>&#9733;</a>
        {this.state.show ? display : ''}
      </span>
    );
  }
};