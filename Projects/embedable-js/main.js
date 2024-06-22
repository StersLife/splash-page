import { initializePricingWidgets } from './widgets/pricing.js'
import { initializeContactWidgets } from './widgets/contact.js'
import { initializeBookingSummary } from './widgets/BookingSummary.jsx'
import './style.css'

console.log('get initialsed')
class WidgetSystem {
  constructor() {
    this.widgetTypes = {
      pricing: initializePricingWidgets,
      contact: initializeContactWidgets,
      bookingSummary: initializeBookingSummary
    }
  }

  init() {
    Object.values(this.widgetTypes).forEach(initFunction => initFunction())
  }
}

const widgetSystem = new WidgetSystem()

// Auto-initialize when the script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => widgetSystem.init())
} else {
  widgetSystem.init()
}