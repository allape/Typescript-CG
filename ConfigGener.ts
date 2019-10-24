// 代码生成器配置文件生成器 -> 用来生成GC.ts需要的配置内容
// 使用方式 ts-node ConfigGener.ts [--host <数据库地址>] [--port <端口>] [--user <账号>] [--password <密码>] [--ignores <忽略的数据库字段, 以逗号分隔>] <数据库名> <表名>

import { Field } from './config';
const { CommonUtils, FSUtils } = require('./utils');
const path = require('path');

/**
 * 忽略的字段
 */
const escapedFields = [];

// region 读取配置

// 命令行中的参数
const args = process.argv.slice(2);

// 默认参数
let host = 'localhost';
let port = '3306';
let user = 'root';
let password = '';

const database = args[args.length - 2];
const tableName = args[args.length - 1];

for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
        case '--host': host = args[i + 1] ? args[i + 1] : (() => { throw new Error('无效的host!'); })(); break;
        case '--port': port = args[i + 1] ? args[i + 1] : (() => { throw new Error('无效的port!'); })(); break;
        case '--user': user = args[i + 1] ? args[i + 1] : (() => { throw new Error('无效的user!'); })(); break;
        case '--password': password = args[i + 1] ? args[i + 1] : (() => { throw new Error('无效的password!'); })(); break;
        case '--ignores':
          escapedFields.push(...(args[i + 1] ? args[i + 1].split(',') : (() => { throw new Error('无效的password!'); })()));
          break;
    }
}

// endregion

const mysql = require('mysql');
const pool = mysql.createPool({
    host    : host,
    port    : port,
    user    : user,
    password: password,
    database: database,
});

pool.getConnection((err, db) => {
    if (err) {
        console.error(err);
    } else {
        // 获取字段信息
        db.query(
          `SELECT COLUMN_NAME, DATA_TYPE, COLUMN_COMMENT FROM information_schema.columns ` +
          ` WHERE TABLE_SCHEMA = '${database}' AND TABLE_NAME = '${tableName}' ;`,
          (e, rows) => {
            if (e) {
                console.log(e);
                throw e;
            }

            // 整理字段数据
            const fields: Field[] = [];
            for (const row of rows) {
                if (escapedFields.includes(row.COLUMN_NAME)) continue;
                fields.push({
                    name: CommonUtils.underlineToCamel(row.COLUMN_NAME),
                    type: CommonUtils.typeConverter(row.DATA_TYPE),
                    comment: row.COLUMN_COMMENT,
                    saveModalConfig: { },
                    searchConfig: { },
                    tableConfig: { },
                });
            }

            // 获取表信息
            db.query(
              `SELECT TABLE_COMMENT FROM information_schema.tables ` +
              `WHERE TABLE_SCHEMA = '${database}' AND TABLE_NAME = '${tableName}'`,
              (e1, tableInfo) => {
                if (e1) throw e1;
                tableInfo = tableInfo[0].TABLE_COMMENT;

                const file = [
                  `import { Config } from './config';`,
                  ``,
                  `const config: Config = {`,
                  ``,
                  `  name: '${tableName}',`,
                  `  path: './',`,
                  `  title: '${tableInfo}',`,
                  `  label: '${tableInfo}',`,
                  `  module: '',`,
                  `  fields: ${JSON.stringify(fields, undefined, '')},`,
                  ``,
                  `};`,
                  ``,
                  `module.exports = config;`,
                  ``,
                ];

                const filename = '.' + path.sep + tableName + '.cg-config.ts';
                FSUtils.writeRows(filename, file);
                console.log('处理完成:', filename);

                db.release();
                pool.end(poolErr => poolErr ? console.log(poolErr) : null);
            });
        });
    }
});
