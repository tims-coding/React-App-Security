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

const getGoogleTrackingCode = () => {
    return googleTrackingCode;
}

export const securityService = {
    logout,
    setEnvironment,
    getGoogleTrackingCode
};
