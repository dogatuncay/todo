import $ from 'jquery'
import './models'
import './views'
import './controllers'
import View from './View.js'

export default function initMVC() {
  $(() => View.__initialize(document.body));
}