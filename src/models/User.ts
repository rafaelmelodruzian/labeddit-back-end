export interface TokenPayload {
    id: string,
    nick: string;
}

export interface UserDB {
    id: string;
    nick: string;
    email: string;
    password: string;
    created_at: string;
}

export class User {
    constructor (
        private id: string,
        private nick: string,
        private email: string,
        private password: string,
        private createdAt: string,
    ) {}

    public getId(): string {
        return this.id
    }
    public setId(value: string): void {
        this.id = value
    }

    public getNick(): string {
        return this.nick
    }
    public setNick(value: string): void {
        this.nick = value
    }

    public getEmail(): string {
        return this.email
    }
    public setEmail(value: string): void {
        this.email = value
    }

    public getPassword(): string {
        return this.password
    }
    public setPassword(value: string): void {
        this.password = value
    }

    public getCreatedAt(): string {
        return this.createdAt
    }
    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    public toDBModel(): UserDB {
        return {
            id: this.id,
            nick: this.nick,
            email: this.email,
            password: this.password,
            created_at: this.createdAt
        }
    }
}
