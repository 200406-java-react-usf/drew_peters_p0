export class Account {

    id: number;
    balance: number;
    type: string;
    ownerId: number;

    constructor(id: number, bal: number, type: string, oid: number) {
        this.id = id;
        this.balance = bal;
        this.type = type;
        this.ownerId = oid;

    }

};