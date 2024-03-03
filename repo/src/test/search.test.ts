import request from 'supertest';
import app from '../app';
import crypto from 'crypto';
import { User, UserRole } from '../data_access/DataSchema';
import { getAdminToken, getGuestToken } from './util/authutil';



describe('/api/v1/search tests', () => {
  const orgname = "fuga";
  let adminToken:string;
  let guestToken:string;

  beforeAll(async () => {
    adminToken = await getAdminToken(app);
    guestToken = await getGuestToken(app);

    const response = await request(app).post('/api/v1/users')
      .send({
        username: orgname
      })
      .set('Accept', 'application/json')
      .set('Authorization', adminToken);
    expect(response.statusCode).toBe(200);
  });


  describe('/api/v1/search', () => {

    it('search box', async () => {
      const response = await request(app)
        .post('/api/v1/boxes')
        .send({
          name: "box01",
          username: orgname
        })
        .set('Accept', 'application/json')
        .set('Authorization', adminToken);

      expect(response.statusCode).toBe(200);


      const query = "box"
      const response2 = await request(app)
        .get(`/api/v1/search?q=${query}`)
        .set('Authorization', guestToken);

      expect(response2.statusCode).toBe(200);
      expect(response2.body).toBe('box01');
    });

  });
});