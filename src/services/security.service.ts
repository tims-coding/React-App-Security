const googleTrackingCode: string = "UA-63972640-61";

interface UserEnvironment {
	EnvironmentSpace: string;
	Environment: Environment;
	AccessToken: AccessToken;
	SessionID?: string;
	Groups: Array<string>;
	VendorToken: any;
}

/**
 * Interface to map the AccessToken
 */
interface AccessToken {
	client_id?: string;
	username?: string;
	email?: string;
	userid?: string;
}

/**
 * Interface to map the UserEnvironment
 */
interface Environment {
	SSO_Callback_URL: string;
	OrderManagementUI_API_URL: string;
	OrderManagementUI_Security_API_URL: string;
}

interface Permission {
	cancelOrderHeader: boolean;
	cancelOrderLine: boolean;
	editOrderHeader: boolean;
	editLineItem: boolean;
	editOrderNotes: boolean;
	editASN: boolean;
	createManualASN: boolean;
	cancelContainer: boolean;
	editASNLine: boolean;
	editASNNotes: boolean;
	editCargoReadyDateWorkflow: boolean;
	editLeadTimeExceptionsWorkflow: boolean;
}

interface PersmissionsResponse {
	permission: Permission;
	validGroups: string;
}

const setEnvironment = (username, email) => {
    let groups = [];

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email })
    };
    
    return fetch("/getAppEnv", requestOptions)
        .then(handleResponse)
        .then(settings => {

            console.log("response: ", settings);

            const appEnv = settings as UserEnvironment;

            try {
                const username = appEnv.AccessToken.username;
                // this.fullname = this.appEnv.AccessToken.fullname;
                const email = appEnv.AccessToken.email;
                const userid = appEnv.AccessToken.userid;
                const clientid = appEnv.AccessToken.client_id;

                // TODO is logic still needed?
                const pVendor = appEnv.VendorToken.pVendor;
                const mVendors = appEnv.VendorToken.mVendors;
                const isAServiceProvider = !mVendors || mVendors.length == 0;
                
                if (pVendor || isAServiceProvider) {
                    groups.push('PARTNER GUARDIAN');
                }

                for (let x = 0; x < appEnv.Groups.length; x++) {
                    if (appEnv.Groups[x] !== undefined) {
                        groups.push(appEnv.Groups[x]);
                    }
                }

                // (window as any).gtag('config', getGoogleTrackingCode(), {
                //     'user_id': username
                // });

                // this.google.username = this.getFullname();
                // this.google.addEvent("Login", "Login", this.username);

                const apiurl = appEnv.Environment.OrderManagementUI_API_URL;
                const securityapiurl = appEnv.Environment.OrderManagementUI_Security_API_URL;
                return {
                    username, email, userid, clientid, pVendor, mVendors, isAServiceProvider,
                    groups, apiurl, securityapiurl
                }
            } catch (e) {
                console.log(e);
            }
            // setWSEnvironment();
        }, (error) => {
            console.log('getAppEnv error', error);
        });
}

/* setWSEnvironment should be defined at environment context */
// const setWSEnvironment = () => {
//     let localhost: boolean = false;
//     let testEnv = 'http://localhost:7225/';
//     let _env = (localhost) ? testEnv : this.apiurl;
//     this.environment = {
//         //used in order.service.ts
//         posearch: _env + "po/getOrderSearch",
//         orderhistory: _env + "po/getOrderHistory",
//         orderevents: _env + "po/getOrderEvents",
//         orderreceipts: _env + "po/getOrderReceipts",
//         ordertransmissions: _env + "po/getOrderTransmissions",
//         orderdiscounts: _env + "po/getOrderDiscounts",
//         ordercount: _env + "po/getOrderCount",
//         leadtimeexceptions: _env + "po/getLeadTimeExceptions",
//         poexportall: _env + "po/exportAll",
//         putleadtimeexceptions: _env + "po/putLeadTimeExceptions",
//         postleadtimeexceptions: _env + "po/postLeadTimeExceptions",
//         crdworkflow: _env + "crd/getCRDWorkflow",
//         crdExportAll: _env + "crd/exportAll",
//         //used in reopen-sku.service.ts
//         addsku: _env + "po/getAddSkuList",
//         selectedsku: _env + "po/getSelectedSku",
//         editpo: _env + "po/editPO",
//         //used in asn-create.service.ts
//         manualcreate: _env + "asn/asnManualCreate",
//         //used in asn-detail.service.ts //
//         asnexportall: _env + "asn/exportAll",
//         origindestsvclist: _env + "asn/getOriginDestSvcList",
//         //used in asn-edit.service.ts
//         submitasnedit: _env + "asn/submitAsnEdit",
//         //used in asn.service.ts
//         asnsearch: _env + "asn/getAsnSearch",
//         asnevents: _env + "asn/getAsnEvents",
//         asnhistory: _env + "asn/getAsnHistory",
//         asncount: _env + "asn/getAsnCount",
//         //used in crd.service.ts
//         crdexport: _env + "crd/exportAll",
//         crdupdate: _env + "po/updateCRD",
//         //used in order.cancel.service.ts
//         cancelimportpomorder: _env + "po/cancelImportPOMOrder",
//         cancelorder: _env + "po/cancel",
//         //used in shipment.service.ts
//         shipmentsearch: _env + "shipment/getShipmentSearch",
//         //used in transfer.service.ts
//         receiptsearch: _env + "receipt/getReceiptSearch",
//         receiptExportAll: _env + "receipt/exportAll",
//         receiptExportHeader: _env + "receipt/exportHeader",
//         //used in transfer search service
//         transferCount: _env + "transfer/getTransferCount",
//         transfersSearch: _env + "transfer/transferSearch",
//         transferExportAll: _env + "transfer/exportAll",
//         // EFS Services
//         transitTemplate: _env + "po/getTransitTemplate",
//         blackoutDetails: _env + "po/getBlackoutDetails",
//         // Used in shared Detail Service
//         factoryIds: _env + "po/getFactoryIDs",
//         // Used in notes TS
//         asnNotes: _env + "asn/getAsnNotes",
//         poNotes: _env + "po/getNotes",
//         skuLinesByPO: _env + "asn/skuLinesByPO",
//         submitAsnEdit: _env + "asn/submitAsnEdit",
//         asnErrors: _env + "asn/errors",

