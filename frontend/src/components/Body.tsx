import * as React from 'react';
import axios from "axios";
import {Box, Container} from '@mui/material';
import Day from "./Day";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import InfiniteDaysSlider from "./InfiniteDaysSlider";
import {connect} from "react-redux";

interface BodyProps {
    sources: Array<{[key: string]: any}>
    store: any,
    container: any
}
class Body extends React.Component<any, any>{
    constructor(props: BodyProps) {
        super(props);
        this.state = {store: props.store, sources: props.sources, container: props.container}
    }

    componentDidMount() {
        const user = this.state.store.user;

        console.log(user.username)
        axios.get("api/find/all", {
            auth: {
                username: user.username,
                password: user.password
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
                <Container sx={{bgcolor:'#FFFFFF'}}  maxWidth="sm" component="main" >
                    <InfiniteDaysSlider containerReference={this.state.container}/>
                </Container>
            );
        }
    }
}

function mapStateToProps(state: any) {
    return {
        store: state
    }
}
export default connect(mapStateToProps)(Body);