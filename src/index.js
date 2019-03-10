import $ from 'jquery';
import './scripts/utils';
import './scripts/events';
import './scripts/store';
import './scripts/api';
import '../index.html';
import '../index.css';
import { events } from './scripts/events';
import { secretCoordinateForm } from './scripts/secret-coordinate-form';

window.$ = $;
$(document).ready(function () {
  events.bindEventListeners();
  events.render();
  secretCoordinateForm.bindFormListeners();
});


