import * as React from 'react';
import axios from "axios";
import { Container } from '@mui/material';


export default class Body extends React.Component<any, any>{
    constructor(props: Readonly<any> | any) {
        super(props);
        this.state = {sources: null, username: null, password: null}
    }

    componentDidMount() {
        const params = {
            username: "test_user",
            password: "123"
        }
        axios.get("http://localhost:8080/api/find/all", {
            params: params
        }).then((response) => {
            this.setState({
                sources: response.data,
                auth: {
                    username: this.state.username,
                    password: this.state.password
                }
            });
        }).catch((response) => {

        })
    }

    componentWillUnmount() {
    }

    render() {

        return (
            <Container maxWidth="sm" component="main">

            </Container>
        );
    }

}