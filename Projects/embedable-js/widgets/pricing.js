export function initializePricingWidgets() {
  const widgets = document.querySelectorAll('.houfy_widget[data-widgettype="pricing"]');

  widgets.forEach(widget => {
    const color = widget.dataset.color2 || 'FFFFFF';
    const buttonColor = widget.dataset.button_color || 'e8485d';

    // Refactored fetchCatData function
    const fetchCatData = () => {
      fetch('https://api.thecatapi.com/v1/images/search?limit=1')
        .then(response => response.json())
        .then(data => {
          console.log({data})
          const catData = data[0]; // Assuming you want the first image
          const imageUrl = catData.url;

          widget.innerHTML = `
            <div class="pricing-widget" style="--button-color: #${buttonColor}; --bg-color: #${color};">
              <h2>Id: ${catData.id}}!</h2>
              <img src="${imageUrl}" alt="Random Cat Image" />
              <button class="book-button">${widget.dataset.pr_text1 || 'Adopt Now'}</button>
              <p class="description">${widget.dataset.pr_text3 || 'Click to see more purrfect felines.'}</p>
            </div>
          `;

          // Add event listener to the newly created button
          const button = widget.querySelector('.book-button');
          button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default action if necessary
            fetchCatData(); // Fetch new cat data on click
          });
        })
        .catch(error => {
          console.error('Error loading cat data:', error);
          widget.innerHTML = '<p>No cats available right meow!</p>';
        });
    };

    // Initial fetch
    fetchCatData();
  });
}