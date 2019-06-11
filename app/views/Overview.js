import React from 'react'
import { Link } from 'react-router-dom'
import { idFriendly } from '../helpers'
import routes from '../router/routes'
import { Typography } from '@material-ui/core'
import { Card, CardContent} from '@material-ui/core'

import { withRouter } from 'react-router-dom'

class Overview extends React.Component {
	constructor(props){
		super(props);

		this.state = {

		}
	}
	render(){

			return (
				<div>
					Hello
				</div>
			)
		}
	}
}
export default withRouter(Overview)
