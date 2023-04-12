import { DEFAULT_PFP, SERVER_URL } from "../config";

export const getPfp = (pfpDestination: string | null): string => {
    return pfpDestination
        ? SERVER_URL + pfpDestination
        : DEFAULT_PFP;
}

export const formatDate = (sqlDate: string): string => {
    const americanDate = sqlDate.split("T")[0];
    const americanArr = americanDate.split("-");

    const day = americanArr[2];
    const month = americanArr[1];
    const year = americanArr[0]

    return `${day}/${month}/${year}`;
}

export const determineClass = (role: string): string => {
    switch (role) {
        case "admin":
            return "font-extrabold text-[var(--admin-colour)] admin-container";
        case "moderator":
            return "font-bold text-[var(--moderator-colour)]";
    }
    return "font-bold text-[var(--floral-white)]"
}
