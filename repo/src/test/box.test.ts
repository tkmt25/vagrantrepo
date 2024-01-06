import request from 'supertest';
import app from '../app';
import crypto from 'crypto';
import { User, UserRole } from '../data_access/DataSchema';
import { getAdminToken } from './util/authutil';



describe('/api/v1/box tests', () => {
  const orgname = "fuga";
  let adminToken:string;

  beforeAll(async () => {
    adminToken = await getAdminToken(app);

    const response = await request(app).post('/api/v1/users')
      .send({
        username: orgname
      })
      .set('Accept', 'application/json')
      .set('Authorization', adminToken);
    expect(response.statusCode).toBe(200);
  });


  describe('/api/v1/boxes', () => {
    it('add box', async () => {
      
      const response = await request(app)
        .post('/api/v1/boxes')
        .send({
          name: "box01",
          username: orgname
        })
        .set('Accept', 'application/json')
        .set('Authorization', adminToken);

      expect(response.statusCode).toBe(200);
    });
  
    it('get box', async () => {
      
      const response = await request(app)
        .get(`/api/v1/box/${orgname}/box01`)
        .set('Accept', 'application/json')
        .set('Authorization', adminToken);

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe('box01');
      expect(response.body.username).toBe(orgname);
      expect(response.body.private).toBe(true);
      expect(response.body.current_version).toBe(null);
      expect(response.body.versions).toStrictEqual([]);
    });

  });
});