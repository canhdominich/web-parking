export interface Header {
    key: string;
    title: string;
}

export interface RowData {
    id: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}

export interface BasicTableProps {
    headers: Header[];
    items: RowData[];
}
export interface Team {
    images: string[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    image?: string;
}

  