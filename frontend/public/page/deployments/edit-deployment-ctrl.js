import {k8sEnum} from '../../module/k8s';
import {getNamespacedRoute} from '../../ui/ui-actions';

angular.module('bridge.page')
.controller('EditDeploymentCtrl', function($scope, $location, $routeParams, _, k8s) {
  'use strict';

  $scope.ns = $routeParams.ns || k8sEnum.DefaultNS;
  $scope.deploymentName = $routeParams.name;
  $scope.loadError = false;
  $scope.loaded = false;
  $scope.deployment = {};
  $scope.navProps = {
    pages: [
      {name: 'Overview', href: 'details'},
      {name: 'Edit', href: 'edit'},
      {name: 'YAML', href: 'yaml'},
      {name: 'Pods', href: 'pods'},
    ]
  };

  k8s.deployments.get($routeParams.name, $scope.ns)
    .then(function(deployment) {
      $scope.deployment = deployment;
      $scope.loadError = false;
      $scope.loaded = true;
    })
    .catch(function() {
      $scope.loadError = true;
    });

  $scope.cancel = function() {
    $location.path(getNamespacedRoute('/deployments'));
  };

  $scope.submit = function() {
    $scope.requestPromise = k8s.deployments.update($scope.deployment);
    $scope.requestPromise.then(function() {
      $location.path(getNamespacedRoute('/deployments'));
    });
  };
});
