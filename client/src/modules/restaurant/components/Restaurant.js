import React from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import {
	Button,
	Form,
	FormGroup,
	Input,
	Label,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Restaurant extends React.Component {
	constructor(props) {
		super(props);
		this.restaurant.name = "Test";
	}
	render() {
		<div id="restaurant">
		<h2>{this.restaurant.name()}</h2>
		</div>
	}
}