const util = require("util");
const exec = util.promisify(require("child_process").exec);
const {stat, rm, rmdir} = require("fs/promises");
const delay = (ms, params = {}) =>
    new Promise((res) => {
        setTimeout(() => {
            res(params);
        }, ms);
    });

async function runCommands(api, output) {
    try {
        let tasks = [];

        // 清空
        await exec(`rm -rf ${output}/*`);
        for (const apiKey in api) {
            const address = api[apiKey];
            tasks.push({
                cmd: `swagger-codegen generate -i ${address} -l typescript-axios -o ${output}/${apiKey} --ignore-import-mapping`,
                dir: `${output}/${apiKey}`
            });
        }

        for await (let apiKey of tasks) {
            console.count(`开始生成API`);
            const {stdout, stderr} = await exec(apiKey.cmd);

            //DESC 轮询检查是否已经成功生成
            let checkFile = setInterval(async () => {
                try {
                    const fileCheck = await new Promise(resolve => stat(`${apiKey.dir}/index.ts`).catch(e => {
                        resolve(false)
                    }).then(r => resolve(true)));

                    if (fileCheck) {
                        //TODO 检查是否成功生成、成功了开始清理无用文件
                        await rm(`${apiKey.dir}/tsconfig.json`)
                        await rm(`${apiKey.dir}/.swagger-codegen-ignore`)
                        await rm(`${apiKey.dir}/README.md`)
                        await rm(`${apiKey.dir}/package.json`)
                        await rm(`${apiKey.dir}/git_push.sh`)
                        await rm(`${apiKey.dir}/.gitignore`)
                        await rm(`${apiKey.dir}/.npmignore`)
                        // rm -rf
                        await rm(`${apiKey.dir}/.swagger-codegen`, {recursive: true, force: true})
                        clearInterval(checkFile)
                    }
                } catch (e) {
                    console.error('清理文件出错', e)
                    clearInterval(checkFile)
                }
            }, 3000)

            if (stderr) {
                console.error(`${apiKey}出错；${stderr}`);
            }
        }
    } catch (e) {
        console.error("出错"); // should contain code (exit code) and signal (that caused the termination).
        console.error(e)
    }
}

module.exports = runCommands
