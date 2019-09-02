/**
 * 配置内容
 */
export interface Config {

    /**
     * 生成的模块名称: 不带大写字母的那种
     */
    name: string;

    /**
     * 输出的路径
     */
    path: string;

    /**
     * 标题, 例如: 客户列表, 用于浏览器tab标题和card.NzTitle
     */
    title: string;

    /**
     * 段标题: 例如客户, 用于"是否删除XXX", "修改XXX"等
     */
    label: string;

    /**
     * 所处模块
     */
    module: string;

    /**
     * 数据字段
     */
    fields: Field[];

    /**
     * 是否添加
     *   // 数字输入框百分号过滤器
     *   public readonly formatterPercent = (value: number) => `${value} %`;
     *   public readonly parserPercent = (value: string) => value.replace(' %', '');
     * 的内容
     */
    usePercentParseAndFormatter?: boolean;

    /**
     * 是否添加
     *   import * as moment from 'moment';
     * 的内容
     */
    useMoment?: boolean;

}

/**
 * 字段配置
 */
export interface Field {

    /**
     * 字段名称
     */
    name: string;

    /**
     * 类型
     */
    type: 'string' | 'number' | any;

    /**
     * 注释/label
     */
    comment?: string;

    /**
     * 分页列表配置
     */
    tableConfig?: TableConfig;

    /**
     * 搜索配置, 不存在则表示不是搜索字段
     */
    searchConfig?: HeaderSearchConfig;

    /**
     * 新增/修改弹窗表单设置, 不存在则表示不是修改添加字段
     */
    saveModalConfig?: SaveModalConfig;

    /**
     * 是否为选择器的字段; 如果该字段存在: 搜索添加处则会为下拉框
     */
    selector?: SelectorConfig;

}

/**
 * 分页列表配置
 */
export interface TableConfig {

    /**
     * 前缀
     */
    prefix?: string;

    /**
     * 后缀
     */
    suffix?: string;

    /**
     * 处理字段, 例如, 对字段预处理: 将data.name转换为data.name.substring(3)
     */
    parse?: (field: string) => string;

    /**
     * 字段预设宽度
     */
    width?: string | number;

    /**
     * 是否为超长字段, 为超长字段会使用以下格式
     * <code>
     *     <span class="ellipsis-text" style="width: width;" nz-tooltip [nzTitle]="data.xxx">{{ data.xxx }}</span>
     * </code>
     */
    overflow?: boolean;

}

/**
 * 表头搜索字段配置
 */
export interface HeaderSearchConfig {

    /**
     * 占位符, 不存在时使用: 字段.name + "模糊搜索"
     */
    placeholder?: string;

    /**
     * 是否为表头搜索, 有且等于true时将搜索字段放在表头
     */
    header?: boolean;

}

/**
 * 新增/修改弹窗表单设置
 */
export interface SaveModalConfig {

    /**
     * 初始化表单配置, 默认为: [ null ]
     */
    control?: string;

    /**
     * 默认错误提示
     */
    errorTip?: string;

    /**
     * 是否为必填, 这个为true仅仅是给label标签添加nzRequired属性, 不会自动添加Validators.required
     */
    required?: boolean;

    /**
     * 占位符, 默认为字段.name
     */
    placeholder?: string;

    /**
     * 空间宽度, 默认为8 -> 参考NG-ZORRO的grid
     */
    width?: number;

    /**
     * 默认值 -> 在this.form.reset()中使用的参数, 用于初始化/重置表单
     */
    defaultValue?: any;

}

/**
 * 下拉选择框配置
 */
export interface SelectorConfig {

    /**
     * 下拉选择项
     * value是字符串时, 加上引号
     */
    options: { label: string, value: any, color?: string }[];

}
