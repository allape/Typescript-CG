import { Template } from './template';
const { CommonUtils } = require('./utils');

/**
 * 创建弹出选择器的内容
 */
const template: Template = {

  // TS文件
  '-selector.component.ts': (config, camelName, CamelName, UNDER_LINE, under_line, fieldMaxLength) => {
    const rows = [];

    rows.push(`import {Component, forwardRef, Injector} from '@angular/core';`);
    rows.push(`import {NG_VALUE_ACCESSOR} from '@angular/forms';`);
    rows.push(`import {uris} from '../../../../configs/http.config';`);
    rows.push(`import {Transport as Trans, TransportComponent} from '../transport.component';`);
    rows.push(`import {BaseSelectorComponent} from '../../../../standards/base-selector-component';`);
    rows.push(``);
    rows.push(`@Component({`);
    rows.push(`  selector: 'app-${config.name}-selector',`);
    rows.push(`  templateUrl: './${config.name}-selector.component.html',`);
    rows.push(`  styleUrls: ['./${config.name}-selector.component.less'],`);
    rows.push(`  providers: [`);
    rows.push(`    {`);
    rows.push(`      provide: NG_VALUE_ACCESSOR, multi: true,`);
    rows.push(`      useExisting: forwardRef(() => ${CamelName}SelectorComponent),`);
    rows.push(`    }`);
    rows.push(`  ]`);
    rows.push(`})`);
    rows.push(`export class ${CamelName}SelectorComponent implements OnInit, ControlValueAccessor {`);
    rows.push(``);
    rows.push(`  constructor(private readonly injector: Injector) {`);
    rows.push(`    super(injector, {`);
    rows.push(`      title: '选择${config.label}',`);
    rows.push(`      label: '', // TODO ,`);
    rows.push(`      uris: {`);
    rows.push(`        page: uris.${config.module}.${camelName}.page,`);
    rows.push(`        ope: uris.${config.module}.${camelName}.${camelName},`);
    rows.push(`      },`);
    rows.push(`    });`);
    rows.push(`  }`);
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
      rows.push(`    // ${field.comment}`);
      rows.push(`    ${CommonUtils.fill(field.name + ':', fieldMaxLength)} [ null ],`);
    }

    rows.push(`  });`);
    rows.push(``);
    rows.push(`}`);
    rows.push(``);
    return rows;
  },

  // HTML文件
  '-selector.component.html': (config, camelName, CamelName, UNDER_LINE) => {
    const rows = [];

    const tableFields = config.fields.filter(i => i.tableConfig);
    const headerSearchFields = config.fields.filter(i => i.searchConfig && i.searchConfig.header === true);
    const extraSearchFields = config.fields.filter(i => i.searchConfig && i.searchConfig.header !== true);

    rows.push(`<nz-input-group [nzSuffix]="readonly || disabled ? null : suffixTemplate">`);
    rows.push(`  <input nz-input [ngModel]="label" [ngModelOptions]="{ standalone: true }" `);
    rows.push(`         readonly [disabled]="readonly || disabled"`);
    rows.push(`         [placeholder]="placeholder" (click)="onTouched();" class="display-input"`);
    rows.push(`         nz-popover [(nzVisible)]="popover" [nzTitle]="option.title" [nzContent]="selector" nzTrigger="click" />`);
    rows.push(`</nz-input-group>`);
    rows.push(`<ng-template #suffixTemplate>`);
    rows.push(`  <i nz-icon nz-tooltip class="ant-input-clear-icon"`);
    rows.push(`     nzTheme="fill" nzType="close-circle" *ngIf="value" (click)="onSelect(null);"></i>`);
    rows.push(`</ng-template>`);
    rows.push(``);
    rows.push(`<ng-template #selector>`);
    rows.push(`  <!-- 卡片主体 -->`);
    rows.push(`  <nz-card class="page-card" [nzTitle]="titleTpl" style="width: 800px; height: 300px; overflow-y: scroll;">`);
    rows.push(`    <nz-table #table`);
    rows.push(`            [nzLoading]="loading.loading()"`);
    rows.push(`            [nzShowTotal]="tableRangeTpl"`);
    rows.push(`            [nzFrontPagination]="false"`);
    rows.push(`            nzShowPagination nzShowSizeChanger`);
    rows.push(`            [nzData]="page.list"`);
    rows.push(`            [nzTotal]="page.total" [nzPageIndex]="page.pageNum" [nzPageSize]="page.pageSize"`);
    rows.push(`            (nzPageIndexChange)="load($event);" (nzPageSizeChange)="load(1, $event);"`);
    rows.push(`    >`);
    rows.push(`      <thead>`);
    rows.push(`      <tr>`);
    for (const field of tableFields) {
      rows.push(`        <th${field.tableConfig.width ? ' nzWidth="' + field.tableConfig.width + '"' : ''}>` +
        `${field.comment ? field.comment : field.name}</th>`);
    }
    rows.push(`      </tr>`);
    rows.push(`      </thead>`);
    rows.push(`      <tbody>`);
    rows.push(`        <ng-container *ngFor="let data of table.data">`);
    rows.push(`          <tr class="selectable-row" (click)="onSelect(data);">`);
    for (const field of tableFields) {
      if (field.selector) {
        const selectionName = `${UNDER_LINE}_${CommonUtils.camelToUnderline(field.name).toUpperCase()}`;
        rows.push(`            <td>`);
        rows.push(`              <nz-tag *ngIf="!inLabelValues(${selectionName}, data.${field.name})" nzColor="gray">未知</nz-tag>`);
        rows.push(`              <ng-container *ngFor="let i of ${selectionName}">`);
        rows.push(`                <nz-tag *ngIf="data.${field.name} === i.value" [nzColor]="i.color">{{ i.label }}</nz-tag>`);
        rows.push(`              </ng-container>`);
        rows.push(`            </td>`);
      } else {
        rows.push(
          `            <td>${field.tableConfig.prefix ? field.tableConfig.prefix : ''}` +
          `{{ ${field.tableConfig.parse ? field.tableConfig.parse('data.' + field.name) : ('data.' + field.name)} }}` +
          `${field.tableConfig.suffix ? field.tableConfig.suffix : ''}</td>`);
      }
    }
    rows.push(`          </tr>`);
    rows.push(`        </ng-container>`);
    rows.push(`      </tbody>`);
    rows.push(`    </nz-table>`);
    rows.push(`  </nz-card>`);

    rows.push(``);
    rows.push(`  <!-- 卡片标题模板 -->`);
    rows.push(`  <ng-template #titleTpl>`);
    rows.push(`    <div nz-row nzGutter="10" nzType="flex" nzJustify="space-around" nzAlign="middle" class="page-title">`);
    rows.push(`      <div nz-col nzLg="24" nzSpan="24">`);
    rows.push(`        <form nz-form [formGroup]="searchForm">`);
    rows.push(`          <div nz-row nzGutter="10" nzType="flex" nzJustify="space-around" nzAlign="middle">`);
    for (const field of headerSearchFields) {
      rows.push(`            <div nz-col nzLg="8" nzSpan="24">`);
      rows.push(`              <nz-form-item>`);
      rows.push(`                <nz-form-control>`);
      if (field.selector) {
        rows.push(
            `              <nz-select id="${field.name}_" formControlName="${field.name}" nzPlaceHolder="` +
            `${field.searchConfig.placeholder ? field.searchConfig.placeholder : ((field.comment ? field.comment : field.name) + '搜索')}` +
            `" nzAllowClear>`
        );
        rows.push(`                <nz-option *ngFor="let i of ${UNDER_LINE}_${CommonUtils.camelToUnderline(field.name).toUpperCase()}" [nzValue]="i.value" [nzLabel]="i.label"></nz-option>`);
        rows.push(`              </nz-select>`);
      } else {
        rows.push(
            `                  <input nz-input formControlName="${field.name}" ` +
            `id="${field.name}_" placeholder="` +
            `${field.searchConfig.placeholder ? field.searchConfig.placeholder : ((field.comment ? field.comment : field.name) + '模糊搜索')}">`
        );
      }
      rows.push(`                </nz-form-control>`);
      rows.push(`              </nz-form-item>`);
      rows.push(`            </div>`);
    }
    rows.push(`            <div nz-col nzLg="8" nzSpan="24" class="page-title-buttons">`);
    rows.push(`              <nz-button-group>`);
    rows.push(
      `                <button nz-button nzType="primary" [nzLoading]="loading.loading()" (click)="load();">` +
      `<i nz-icon nzType="search" nzTheme="outline"></i> 搜索</button>`
    );
    if (extraSearchFields.length > 0) {
      rows.push(`                <button nz-button nzType="primary" [nzLoading]="loading.loading()"`);
      rows.push(`                        nz-popover nzTitle="高级搜索" [nzContent]="extraPopoverTpl" (nzVisibleChange)="$event ? voidy() : load()"`);
      rows.push(`                        nzTrigger="click" nzPlacement="bottomRight"><i nz-icon nzType="down" nzTheme="outline"></i></button>`);
    }
    rows.push(
      `                <button nz-button [nzLoading]="loading.loading()" (click)="this.searchForm.reset(); load();">` +
      `<i nz-icon nzType="redo" nzTheme="outline"></i> 清空</button>`
    );
    rows.push(`              </nz-button-group>`);
    rows.push(`            </div>`);
    rows.push(`          </div>`);
    rows.push(`        </form>`);
    rows.push(`      </div>`);
    rows.push(`    </div>`);
    rows.push(`  </ng-template>`);
    if (extraSearchFields.length > 0) {
      rows.push(`  <!-- 卡片额外内容弹出的模板 -->`);
      rows.push(`  <ng-template #extraPopoverTpl>`);
      rows.push(`    <form nz-form [formGroup]="searchForm" nzLayout="vertical" style="width: 600px;">`);
      rows.push(`      <div nz-row nzGutter="10">`);
      for (const field of extraSearchFields) {
        rows.push(`        <div nz-col nzSpan="8">`);
        rows.push(`          <nz-form-item>`);
        rows.push(
          `            <nz-form-label nzFor="${field.name}_">` +
          `${field.comment ? field.comment : field.name}</nz-form-label>`
        );
        rows.push(`            <nz-form-control>`);
        if (field.selector) {
          rows.push(
              `              <nz-select id="${field.name}_" formControlName="${field.name}" nzPlaceHolder="` +
              `${field.searchConfig.placeholder ? field.searchConfig.placeholder : ((field.comment ? field.comment : field.name) + '搜索')}` +
              `" nzAllowClear>`
          );
          rows.push(`                <nz-option *ngFor="let i of ${UNDER_LINE}_${CommonUtils.camelToUnderline(field.name).toUpperCase()}" [nzValue]="i.value" [nzLabel]="i.label"></nz-option>`);
          rows.push(`              </nz-select>`);
        } else {
          rows.push(
              `              <input nz-input formControlName="${field.name}" ` +
              `id="${field.name}_" placeholder="` +
              `${field.searchConfig.placeholder ? field.searchConfig.placeholder : ((field.comment ? field.comment : field.name) + '模糊搜索')}">`
          );
        }
        rows.push(`            </nz-form-control>`);
        rows.push(`          </nz-form-item>`);
        rows.push(`        </div>`);
      }
      rows.push(`      </div>`);
      rows.push(`    </form>`);
      rows.push(`  </ng-template>`);
    }
    rows.push(``);
    rows.push(`  <!-- 分页显示的模板 -->`);
    rows.push(`  <ng-template #tableRangeTpl>`);
    rows.push(`    显示{{page.startRow}}到{{page.endRow}} 共{{page.total}}条数据`);
    rows.push(`  </ng-template>`);
    rows.push(`</ng-template>`);
    rows.push(``);
    return rows;
  },

  // spec.ts文件
  '-selector.component.spec.ts': (config, camelName, CamelName) => {
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
  '-selector.component.less': () => [
    '.display-input,.selectable-row {',
    '  cursor: pointer;',
    '}',
    '',
    '.display-input[disabled] {',
    '  cursor: not-allowed;',
    '}',
    '',
  ]

};

module.exports = template;
