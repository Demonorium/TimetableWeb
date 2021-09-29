import * as React from 'react';
import axios from "axios";
import { Container } from '@mui/material';
import Day from "./Day";


export default class Body extends React.Component<any, any>{
    constructor(props: Readonly<any> | any) {
        super(props);
        this.state = {sources: null, username: null, password: null}
    }

    componentDidMount() {
        axios.get("http://localhost:8080/api/find/all", {
            params: {'username': this.state.username},
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
            let days: Array<{[key:string] : any}> = this.state.sources['days']
            return (
                <Container maxWidth="sm" component="main">
                    <Day days={days} dayIndex={"Сегодня"} schedule={this.state.sources['defaultSchedule']}/>
                </Container>
            );
        }

    }

}