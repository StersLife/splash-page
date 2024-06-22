export function initializeContactWidgets() {
    const widgets = document.querySelectorAll('.houfy_widget[data-widgettype="contact"]')
    
    widgets.forEach(widget => {
      const listingId = widget.dataset.listingid
      const color = widget.dataset.color2 || 'FFFFFF'
      const buttonColor = widget.dataset.button_color || 'e8485d'
  
      widget.innerHTML = `
        <div class="contact-widget" style="--button-color: #${buttonColor}; --bg-color: #${color};">
          <h2>Contact Owner</h2>
          <form id="contact-form-${listingId}">
            <input type="email" placeholder="Your Email" required>
            <textarea placeholder="Your Message" required></textarea>
            <button type="submit">${widget.dataset.pr_text2 || 'Send Message'}</button>
          </form>
        </div>
      `
  
      // Add form submission handler
      const form = widget.querySelector(`#contact-form-${listingId}`)
      form.addEventListener('submit', (e) => {
        e.preventDefault()
        // Handle form submission (e.g., send data to server)
      })
    })
  }