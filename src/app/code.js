/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* JavaScript for latlong.html                                        (c) Chris Veness 2002-2020  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/* global google, prettyPrint */

import LatLon, { Dms } from 'https://cdn.jsdelivr.net/npm/geodesy@2/latlon-spherical.js';

const maps = { // note we have to track overlay items ourselves
    orthoDist: { map: null, geodesic: true,  overlay: { marker1: null, marker2: null, path: null } },
    orthoDest: { map: null, geodesic: true,  overlay: { marker1: null, marker2: null, path: null } },
    rhumbDist: { map: null, geodesic: false, overlay: { marker1: null, marker2: null, path: null } },
    rhumbDest: { map: null, geodesic: false, overlay: { marker1: null, marker2: null, path: null } },
    options:   {
        zoom:                     0,
        center:                   new google.maps.LatLng(0, 0),
        mapTypeId:                google.maps.MapTypeId.HYBRID,
        mapTypeControlOptions:    { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
        navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL },
        streetViewControl:        false,
        scaleControl:             true,
        controlSize:              28,
    },
};

const debug = new URLSearchParams(location.search).get('debug') == undefined ? function() {} : console.debug;

// has user made d/dms display preference?
let degFmt = localStorage.getItem('latlon-degree-format') || 'dms';


// ------------ display preferences

document.addEventListener('DOMContentLoaded', function() {
    // show current dms preference
    document.querySelector('#deg-format-'+degFmt).checked = true;
});

// ---- ortho-dist listeners (orthodrome distance / bearings / midpoint between two points)

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#ortho-dist input').forEach(function(el) {
        el.onchange = function() {
            const lat1 = Dms.parse(document.querySelector('#ortho-dist .lat1').value);
            const lon1 = Dms.parse(document.querySelector('#ortho-dist .lon1').value);
            const lat2 = Dms.parse(document.querySelector('#ortho-dist .lat2').value);
            const lon2 = Dms.parse(document.querySelector('#ortho-dist .lon2').value);

            // calculate distance, bearing, mid-point
            const p1 = new LatLon(lat1, lon1);
            const p2 = new LatLon(lat2, lon2);
            const dist = p1.distanceTo(p2);
            const brng1 = p1.initialBearingTo(p2);
            const brng2 = p1.finalBearingTo(p2);
            const pMid = p1.midpointTo(p2);

            // display results
            const d = (dist/1000).toPrecision(4); // in km rounded to 4 significant figures
            document.querySelector('#ortho-dist .result-dist').textContent = d > 1 ? Number(d) : d; // avoid exponential notation
            document.querySelector('#ortho-dist .result-brng1').textContent = Dms.toBrng(brng1, degFmt);
            document.querySelector('#ortho-dist .result-brng2').textContent = Dms.toBrng(brng2, degFmt);
            document.querySelector('#ortho-dist .result-midpt').textContent = pMid.toString(degFmt);

            // show path on map
            if (!document.querySelector('#map-ortho-dist-canvas').classList.contains('hide')) {
                drawPath(p1.lat, p1.lon, p2.lat, p2.lon, maps.orthoDist);
            }
            debug('ortho-dist', this.name, this.value, d > 1 ? Number(d) : d);
        };
    });
    document.querySelector('#ortho-dist .lat1').onchange(); // trigger initial calculation

    // map toggle
    document.querySelectorAll('#ortho-dist .toggle-map a').forEach(function(el) {
        el.onclick = function() {
            if (!maps.orthoDist.map) maps.orthoDist.map = new google.maps.Map(document.querySelector('#map-ortho-dist-canvas'), maps.options);
            document.querySelectorAll('#ortho-dist .toggle-map').forEach(function(elmt) { elmt.classList.toggle('hide'); }); // 'see on map' text
            document.querySelector('#ortho-dist .map').classList.toggle('hide');                                         // the map itself

            document.querySelector('#ortho-dist .lat1').onchange(); // to invoke drawPath()
        };
    });
});

