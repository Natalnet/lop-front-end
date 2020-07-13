

import styled from 'styled-components';
import { Pagination as PaginationUI } from '@material-ui/lab';

export const Pagination = styled(PaginationUI)`
    .MuiPaginationItem-textPrimary.Mui-selected{
        background: #467fcf;
    }
    button:focus{
        outline: none;
    }
    ul.MuiPagination-ul{
        justify-content: center;
    }
`