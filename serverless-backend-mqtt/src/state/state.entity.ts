import { Table, Column, Model, DataType } from "sequelize-typescript";

// @ts-ignore
@Table({ tableName: "state" })
export class State extends Model<State> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true
  })
  id: number;

  @Column({ type: DataType.TEXT })
  state: String;
}
