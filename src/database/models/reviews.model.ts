import { CreationOptional } from 'sequelize';
import {
  Model,
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Table,
  ForeignKey,
  AllowNull,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'reviews', timestamps: false })
export class Review extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare review_id: CreationOptional<number>;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare review_text: string;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare coordinates: { lat: number; lng: number };

  @AllowNull(false)
  @Column(DataType.JSON)
  declare review_speed_test: { download: string; upload: string; ping: string };

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare user_id: number;

  @BelongsTo(() => User)
  declare user: User;
}
