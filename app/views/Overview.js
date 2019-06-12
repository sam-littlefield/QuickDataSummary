import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { idFriendly } from '../helpers'
import routes from '../router/routes'
import { Card, CardHeader, CardContent, Grid, Typography} from '@material-ui/core'
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
	formatDate = (date) => {
		return date.toLocaleString('en-us', {year: 'numeric', day:'2-digit', month: 'long'})
	}
	formatDateYear = (date) => {
		return Math.trunc(date.toLocaleString('en-us', {year: 'numeric'}))
	}
	formatDateMonth = (date) => {
		return date.toLocaleString('en-us', {month: 'long'})
	}
	formatDateWeekday = (date) => {
		return date.toLocaleString('en-us', {weekday: 'long'})
	}
	sortNumber = (a, b) => {
	  return a - b;
	}
	render(){
		let { bill_topics_column } = this.state

		if ( bill_topics_column && bill_topics_column.length > 0 ){
			let monthLabels = ['January','February','March','April','May','June','July','August','September','October','November','December']
			let weekdayLabels = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

			let sortMonths = (a,b) => {
				return monthLabels.indexOf(a) - monthLabels.indexOf(b)
			}
			let sortWeekdays = (a,b) => {
				return weekdayLabels.indexOf(a) - weekdayLabels.indexOf(b)
			}

			let uniqueYearMonth = [ ...new Set(bill_topics_column.map( billTopic => billTopic['YearMonth'])) ].sort(sortNumber);


			let uniqueYear = [ ...new Set(bill_topics_column.map( billTopic => Math.trunc((billTopic['YearMonth']+'').substring(0, 4)) )) ].sort(this.sortNumber);
			let countByYear = uniqueYear.map( year => bill_topics_column.filter(billTopic => Math.trunc((billTopic['YearMonth']+'').substring(0, 4)) == year).length );
			let minCountByYear = Math.min.apply(null, countByYear);
    	let maxCountByYear = Math.max.apply(null, countByYear);
			let minCountByYear_label = uniqueYear[countByYear.indexOf(minCountByYear)]
			let maxCountByYear_label = uniqueYear[countByYear.indexOf(maxCountByYear)]

			let uniqueYearFormatted = [ ...new Set(bill_topics_column.map( billTopic => this.formatDateYear(new Date(billTopic['date'])) )) ].sort(this.sortNumber);
			let countByYearFormatted = uniqueYearFormatted.map( year => bill_topics_column.filter(billTopic => this.formatDateYear(new Date(billTopic['date'])) == year).length );
			let minCountByYearFormatted = Math.min.apply(null, countByYearFormatted);
    	let maxCountByYearFormatted = Math.max.apply(null, countByYearFormatted);
			let minCountByYearFormatted_label = uniqueYearFormatted[countByYearFormatted.indexOf(minCountByYearFormatted)]
			let maxCountByYearFormatted_label = uniqueYearFormatted[countByYearFormatted.indexOf(maxCountByYearFormatted)]

			let uniqueMonth = [ ...new Set(bill_topics_column.map( billTopic => Math.trunc((billTopic['YearMonth']+'').substring(4))) ) ].sort(this.sortNumber);
			let countByMonth = uniqueMonth.map( month => bill_topics_column.filter(billTopic => Math.trunc((billTopic['YearMonth']+'').substring(4)) == month).length );
			let minCountByMonth = Math.min.apply(null, countByMonth);
    	let maxCountByMonth = Math.max.apply(null, countByMonth);
			let minCountByMonth_label = monthLabels[countByMonth.indexOf(minCountByMonth)]
			let maxCountByMonth_label = monthLabels[countByMonth.indexOf(maxCountByMonth)]

			let uniqueMonthFormatted = [ ...new Set(bill_topics_column.map( billTopic => this.formatDateMonth(new Date(billTopic['date'])) )) ].sort(sortMonths);
			let countByMonthFormatted = uniqueMonthFormatted.map( month => bill_topics_column.filter(billTopic => this.formatDateMonth(new Date(billTopic['date'])) == month).length );
			let minCountByMonthFormatted = Math.min.apply(null, countByMonthFormatted);
    	let maxCountByMonthFormatted = Math.max.apply(null, countByMonthFormatted);
			let minCountByMonthFormatted_label = uniqueMonthFormatted[countByMonthFormatted.indexOf(minCountByMonthFormatted)]
			let maxCountByMonthFormatted_label = uniqueMonthFormatted[countByMonthFormatted.indexOf(maxCountByMonthFormatted)]

			let uniqueWeekdayFormatted = [ ...new Set(bill_topics_column.map( billTopic => this.formatDateWeekday(new Date(billTopic['date'])) )) ].sort(this.sortNumber).sort(sortWeekdays);
			let countByWeekdayFormatted = uniqueWeekdayFormatted.map( weekday => bill_topics_column.filter(billTopic => this.formatDateWeekday(new Date(billTopic['date'])) == weekday).length );
			let minCountByWeekdayFormatted = Math.min.apply(null, countByWeekdayFormatted);
    	let maxCountByWeekdayFormatted = Math.max.apply(null, countByWeekdayFormatted);
			let minCountByWeekdayFormatted_label = uniqueWeekdayFormatted[countByWeekdayFormatted.indexOf(minCountByWeekdayFormatted)]
			let maxCountByWeekdayFormatted_label = uniqueWeekdayFormatted[countByWeekdayFormatted.indexOf(maxCountByWeekdayFormatted)]

			let unique1 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['1'])) ];
			let unique2 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['2'])) ];
			let unique3 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['3'])) ];
			let unique4 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['4'])) ];
			let unique5 = [ ...new Set(bill_topics_column.map( billTopic => billTopic['5'])) ];
			let uniqueTopics = [...new Set([...unique1 ,...unique2, ...unique3, ...unique4, ...unique5,])].sort();

			let uniqueDates = [ ...new Set(bill_topics_column.map( billTopic => billTopic['date'])) ].sort(this.sortNumber);
			let minDate = new Date(Math.min.apply(null, uniqueDates));
    	let maxDate = new Date(Math.max.apply(null, uniqueDates));

			let yearData = this.buildChartTemplate('Activity by Year',uniqueYear, countByYear)
			let yearFormattedData = this.buildChartTemplate('Activity by Year', uniqueYearFormatted, countByYearFormatted)

			let monthData = this.buildChartTemplate('Activity by Month', uniqueMonth.map(monthInt => monthLabels[monthInt-1]), countByMonth)
			let monthFormattedData = this.buildChartTemplate('Activity by Month', uniqueMonthFormatted, countByMonthFormatted)

			let weekdayFormattedData = this.buildChartTemplate('Activity by Weekday', uniqueWeekdayFormatted, countByWeekdayFormatted)

			let options = {
				legend:{
					position:'bottom',
				}
			}
			return (
				<div>
					<Grid container spacing={16}>
						<Grid item xs={8}>
							<Card>
								<CardHeader
									title="General statistics"
								/>
								<CardContent>
									<Grid container spacing={16}>
										<Grid item xs={12}>
											<Typography variant="h6" noWrap>
												This collection of bills contains a total of <b>{bill_topics_column.length} records</b>.
											</Typography>
											<Typography variant="h6" noWrap>
												Records tagged with a totals of <b>{uniqueTopics.length} distinct topics</b>.
											</Typography>
											<Typography variant="h6" noWrap>
												Data spans from <b>{ this.formatDate(minDate) } to { this.formatDate(maxDate) }</b>, covering <b>{uniqueDates.length} unique dates</b> over <b>{countByYear.length} different years</b>.
											</Typography>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
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
		return null
	}
}
export default withRouter(Overview)
