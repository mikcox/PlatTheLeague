'use strict';
/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
//IMPORTANT: Remember when counting tables the title counts as one
describe('App Navigation:', function () {
	it('navigate to team builder page', function () {
		browser().navigateTo('../../index.html#/');
		expect(browser().window().path()).toBe('/index.html');
	});	  
});

describe('Team Builder Page:', function () {
	it('navigate to team builder page', function () {
		browser().navigateTo('../../index.html#/');
		expect(browser().window().path()).toBe('/index.html');
	});
	it('should build a list of champion buttons', function () {
		input('allChampFilterQuery').enter('d');
		expect(repeater('#allChampsList div').count()).toBeGreaterThan(10);
	});
});