import React from 'react'
import { useDispatch } from 'react-redux'
import { actions } from './slice';

export default function SignOut() {
	const dispatch = useDispatch();
	dispatch(actions.logout())
	return (
		<>
		</>
	)
}
