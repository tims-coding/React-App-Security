import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';

function HomePage() {
	const user = useSelector((state:any) => state.authentication.user);
	// const dispatch = useDispatch<AppDispatch>();

	// useEffect(() => {
	// 	dispatch(userActions.getAll());
	// }, []);

	return (
		<div className="col-lg-8 offset-lg-2">
			<h1>Hi {user?.username}!</h1>
			<p>You're logged!!</p>
			
			<p>
				<Link to="/login">Logout</Link>
			</p>
		</div>
	);
}

export default HomePage;