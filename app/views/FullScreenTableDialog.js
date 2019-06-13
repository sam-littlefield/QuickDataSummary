import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import SimpleTable from './SimpleTable'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class FullScreenTableDialog extends React.Component {
  constructor(props){
		super(props);
    this.state = {
      open: false,
    }
	}
  handleClickOpen = () => {
    this.setState({open:true})
  }
  handleClose = () => {
    this.setState({open:false})
  }
  render(){
    return (
      <div>
        <Button variant="contained" onClick={this.handleClickOpen}>
          {this.props.buttonName}
        </Button>
        <Dialog fullWidth={true} maxWidth='xl' open={this.state.open} onClose={this.handleClose} TransitionComponent={Transition}>
          <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>
            <SimpleTable rows={this.props.rows} columns={this.props.columns}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default FullScreenTableDialog
