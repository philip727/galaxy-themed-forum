export type ModalDetails = {
    header: string,
    subtext: string,
    buttons: {text: string, fn: ModalFunctionTypes | (() => void) }[]
}

export enum ModalFunctionTypes {
    CLOSE = 100,
}

export interface INotificationDetails {
    text: string,
    seconds?: number,
}

export interface INotificationDetailsWithID extends INotificationDetails {
    id: string;
}

export interface ICategoryDetails {
    CID: number,
    name: string,
    description: string,
}
