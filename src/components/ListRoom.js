import React, {Component} from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, List, ListItem, ListItemText, Container, Button, Grid, TextField, IconButton} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";

class ListRoom extends Component {
    constructor(props) {
        super(props);
        const username = localStorage.getItem("USERNAME") !== undefined ? localStorage.getItem("USERNAME") : ""
        this.state = {room_name : "", room:[], username: username}
        this.onKeyPress = this.onKeyPress.bind(this)
        this.onHandleChange = this.onHandleChange.bind(this)
        this.onCreateRoom = this.onCreateRoom.bind(this)
        this.onHandleJoin = this.onHandleJoin.bind(this)
    }

    onHandleChange(e){
        this.setState({room_name: e.target.value})
    }

    onKeyPress(e){
        if(e.key === 'Enter'){

            axios.post(`http://localhost:8000/create-room`, {room_name:this.state.room_name})
                .then(res => {
                    console.log(res)
                    const room = {name:e.target.value, _id:res.data.data._id}
                    this.setState({room:[...this.state.room, room]})
                    this.setState({room_name: ""})
                })
        }
    }

    onCreateRoom(e){
        if(this.state.room_name !== ""){
            axios.post(`http://localhost:8000/create-room`, {room_name:this.state.room_name})
                .then(res => {
                    console.log(res)
                    const room = {name:this.state.room_name}
                    this.setState({room:[...this.state.room, room]})
                    this.setState({room_name: ""})
                })
        }
    }

    onDeleteItem(e, id){
        console.log(id)
        axios.delete(`http://localhost:8000/rooms/`+id).then(res=>{
            console.log(res)
            this.setState({room: this.state.room.filter(function(room) {
                    console.log(room)
                    return room._id !== id
                })});
        })
    }

    onHandleJoin(e, room_name){
        this.props.history.push({
            pathname:'/room-chat',
        })

        localStorage.setItem("ROOM_NAME", room_name)
    }

    componentDidMount(){
        axios.get(`http://localhost:8000/rooms`)
            .then(res => {
                let data = res.data.data
                for (let dt of data){
                    console.log(dt)
                    let room = {name:dt.room_name, _id:dt._id}
                    this.setState({room:[...this.state.room, room]})
                }
            })
    }


    render() {
        const room = this.state.room;
        return (
            <div>
                <CssBaseline />
                <Container>
                    <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>
                            <List>
                                {room && room.map((item, index)=> (
                                    <ListItem key={index}>
                                       <ListItemText sx={{'width':'50%'}}>{item.name}</ListItemText>  <Button variant="contained" color="success" style={{'marginLeft':'5px'}} onClick={()=>{
                                           this.onHandleJoin(this, item.name)
                                       }}>Join</Button>
                                        <IconButton aria-label="delete" onClick={()=>{
                                            this.onDeleteItem(this, item._id)
                                        }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItem>
                                )) }

                            </List>
                        <Grid container spacing={0}
                              alignItems="center"
                              justifyContent="center"
                              >
                            <Grid>
                                <TextField id="standard-basic" value={this.state.room_name}  label="Please input room name" variant="standard" onKeyDown={this.onKeyPress} onChange={this.onHandleChange} />
                                <Button variant="contained" onClick={this.onCreateRoom} style={{'marginTop' :'10px', 'marginLeft': '10px'}}>Create room</Button>
                            </Grid>
                        </Grid>

                    </Box>
                </Container>
            </div>

        )
    }
}

export default ListRoom;