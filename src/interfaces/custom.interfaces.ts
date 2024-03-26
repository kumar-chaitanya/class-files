import { UserRole } from '../types/custom.types';

export interface ReqUser {
    id: string;
    username: string;
    role: UserRole;
};

export interface Where {
    where: {
        [key: string]: any
    }
};