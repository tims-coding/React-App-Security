import { useContext } from 'react';
import { SecurityContext } from '../contexts/securityContext';

const useAuth = () => useContext(SecurityContext);

export default useAuth;
