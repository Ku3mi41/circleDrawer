/**
 * Convex hull (Andrew's Monotone Chain Convex Hull Algorithm) and getDiameterPoints of a set of points
 * David Eppstein, UC Irvine, 7 Mar 2002
 */

/**
 * Return positive if p-q-r are clockwise, neg if ccw, zero if colinear.
 */
function orientation(p, q, r) {
  return (q[1] - p[1]) * (r[0] - p[0]) - (q[0] - p[0]) * (r[1] - p[1]);
}

/**
 * Andrew's Monotone Chain Convex Hull Algorithm
 */
function getConvexHull(points) {
  const U = [];
  const L = [];
  points.sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));

  points.forEach(p => {
    while (U.length > 1 && orientation(U[U.length - 2], U[U.length - 1], p) <= 0) {
      U.pop();
    }
    while (L.length > 1 && orientation(L[L.length - 2], L[L.length - 1], p) >= 0) {
      L.pop();
    }
    U.push(p);
    L.push(p);
  });

  return [U, L];
}

/**
 * Given a list of 2d points, finds all ways of sandwiching the points
 * between two parallel lines that touch one point each, and yields the sequence
 * of pairs of points touched by each pair of lines
 */
function* rotatingCalipers(points) {
  const [U, L] = getConvexHull(points);

  let i = 0;
  let j = L.length - 1;

  while (i < U.length - 1 || j > 0) {
    yield [U[i], L[j]];

    // if all the way through one side of hull, advance the other side
    if (i === U.length - 1) {j -= 1;} else if (j === 0) {i += 1;}

    /* Still points left on both lists, compare slopes of next hull edges
       being careful to avoid divide-by-zero in slope calculation     */
    else if (
      (U[i + 1][1] - U[i][1]) * (L[j][0] - L[j - 1][0]) >
      (L[j][1] - L[j - 1][1]) * (U[i + 1][0] - U[i][0])
    ) {
      i += 1;
    } else {
      j -= 1;
    }
  }
}

/**
 * Given a list of 2d points, returns the pair that's farthest apart.
 */
function getDiameterPoints(points) {
  let diameters = [];
  let pointsSets = [];
  [...rotatingCalipers(points)].forEach(([x, y]) => {
    diameters.push((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2);
    pointsSets.push([x, y]);
  });
  let maxDiameterIdx = diameters.indexOf(Math.max(...diameters));
  return pointsSets[maxDiameterIdx];
}
