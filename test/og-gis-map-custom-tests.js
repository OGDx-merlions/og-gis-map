// This is the wrapper for custom tests, called upon web components ready state
function runCustomTests() {
  // Place any setup steps like variable declaration and initialization here

  // This is the placeholder suite to place custom tests in
  // Use testCase(options) for a more convenient setup of the test cases
  suite('Custom Automation Tests for og-gis-map', function() {
    test('Check initial value of counter', function(done){
      var counterEl = Polymer.dom(document).querySelector('og-gis-map'),
          counterValueEl = Polymer.dom(counterEl.root).querySelector('span');
      assert.equal(counterValueEl.textContent, '0');
      done();
    });

    test('Clicking og-gis-map increments the counter', function(done){
      var counterEl = Polymer.dom(document).querySelector('og-gis-map'),
          counterValueEl = Polymer.dom(counterEl.root).querySelector('span');
      assert.equal(counterValueEl.textContent, '0');

      counterEl.click();
      flush(function(){
        assert.equal(counterValueEl.textContent, '1');
      });
      done();
    });
  });
}