// ---- ortho-dest listeners (orthodrome destination point from start point / bearing / distance)

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#ortho-dest input').forEach(function(el) {
        el.onchange = function() {
            const lat1 = Dms.parse(document.querySelector('#ortho-dest .lat1').value);
            const lon1 = Dms.parse(document.querySelector('#ortho-dest .lon1').value);
            const dist = document.querySelector('#ortho-dest .dist').value * 1000; // convert km to metres
            const brng = Dms.parse(document.querySelector('#ortho-dest .brng').value);

            // calculate destination point, final bearing
            const p1 = new LatLon(lat1, lon1);
            const p2 = p1.destinationPoint(dist, brng);
            const brngFinal = p1.finalBearingTo(p2);

            // display results
            document.querySelector('#ortho-dest .result-point').textContent = p2.toString(degFmt);
            document.querySelector('#ortho-dest .result-brng').textContent = Dms.toBrng(brngFinal, degFmt);

            // show path on map
            if (!document.querySelector('#map-ortho-dest-canvas').classList.contains('hide')) {
                drawPath(p1.lat, p1.lon, p2.lat, p2.lon, maps.orthoDest);
            }
            debug('ortho-dest', this.name, this.value, p2.toString(degFmt));
        };
    });
    document.querySelector('#ortho-dest .lat1').onchange(); // trigger initial calculation

    // map toggle
    document.querySelectorAll('#ortho-dest .toggle-map a').forEach(function(el) {
        el.onclick = function() {
            if (!maps.orthoDest.map) maps.orthoDest.map = new google.maps.Map(document.querySelector('#map-ortho-dest-canvas'), maps.options);
            document.querySelectorAll('#ortho-dest .toggle-map').forEach(function(elmt) { elmt.classList.toggle('hide'); }); // 'see on map' text
            document.querySelector('#ortho-dest .map').classList.toggle('hide');
            document.querySelector('#ortho-dest .lat1').onchange(); // to invoke drawPath()
        };
    });
});

// ---- intersect listeners (intersection of two paths)

document.addEventListener('DOMContentLoaded', function() {
    // listener for updated values
    document.querySelectorAll('#intersect input').forEach(function(el) {
        el.onchange = function() {
            const lat1 = Dms.parse(document.querySelector('#intersect .lat1').value);
            const lon1 = Dms.parse(document.querySelector('#intersect .lon1').value);
            const lat2 = Dms.parse(document.querySelector('#intersect .lat2').value);
            const lon2 = Dms.parse(document.querySelector('#intersect .lon2').value);

            // calculate intersection point
            const p1 = new LatLon(lat1, lon1);
            const p2 = new LatLon(lat2, lon2);
            const brng1 = Dms.parse(document.querySelector('#intersect .brng1').value);
            const brng2 = Dms.parse(document.querySelector('#intersect .brng2').value);
            const pInt = LatLon.intersection(p1, brng1, p2, brng2);

            // display result
            document.querySelector('#intersect .result-point').textContent = pInt==null ? '[ambiguous]' : pInt.toString(degFmt);

            debug('intersect', this.name, this.value, pInt.toString(degFmt));
        };
    });
    document.querySelector('#intersect .lat1').onchange(); // trigger initial calculation
});

// ---- rhumb-dist listeners (rhumb lines distance)

document.addEventListener('DOMContentLoaded', function() {
    // listener for updated values
    document.querySelectorAll('#rhumb-dist input').forEach(function(el) {
        el.onchange = function() {
            const lat1 = Dms.parse(document.querySelector('#rhumb-dist .lat1').value);
            const lon1 = Dms.parse(document.querySelector('#rhumb-dist .lon1').value);
            const lat2 = Dms.parse(document.querySelector('#rhumb-dist .lat2').value);
            const lon2 = Dms.parse(document.querySelector('#rhumb-dist .lon2').value);

            // calculate distance, bearing, mid-point
            const p1 = new LatLon(lat1, lon1);
            const p2 = new LatLon(lat2, lon2);
            const dist = p1.rhumbDistanceTo(p2);
            const brng = p1.rhumbBearingTo(p2);
            const pMid = p1.rhumbMidpointTo(p2);

            // display results
            const d = (dist/1000).toPrecision(4); // in km rounded to 4 significant figures
            document.querySelector('#rhumb-dist .result-dist').textContent = d>1 ? Number(d) : d; // avoid exponential notation
            document.querySelector('#rhumb-dist .result-brng').textContent = Dms.toBrng(brng, degFmt);
            document.querySelector('#rhumb-dist .result-midpt').textContent = pMid.toString(degFmt);

            // show path on map
            if (!document.querySelector('#map-rhumb-dist-canvas').classList.contains('hide')) {
                drawPath(p1.lat, p1.lon, p2.lat, p2.lon, maps.rhumbDist);
            }
            debug('rhumb-dist', this.name, this.value, d>1 ? Number(d) : d);
        };
    });
    document.querySelector('#rhumb-dist .lat1').onchange(); // trigger initial calculation

    // map toggle
    document.querySelectorAll('#rhumb-dist .toggle-map a').forEach(function(el) {
        el.onclick = function() {
            if (!maps.rhumbDist.map) maps.rhumbDist.map = new google.maps.Map(document.querySelector('#map-rhumb-dist-canvas'), maps.options);
            document.querySelectorAll('#rhumb-dist .toggle-map').forEach(function(elmt) { elmt.classList.toggle('hide'); }); // 'see on map' text
            document.querySelector('#rhumb-dist .map').classList.toggle('hide');

            document.querySelector('#rhumb-dist .lat1').onchange(); // to invoke drawPath()
        };
    });
});

