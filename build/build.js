#!/bin/nodejs

const manifest = require('../manifest.json');
const package_base = require('../package.json');
const ncp = require('ncp').ncp;
const fs = require('fs');

async function build() {

    /**
     * Step 1: Build the manifest object.
     */
    console.log('Building manifest object...');

    manifest.version = package_base.version;
    manifest.author = package_base.author;
    manifest.description = package_base.description;
    manifest.homepage_url = package_base.homepage;

    /**
     * Step 2: Copy the source code.
     */

    console.log('Copying source code...');
    async function copyFiles() {
        return new Promise(function (resolve, reject) {
            ncp('src', 'dist', function (error) {
                if (error) {
                    reject(error)
                }
                resolve();
            });
        });
    }

    await copyFiles();

    /**
     * Step 3: Create the distributable manifest file.
     */

    console.log('Creating manifest file...');
    let manifestWriteStream = fs.createWriteStream('dist/manifest.json');

    manifestWriteStream.write(JSON.stringify(manifest));
    manifestWriteStream.close();

    console.log('Done!');
}

return build();
