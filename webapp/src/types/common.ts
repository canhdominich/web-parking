export interface Header {
    key: string;
    title: string;
}

export interface RowData {
    id: number;
    [key: string]: any
}

export interface BasicTableProps {
    headers: Header[];
    items: RowData[];
}

export interface User {
    image: string;
    name: string;
    role: string;
}

export interface Team {
    images: string[];
}
