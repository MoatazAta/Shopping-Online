export class UserModel {
	public id: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public city: string;
    public street: string;
    public CreditCard: number;
    public isAdmin: number;
    public token: string; // JWT: JSON Web Token - one string which the backend creates and sends us by which we can enter certain routes in the backend.
}
 