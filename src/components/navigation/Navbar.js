import React, { useContext, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import './Navbar.css'

function Navbar() {
    const { isAuthenticated, signOut } = useContext(AuthContext);
    const history = useHistory();

    const handleSignOutClick = () => {
        if (isAuthenticated) {
            signOut();
            history.push('/');
        }
    }

    return (
        <div className="navbar-fixed">
            <nav className="white">
                <div className="nav-wrapper">
                    <a href="#!" className="brand-logo left indigo-text text-darken-4">Academia College</a>
                    <ul className="right">
                        {!isAuthenticated ? (
                            <Fragment>
                                <li>
                                    <Link to='/' className="grey-text text-darken-4">Sign in</Link>
                                </li>
                            </Fragment>
                        ) : (
                                <Fragment>
                                    <li>
                                        <Link onClick={(e) => handleSignOutClick(e)} to='#' className="grey-text text-darken-4">Sign Out</Link>
                                    </li>
                                </Fragment>
                            )}
                    </ul>
                </div>
            </nav>
        </div >

    )
}

export default Navbar
