module.exports = (grunt) => {
    const continuous = grunt.option('continuous') === true;

    return {
        'build': {
            cmd: 'npm run build'
        },
        'lint-config': {
            cmd: 'npm run lint:config'
        },
        'lint-src': {
            cmd: 'npm run lint:src'
        },
        'lint-test': {
            cmd: 'npm run lint:test'
        },
        'test-unit-browser': {
            cmd: `karma start config/karma/config-unit.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-unit-node': {
            cmd: 'mocha --bail --parallel --recursive --require config/mocha/config-unit.js test/unit'
        }
    };
};
