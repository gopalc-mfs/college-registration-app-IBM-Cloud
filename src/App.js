import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/navigation/Navbar';
import HomePage from './components/app/HomePage';
import M from 'materialize-css';
import { AuthContextProvider } from './contexts/AuthContext';
import NewStudentInfoPage from './components/app/NewStudentInfoPage';

function App() {
    return (
        <BrowserRouter>
            <div className='App'>
                <AuthContextProvider>
                    <Navbar />
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route exact path="/newstudentinfo" component={NewStudentInfoPage} />
                    </Switch>
                </AuthContextProvider>
            </div>
        </BrowserRouter>
    );
}

export default App;
