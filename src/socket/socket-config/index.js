// Связующий модуль socket
import { socket } from './socket';
import { adminSocket } from './socket-admin';

// Actions
import userActions from '../socket-actions/userActions';

// Events
import '../socket-event';


export {
    userActions,
    adminSocket,
    socket
}