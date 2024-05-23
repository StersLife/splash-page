import React from 'react';
import { useNotification, Audio, useTelnyxRTC } from '@telnyx/react-client';

function Phone() {
  const notification = useNotification();
  const activeCall = notification && notification.call;

  return (
    <div>
      {activeCall && activeCall.state === 'ringing' && (
        <div>
          <p>You have an incoming call from {activeCall.from}.</p>
          <button onClick={() => activeCall.answer()}>Answer</button>
          <button onClick={() => activeCall.hangup()}>Decline</button>
        </div>
      )}
      {activeCall && <Audio stream={activeCall.remoteStream} />}
    </div>
  );
}

export default Phone;