//         // Used in sku.service.ts
//         searchSku: _env + "po/sku-lookup",
//         publishSku: _env + "po/publish-sku",
//         sendMassEditRequestToServer: _env + "po/send-mass-edit-request-to-server",
//         getDetailsForDomesticPOUpdate: _env + "po/get-details-for-domestic-po-update"
//     };
// }

// const getEnvironment(): UserEnvironment {
//     return this.appEnv;
// }

// const setPermissions() {
//     return new Promise((resolve, reject) => {
//         let body = JSON.stringify({userid: this.userid, username: this.username, groups: this.groups.join(',')});
//         let header = {headers: new HttpHeaders().set('Content-Type', 'application/json')};

//         resolve(
//             this.http.post(this.getSecurityAPIURL() + "security/getPermissions", body, header)
//                 .toPromise()
//                 .then((permission: any) => {

//                     if ((<any>permission).permissions) {
//                         //console.log('Got permissions: ' + JSON.stringify(permission));
//                         this.permission = (<any>permission).permissions;

//                         this.appEnv.Groups = permission.validGroups;
//                     } else {
//                         this.logout();
//                     }
//                 })
//         );
//     });
// }

const logout = async () => {
    console.log('Logging out..');
    // this.google.addEvent("Logout", "Logout", this.getUsername());
    // this.http.post("/logout", null).subscribe();
    localStorage.removeItem('user');
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                console.log('hello ddd');
                // window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

// const getPermissions = () => {
//     return this.permission;
// }

// const getVendor(mvendor: string): string {
//     //search thru the object to get the vender
//     try {
//         let _item = this.vendors.filter(function (item) {
//             return item.mvendorNumber == mvendor;
//         })[0];
//         if (_item.mvendorName != "") {
//             return _item.mvendorName;
//         } else {
//             return null;
//         }
//     } catch (e) {
//         return null;
//     }
// }

// const getMVendors(): Array<any> {
//     return this.mVendors;
// }

// const getPVendor(): string {
//     return this.pVendor;
// }

// const isPartnerGuardian(): boolean {
//     return this.appEnv.IsVendor;
// }

// const noMvendorShowError(): boolean {
//     return this.appEnv.NoMvendorShowError;
// }

// const isServiceProvider(): boolean {
//     return this.appEnv.IsServiceProvider;
// }

// const getUsername() {
//     return this.username;
// }


// const getFullname() {
//     return this.username;
// }


// const getAPIURL() {
//     return this.apiurl;
// }

// const getSecurityAPIURL() {
//     return this.securityapiurl;
// }

const getGoogleTrackingCode = () => {
    return googleTrackingCode;
}

export const securityService = {
    logout,
    setEnvironment,
    // setWSEnvironment,
    // getEnvironment,
    // setPermissions,
    // getPermissions,
    // getVendor,
    // getMVendors,
    // getPVendor,
    // isPartnerGuardian,
    // noMvendorShowError,
    // isServiceProvider,
    // getUsername,
    // getFullname,
    // getAPIURL,
    // getSecurityAPIURL,
    getGoogleTrackingCode
};