import categoryModel from "./model/category.model.js";
// import { userModel } from "./model/user.model.js;

export const findOne = async ({ model, condition, select, populate = [] } = {}) => {
    let data = await model.findOne(condition).select(select).populate(populate);
    return data
}

export const find = async ({ model, condition, select, limit = 10, skip = 0, populate = [] } = {}) => {
    let data = await model.find(condition).skip(skip).limit(limit).select(select).populate(populate);
    return data
}

export const findById = async ({ model, id, select, populate = [] } = {}) => {
    let data = await model.findById(id).select(select).populate(populate);
    return data
}

export const findByIdAndUpdate = async ({ model, condition = {}, data, options = {} } = {}) => {
    const result = await model.findByIdAndUpdate(condition, data, options)
    return result;
}

export const findOneAndUpdate = async ({ model, condition = {}, data, options = {} }) => {
    const result = await model.findOneAndUpdate(condition, data, options);
    return result;
}

export const create = async ({ model, data } = {}) => {
    let newModel = new model(data);
    let result = await newModel.save()
    return result;
}

export const insertMany = async (model, data = []) => {
    let result = await model.insertMany(data);
    return result
}

export const updateOne = async ({ model, condition = {}, data, options = {} }) => {
    const result = await model.updateOne(condition, data, options)
    return result;
}