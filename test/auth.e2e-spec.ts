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
    const email = 'tes123@gmail.com';

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

  // it('handles a signin request', ()=>{
  //   const email = 'tes123@gmail.com';

  //   return request(app.getHttpServer())
  //   .post('auth/signin')
  //   .send({
  //     email,
  //     password: '12345'
  //   }).expect(200)
  //   .then(({body: {id, email}})=>{
  //     expect
  //   })
  // })
});
