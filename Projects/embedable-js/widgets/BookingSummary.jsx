// widgets/initializeBookingSummaryReact.js
import React from 'react';
import ReactDOM from 'react-dom';
import BookingSummaryReact from '../react-widget/BookingSummaryReact.jsx';
import { createRoot } from 'react-dom/client';

export const initializeBookingSummary = () => {
  const container = document.getElementById('booking-summary-react-widget');
  const root = createRoot(container)
  if (container) {
    root.render(<BookingSummaryReact />, container);
  }
};