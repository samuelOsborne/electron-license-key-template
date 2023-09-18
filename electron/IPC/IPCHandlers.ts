import { IpcMainEvent, IpcMainInvokeEvent, ipcMain } from "electron";
import { IPC_ACTIONS } from "./IPCActions";
import electronStore from 'electron-store';

const {
    SET_LICENSE_KEY,
    GET_LICENSE_KEY,
} = IPC_ACTIONS.Window;

const handleSetLicenseKey = (_event: IpcMainEvent, key: string) => {
    try {
        const store = new electronStore();

        console.log("Setting license key in store : " + key)
        store.set("licenseKey", key);
        
    } catch (e: any) {
        console.log(e.message)
    }
}

const handleGetLicenseKey = (_event: IpcMainInvokeEvent, _key: string): string | undefined => {
    try {
        const store = new electronStore();

        console.log("Getting license key in store")
        return store.get('licenseKey') as string;
    } catch(e: any) {
        console.log(e.message)
    }
    return ''
}

export const registerIPCHandlers = () => {
    ipcMain.on(SET_LICENSE_KEY, handleSetLicenseKey);

    ipcMain.handle(GET_LICENSE_KEY, (event, key) => handleGetLicenseKey(event, key));
}