import mongoose from "mongoose";


const connection = async () => {
    return await mongoose.connect(process.env.DBconnection)
        .then(() => {
            console.log("Database connected");
        }).catch(() => {
            console.log("Database error");
        })
}

export default connection;