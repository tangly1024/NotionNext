// 操作提示标签
import React from 'react';

const ShortcutTag = ({ children, className }) => {
    return <div className={`border-gray-300 dark:text-gray-400 text-gray-400 text-xs px-1 rounded border inline-block ${className}`}>{children}</div>
}
export default ShortcutTag