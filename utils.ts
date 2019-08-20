const fs = require('fs');
const path = require('path');

/**
 * 常用/其他工具类
 */
class CommonUtils {

  /**
   * 将以-分割的名称转为驼峰
   * @param name 转换的名称
   * @param firstCap 首字母是否大写
   */
  public static dashNameToCamel(name: string, firstCap: boolean = false): string {
    const pieces = name.split('-');
    return (firstCap ? pieces[0] : '') +
      pieces.slice(firstCap ? 1 : 0).map(i => i.length > 0 ? i[0].toUpperCase() + i.substring(1) : '').join('');
  }

  /**
   * 向一个方向填充字符
   * @param value         转换的值
   * @param length        填充至的长度
   * @param direction     填充的方向
   * @param placeholder   填充的值
   */
  public static fill(value: string, length: number, direction: 'left' | 'right' = 'right', placeholder: string = ' '): string  {
    if (value.length < length) {
      for (let i = value.length; i < length; i++) {
        if (direction === 'right') {
          value += placeholder;
        } else {
        value = placeholder + value;
      }
      }
    }
    return value;
  }

  /**
   * 下划线转驼峰
   * @param underline 下划线字符串
   */
  public static underlineToCamel(underline: string): string {
    const pieces = underline.split('_');
    return pieces[0] + pieces.splice(1).map(i => i[0].toUpperCase() + i.substring(1)).join('');
  }

  /**
   * 驼峰转下划线
   * @param camel 驼峰字符串
   */
  public static camelToUnderline(camel: string): string {
    return camel ? camel[0].toLowerCase() + camel.substring(1).replace(/(?=[A-Z])/g, '_') : camel;
  }


  /**
   * 类型转换器, 将数据库类型转换成ts类型
   * @param dbType 数据库类型
   */
  public static typeConverter(dbType: string): string {
    switch (dbType) {
      case 'tinyint':
      case 'smallint':
      case 'int':
      case 'bigint':
      case 'float':
      case 'double':
      case 'decimal': return 'number';
      case 'date':
      case 'time':
      case 'datetime':
      case 'timestamp':
      case 'longtext':
      case 'mediumtext':
      case 'text':
      case 'enum':
      case 'char':
      case 'varchar': return 'string';
      case 'set':
      case 'blob':
      case 'mediumblob':
      case 'longblob':
      default: return 'any';
    }
  }

}

/**
 * 文件工具类
 */
class FSUtils {

  /**
   * 格式化文件格式 -> 最主要的操作就是将当前路径的文件前添加一个./或.\
   * @param filepath 文件路径
   */
  public static parseFilepath(filepath: string): string {
    return /^([a-zA-Z]:[\/\\]|\/|\.[\/\\])/.test(filepath) ? filepath : ('.' + path.sep + filepath);
  }

  /**
   * 创建文件夹
   * @param folder 创建的路径
   * @return true: 成功创建, false: 创建失败(可能是已存在或者其他什么的)
   */
  public static mkdir(folder: string): boolean {
    if (!fs.existsSync(folder)) {
      try {
        fs.mkdirSync(folder);
        return true;
      } catch (e) {
        console.warn(e);
      }
    }
    return false;
  }

  /**
   * 将字符串数组写入文件
   * @param filename 文件路径
   * @param rows 写入的字符串数组
   * @param separator 数组原属分隔符
   */
  public static writeRows(
    filename: string, rows: string[],
    separator: string = '\r\n'
  ): void {
    this.mkdir(filename.substring(0, filename.lastIndexOf(path.sep)));
    fs.writeFileSync(filename, rows.join(separator));
  }

}

module.exports = {
  CommonUtils, FSUtils
};
