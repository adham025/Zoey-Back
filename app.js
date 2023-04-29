import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import QRCode from 'qrcode'
//set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))

import express from 'express'
import connection from './DB/connection.js';
import { globalError } from './services/asyncHandler.js'
import * as indexRouter from './modules/index.route.js'

const app = express()
app.use(express.json())
app.use(cors())

// setup port and the baseUrl
const port = process.env.PORT || 5000
const baseUrl = process.env.BASEURL


connection()

//convert Buffer Data
//Setup API Routing 
app.use(`${baseUrl}/auth`, indexRouter.authRouter)
app.use(`${baseUrl}/user`, indexRouter.userRouter)
app.use(`${baseUrl}/product`, indexRouter.productRouter)
// app.use(`${baseUrl}/category`, indexRouter.categoryRouter)
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











