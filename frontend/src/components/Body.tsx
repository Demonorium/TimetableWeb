import * as React from 'react';
import axios from "axios";
import {Box, Container} from '@mui/material';
import Day from "./Day";

interface BodyProps {
    username: string
    password: string
    sources: Array<{[key: string]: any}>
}
export default class Body extends React.Component<any, any>{
    constructor(props: BodyProps) {
        super(props);
        this.state = {sources: props.sources, username: props.username, password: props.password}
    }

    componentDidMount() {
        console.log(this.state.username)
        axios.get("api/find/all", {
            auth: {
                username: this.state.username,
                password: this.state.password
            }
        }).then((response) => {
            this.setState({
                sources: response.data
            });
        }).catch((response) => {
        })
    }

    componentWillUnmount() {
    }

    render() {

        if (this.state.sources == null) {
            return (
                <Container maxWidth="sm" component="main">

                </Container>
            );
        } else {
            let days: Array<{[key:string] : any}> = this.state.sources[0]['days']
            return (
                <Box sx={{display:"flex", flexDirection:"column"}}>
                    <Container sx={{bgcolor:'#FFFFFF'}}  maxWidth="sm" component="main">
                        <Day days={days} dayIndex={"Сегодня"} schedule={this.state.sources[0]['defaultSchedule']}/>
                    </Container>
                </Box>
            );
        }

    }

}