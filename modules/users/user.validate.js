import joi from 'joi';

export const updatePasswordSchema = {
    body: joi
        .object()
        .required()
        .keys({
            currentPassword: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,20}$')).required(),
            newPassword: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,20}$')).required(),
            cNewPassword: joi.string().valid(joi.ref("newPassword")).required(),
        }),
    headers: joi
        .object()
        .required()
        .keys(
            {
                authorization: joi.string().required(),
            }
        ).unknown(true)
};