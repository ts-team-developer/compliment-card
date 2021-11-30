import React from 'react';


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'title' : '칭찬카드'
    }
  }
  render() {
    return (
      <div className="app-header">
        <div className="header-title">
          {this.state.title} 
        </div>
        Header 입니다.
      </div>
    )
  }
}

export default Header;