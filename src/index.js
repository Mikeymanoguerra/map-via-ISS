import $ from 'jquery';
import './scripts/utils';
import './scripts/events';
import './scripts/store';
import './scripts/api';

window.$ = $;
$(document).ready(function () {
  console.log('end');
  events.bindEventListeners();
});


