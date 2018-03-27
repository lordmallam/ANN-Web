'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

describe('Lga API:', function() {
  describe('GET /api/lgas', function() {
    var lgas;

    beforeEach(function(done) {
      request(app)
        .get('/api/lgas')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          lgas = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(lgas).to.be.instanceOf(Array);
    });
  });
});
