import Joi from "joi";

export const signUpValidation = {
    body: Joi.object().required().keys({
        userName: Joi.string().min(3).max(30).required(),
        email: Joi.string().email(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,20}$')),
        cPassword: Joi.string().valid(Joi.ref("password")).required()
    })
}

export const updateRole = {
    body: Joi.object().required().keys({
        userId: Joi.string().required().min(24).max(24)
    })
}