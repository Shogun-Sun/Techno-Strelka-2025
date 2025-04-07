import { CreationOptional } from 'sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
  AllowNull,
} from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare user_id: CreationOptional<number>;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare user_name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare user_password: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare user_email: string;
}
