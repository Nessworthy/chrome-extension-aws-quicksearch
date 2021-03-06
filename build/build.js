#!/bin/nodejs

const manifest = require('../manifest.json');
const package_base = require('../package.json');
const ncp = require('ncp').ncp;
const fs = require('fs');
const rimraf = require('rimraf');
const admZip = require('adm-zip');

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
     * Step 2: Clear build directory.
     */
    console.log('Clearing build directory...');
    rimraf.sync(process.cwd() + '/dist')

    /**
     * Step 3: Copy the source code.
     */

    console.log('Copying source code...');

    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }

    if (!fs.existsSync('dist/unpacked')) {
        fs.mkdirSync('dist/unpacked');
    }

    async function copyFiles() {
        return new Promise(function (resolve, reject) {
            ncp('src', 'dist/unpacked', function (error) {
                if (error) {
                    reject(error)
                }
                resolve();
            });
        });
    }

    try {
        await copyFiles();
    } catch(err) {
        console.error(err);
        return false;
    }

    /**
     * Step 4: Inject values as desired.
     */
    console.log('Injecting dynamic data...');

    await new Promise((res, rej) => {
        fs.readFile('dist/unpacked/actions/help/index.html', (err, data) => {
            if (err) {
                rej(err);
                return;
            }
            data = data.toString().replace(/{{VERSION}}/g, package_base.version)

            fs.writeFile('dist/unpacked/actions/help/index.html', data, 'utf8', (err) => {
                if (err) {
                    rej(err);
                    return;
                }
                res();
            })
        })
    });

    /**
     * Step 5: Create the distributable manifest file.
     */

    console.log('Creating manifest file...');
    let manifestWriteStream = fs.createWriteStream('dist/unpacked/manifest.json');

    await new Promise((res, rej) => {
        manifestWriteStream.write(JSON.stringify(manifest), err => {
            manifestWriteStream.close();
            if (err) {
                rej(err);
                return;
            }
            res();
        });
    })


    /**
     * Step 6: Zip archive
     */
    console.log('Creating ZIP archive...');
    let zip = new admZip();

    zip.addLocalFolder('dist/unpacked');

    zip.writeZip(process.cwd() + '/dist/packed.zip')

    console.log('Done!');

}

return build();
