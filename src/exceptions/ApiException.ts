class ApiExcption extends Error {
    status: number;

    message: string;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }

    static badRequest(msg) {
        return new ApiExcption(400, msg);
    }

    static internalError(msg) {
        return new ApiExcption(500, msg);
    }
}
export default ApiExcption;
