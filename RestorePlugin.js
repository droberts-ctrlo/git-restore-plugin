const { exec } = require('child_process');

class RestorePlugin {
    /**
     * Simple plugin to restore files after webpack build
     * @param {string | string[]} path Path(s) to restore
     */
    constructor(path) {
        if (path) {
            this.path = path;
        }
    }

    /**
     * Handle any message from the exec command
     * @param {any} err Error message
     * @param {any} stdout Standard output
     * @param {any} stderr Standard error output
     */
    handleMessage(err, stdout, stderr) {
        if (err) console.error(err);
        if (stderr) console.error(stderr);
        if (stdout) console.log(stdout);
    }

    /**
     * Apply the plugin to the compiler
     * @param {unknown} compiler The compiler instance
     */
    apply(compiler) {
        compiler.hooks.done.tap('RestorePlugin', () => {
            if (Array.isArray(this.path)) {
                for (const item of this.path) {
                    try {
                        exec(`git restore ${item}`, this.handleMessage);
                    } catch (e) {
                        console.error(e);
                    }
                }
            } else {
                try {
                    exec(`git restore ${this.path}`, this.handleMessage);
                } catch (e) {
                    console.error(e);
                }
            }
        });
    }
}

module.exports = RestorePlugin;