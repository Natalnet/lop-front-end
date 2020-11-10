import {useCallback} from 'react';
import api from '../services/api';
import { findLocalIp } from '../util/auxiliaryFunctions.util'
const useAccess = ()=> {

    const saveAccess = useCallback(async (idQuestion)=>{
        const ip = await findLocalIp(false);
        const request = {
          ip: ip[0],
          environment: "desktop",
          idQuestion,
        };
        try {
          await api.post(`/access/store`, request);
        } catch (err) {
          console.log(err);
        }
    },[]);
    
    return {saveAccess};
}

export default useAccess;