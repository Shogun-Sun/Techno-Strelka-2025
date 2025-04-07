import {
  Table,
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'Sessions', timestamps: false })
export class Session extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  declare sid: string;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare data: any;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare expires: Date;

  @AllowNull(true)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare user_id: number;

  @BelongsTo(() => User)
  declare user: User;
}
