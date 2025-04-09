import { CreationOptional } from 'sequelize';
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'Chips', timestamps: true })
export class Chip extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare chip_id: CreationOptional<number>;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare chip_district: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare chip_description: string;
}
