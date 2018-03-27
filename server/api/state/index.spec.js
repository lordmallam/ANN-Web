'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var stateCtrlStub = {
  index: 'stateCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var stateIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './state.controller': stateCtrlStub
});

describe('State API Router:', function() {
  it('should return an express router instance', function() {
    expect(stateIndex).to.equal(routerStub);
  });

  describe('GET /api/states', function() {
    it('should route to state.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'stateCtrl.index')
        ).to.have.been.calledOnce;
    });
  });
});
