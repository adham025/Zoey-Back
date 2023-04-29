import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../../config/.env') })
import cloudinary from 'cloudinary'

cloudinary.v2.config({
    cloud_name: "dvxoj5iif",
    api_key: "613526811975697",
    api_secret: "G66Mxq2B7Y7uT-WaJcpJWJw89yU",
    secure: true
});

export default cloudinary.v2