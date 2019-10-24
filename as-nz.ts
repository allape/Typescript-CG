import { Template } from './template';
const { CommonUtils } = require('./utils');

/**
 * 创建正常的增删改查的列表
 */
const template: Template = {

  // TS文件
  '.component.ts': (config, camelName, CamelName, UNDER_LINE, under_line, fieldMaxLength) => {
    const rows = [];

    rows.push(`import {Component, Injector} from '@angular/core';`);
    rows.push(`import {BaseComponent, LabelValue, Page, STATUSES} from '../../../standards/base-component';`);
    rows.push(`import {Validators} from '@angular/forms';`);
    rows.push(`import {Observable} from 'rxjs';`);
    rows.push(`import {uris} from '../../../configs/http.config';`);
    rows.push(``);
    rows.push(`@Component({`);
    rows.push(`  selector: 'app-${config.name}',`);
    rows.push(`  templateUrl: './${config.name}.component.html',`);
    rows.push(`  styleUrls: ['./${config.name}.component.less']`);
    rows.push(`})`);
    rows.push(`export class ${CamelName}Component extends BaseComponent<${CamelName}> {`);
    rows.push(``);
    rows.push(`  path = uris.${config.module}.${camelName};`);
    rows.push(`  title = '${config.title}';`);
    rows.push(`  label = '${config.label}';`);
    rows.push(`  TABLE_X = '1200px';`);
    rows.push(``);
    for (const field of config.fields) {
      if (field.selector) {
        rows.push(`  // ${field.comment}下拉选择内容`);
        rows.push(`  public readonly ${UNDER_LINE}_${CommonUtils.camelToUnderline(field.name).toUpperCase()}: LabelValue[] = [`);
        for (const option of field.selector.options) {
          rows.push(`    { label: '${option.label}', value: ${option.value}${option.color ? `, color: '${option.color}'` : ''} },`);
        }
        rows.push(`  ];`);
        rows.push(``);
      }
    }
    const dateFields = config.fields.filter(i => i.type.includes('Date'));
    if (dateFields.length > 0) {
      rows.push(`  private readonly DATETIME_FIELDS = [`);
      for (const f of dateFields) {
        rows.push(`    '${f.name}',`);
      }
      rows.push(`  ];`);
      rows.push(``);
    }
    rows.push(`  constructor(`);
    rows.push(`    public readonly injector: Injector,`);
    rows.push(`  ) {`);
    rows.push(`    super(injector);`);
    rows.push(`  }`);
    rows.push(``);
    rows.push(`  public search = this.fb.group({`);

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
    rows.push(`  public save: FormGroup = this.fb.group({`);
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
  '.component.html': (config, camelName, CamelName, UNDER_LINE) => {
    const rows = [];

    const tableFields = config.fields.filter(i => i.tableConfig);
    const headerSearchFields = config.fields.filter(i => i.searchConfig && i.searchConfig.header === true);
    const extraSearchFields = config.fields.filter(i => i.searchConfig && i.searchConfig.header !== true);

    rows.push(`<nz-card class="page-card" [nzTitle]="titleTpl">`);
    rows.push(`  <nz-table`);
    rows.push(`            [nzLoading]="loading.loading()"`);
    rows.push(`            [nzScroll]="TABLE_XY"`);
    rows.push(`            [nzShowTotal]="tableRangeTpl"`);
    rows.push(`            [nzFrontPagination]="false"`);
    rows.push(`            nzShowPagination nzShowSizeChanger`);
    rows.push(`            [nzData]="page.list"`);
    rows.push(`            [nzTotal]="page.total" [nzPageIndex]="page.page" [nzPageSize]="page.size"`);
    rows.push(`            (nzPageIndexChange)="load($event);" (nzPageSizeChange)="load(0, $event);"`);
    rows.push(`  >`);
    rows.push(`    <thead>`);
    rows.push(`    <tr>`);
    for (const field of tableFields) {
      rows.push(`      <th${field.tableConfig.width ? ' nzWidth="' + field.tableConfig.width + 
          (typeof field.tableConfig.width === 'number' ? 'px' : '') + '"' : ''}>` +
        `${field.comment ? field.comment : field.name}</th>`);
    }
    rows.push(`      <th nzWidth="120px" nzRight="0">操作</th>`);
    rows.push(`    </tr>`);
    rows.push(`    </thead>`);
    rows.push(`    <tbody>`);
    rows.push(`    <tr *ngFor="let data of page.list">`);
    for (const field of tableFields) {
      if (field.selector) {
        const selectionName = `${UNDER_LINE}_${CommonUtils.camelToUnderline(field.name).toUpperCase()}`;
        rows.push(`      <td>`);
        rows.push(`        <nz-tag *ngIf="!inLabelValues(${selectionName}, data.${field.name})" nz-dropdown [nzDropdownMenu]="${field.name}DropdownMenu" nzColor="gray">未知</nz-tag>`);
        rows.push(`        <ng-container *ngFor="let i of ${selectionName}">`);
        rows.push(`          <nz-tag *ngIf="data.${field.name} === i.value" [nzColor]="i.color"`);
        rows.push(`                  nz-dropdown [nzDropdownMenu]="${field.name}DropdownMenu">{{ i.label }}</nz-tag>`);
        rows.push(`        </ng-container>`);
        rows.push(`        <nz-dropdown-menu #${field.name}DropdownMenu="nzDropdownMenu">`);
        rows.push(`          <ul nz-menu nzSelectable style="text-align: center;">`);
        rows.push(`            <li *ngFor="let i of ${selectionName}" nz-menu-item`);
        rows.push(`                (click)="change${field.name[0].toUpperCase() + field.name.substring(1)}(data.id, i.value);" [ngStyle]="{ color: i.color }">{{i.label}}</li>`);
        rows.push(`          </ul>`);
        rows.push(`        </nz-dropdown-menu>`);
        rows.push(`      </td>`);
      } else {
        if (field.tableConfig.overflow) {
          rows.push(`      <td>`);
          rows.push(
              `        <span class="ellipsis-text" style="width: ` +
              `${field.tableConfig.width ? (parseInt(field.tableConfig.width as string, 10) - 80) + 'px' : '220px'};" ` +
              `nz-tooltip [nzTitle]="data.${field.name}">` +
              `${field.tableConfig.prefix ? field.tableConfig.prefix : ''}` +
              `{{ ${field.tableConfig.parse ? field.tableConfig.parse('data.' + field.name) : ('data.' + field.name)} }}` +
              `${field.tableConfig.suffix ? field.tableConfig.suffix : ''}` +
              `</span>`
          );
          rows.push(`      </td>`);
        } else {
          rows.push(
              `      <td>${field.tableConfig.prefix ? field.tableConfig.prefix : ''}` +
              `{{ ${field.tableConfig.parse ? field.tableConfig.parse('data.' + field.name) : ('data.' + field.name)} }}` +
              `${field.tableConfig.suffix ? field.tableConfig.suffix : ''}</td>`);
        }
      }
    }
    rows.push(`      <td nzRight="0">`);
    rows.push(`        <a (click)="showSaveDialog(data);">修改</a>`);
    rows.push(`        <nz-divider nzType="vertical"></nz-divider>`);
    rows.push(`        <a nz-popconfirm [nzTitle]="'确定删除该' + label + '?'" (nzOnConfirm)="del(data.id);">删除</a>`);
    rows.push(`      </td>`);
    rows.push(`    </tr>`);
    rows.push(`    </tbody>`);
    rows.push(`  </nz-table>`);
    rows.push(`</nz-card>`);
    rows.push(``);
    rows.push(`<!-- 卡片标题模板 -->`);
    rows.push(`<ng-template #titleTpl>`);
    rows.push(`  <div nz-row nzGutter="10" nzType="flex" nzJustify="space-around" nzAlign="middle" class="page-title">`);
    rows.push(`    <div nz-col nzLg="4" nzSpan="24" class="ellipsis-text"><span nz-tooltip [nzTitle]="title">{{ title }}</span></div>`);
    rows.push(`    <div nz-col nzLg="20" nzSpan="24">`);
    rows.push(`      <form nz-form [formGroup]="search">`);
    rows.push(`        <div nz-row nzGutter="10" nzType="flex" nzJustify="space-around" nzAlign="middle">`);
    for (const field of headerSearchFields) {
      rows.push(`          <div nz-col nzLg="8" nzSpan="24">`);
      rows.push(`            <nz-form-item>`);
      rows.push(
        `              <nz-form-label nzSpan="6" nzFor="${field.name}_">` +
        `${field.comment ? field.comment : field.name}</nz-form-label>`
      );
      rows.push(`              <nz-form-control nzSpan="18">`);
      if (field.selector) {
        rows.push(
            `                <nz-select id="${field.name}_" formControlName="${field.name}" nzPlaceHolder="` +
            `${field.searchConfig.placeholder ? field.searchConfig.placeholder : ((field.comment ? field.comment : field.name) + '搜索')}` +
            `" nzAllowClear>`
        );
        rows.push(`                  <nz-option *ngFor="let i of ${UNDER_LINE}_${CommonUtils.camelToUnderline(field.name).toUpperCase()}" [nzValue]="i.value" [nzLabel]="i.label"></nz-option>`);
        rows.push(`              </nz-select>`);
      } else {
        rows.push(
            `                <input nz-input formControlName="${field.name}" ` +
            `id="${field.name}_" placeholder="` +
            `${field.searchConfig.placeholder ? field.searchConfig.placeholder : ((field.comment ? field.comment : field.name) + '模糊搜索')}">`
        );
      }
      rows.push(`              </nz-form-control>`);
      rows.push(`            </nz-form-item>`);
      rows.push(`          </div>`);
    }
    rows.push(`          <div nz-col nzLg="8" nzSpan="24" class="page-title-buttons">`);
    rows.push(`            <nz-button-group>`);
    rows.push(
      `              <button nz-button nzType="primary" [nzLoading]="loading.loading()" (click)="load(1);">` +
      `<i nz-icon nzType="search" nzTheme="outline"></i> 搜索</button>`
    );

    if (extraSearchFields.length > 0) {
      rows.push(`              <button nz-button nzType="primary" [nzLoading]="loading.loading()"`);
      rows.push(`                      nz-popover nzTitle="高级搜索" [nzContent]="extraPopoverTpl" (nzVisibleChange)="$event ? voidy() : load()"`);
      rows.push(`                      nzTrigger="click" nzPlacement="bottomRight"><i nz-icon nzType="down" nzTheme="outline"></i></button>`);
    }
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
      rows.push(`<!-- 卡片额外内容弹出的模板 -->`);
      rows.push(`<ng-template #extraPopoverTpl>`);
      rows.push(`  <form class="extra-search" nz-form [formGroup]="search" nzLayout="vertical">`);
      rows.push(`    <div nz-row nzGutter="10">`);
      for (const field of extraSearchFields) {
        rows.push(`      <div nz-col nzSpan="8">`);
        rows.push(`        <nz-form-item>`);
        rows.push(
          `          <nz-form-label nzFor="${field.name}_">` +
          `${field.comment ? field.comment : field.name}</nz-form-label>`
        );
        rows.push(`          <nz-form-control>`);
        if (field.selector) {
          rows.push(
              `            <nz-select id="${field.name}_" formControlName="${field.name}" nzPlaceHolder="` +
              `${field.searchConfig.placeholder ? field.searchConfig.placeholder : ((field.comment ? field.comment : field.name) + '搜索')}` +
              `" nzAllowClear>`
          );
          rows.push(`              <nz-option *ngFor="let i of ${UNDER_LINE}_${CommonUtils.camelToUnderline(field.name).toUpperCase()}" [nzValue]="i.value" [nzLabel]="i.label"></nz-option>`);
          rows.push(`            </nz-select>`);
        } else {
          rows.push(
              `            <input nz-input formControlName="${field.name}" ` +
              `id="${field.name}_" placeholder="` +
              `${field.searchConfig.placeholder ? field.searchConfig.placeholder : ((field.comment ? field.comment : field.name) + '模糊搜索')}">`
          );
        }
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
    rows.push(`  <ng-container *ngIf="page.total">显示{{ page.startRow }}到{{ page.endRow }} </ng-container>共{{ page.total }}条数据`);
    rows.push(`</ng-template>`);
    rows.push(``);
    rows.push(`<!-- 新增/修改的模板 -->`);
    rows.push(`<ng-template #saveFormTpl>`);
    rows.push(`  <form nz-form [formGroup]="save" nzLayout="vertical">`);
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
        if (field.selector) {
          rows.push(
              `            <nz-select id="${field.name}" formControlName="${field.name}" nzPlaceHolder="` +
              `${field.saveModalConfig.placeholder ? field.saveModalConfig.placeholder : ((field.comment ? field.comment : field.name))}` +
              `">`
          );
          rows.push(`              <nz-option *ngFor="let i of ${UNDER_LINE}_${CommonUtils.camelToUnderline(field.name).toUpperCase()}" [nzValue]="i.value" [nzLabel]="i.label"></nz-option>`);
          rows.push(`            </nz-select>`);
        } else {
          if (field.type === 'number') {
            rows.push(
                `            <nz-input-number nzMin="0" nzPrecision="0" ` +
                `id="${field.name}" formControlName="${field.name}" ` +
                `[nzDisabled]="saveFormReadonly" ` +
                `nzPlaceHolder="` +
                `${field.saveModalConfig.placeholder ? field.saveModalConfig.placeholder : field.comment ? field.comment : field.name}"></nz-input-number>`
            );
          } else {
            rows.push(
                `            <input nz-input id="${field.name}" ` +
                `formControlName="${field.name}" ` +
                `[readonly]="saveFormReadonly" ` +
                `placeholder="` +
                `${field.saveModalConfig.placeholder ? field.saveModalConfig.placeholder : field.comment ? field.comment : field.name}">`
            );
          }
        }
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
  '.component.spec.ts': (config, camelName, CamelName) => {
    const rows = [];
    rows.push(`import { async, ComponentFixture, TestBed } from '@angular/core/testing';`);
    rows.push(``);
    rows.push(`import { ${CamelName}Component } from './${config.name}.component';`);
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
  '.component.less': () => []

};

module.exports = template;
