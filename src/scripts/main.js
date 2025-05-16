/**
 * Aquí estará la lógica principal de la aplicación.
 * Este bloque de código contiene la funcionalidad principal
 * que define el comportamiento del programa.
 */

import { stays } from './stays.js';
import {
  extractCities,
  filterStays,
  renderStays,
  renderCityOptions,
  updateGuestDisplay,
  updateLocationDisplay,
  showModal,
  hideModal,
  setLocationActive,
  setGuestsActive,
  showLocationResults,
  showGuestControls,
  showLoader,
  hideLoader
} from './utils.js';

// Maneja datos y lógica de negocio
class Model {
  constructor(data) {
    this.data = data;
    this.cities = extractCities(data);
  }
  
  // Filtra alojamientos por ciudad y huéspedes
  filterStays(city, guestCount) {
    return filterStays(this.data, city, guestCount);
  }
}

// Controla la interfaz y cómo se ve todo
class View {
  constructor() {
    // Elementos del DOM
    this.staysContainer = document.getElementById('staysContainer');
    this.loader = document.getElementById('loader');
    this.notFound = document.getElementById('notFound');
    this.searchModal = document.getElementById('searchModal');
    this.locationResults = document.getElementById('locationResults');
    this.guestControls = document.getElementById('guestControls');
    this.searchBar = document.getElementById('searchBar');
    this.closeModalBtn = document.getElementById('closeModal');
    this.searchBtn = document.getElementById('searchBtn');
    this.mobileSearchBtn = document.getElementById('mobileSearchBtn');
    this.locationDisplay = document.getElementById('locationDisplay');
    this.guestsDisplay = document.getElementById('guestsDisplay');
    this.guestCountDisplay = document.getElementById('guestCountDisplay');
    this.mobileGuestCountDisplay = document.getElementById('mobileGuestCountDisplay');
    
    // Secciones de búsqueda
    this.locationSection = document.getElementById('locationSection');
    this.guestsSection = document.getElementById('guestsSection');
    this.mobileLocationSection = document.getElementById('mobileLocationSection');
    this.mobileGuestsSection = document.getElementById('mobileGuestsSection');
    
    // Contadores
    this.adultCount = document.querySelector('.adult-count');
    this.childrenCount = document.querySelector('.children-count');
    
    // Botones de contador
    this.adultIncBtn = document.querySelector('.adult-inc');
    this.adultDecBtn = document.querySelector('.adult-dec');
    this.childrenIncBtn = document.querySelector('.children-inc');
    this.childrenDecBtn = document.querySelector('.children-dec');
    
    // Campos de texto
    this.searchCity = document.getElementById('searchCity');
    this.mobileSearchCity = document.getElementById('mobileSearchCity');
  }
  
  // Muestra animación de carga
  showLoader() {
    showLoader(this.staysContainer, this.notFound, this.loader);
  }
  
  // Oculta animación de carga
  hideLoader() {
    hideLoader(this.loader);
  }
  
  // Pinta los alojamientos en pantalla
  renderStays(stays) {
    renderStays(this.staysContainer, stays);
  }
  
  // Muestra lista de ciudades disponibles
  renderCityOptions(cities, onCitySelect) {
    renderCityOptions(this.locationResults, cities, onCitySelect);
  }
  
  // Activa ventana de búsqueda
  showModal() {
    showModal(this.searchModal);
  }
  
  // Cierra ventana de búsqueda
  hideModal() {
    hideModal(this.searchModal);
    
    // Resetea estados
    this.setLocationActive(false);
    this.setGuestsActive(false);
    this.hideLocationResults();
    this.hideGuestControls();
  }
  
  // Muestra resultados de ubicación
  showLocationResults() {
    showLocationResults(this.locationResults, this.guestControls);
  }
  
  // Esconde resultados de ubicación
  hideLocationResults() {
    this.locationResults.classList.add('hidden');
  }
  
  // Muestra panel de huéspedes
  showGuestControls() {
    showGuestControls(this.guestControls, this.locationResults);
  }
  
  // Esconde panel de huéspedes
  hideGuestControls() {
    this.guestControls.classList.add('hidden');
  }
  
  // Activa o desactiva sección de ubicación
  setLocationActive(isActive) {
    setLocationActive(this.locationSection, this.mobileLocationSection, isActive);
  }
  
  // Activa o desactiva sección de huéspedes
  setGuestsActive(isActive) {
    setGuestsActive(this.guestsSection, this.mobileGuestsSection, isActive);
  }
  
  // Actualiza número de huéspedes en pantalla
  updateGuestDisplay(total) {
    updateGuestDisplay(
      this.guestsDisplay,
      this.guestCountDisplay,
      this.mobileGuestCountDisplay,
      total
    );
  }
  
  // Actualiza ciudad seleccionada en pantalla
  updateLocationDisplay(city) {
    updateLocationDisplay(
      this.locationDisplay,
      this.searchCity,
      this.mobileSearchCity,
      city
    );
  }
}

