import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:3000/user/login`, {
            method: 'POST',
            body: JSON.stringify({user:{username: username, passwordhash: password}}),
            headers: new Headers({
                'Content-Type': 'application/json/',
            })
        }).then(
            (response) => response.json()
        ).then((data) => {
            props.updateToken(data.sessionToken)
        })
    }

    return (
        <div>
            <h1>Login</h1>
            <Form>
                <FormGroup onSubmit={handleSubmit}>
                    <Label htmlFor='username'>Username</Label>
                    <Input name='username' onChange={(e) => setUsername(e.target.value)} value={username} />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor='passwordhash'>Password</Label>
                    <Input name='passwordhash' onChange={(e) => setPassword(e.target.value)} value={password} />
                </FormGroup>
                <Button type='submit'>Login</Button>
            </Form>
        </div>
    )
}

export default Login;