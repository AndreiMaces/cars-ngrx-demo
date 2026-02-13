import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "../models/user";

@Injectable({ providedIn: 'root' })
export class AuthApi {
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post<{ token: string, user: User }>('/api/login', { username, password });
    }
}