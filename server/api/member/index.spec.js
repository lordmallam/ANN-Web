'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var memberCtrlStub = {
  index: 'memberCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var memberIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './member.controller': memberCtrlStub
});

describe('Member API Router:', function() {
  it('should return an express router instance', function() {
    expect(memberIndex).to.equal(routerStub);
  });

  describe('GET /api/members', function() {
    it('should route to member.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'memberCtrl.index')
        ).to.have.been.calledOnce;
    });
  });
});
