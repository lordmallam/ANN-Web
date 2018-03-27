'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

describe('Member API:', function() {
  describe('GET /api/members', function() {
    var members;

    beforeEach(function(done) {
      request(app)
        .get('/api/members')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          members = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(members).to.be.instanceOf(Array);
    });
  });
});
