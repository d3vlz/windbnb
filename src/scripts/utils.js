/**
 * Módulo de funciones utilitarias.
 * Este archivo contiene funciones auxiliares que serán utilizadas y llamadas
 * desde el archivo principal para realizar varias operaciones.
 */

// Saca las ciudades únicas de los datos
export function extractCities(data) {
  const citySet = new Set();
  data.forEach(stay => citySet.add(stay.city));
  return [...citySet];
}

// Filtra alojamientos por ciudad y número de huéspedes
export function filterStays(data, city, guestCount) {
  if (city && guestCount) {
    return data.filter(stay => 
      stay.city === city && stay.maxGuests >= guestCount
    );
  } else if (city) {
    return data.filter(stay => stay.city === city);
  } else if (guestCount) {
    return data.filter(stay => stay.maxGuests >= guestCount);
  }
  return data;
}

// Pinta los alojamientos en la página
export function renderStays(container, stays) {
  container.innerHTML = '';
  
  if (stays.length === 0) {
    document.getElementById('notFound').classList.remove('hidden');
    return;
  }
  
  document.getElementById('notFound').classList.add('hidden');
  
  // Actualiza contador de resultados
  const staysCount = document.getElementById('staysCount');
  if (staysCount) {
    staysCount.textContent = `${stays.length}${stays.length >= 12 ? '+' : ''} stays`;
  }
  
  // Añade cada alojamiento a la cuadrícula
  stays.forEach(stay => {
    const stayElement = document.createElement('div');
    stayElement.className = 'mb-6';
    
    stayElement.innerHTML = `
      <div class="overflow-hidden rounded-3xl mb-2">
        <img src="${stay.photo}" alt="${stay.title}" class="w-full h-64 md:h-60 object-cover">
      </div>
      <div class="flex justify-between items-center mb-2">
        <div class="flex items-center">
          ${stay.superHost ? '<span class="text-xs font-bold border border-gray-900 rounded-full px-2 py-1 mr-2">SUPERHOST</span>' : ''}
          <span class="text-sm text-gray-500">${stay.type}${stay.beds ? ` · ${stay.beds} beds` : ''}</span>
        </div>
        <div class="flex items-center">
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-red-500 fill-current mr-1">
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
          </svg>
          <span class="text-sm">${stay.rating}</span>
        </div>
      </div>
      <h2 class="text-sm font-medium">${stay.title}</h2>
    `;
    
    container.appendChild(stayElement);
  });
}

// Muestra lista de ciudades para elegir
export function renderCityOptions(container, cities, onCitySelect) {
  container.innerHTML = '';
  
  cities.forEach(city => {
    const cityElement = document.createElement('div');
    cityElement.className = 'flex items-center mb-4 cursor-pointer';
    cityElement.innerHTML = `
      <svg viewBox="0 0 24 24" class="w-5 h-5 mr-2 text-gray-500 fill-current">
        <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
      </svg>
      <span>${city}, Finland</span>
    `;
    
    cityElement.addEventListener('click', () => {
      onCitySelect(city);
    });
    
    container.appendChild(cityElement);
  });
}

// Actualiza texto de huéspedes en la interfaz
export function updateGuestDisplay(guestsDisplay, guestCountDisplay, mobileGuestCountDisplay, total) {
  if (total > 0) {
    const text = `${total} guest${total !== 1 ? 's' : ''}`;
    guestsDisplay.textContent = text;
    guestCountDisplay.textContent = text;
    mobileGuestCountDisplay.textContent = text;
    
    guestCountDisplay.classList.remove('text-gray-400');
    mobileGuestCountDisplay.classList.remove('text-gray-400');
    guestsDisplay.classList.remove('text-gray-400');
  } else {
    guestsDisplay.textContent = 'Add guests';
    guestCountDisplay.textContent = 'Add guests';
    mobileGuestCountDisplay.textContent = 'Add guests';
    
    guestCountDisplay.classList.add('text-gray-400');
    mobileGuestCountDisplay.classList.add('text-gray-400');
    guestsDisplay.classList.add('text-gray-400');
  }
}

// Actualiza texto de ubicación en la interfaz
export function updateLocationDisplay(locationDisplay, searchCity, mobileSearchCity, city) {
  if (city) {
    locationDisplay.textContent = `${city}, Finland`;
    searchCity.value = city;
    mobileSearchCity.value = city;
    
    searchCity.classList.remove('text-gray-400');
    mobileSearchCity.classList.remove('text-gray-400');
  } else {
    locationDisplay.textContent = 'Add location';
    searchCity.value = '';
    mobileSearchCity.value = '';
    
    searchCity.classList.add('text-gray-400');
    mobileSearchCity.classList.add('text-gray-400');
  }
}

// Abre la ventana de búsqueda
export function showModal(modal) {
  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden'); // Evita scroll con modal abierto
}

// Cierra la ventana de búsqueda
export function hideModal(modal) {
  modal.classList.add('hidden');
  document.body.classList.remove('overflow-hidden'); // Permite scroll de nuevo
}

// Destaca sección de ubicación
export function setLocationActive(locationSection, mobileLocationSection, isActive) {
  if (isActive) {
    locationSection.classList.add('border-2', 'border-black', 'rounded-lg');
    locationSection.setAttribute('data-active', 'true');
    mobileLocationSection.classList.add('border-2', 'border-black', 'rounded-lg');
    mobileLocationSection.setAttribute('data-active', 'true');
  } else {
    locationSection.classList.remove('border-2', 'border-black', 'rounded-lg');
    locationSection.setAttribute('data-active', 'false');
    mobileLocationSection.classList.remove('border-2', 'border-black', 'rounded-lg');
    mobileLocationSection.setAttribute('data-active', 'false');
  }
}

// Destaca sección de huéspedes
export function setGuestsActive(guestsSection, mobileGuestsSection, isActive) {
  if (isActive) {
    guestsSection.classList.add('border-2', 'border-black', 'rounded-lg');
    guestsSection.setAttribute('data-active', 'true');
    mobileGuestsSection.classList.add('border-2', 'border-black', 'rounded-lg');
    mobileGuestsSection.setAttribute('data-active', 'true');
  } else {
    guestsSection.classList.remove('border-2', 'border-black', 'rounded-lg');
    guestsSection.setAttribute('data-active', 'false');
    mobileGuestsSection.classList.remove('border-2', 'border-black', 'rounded-lg');
    mobileGuestsSection.setAttribute('data-active', 'false');
  }
}

// Muestra ciudades y oculta selector de huéspedes
export function showLocationResults(locationResults, guestControls) {
  locationResults.classList.remove('hidden');
  guestControls.classList.add('hidden');
}

// Muestra selector de huéspedes y oculta ciudades
export function showGuestControls(guestControls, locationResults) {
  guestControls.classList.remove('hidden');
  locationResults.classList.add('hidden');
}

// Muestra animación de carga
export function showLoader(staysContainer, notFound, loader) {
  staysContainer.innerHTML = '';
  notFound.classList.add('hidden');
  loader.classList.remove('hidden');
}

// Oculta animación de carga
export function hideLoader(loader) {
  loader.classList.add('hidden');
}