'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

describe('Prospect API:', function() {
  describe('GET /api/prospects', function() {
    var prospects;

    beforeEach(function(done) {
      request(app)
        .get('/api/prospects')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          prospects = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(prospects).to.be.instanceOf(Array);
    });
  });
});
