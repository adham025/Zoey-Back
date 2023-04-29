import { roles } from "../../middleware/auth.js";


export const endPoints = {
    change: [roles.Admin, roles.User]
}