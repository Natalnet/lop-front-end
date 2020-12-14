import { useState } from 'react';

const usePagination = (numPage = 1, numDocsPerPage = 15)=> {
    const [ page, setPage ] = useState(numPage);
    const [ totalPages, setTotalPages ] = useState(1);
    const [ docsPerPage, setDocsPerPage ] = useState(numDocsPerPage);
    const [ totalDocs, setTotalDocs ] = useState(0);

    return { page, docsPerPage, totalPages, totalDocs, setDocsPerPage,setPage, setTotalPages, setTotalDocs};
}

export default usePagination;