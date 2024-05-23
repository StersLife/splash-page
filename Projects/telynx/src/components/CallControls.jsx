// src/components/CallControls.js
import React from 'react';
import {  useCall } from '../context/CallContext';

const CallControls = () => {
  const { handleHold, handleResume, handleDisconnect, currentCall } = useCall()

  return (
    <div>
      {currentCall.state === 'active' ? (
        <button onClick={handleHold}>Hold</button>
      ) : currentCall.state === 'held' ? (
        <button onClick={handleResume}>Resume</button>
      )  : ''}

      {
       currentCall.state !== 'destroy' ? (
        <button onClick={handleDisconnect}>Disconnect</button>
      ) : null}
      
     
    </div>
  );
};

export default CallControls;