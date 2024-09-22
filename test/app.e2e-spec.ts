import { PrismaService } from './../src/prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
const PORT = 3002;
describe('App EndToEnd tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.listen(PORT);
    prismaService = app.get<PrismaService>(PrismaService);
    await prismaService.cleanDatabase();
    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
  });

  describe('Test Authentication', () => {
    describe('Register', () => {
      it('should register', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: 'nqyjv@example.com',
            password: '123456',
            name: 'test',
          })
          .expectStatus(201);
      });

      it('should not register with same email', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: 'nqyjv@example.com',
            password: '123456',
            name: 'test',
          })
          .expectStatus(403);
      });

      it('should not register with invalid email', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: 'test',
            password: '123456',
            name: 'test',
          })
          .expectStatus(400);
      });

      it('should not register with email empty', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: '',
            password: '12345',
            name: 'test',
          })
          .expectStatus(400);
      });

      it('should not register with password empty', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: 'nqyjv@example.com',
            password: '',
            name: 'test',
          })
          .expectStatus(400);
      });
    });

    describe('Login', () => {
      it('should login', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody({
            email: 'nqyjv@example.com',
            password: '123456',
          })
          .expectStatus(201)
          .stores('accessToken', 'accessToken');
      });
    });

    describe('User ', () => {
      describe('Get Detail User', () => {
        it('should get detail user', () => {
          return pactum
            .spec()
            .get(`/users/me`)
            .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
            .expectStatus(200)
            .stores('userId', 'id');
        });
      });

      describe('Note', () => {
        describe('Create Note', () => {
          it('should create note', () => {
            return pactum
              .spec()
              .post(`/notes`)
              .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
              .withBody({
                title: 'test title',
                description: 'test description',
                url: 'test url',
              })
              .expectStatus(201);
          });

          it('should not create note with empty title', () => {
            return pactum
              .spec()
              .post(`/notes`)
              .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
              .withBody({
                title: '',
                description: 'test description',
                url: 'test url',
              })
              .expectStatus(400);
          });

          it('should create note with empty description and url', () => {
            return pactum
              .spec()
              .post(`/notes`)
              .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
              .withBody({
                title: 'test title',
                description: '',
                url: '',
              })
              .expectStatus(201)
              .stores('noteId', 'id');
          });
        });

        describe('Get all Note', () => {
          it('should get all note', () => {
            return pactum
              .spec()
              .get(`/notes`)
              .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
              .expectStatus(200);
          });
        });

        describe('Get Note by Id', () => {
          it('should get note by id', () => {
            return pactum
              .spec()
              .get(`/notes/{id}`) // Replace {id} with the appropriate noteId from the store
              .withPathParams('id', '$S{noteId}')
              .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
              .expectStatus(200)
              .expectBodyContains('test title');
          });
        });

        describe('Update Note', () => {
          it('should update note', () => {
            return pactum
              .spec()
              .patch(`/notes/{id}`)
              .withPathParams('id', '$S{noteId}')
              .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
              .withBody({
                title: 'updated title',
                description: 'updated description',
                url: 'updated url',
              })
              .expectStatus(200)
              .expectBodyContains('updated title');
          });
        });

        describe('Delete Note', () => {
          it('should delete note by id', () => {
            return pactum
              .spec()
              .delete(`/notes`)
              .withQueryParams('id', '$S{noteId}')
              .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
              .expectStatus(200);
          });
        });
      });
    });
  });

  afterAll(async () => {
    app.close();
  });
  it.todo('should pass');
});
