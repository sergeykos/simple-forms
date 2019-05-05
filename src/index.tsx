import * as React from 'react';
import { render } from 'react-dom';
import Calculator from './Calculator';
import Feedback from './Feedback';

declare const MODE: 'development' | 'production';

if (MODE === 'production') {
	render(
		<Calculator />,
		document.querySelector('[data-id="666774"]')
	);
}
else {
	render(
		<Calculator />,
		document.getElementById('calculator')
	);

	render(
		<Feedback />,
		document.getElementById('feedback')
	);
}