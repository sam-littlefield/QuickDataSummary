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
	buildChartTemplate = (title, labels, data) => {
		return {
			labels: labels,
			datasets: [
				{
					label: title,
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
					data: data
				}
			]
		};
	}
	sortNumber = (a, b) => {
		return a - b;
	}
	render(){
		let { bill_topics_column } = this.state

		if ( bill_topics_column ){
			let monthLabels = ['January','February','March','April','May','June','July','August','September','October','November','December']

			let unique_YearMonth = [ ...new Set(bill_topics_column.map( billTopic => billTopic['YearMonth'])) ].sort();

			let uniqueYear = [ ...new Set(bill_topics_column.map( billTopic => Math.trunc((billTopic['YearMonth']+'').substring(0, 4)) )) ].sort(this.sortNumber);
			let countByYear = uniqueYear.map( year => bill_topics_column.filter(billTopic => Math.trunc((billTopic['YearMonth']+'').substring(0, 4)) == year).length );
			let minCountByYear = Math.min.apply(null, countByYear);
    	let maxCountByYear = Math.max.apply(null, countByYear);
			let minCountByYear_label = uniqueYear[countByYear.indexOf(minCountByYear)]
			let maxCountByYear_label = uniqueYear[countByYear.indexOf(maxCountByYear)]

			let uniqueMonth = [ ...new Set(bill_topics_column.map( billTopic => Math.trunc((billTopic['YearMonth']+'').substring(4))) ) ].sort(this.sortNumber);
			let countByMonth = uniqueMonth.map( month => bill_topics_column.filter(billTopic => Math.trunc((billTopic['YearMonth']+'').substring(4)) == month).length );
			let minCountByMonth = Math.min.apply(null, countByMonth);
    	let maxCountByMonth = Math.max.apply(null, countByMonth);
			let minCountByMonth_label = monthLabels[countByMonth.indexOf(minCountByMonth)]
			let maxCountByMonth_label = monthLabels[countByMonth.indexOf(maxCountByMonth)]


			let unique_1 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['1'])) ];
			let unique_2 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['2'])) ];
			let unique_3 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['3'])) ];
			let unique_4 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['4'])) ];
			let unique_5 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['5'])) ];

			let unique_dates = [ ...new Set(bill_topics_column.map( billTopic => billTopic['date'])) ];

			let yearData = this.buildChartTemplate('Activity by Year',uniqueYear, countByYear)
			let monthData = this.buildChartTemplate('Activity by Month', uniqueMonth.map(monthInt => monthLabels[monthInt-1]), countByMonth)

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
							<Bar data={yearData} options={options}/>
						</Grid>
						<Grid item xs={6}>
							<Bar data={monthData} options={options}/>
						</Grid>

					</Grid>
				</div>
			)
		}
	}
}
export default withRouter(Overview)
