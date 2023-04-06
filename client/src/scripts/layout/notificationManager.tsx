import ReactDOM from 'react-dom/client'
import Notification from '../../component/layout/Notification';
import { INotificationDetails, INotificationDetailsWithID } from '../../types/layout';
import { generateRandomString } from '../utils/idGenerator';


let root: ReactDOM.Root | null = null;
let notifications: INotificationDetailsWithID[] = [];
export const createNotification = (notificationDetails: INotificationDetails) => {
    const id = generateRandomString(32);
    notifications.push({ ...notificationDetails, id: id })
    updateNotifications();

    notificationDetails.seconds ??= 5;

    const timeoutId = setTimeout(() => {
        destroyNotificationByID(id);

        clearTimeout(timeoutId);
    }, notificationDetails.seconds * 1000)
}

export const destroyNotificationByID = (id: string) => {
    const notification = notifications.find(x => x.id === id);
    if (!notification) {
        return;
    }

    const index = notifications.indexOf(notification);
    if (index <= -1) {
        return;
    }

    notifications.splice(index, 1);

    updateNotifications();
}


const updateNotifications = () => {
    const notificationContainer = document.getElementById("notification-holder");

    if (!notificationContainer) {
        return;
    }

    if (root == null) {
        root = ReactDOM.createRoot(notificationContainer);
    }

    const notificationElements = (
        notifications.map(notif => {
            return (<Notification key={notif.id} details={notif} />)
        })
    )

    root.render(notificationElements);
}
