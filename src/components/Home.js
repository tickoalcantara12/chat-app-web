import React, {Component} from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {Grid, TextField, Button} from "@mui/material";
class Home extends Component {

    constructor(props) {
        super(props);
        const username = localStorage.getItem("USERNAME") !== undefined ? localStorage.getItem("USERNAME") :"";
        const room = localStorage.getItem("ROOM_NAME") !== undefined ? localStorage.getItem("ROOM_NAME") :"";
        this.state = {name :username, room:room}
        this.onHandleChange = this.onHandleChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onClick = this.onClick.bind(this);

    }
    onHandleChange(e){
        this.setState({name: e.target.value})
    }

    onKeyPress(e){
        if(e.key === 'Enter'){
            if(this.state.name !== ""){
                localStorage.setItem("USERNAME", e.target.value)
                this.props.history.push({
                    pathname:'/list-room',
                })
            }
        }
    }

    onClick(e){
        if(this.state.name !== ""){

        }
    }

    componentDidMount(){
        if(this.state.name !== ""){
            if(this.state.room !== ""){
                this.props.history.push({pathname:"room-chat"})
            }else {
                this.props.history.push({pathname:'/list-room'})
            }

        }
    }

    render() {
        return (
            <div>
                <CssBaseline />
                <Container>
                    <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}  >
                        <Grid container spacing={0}
                              direction="column"
                              alignItems="center"
                              justifyContent="center"
                              style={{ minHeight: '100vh' }}>
                            <Grid>&nbsp;</Grid>
                            <Grid>
                                <TextField id="standard-basic" value={this.state.name}  label="Please enter name" variant="standard" onKeyDown={this.onKeyPress} onChange={this.onHandleChange} />
                                <Button variant="contained" onClick={this.onClick} style={{'marginTop' :'10px', 'marginLeft': '10px'}}>Submit</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </div>
        )
    }
}

export default Home;