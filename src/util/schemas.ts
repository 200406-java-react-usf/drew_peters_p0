export interface UserSchema {
    id: number,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    email: string,
    role_name: string
}

export interface AccountSchema {
    id: number,
    balance: number,
    type: string,
    ownerId: number
}

export interface TransactionSchema {
    id: number,
    amount: number,
    description: string,
    accountId: number
}