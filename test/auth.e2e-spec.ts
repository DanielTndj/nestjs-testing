import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'ini@gmail.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: '12345',
      })
      .expect(201)
      .then(({ body: { id, email } }) => {
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('signup us a new user then get the currently logged in user', async () => {
    const email = 'ini@gmail.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: '12345',
      })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const {
      body: { email: resEmail },
    } = await request(app.getHttpServer())
      .get('/auth/currentuser')
      .set('Cookie', cookie)
      .expect(200);

    expect(resEmail).toEqual(email);
  });

  // it('handles a signout request', async () => {
  //   const email = 'ini@gmail.com';

  //   const res = await request(app.getHttpServer())
  //     .post('/auth/signup')
  //     .send({
  //       email,
  //       password: '12345',
  //     })
  //     .expect(201);

  //   const cookie = res.get('Set-Cookie');

  //   await request(app.getHttpServer())
  //   .get('/auth/signout')
  //   .expect(200);

  //   expect(cookie).toEqual(null);
  // });

  // it('handles a signin request', async () => {
  //   const email = 'ini@gmail.com';

  //   const res = await request(app.getHttpServer())
  //     .post('/auth/signup')
  //     .send({
  //       email,
  //       password: '12345',
  //     })
  //     .expect(201);

  //   const cookie = res.get('Set-Cookie');

  //   await request(app.getHttpServer()).post('/auth/signout').expect(200);

  //   expect(cookie).toEqual(null);

  //   await request(app.getHttpServer())
  //   .post('/auth/signin')
  //   .send({
  //     email,
  //     password: '12345',
  //   })
  //   .expect(200)
  // });
});
