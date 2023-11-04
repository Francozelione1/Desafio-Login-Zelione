export class CustomError {
    constructor(name = 'Error', cause, message, code) {
        this.name = name;
        this.cause = cause;
        this.message = message;
        this.code = code;
    }

    static createError(name, cause, message, code) {
        return new CustomError(name, cause, message, code);
    }
}


// Error tipo:
// 1: Error en los datos ingresados
// 2: Error en la base de datos
// 3: Error en la autenticacion