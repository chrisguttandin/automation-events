module.exports = () => {
    return {
        'build': {
            cmd: 'npm run build'
        },
        'test-unit-browser': {
            cmd: 'npm run test:unit-browser'
        },
        'test-unit-node': {
            cmd: 'npm run test:unit-node'
        }
    };
};
