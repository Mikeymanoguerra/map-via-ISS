import $ from 'jquery';
import './scripts/utils';
import './scripts/events';
import './scripts/store';
import './scripts/api';
import { events } from './scripts/events';
import { secretCoordinateForm } from './scripts/secret-coordinate-form';

window.$ = $;
$(document).ready(function () {
  console.log('end');
  events.bindEventListeners();
  events.render();
  secretCoordinateForm.bindFormListeners();
});


