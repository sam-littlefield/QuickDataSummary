import React from 'react'

import Overview from '../views/Overview'
import Search from '../views/Search'

import { Redirect } from 'react-router'

const NotFound = () => (
	<Redirect to='/overview' />
)

export default [{
	path: '/',
	name: "Overview",
	component: NotFound,
	meta: {
		exact: true
	}
}, {
	path: '/overview',
	name: 'Overview',
	meta: {},
	component: Overview
}]
