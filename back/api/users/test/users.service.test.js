'use strict';

const expect = require('chai').expect;
const UsersService = require('./../users.service')
const Redis = require('ioredis');
const StandardError = require('standard-error')
const emptylogger = require('bunyan-blackhole');


describe('Users Service', () => {
  describe('with redis up & running', () => {
    const redisHost = process.env['REDIS_PORT_HOST'] ||'127.0.0.1'
    const redisDriver = new Redis(redisHost, 6379);
    const usersService = new UsersService({
      redis: {
        driver: redisDriver,
        userPrefix: 'user-test',
        logger: emptylogger()
      }
    });
    const email = 'tge@octo.com'
    const user = {
      email,
      name: 'gery',
      surname: 'Thibaut',
      localAuthority: 'Paris',
      keys: ['A', 'B']
    }

    describe('When there is no user in redis', () => {
      it('we can add one user', (done) => {
        usersService.setUser(user, (err, userReturned) => {
          if(err) return done(err)
          expect(userReturned).to.deep.equal(user)
          usersService.getUser(email, (err, userReturned2) => {
            if(err) return done(err)
            expect(userReturned2).to.deep.equal(user)
            done()
          })
        })
      });
    })

    describe('When there is on user in redis', () => {
      beforeEach((done) => {
        usersService.setUser(user, done)
      })

      it('we can retreive the user', (done) => {
        usersService.getUser(email, (err, userReturned) => {
          if(err) return done(err)
          expect(userReturned).to.deep.equal(user)
          done()
        })
      });

      it('we can delete the user', (done) => {
        usersService.deleteUser(email, (err, result) => {
          if(err) return done(err)
          expect(result).to.deep.equal(1)
          usersService.getUser(email, (err, userReturned) => {
            if(err) return done(err)
            if(userReturned == null) return done()
            done(new Error('User not deleted'))
          })
        })
      });

      it('we can update the user', (done) => {
        const newUser = {
          email,
          name: 'Géry',
          surname: 'Thibaut',
          localAuthority: 'Paris',
          keys: ['A', 'B', 'C']
        }
        usersService.setUser(newUser, (err, result) => {
          if(err) return done(err)
          expect(result).to.deep.equal(newUser)
          usersService.getUser(email, (err, userReturned) => {
            if(err) return done(err)
            expect(userReturned).to.deep.equal(newUser)
            done()
          })
        })
      });
    });
  })
});
