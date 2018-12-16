import { environment } from "../../environments/environment";

export class Global {
    public static docLevelMethodHandle = 1;
    public static ws = new WebSocket(environment.engineApiWSS);

    public static firstLevelOperations = ["Select", "CreateSessionObject"];


    public static openDoc(qDocName, qUserName, qPassword) {
        var openDoc = {
            "handle": -1,
            "method": "OpenDoc",
            "params": {
                "qDocName": qDocName,
                "qUserName": qUserName,
                "qPassword": qPassword,
                "qSerial": "",
                "qNoData": false
            }
        };
        return openDoc;
    }

    public static GetField(handle, qFieldName) {
        var qFieldSelect = {
            "handle": 1,
            "method": "GetField",
            "params": {
                "qFieldName": "[" + qFieldName+ "]"
            }
        };
        return qFieldSelect;
    }

    public static Select(handle, fieldValue) {
        var selectReq = {
            "handle":  Global.docLevelMethodHandle,
            "method": "Select",
            "params": {
                "qMatch": fieldValue,
                "qSoftLock": false,
                "qExcludedValuesMode": 0
            }
        };
        return selectReq;
    }
}

// var qFieldSelect = this.GetField(this.getHandle(), '');
// var qSelectValue = this.Select('', '');
// ws.send(JSON.stringify(qFieldSelect));
// ws.send(JSON.stringify(qSelectValue));