/* Users Collection
 * Data Access Object *
 * Users Credentials for DAO actions *
*/

/* importing required files and packages */
const uuid = require('uuid');
const passport = require('passport');
const bcrypt = require('bcrypt');
const mongoDbCollections = require('../config/mongodb-collection');
const user = mongoDbCollections.users;
const credentials = mongoDbCollections.credentials;

/* exporting controllers apis */
module.exports = userControllers = {
    /**
     * @returns {Object} An object of workspace
     */
    getCredentialByEmail: async function(email) {
        if (!email) throw "Please provide the email id";
        
        const credentialCollection = await credentials();
        const credentialInfo = await credentialCollection.findOne({ email: email });
        if (credentialInfo === null) {
            throw "Server issue in fetching user by email id";
        }
        return credentialInfo;
    },

    /**
     * @returns {Object} A success notex
     */
    createCredential: async function(email, password) {
        if(!email || !password) throw "Insufficient data provided";

        let userCredential = {
            email: email,
            password: bcrypt.hashSync(password, 16)
        }

        const credentialCollection = await credentials();
        const isCredentialCreated = await credentialCollection.insert({ userCredential });
        if (isCredentialCreated.length === 0) {
            throw "Server issue while creating user.";
        }
        return { success: true };
    },

    /**
     * @returns {Object} A success notex
     */
    compareCredentials: async (email, password) => {
        const credentialInfo = await this.getCredentialByEmail(email);
        if (!bcrypt.compareSync(password, credentialInfo.password)) {
            throw "Incorrect password";
        }
        return { success: true };
    }
};