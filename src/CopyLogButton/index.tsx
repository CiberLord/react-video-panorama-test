import React from 'react';

import { notification, FloatButton } from 'antd';
import { logger } from '../logger';

export const CopyLogButton: React.FC = () => {
    const [api, contextHandler] = notification.useNotification();

    const handleClick = () => {
        if(logger.copyToClipboard()) {
            api.success({
                message: 'Logs successfully copied to clipboard!',
            });
        } else {
            api.error({
                message: 'Something wrong!'
            })
        }
    }
    return (
        <>
            {contextHandler}
            <FloatButton onClick={handleClick}/>
        </>
    )
}