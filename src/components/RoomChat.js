import React, {Component } from "react"
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Box, Grid, Paper, List, ListItem, Typography, ListItemText, Divider, TextField, Fab, IconButton } from "@mui/material"
import { Send as SendIcon, ExitToApp as ExitToAppIcon } from "@mui/icons-material"
import io from "socket.io-client";
import axios from "axios"
let client = null;
class RoomChat extends Component {

    constructor(props) {
        super(props);
        const username = localStorage.getItem("USERNAME") !== undefined ? localStorage.getItem("USERNAME") : "";
        const room_name = localStorage.getItem("ROOM_NAME") !== undefined ? localStorage.getItem("ROOM_NAME") : "";
        this.state = {
            username:username,
            room_name:room_name,
            message:"",
            message_all:[],
        }
        this.onHandleSubmit = this.onHandleSubmit.bind(this)
        this.onHandleChange = this.onHandleChange.bind(this)
        this.onLeaveHandle = this.onLeaveHandle.bind(this)
    }

    onLeaveHandle(){
        localStorage.setItem("USERNAME", "")
        client.disconnect()
        this.props.history.push({pathname:"/"})
    }

    componentDidMount(){
        client = io.connect('ws://127.0.0.1:8000');
        // console.log(this.props)
        client.emit('join room', {username:this.state.username, roomName:this.state.room_name})

        client.on('send data', (data_join)=>{
            // console.log(res)
            axios.get(`http://localhost:8000/chat?room_name=`+this.state.room_name)
                .then(res => {
                    let data = res.data.data
                    for(let item of data){
                        let ms = {content: item.value, user:item.user}
                        this.setState({message_all:[...this.state.message_all, ms]})
                    }
                })

        })

        client.on('chat message', (res)=>{
            let user = res.data.user !== undefined ? res.data.user : "";
            const ms = {content:res.data.value, user:user}
            console.log(ms)
            this.setState({message_all:[...this.state.message_all, ms]})
        })
    }

    onHandleSubmit(e){
        if(e.key === 'Enter'){
            if(this.state.message !== ""){
                client.emit('chat message', {
                    value:this.state.message,
                    user:this.state.username
                })

                this.setState({message:""})
            }
        }
    }

    onHandleChange(e){
        this.setState({message: e.target.value})
    }


    render(){
        const message_all = this.state.message_all;
        const current_user = this.state.username;
        const room_name = this.state.room_name
        return (

            <div>
                <CssBaseline />
                <Container>
                    <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>
                        <Grid container>

                                <Grid item xs={6}>
                                    <Typography variant="h5" className="header-message">Chat {room_name}</Typography>
                                </Grid>
                                <Grid item xs={6} align="right">
                                    <IconButton onClick={this.onLeaveHandle}>
                                        <ExitToAppIcon/>
                                    </IconButton>
                                </Grid>
                        </Grid>
                        <Grid container component={Paper} style={{width: '100%', 'height':'80vh'}}>
                            <Grid item xs={12}>
                                <List style={{height: '70vh',
                                    overflowY: 'auto'}}>
                                    { message_all && message_all.map((item, index)=>(

                                        <ListItem key={index}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <ListItemText align={(current_user === item.user ? "right" : (item.user === "" ? "center" :"left"))} primary={item.content}></ListItemText>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <ListItemText align={current_user === item.user ? "right" : "left"}  secondary={item.user}></ListItemText>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    ))}

                                </List>
                                <Divider />
                                <Grid container style={{padding: '20px'}}>
                                    <Grid item xs={11}>
                                        <TextField id="outlined-basic-email"  value={this.state.message} label="Type Something" fullWidth onKeyDown={this.onHandleSubmit} onChange={this.onHandleChange} />
                                    </Grid>
                                    <Grid item xs={1} align="right">
                                        <Fab color="primary" aria-label="add"><SendIcon /></Fab>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </div>
        )
    }
}

export default RoomChat;