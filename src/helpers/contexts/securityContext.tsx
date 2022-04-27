import React, { useState } from 'react';
import { createContext } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { GoogleService } from '../../services/google.service';
import { securityActions } from '../../redux/actions';

const SecurityContext = createContext({
    isLoggedIn: false,
    user: null,
    setEnvironment: (username, password, from) => {},
    WSEnvironment: null,
    setWSEnvironment: null,
    getEnvironment: null,
    permissions: null,
    setPermissions: null,
    getVendor: null,
    groups: null,
    getMVendors: null,
    getPVendor: null,
    isPartnerGuardian: null,
    noMvendorShowError: null,
    isServiceProvider: null,
    getUsername: null,
    getFullname: null,
    getAPIURL: null,
    getSecurityAPIURL: null,
    getGoogleTrackingCode: null,
    googleClient: null,
});

function SecurityProvider({ children }) {
    const googleTrackingCode: string = "UA-63972640-61";
    const googleClient = new GoogleService();
    const user = useSelector((state:any) => state.authentication.user);
    const isLoggedIn = useSelector((state:any) => state.authentication.loggedIn);
	const dispatch = useDispatch<AppDispatch>();

    const setEnvironment = async (username, email, from) => {
        try {
            await dispatch(securityActions.setEnvironment(username, email, from));
            (window as any).gtag('config', getGoogleTrackingCode(), {
                'user_id': user?.username
            });
            googleClient.username = getFullname();
            googleClient.addEvent("Login", "Login", this.username);
        } catch (err) {
            console.log(err);
        }
    }

    const getEnvironment = () => {
        return user;
    }

    const [WSEnvironment, _setWSEnvironment] = useState(null);    

    const setWSEnvironment = () => {
		let localhost: boolean = false;
		let testEnv = 'http://localhost:7225/';
		let _env = (localhost) ? testEnv : this.apiurl;
        _setWSEnvironment({
            posearch: _env + "po/getOrderSearch",
            orderhistory: _env + "po/getOrderHistory",
            orderevents: _env + "po/getOrderEvents",
            orderreceipts: _env + "po/getOrderReceipts",
            ordertransmissions: _env + "po/getOrderTransmissions",
            orderdiscounts: _env + "po/getOrderDiscounts",
            ordercount: _env + "po/getOrderCount",
            leadtimeexceptions: _env + "po/getLeadTimeExceptions",
            poexportall: _env + "po/exportAll",
            putleadtimeexceptions: _env + "po/putLeadTimeExceptions",
            postleadtimeexceptions: _env + "po/postLeadTimeExceptions",
            crdworkflow: _env + "crd/getCRDWorkflow",
            crdExportAll: _env + "crd/exportAll",
            //used in reopen-sku.service.ts
            addsku: _env + "po/getAddSkuList",
            selectedsku: _env + "po/getSelectedSku",
            editpo: _env + "po/editPO",
            //used in asn-create.service.ts
            manualcreate: _env + "asn/asnManualCreate",
            //used in asn-detail.service.ts //
            asnexportall: _env + "asn/exportAll",
			origindestsvclist: _env + "asn/getOriginDestSvcList",
            //used in asn-edit.service.ts
            submitasnedit: _env + "asn/submitAsnEdit",
            //used in asn.service.ts
            asnsearch: _env + "asn/getAsnSearch",
            asnevents: _env + "asn/getAsnEvents",
            asnhistory: _env + "asn/getAsnHistory",
            asncount: _env + "asn/getAsnCount",
            //used in crd.service.ts
            crdexport: _env + "crd/exportAll",
            crdupdate: _env + "po/updateCRD",
            //used in order.cancel.service.ts
            cancelimportpomorder: _env + "po/cancelImportPOMOrder",
            cancelorder: _env + "po/cancel",
            //used in shipment.service.ts
            shipmentsearch: _env + "shipment/getShipmentSearch",
            //used in transfer.service.ts
            receiptsearch: _env + "receipt/getReceiptSearch",
            receiptExportAll: _env + "receipt/exportAll",
            receiptExportHeader: _env + "receipt/exportHeader",
            //used in transfer search service
            transferCount: _env + "transfer/getTransferCount",
            transfersSearch: _env + "transfer/transferSearch",
            transferExportAll: _env + "transfer/exportAll",
            // EFS Services
            transitTemplate: _env + "po/getTransitTemplate",
            blackoutDetails: _env + "po/getBlackoutDetails",
            // Used in shared Detail Service
            factoryIds: _env + "po/getFactoryIDs",
            // Used in notes TS
            asnNotes: _env + "asn/getAsnNotes",
            poNotes: _env + "po/getNotes",
            skuLinesByPO: _env + "asn/skuLinesByPO",
            submitAsnEdit: _env + "asn/submitAsnEdit",
			asnErrors: _env + "asn/errors",

			// Used in sku.service.ts
			searchSku: _env + "po/sku-lookup",
			publishSku: _env + "po/publish-sku",
			sendMassEditRequestToServer: _env + "po/send-mass-edit-request-to-server",
			getDetailsForDomesticPOUpdate: _env + "po/get-details-for-domestic-po-update"
		});
	}

    const [permissions, _setPermissions] = useState(null);
    const [groups, _setGroups] = useState(null);

    const setPermissions = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({userid: user.userid, username: user.username, groups: user.groups.join(',')})
        };

        return fetch("/getAppEnv", requestOptions)
            .then(response => response.json())
            .then((permission:any) => {
                if (permission.permissions) {
                    //console.log('Got permissions: ' + JSON.stringify(permission));
                    _setPermissions(permission.permissions);

                    _setGroups(permission.validGroups);
                } else {
                    this.logout();
                }
            })
	}

    const getVendor = (mvendor: string) => {
		//search thru the object to get the vender
		try {
			let _item = user?.vendors?.filter(function (item) {
				return item.mvendorNumber === mvendor;
			})[0];
			if (_item.mvendorName != "") {
				return _item.mvendorName;
			} else {
				return null;
			}
		} catch (e) {
			return null;
		}
	}

    const getMVendors = () => {
		return user?.mVendors;
	}

	const getPVendor = () => {
		return user?.pVendor;
	}

	const isPartnerGuardian = () => {
		return user?.IsVendor;
	}

	const noMvendorShowError = () => {
		return user?.NoMvendorShowError;
	}

	const isServiceProvider = () => {
		return user?.IsServiceProvider;
	}

	const getUsername = () => {
		return user?.username;
	}

	const getFullname = () => {
		return user?.username;
	}

	const getAPIURL = () => {
		return user?.apiurl;
	}

	const getSecurityAPIURL = () => {
		return user?.securityapiurl;
	}

	const getGoogleTrackingCode = () => {
		return googleTrackingCode;
	}

    return (
        <SecurityContext.Provider
            value={{
                isLoggedIn,
                user,
                setEnvironment,
                setWSEnvironment,
                WSEnvironment,
                getEnvironment,
                permissions,
                setPermissions,
                getVendor,
                groups,
                getMVendors,
                getPVendor,
                isPartnerGuardian,
                noMvendorShowError,
                isServiceProvider,
                getUsername,
                getFullname,
                getAPIURL,
                getSecurityAPIURL,
                getGoogleTrackingCode,
                googleClient,
            }}
        >
          {children}
        </SecurityContext.Provider>
      );
}
    
export { SecurityContext, SecurityProvider };
    