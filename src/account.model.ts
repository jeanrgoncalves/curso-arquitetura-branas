export class AccountModel {
    constructor(
        private id: String,
        private name: String,
        private email: String,
        private cpf: String,
        private carPlate: String,
        private isPassenger: Boolean,
        private isDriver: Boolean,
        private password: String 
    ) {}
}