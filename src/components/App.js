import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import LayoutMain from './layout/LayoutMain'
import LayoutHeader from './layout/LayoutHeader'
import NotFound from './error/NotFound'

import Store, { NameContext } from './context/Store'

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
              name : data.name,
              email : data.email
            }
          })
       }
    });
  }

  render() {
    return (
      <React.Fragment>
        <Store >
          <NameContext.Provider value={{ userInfo : this.state.userInfo, quarterInfo : this.state.quarterInfo, menuList : this.state.menuList }}>
          <Switch>
            {this.state.menuList.map((menu, index) => {
              return (
                <Route exact path={menu.MENU_URL} component = {() => 
                  <LayoutMain url={menu.MENU_URL}  >
                    <LayoutHeader />
                  </LayoutMain>
                  }/>)
                }
              )}
              <Route component = {() => <NotFound />} path="/view/notFound"  />
            </Switch>
            </NameContext.Provider>
         </Store>
      </React.Fragment>
    );    
  }
}

export default App;