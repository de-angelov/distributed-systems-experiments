class AppError extends Error  {
    code: number;
    message: string;

    constructor(code: number, message: string){
        super(message);

        this.code = code;
        this.message = message;

        // fix for instanceof check n
        Object.setPrototypeOf(this, AppError.prototype);
    }

    static badRequest(msg: string): AppError {
        return new AppError(400, msg);
    }

    static internal(msg: string): AppError {
        return new AppError(500, msg)
    }
}


export { AppError  }