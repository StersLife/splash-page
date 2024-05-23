import React from 'react'

const ActiveScreen = () => {
  return (
    <div class="ongoing-call">
    <div class="header">
        <span class="user">Gabrielle Davis</span>
        <span class="call-timer">0:22</span>
        <span class="add-call">+</span>
    </div>
    <div class="participants">
        <div class="participant">
            <img src="https://via.placeholder.com/40" alt="User" class="user-img" />
            <span class="participant-name">Lexi Cologne <span class="emoji">😂</span> <span class="you">You</span></span>
        </div>
        <div class="participant">
            <div class="profile-pic">
                <span class="initial">T</span>
            </div>
            <span class="participant-name">Telnyx Number <span class="loading">↻</span></span>
        </div>
    </div>
    <div class="actions">
        <button class="mic"><span class="icon">🎤</span></button>
        <button class="camera"><span class="icon">📷</span></button>
        <button class="dialpad"><span class="icon">🔢</span></button>
        <button class="more"><span class="icon">⋯</span></button>
        <button class="end-call"><span class="icon">📞</span></button>
    </div>
</div>
  )
}

export default ActiveScreen