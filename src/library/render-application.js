import React from 'react';
import {render} from 'react-blessed';
import {Provider} from 'react-redux';

import Application from '../containers/application';

function renderApplication(screen, store) {
	return render(
		<Provider store={store}>
			<Application/>
		</Provider>,
		screen
	);
}

module.exports = renderApplication;
