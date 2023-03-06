import React, { useState, useEffect, useCallback } from 'react';
// import 'bootstrap/dist/css/bootstrap.css';

// import Container from 'react-bootstrap/Container';
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';

// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { logout } from "../firebase";

import './hitt.css'
import { addValue } from '../firebase';

const Hitt = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    const [show, toggleShow] = useState(true);
    const [logShow, togglelogShow] =useState (false);

    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [currentRep, setCurrentRep] = useState(1);
    const [currentSet, setCurrentSet] = useState(1);
    const [reps, setReps] = useState(2);
    const [exerciseDuration, setExerciseDuration] = useState(7);
    const [restDuration, setRestDuration] = useState(3);
    const [sets, setSets] = useState(2);
    const [setBreakTime, setSetBreakTime] = useState(5);
    const [isResting, setIsResting] = useState(false);
    const [isSetResting, setIsSetResting] = useState(false);
    // const [totalWork, setTotalWork] = useState({});

    const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        outline: 'none',
        margin: '10px'
      };
      

    const handleStartStop = () => {
        setIsRunning(prevIsRunning => !prevIsRunning);
        //
        //   toggleShow(s => !s)
        toggleShow(false)
    };

    const handleLogdataToggle = () => {
        togglelogShow(true)
    }
    // const logWerk = () => {
    //     setTotalWork(prevWorkout => ({
    //         ...prevWorkout,
    //         [new Date().toISOString()]: {
    //             reps: reps,
    //             exerciseDuration: exerciseDuration,
    //             restDuration: restDuration,
    //             sets: sets,
    //             setBreakTime: setBreakTime,
    //         }
    //     }));
    //     console.log(totalWork)

    // }


    const logData = () => {
        addValue({
            uid: user.uid,
            user: user.email,
            date: new Date().toISOString(),
            reps: reps,
            exerciseDuration: exerciseDuration,
            restDuration: restDuration,
            sets: sets,
            setBreakTime: setBreakTime,
        })
        console.log({
            user: user,
            date: new Date().toISOString(),
            reps: reps,
            exerciseDuration: exerciseDuration,
            restDuration: restDuration,
            sets: sets,
            setBreakTime: setBreakTime,
        })
    }

    const handleReset = useCallback(() => {
        setIsRunning(false);
        setElapsedTime(0);
        setCurrentRep(1);
        setCurrentSet(1);
        setIsResting(false);
        setIsSetResting(false);

        //
        toggleShow(s => !s)
    }, []);

    useEffect(() => {
        let interval = null;
        if (isRunning) {
            interval = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (!isRunning && elapsedTime !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);

    }, [isRunning, elapsedTime]);
    //set all elpased time to 1 not 0 to avoid display 0 - undone
    useEffect(() => {
        if (elapsedTime - 1 >= exerciseDuration && !isResting && !isSetResting) {
            if (currentRep < reps) {
                setIsResting(true);
                setElapsedTime(1);
            } else if (currentSet < sets) {
                setIsSetResting(true);
                setElapsedTime(1);
            } else {
                handleReset();
            }
        } else if (elapsedTime - 1 >= restDuration && isResting) {
            setIsResting(false);
            setElapsedTime(1);
            setCurrentRep(currentRep + 1);
        } else if (elapsedTime >= setBreakTime && isSetResting) {
            setIsSetResting(false);
            setElapsedTime(1);
            setCurrentSet(currentSet + 1);
            setCurrentRep(1);
        } else if (elapsedTime === 0){
            handleLogdataToggle();

        }
    }, [elapsedTime, exerciseDuration, restDuration, setBreakTime, currentRep, reps, currentSet, sets, isResting, isSetResting, handleReset]);

    const handleRepsChange = event => {
        setReps(event.target.value);
    };

    const handleExerciseDurationChange = event => {
        setExerciseDuration(event.target.value);
    };

    const handleRestDurationChange = event => {
        setRestDuration(event.target.value);
    };

    const handleSetBreakTimeChange = event => {
        setSetBreakTime(event.target.value);
    };

    const handleSetsChange = event => {
        setSets(event.target.value);
    };




    return (

        <div className='hittApp container'>

            <>
            <p> {user.email}  <a href="/do-something" onClick={logout} >logout</a></p> 
            </>
            {logShow && (
                <>
                <p>Log this workout: {exerciseDuration},  {restDuration}, {reps},  {sets} </p>
                <button className="button1" onClick={logData}>
                    Log Data
                </button>
                </>

            )}

            {show && <form className='form-group  '>
                <label className="form-label" htmlFor="inputReps">Enter number of reps:</label>
                <input
                    type="number"
                    id="inputReps"
                    placeholder="7 secs"
                    value={reps}
                    onChange={handleRepsChange}
                />

                <label className="form-label" htmlFor="exerciseDuration">Enter rep duration (secs):</label>
                <input
                    type="number"
                    id="exerciseDuration"
                    placeholder="7 secs"
                    value={exerciseDuration}
                    onChange={handleExerciseDurationChange}
                />

                <label className="form-label" htmlFor="restDuration">Enter rest (secs):</label>
                <input
                    type="number"
                    id="restDuration"
                    placeholder="3 secs"
                    value={restDuration}
                    onChange={handleRestDurationChange}
                />

                <label className="form-label" htmlFor="setNumber">Enter Set Number (secs):</label>
                <input
                    type="number"
                    id="setNumber"
                    placeholder="10 secs"
                    value={sets}
                    onChange={handleSetsChange}
                />

                <label className="form-label" htmlFor="setRestDuration">Enter Set Rest (secs):</label>
                <input
                    type="number"
                    id="setRestDuration"
                    placeholder="10 secs"
                    value={setBreakTime}
                    onChange={handleSetBreakTimeChange}
                />
            </form>
            }

           
            {!show &&
                <><p className='realTime'>
                    {currentRep} of {reps} reps | {currentSet} of {sets} sets
                </p>

                        {isSetResting ? <p className='realTime'><style>{'body { background-color: purple; }'}</style>Set Resting</p> :
                            isResting ? <p className='resting'><style>{'body { background-color: green; }'}</style>Resting</p> :
                                <p className='working'><style>{'body { background-color: red; }'}</style>Hang Tight</p>}<p className="elapsedTime">{elapsedTime} </p>

                </>


            }

            <button style={buttonStyle} onClick={handleStartStop}>
                {isRunning ? 'Pause' : 'Start'}
            </button>
            {/* <button style={buttonStyle} onClick={logout}>Logout</button> */}
            {!show && (
                <button style={buttonStyle} id='reset' onClick={handleReset}>
                    Reset
                </button>
            )}

          
            {/* {
                show &&                <button   style={buttonStyle} onClick={logout}>Logout</button>

            } */}
            {/* 
                    <Button variant="primary" onClick={handleStartStop}>
                        {isRunning ? 'Pause' : 'Start'}
                    </Button>

                    {!show && <Button variant="secondary" id='reset' onClick={handleReset}>Reset</Button>} */}

            {/* {show ? <Button variant="secondary" onClick={logData}> Log Data</Button> : "No data"} */}
            {/* {show && <Button variant="secondary" onClick={logData}> Log Data</Button> } */}

            {/* {show ? <Button variant="info"  onClick={() => toggleShow(s => !s)}> hi</Button> : "hi"} */}

        </div>


    );
};

export default Hitt