// 主要代码生成器
// 使用方式 ts-node CG.ts xxx.ts
// xxx.ts是配置文件的路径 -> 详情见config.ts

const fs = require('fs');
const path = require('path');

const printUsage = (): void => {
  console.log('使用方式 / Usage');
  console.log('ts-node CG.ts <options> 101.ts [102.ts ...]');
  console.log('options: ');
  console.log('  -? -h --help /? /h /help 打印这个使用方式 / print this document');
  console.log('  --tpl template.ts 使用指定的模板文件 / use template.ts as the template file to generate file');
  process.exit(0);
};

const parsedArgv = process.argv.map(i => i.toLowerCase());
if (
  parsedArgv.includes('-?') ||
  parsedArgv.includes('-h') ||
  parsedArgv.includes('--help') ||
  parsedArgv.includes('/?') ||
  parsedArgv.includes('/h') ||
  parsedArgv.includes('/help')
) {
  printUsage();
}

const { CommonUtils, FSUtils } = require('./utils');
import { Config } from './config';
import { Template } from './template';

// region 初始化使用的模板文件
const tplName = '--tpl';
const templateName = process.argv.find((it, i, l) => l[i - 1] === tplName);
let template: Template = require('./template');
template = templateName ? require(FSUtils.parseFilepath(templateName)) : template;
if (Object.keys(template).length === 0) {
  console.log('空白的模板文件!');
  process.exit(0);
}
// endregion

// region 初始化使用的配置文件
let configs = process.argv.includes(tplName) ? process.argv.slice(process.argv.indexOf(tplName) + 2) : [];
configs = configs.map(i => FSUtils.parseFilepath(i));
if (configs.length === 0) {
  printUsage();
}

// 循环读取文件
for (const configFile of configs) {
  let config: Config = null;
  try {
    config = require(configFile);
  } catch (e) {
    console.warn('读取配置文件失败:', e);
    continue;
  }

  // 获取字段最大的长度
  let fieldMaxLength = 0;
  for (const field of config.fields) {
    fieldMaxLength = field.name.length > fieldMaxLength ? field.name.length : fieldMaxLength;
  }
  fieldMaxLength++;

  for (const key in template) {
    if (!template.hasOwnProperty(key)) continue;
    // AbcDef
    const CamelName = CommonUtils.dashNameToCamel(config.name);
    // abcDef
    const camelName = CamelName[0].toLowerCase() + CamelName.substring(1);
    // ABC_DEF
    const UNDER_LINE = config.name.replace('-', '_').toUpperCase();
    // abc_def
    const under_line = UNDER_LINE.toLowerCase();
    // 生成文件 + 写入文件
    const filename = config.path + config.name + '.component.' + key;
    try {
      FSUtils.writeRows(filename, template[key](config, camelName, CamelName, UNDER_LINE, under_line, fieldMaxLength));
      console.log('已生成:', filename);
    } catch (e) {
      console.warn('写入文件失败:', e);
    }
  }
}
// endregion
