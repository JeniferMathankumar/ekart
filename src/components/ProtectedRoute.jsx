import { useSelector } from 'react-redux';
import {Navigate} from 'react-router-dom'
function ProtectedRoute({children}){
 const {token,role} = useSelector((state) => state.profile);

    if(role === "USER"){
        return <Navigate to='/' replace/>;
    }
    return children;
}
export default ProtectedRoute;