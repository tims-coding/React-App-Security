import { userConstants } from '../../constants';
import { securityService } from '../../services';

export const securityActions = {
    setEnvironment,
    logout
};

function setEnvironment(username, email, from) {
    console.log(username, email, from);
    return dispatch => {
        dispatch(request({ username }));
        securityService.setEnvironment(username, email)
            .then(
                user => { 
                    dispatch(success(user));
                    // history.push(from);
                    window.location.href = from;
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    securityService.logout();
    return { type: userConstants.LOGOUT };
}