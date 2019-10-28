import { Template } from './template';
const { CommonUtils } = require('./utils');

/**
 * 创建正常的增删改查的列表
 */
const template: Template = {

  // Controller
  '.controller.ts': (config, camelName, CamelName, UNDER_LINE, under_line, fieldMaxLength) => {
    const rows = [
      `import {Controller, UseGuards} from '@nestjs/common';`,
      `import {BaseController, Searchable} from '../../as/base.controller';`,
      `import {SearchType} from '../../as/base.service';`,
      `import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';`,
      `import {AuthGuard} from '@nestjs/passport';`,
      `import {${CamelName}Entity} from './${camelName}.entity';`,
      `import {${CamelName}Service} from './${camelName}.service';`,
      `import {Request as ExpressRequest} from 'express';`,
      ``,
      `@ApiBearerAuth()`,
      `@ApiUseTags('${under_line.replace(/_/g, '-')} - ${config.title}')`,
      `@Controller('${under_line.replace(/_/g, '-')}')`,
      `@UseGuards(AuthGuard())`,
      `export class ${CamelName}Controller extends BaseController<${CamelName}Entity, ${CamelName}Service> {`,
      ``,
      `  public searchables: Searchable = {`,
    ];

    // 搜索表单字段
    config.fields.filter(i => !!i.searchConfig).forEach(field => {
      rows.push(`    ${CommonUtils.fill(field.name + ':', fieldMaxLength)} SearchType.like,`);
    });

    rows.push(...[
      `    ...BaseController.SEARCHABLES,`,
      `  };`,
      ``,
      `  constructor(`,
      `    protected readonly service: ${CamelName}Service,`,
      `  ) {`,
      `    super(service);`,
      `  }`,
      ``,
      `}`,
      ``,
    ]);

    return rows;
  },

  // Entity
  '.entity.ts': (config, camelName, CamelName, UNDER_LINE, under_line, fieldMaxLength) => {
    const rows = [
      `import {Column, Entity} from 'typeorm';`,
      `import {BaseEntity} from '../../as/base.entity';`,
      `import {ApiModelProperty, ApiModelPropertyOptional} from '@nestjs/swagger';`,
      ``,
    ];
    rows.push(`@Entity('t_${under_line}')`);
    rows.push(`export class ${CamelName}Entity extends BaseEntity {`);
    rows.push(``);
    for (const field of config.fields) {
      rows.push(`  @Column(${/[A-Z]/.test(field.name) ? `{ name: '${CommonUtils.camelToUnderline(field.name)}' }` : ''})`);
      rows.push(`  @${field.saveModalConfig && field.saveModalConfig.required ? 'ApiModelProperty' : 'ApiModelPropertyOptional'}({ description: '${field.comment || field.name}' })`);
      rows.push(`  ${field.name}?: ${field.type};`);
      rows.push(``);
    }
    rows.push(`}`);
    rows.push(``);
    return rows;
  },

  '.service.ts': (config, camelName, CamelName, UNDER_LINE, under_line, fieldMaxLength) => {
    return [
      `import {BaseService} from '../../as/base.service';`,
      `import {${CamelName}Entity} from './${under_line.replace(/_/g, '-')}.entity';`,
      `import {Injectable} from '@nestjs/common';`,
      `import {EntityManager} from 'typeorm';`,
      `import {InjectEntityManager} from '@nestjs/typeorm';`,
      ``,
      `@Injectable()`,
      `export class ${CamelName}Service extends BaseService<${CamelName}Entity> {`,
      ``,
      `  constructor(`,
      `    @InjectEntityManager()`,
      `    public readonly manager: EntityManager,`,
      `  ) {`,
      `    super(manager, ${CamelName}Entity);`,
      `  }`,
      ``,
      `}`,
      ``,
    ];
  }

};

module.exports = template;
