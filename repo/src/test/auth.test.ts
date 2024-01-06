import request from 'supertest';
import app from '../app';
import crypto from 'crypto';
import { User, UserRole } from '../data_access/DataSchema';

describe('API Tests', () => {
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

  describe('/api/v1/authenticate', () => {

    it('admin authenticate', async () => {
      const response = await request(app)
        .post('/api/v1/authenticate')
        .send({
          user: {
            login: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD,
          }
        })
        .set('Accept', 'application/json');
      expect(response.statusCode).toBe(200);

      const response2 = await request(app)
        .get('/api/v1/authenticate')
        .set('Authorization', `Bearer ${response.body.token}`);
      expect(response2.status).toBe(200);
    });


    it('user authenticate', async () => {
      const response = await request(app)
        .post('/api/v1/authenticate')
        .send({
          user: {
            login: "test01",
            password: "password01",
          }
        })
        .set('Accept', 'application/json');
      expect(response.statusCode).toBe(200);
      
      const response2 = await request(app)
        .get('/api/v1/authenticate')
        .set('Authorization', `Bearer ${response.body.token}`);
      expect(response2.status).toBe(200);
    });

    
    it('failed authenticate', async () => {
      const response = await request(app)
        .post('/api/v1/authenticate')
        .send({
          user: {
            login: "hogehoge",
            password: "fugafuga",
          }
        })
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(401);
    });
  });
});