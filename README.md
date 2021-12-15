#
## 请先安装
```shell
brew install swagger-codegen
```
```shell
npm install spider-generate-api --save-dev
```
[https://github.com/swagger-api/swagger-codegen](https://github.com/swagger-api/swagger-codegen)

## 运行
```shell
spider-generate-api  -o ./api -c ../api-address.json
# spider-generate-api  -o 文件生成地址 -c config 地址
```

## json 文件示例
```json
{
  "media": "./v3/api-docs",
  "sys": "http://xxx.xx.xx.xx:18086/sys/v3/api-docs"
}
```
**key值将作为文件夹名称来存放生成的代码文件**