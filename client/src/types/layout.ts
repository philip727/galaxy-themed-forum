import { ServerResponse } from "./response";
import { IPublicRegisterDetails, IPublicUserDetails } from "./user";

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


export interface IHomeLoader {
    categories: ServerResponse<ICategoryDetails[]>;
    lastUser: ServerResponse<IPublicRegisterDetails>; 
    onlineUsers: ServerResponse<IPublicUserDetails[]>; 
}

export enum ProfileSettingsTab {
    DISPLAY = 100,
    SECURITY = 150,
    PRIVACY = 200,
}

export type SettingsTabs = {
    [key: string]: ProfileSettingsTab,
}
