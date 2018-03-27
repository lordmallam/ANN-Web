'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var prospectCtrlStub = {
  index: 'prospectCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var prospectIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './prospect.controller': prospectCtrlStub
});

describe('Prospect API Router:', function() {
  it('should return an express router instance', function() {
    expect(prospectIndex).to.equal(routerStub);
  });

  describe('GET /api/prospects', function() {
    it('should route to prospect.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'prospectCtrl.index')
        ).to.have.been.calledOnce;
    });
  });
});
