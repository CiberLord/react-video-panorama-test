import React from 'react';

import cn from 'classnames';

import styles from './styles.module.css';

export const Card: React.FC<React.PropsWithChildren & { className?: string }> = ({ className, children }) => {
    return <div className={cn(className, styles.container)}>{children}</div>
}