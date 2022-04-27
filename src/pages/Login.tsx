import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import useAuth from '../helpers/hooks/useAuth';
import { securityActions } from '../redux/actions';

interface LocationState {
    from: {
        pathname: string;
    };
}

function LoginPage() {
    const [inputs, setInputs] = useState({
        username: '',
        email: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const { username, email } = inputs;
    const loggingIn = useSelector((state:any) => state.authentication.loggingIn);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();

    const { setEnvironment } = useAuth();

    // reset login status
    // useEffect(() => { 
    //     dispatch(securityActions.logout()); 
    // }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (username && email) {
            // get return url from location state or default to home page
            const { from } = location.state as LocationState || { from: { pathname: "/" } };
            setEnvironment(username, email, from);
        }
    }

    return (
        <div className="">
            <h2>Login</h2>
            <form name="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" value={username} onChange={handleChange} className={'form-control' + (submitted && !username ? ' is-invalid' : '')} />
                    {submitted && !username &&
                        <div className="invalid-feedback">Username is required</div>
                    }
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={email} onChange={handleChange} className={'form-control' + (submitted && !email ? ' is-invalid' : '')} />
                    {submitted && !email &&
                        <div className="invalid-feedback">Email is required</div>
                    }
                </div>
                <div className="form-group">
                    <button className="btn btn-primary">
                        {loggingIn && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;