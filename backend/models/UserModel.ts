import { Sequelize, DataTypes } from 'sequelize';
import db from '../config/database';

const Users = db.define('users', {
  id: {
    type: DataTypes.NUMBER,
    autoIncrement: true,
    primaryKey: true,
  },
  name:{
    type: DataTypes.STRING,
  },
  email:{
    type: DataTypes.STRING,
  },
  password:{
    type: DataTypes.STRING,
  },
  refresh_token:{
    type: DataTypes.TEXT,
  },
}, {
  freezeTableName: true,
});

(async () => {
  await db.sync();
})();

export default Users;
