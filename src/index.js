import ReactDOM from 'react-dom';
import 'sweetalert2/src/sweetalert2.scss';
import * as serviceWorker from './serviceWorker';
import Routes from './routes';
import "./assets/index.css"
ReactDOM.render(Routes, document.getElementById('root'));

serviceWorker.unregister();