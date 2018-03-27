'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

describe('State API:', function() {
  describe('GET /api/states', function() {
    var states;

    beforeEach(function(done) {
      request(app)
        .get('/api/states')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          states = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(states).to.be.instanceOf(Array);
    });
  });
});
