import { Sequelize } from "sequelize";
// Read the .env file.
import dotenv from "dotenv";
dotenv.config();

// const params =
//   process.env.NODE_ENV == "production"
//     ? [
//         process.env.MYSQL_DB_PROD,
//         process.env.MYSQL_USER_PROD,
//         process.env.MYSQL_PASSWORD_PROD,
//       ]
//     : [
//         process.env.MYSQL_DB,
//         process.env.MYSQL_USER,
//         process.env.MYSQL_PASSWORD,
//       ];
const params = [
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
];
// @ts-ignore
const sequelize = new Sequelize(...params, {
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || ""),
  dialect: "mysql",
  dialectOptions: {
    connectTimeout: 600000, // Increase timeout if needed
  },
});
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
connectDB();
export default sequelize;
