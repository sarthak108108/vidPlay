import { Error } from "mongoose"

class ApiError extends Error{
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack= "",

    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.errors = errors
        this.status = false;

        if(statck) {
            this.stack = statck
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}