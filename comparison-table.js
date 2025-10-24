/**
 * Comparison Table - Mobile Accordion Enhancement
 * Progressive enhancement for mobile comparison table
 */

document.addEventListener('DOMContentLoaded', function() {

    // Comparison data for 6 rows (homepage version)
    const comparisonData = [
        {
            axis: 'Arrival',
            hotel: 'Front desk, check-in window',
            allInclusive: 'Shuttle + wristband desk',
            vacationRental: 'Self check-in; first errands for groceries/car',
            privateResort: 'Airport welcome; lights on at home; fridge stocked; EV ready'
        },
        {
            axis: 'Where you can go',
            hotel: 'One property',
            allInclusive: 'One property complex',
            vacationRental: 'One home; off-site mobility required (separate car rental or taxis)',
            privateResort: '<strong>Island-wide freedom</strong> (EV-SUV included; GPS easy navigation)'
        },
        {
            axis: 'Mobility',
            hotel: 'Taxis/valet; occasional rental desk',
            allInclusive: 'Shuttles/queues; shared timing',
            vacationRental: 'Rental counters, contracts, deposits, insurance, policies',
            privateResort: '<strong>EV-SUV at home</strong> + free charging + GPS easy navigation'
        },
        {
            axis: 'Dining',
            hotel: 'On-site restaurants; limited timing; miss local hotspots, vibe & connections',
            allInclusive: 'Buffets & program times; miss local hotspots, vibe & connections',
            vacationRental: 'Find & book yourself; variable seats; limited local connections',
            privateResort: '<strong>Top local hotspots reserved</strong>; pre-intro; timed arrival; <strong>treated like regulars</strong>'
        },
        {
            axis: 'Experiences',
            hotel: 'Group excursions (extra)',
            allInclusive: 'Group boats/activities (programmed)',
            vacationRental: 'DIY charters; availability varies',
            privateResort: '<strong>3 signature experiences included:</strong> private boat day, Friday Family & Friends cruise, private flamingo hike'
        },
        {
            axis: 'Beach & club access',
            hotel: 'Priority on-property',
            allInclusive: 'On-property only',
            vacationRental: 'Public / first-come',
            privateResort: '<strong>Reserved access windows & parking</strong>; 4 beach clubs: Zanzibar, Papagayo, Koko\'s, Zest'
        }
    ];

    // Find accordion container
    const accordionContainer = document.querySelector('.comparison-accordion');

    if (!accordionContainer) {
        console.log('Accordion container not found');
        return;
    }

    // Build accordion HTML
    let accordionHTML = '';

    comparisonData.forEach((item, index) => {
        accordionHTML += `
            <div class="accordion-item" data-index="${index}">
                <button class="accordion-header" aria-expanded="false">
                    <h3 class="accordion-title">${item.axis}</h3>
                    <span class="accordion-chevron">▼</span>
                </button>
                <div class="accordion-content">
                    <div class="accordion-option">
                        <div class="accordion-option-label">Hotel</div>
                        <div class="accordion-option-value">${item.hotel}</div>
                    </div>
                    <div class="accordion-option">
                        <div class="accordion-option-label">All-Inclusive</div>
                        <div class="accordion-option-value">${item.allInclusive}</div>
                    </div>
                    <div class="accordion-option">
                        <div class="accordion-option-label">Vacation Rental</div>
                        <div class="accordion-option-value">${item.vacationRental}</div>
                    </div>
                    <div class="accordion-option private-resort">
                        <div class="accordion-option-label">Private Resort (Tommy Coconut)</div>
                        <div class="accordion-option-value">${item.privateResort}</div>
                    </div>
                </div>
            </div>
        `;
    });

    // Insert accordion HTML
    accordionContainer.innerHTML = accordionHTML;

    // Add click event listeners to accordion headers
    const accordionHeaders = accordionContainer.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const isActive = accordionItem.classList.contains('active');

            // Close all accordion items
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
            });

            // Toggle current item
            if (!isActive) {
                accordionItem.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Optional: Open first item by default on mobile
    if (window.innerWidth <= 768 && accordionHeaders.length > 0) {
        accordionHeaders[0].click();
    }
});
