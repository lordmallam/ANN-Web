'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var lgaCtrlStub = {
  index: 'lgaCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var lgaIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './lga.controller': lgaCtrlStub
});

describe('Lga API Router:', function() {
  it('should return an express router instance', function() {
    expect(lgaIndex).to.equal(routerStub);
  });

  describe('GET /api/lgas', function() {
    it('should route to lga.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'lgaCtrl.index')
        ).to.have.been.calledOnce;
    });
  });
});
