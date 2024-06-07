class ApiResponse{
    constructor(message = "Success", success,statusCode, data){
        this.statusCode = statusCode,
        this.message = message,
        this.success = statusCode < 400
        this.data = data
    }
}