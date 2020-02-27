import ReactDOM from 'react-dom';
import 'sweetalert2/src/sweetalert2.scss';
import * as serviceWorker from './serviceWorker';
import routes from 'routes/index';
import "./assets/index.css"
ReactDOM.render(routes, document.getElementById('root'));

serviceWorker.unregister();