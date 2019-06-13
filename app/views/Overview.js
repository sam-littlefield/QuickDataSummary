import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { idFriendly, deepClone } from '../helpers'
import routes from '../router/routes'
import Loading from '../components/loading'
import { Card, CardHeader, CardContent, Grid, Typography, Select, OutlinedInput, MenuItem, FormControl, FormHelperText, Icon, Button} from '@material-ui/core'
import { Bar } from 'react-chartjs-2';
import { Warning } from '@material-ui/icons';
import FullScreenTableDialog from './FullScreenTableDialog'

const monthLabels = ['January','February','March','April','May','June','July','August','September','October','November','December']
const weekdayLabels = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const columns = [
	{'value':'id','label':'Row Id'},
	{'value':'date','label':'Date'},
	{'value':'FormattedYearMonth','label':'Date to Year Month'},
	{'value':'YearMonth','label':'YearMonth'},
	{'value':'1','label':'First Topic'},
	{'value':'2','label':'Second Topic'},
	{'value':'3','label':'Third Topic'},
	{'value':'4','label':'Fourth Topic'},
	{'value':'5','label':'Fifth Topic'},
]

class Overview extends React.Component {
	constructor(props){
		super(props);

		this.state = {
				bill_topics_column: [],
				selectedTopicLevel: 'all',
				loading: true,
				combineMonthCharts: false,
		}
		this.getData()
	}
	prepareBillTopicsItem = (billTopicItem) => {
		/* Converting date attribute into a date object*/
		billTopicItem['dateObj'] = new Date(billTopicItem['date'])
		return billTopicItem;
	}
	getData = () => {
		fetch("./data/bill_topics_list.json")
			.then(res => res.json())
			.then(data => this.setState({bill_topics_column:data.map(this.prepareBillTopicsItem)},this.buildChartStatistics) )
	}
	buildChartTemplate = (title, labels, data, type, color) => {
		return {
			labels: labels,
		  datasets: [
		    {
		      label: title,
					type: type,
		      fill: false,
		      lineTension: 0.1,
		      backgroundColor: color?color:'rgba(75,192,192,0.4)',
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
	buildYearMonthStatistics = () => {
		let uniqueYearMonth = [ ...new Set(this.state.bill_topics_column.map( billTopic => billTopic['YearMonth'])) ].sort();
		return {
			yearMonth: {
				'uniqueValues': uniqueYearMonth
			}
		}
	}
	buildYearStatistics = () => {
		let uniqueYear = [ ...new Set(this.state.bill_topics_column.map( billTopic => Math.trunc((billTopic['YearMonth']+'').substring(0, 4)) )) ].sort(this.sortNumber);
		let countByYear = uniqueYear.map( year => this.state.bill_topics_column.filter(billTopic => Math.trunc((billTopic['YearMonth']+'').substring(0, 4)) == year).length );
		let minCountByYear = Math.min.apply(null, countByYear);
		let maxCountByYear = Math.max.apply(null, countByYear);
		let minCountByYear_label = uniqueYear[countByYear.indexOf(minCountByYear)]
		let maxCountByYear_label = uniqueYear[countByYear.indexOf(maxCountByYear)]

		let uniqueYearFormatted = [ ...new Set(this.state.bill_topics_column.map( billTopic => this.formatDateYear(billTopic['dateObj']) )) ].sort(this.sortNumber);
		let countByYearFormatted = uniqueYearFormatted.map( year => this.state.bill_topics_column.filter(billTopic => this.formatDateYear(billTopic['dateObj']) == year).length );
		let minCountByYearFormatted = Math.min.apply(null, countByYearFormatted);
		let maxCountByYearFormatted = Math.max.apply(null, countByYearFormatted);
		let minCountByYearFormatted_label = uniqueYearFormatted[countByYearFormatted.indexOf(minCountByYearFormatted)]
		let maxCountByYearFormatted_label = uniqueYearFormatted[countByYearFormatted.indexOf(maxCountByYearFormatted)]
		return {
			year: {
				'uniqueValues': uniqueYear,
				'countByUnique': countByYear,
				'minValue': minCountByYear,
				'maxValue': maxCountByYear,
				'minValue_label': minCountByYear_label,
				'maxValue_label': maxCountByYear_label,
			},
			formattedYear:{
				'uniqueValues': uniqueYearFormatted,
				'countByUnique': countByYearFormatted,
				'minValue': minCountByYearFormatted,
				'maxValue': maxCountByYearFormatted,
				'minValue_label': minCountByYearFormatted_label,
				'maxValue_label': maxCountByYearFormatted_label,
			}
		}
	}
	buildOffendingMonthRecords = () => {
		let offendingRecords = this.state.bill_topics_column.map( billTopic => {
			let formattedYarMonth = this.formatYearMonth(billTopic['dateObj']);
			if ( billTopic['YearMonth'] !=  formattedYarMonth ){
				billTopic['FormattedYearMonth'] = formattedYarMonth
				return billTopic
			}
		});
		return offendingRecords.filter(billTopic=> !!billTopic)

	}
	buildMonthStatistics = () => {
		let sortMonths = (a,b) => {
			return monthLabels.indexOf(a) - monthLabels.indexOf(b)
		}

		let uniqueMonth = [ ...new Set(this.state.bill_topics_column.map( billTopic => Math.trunc((billTopic['YearMonth']+'').substring(4))) ) ].sort(this.sortNumber);
		let countByMonth = uniqueMonth.map( month => this.state.bill_topics_column.filter(billTopic => Math.trunc((billTopic['YearMonth']+'').substring(4)) == month).length );
		let minCountByMonth = Math.min.apply(null, countByMonth);
		let maxCountByMonth = Math.max.apply(null, countByMonth);
		let minCountByMonth_label = monthLabels[countByMonth.indexOf(minCountByMonth)]
		let maxCountByMonth_label = monthLabels[countByMonth.indexOf(maxCountByMonth)]

		let uniqueMonthFormatted = [ ...new Set(this.state.bill_topics_column.map( billTopic => this.formatDateMonth(billTopic['dateObj']) )) ].sort(sortMonths);
		let countByMonthFormatted = uniqueMonthFormatted.map( month => this.state.bill_topics_column.filter(billTopic => this.formatDateMonth(billTopic['dateObj']) == month).length );
		let minCountByMonthFormatted = Math.min.apply(null, countByMonthFormatted);
		let maxCountByMonthFormatted = Math.max.apply(null, countByMonthFormatted);
		let minCountByMonthFormatted_label = uniqueMonthFormatted[countByMonthFormatted.indexOf(minCountByMonthFormatted)]
		let maxCountByMonthFormatted_label = uniqueMonthFormatted[countByMonthFormatted.indexOf(maxCountByMonthFormatted)]
		return {
			month: {
				'uniqueValues': uniqueMonth,
				'countByUnique': countByMonth,
				'minValue': minCountByMonth,
				'maxValue': maxCountByMonth,
				'minValue_label': minCountByMonth_label,
				'maxValue_label': maxCountByMonth_label,
			},
			formattedMonth:{
				'uniqueValues': uniqueMonthFormatted,
				'countByUnique': countByMonthFormatted,
				'minValue': minCountByMonthFormatted,
				'maxValue': maxCountByMonthFormatted,
				'minValue_label': minCountByMonthFormatted_label,
				'maxValue_label': maxCountByMonthFormatted_label,
			}
		}
	}
	buildWeekdayStatistics = () => {
		let sortWeekdays = (a,b) => {
			return weekdayLabels.indexOf(a) - weekdayLabels.indexOf(b)
		}
		let uniqueWeekdayFormatted = [ ...new Set(this.state.bill_topics_column.map( billTopic => this.formatDateWeekday(billTopic['dateObj']) )) ].sort(this.sortNumber).sort(sortWeekdays);
		let countByWeekdayFormatted = uniqueWeekdayFormatted.map( weekday => this.state.bill_topics_column.filter(billTopic => this.formatDateWeekday(billTopic['dateObj']) == weekday).length );
		let minCountByWeekdayFormatted = Math.min.apply(null, countByWeekdayFormatted);
		let maxCountByWeekdayFormatted = Math.max.apply(null, countByWeekdayFormatted);
		let minCountByWeekdayFormatted_label = uniqueWeekdayFormatted[countByWeekdayFormatted.indexOf(minCountByWeekdayFormatted)]
		let maxCountByWeekdayFormatted_label = uniqueWeekdayFormatted[countByWeekdayFormatted.indexOf(maxCountByWeekdayFormatted)]
		return {
			weekday:{
				'uniqueValues': uniqueWeekdayFormatted,
				'countByUnique': countByWeekdayFormatted,
				'minValue': minCountByWeekdayFormatted,
				'maxValue': maxCountByWeekdayFormatted,
				'minValue_label': minCountByWeekdayFormatted_label,
				'maxValue_label': maxCountByWeekdayFormatted_label,
			}
		}
	}
	buildTopicStatistics = () => {
		// largest number first
		let sortTopics = (a,b) => {
			return b.count - a.count
		}
		let getTopicMetrics = (countByTopicArr) => {
			let countByTopic = countByTopicArr.sort(sortTopics)
			return {
				'countByUniqueArr': countByTopic,
				'minValue': countByTopic[countByTopic.length-1].count,
				'maxValue': countByTopic[0].count,
				'minValue_label': countByTopic[countByTopic.length-1].name,
				'maxValue_label': countByTopic[0].name,
			}
		}
		let topicBreakdown = {
				'all': {'countByTopicObj':{}}
		}
		for(let i=1; i< 6; i++){
			let uniqueTopics = [ ...new Set(this.state.bill_topics_column.map( billTopic => billTopic[i])) ].sort();
			let countByTopic = uniqueTopics.forEach( topicName => {
				let count = this.state.bill_topics_column.filter(billTopic => billTopic[i] == topicName).length
				if( !topicBreakdown['all']['countByTopicObj'][topicName] )
					topicBreakdown['all']['countByTopicObj'][topicName] = 0;
				topicBreakdown['all']['countByTopicObj'][topicName] += count;
				if( !topicBreakdown[i] )
					topicBreakdown[i] = {'countByUniqueArr':[]};
				topicBreakdown[i]['countByUniqueArr'].push({'name': topicName, 'count': count});
			});

			topicBreakdown[i] = getTopicMetrics(topicBreakdown[i]['countByUniqueArr'])
		}

		let uniqueTopicsAll = Object.keys(topicBreakdown['all']['countByTopicObj'])
		let countByUniqueArr = uniqueTopicsAll.map( topicName => {
			return {'name': topicName, 'count': topicBreakdown['all']['countByTopicObj'][topicName]}
		})
		topicBreakdown['all'] = getTopicMetrics(countByUniqueArr)

		return {topicBreakdown:topicBreakdown}
	}
	buildDateStatistics = () => {
		let uniqueDates = [ ...new Set(this.state.bill_topics_column.map( billTopic => billTopic['date'])) ].sort(this.sortNumber);
		let minDate = new Date(Math.min.apply(null, uniqueDates));
		let maxDate = new Date(Math.max.apply(null, uniqueDates));
		return {
			'date': {
				'uniqueValues': uniqueDates,
				'minValue': minDate,
				'maxValue': maxDate,
				'minValue_label': this.formatDate(minDate),
				'maxValue_label': this.formatDate(maxDate),
			}
		}
	}
	buildChartStatistics = () => {
			this.setState({
				...this.buildYearMonthStatistics(),
				...this.buildYearStatistics(),
				...this.buildMonthStatistics(),
				...this.buildWeekdayStatistics(),
				...this.buildDateStatistics(),
				...this.buildTopicStatistics(),
				loading: false
			})
	}
	formatYearMonth = (date) => {
		return date.getFullYear()+("0" + (date.getMonth() + 1)).slice(-2)
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
	selectTopicLevel = (event) => {
		this.setState({'selectedTopicLevel': event.target.value})
	}
	render(){
		if ( !this.state.loading ){

			let yearData = this.buildChartTemplate('Bills by Year',this.state.year.uniqueValues, this.state.year.countByUnique,'bar')
			let yearFormattedData = this.buildChartTemplate('Bills by Year', this.state.formattedYear.uniqueValues, this.state.formattedYear.countByUnique,'bar')

			let monthData = this.buildChartTemplate('Bills by Year/Month',  this.state.month.uniqueValues.map(monthInt => monthLabels[monthInt-1]), this.state.month.countByUnique,'bar','rgba(255,99,132,0.4)')
			let monthFormattedData = this.buildChartTemplate('Bills by Date Month', this.state.formattedMonth.uniqueValues, this.state.formattedMonth.countByUnique,'bar')

			let combinedMonthData = deepClone(monthData)
			combinedMonthData['datasets'].push(monthFormattedData['datasets'][0])

			let weekdayFormattedData = this.buildChartTemplate('Bills by Weekday', this.state.weekday.uniqueValues, this.state.weekday.countByUnique,'bar')

			let topicCategory = this.state.selectedTopicLevel
			let countByTopic = this.state.topicBreakdown[topicCategory]['countByUniqueArr']
			let countByTopic_labels = countByTopic.slice( 0, 5).map(countTopic=>countTopic.name)
			let countByTopic_values = countByTopic.slice( 0, 5).map(countTopic=>countTopic.count)
			let topicData = this.buildChartTemplate('Bills by Topic', countByTopic_labels, countByTopic_values)

			let options = {
				legend:{
					position:'bottom',
				}
			}
			return (
				<div>
					<Grid container spacing={16}
								direction="column"
								justify="center"
								alignItems="center">
						<Grid item xs={8}>
							<Card>
								<CardHeader
									title="General statistics"
								/>
								<CardContent>
									<Grid container spacing={16}
												justify="center"
												alignItems="center">
										<Grid item xs={12}>
											<Typography variant="h6" noWrap>
												This collection of bills contains a total of <b>{this.state.bill_topics_column.length} records</b>.
											</Typography>
											<Typography variant="h6" noWrap>
												Records are tagged with a total of <b>{countByTopic.length} distinct topics</b>.
											</Typography>
											<Typography variant="h6" noWrap>
												Data spans from <b>{ this.state.date.minValue_label } to { this.state.date.maxValue_label }</b>, covering <b>{this.state.date.uniqueValues.length} unique dates</b> over <b>{this.state.year.countByUnique.length} different years</b>.
											</Typography>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>

						<Grid item xs={8}>
							<Card>
								<CardHeader
									title="Exploring data by years"
								/>
								<CardContent>
									<Grid container spacing={16}
												justify="center"
												alignItems="center">
										<Grid item xs={8}>
											<Typography variant="h6">
												Looking over the records by year we can see that <b>{this.state.formattedYear.minValue_label} has the least activity</b> with {this.state.formattedYear.minValue} records and <b>{this.state.formattedYear.maxValue_label} has the most activity</b> with {this.state.formattedYear.maxValue} records.
											</Typography>
										</Grid>
										<Grid item xs={8}>
											<Bar data={yearFormattedData} options={options}/>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>

						<Grid item xs={8}>
							<Card>
								<CardHeader
									title="Exploring data by months"
								/>
								<CardContent>
									<Grid container spacing={16}
												justify="center"
												alignItems="center">
										<Grid item xs={8}>
											<Bar data={monthFormattedData} options={options}/>
										</Grid>
										<Grid item xs={4}>
											<Typography variant="h6">
												Breaking down the data further, by month, we see that <b>{this.state.formattedMonth.minValue_label} has the least activity</b> of {this.state.formattedMonth.minValue} records and <b>{this.state.formattedMonth.maxValue_label} has the most activity</b> of {this.state.formattedMonth.maxValue} records.
											</Typography>
										</Grid>

										<Grid item xs={2}></Grid>
										<Grid item xs={8} className='warning-message'>
											<Typography variant="h5">
												<Warning color="error"/>Comparing month information in two columns we find <b>conflicting information</b> is present in the data!<Warning color='error'/>
											</Typography>
										</Grid>
										<Grid item xs={2}></Grid>

										<Grid item xs={8}>
											<Bar data={this.state.combineMonthCharts?combinedMonthData: monthData} options={options}/>
										</Grid>
										<Grid item xs={4}>
											<Typography variant="h6">
												Here we find that <b>{this.state.month.minValue_label} has the least activity</b> with {this.state.month.minValue} records and <b>{this.state.month.maxValue_label} has the most activity</b> with {this.state.month.maxValue} records!
											</Typography>
											<Button
												variant="contained"
												onClick={(e)=>this.setState({combineMonthCharts:!this.state.combineMonthCharts}) }>
												{ this.state.combineMonthCharts? 'Hide comparison':'Show comparison' }
											</Button>
											<FullScreenTableDialog buttonName={"View Inconsistencies"} title={"Inconsistent Dates"} rows={this.buildOffendingMonthRecords()} columns={columns}/>
										</Grid>
									</Grid>

								</CardContent>
							</Card>
						</Grid>

						<Grid item xs={8}>
							<Card>
								<CardHeader
									title="Exploring data by weekday"
								/>
								<CardContent>
									<Grid container spacing={16}
												justify="center"
												alignItems="center">
										<Grid item xs={4}>
											<Typography variant="h6">
												Moving onto data broken down by weekday we can see that <b>{this.state.weekday.minValue_label} has the least total activity</b> at {this.state.weekday.minValue} record{this.state.weekday.minValue>1?'s':null} and <b>{this.state.weekday.maxValue_label} has the most total activity</b> at {this.state.weekday.maxValue} records.
											</Typography>
										</Grid>
										<Grid item xs={8}>
											<Bar data={weekdayFormattedData} options={options}/>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>

						<Grid item xs={8}>
							<Card>
								<CardHeader
									title={`Exploring data by topic assignment (Top 5)`}
								/>
								<CardContent>
									<Grid container spacing={16}
												justify="center"
												alignItems="center">
										<Grid item xs={8}>
											<Bar data={topicData} options={options}/>
										</Grid>
										<Grid item xs={4}>
											<Typography variant="h6">
												We are currently viewing topics by
												<FormControl required className='inlineTextSelectButton'>
													<Select
													 value={this.state.selectedTopicLevel}
													 onChange={this.selectTopicLevel}
													 input={<OutlinedInput labelWidth={10} name="Topic level" id="outlined-age-simple" />}
													>
													 <MenuItem value={'all'}>All</MenuItem>
													 <MenuItem value={'1'}>First</MenuItem>
													 <MenuItem value={'2'}>Second</MenuItem>
													 <MenuItem value={'3'}>Third</MenuItem>
													 <MenuItem value={'4'}>Fourth</MenuItem>
													 <MenuItem value={'5'}>Fifth</MenuItem>
													</Select>
													<FormHelperText>Try adjusting</FormHelperText>
												</FormControl>
												assignment.
											</Typography>
											<Typography variant="h6">
												Looking over the records by topic we can see that <b>{this.state.topicBreakdown[topicCategory]['minValue_label']} has the least total activity</b> of {this.state.topicBreakdown[topicCategory]['minValue']} record{this.state.topicBreakdown[topicCategory]['minValue']>1?'s':null} and <b>{this.state.topicBreakdown[topicCategory]['maxValue_label']} has the most total activity</b> of {this.state.topicBreakdown[topicCategory]['maxValue']} records.
											</Typography>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>

					</Grid>
				</div>
			)
		}
		return (
			<Grid container spacing={16}
						direction="column"
						justify="center"
						alignItems="center">
				<Grid item xs={8} className='warning-message'>
					<Card>
						<CardHeader
							title="Please wait..."
						/>
						<CardContent>
							<Loading/>
							{this.state.bill_topics_column.length > 0 ? `Processing ${this.state.bill_topics_column.length} Records`: null }
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		)
	}
}
export default withRouter(Overview)
