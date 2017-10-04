(function () {
    'use strict';

    function TourDirective($timeout, $http, tourService) {

        function link(scope, el, attr, ctrl) {

            scope.totalSteps;
            scope.currentStepIndex;
            scope.currentStep;
            scope.loadingStep = false;
            var dot;

            scope.nextStep = function() {
                nextStep();
            };

            scope.endTour = function() {
                tourService.endTour();
            };

            scope.completeTour = function() {
                tourService.completeTour();
            };

            function onInit() {
                dot = el.find(".umb-tour__dot");
                scope.totalSteps = scope.steps.length;
                scope.currentStepIndex = 0;
                
                startStep();
            }

            function nextStep() {
                scope.currentStepIndex++;
                if(scope.currentStepIndex !== scope.steps.length) {
                    startStep();
                }
            }

            function startStep() {

                scope.currentStep = scope.steps[scope.currentStepIndex];

                var timer = window.setInterval(function(){

                    console.log("pending", $http.pendingRequests.length);
                    console.log("document ready", document.readyState);
                    
                    scope.loadingStep = true;

                    if($http.pendingRequests.length === 0 && document.readyState === "complete") {
                        console.log("Everything is DONE JOHN");
                        clearInterval(timer);
                        
                        positionDot();

                        if(scope.currentStep.event) {
                            bindEvent();
                        }

                        scope.loadingStep = false;

                    }
                    
                }, 100);

            }

            function positionDot() {

                $timeout(function(){
                    
                    var element = $(scope.currentStep.element);
                    var offset = element.offset();
                    var width = element.width();
                    var height = element.height();
    
                    console.log("This element", element);                    
                    console.log("width", width);
                    console.log("height", height);
          
                    dot.css({top: offset.top + (height / 2), left: offset.left + width});

                });

            }

            function bindEvent() {
                $(scope.currentStep.element).on(scope.currentStep.event, handleEvent);
            }

            function unbindEvent() {
                $(scope.currentStep.element).off(scope.currentStep.event);                
            }

            function handleEvent() {
                alert("event happened");
                unbindEvent();
                nextStep();
            }

            function resize() {
                positionDot();
            }

            onInit();

            $(window).on('resize.umbTour', resize);

            scope.$on('$destroy', function () {
                $(window).off('.resize.umbTour');
            });

        }

        var directive = {
            transclude: true,
            restrict: 'E',
            replace: true,
            templateUrl: 'views/components/application/umb-tour.html',
            link: link,
            scope: {
                options: "=",
                steps: "="
            }
        };

        return directive;

    }

    angular.module('umbraco.directives').directive('umbTour', TourDirective);

})();