"use strict";

import {
    fetchData,
    insertData,
    updateData,
    deleteData,
    findByUsername,
    findByEmail,
} from "../models/serviceUser.mjs";

/** @module User */
/** Class representing a user. */
class User {
    #id;
    #username;
    #email;
    #password;
    #firstName;
    #lastName;
    #role;
    #status;
    #settings;
    #lastLogin;
    #failedLoginAttempts;
    #profilePicture;
    #bio;
    #location;
    #website;
    #dob;
    #subscriptions = [];
    #following = [];
    #posts = [];
    #createdAt;
    #createdBy;
    #updatedAt;
    #updatedBy;
    #deletedAt;
    #deletedBy;

    static #users = [];

    static keys(user) {
        const properties = [];
        for (let property in user) properties.push(property);
        return properties;
    }

    static entries(event) {
        const properties = [];
        Object.entries(event).forEach(([key, value]) =>
            properties.push([key, value])
        );
        return properties;
    }

    static getRuntimeUsers() {
        return User.#users;
    }

    static async findOne(username) {
        try {
            const details = await findByUsername(username);
            if (!details)
                throw Error(
                    "We can't find a user with the provided information"
                );
            const user = details[0];
            const settings = {
                darkMode: true,
                notifications: {
                    likes: true,
                    comments: true,
                    follows: true,
                    messages: true,
                },
                privacy: {
                    showEmail: false,
                    showLocation: false,
                    allowTagging: true,
                },
            };

            const properties = {
                id: user.id,
                username: user.username,
                email: user.email,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                status: user.status,
                settings: user.settings || settings,
                lastLogin: user.lastLogin,
                failedLoginAttempts: user.failedLoginAttempts,
                createdAt: `${user.createdAt}`,
                updatedAt: `${user.updatedAt}`,
            };
            return new User(properties);
        } catch (error) {
            console.error(error);
        }
    }

    constructor(properties) {
        // Object.assign(this, properties);
        const {
            id,
            username,
            email,
            password,
            firstName,
            lastName,
            role,
            status,
            settings,
            lastLogin,
            failedLoginAttempts,
            createdAt,
            updatedAt,
        } = properties;

        this.#id = id;
        this.#username = username;
        this.#email = email;
        this.#password = password;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#role = role;
        this.#status = status;
        this.#settings = settings;
        this.#lastLogin = lastLogin;
        this.#failedLoginAttempts = failedLoginAttempts;
        this.#createdAt = createdAt;
        this.#updatedAt = updatedAt;

        User.#users.push(this);
    }

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }
    get username() {
        return this.#username;
    }
    set username(value) {
        this.#username = value;
    }
    get email() {
        return this.#email;
    }
    set email(value) {
        this.#email = value;
    }
    get password() {
        return this.#password;
    }
    set password(value) {
        this.#password = value;
    }
    get firstName() {
        return this.#firstName;
    }
    set firstName(value) {
        this.#firstName = value;
    }
    get lastName() {
        return this.#lastName;
    }
    set lastName(value) {
        this.#lastName = value;
    }
    get role() {
        return this.#role;
    }
    set role(value) {
        this.#role = value;
    }
    get status() {
        return this.#status;
    }
    set status(value) {
        this.#status = value;
    }
    get lastLogin() {
        return this.#lastLogin;
    }
    set lastLogin(value) {
        this.#lastLogin = value;
    }
    get failedLoginAttempts() {
        return this.#failedLoginAttempts;
    }
    set failedLoginAttempts(value) {
        this.#failedLoginAttempts = value;
    }
    get profilePicture() {
        return this.#profilePicture;
    }
    set profilePicture(value) {
        this.#profilePicture = value;
    }
    get bio() {
        return this.#bio;
    }
    set bio(value) {
        this.#bio = value;
    }
    get location() {
        return this.#location;
    }
    set location(value) {
        this.#location = value;
    }
    get website() {
        return this.#website;
    }
    set website(value) {
        this.#website = value;
    }
    get dob() {
        return this.#dob;
    }
    set dob(value) {
        this.#dob = value;
    }
    get subscriptions() {
        return this.#subscriptions;
    }
    set subscriptions(value) {
        if (Array.isArray(value)) this.#subscriptions = value;
    }
    get following() {
        return this.#following;
    }
    set following(value) {
        if (Array.isArray(value)) this.#following = value;
    }
    get posts() {
        return this.#posts;
    }
    set posts(value) {
        if (Array.isArray(value)) this.#posts = value;
    }
    get settings() {
        return this.#settings;
    }
    set settings(value) {
        this.#settings = value;
    }
    get createdAt() {
        return this.#createdAt;
    }
    set createdAt(value) {
        this.#createdAt = value;
    }
    get createdBy() {
        return this.#createdBy;
    }
    set createdBy(value) {
        this.#createdBy = value;
    }
    get updatedAt() {
        return this.#updatedAt;
    }
    set updatedAt(value) {
        this.#updatedAt = value;
    }
    get updatedBy() {
        return this.#updatedBy;
    }
    set updatedBy(value) {
        this.#updatedBy = value;
    }
    get deletedAt() {
        return this.#deletedAt;
    }
    set deletedAt(value) {
        this.#deletedAt = value;
    }
    get deletedBy() {
        return this.#deletedBy;
    }
    set deletedBy(value) {
        this.#deletedBy = value;
    }

    isActive() {
        if (this.#status === "active") return true;
        else return false;
    }

    isAdmin() {
        return this.#role.toLowerCase() === "admin";
    }

    hasAccessToFeature(feature) {
        switch (this.#role) {
            case "admin":
                return true;
            case "moderator":
                return feature.toLowerCase() === "premium";
            case "user":
                return feature.toLowerCase() === "basic";
            case "guest":
                return feature.toLowerCase() === "public";
            default:
                return false;
        }
    }

    age() {
        const date = new Date();
        return date.getFullYear() - this.#dob;
    }

    follow(userId) {
        if (!this.#following.includes(userId)) this.following.push(userId);
    }

    unfollow(userId) {
        this.#following = this.#following.filter((id) => id !== userId);
    }

    updateProfilePicture(newProfilePicture) {
        this.#profilePicture = newProfilePicture;
    }

    getUsers() {}

    print() {
        return `Enjoy habibi, ${this.#firstName}!`;
    }

    async save() {
        return {
            anonymous: false,
            id: this.#id,
            username: this.#username,
            email: this.#email,
            firstName: this.#firstName,
            lastName: this.#lastName,
            role: this.#role,
            status: this.#status,
            settings: this.#settings,
            lastLogin: this.#lastLogin,
            failedLoginAttempts: this.#failedLoginAttempts,
            createdAt: `${this.#createdAt}`,
            updatedAt: `${this.#updatedAt}`,
        };
    }
}

export default User;