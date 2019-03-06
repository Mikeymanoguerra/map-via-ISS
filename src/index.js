import $ from 'jquery';
import './scripts/utils';
import './scripts/events';
import './scripts/store';
import './scripts/api';
import { events } from './scripts/events';

window.$ = $;
$(document).ready(function () {
  console.log('end');
  events.bindEventListeners();
  events.render();
});


