/* global THREE:false */

'use strict';


export const parseNumericArray = function (string) {
  return string.trim().substr(1, string.length - 2).split(',').map(function (element) {
    return parseFloat(element);
  });
};


export const parseVector = function (string) {
  var array = parseNumericArray(string);
  return new THREE.Vector3(array[0], array[1], array[2]);
};


export const parseQuaternion = function (string) {
  var array = parseNumericArray(string);
  return new THREE.Quaternion(array[1], array[2], array[3], array[0]);
};


export const parseGeometry = function (string) {
  let match = null;

  if (match = string.match(/Cuboid{ w=(-?\d+(?:\.\d+)?), h=(-?\d+(?:\.\d+)?), d=(-?\d+(?:\.\d+)?) }/)) {
    let width = parseFloat(match[1]),
        height = parseFloat(match[2]),
        depth = parseFloat(match[3]);

    return new THREE.BoxGeometry(width, height, depth);
  } else if (match = string.match(/Sphere{(-?\d+(?:\.\d+)?)}/)) {
    let radius = parseFloat(match[1]);

    return new THREE.SphereGeometry(radius);
  } else if (match = string.match(/TriangleMesh{(.+)}/)) {
    let i = 0;
    let geometry = new THREE.Geometry();

    let m = null;
    let vertices = geometry.vertices;
    let regex= /(\[-?\d+(?:\.\d+)?, -?\d+(?:\.\d+)?, -?\d+(?:\.\d+)?\])/g;
    while (m = regex.exec(match[1])) {
      let vertex = parseVector(m[1]);
      vertices.push(vertex);
    }

    for (i = 0; i < vertices.length; i += 3) {
      geometry.faces.push(new THREE.Face3(i, i + 1, i + 2));
    }

    geometry.computeFaceNormals();

    return geometry;
  }

  throw 'Unable to parse shape from string: "' + string + '"';
};
