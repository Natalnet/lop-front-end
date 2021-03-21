import styled from 'styled-components';
import TabMaterial from '@material-ui/core/Tab';


export const Tab = styled(TabMaterial)`
    &.Mui-selected, &.MuiTab-textColorPrimary.Mui-selected {
        outline: none;
        color:#467fcf;
    }
`;