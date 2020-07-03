import React, { useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

function HomePage() {
    const {
        errorState,
        errorMessage,
        isAuthenticated,
        loginAction,
    } = useContext(AuthContext);


    if (isAuthenticated) {
        return <Redirect to="/newstudentinfo" />
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col s12 center-align">
                    <div style={{ marginTop: 50 }}>
                        <img src="/images/logo/collegelogo.png" alt="college_logo" />
                        <h4>Please Login/SignUp to<br />register new student details</h4>
                        <Link
                            to="#"
                            className="waves-effect waves-light btn indigo darken-4"
                            style={{ marginTop: 30 }}
                            onClick={loginAction}
                        >Click here to Proceed</Link>
                        {errorState && <div style={{ color: 'red', marginTop: 10 }}>{errorMessage}</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
