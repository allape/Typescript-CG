import { Template } from './template';
const { CommonUtils } = require('./utils');

const template: Template = {

  // TS文件
  ts: (config, camelName, CamelName, fieldMaxLength) => {
    const rows = [];

    rows.push(`import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';`);
    rows.push(`import {BaseComponent, BaseEntity, LabelValue, PageRes} from '../../../standards/base-component';`);
    rows.push(`import {FormBuilder, FormGroup, Validators} from '@angular/forms';`);
    rows.push(`import {NzMessageService, NzModalService} from 'ng-zorro-antd';`);
    rows.push(`import {Res, uris, url} from '../../../configs/http.config';`);
    rows.push(``);
    if (config.useMoment) {
      rows.push(`import * as moment from 'moment';`);
      rows.push(``);
    }
    rows.push(`@Component({`);
    rows.push(`  selector: 'app-${config.name}',`);
    rows.push(`  templateUrl: './${config.name}.component.html',`);
    rows.push(`  styleUrls: ['./${config.name}.component.less']`);
    rows.push(`})`);
    rows.push(`export class ${CamelName}Component extends BaseComponent implements OnInit {`);
    rows.push(``);
    rows.push(`  constructor(`);
    rows.push(`    private readonly fb: FormBuilder,`);
    rows.push(`    private readonly msg: NzMessageService,`);
    rows.push(`    private readonly modal: NzModalService,`);
    rows.push(`    private readonly injector: Injector,`);
    rows.push(`  ) {`);
    rows.push(`    super('${config.title}', injector);`);
    rows.push(`  }`);
    rows.push(``);
    rows.push(`  ngOnInit() {`);
    rows.push(`    this.load();`);
    rows.push(`  }`);
    rows.push(``);
    rows.push(`  // region 列表`);
    rows.push(``);
    rows.push(`  /**`);
    rows.push(`   * 分页列表数据`);
    rows.push(`   */`);
    rows.push(`  public page: PageRes<${CamelName}> = { list: [] };`);
    rows.push(``);
    rows.push(`  /**`);
    rows.push(`   * 搜索表单`);
    rows.push(`   */`);
    rows.push(`  public searchForm = this.fb.group({`);

    // 搜索表单字段
    const searchForm = [];
    for (const field of config.fields) {
      if (field.searchConfig) {
        searchForm.push(field);
      }
    }
    for (const field of searchForm) {
      rows.push(`    ${CommonUtils.fill(field.name + ':', fieldMaxLength)} [ null ],`);
    }

    rows.push(`  });`);
    rows.push(``);
    rows.push(`  /**`);
    rows.push(`   * @param page 页码`);
    rows.push(`   * @param size 数量`);
    rows.push(`   */`);
    rows.push(`  public load(page?: number, size?: number): void {`);
    rows.push(`    page = page && page > 0 ? page : 1;`);
    rows.push(`    size = size && size > 0 ? size : BaseComponent.DEFAULT_PAGE_SIZE;`);
    rows.push(``);
    rows.push(`    this.http.get<Res<PageRes<${CamelName}>>>(`);
    rows.push(`      url(uris.${config.module}.${camelName}.page, page, size),`);
    rows.push(`      { params: BaseComponent.getNonnullValue(this.searchForm) }`);
    rows.push(`    ).subscribe(res => {`);
    rows.push(`      this.page = res.data;`);
    rows.push(`    });`);
    rows.push(`  }`);
    rows.push(``);
    rows.push(`  // endregion`);
    rows.push(``);
    rows.push(`  // region 增删改`);
    rows.push(``);
    if (config.usePercentParseAndFormatter === true) {
      rows.push(`  // 数字输入框百分号过滤器`);
      rows.push(`  public readonly formatterPercent = (value: number) => \`\${value} %\`;`);
      rows.push(`  public readonly parserPercent = (value: string) => value.replace(' %', '');`);
      rows.push(``);
    }
    rows.push(`  /**`);
    rows.push(`   * 是否为只读表单`);
    rows.push(`   */`);
    rows.push(`  public formReadonly = false;`);
    rows.push(``);
    rows.push(`  /**`);
    rows.push(`   * 新增修改表单`);
    rows.push(`   */`);
    rows.push(`  public form: FormGroup = this.fb.group({`);
    // 新增修改表单字段
    const saveForm = [];
    for (const field of config.fields) {
      if (field.saveModalConfig) {
        saveForm.push(field);
      }
    }
    rows.push(`    ${CommonUtils.fill('id:', fieldMaxLength)} [ null ],`);
    for (const field of saveForm) {
      rows.push(
        `    ${CommonUtils.fill(field.name + ':', fieldMaxLength)} ` +
        `${field.saveModalConfig.control ? field.saveModalConfig.control : '[ null ]'},`
      );
    }
    rows.push(`  });`);
    rows.push(``);
    rows.push(`  /**`);
    rows.push(`   * 表单默认填充数据`);
    rows.push(`   */`);
    rows.push(`  public readonly defaultFormPatchValue = {`);
    for (const field of saveForm) {
      if (field.saveModalConfig.defaultValue) {
        rows.push(`    ${CommonUtils.fill(field.name + ':', fieldMaxLength)} ${field.saveModalConfig.defaultValue},`);
      }
    }
    rows.push(`  };`);
    rows.push(``);
    rows.push(`  /**`);
    rows.push(`   * 新增修改用到的模板`);
    rows.push(`   */`);
    rows.push(`  @ViewChild('saveFormTpl', { static: true })`);
    rows.push(`  public saveFormTpl: TemplateRef<any>;`);
    rows.push(``);
    rows.push(`  /**`);
    rows.push(`   * 显示新增修改的弹窗`);
    rows.push(`   * @param item 修改时回填的内容`);
    rows.push(`   * @param readonly 是否只读`);
    rows.push(`   */`);
    rows.push(`  public showSaveDialog(item?: ${CamelName}, readonly: boolean = false): void {`);
    rows.push(`    this.form.reset(this.defaultFormPatchValue);`);
    rows.push(`    this.formReadonly = readonly;`);
    rows.push(``);
    rows.push(`    if (item) {`);
    rows.push(`      this.form.patchValue(item);`);
    rows.push(`    }`);
    rows.push(``);
    rows.push(`    const modalRef = this.modal.create({`);
    rows.push(`      nzTitle: item ? '修改${config.label}' : '新增${config.label}',`);
    rows.push(`      nzContent: this.saveFormTpl,`);
    rows.push(`      nzWidth: 800,`);
    rows.push(`      nzStyle: { top: '20px' },`);
    rows.push(`      nzFooter: this.formReadonly ? null : undefined,`);
    rows.push(`      nzOnOk: () => {`);
    rows.push(`        return this.doSaveModal(this.form, url(uris.${config.module}.${camelName}.${camelName}));`);
    rows.push(`      },`);
    rows.push(`    });`);
    rows.push(`    modalRef.afterClose.subscribe(() => this.load());`);
    rows.push(`    modalRef.open();`);
    rows.push(`  }`);
    rows.push(``);
    rows.push(`  /**`);
    rows.push(`   * 删除`);
    rows.push(`   * @param id ID`);
    rows.push(`   */`);
    rows.push(`  public del(id: string): void {`);
    rows.push(`    this.http.delete(url(uris.${config.module}.${camelName}.${camelName}, id)).subscribe(() => {`);
    rows.push(`      this.msg.success('删除成功!');`);
    rows.push(`      this.load();`);
    rows.push(`    });`);
    rows.push(`  }`);
    rows.push(``);
    rows.push(`  // endregion`);
    rows.push(``);
    rows.push(`}`);
    rows.push(``);
    rows.push(`export interface ${CamelName} extends BaseEntity {`);
    rows.push(``);
    for (const field of config.fields) {
      rows.push(`  // ${field.comment ? field.comment : field.name}`);
      rows.push(`  ${field.name}?: ${field.type};`);
    }
    rows.push(``);
    rows.push(`}`);
    rows.push(``);
    return rows;
  },

  // HTML文件
  html: config => {
    const rows = [];

    const tableFields = config.fields.filter(i => i.tableConfig);
    const headerSearchFields = config.fields.filter(i => i.searchConfig && i.searchConfig.header === true);
    const extraSearchFields = config.fields.filter(i => i.searchConfig && i.searchConfig.header !== true);

    rows.push(`<nz-card class="page-card" [nzTitle]="titleTpl"${ extraSearchFields.length > 0 ? ' [nzExtra]="extraTpl"' : '' }>`);
    rows.push(`  <nz-table #table`);
    rows.push(`            [nzLoading]="loading.loading()"`);
    rows.push(`            [nzScroll]="getAvailableTableScroll(0)"`);
    rows.push(`            [nzShowTotal]="tableRangeTpl"`);
    rows.push(`            [nzFrontPagination]="false"`);
    rows.push(`            nzShowPagination nzShowSizeChanger`);
    rows.push(`            [nzData]="page.list"`);
    rows.push(`            [nzTotal]="page.total" [nzPageIndex]="page.pageNum" [nzPageSize]="page.pageSize"`);
    rows.push(`            (nzPageIndexChange)="load($event);" (nzPageSizeChange)="load(1, $event);"`);
    rows.push(`  >`);
    rows.push(`    <thead>`);
    rows.push(`    <tr>`);
    for (const field of tableFields) {
      rows.push(`      <th${field.tableConfig.width ? ' nzWidth="' + field.tableConfig.width + '"' : ''}>` +
        `${field.comment ? field.comment : field.name}</th>`);
    }
    rows.push(`      <th>操作</th>`);
    rows.push(`    </tr>`);
    rows.push(`    </thead>`);
    rows.push(`    <tbody>`);
    rows.push(`    <tr *ngFor="let data of table.data">`);
    for (const field of tableFields) {
      rows.push(
        `      <td>${field.tableConfig.prefix ? field.tableConfig.prefix : ''}` +
        `{{ ${field.tableConfig.parse ? field.tableConfig.parse('data.' + field.name) : ('data.' + field.name)} }}` +
        `${field.tableConfig.suffix ? field.tableConfig.suffix : ''}</td>`);
    }
    rows.push(`      <td>`);
    rows.push(`        <a (click)="showSaveDialog(data);">修改</a>`);
    rows.push(`        <nz-divider nzType="vertical"></nz-divider>`);
    rows.push(`        <a nz-popconfirm nzTitle="确定删除该${config.label}?" (nzOnConfirm)="del(data.id);">删除</a>`);
    rows.push(`      </td>`);
    rows.push(`    </tr>`);
    rows.push(`    </tbody>`);
    rows.push(`  </nz-table>`);
    rows.push(`</nz-card>`);
    rows.push(``);
    rows.push(`<!-- 卡片标题模板 -->`);
    rows.push(`<ng-template #titleTpl>`);
    rows.push(`  <div nz-row nzGutter="10" nzType="flex" nzJustify="space-around" nzAlign="middle" class="page-title">`);
    rows.push(`    <div nz-col nzLg="4" nzSpan="24"><span>{{getTitle()}}</span></div>`);
    rows.push(`    <div nz-col nzLg="20" nzSpan="24">`);
    rows.push(`      <form nz-form [formGroup]="searchForm">`);
    rows.push(`        <div nz-row nzGutter="10" nzType="flex" nzJustify="space-around" nzAlign="middle">`);
    for (const field of headerSearchFields) {
      rows.push(`          <div nz-col nzLg="8" nzSpan="24">`);
      rows.push(`            <nz-form-item>`);
      rows.push(
        `              <nz-form-label [nzSpan]="6" nzFor="${field.name}_">` +
        `${field.comment ? field.comment : field.name}</nz-form-label>`
      );
      rows.push(`              <nz-form-control [nzSpan]="18">`);
      rows.push(
        `                <input nz-input formControlName="${field.name}" ` +
        `id="${field.name}_" placeholder="` +
        `${field.searchConfig.placeholder ? field.searchConfig.placeholder : ((field.comment ? field.comment : field.name) + '模糊搜索')}">`
      );
      rows.push(`              </nz-form-control>`);
      rows.push(`            </nz-form-item>`);
      rows.push(`          </div>`);
    }
    rows.push(`          <div nz-col nzLg="8" nzSpan="24" class="page-title-buttons">`);
    rows.push(`            <nz-button-group>`);
    rows.push(
      `              <button nz-button nzType="primary" [nzLoading]="loading.loading()" (click)="load();">` +
      `<i nz-icon nzType="search" nzTheme="outline"></i> 搜索</button>`
    );
    rows.push(
      `              <button nz-button [nzLoading]="loading.loading()" (click)="this.searchForm.reset(); load();">` +
      `<i nz-icon nzType="redo" nzTheme="outline"></i> 清空</button>`
    );
    rows.push(`            </nz-button-group>`);
    rows.push(`            <nz-divider nzType="vertical"></nz-divider>`);
    rows.push(
      `            <button nz-button nzType="primary" [nzLoading]="loading.loading()" (click)="showSaveDialog();">` +
      `<i nz-icon nzType="plus-square" nzTheme="outline"></i> 新增</button>`
    );
    rows.push(`          </div>`);
    rows.push(`        </div>`);
    rows.push(`      </form>`);
    rows.push(`    </div>`);
    rows.push(`  </div>`);
    rows.push(`</ng-template>`);
    if (extraSearchFields.length > 0) {
      rows.push(`<!-- 卡片额外内容模板 -->`);
      rows.push(`<ng-template #extraTpl>`);
      rows.push(`  <button nz-button nzType="link"`);
      rows.push(`          nz-popover nzTitle="高级搜索" [nzContent]="extraPopoverTpl"`);
      rows.push(`          nzTrigger="click" nzPlacement="bottomRight">`);
      rows.push(`    <i nz-icon nzType="down" nzTheme="outline"></i>`);
      rows.push(`  </button>`);
      rows.push(`</ng-template>`);
      rows.push(`<!-- 卡片额外内容弹出的模板 -->`);
      rows.push(`<ng-template #extraPopoverTpl>`);
      rows.push(`  <form nz-form [formGroup]="searchForm" nzLayout="vertical" style="width: 600px;">`);
      rows.push(`    <div nz-row nzGutter="10">`);
      for (const field of extraSearchFields) {
        rows.push(`      <div nz-col nzSpan="8">`);
        rows.push(`        <nz-form-item>`);
        rows.push(
          `          <nz-form-label nzFor="${field.name}_">` +
          `${field.comment ? field.comment : field.name}</nz-form-label>`
        );
        rows.push(`          <nz-form-control>`);
        rows.push(
          `            <input nz-input id="${field.name}_" ` +
          `formControlName="${field.name}" placeholder="` +
          `${field.searchConfig.placeholder ? field.searchConfig.placeholder : ((field.comment ? field.comment : field.name) + '模糊搜索')}">`
        );
        rows.push(`          </nz-form-control>`);
        rows.push(`        </nz-form-item>`);
        rows.push(`      </div>`);
      }
      rows.push(`    </div>`);
      rows.push(`  </form>`);
      rows.push(`</ng-template>`);
    }
    rows.push(``);
    rows.push(`<!-- 分页显示的模板 -->`);
    rows.push(`<ng-template #tableRangeTpl>`);
    rows.push(`  显示{{page.startRow}}到{{page.endRow}} 共{{page.total}}条数据`);
    rows.push(`</ng-template>`);
    rows.push(``);
    rows.push(`<!-- 新增/修改的模板 -->`);
    rows.push(`<ng-template #saveFormTpl>`);
    rows.push(`  <form nz-form [formGroup]="form" nzLayout="vertical">`);
    rows.push(`    <div nz-row nzGutter="10">`);
    for (const field of config.fields) {
      if (field.saveModalConfig) {
        rows.push(`      <div nz-col nzSpan="${field.saveModalConfig.width ? field.saveModalConfig.width : '8'}">`);
        rows.push(`        <nz-form-item>`);
        rows.push(
          `          <nz-form-label nzFor="${field.name}"` +
          `${field.saveModalConfig.required ? ' nzRequired' : ''}>${field.comment ? field.comment : field.name}</nz-form-label>`
        );
        rows.push(
          `          <nz-form-control${field.saveModalConfig.errorTip ? ' nzErrorTip="' + field.saveModalConfig.errorTip + '"' : ''}>`
        );
        rows.push(
          `            <input nz-input id="${field.name}" ` +
          `[readonly]="formReadonly" ` +
          `formControlName="${field.name}" ` +
          `placeholder="` +
          `${field.saveModalConfig.placeholder ? field.saveModalConfig.placeholder : field.comment ? field.comment : field.name}">`
        );
        rows.push(`          </nz-form-control>`);
        rows.push(`        </nz-form-item>`);
        rows.push(`      </div>`);
      }
    }
    rows.push(`    </div>`);
    rows.push(`  </form>`);
    rows.push(`</ng-template>`);
    rows.push(``);
    return rows;
  },

  // spec.ts文件
  'spec.ts': (config, camelName, CamelName) => {
    const rows = [];
    rows.push(`import { async, ComponentFixture, TestBed } from '@angular/core/testing';`);
    rows.push(``);
    rows.push(`import { ${CamelName} } from './${config.name}.component';`);
    rows.push(``);
    rows.push(`describe('${CamelName}Component', () => {`);
    rows.push(`  let component: ${CamelName}Component;`);
    rows.push(`  let fixture: ComponentFixture<${CamelName}Component>;`);
    rows.push(``);
    rows.push(`  beforeEach(async(() => {`);
    rows.push(`    TestBed.configureTestingModule({`);
    rows.push(`      declarations: [ ${CamelName}Component ]`);
    rows.push(`    })`);
    rows.push(`    .compileComponents();`);
    rows.push(`  }));`);
    rows.push(``);
    rows.push(`  beforeEach(() => {`);
    rows.push(`    fixture = TestBed.createComponent(${CamelName}Component);`);
    rows.push(`    component = fixture.componentInstance;`);
    rows.push(`    fixture.detectChanges();`);
    rows.push(`  });`);
    rows.push(``);
    rows.push(`  it('should create', () => {`);
    rows.push(`    expect(component).toBeTruthy();`);
    rows.push(`  });`);
    rows.push(`});`);
    rows.push(``);
    return rows;
  },

  // LESS文件
  less: () => []

};

module.exports = template;