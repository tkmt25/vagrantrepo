import request from 'supertest';
import app from '../app';
import crypto from 'crypto';
import { User, UserRole } from '../data_access/DataSchema';
import { getAdminToken } from './util/authutil';

describe('/api/v1/user tests', () => {
  beforeAll(async () => {
    const password = "password01";
    const hash = crypto.createHash('sha1');
    hash.update(password);

    await new User({
      name: "test01",
      passwordHash: hash.digest('hex'),
      role: UserRole.User
    }).save();
  });

  describe('/api/v1/users', () => {
    it('add organization', async () => {
      const token = await getAdminToken(app);
      const response = await request(app)
        .post('/api/v1/users')
        .send({
          username: "hoge"
        })
        .set('Accept', 'application/json')
        .set('Authorization', token);

      expect(response.statusCode).toBe(200);
    });


    it('get organization', async () => {
      const token = await getAdminToken(app);
      const response = await request(app)
        .get(`/api/v1/user/hoge`)
        .set('Accept', 'application/json')
        .set('Authorization', token);

      expect(response.statusCode).toBe(200);
      console.log(response.body);
    });

  });
});