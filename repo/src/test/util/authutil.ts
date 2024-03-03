import request from 'supertest';
import config from '../../config';

async function getToken(app:any, username:string, password:string) {
    const response = await request(app)
        .post('/api/v1/authenticate')
        .send({
          user: {
            login: username,
            password: password,
          }
        })
        .set('Accept', 'application/json');
    expect(response.statusCode).toBe(200);

    return `Bearer ${response.body.token}`;
}

async function getAdminToken(app:any) {
    return getToken(app, config.admin_username, config.admin_password);
}

async function getGuestToken(app:any) {
    return getToken(app, "guest", "guest");
}

export { getToken, getAdminToken, getGuestToken };