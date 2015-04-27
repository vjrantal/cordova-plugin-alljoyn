exports.defineAutoTests = function () {
    var testModules = cordova.require('cordova/plugin_list');
    testModules.forEach(function (testModule) {
        if (testModule.id.indexOf('org.allseen.alljoyn.tests.auto-') === 0) {
            cordova.require(testModule.id);
        }
    });
};

exports.defineManualTests = function (contentEl, createActionButton) {
    var testContext = {};
    testContext._testFunctions = [];
    testContext._currentTestFunctionIndex = -1;
    testContext._runNextTest = function () {
        var nextIndex = testContext._currentTestFunctionIndex += 1;
        if (testContext._testFunctions.length > nextIndex) {
            testContext._testFunctions[nextIndex](testContext);
        } else {
            testContext.createInstructions('All tests run.');
            testContext.createSuccessOutput('');
            document.getElementById('test-buttons').innerHTML = '';
        }
    };

    contentEl.innerHTML = '<h2>Instructions</h2>' +
                          '<div id="test-instructions"></div>' +
                          '<h2>Test action buttons</h2>' +
                          '<div id="test-buttons"></div>' +
                          '<h2>Test output</h2>' +
                          '<div id="test-output"></div>';
    testContext.createInstructions = function (instructionsText) {
        document.getElementById('test-instructions').innerHTML = instructionsText;
    };
    testContext.createButton = function (buttonText, buttonAction) {
        var buttonElement = document.createElement('button');
        buttonElement.onclick = buttonAction;
        buttonElement.innerHTML = buttonText;
        var testButtonsContainer = document.getElementById('test-buttons');
        while (testButtonsContainer.firstChild) {
            testButtonsContainer.removeChild(testButtonsContainer.firstChild);
        }
        testButtonsContainer.appendChild(buttonElement);
    };
    testContext._createOutput = function (outputText, isSuccess) {
        var outputElement = document.getElementById('test-output');
        outputElement.style.color = !isSuccess && '#ff0000' || '#00ff00';
        outputElement.innerHTML = outputText;
    };
    testContext.createSuccessOutput = function (outputText) {
        testContext._createOutput(outputText, true);
    };
    testContext.createErrorOutput = function (outputText) {
        testContext._createOutput(outputText, false);
    };
    testContext.testDone = function () {
        testContext.createInstructions('Test was done. Press the next-button to continue to the next test.');
        testContext.createButton('Next', function () {
            testContext._runNextTest();
        });
    };

    var testModules = cordova.require('cordova/plugin_list');
    testModules.forEach(function (testModule) {
        if (testModule.id.indexOf('org.allseen.alljoyn.tests.manual-') === 0) {
            testContext._testFunctions.push(cordova.require(testModule.id));
        }
    });

    testContext._runNextTest();
};
