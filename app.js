import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import QRCode from 'qrcode'
//set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })
import express from 'express'
import morgan from 'morgan'
import * as indexRouter from './modules/index.route.js'
import connection from './DB/connection.js';
import { globalError } from './services/asyncHandler.js'

const app = express()
// setup port and the baseUrl
const port = process.env.PORT || 5000
const baseUrl = process.env.BASEURL
app.use(express.json())
app.use(morgan())
// app.use(cors())

connection()
//Setup API Routing 
app.use(`${baseUrl}/auth`, indexRouter.authRouter)
app.use(`${baseUrl}/user`, indexRouter.userRouter)
app.use(`${baseUrl}/product`, indexRouter.productRouter)
app.use(`${baseUrl}/category`, indexRouter.categoryRouter)
// app.use(`${baseUrl}/subCategory`, indexRouter.subcategoryRouter)
// app.use(`${baseUrl}/reviews`, indexRouter.reviewsRouter)
// app.use(`${baseUrl}/coupon`, indexRouter.couponRouter)
// app.use(`${baseUrl}/cart`, indexRouter.cartRouter)
// app.use(`${baseUrl}/order`, indexRouter.orderRouter)
// app.use(`${baseUrl}/brand`, indexRouter.branRouter)


// To create QRCode
// app.get('/', (req, res) => {
//     QRCode.toDataURL('I am !')
//         .then(url => {
//             console.log(url)
//             res.send("Hello")
//         })
//         .catch(err => {
//             console.error(err)
//         })
// })


app.use('*', (req, res, next) => {
    res.send("In-valid Routing Plz check url or method")
})

app.use(globalError)


app.listen(port, () => console.log(`App listening on port ${port}!`))











