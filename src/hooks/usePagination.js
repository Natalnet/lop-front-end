import { useState } from 'react';

const usePagination = (initalPage = 1, initialDocsPerPage = 15)=> {
    const [ page, setPage ] = useState(initalPage);
    const [ totalPages, setTotalPages ] = useState(1);
    const [ docsPerPage, setDocsPerPage ] = useState(initialDocsPerPage);
    const [ totalDocs, setTotalDocs ] = useState(0);

    return { page, docsPerPage, totalPages, totalDocs, setDocsPerPage,setPage, setTotalPages, setTotalDocs};
}

export default usePagination;