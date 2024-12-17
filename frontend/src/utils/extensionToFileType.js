const extensionToTypeMap = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'htm': 'html',
    'css': 'css',
    'md': 'markdown',
    'json': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'svg': 'svg',
}

export const extensionToFileType = (extension) => {
    if(!extension) return undefined;
    return extensionToTypeMap[extension];
}