module.exports = function (testContext) {
    AllJoyn.connect(function (bus) {
        var applicationObjects = [
            {
                path: '/path',
                interfaces: [
                    [
                        'com.example.signal.interface',
                        '!TestSignal >s',
                        null
                    ],
                    null
                ]
            },
            null
        ];
        var sendTestSignal = function (connectedBus, success, error) {
            connectedBus.sendSignal(
                success,
                error,
                [1, 0, 0, 0], // '!TestSignal >s'
                's',
                ['Test string']
            );
        };

        var sendSignalInOfflineMode = function (sendingDone) {
            testContext.createInstructions('Put the device to offine mode (for example, enable the airplane mode) and press the ready-button.');
            testContext.createButton('Ready', function () {
                sendTestSignal(
                    bus,
                    function () {
                        testContext.createErrorOutput('Sending signals should not be possible in airplane mode.');
                        sendingDone();
                    },
                    function (status) {
                        testContext.createSuccessOutput('As expected, sending signal failed in airplane mode.');
                        sendingDone();
                    }
                );
            });
        };

        var sendSignalInOnlineMode = function (sendingDone) {
            testContext.createInstructions('Put the device to online mode (for example, disable the airplane mode) and press the ready-button.');
            testContext.createButton('Ready', function () {
                AllJoyn.connect(function (bus) {
                    sendTestSignal(
                        bus,
                        function () {
                            testContext.createSuccessOutput('As expected, device was able to reconnect to bus and send a signal.');
                            sendingDone();
                        },
                        function (status) {
                            testContext.createErrorOutput('Was not able to send a signal.');
                            sendingDone();
                        }
                    );
                });
            });
        };

        AllJoyn.registerObjects(function () {
            sendSignalInOfflineMode(function () {
                sendSignalInOnlineMode(function () {
                    testContext.testDone();
                });
            });
        }, function () {
            testContext.createErrorOutput('Object registration failed.');
        }, applicationObjects, null);
    }, function (status) {
        throw 'Failed to connect to bus with failure code:' + status;
    });
};

