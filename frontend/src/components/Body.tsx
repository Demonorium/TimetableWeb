import * as React from 'react';
import axios from "axios";


export default class Body extends React.Component<any, any>{
    constructor(props: Readonly<any> | any) {
        super(props);
        this.state = {current_state:0 }
    }

    componentDidMount() {
        const params = {
            username: "test_user",
            password: "123"
        }
        axios.get("http://localhost:8080/user/register", {
            params: params
        }).then((response) => {
            this.setState({
                token: response.data,
                current_state: SiteState.PROCESS,
                username: params['username']
            });
        }).catch((response) => {
            this.setState({token: response.data, current_state: SiteState.CRUSH});
        })
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <main>

            </main>
        );
    }

}