// ---- rhumb-dest listeners (rhumb lines destination)

document.addEventListener('DOMContentLoaded', function() {
    // listener for updated values
    document.querySelectorAll('#rhumb-dest input').forEach(function(el) {
        el.onchange = function() {
            const lat1 = Dms.parse(document.querySelector('#rhumb-dest .lat1').value);
            const lon1 = Dms.parse(document.querySelector('#rhumb-dest .lon1').value);
            const brng = Dms.parse(document.querySelector('#rhumb-dest .brng').value);
            const dist = document.querySelector('#rhumb-dest .dist').value * 1000; // convert km to metres

            // calculate destination point
            const p1 = new LatLon(lat1, lon1);
            const p2 = p1.rhumbDestinationPoint(dist, brng);

            // display results
            document.querySelector('#rhumb-dest .result-point').textContent = p2.toString(degFmt);

            // show path on map
            if (!document.querySelector('#map-rhumb-dest-canvas').classList.contains('hide')) {
                drawPath(p1.lat, p1.lon, p2.lat, p2.lon, maps.rhumbDest);
            }
            debug('rhumb-dest', this.name, this.value, p2.toString(degFmt));
        };
    });
    document.querySelector('#rhumb-dest .lat1').onchange(); // trigger initial calculation

    // toggle
    document.querySelectorAll('#rhumb-dest .toggle-map a').forEach(function(el) {
        el.onclick = function() {
            if (!maps.rhumbDest.map) maps.rhumbDest.map = new google.maps.Map(document.querySelector('#map-rhumb-dest-canvas'), maps.options);
            document.querySelectorAll('#rhumb-dest .toggle-map').forEach(function(elmt) { elmt.classList.toggle('hide'); }); // 'see on map' text
            document.querySelector('#rhumb-dest .map').classList.toggle('hide');

            document.querySelector('#rhumb-dest .lat1').onchange(); // to invoke drawPath()
        };
    });
});

// ---- deg-min-sec / decimal degrees conversion

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.convert-lat').forEach(function(el) {
        el.onchange = function() {
            debug('convert-lat', this.value);
            const lat = Dms.parse(this.value);
            document.querySelector('#lat-d').value = Dms.toLat(lat, 'd', 5);
            document.querySelector('#lat-dm').value = Dms.toLat(lat, 'dm', 3);
            document.querySelector('#lat-dms').value = Dms.toLat(lat, 'dms', 1);
        };
    });
    document.querySelectorAll('.convert-lon').forEach(function(el) {
        el.onchange = function() {
            debug('convert-lon', this.value);
            const lon = Dms.parse(this.value);
            document.querySelector('#lon-d').value = Dms.toLon(lon, 'd', 5);
            document.querySelector('#lon-dm').value = Dms.toLon(lon, 'dm', 3);
            document.querySelector('#lon-dms').value = Dms.toLon(lon, 'dms', 1);
        };
    });
    document.querySelectorAll('#lat-d,#lon-d').forEach(function(el) { el.onchange(); }); // to invoke alternative representations
});

