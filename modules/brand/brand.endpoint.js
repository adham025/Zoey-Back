import { roles } from "../../middleware/auth.js";


export const endPoints = {
    createBrand: [roles.Admin, roles.User],
    updateBrand: [roles.Admin, roles.User]
}