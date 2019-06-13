import React from 'react'
import { Paper, Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core'

class SimpleTable extends React.Component {
	constructor(props){
		super(props);
	}
	render(){
    if (this.props.rows && this.props.rows.length > 0 && this.props.columns && this.props.columns.length > 0 ){
  		return (
        <div>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {
                    this.props.columns.map(columnName => (
                      <TableCell key={'th'+columnName.label} align="right">{columnName.label}</TableCell>
                    ))
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  this.props.rows.map(row => (
                    <TableRow key={row.id}>
                      {
                        this.props.columns.map(columnName => (
                          <TableCell key={row.id+'_'+columnName.label} align="left">
                            { '' + row[columnName.value] }
                          </TableCell>
                        ))
                      }
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </Paper>
        </div>
      )
    }
    return null
	}
}
export default SimpleTable
