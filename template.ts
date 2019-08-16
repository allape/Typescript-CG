import {Config} from './config';

/**
 * 生成模板使用的内容
 */
export interface Template {

  /**
   * @key 文件后缀名称, 例如ts、less、html、spec.ts等, 对应不同生成的文件
   * @param config 配置信息
   * @param camelName config.name的驼峰格式
   * @param CamelName config.name的驼峰格式, 并且头字母为大写
   * @param fieldMaxLength 字段最大长度 + 1
   * @return 生成的文件内容, 是个字符串数组, 每一个元素表示一行
   */
  [key: string]: (
    config: Config, camelName: string, CamelName: string,
    fieldMaxLength: number
  ) => string[];

}

module.exports = {

} as Template;
