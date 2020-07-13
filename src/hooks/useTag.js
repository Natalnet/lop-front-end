import { useState, useCallback } from 'react';
import api from '../services/api';
// import { Container } from './styles';

const useTag = ()=> {
  const [tags, setTags] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [isErrorTag, setErrorTag] = useState(null);

  const getTags = useCallback(async ()=>{
    setIsLoadingTags(true);
    setErrorTag(null);
    try{
        const response = await api.get(`/tag`);
        setTags(response.data);
    }
    catch(err){
        setErrorTag(err);
    }
    setIsLoadingTags(false);
  })

  return { tags, isLoadingTags, isErrorTag,  getTags }
}

export default useTag;