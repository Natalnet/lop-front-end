import React from 'react';
import Card from '../card/card.component'
const TabPanel = ({ children, value, index, ...rest }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...rest}
        >
            {value === index && (
                <Card className='w-100 pt-4 pb-4 pl-2 pr-2'>
                    {children}
                </Card>
            )}
        </div>
    );
}

export default TabPanel;