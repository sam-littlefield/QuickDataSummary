import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { idFriendly } from '../helpers'
import routes from '../router/routes'
import { Card, CardContent, Grid, Typography} from '@material-ui/core'
import {Bar} from 'react-chartjs-2';

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

			let unique_YearMonth = [ ...new Set(bill_topics_column.map( billTopic => billTopic['YearMonth'])) ].sort();

			let unique_Year = [ ...new Set(bill_topics_column.map( billTopic => (billTopic['YearMonth']+'').substring(0, 4))) ].sort();
			let countByYear = unique_Year.map( year => bill_topics_column.filter(billTopic => (billTopic['YearMonth']+'').substring(0, 4) == year).length );

			let unique_Month = [ ...new Set(bill_topics_column.map( billTopic => (billTopic['YearMonth']+'').substring(4))) ].sort();
			let countByMonth = unique_Month.map( year => bill_topics_column.filter(billTopic => (billTopic['YearMonth']+'').substring(4) == year).length );


			let unique_1 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['1'])) ];
			let unique_2 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['2'])) ];
			let unique_3 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['3'])) ];
			let unique_4 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['4'])) ];
			let unique_5 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['5'])) ];

			let unique_dates = [ ...new Set(bill_topics_column.map( billTopic => billTopic['date'])) ];

			let year_data = {
				labels: unique_Year,
			  datasets: [
			    {
			      label: 'Activity by Year',
			      fill: false,
			      lineTension: 0.1,
			      backgroundColor: 'rgba(75,192,192,0.4)',
			      borderColor: 'rgba(75,192,192,1)',
			      borderCapStyle: 'butt',
			      borderDash: [],
			      borderDashOffset: 0.0,
			      borderJoinStyle: 'miter',
			      pointBorderColor: 'rgba(75,192,192,1)',
			      pointBackgroundColor: '#fff',
			      pointBorderWidth: 1,
			      pointHoverRadius: 5,
			      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
			      pointHoverBorderColor: 'rgba(220,220,220,1)',
			      pointHoverBorderWidth: 2,
			      pointRadius: 1,
			      pointHitRadius: 10,
			      data: countByYear
			    }
			  ]
			};
			let month_data = {
				labels: unique_Month,
				datasets: [
					{
						label: 'Activity by Month',
						fill: false,
						lineTension: 0.1,
						backgroundColor: 'rgba(75,192,192,0.4)',
						borderColor: 'rgba(75,192,192,1)',
						borderCapStyle: 'butt',
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: 'miter',
						pointBorderColor: 'rgba(75,192,192,1)',
						pointBackgroundColor: '#fff',
						pointBorderWidth: 1,
						pointHoverRadius: 5,
						pointHoverBackgroundColor: 'rgba(75,192,192,1)',
						pointHoverBorderColor: 'rgba(220,220,220,1)',
						pointHoverBorderWidth: 2,
						pointRadius: 1,
						pointHitRadius: 10,
						data: countByMonth
					}
				]
			};

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
						<Grid item xs={6}>
							<Bar data={year_data} options={options}/>
						</Grid>
						<Grid item xs={6}>
							<Bar data={month_data} options={options}/>
						</Grid>

					</Grid>
				</div>
			)
		}
	}
}
export default withRouter(Overview)
