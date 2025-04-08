import { CreationOptional } from 'sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
  AllowNull,
  HasMany,
  Default,
} from 'sequelize-typescript';
import { Session } from './session.model';
import { Review } from './reviews.model';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare user_id: CreationOptional<number>;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare user_telephone: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare user_password: string;

  @HasMany(() => Session)
  declare sessions: Session[];

  @HasMany(() => Review)
  declare reviews: Review[];
}
