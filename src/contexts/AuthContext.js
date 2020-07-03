import React, { createContext } from 'react'
import AppID from 'ibmcloud-appid-js';

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
    const [errorState, setErrorState] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [activeUser, setActiveUser] = React.useState({});

    const appID = React.useMemo(() => {
        return new AppID()
    }, []);

    (async () => {
        try {
            await appID.init({
                clientId: 'fbc839fc-0e06-48b4-84f0-b3df06110b12',
                discoveryEndpoint: 'https://eu-gb.appid.cloud.ibm.com/oauth/v4/0c36acd7-c6e6-4a7b-a932-989d33105fcf/.well-known/openid-configuration'
            });
        } catch (e) {
            setErrorState(true);
            setErrorMessage(e.message);
        }
    })();

    const loginAction = async () => {
        try {
            const tokens = await appID.signin();
            setErrorState(false);
            setErrorMessage('');
            setIsAuthenticated(true);
            setActiveUser({
                userid: tokens.idTokenPayload.identities[0].id,
                email: tokens.idTokenPayload.email,
                given_name: tokens.idTokenPayload.given_name,
                family_name: tokens.idTokenPayload.family_name,
                accessToken: tokens.accessToken
            })
        } catch (e) {
            setErrorState(true);
            setErrorMessage(e.message);
            setIsAuthenticated(false);
            setActiveUser({});
        }
    };

    const signOut = async () => {
        setErrorState(false);
        setErrorMessage('');
        setIsAuthenticated(false);
        setActiveUser({});
    }

    return (
        <AuthContext.Provider value={{
            errorState,
            errorMessage,
            isAuthenticated,
            activeUser,
            loginAction,
            signOut
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}
