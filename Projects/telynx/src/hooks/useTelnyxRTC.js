// src/hooks/useTelnyxRTC.js
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useNotification } from '@telnyx/react-client';

const socket = io('http://localhost:3001', {
  transports: ['websocket'],
});

 const useTelnyxRTC = () => {
  const [currentCall, setCurrentCall] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const notification = useNotification();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (notification && notification.call) {
      setCurrentCall(notification.call);
      setAudioStream(notification.call.remoteStream);
    }
  }, [notification]);

  const setupAudioVisualization = () => {
    if (currentCall) {
      currentCall.answer().then(() => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(currentCall.remoteStream);

        source.connect(analyser);
        analyser.fftSize = 256;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const canvasCtx = canvasRef.current.getContext('2d');
        const WIDTH = canvasRef.current.width;
        const HEIGHT = canvasRef.current.height;

        const draw = () => {
          requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);
          canvasCtx.fillStyle = 'rgb(0, 0, 0)';
          canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

          const barWidth = (WIDTH / bufferLength) * 2.5;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
            canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);
            x += barWidth + 1;
          }
        };

        draw();
      }).catch(error => {
        console.error('Error answering call:', error);
      });
    }
  };

  console.log(currentCall, notification)
  return {
    currentCall,
    audioStream,
    setupAudioVisualization,
    canvasRef,
  };
};
