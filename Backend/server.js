const express = require("express")
const app = express()
const cors = require("cors")
const sequelize = require("./db")
const authRouter = require("./src/Routes/authRoute")
const userRouter = require("./src/Routes/userRoute")
const productRouter = require("./src/Routes/productRoute")
const orderRouter = require("./src/Routes/orderRoute")
const orderItemRouter = require("./src/Routes/orderItemRoute")
const categoryRouter = require("./src/Routes/categoryRoute")
const reportRouter = require("./src/Routes/reportRoute")
const stockRouter = require("./src/Routes/stockRoute")
const dashboardRouter = require("./src/Routes/dashboardRoute")
const searchRouter = require("./src/Routes/searchRoute")

app.use(express.json())
app.use(cors())

app.use("/auth", authRouter)

app.use("/dashboard", dashboardRouter)

app.use("/users", userRouter)

app.use("/products", productRouter)

app.use("/orders", orderRouter)

app.use("/order-items", orderItemRouter)

app.use("/categories", categoryRouter)

app.use("/reports", reportRouter)

app.use("/stocks", stockRouter)

app.use("/search", searchRouter)

app.listen(process.env.PORT, () => {
   console.log(`Server berjalan di http://localhost:${process.env.PORT}`);
});
  