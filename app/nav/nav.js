import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { NavLink, withRouter } from 'react-router-dom'

class NavBar extends React.Component {
  handleChange = (event, value) => {
    this.setState({ value })
  }
  render() {
    let linkList = [
  		{
  		  path: '/overview',
  		  name: 'Overview',
  		}
	  ]

    let navTabs = []
    for(let itemIndex in linkList){
      let item = linkList[itemIndex];
      navTabs.push(
        <Tab key={item.name} label={item.name} value={item.path} component={NavLink} to={item.path} />
      )
    }
    const { location } = this.props
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Tabs value={this.props.location.pathname} onChange={this.handleChange}>
              { navTabs }
            </Tabs>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}


export default withRouter(NavBar)
