import { ACTION_LIMIT_TIME } from "../config";

const action: [{ id: number, limitUntil: number }] = [{ id: -1, limitUntil: 0 }]

const addActionLimit = (id: number) => {
    const limitUntil = Date.now() + ACTION_LIMIT_TIME * 1000;
    action.push({ id: id, limitUntil: limitUntil })
}

export default function(id: number): boolean {
    const inTable = action.find(x => x.id === id)
    if (!inTable) {
        addActionLimit(id)
        return true;

    }

    if (Date.now() > inTable.limitUntil) {
        const index = action.indexOf(inTable);
        action.splice(index, 1);
        addActionLimit(id)
        return true;
    }

    return false;
}
