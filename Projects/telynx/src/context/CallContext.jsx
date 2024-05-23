// src/context/CallContext.js
import React, { createContext, useState, useEffect, useCallback, useRef, useContext } from 'react';
import { TelnyxRTC } from "@telnyx/webrtc";

export const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const [incomingCall, setIncomingCall] = useState(null);
  const [currentCall, setCurrentCall] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [callStatus, setCallStatus]= useState(null);
  
  const canvasRef = useRef(null);

  const client = useRef(null);

  useEffect(() => {
    client.current = new TelnyxRTC({
      login: 'sterling67028',
      password: 'J2jGD6Le',
      ringtoneFile: '/sounds/ringback.mp3',
      ringbackFile: '/sounds/rington.mp3',
    });
    console.log(client.current)
/*     client.current.remoteElement = 'remoteMediaId';
 */

    client.current
      .on('telnyx.ready', () => {
        console.log('Telnyx client is ready');
      })
      .on('telnyx.notification', (notification) => {
        if (notification.type === 'callUpdate') {
          const call = notification.call;
          setCurrentCall(call);
          if (call.state === 'active') {
            setCallStatus('Active');
            if (call.options.remoteStream) {
              const stream = call.options.remoteStream;
              setAudioStream(stream);
              console.log(document.querySelector('#remoteStreamCall'))
              document.querySelector('#remoteStreamCall').srcObject = stream;


            }
          } else if (call.state === 'ringing') {
            setCallStatus('Ringing');
          } else {
            setCallStatus(call.state);
          }
          if (call.state === 'incoming') {
            setIncomingCall(call);
          } else {
            setCurrentCall(call);
     /*        if (call.state === 'active' && call.remoteStream instanceof MediaStream) {
              setAudioStream(call.options.remoteStream);
            } */
          }
        }
      });

    client.current.connect();

    return () => {
      client.current.disconnect();
    };
  }, []);
  const handleCall = async (destination) => {
    client.current.newCall({
      destinationNumber: destination,
      callerNumber: '+14352366133'
    });
  };

  const handleAnswer = useCallback(() => {
    if (incomingCall) {
      incomingCall.answer().then(() => {
        setupAudioVisualization();
      }).catch(error => {
        console.error('Error answering call:', error);
      });
    }
  }, [incomingCall]);

  const handleHold = () => {
    if (currentCall) {
      currentCall.hold().then(() => {
        console.log('Call on hold');
      });
    }
  };

  const handleResume = () => {
    if (currentCall) {
      currentCall.unhold().then(() => {
        console.log('Call resumed');
      });
    }
  };

  const handleDisconnect = () => {
    if (currentCall) {
      currentCall.hangup();
      setCurrentCall(null);
      setAudioStream(null);
      console.log('Call disconnected');
    }
  };

  const setupAudioVisualization = () => {
  
  };

  return (
    <CallContext.Provider
      value={{
        incomingCall,
        currentCall,
        audioStream,
        handleCall,
        handleAnswer,
        handleHold,
        handleResume,
        handleDisconnect,
        setupAudioVisualization,
        canvasRef,
        callStatus
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall =() => {
  const ctx = useContext(CallContext);
  if(ctx === undefined) {
    throw new Error('useCall must be used within a CallProvider')

  }

  return ctx
}