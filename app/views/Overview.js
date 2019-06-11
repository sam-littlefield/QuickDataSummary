import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { idFriendly } from '../helpers'
import routes from '../router/routes'
import { Card, CardContent, Grid, Typography} from '@material-ui/core'

class Overview extends React.Component {
	constructor(props){
		super(props);

		this.state = {
				bill_topics_column: [],
		}
		this.getData()
	}
	getData = () => {
		fetch("./data/bill_topics_list.json")
			.then(res => res.json())
			.then(data => this.setState({bill_topics_column:data}))
	}
	render(){
		let { bill_topics_column } = this.state

		if ( bill_topics_column ){

			let unique_YearMonth = [ ...new Set(bill_topics_column.map( billTopic => billTopic['YearMonth'])) ];

			let unique_1 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['1'])) ];
			let unique_2 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['2'])) ];
			let unique_3 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['3'])) ];
			let unique_4 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['4'])) ];
			let unique_5 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['5'])) ];

			let unique_dates = [ ...new Set(bill_topics_column.map( billTopic => billTopic['date'])) ];

			let options = {
				legend:{
					position:'bottom',
				}
			}
			return (
				<div>
					<Grid container spacing={16}>
						<Grid item xs={3}>
							<Typography variant="h6">
								Total records: { bill_topics_column.length }
							</Typography>
						</Grid>
						<Grid item xs={3}>
							<Typography variant="h6">
								Topics: { unique_1.length }
							</Typography>
						</Grid>
						<Grid item xs={3}>
							<Typography variant="h6">
								Year/Months: { unique_YearMonth.length }
							</Typography>
						</Grid>
						<Grid item xs={3}>
							<Typography variant="h6">
								Unique Dates: { unique_dates.length }
							</Typography>
						</Grid>
					</Grid>
				</div>
			)
		}
	}
}
export default withRouter(Overview)
