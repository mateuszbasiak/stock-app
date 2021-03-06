import React from 'react';
import MainPage from './pages/MainPage';
import { Switch, Route, Router, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import NotFound from './pages/NotFound';

const history = createBrowserHistory();

const App: React.FC = () => {
	return (
		<Router history={history}>
			<Switch>
				<Route path='/page/:id'>
					<MainPage />
				</Route>
				<Route exact path="/">
					<Redirect to='/page/1' />
				</Route>
				<Route>
					<NotFound />
				</Route>
			</Switch>
		</Router>
	);
};

export default App;
