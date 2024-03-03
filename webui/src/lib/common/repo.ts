import config from "../../config";

class AccessToken {
    static readonly KEY = "REPOTOKEN";

    public get token() : string|null {
        return localStorage.getItem(AccessToken.KEY);
    }
    

    public set token(token:string) {
        localStorage.setItem(AccessToken.KEY, token);
    }

    static parseTokenPayload(jwt:string):any {
        const base64Url = jwt.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = atob(base64); // Simple version that does not take into account URL percent endings
        return JSON.parse(payload);
    }

    public get role() {
        const token = this.token;
        if (!token) {
            return undefined;
        }
        const payload = AccessToken.parseTokenPayload(token);
        return payload.role;
    }

    public isValid() {
        const token = this.token;
        if (!token) {
            return false;
        }

        const now = new Date().valueOf();
        const payload = AccessToken.parseTokenPayload(token);
        return now < payload.exp ;
    }
}


class VagrantRepo {

    private apiUrl:string;
    private apiVersion:string;
    private _accessToken:AccessToken = new AccessToken();
    
    constructor(apiUrl:string, apiVersion = "v1") {
        this.apiUrl = apiUrl;
        this.apiVersion = apiVersion;
    }

    public get accessToken() {
        return this._accessToken;
    }

    private async postRequest(path:string, data?:object) {
        const response = await fetch(`${this.apiUrl}api/${this.apiVersion}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this._accessToken.token}`
            },
            body: data === null ? null : JSON.stringify(data)
        });

        return response;
    }

    private async getRequest(path:string, params?:Record<string,string>) {
        let url = `${this.apiUrl}api/${this.apiVersion}${path}`;

        if (params) {
            const urlparams = new URLSearchParams(params);
            url += `?${urlparams.toString()}`
        }
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this._accessToken.token}`
            },
        })
        return response;
    }

    public async guestLogin() {
        return this.login("guest", "guest");
    }

    public async login(username:string, password:string) {
        const response = await this.postRequest('/authenticate', {
            user: {
                login: username,
                password: password
            }
        });
        
        if (response.status !== 200) {
            throw Error("authentication failed");
        }

        const responseData = await response.json();
        this._accessToken.token = responseData.token;
    }

    async search(query:string="", provider:string="", architecture:string="", sort:string="downloads", order:string="asc", page:number=1) {
        const response = await this.getRequest('/search', {
            q: query,
            provider: provider,
            architecture: architecture,
            sort: sort,
            order: order,
            page: String(page)
        });

        if (response.status !== 200) {
            throw Error("search failed");
        }
        return await response.json();
    }

    async getBox(org:string, box:string) {
        const response = await this.getRequest(`/box/${org}/${box}`);
        if (response.status !== 200) {
            throw Error("get failed");
        }
        return await response.json();
    }

    async getOrganization(org:string) {
        const response = await this.getRequest(`/user/${org}`);
        if (response.status !== 200) {
            throw Error("get failed");
        }
        return await response.json();
    }
}

const vagrantrepo = new VagrantRepo(config.apiUrl);

export default vagrantrepo;