const sinonChai = require('sinon-chai')
const chai = require('chai')
chai.use(sinonChai)
chai.should()
const expect = chai.expect
const StandardError = require('standard-error')
const StudentController = require('./student.controller')
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')

const axiosMock = new MockAdapter(axios)

describe('Student Controller', () => {
  const supdataHost = 'la barbe de la famme à georges Moustaki'
  const supdataApiKey = 'georges moustaki'
  let studentController

  beforeEach(() => {
    studentController = new StudentController({
      supdataHost,
      supdataApiKey
    })
  })

  describe("when supdata doesn't return anything", () => {
    beforeEach(() => {
      axiosMock.onAny().networkError()
    })

    it('replies 500 on the ping route', done => {
      // given
      var req = {}
      var res = {}

      // when
      studentController.ping(req, res, function (err) {
        // then
        expect(err).to.deep.equal(
          new StandardError('Network Error', { code: 503, scope: 'etudiant' })
        )
        done()
      })
    })
  })
})
