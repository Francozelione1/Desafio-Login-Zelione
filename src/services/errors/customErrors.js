export default class CustomError extends Error {
    constructor({ message, productoSinStock, code = 1 }) {
        super(message);
        this.name = "CustomError";
        this.productoSinStock = productoSinStock;
        this.code = code;
    }

    static createError({ message, productoSinStock, code }) {
        return new CustomError({ message, productoSinStock, code });
    }
}


/*export default class CustomError {
	static createError({ name = 'Error', cause, message, code = 1 }) {
		const error = new Error(message, { cause });
		error.name = name;
		error.code = code;
		return error;
	}
}*/