// Conecta modelo y vista, maneja lo que pasa cuando interactúas
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    
    // Estado
    this.selectedCity = null;
    this.adultCount = 0;
    this.childrenCount = 0;
    
    // Arranca la app
    this.init();
  }
  
  // Pone todo en marcha
  init() {
    // Primer renderizado
    this.view.showLoader();
    setTimeout(() => {
      this.view.hideLoader();
      this.view.renderStays(this.model.data);
    }, 500);
    
    // Configura eventos
    this.setupEventListeners();
  }
  
  // Configura qué pasa cuando haces click, etc.
  setupEventListeners() {
    // Abrir modal
    this.view.searchBar.addEventListener('click', () => {
      this.view.showModal();
      this.view.setLocationActive(true);
      this.view.showLocationResults();
      this.view.renderCityOptions(this.model.cities, (city) => this.selectCity(city));
    });
    
    // Cerrar modal con botón
    this.view.closeModalBtn.addEventListener('click', () => {
      this.view.hideModal();
    });
    
    // Cerrar modal haciendo click fuera
    this.view.searchModal.addEventListener('click', (e) => {
      if (e.target === this.view.searchModal || e.target.classList.contains('bg-black')) {
        this.view.hideModal();
      }
    });
    
    // Click en sección de ubicación
    this.view.locationSection.addEventListener('click', () => {
      this.view.setLocationActive(true);
      this.view.setGuestsActive(false);
      this.view.showLocationResults();
      this.view.renderCityOptions(this.model.cities, (city) => this.selectCity(city));
    });
    
    this.view.mobileLocationSection.addEventListener('click', () => {
      this.view.setLocationActive(true);
      this.view.setGuestsActive(false);
      this.view.showLocationResults();
      this.view.renderCityOptions(this.model.cities, (city) => this.selectCity(city));
    });
    
    // Click en sección de huéspedes
    this.view.guestsSection.addEventListener('click', () => {
      this.view.setGuestsActive(true);
      this.view.setLocationActive(false);
      this.view.showGuestControls();
    });
    
    this.view.mobileGuestsSection.addEventListener('click', () => {
      this.view.setGuestsActive(true);
      this.view.setLocationActive(false);
      this.view.showGuestControls();
    });
    
    // Filtrado al escribir ciudad
    this.view.searchCity.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filteredCities = this.model.cities.filter(city => 
        city.toLowerCase().includes(query)
      );
      this.view.renderCityOptions(filteredCities, (city) => this.selectCity(city));
    });
    
    this.view.mobileSearchCity.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filteredCities = this.model.cities.filter(city => 
        city.toLowerCase().includes(query)
      );
      this.view.renderCityOptions(filteredCities, (city) => this.selectCity(city));
    });
    
    // Botones de conteo de huéspedes
    this.view.adultIncBtn.addEventListener('click', () => this.incrementAdults());
    this.view.adultDecBtn.addEventListener('click', () => this.decrementAdults());
    this.view.childrenIncBtn.addEventListener('click', () => this.incrementChildren());
    this.view.childrenDecBtn.addEventListener('click', () => this.decrementChildren());
    
    // Botones de búsqueda
    this.view.searchBtn.addEventListener('click', () => this.search());
    this.view.mobileSearchBtn.addEventListener('click', () => this.search());
  }
  
  // Guarda la ciudad elegida
  selectCity(city) {
    this.selectedCity = city;
    this.view.updateLocationDisplay(city);
  }
  
  // Suma un adulto
  incrementAdults() {
    this.adultCount++;
    this.view.adultCount.textContent = this.adultCount;
    this.updateGuestCount();
  }
  
  // Resta un adulto
  decrementAdults() {
    if (this.adultCount > 0) {
      this.adultCount--;
      this.view.adultCount.textContent = this.adultCount;
      this.updateGuestCount();
    }
  }
  
  // Suma un niño
  incrementChildren() {
    this.childrenCount++;
    this.view.childrenCount.textContent = this.childrenCount;
    this.updateGuestCount();
  }
  
  // Resta un niño
  decrementChildren() {
    if (this.childrenCount > 0) {
      this.childrenCount--;
      this.view.childrenCount.textContent = this.childrenCount;
      this.updateGuestCount();
    }
  }
  
  // Actualiza contador total
  updateGuestCount() {
    const total = this.adultCount + this.childrenCount;
    this.view.updateGuestDisplay(total);
  }
  
  // Busca y muestra resultados
  search() {
    const guestCount = this.adultCount + this.childrenCount;
    const filteredStays = this.model.filterStays(this.selectedCity, guestCount > 0 ? guestCount : null);
    
    this.view.hideModal();
    this.view.showLoader();
    
    // Actualiza barra de búsqueda
    this.view.updateLocationDisplay(this.selectedCity);
    
    setTimeout(() => {
      this.view.hideLoader();
      this.view.renderStays(filteredStays);
    }, 500);
  }
}

// Arranca todo cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
  const model = new Model(stays);
  const view = new View();
  const controller = new Controller(model, view);
});