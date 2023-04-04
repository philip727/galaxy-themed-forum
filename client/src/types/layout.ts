export type ModalDetails = {
    header: string,
    subtext: string,
    buttons: [{text: string, fn: () => void}]
}

export interface INotificationDetails {
    text: string,
    seconds?: number,
}

export interface INotificationDetailsWithID extends INotificationDetails {
    id: string;
}
