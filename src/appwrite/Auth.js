import { Client, Account, ID } from "appwrite";
import config from "../config/config";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        // Debugging logs to check config values
        console.log("Appwrite URL:", config.appwriteUrl);
        console.log("Appwrite Project ID:", config.appwriteProjectId);

        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);
        this.account = new Account(this.client);
    }
    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                return this.login({email, password});
            } else {
                return userAccount;
            }
        } catch (err) {
            return err;
        }
    }
    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (e) {
            return e;
        }
    }
    async getCurrentUser() {
        try {
          const user= await this.account.get();
          return user;  
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
        }
        return null;
    }
    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (e) {
            console.log("Appwrite service :: logout :: error", e);
        }
    }
}

const authService = new AuthService();

export default authService;
