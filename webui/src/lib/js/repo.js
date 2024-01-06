// @ts-nocheck
class VagrantRepo {
    
    constructor(apiUrl, version = "v1") {
        this.apiUrl = apiUrl;
        this.version = version;
    }

    async login(username, password) {
        const response = await fetch(`${this.apiUrl}api/${this.version}/authenticate`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: {
                    login: username,
                    password: password
                }
            })
        });
        if (response.status !== 200) {
            throw Error("authentication failed");
        }

        const responseData = await response.json();
        localStorage.setItem('token', responseData.token);
    }

    async getBoxes() {

    }
}

export default VagrantRepo;