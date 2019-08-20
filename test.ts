import { Config } from './config';

const config: Config = {

    name: 'customer',
    path: './test/',
    title: '客户管理',
    label: '客户',
    module: 'customer',
    fields: [
        {
            name: 'name', type: 'string', comment: '姓名',
            searchConfig: { header: true },
            saveModalConfig: { control: '[ null, Validators.required ]', errorTip: '请输入客户姓名!' },
            tableConfig: {  },
        },
        {
            name: 'sex', type: 'number', comment: '性别',
            searchConfig: {  },
            saveModalConfig: { control: '[ null, Validators.required ]', errorTip: '请输入客户姓名!' },
            tableConfig: {  },
            selector: {
                options: [
                    { label: '女', value: 0, color: 'pink' },
                    { label: '男', value: 1, color: 'blue' },
                    { label: '其他', value: null, color: 'gray' },
                ],
            },
        }
    ],

};

module.exports = config;

// export default config;