// ---- display of bearings to user's preference

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[name=deg-format]').forEach(function(el) {
        el.onchange = function() {
            debug('degree-format', this.value);

            // record preference in cookie
            localStorage.setItem('latlon-degree-format', degFmt = this.value);

            // trigger recalculations with new format
            document.querySelector('#ortho-dist .lat1').onchange();
            document.querySelector('#ortho-dest .lat1').onchange();
            document.querySelector('#intersect  .lat1').onchange();
            document.querySelector('#rhumb-dist .lat1').onchange();
            document.querySelector('#rhumb-dest .lat1').onchange();
        };
    });
});

// ---- url query arguments

document.addEventListener('DOMContentLoaded', function() {
    // ---- for distance calculation...
    const from = new URLSearchParams(location.search).get('from');
    const to = new URLSearchParams(location.search).get('to');
    if (from && to) {
        debug('initial dist', from, to);
        document.querySelector('#ortho-dist .lat1').value = from.split(',')[0];
        document.querySelector('#ortho-dist .lon1').value = from.split(',')[1];
        document.querySelector('#ortho-dist .lat2').value = to.split(',')[0];
        document.querySelector('#ortho-dist .lon2').value = to.split(',')[1];
        document.querySelector('#ortho-dist .toggle-map a').click();
        document.querySelectorAll('#ortho-dist .toggle-map').forEach(function(el) { el.classList.toggle('hide'); }); // 'see on map' text
        document.querySelector('#ortho-dist .map').classList.toggle('hide');                                         // the map itself
        document.querySelector('#ortho-dist .lat1').onchange();                                                      // to invoke drawPath()
    }

    // ---- ... & destination calculation
    const dist = new URLSearchParams(location.search).get('dist');
    const brng = new URLSearchParams(location.search).get('brng');
    if (from && dist && brng) {
        debug('initial dest', from, dist, brng);
        document.querySelector('#ortho-dest .lat1').value = from.split(',')[0];
        document.querySelector('#ortho-dest .lon1').value = from.split(',')[1];
        document.querySelector('#ortho-dest .brng').value = brng;
        document.querySelector('#ortho-dest .dist').value = dist;
        //document.querySelector('#ortho-dist .toggle-map a').onclick(); why no work?
        document.querySelectorAll('#ortho-dest .toggle-map').forEach(function(el) { el.classList.toggle('hide'); }); // 'see on map' text
        document.querySelector('#ortho-dest .map').classList.toggle('hide');                                         // the map itself
        document.querySelector('#ortho-dest .lat1').onchange();                                                      // to invoke drawPath()
    }
});

function drawPath(lat1, lon1, lat2, lon2, m) {
    // clear current overlays
    if (m.overlay.marker1) { m.overlay.marker1.setMap(null); m.overlay.marker1 = null; }
    if (m.overlay.marker2) { m.overlay.marker2.setMap(null); m.overlay.marker1 = null; }
    if (m.overlay.path)    { m.overlay.path.setMap(null);    m.overlay.path = null; }

    // if supplied lat/long are all valid numbers, draw the path
    if (!isNaN(lat1+lon1+lat2+lon2)) {
        const p1 = new google.maps.LatLng(lat1, lon1);
        const p2 = new google.maps.LatLng(lat2, lon2);
        const sw = new google.maps.LatLng(Math.min(lat1, lat2), Math.min(lon1, lon2));
        const ne = new google.maps.LatLng(Math.max(lat1, lat2), Math.max(lon1, lon2));
        const bnds = new google.maps.LatLngBounds(sw, ne);
        m.map.fitBounds(bnds);
        m.overlay.marker1 = new google.maps.Marker({ map: m.map, position: p1, title: 'Point 1', icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' });
        m.overlay.marker2 = new google.maps.Marker({ map: m.map, position: p2, title: 'Point 2', icon: 'https://maps.google.com/mapfiles/ms/icons/red.png' });
        m.overlay.path = new google.maps.Polyline({ map: m.map, path: [ p1, p2 ], strokeColor: '#990000', geodesic: m.geodesic });
    }
}

// ---- show source code

document.addEventListener('DOMContentLoaded', async function() {
    const responseLatLon = await fetch('//cdn.jsdelivr.net/npm/geodesy@2/latlon-spherical.js');
    document.querySelector('#latlon-src').textContent = await responseLatLon.text();
    const responseDms = await fetch('//cdn.jsdelivr.net/npm/geodesy@2/dms.js');
    document.querySelector('#dms-src').textContent = await responseDms.text();
    prettyPrint();
});
