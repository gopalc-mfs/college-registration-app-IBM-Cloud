import React, { useContext, useState, useEffect, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import M from 'materialize-css';
import axios from 'axios';

function NewStudentInfoPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [location, setLocation] = useState('');
    const [fathersName, setFathersName] = useState('');
    const [mothersName, setMothersName] = useState('');
    const [hscName, setHscName] = useState('');
    const [hscMarks, setHscMarks] = useState('');
    const [sscName, setSscName] = useState('');
    const [sscMarks, setSscMarks] = useState('');

    const [checkingExistingStatus, setcheckingExistingStatus] = useState(true);
    const [isExistingStudent, setIsExistingStudent] = useState(false);
    const [existingDocId, setExistingDocId] = useState('');
    const [existingDocRev, setExistingDocRev] = useState('');

    const [sendingDataToCloud, setSendingDataToCloud] = useState(false);

    const {
        isAuthenticated,
        activeUser,
        signOut
    } = useContext(AuthContext);

    useEffect(() => {
        // console.log('activeUser', activeUser);
        if (activeUser.email && activeUser.accessToken) {

            var getConfig = {
                headers: {
                    'Authorization': `Bearer ${activeUser.accessToken}`,
                },
                params: {
                    "email": activeUser.email
                }
            };

            axios.get('https://10a7902a.eu-gb.apigw.appdomain.cloud/sim/get-student-info', getConfig)
                .then((resp) => {
                    // console.log("Response received: ", resp);
                    if (resp.data.docs.length > 0) {
                        var doc = resp.data.docs[0];

                        setFirstName(activeUser.given_name);
                        setLastName(activeUser.family_name);
                        setEmail(activeUser.email);
                        setAge(doc.age);
                        setLocation(doc.location);
                        setFathersName(doc.fathersName);
                        setMothersName(doc.mothersName);
                        setHscName(doc.hscName);
                        setHscMarks(doc.hscMarks);
                        setSscName(doc.sscName);
                        setSscMarks(doc.sscMarks);

                        setIsExistingStudent(true);
                        setExistingDocId(doc._id);
                        setExistingDocRev(doc._rev);

                        setcheckingExistingStatus(false);
                    } else {
                        setFirstName(activeUser.given_name);
                        setLastName(activeUser.family_name);
                        setEmail(activeUser.email);
                        setcheckingExistingStatus(false);
                    }
                })
                .catch((err) => {
                    // console.log("AXIOS ERROR: ", err);
                    M.toast({ html: `<b>AXIOS ERROR: ${err}</b>`, classes: 'red darken-1 ' });
                })
        }
    }, [activeUser])

    if (!isAuthenticated) {
        return <Redirect to="/" />
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (!(age && location && fathersName && mothersName
            && hscName && hscMarks && sscName && sscMarks)) {
            M.toast({ html: '<b>All values are required to proceed.</b>', classes: 'red darken-1 ' });
            return;
        }

        if (parseInt(age) <= 0) {
            M.toast({ html: '<b>Age is invalid.</b>', classes: 'red darken-1 ' });
            return;
        }
        if (parseFloat(hscMarks) <= 0) {
            M.toast({ html: '<b>Age is invalid.</b>', classes: 'red darken-1 ' });
            return;
        }
        if (parseFloat(sscMarks) <= 0) {
            M.toast({ html: '<b>Age is invalid.</b>', classes: 'red darken-1 ' });
            return;
        }

        setSendingDataToCloud(true);

        if (isExistingStudent) {
            updateExistingStudentInfo();
        } else {
            submitNewStudentInfo();
        }
    }

    const submitNewStudentInfo = () => {
        let data = {
            "userid": activeUser.userid,
            "firstName": activeUser.given_name,
            "lastName": activeUser.family_name,
            "email": activeUser.email,
            "age": age,
            "location": location,
            "fathersName": fathersName,
            "mothersName": mothersName,
            "hscName": hscName,
            "hscMarks": hscMarks,
            "sscName": sscName,
            "sscMarks": sscMarks
        }

        let postConfig = {
            headers: {
                'Authorization': `Bearer ${activeUser.accessToken}`
            }
        };

        axios.post('https://10a7902a.eu-gb.apigw.appdomain.cloud/sim/post-student-info', data, postConfig)
            .then((resp) => {
                setSendingDataToCloud(false);
                if (resp.data.error) {
                    M.toast({ html: `<b>${resp.data.error}</b>`, classes: 'red darken-1 ' });
                } else if (resp.data.id) {
                    M.toast({ html: `<b>Thank you for your input.<br />Data updated successfully</b>`, classes: 'green darken-1 ' });
                    signOut();
                }
            })
            .catch((err) => {
                // console.log("AXIOS ERROR: ", err);
                M.toast({ html: `<b>AXIOS ERROR: ${err}</b>`, classes: 'red darken-1 ' });
                setSendingDataToCloud(false);
            })
    }

    const updateExistingStudentInfo = () => {
        if (existingDocId && existingDocRev && activeUser.email) {
            let data = {
                "_id": existingDocId,
                "_rev": existingDocRev,
                "userid": activeUser.userid,
                "firstName": activeUser.given_name,
                "lastName": activeUser.family_name,
                "email": activeUser.email,
                "age": age,
                "location": location,
                "fathersName": fathersName,
                "mothersName": mothersName,
                "hscName": hscName,
                "hscMarks": hscMarks,
                "sscName": sscName,
                "sscMarks": sscMarks
            }

            let putConfig = {
                headers: {
                    'Authorization': `Bearer ${activeUser.accessToken}`
                }
            };

            axios.put('https://10a7902a.eu-gb.apigw.appdomain.cloud/sim/put-student-info', data, putConfig)
                .then((resp) => {
                    setSendingDataToCloud(false);
                    if (resp.data.error) {
                        M.toast({ html: `<b>${resp.data.error}</b>`, classes: 'red darken-1 ' });
                    } else if (resp.data.id) {
                        M.toast({ html: `<b>Thank you for your input.<br />Data updated successfully</b>`, classes: 'green darken-1 ' });
                        signOut();
                    }
                })
                .catch((err) => {
                    // console.log("AXIOS ERROR: ", err);
                    M.toast({ html: `<b>AXIOS ERROR: ${err}</b>`, classes: 'red darken-1 ' });
                    setSendingDataToCloud(false);
                })
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col s12 center-align">
                    {checkingExistingStatus ? (
                        <h4>Checking existing status...</h4>
                    ) : (
                            <Fragment>
                                {isExistingStudent ? (
                                    <h4>Update Existing Student Info</h4>
                                ) : (
                                        <h4>Register New Student Info</h4>
                                    )}
                            </Fragment>
                        )}
                </div>
            </div>
            {
                checkingExistingStatus ? (
                    <div className="row">
                        <div className="col offset-s2 s8 offset-m3 m6 offset-l4 l4 ">
                            <div className="progress indigo lighten-4" style={{ height: 5 }}>
                                <div className="indeterminate indigo "></div>
                            </div>
                        </div>
                    </div>
                ) : (
                        <div className="row">
                            <form onSubmit={(e) => handleFormSubmit(e)} className="col s12 l8 offset-l2">
                                <div className="row">
                                    <div className="input-field col s12 m6">
                                        <input
                                            placeholder="First Name" id="first_name" type="text" className="validate"
                                            value={firstName} disabled
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                        <label htmlFor="first_name" className="active">First Name</label>
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <input
                                            placeholder="Last Name" id="last_name" type="text" className="validate"
                                            value={lastName} disabled
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                        <label htmlFor="last_name" className="active">Last Name</label>
                                    </div>
                                    <div className="input-field col s12">
                                        <input
                                            placeholder="Email Id" id="email_id" type="text" className="validate"
                                            value={email} disabled
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <label htmlFor="email_id" className="active">Email Id</label>
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <input
                                            placeholder="Age" id="age" type="number" className="validate"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                        />
                                        <label htmlFor="age" className="active">Age</label>
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <input
                                            placeholder="Location" id="location" type="text" className="validate"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                        <label htmlFor="location" className="active">Location</label>
                                    </div>
                                    <div className="input-field col s12">
                                        <input
                                            placeholder="Fathers Name" id="fathers_name" type="text" className="validate"
                                            value={fathersName}
                                            onChange={(e) => setFathersName(e.target.value)}
                                        />
                                        <label htmlFor="fathers_name" className="active">Fathers Name</label>
                                    </div>
                                    <div className="input-field col s12">
                                        <input
                                            placeholder="Mothers Name" id="mothers_name" type="text" className="validate"
                                            value={mothersName}
                                            onChange={(e) => setMothersName(e.target.value)}
                                        />
                                        <label htmlFor="mothers_name" className="active">Mothers Name</label>
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <input
                                            placeholder="HSC Name" id="hsc_name" type="text" className="validate"
                                            value={hscName}
                                            onChange={(e) => setHscName(e.target.value)}
                                        />
                                        <label htmlFor="hsc_name" className="active">HSC Name</label>
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <input
                                            placeholder="HSC %" id="hscmarks" type="number" className="validate"
                                            value={hscMarks}
                                            onChange={(e) => setHscMarks(e.target.value)}
                                        />
                                        <label htmlFor="hscmarks" className="active">HSC %</label>
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <input
                                            placeholder="SSC Name" id="ssc_name" type="text" className="validate"
                                            value={sscName}
                                            onChange={(e) => setSscName(e.target.value)}
                                        />
                                        <label htmlFor="ssc_name" className="active">SSC Name</label>
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <input
                                            placeholder="SSC %" id="sscmarks" type="number" className="validate"
                                            value={sscMarks}
                                            onChange={(e) => setSscMarks(e.target.value)}
                                        />
                                        <label htmlFor="sscmarks" className="active">SSC %</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s12 offset-m2 m8">
                                        {sendingDataToCloud ? (
                                            <div className="progress indigo lighten-4" style={{ height: 5 }}>
                                                <div className="indeterminate indigo "></div>
                                            </div>
                                        ) : (
                                                <button className="waves-effect waves-light btn indigo darken-4" style={{ width: "100%" }}>
                                                    <span>{isExistingStudent ? (<>Update</>) : (<>Submit</>)}</span>
                                                </button>
                                            )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    )
            }
        </div >
    )
}

export default NewStudentInfoPage
