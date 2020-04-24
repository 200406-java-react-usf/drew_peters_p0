export class Transaction {

    id: number;
    amount: number;
    description: string;
    accountId: number;

    constructor(id: number, amt: number, desc: string, aid: number) {
        this.id = id;
        this.amount = amt;
        this.description = desc;
        this.accountId = aid;

    }

};