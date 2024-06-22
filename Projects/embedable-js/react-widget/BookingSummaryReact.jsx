import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './../styles/bookingSummary.css';
import moment from 'moment';

const BookingComponent = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(moment().add(8, 'days').toDate());
  const [guests, setGuests] = useState(4);

  const pricePerNight = 354.25;
  const nights = moment(endDate).diff(moment(startDate), 'days');
  const totalPrice = pricePerNight * nights;

  return (
    <div className="booking-container">
      <div className="booking-details">
        <p className="price-per-night">${pricePerNight.toFixed(2)} / night</p>
        <div className="dates">
          <div className="date-picker">
            <label>Check in</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          <div className="date-picker">
            <label>Check out</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </div>
        </div>
        <div className="guests">
          <label htmlFor="guests">Guests</label>
          <select id="guests" value={guests} onChange={(e) => setGuests(e.target.value)}>
            <option value="4">4 guests</option>
          </select>
        </div>
        <p className="total-price">
          ${pricePerNight.toFixed(2)} x {nights} Nights <span>${totalPrice.toFixed(2)}</span>
        </p>
        <p className="total-amount">
          Total <span>${totalPrice.toFixed(2)}</span>
        </p>
        <div className="currency">
          <label htmlFor="currency">Currency</label>
          <select id="currency">
            <option value="USD">USD</option>
          </select>
        </div>
        <button className="book-direct">Book Direct</button>
        <button className="contact-owner">Contact Owner</button>
        <p className="disclaimer">
          Enter dates and number of guests to view the total trip price, including additional fees and any taxes.
        </p>
        <a href="#" className="houfy-listing">My Houfy listing</a>
      </div>
    </div>
  );
};

export default BookingComponent;
