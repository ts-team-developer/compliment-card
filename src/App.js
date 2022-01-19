import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import LayoutMain from './layout/LayoutMain'
import LayoutHeader from './layout/LayoutHeader'
import NotFound from './error/NotFound'


class App extends Component {
  constructor(props) {
    super(props) ;
    
    this.state = {
      title : '',
      content : '',
      sub : '',
      menuList : [],
      quarterInfo : {},
      userInfo : {}
    }

    axios.get('/auth/isAuthenticated').then(async ({data}) => {
       if(data == null) {
         window.location.href= '/auth/login/google'; 
       } else {
          this.setState({
            menuList : data.menuList,
            quarterInfo : data.quarterInfo,
            userInfo : {
              name : `${data.name.familyName} ${data.name.givenName}`,
              email : data.email
            }
          })
       }
    });
  }

  render() {
    
                   
    return (
      <React.Fragment>
        
          <Switch>
            {this.state.menuList.map((menu, index) => {
              return (
                <Route exact path={menu.MENU_URL} component = {() => 
                  <LayoutMain url={menu.MENU_URL} menuList = {this.state.menuList}  quarterInfo={this.state.quarterInfo} userInfo={this.state.userInfo} >
                    <LayoutHeader menus={this.state.menuList} quarterInfo={this.state.quarterInfo} userInfo={this.state.userInfo}/>
                  </LayoutMain>
                  }/>)
                }
              )}
              <Route component = {() => <NotFound />}   />
            </Switch>
          </React.Fragment>
    );    
  }
}

export default App;