import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import { Redirect, Switch } from 'react-router'
import routes from './routes'

import { MuiThemeProvider } from '@material-ui/core/styles';
import SimpleTheme from '../theme';

export default (WrappedComponent) => {
	return class RTR extends React.Component {
		render() {
			return (
				<Router>
      		<MuiThemeProvider theme={SimpleTheme}>
						<WrappedComponent />
						<Switch>
							{routes.map((route) => (
								<Route
									key={route.name}
									path={route.path}
									{...route.meta}
									render={(routeProps) => {
										const Component = route.component;
										return <Component {...route} {...routeProps} />
									}}
								/>
							))}
							<Route render={() => <Redirect to='/soldier/overview' />} />
						</Switch>
					</MuiThemeProvider>
				</Router>
			)
		}
	}
}
