// ---- Simulation Modes ---- //

const SIMULATION_MODES = ['Normal','Hyper','Wild','Megablobs','Experimental','Spooky']; // Labels for sim mode selector UI
const SIM_MODE_NORMAL = 0;
const SIM_MODE_HYPER = 1;
const SIM_MODE_WILD = 2;
const SIM_MODE_MEGABLOBS = 3;
const SIM_MODE_EXPERIMENTAL = 4;
const SIM_MODE_SPOOKY = 5;

// ---- Active Attributes ---- //

// Active attributes are data of ActiveSystem not inherited from StormData; used for simulation of active storm systems
// Here defines the names of these attributes for a given simulation mode

const ACTIVE_ATTRIBS = {};

ACTIVE_ATTRIBS.defaults = [
    'organization',
    'lowerWarmCore',
    'upperWarmCore',
    'depth',
    'genesisProgress'
];

ACTIVE_ATTRIBS[SIM_MODE_EXPERIMENTAL] = [
    'organization',
    'lowerWarmCore',
    'upperWarmCore',
    'depth',
    'genesisProgress',
    'kaboom'
];

// ---- Season Curve ---- //

const SEASON_CURVE = {};

SEASON_CURVE.default = 'seasonalSine';
SEASON_CURVE[SIM_MODE_SPOOKY] = 'spookySeasonCurve';


// ---- Spawn Rules ---- //

const SPAWN_RULES = {};

SPAWN_RULES.defaults = {};
SPAWN_RULES[SIM_MODE_NORMAL] = {};
SPAWN_RULES[SIM_MODE_HYPER] = {};
SPAWN_RULES[SIM_MODE_WILD] = {};
SPAWN_RULES[SIM_MODE_MEGABLOBS] = {};
SPAWN_RULES[SIM_MODE_EXPERIMENTAL] = {};
SPAWN_RULES[SIM_MODE_SPOOKY] = {};

// -- Defaults -- //

SPAWN_RULES.defaults.archetypes = {
    'tw': {
        x: ()=>random(0,WIDTH-1),
        y: (b)=>b.hemY(random(HEIGHT*0.7,HEIGHT*0.9)),
        pressure: [1000, 1020],
        windSpeed: [15, 35],
        type: TROPWAVE,
        organization: [0,0.3],
        lowerWarmCore: 1,
        upperWarmCore: 1,
        depth: 0
    },
    'ex': {
        x: ()=>random(0,WIDTH-1),
        y: (b,x)=>b.hemY(b.env.get("jetstream",x,0,b.tick)+random(-75,75)),
        pressure: [1000, 1020],
        windSpeed: [15, 35],
        type: EXTROP,
        organization: 0,
        lowerWarmCore: 0,
        upperWarmCore: 0,
        depth: 1
    },
    'l': {
        inherit: 'tw',
        pressure: 1015,
        windSpeed: 15,
        organization: 0.2
    },
    'x': {
        inherit: 'ex',
        pressure: 1005,
        windSpeed: 15
    },
    'tc': {
        pressure: 1005,
        windSpeed: 25,
        type: TROP,
        organization: 1,
        lowerWarmCore: 1,
        upperWarmCore: 1,
        depth: 0
    },
    'stc': {
        inherit: 'tc',
        type: SUBTROP,
        lowerWarmCore: 0.6,
        upperWarmCore: 0.5
    },
    'd': {
        inherit: 'tc'
    },
    'D': {
        inherit: 'stc'
    },
    's': {
        inherit: 'tc',
        pressure: 995,
        windSpeed: 45
    },
    'S': {
        inherit: 'stc',
        pressure: 995,
        windSpeed: 45
    },
    '1': {
        inherit: 'tc',
        pressure: 985,
        windSpeed: 70
    },
    '2': {
        inherit: 'tc',
        pressure: 975,
        windSpeed: 90
    },
    '3': {
        inherit: 'tc',
        pressure: 960,
        windSpeed: 105
    },
    '4': {
        inherit: 'tc',
        pressure: 945,
        windSpeed: 125
    },
    '5': {
        inherit: 'tc',
        pressure: 925,
        windSpeed: 145
    },
    '6': {
        inherit: 'tc',
        pressure: 890,
        windSpeed: 170
    },
    '7': {
        inherit: 'tc',
        pressure: 840,
        windSpeed: 210
    },
    '8': {
        inherit: 'tc',
        pressure: 800,
        windSpeed: 270
    },
    '9': {
        inherit: 'tc',
        pressure: 765,
        windSpeed: 330
    },
    '0': {
        inherit: 'tc',
        pressure: 730,
        windSpeed: 400
    },
    'y': {
        inherit: 'tc',
        pressure: 690,
        windSpeed: 440
    },
    'monsoonLow': {
        pressure: [1004, 1012],
        windSpeed: [10, 25],
        type: TROPWAVE,

        organization: [0.1, 0.3],
        lowerWarmCore: [0.6, 0.9],
        upperWarmCore: [0.55, 0.8],
        depth: [0, 0.2],

        genesisProgress: 0
    }
};

function lowLevelDynamics(basin, x, y, t){
    const d = 10;

    const east = basin.env.get("LLSteering", x + d, y, t).copy();
    const west = basin.env.get("LLSteering", x - d, y, t).copy();
    const south = basin.env.get("LLSteering", x, y + d, t).copy();
    const north = basin.env.get("LLSteering", x, y - d, t).copy();

    const duDx = (east.x - west.x) / (2 * d);
    const dvDx = (east.y - west.y) / (2 * d);

    const duDy_screen = (south.x - north.x) / (2 * d);
    const dvDy_screen = (south.y - north.y) / (2 * d);

    const vorticity_nh = duDy_screen - dvDx;
    const convergence = -(duDx + dvDy_screen);

    const cyclonicVorticity = basin.SHem ? -vorticity_nh : vorticity_nh;

    return {
        vorticity: cyclonicVorticity,
        convergence: convergence
    };
}

function genesisPotential(basin, x, y){
    const coord = Coordinate.convertFromXY(basin.mapType, x, y);

    if(land && land.get(coord) > 0.5)
        return 0;

    const lat = abs(coord.latitude);
    if(lat < 3 || lat > 30)
        return 0;

    const t = basin.tick;
    const sst = basin.env.get("SST", x, y, t);
    const moisture = basin.env.get("moisture", x, y, t);
    const shearVec = basin.env.get("shear", x, y, t);
    const shear = shearVec ? shearVec.mag() : 0;

    const sstFactor = constrain(map(sst, 25, 29, 0, 1), 0, 1);
    if(sstFactor === 0) return 0;

    const moistureFactor = constrain(map(moisture, 0.45, 0.7, 0, 1), 0, 1);
    const shearFactor = constrain(map(shear, 3.5, 1, 0, 1), 0, 1);

    const lowLatitudeFactor = constrain(map(lat, 3, 8, 0, 1), 0, 1);
    const highLatitudeFactor = constrain(map(lat, 30, 22, 0, 1), 0, 1);
    const latitudeFactor = lowLatitudeFactor * highLatitudeFactor;
    if(latitudeFactor === 0) return 0;

    let dynamicsFactor = 0.2;
    try {
        const dynamics = lowLevelDynamics(basin, x, y, t);
        const vorticityFactor = constrain(map(dynamics.vorticity, -0.005, 0.02, 0, 1), 0, 1);
        const convergenceFactor = constrain(map(dynamics.convergence, -0.005, 0.02, 0, 1), 0, 1);
        dynamicsFactor = 0.2 + 0.8 * (vorticityFactor * 0.5 + convergenceFactor * 0.5);
    } catch(e) {
        dynamicsFactor = 0.2;
    }

    const thermoFactors = [
        sstFactor,
        moistureFactor,
        shearFactor,
        latitudeFactor
    ];

    const prod = thermoFactors.reduce((a, v) => a * v, 1);
    const thermoPotential = Math.pow(prod, 1 / thermoFactors.length);

    return thermoPotential * dynamicsFactor;
}

function southChinaSeaSeasonFactor(tick) {
    const frac = (tick % YEAR_LENGTH) / YEAR_LENGTH;
    const m = frac * 12;
    const arr = [
        [0, 0.05],
        [2, 0.05],
        [3.5, 0.1],
        [5, 0.45],
        [7, 0.95],
        [8.5, 0.85],
        [10, 0.65],
        [11, 0.2],
        [12, 0.05]
    ];
    let prev = arr[arr.length - 1];
    let prevX = prev[0] - 12;
    let prevY = prev[1];
    for (let i = 0; i < arr.length; i++) {
        let curr = arr[i];
        if (m < curr[0]) {
            return map(m, prevX, curr[0], prevY, curr[1]);
        }
        prevX = curr[0];
        prevY = curr[1];
    }
    return 0.05;
}

function trySpawnSouthChinaSeaDisturbance(basin){
    if(basin.mapType !== 8 || basin.SHem)
        return;

    const seasonFactor = southChinaSeaSeasonFactor(basin.tick);
    if(seasonFactor < 0.1)
        return;

    const longitude = random(105, 120);
    const latitude = random(5, 20);

    const pos = Coordinate.convertToXY(
        basin.mapType,
        longitude,
        latitude
    );

    if(pos.x < 0 || pos.x >= WIDTH || pos.y < 0 || pos.y >= HEIGHT)
        return;

    const coord = new Coordinate(longitude, latitude);

    if(land && land.get(coord) > 0.5)
        return;

    if(basin.activeSystems){
        for(let sys of basin.activeSystems){
            if(sys.pos && dist(sys.pos.x, sys.pos.y, pos.x, pos.y) < 60)
                return;
        }
    }

    const potential = genesisPotential(
        basin,
        pos.x,
        pos.y
    );

    const disturbanceChance = (0.0001 + 0.0012 * potential) * seasonFactor;

    if(random() < disturbanceChance){
        basin.spawnArchetype(
            'monsoonLow',
            pos.x,
            pos.y
        );
    }
}

SPAWN_RULES.defaults.doSpawn = function(b){
    // tropical waves
    if(random()<0.015*sq((seasonCurve(b.tick)+1)/2)) b.spawnArchetype('tw');

    // extratropical cyclones
    if(random()<0.01-0.002*seasonCurve(b.tick)) b.spawnArchetype('ex');

    // South China Sea disturbance
    trySpawnSouthChinaSeaDisturbance(b);
};

// -- Normal Mode -- //

SPAWN_RULES[SIM_MODE_NORMAL].doSpawn = SPAWN_RULES.defaults.doSpawn;

// -- Hyper Mode -- //

SPAWN_RULES[SIM_MODE_HYPER].doSpawn = function(b){
    if(random()<(0.013*sq((seasonCurve(b.tick)+1)/2)+0.002)) b.spawnArchetype('tw');

    if(random()<0.01-0.002*seasonCurve(b.tick)) b.spawnArchetype('ex');

    trySpawnSouthChinaSeaDisturbance(b);
};

// -- Wild Mode -- //

SPAWN_RULES[SIM_MODE_WILD].archetypes = {
    'tw': {
        x: ()=>random(0,WIDTH-1),
        y: (b)=>b.hemY(random(HEIGHT*0.2,HEIGHT*0.9)),
        pressure: [1000, 1020],
        windSpeed: [15, 35],
        type: TROPWAVE,
        organization: [0,0.3],
        lowerWarmCore: 1,
        upperWarmCore: 1,
        depth: 0
    }
};

SPAWN_RULES[SIM_MODE_WILD].doSpawn = function(b){
    if(random()<0.015) b.spawnArchetype('tw');
    if(random()<0.01-0.002*seasonCurve(b.tick)) b.spawnArchetype('ex');
    trySpawnSouthChinaSeaDisturbance(b);
};

// -- Megablobs Mode -- //

SPAWN_RULES[SIM_MODE_MEGABLOBS].doSpawn = function(b){
    if(random()<(0.013*sq((seasonCurve(b.tick)+1)/2)+0.002)) b.spawnArchetype('tw');

    if(random()<0.01-0.002*seasonCurve(b.tick)) b.spawnArchetype('ex');
    trySpawnSouthChinaSeaDisturbance(b);
};

// -- Experimental Mode -- //

SPAWN_RULES[SIM_MODE_EXPERIMENTAL].archetypes = {
    'tw': {
        x: ()=>random(0,WIDTH-1),
        y: (b)=>b.hemY(random(HEIGHT*0.7,HEIGHT*0.9)),
        pressure: [1000, 1020],
        windSpeed: [15, 35],
        type: TROPWAVE,
        organization: [0,0.3],
        lowerWarmCore: 1,
        upperWarmCore: 1,
        depth: 0,
        kaboom: 0
    },
    'ex': {
        x: ()=>random(0,WIDTH-1),
        y: (b,x)=>b.hemY(b.env.get("jetstream",x,0,b.tick)+random(-75,75)),
        pressure: [1000, 1020],
        windSpeed: [15, 35],
        type: EXTROP,
        organization: 0,
        lowerWarmCore: 0,
        upperWarmCore: 0,
        depth: 1,
        kaboom: 0
    },
    'tc': {
        pressure: 1005,
        windSpeed: 25,
        type: TROP,
        organization: 1,
        lowerWarmCore: 1,
        upperWarmCore: 1,
        depth: 0,
        kaboom: 0.2
    },
    'l': {
        inherit: 'tw',
        pressure: 1015,
        windSpeed: 15,
        organization: 0.2,
        kaboom: 0.2
    },
    'x': {
        inherit: 'ex',
        pressure: 1005,
        windSpeed: 15,
        kaboom: 0.2
    }
};

SPAWN_RULES[SIM_MODE_EXPERIMENTAL].doSpawn = SPAWN_RULES[SIM_MODE_HYPER].doSpawn;

// -- Spooky Mode -- //

SPAWN_RULES[SIM_MODE_SPOOKY].doSpawn = SPAWN_RULES.defaults.doSpawn;


// ---- Definitions of Environmental Fields ---- //

const ENV_DEFS = {};

ENV_DEFS.defaults = {}; // Env field attributes that are the same across multiple simulation modes
ENV_DEFS[SIM_MODE_NORMAL] = {}; // Register env fields as part of "Normal" simulation mode and define unique attributes
ENV_DEFS[SIM_MODE_HYPER] = {}; // Same for "Hyper" simulation mode
ENV_DEFS[SIM_MODE_WILD] = {};  // "Wild" simulation mode
ENV_DEFS[SIM_MODE_MEGABLOBS] = {}; // "Megablobs" simulation mode
ENV_DEFS[SIM_MODE_EXPERIMENTAL] = {}; // "Experimental" simulation mode
ENV_DEFS[SIM_MODE_SPOOKY] = {}; // "Spooky" simulation mode

// -- Sample Env Field -- //

// ENV_DEFS.defaults.sample = {
//     version: 0,
//     mapFunc: (u,x,y,z)=>{
//         // Insert code here
//     },
//     hueMap: (v)=>{
//         // Insert code here
//     },
//     oceanic: true,
//     vector: false,
//     invisible: false,
//     magMap: undefined,
//     noWobble: false,
//     noiseChannels: [
//         [6,0.5,150,3000,0.05,1.5]
//     ]
// };
// ENV_DEFS[SIM_MODE_NORMAL].sample = {};
// ENV_DEFS[SIM_MODE_HYPER].sample = {
//     mapFunc: (u,x,y,z)=>{
//         // Insert code here
//     }
// };
// ENV_DEFS[SIM_MODE_WILD].sample = {};
// ENV_DEFS[SIM_MODE_MEGABLOBS].sample = {};
// ENV_DEFS[SIM_MODE_EXPERIMENTAL].sample = {};

// -- jetstream -- //

ENV_DEFS.defaults.jetstream = {
    version: 0,
    mapFunc: (u,x,y,z)=>{
        let v = u.noise(0,x-z*3,0,z);
        let peakLat = u.modifiers.peakLat;
        let antiPeakLat = u.modifiers.antiPeakLat;
        let peakRange = u.modifiers.peakRange;
        let antiPeakRange = u.modifiers.antiPeakRange;
        let s = seasonCurve(z);
        let l = map(sqrt(map(s,-1,1,0,1)),0,1,antiPeakLat,peakLat);
        let r = map(s,-1,1,antiPeakRange,peakRange);
        v = map(v,0,1,-r,r);
        return (l+v)*HEIGHT;
    },
    invisible: true,
    noiseChannels: [
        [4,0.5,160,300,1,2]
    ],
    modifiers: {
        peakLat: 0.35,
        antiPeakLat: 0.55,
        peakRange: 0.35,
        antiPeakRange: 0.5
    }
};
ENV_DEFS[SIM_MODE_NORMAL].jetstream = {};
ENV_DEFS[SIM_MODE_HYPER].jetstream = {
    modifiers: {
        peakLat: 0.25,
        antiPeakLat: 0.47,
        peakRange: 0.25,
        antiPeakRange: 0.45
    }
};
ENV_DEFS[SIM_MODE_WILD].jetstream = {
    mapFunc: (u,x,y,z)=>{
        let v = u.noise(0,x-z*3,0,z);
        let s = u.yearfrac(z);
        let l = u.piecewise(s,[[1,0.65],[2.5,-0.15],[10,-0.15],[11.5,0.65]]);
        let r = u.piecewise(s,[[0.5,0.3],[1.75,0.7],[3,0.2],[9.5,0.2],[10.75,0.7],[12,0.3]]);
        v = map(v,0,1,-r,r);
        return (l+v)*HEIGHT;
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].jetstream = {
    modifiers: {
        peakLat: 0.25,
        antiPeakLat: 0.47,
        peakRange: 0.25,
        antiPeakRange: 0.45
    }
};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].jetstream = {};
ENV_DEFS[SIM_MODE_SPOOKY].jetstream = {};

// -- LLSteering -- //

ENV_DEFS.defaults.LLSteering = {
    displayName: 'Low-level steering',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        u.vec.set(1);    // reset vector

        // Jetstream
        let j = u.field('jetstream');
        // Cosine curve from 0 at poleward side of map to 1 at equatorward side
        let h = map(cos(map(y,0,HEIGHT,0,PI)),-1,1,1,0);
        // westerlies
        let west = constrain(pow(1-h+map(u.noise(0), 0, 1, -u.modifiers.westerlyNoiseRange, u.modifiers.westerlyNoiseRange)+map(j, 0, HEIGHT, -u.modifiers.westerlyJetstreamEffectRange, u.modifiers.westerlyJetstreamEffectRange),2)*4,0, u.modifiers.westerlyMax);
        // ridging and trades
        let ridging = constrain(u.noise(1)+map(j, 0, HEIGHT, u.modifiers.ridgingJetstreamEffectRange, -u.modifiers.ridgingJetstreamEffectRange),0,1);
        let trades = constrain(pow(h+map(ridging, 0, 1, -u.modifiers.tradesRidgingEffectRange, u.modifiers.tradesRidgingEffectRange),2)*3,0, u.modifiers.tradesMax);
        let tAngle = map(h, 0.9, 1, u.modifiers.tradesAngle, u.modifiers.tradesAngleEquator); // trades angle
        // noise angle
        let a = map(u.noise(3),0,1,0,4*TAU);
        // noise magnitude
        let m = pow(u.modifiers.noiseBase, map(u.noise(2), 0, 1, u.modifiers.noiseExponentMin, u.modifiers.noiseExponentMax));

        // apply to vector
        u.vec.rotate(a);
        u.vec.mult(m);
        u.vec.add(west+trades*cos(tAngle),trades*sin(tAngle));
        return u.vec;
    },
    displayFormat: v=>{
        let speed = round(v.mag()*100)/100;
        let direction = v.heading();
        // speed is still in "u/hr" (coordinate units per hour) for now
        return speed + ' u/hr ' + compassHeading(direction);
    },
    vector: true,
    magMap: [0,3,0,16],
    noiseChannels: [
        [4,0.5,80,100,1,3],
        '',
        '',
        [4,0.5,170,300,1,3]
    ],
    modifiers: {
        westerlyNoiseRange: 0.3,
        westerlyJetstreamEffectRange: 0.4,
        westerlyMax: 4,
        ridgingJetstreamEffectRange: 0.3,
        tradesRidgingEffectRange: 0.3,
        tradesMax: 3,
        tradesAngleEquator: 17*Math.PI/16,
        tradesAngle: 511*Math.PI/512,
        noiseBase: 1.5,
        noiseExponentMin: -8,
        noiseExponentMax: 4
    }
};
ENV_DEFS[SIM_MODE_NORMAL].LLSteering = {};
ENV_DEFS[SIM_MODE_HYPER].LLSteering = {};
ENV_DEFS[SIM_MODE_WILD].LLSteering = {
    mapFunc: (u,x,y,z)=>{
        u.vec.set(1);    // reset vector

        let s = u.yearfrac(z);
        let wind = u.piecewise(s,[[1,3],[2.5,1],[4.5,0.5],[6,0.75],[7.5,0.65],[7.75,0.05],[8,1.1],[10,1.8],[11,3]]); // wind strength
        let windAngle = u.piecewise(s,[[1,13*PI/8],[2.5,9*PI/8],[4.5,PI],[6,17*PI/16],[7.5,17*PI/16],[8,31*PI/16],[10,15*PI/8],[11.5,13*PI/8]]); // wind angle
        // noise angle
        let a = map(u.noise(3),0,1,0,4*TAU);
        // noise magnitude
        let m = pow(u.modifiers.noiseBase, map(u.noise(2), 0, 1, u.modifiers.noiseExponentMin, u.modifiers.noiseExponentMax));

        // apply to vector
        u.vec.rotate(a);
        u.vec.mult(m);
        u.vec.add(wind*cos(windAngle),wind*sin(windAngle));
        return u.vec;
    },
    modifiers: {
        noiseExponentMin: -3,
        noiseExponentMax: 4
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].LLSteering = {};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].LLSteering = {};
ENV_DEFS[SIM_MODE_SPOOKY].LLSteering = {};

// -- ULSteering -- //

ENV_DEFS.defaults.ULSteering = {
    displayName: 'Upper-level steering',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        u.vec.set(1);                                                                           // reset vector

        const dx = u.modifiers.jetstreamDeltaX;                                                 // delta-x for jetstream differential (used for calculating wind direction in and near jetstream)

        let m = u.noise(1);

        let s = seasonCurve(z);
        let j0 = u.field('jetstream');                                                          // y-position of jetstream
        let j1 = u.field('jetstream',x+dx);                                                     // y-position of jetstream dx to the east for differential
        let j = abs(y-j0);                                                                      // distance of point north/south of jetstream
        let jet = pow(2, 3 - j / u.modifiers.jetstreamHalfDecay);                               // power of jetstream at point
        let jOP = pow(u.modifiers.jetstreamOverpowerBase, jet);                                 // factor for how strong other variables should be if 'overpowered' by jetstream
        let jAngle = atan((j1 - j0) / dx) + map(y-j0, -50, 50, u.modifiers.jetstreamInwardAngle, -u.modifiers.jetstreamInwardAngle, true); // angle of jetstream at point
        let trof = y>j0 ? pow(u.modifiers.troughBase, map(jAngle, -PI/2, PI/2, u.modifiers.troughExponentMax, u.modifiers.troughExponentMin)) * pow(0.7,j/20)*jOP : 0; // pole-eastward push from jetstream dips
        let tAngle = u.modifiers.troughAngle;                                                   // angle of push from jetstream dips
        let ridging = 0.45-j0/HEIGHT-map(sqrt(map(s,-1,1,0,1)),0,1,0.15,0);                     // how much 'ridge' or 'trough' there is from jetstream
        // power of winds equatorward of jetstream
        let hadley = (map(ridging, -0.3, 0.2, u.modifiers.hadleyUpperBound, u.modifiers.hadleyLowerBound, true) + map(m,0,1,-1.5,1.5))*jOP*(y>j0?1:0);
        // angle of winds equatorward of jetstream
        let hAngle = map(ridging,-0.3,0.2, u.modifiers.hadleyAngleMin, u.modifiers.hadleyAngleMax,true);
        let ferrel = 2*jOP*(y<j0?1:0);                                                          // power of winds poleward of jetstream
        let fAngle = 5*PI/8;                                                                    // angle of winds poleward of jetstream

        let a = map(u.noise(0),0,1,0,4*TAU);                                                    // noise angle
        m = pow(u.modifiers.noiseBase, map(m, 0, 1, u.modifiers.noiseExponentMin, u.modifiers.noiseExponentMax))*jOP; // noise magnitude

        // apply noise
        u.vec.rotate(a);
        u.vec.mult(m);

        // apply UL winds
        u.vec.add(jet*cos(jAngle),jet*sin(jAngle));                                             // apply jetstream
        u.vec.add(trof*cos(tAngle),trof*sin(tAngle));                                           // apply trough push
        u.vec.add(hadley*cos(hAngle),hadley*sin(hAngle));                                       // apply winds equatorward of jetstream
        u.vec.add(ferrel*cos(fAngle),ferrel*sin(fAngle));                                       // apply winds poleward of jetstream

        return u.vec;
    },
    displayFormat: v=>{
        let speed = round(v.mag()*100)/100;
        let direction = v.heading();
        // speed is still in "u/hr" (coordinate units per hour) for now
        return speed + ' u/hr ' + compassHeading(direction);
    },
    vector: true,
    magMap: [0,8,0,25],
    modifiers: {
        jetstreamDeltaX: 10,
        jetstreamHalfDecay: 40,
        jetstreamOverpowerBase: 0.7,
        jetstreamInwardAngle: Math.PI/4,
        troughBase: 1.7,
        troughExponentMin: -5,
        troughExponentMax: 3,
        troughAngle: -Math.PI/16,
        hadleyUpperBound: 5,
        hadleyLowerBound: 1.5,
        hadleyAngleMin: -Math.PI/16,
        hadleyAngleMax: -15*Math.PI/16,
        noiseBase: 1.5,
        noiseExponentMin: -8,
        noiseExponentMax: 4
    },
    noiseChannels: [
        [4,0.5,180,300,1,2],
        [4,0.5,90,100,1,3]
    ]
};
ENV_DEFS[SIM_MODE_NORMAL].ULSteering = {};
ENV_DEFS[SIM_MODE_HYPER].ULSteering = {
    modifiers: {
        hadleyUpperBound: 3
    }
};
ENV_DEFS[SIM_MODE_WILD].ULSteering = {
    mapFunc: (u,x,y,z)=>{
        u.vec.set(1);                                                                   // reset vector

        const dx = 10;                                                                  // delta-x for jetstream differential (used for calculating wind direction in and near jetstream)

        let m = u.noise(1);

        let s = u.yearfrac(z);
        let j0 = u.field('jetstream');                                                  // y-position of jetstream
        let j1 = u.field('jetstream',x+dx);                                             // y-position of jetstream dx to the east for differential
        let j = abs(y-j0);                                                              // distance of point north/south of jetstream
        let jet = pow(2,3-j/30);                                                        // power of jetstream at point
        let jOP = pow(0.7,jet);                                                         // factor for how strong other variables should be if 'overpowered' by jetstream
        let jAngle = atan((j1-j0)/dx)+map(y-j0,-50,50,PI/15,-PI/17,true);               // angle of jetstream at point
        // power of winds equatorward of jetstream
        let hadley = (u.piecewise(s,[[1,4.5],[2.5,1.2],[4,0.5],[4.5,1.7],[5,0.6],[6.5,0.65],[7.5,0.65],[7.75,0.05],[8,1.3],[9,1.7],[10,2.3],[11.5,4.5]]))*jOP*(y>j0?1:0);
        // angle of winds equatorward of jetstream
        let hAngle = u.piecewise(s,[[1,11*PI/8],[2.5,9*PI/8],[4,17*PI/16],[4.5,11*PI/8],[5,17*PI/16],[6.5,35*PI/32],[7.5,17*PI/16],[8,31*PI/16],[9,15*PI/8],[10,7*PI/4],[10.5,11*PI/8]]);
        let ferrel = 2*jOP*(y<j0?map(j0-y,0,400,1,0,true):0);                           // power of winds poleward of jetstream
        let fAngle = 5*PI/8;                                                            // angle of winds poleward of jetstream

        let a = map(u.noise(0),0,1,0,4*TAU);                                            // noise angle
        m = pow(u.modifiers.noiseBase, map(m, 0, 1, u.modifiers.noiseExponentMin, u.modifiers.noiseExponentMax))*jOP; // noise magnitude

        // apply noise
        u.vec.rotate(a);
        u.vec.mult(m);

        // apply UL winds
        u.vec.add(jet*cos(jAngle),jet*sin(jAngle));                                     // apply jetstream
        u.vec.add(hadley*cos(hAngle),hadley*sin(hAngle));                               // apply winds equatorward of jetstream
        u.vec.add(ferrel*cos(fAngle),ferrel*sin(fAngle));                               // apply winds poleward of jetstream

        return u.vec;
    },
    modifiers: {
        noiseExponentMin: -3,
        noiseExponentMax: 4
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].ULSteering = {};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].ULSteering = {};
ENV_DEFS[SIM_MODE_SPOOKY].ULSteering = {};

// -- shear -- //

ENV_DEFS.defaults.shear = {
    displayName: 'Wind shear',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        let ll = u.field('LLSteering');
        let ul = u.field('ULSteering');
        u.vec.set(ul);
        u.vec.sub(ll);
        return u.vec;
    },
    displayFormat: v=>{
        let speed = round(v.mag()*100)/100;
        let direction = v.heading();
        // speed is still in "u/hr" (coordinate units per hour) for now
        return speed + ' u/hr ' + compassHeading(direction);
    },
    vector: true,
    noVectorFlip: true,
    magMap: [0,8,0,25],
    hueMap: (v)=>{
        colorMode(HSB);
        let strong = color(0,100,80);
        let moderate = color(60,100,90);
        let weak = color(120,100,80);
        let c;
        if(v < 2)
            c = lerpColor(weak, moderate, map(v,0.5,2,0,1));
        else
            c = lerpColor(moderate, strong, map(v,2,3.5,0,1));
        colorMode(RGB);
        return c;
    }
};
ENV_DEFS[SIM_MODE_NORMAL].shear = {};
ENV_DEFS[SIM_MODE_HYPER].shear = {};
ENV_DEFS[SIM_MODE_WILD].shear = {};
ENV_DEFS[SIM_MODE_MEGABLOBS].shear = {};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].shear = {};
ENV_DEFS[SIM_MODE_SPOOKY].shear = {};

// -- SSTAnomaly -- //

ENV_DEFS.defaults.SSTAnomaly = {
    displayName: 'Sea surface temp. anomaly',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        let v = u.noise(0);
        v = v*2;
        let i = v<1 ? -1 : 1;
        v = 1-abs(1-v);
        if(v===0) v = 0.000001;
        v = log(v);
        let r;
        if(u.modifiers.r!==undefined) r = u.modifiers.r;
        else r = map(y,0,HEIGHT,6,3);
        v = -r*v;
        v = v*i;
        if(u.modifiers.bigBlobBase!==undefined && v>u.modifiers.bigBlobExponentThreshold) v += pow(u.modifiers.bigBlobBase,v-u.modifiers.bigBlobExponentThreshold)-1;
        return v;
    },
    displayFormat: v=>{
        let str = '';
        if(v >= 0)
            str += '+';
        str += round(v*10)/10;
        str += '\u2103'; // degrees celsius sign
        return str;
    },
    hueMap: (v)=>{
        colorMode(HSB);
        let cold = color(240,100,70);
        let hot = color(0,100,70);
        let cNeutral = color(240,1,90);
        let hNeutral = color(0,1,90);
        let c;
        if(v<0) c = lerpColor(cold,cNeutral,map(v,-5,0,0,1));
        else c = lerpColor(hNeutral,hot,map(v,0,5,0,1));
        colorMode(RGB);
        return c;
    },
    oceanic: true,
    noiseChannels: [
        [6,0.5,150,3000,0.05,1.5]
    ]
};
ENV_DEFS[SIM_MODE_NORMAL].SSTAnomaly = {};
ENV_DEFS[SIM_MODE_HYPER].SSTAnomaly = {};
ENV_DEFS[SIM_MODE_WILD].SSTAnomaly = {
    modifiers: {
        r: 5,
        bigBlobBase: 1.4,
        bigBlobExponentThreshold: 1.5
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].SSTAnomaly = {
    modifiers: {
        r: 7,
        bigBlobBase: 1.8,
        bigBlobExponentThreshold: 1
    }
};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].SSTAnomaly = {};
ENV_DEFS[SIM_MODE_SPOOKY].SSTAnomaly = {};

// -- SST -- //

ENV_DEFS.defaults.SST = {
    displayName: 'Sea surface temperature',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        if(y<0) return 0;
        let anom = u.field('SSTAnomaly');
        let s = seasonCurve(z);
        let w = map(cos(map(x,0,WIDTH,0,PI)),-1,1,0,1);
        let h0 = y/HEIGHT;
        let h1 = (sqrt(h0)+h0)/2;
        let h2 = sqrt(sqrt(h0));
        let h = map(cos(lerp(PI,0,lerp(h1,h2,sq(w)))),-1,1,0,1);
        let ospt = u.modifiers.offSeasonPolarTemp;
        let pspt = u.modifiers.peakSeasonPolarTemp;
        let ostt = u.modifiers.offSeasonTropicsTemp;
        let pstt = u.modifiers.peakSeasonTropicsTemp;
        let t = lerp(map(s,-1,1,ospt,pspt),map(s,-1,1,ostt,pstt),h);
        return t+anom;
    },
    displayFormat: v=>{
        let str = '';
        str += round(v*10)/10;
        str += '\u2103'; // degrees celsius sign
        return str;
    },
    hueMap: (v)=>{
        colorMode(HSB);
        let c;
        if(v<10) c = lerpColor(color(240,1,100),color(240,100,70),map(v,0,10,0,1));
        else if(v<20) c = lerpColor(color(240,100,70),color(180,50,90),map(v,10,20,0,1));
        else if(v<26) c = lerpColor(color(180,50,90),color(120,100,65),map(v,20,26,0,1));
        else if(v<29) c = lerpColor(color(60,100,100),color(0,100,70),map(v,26,29,0,1));
        else if(v<34) c = lerpColor(color(359,100,70),color(300,5,100),map(v,29,34,0,1));
        else if(v<40) c = lerpColor(color(300,5,100),color(150,10,90),map(v,34,40,0,1));
        else if(v<50) c = lerpColor(color(150,10,90),color(150,60,75),map(v,40,50,0,1));
        else if(v<75) c = lerpColor(color(30,90,90),color(30,30,90),map(v,50,75,0,1));
        else if(v<150) c = lerpColor(color(0,0,35),color(0,0,95),map(v,75,150,0,1));
        else c = lerpColor(color(0,0,25),color(0,0,95),map(v%150,0,150,0,1));
        colorMode(RGB);
        return c;
    },
    oceanic: true,
    modifiers: {
        offSeasonPolarTemp: -3,
        peakSeasonPolarTemp: 10,
        offSeasonTropicsTemp: 26,
        peakSeasonTropicsTemp: 29
    }
};
ENV_DEFS[SIM_MODE_NORMAL].SST = {};
ENV_DEFS[SIM_MODE_HYPER].SST = {
    modifiers: {
        offSeasonPolarTemp: 5,
        peakSeasonPolarTemp: 20,
        offSeasonTropicsTemp: 31,
        peakSeasonTropicsTemp: 35
    }
};
ENV_DEFS[SIM_MODE_WILD].SST = {
    mapFunc: (u,x,y,z)=>{
        if(y<0) return 0;
        let anom = u.field('SSTAnomaly');
        let s = u.yearfrac(z);
        let t = u.piecewise(s,[[0,22],[2,25.5],[4,25],[5,26.5],[6,27],[6.25,30],[6.75,31],[7,28],[9,27],[10,26],[11,23]]);
        return t+anom;
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].SST = {
    modifiers: {
        offSeasonPolarTemp: -5,
        peakSeasonPolarTemp: 20,
        offSeasonTropicsTemp: 23,
        peakSeasonTropicsTemp: 28.5
    }
};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].SST = {
    version:1,
    modifiers: {
        offSeasonPolarTemp: 20,
        peakSeasonPolarTemp: 22,
        offSeasonTropicsTemp: 26,
        peakSeasonTropicsTemp: 28
    }
};
ENV_DEFS[SIM_MODE_SPOOKY].SST = {};

// -- moisture -- //

ENV_DEFS.defaults.moisture = {
    displayName: 'Relative humidity',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        let v = u.noise(0);
        let s = seasonCurve(z);
        let l = land ? land.get(Coordinate.convertFromXY(u.basin.mapType, x, u.basin.hemY(y))) : 0;
        let pm = u.modifiers.polarMoisture;
        let tm = u.modifiers.tropicalMoisture;
        let mm = u.modifiers.mountainMoisture;
        let m = map(l,0.5,0.7,map(y,0,HEIGHT,pm,tm),mm,true);
        m += map(s,-1,1,-0.08,0.08);
        m += map(v,0,1,-0.3,0.3);
        m = constrain(m,0,1);
        return m;
    },
    displayFormat: v=>{
        return round(v*1000)/10 + '%';
    },
    hueMap: v=>{
        colorMode(HSB);
        let c;
        if(v<0.5) c = lerpColor(color(45,100,30),color(45,1,90),map(v,0,0.5,0,1));
        else c = lerpColor(color(180,1,90),color(180,100,30),map(v,0.5,1,0,1));
        colorMode(RGB);
        return c;
    },
    modifiers: {
        polarMoisture: 0.43,
        tropicalMoisture: 0.57,
        mountainMoisture: 0.2
    },
    noiseChannels: [
        [4,0.5,120,120,0.3,2]
    ]
};
ENV_DEFS[SIM_MODE_NORMAL].moisture = {};
ENV_DEFS[SIM_MODE_HYPER].moisture = {
    modifiers: {
        polarMoisture: 0.52,
        tropicalMoisture: 0.62,
        mountainMoisture: 0.3
    }
};
ENV_DEFS[SIM_MODE_WILD].moisture = {
    mapFunc: (u,x,y,z)=>{
        let v = u.noise(0);
        let s = u.yearfrac(z);
        let l = land ? land.get(Coordinate.convertFromXY(u.basin.mapType, x, u.basin.hemY(y))) : 0;
        let om = u.piecewise(s,[
            [0.5,0.35],[2,0.55],[4,0.6],[5.75,0.58],[6,0.1],[7,0.2],[7.25,0.6],[8.5,0.72],[10,0.55],[11.5,0.35]
        ]);
        let mm = u.modifiers.mountainMoisture;
        let m = map(l,0.5,0.7,om,mm,true);
        m += map(v,0,1,-0.3,0.3);
        m = constrain(m,0,1);
        return m;
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].moisture = {};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].moisture = {};
ENV_DEFS[SIM_MODE_SPOOKY].moisture = {};

// ---- Active Storm System Algorithm ---- //

const STORM_ALGORITHM = {};

STORM_ALGORITHM.defaults = {};
STORM_ALGORITHM[SIM_MODE_NORMAL] = {};
STORM_ALGORITHM[SIM_MODE_HYPER] = {};
STORM_ALGORITHM[SIM_MODE_WILD] = {};
STORM_ALGORITHM[SIM_MODE_MEGABLOBS] = {};
STORM_ALGORITHM[SIM_MODE_EXPERIMENTAL] = {};
STORM_ALGORITHM[SIM_MODE_SPOOKY] = {};

// -- Interaction -- //

STORM_ALGORITHM.defaults.interactionInit = {
    fuji: true,
    shear: false,
    kill: false
};

STORM_ALGORITHM.defaults.interaction = function(sys0, sys1){
    let interactionData = {};

    let v = createVector();
    v.set(sys0.pos);
    v.sub(sys1.pos);
    let m = v.mag();
    let r = map(sys1.lowerWarmCore,0,1,150,50);
    if(m<r && m>0){
        v.rotate(sys0.basin.hem(-TAU/4+((3/m)*TAU/16)));
        v.setMag(map(m,r,0,0,map(constrain(sys1.pressure,990,1030),1030,990,0.2,2.2)));
        interactionData.fuji = v;
        interactionData.shear = map(m,r,0,0,map(sys1.pressure,1030,900,0,6));
        if((m < map(sys0.pressure,1030,1000,r/5,r/15) || m<5) && sys0.pressure > sys1.pressure)
            interactionData.kill = 1;
    }

    return interactionData;
};

// -- Steering -- //

STORM_ALGORITHM.defaults.steering = function(sys,vec,u){
    let ll = u.f("LLSteering");
    let ul = u.f("ULSteering");
    let d = sqrt(sys.depth);
    let x = lerp(ll.x,ul.x,d);       // Deeper systems follow upper-level steering more and lower-level steering less
    let y = lerp(ll.y,ul.y,d);
    vec.set(x,y);
    vec.add(sys.interaction.fuji);
};

// -- Core -- //

STORM_ALGORITHM.defaults.core = function(sys,u){
    let SST = u.f("SST");
    let jet = u.f("jetstream");
    jet = sys.basin.hemY(sys.pos.y)-jet;
    let lnd = u.land();
    let moisture = u.f("moisture");
    let shear = u.f("shear").mag()+sys.interaction.shear;
    
    let targetWarmCore = (lnd ?
        sys.lowerWarmCore :
        max(pow(map(SST,10,25,0,1,true),3),sys.lowerWarmCore)
    )*map(jet,0,75,sq(1-sys.depth),1,true);
    sys.lowerWarmCore = lerp(sys.lowerWarmCore,targetWarmCore,sys.lowerWarmCore>targetWarmCore ? map(jet,0,75,0.4,0.06,true) : 0.04);
    sys.upperWarmCore = lerp(sys.upperWarmCore,sys.lowerWarmCore,sys.lowerWarmCore>sys.upperWarmCore ? 0.05 : 0.4);
    sys.lowerWarmCore = constrain(sys.lowerWarmCore,0,1);
    sys.upperWarmCore = constrain(sys.upperWarmCore,0,1);
    let tropicalness = constrain(map(sys.lowerWarmCore,0.5,1,0,1),0,sys.upperWarmCore);
    let nontropicalness = constrain(map(sys.lowerWarmCore,0.75,0,0,1),0,1);

    sys.organization *= 100;
    if(!lnd) sys.organization += sq(map(SST,20,29,0,1,true))*3*tropicalness;
    if(!lnd && sys.organization<40) sys.organization += lerp(0,3,nontropicalness);
    // if(lnd) sys.organization -= pow(10,map(lnd,0.5,1,-3,1));
    // if(lnd && sys.organization<70 && moisture>0.3) sys.organization += pow(5,map(moisture,0.3,0.5,-1,1,true))*tropicalness;
    sys.organization -= pow(2,4-((HEIGHT-sys.basin.hemY(sys.pos.y))/(HEIGHT*0.01)));
    sys.organization -= (pow(map(sys.depth,0,1,1.17,1.31),shear)-1)*map(sys.depth,0,1,4.7,1.2);
    sys.organization -= map(moisture,0,0.65,3,0,true)*shear;
    sys.organization += sq(map(moisture,0.6,1,0,1,true))*4;
    sys.organization -= pow(1.3,20-SST)*tropicalness;
    sys.organization = constrain(sys.organization,0,100);
    sys.organization /= 100;

    let targetPressure = 1010-25*log((lnd||SST<25)?1:map(SST,25,30,1,2))/log(1.17);
    targetPressure = lerp(1010,targetPressure,pow(sys.organization,3));
    sys.pressure = lerp(sys.pressure,targetPressure,(sys.pressure>targetPressure?0.05:0.08)*tropicalness);
    sys.pressure -= random(-3,3.5)*nontropicalness;
    if(sys.organization<0.3) sys.pressure += random(-2,2.5)*tropicalness;
    sys.pressure += random(constrain(970-sys.pressure,0,40))*nontropicalness;
    sys.pressure += 0.5*sys.interaction.shear/(1+map(sys.lowerWarmCore,0,1,4,0));
    sys.pressure += map(jet,0,75,5*pow(1-sys.depth,4),0,true);

    let targetWind = map(sys.pressure,1030,900,1,160)*map(sys.lowerWarmCore,1,0,1,0.6);
    sys.windSpeed = lerp(sys.windSpeed,targetWind,0.15);

    let targetDepth = map(
        sys.upperWarmCore,
        0,1,
        1,map(
            sys.organization,
            0,1,
            sys.depth*pow(0.95,shear),max(map(sys.pressure,1010,950,0,0.7,true),sys.depth)
        )
    );
    sys.depth = lerp(sys.depth,targetDepth,0.05);

    if(sys.genesisProgress === undefined)
        sys.genesisProgress = (sys.type === TROP || sys.type === SUBTROP) ? 1 : 0;

    if(sys.type === TROPWAVE || sys.type === EXTROP || sys.genesisProgress < 1){
        const g = genesisPotential(sys.basin, sys.pos.x, sys.pos.y);
        if(g > 0.48){
            sys.genesisProgress += (g - 0.48) / 14;
        }else{
            sys.genesisProgress -= (0.48 - g) / 8;
        }

        const strongPreGenesis =
            g >= 0.52 &&
            sys.windSpeed >= 30 &&
            sys.organization >= 0.50 &&
            sys.lowerWarmCore >= 0.58;

        if(strongPreGenesis){
            sys.genesisProgress = max(sys.genesisProgress, 0.85);
        }

        const decisiveGenesis =
            g >= 0.55 &&
            sys.genesisProgress >= 0.82 &&
            sys.pressure < 998 &&
            sys.windSpeed >= 34;

        if(decisiveGenesis)
            sys.genesisProgress = 1;

        sys.genesisProgress = constrain(sys.genesisProgress, 0, 1);
    }else{
        sys.genesisProgress = 1;
    }

    if(sys.type === TROPWAVE && !canTropicalCycloneForm(sys)){
        const minPressure = map(
            sys.genesisProgress,
            0, 1,
            1008, 1000
        );

        const maxWind = map(
            sys.genesisProgress,
            0, 1,
            24, 33
        );

        sys.pressure = max(sys.pressure, minPressure);
        sys.windSpeed = min(sys.windSpeed, maxWind);
    }

    if(sys.pressure > 1030 || sys.interaction.kill > 0)
        sys.kill = true;
};

STORM_ALGORITHM[SIM_MODE_EXPERIMENTAL].core = function(sys,u){
    let SST = u.f("SST");
    let jet = u.f("jetstream");
    jet = sys.basin.hemY(sys.pos.y)-jet;
    let lnd = u.land();
    let moisture = u.f("moisture");
    let shear = u.f("shear").mag()+sys.interaction.shear;
    
    sys.lowerWarmCore = lerp(sys.lowerWarmCore,0,map(jet,0,75,0.07,0));
    sys.lowerWarmCore = lerp(sys.lowerWarmCore,1,map(jet,50,100,0,map(SST,16,26,0,0.13,true),true));
    if(sys.upperWarmCore > sys.lowerWarmCore)
        sys.upperWarmCore = sys.lowerWarmCore;
    else
        sys.upperWarmCore = lerp(sys.upperWarmCore,sys.lowerWarmCore,0.015);
    sys.lowerWarmCore = constrain(sys.lowerWarmCore,0,1);
    sys.upperWarmCore = constrain(sys.upperWarmCore,0,1);
    let tropicalness = (sys.lowerWarmCore+sys.upperWarmCore)/2;

    if(!lnd)
        sys.organization = lerp(sys.organization,1,sq(tropicalness)*map(SST,21,31,0,0.05,true));
    sys.organization = lerp(sys.organization,0,pow(3,shear*(1-moisture)*2.3)*0.0005);
    if(lnd>0.7)
        sys.organization = lerp(sys.organization,0,0.03);
    sys.organization = constrain(sys.organization,0,1);

    let hardCeiling = map(SST,21,31,1015,880);
    if(lnd)
        hardCeiling = 990;
    let softCeiling = map(sys.organization,0.93,0.98,lerp(1020,hardCeiling,0.7),hardCeiling,true);
    sys.pressure = lerp(sys.pressure,1032,0.006);
    sys.pressure = lerp(sys.pressure,980,(1-tropicalness)*map(jet,0,75,0.025,0,true));
    sys.pressure = lerp(sys.pressure,softCeiling,tropicalness*sys.organization*0.03);
    if(sys.pressure<1000)
        sys.pressure = lerp(sys.pressure,1000,tropicalness*(1-sys.organization)*0.01);
    sys.pressure = lerp(sys.pressure,1040,map(sys.pos.y,HEIGHT*0.97,HEIGHT,0,0.15,true));
    sys.pressure = lerp(sys.pressure,1040,map(lnd,0.8,0.93,0,0.2,true));
    sys.pressure += random(-1,1);

    let targetWind = map(sys.pressure,1030,900,1,160)*map(sys.lowerWarmCore,1,0,1,0.6);
    sys.windSpeed = lerp(sys.windSpeed,targetWind,0.15);

    sys.depth = lerp(sys.depth,1,(1-tropicalness)*0.02);
    sys.depth = lerp(sys.depth,0,tropicalness*(1-sys.organization)*0.02);
    sys.depth = lerp(sys.depth,lnd ? 0.5 : map(SST,26,29,0.5,0.65,true),tropicalness*sys.organization*0.025);

    if(sys.genesisProgress === undefined)
        sys.genesisProgress = (sys.type === TROP || sys.type === SUBTROP) ? 1 : 0;

    if(sys.type === TROPWAVE || sys.type === EXTROP || sys.genesisProgress < 1){
        const g = genesisPotential(sys.basin, sys.pos.x, sys.pos.y);
        if(g > 0.48){
            sys.genesisProgress += (g - 0.48) / 14;
        }else{
            sys.genesisProgress -= (0.48 - g) / 8;
        }

        const strongPreGenesis =
            g >= 0.52 &&
            sys.windSpeed >= 30 &&
            sys.organization >= 0.50 &&
            sys.lowerWarmCore >= 0.58;

        if(strongPreGenesis){
            sys.genesisProgress = max(sys.genesisProgress, 0.85);
        }

        const decisiveGenesis =
            g >= 0.55 &&
            sys.genesisProgress >= 0.82 &&
            sys.pressure < 998 &&
            sys.windSpeed >= 34;

        if(decisiveGenesis)
            sys.genesisProgress = 1;

        sys.genesisProgress = constrain(sys.genesisProgress, 0, 1);
    }else{
        sys.genesisProgress = 1;
    }

    if(sys.type === TROPWAVE && !canTropicalCycloneForm(sys)){
        const minPressure = map(
            sys.genesisProgress,
            0, 1,
            1008, 1000
        );

        const maxWind = map(
            sys.genesisProgress,
            0, 1,
            24, 33
        );

        sys.pressure = max(sys.pressure, minPressure);
        sys.windSpeed = min(sys.windSpeed, maxWind);
    }

    if(sys.kaboom > 0 && sys.kaboom < 1)
        sys.kaboom = random()<sys.kaboom ? 1 : 0;

    let namedBoom = false;
    if(sys.fetchStorm()){
        let d = sys.fetchStorm().designations.primary;
        for(let i = 0; i < d.length; i++){
            if(d[i].value === 'Boom'){
                namedBoom = true;
                sys.kaboom = 2;
            }
        }
    }

    if(sys.kaboom){
        if((!lnd || namedBoom) && (sys.organization > 0.8 || sys.kaboom === 2)){
            sys.kaboom = 2;
            if(sys.pressure > 600)
                sys.pressure -= random(5,10);
            sys.organization = 1;
            sys.lowerWarmCore = 1;
            if(sys.upperWarmCore < 0.5)
                sys.upperWarmCore = 0.5;
            sys.depth = 0.8;
        }

        if(lnd && !namedBoom){
            if(sys.kaboom === 2)
                sys.kaboom = 1;
            sys.organization = 0;
        }
    }else if(random()<0.0001)
        sys.kaboom = 1;

    if(sys.pressure > 1030 || sys.interaction.kill > 0)
        sys.kill = true;
};

// -- Type Determination -- //

function canTropicalCycloneForm(sys){
    return (sys.genesisProgress || 0) >= 1 &&
        (sys.organization || 0) >= 0.45 &&
        (sys.windSpeed || 0) >= 25 &&
        (sys.lowerWarmCore || 0) >= 0.55;
}

STORM_ALGORITHM.defaults.typeDetermination = function(sys,u){
    if(sys.genesisProgress === undefined)
        sys.genesisProgress = (sys.type === TROP || sys.type === SUBTROP) ? 1 : 0;

    const canForm = canTropicalCycloneForm(sys);

    switch(sys.type){
        case TROP:
            sys.type = sys.lowerWarmCore < 0.55 ? EXTROP : ((sys.organization < 0.4 && sys.windSpeed < 50) || sys.windSpeed < 20) ? (sys.upperWarmCore < 0.56 ? EXTROP : TROPWAVE) : (sys.upperWarmCore < 0.56 ? SUBTROP : TROP);
            break;
        case SUBTROP:
            sys.type = sys.lowerWarmCore < 0.55 ? EXTROP : ((sys.organization < 0.4 && sys.windSpeed < 50) || sys.windSpeed < 20) ? (sys.upperWarmCore < 0.57 ? EXTROP : TROPWAVE) : (sys.upperWarmCore < 0.57 ? SUBTROP : TROP);
            break;
        case TROPWAVE:
            if(sys.lowerWarmCore < 0.45)
                sys.type = EXTROP;
            else if(!canForm)
                sys.type = TROPWAVE;
            else if(sys.upperWarmCore < 0.56)
                sys.type = SUBTROP;
            else
                sys.type = TROP;
            break;
        default:
            if(sys.lowerWarmCore < 0.45)
                sys.type = EXTROP;
            else if(!canForm)
                sys.type = TROPWAVE;
            else if(sys.upperWarmCore < 0.57)
                sys.type = SUBTROP;
            else
                sys.type = TROP;
    }
};

// -- Version -- //
// Version number of a simulation mode's storm algorithm
// Used for upgrading the active attribute values if needed

STORM_ALGORITHM[SIM_MODE_NORMAL].version = 2;
STORM_ALGORITHM[SIM_MODE_HYPER].version = 2;
STORM_ALGORITHM[SIM_MODE_WILD].version = 2;
STORM_ALGORITHM[SIM_MODE_MEGABLOBS].version = 2;
STORM_ALGORITHM[SIM_MODE_EXPERIMENTAL].version = 3;
STORM_ALGORITHM[SIM_MODE_SPOOKY].version = 2;

// -- Upgrade -- //
// Converts active attributes in case an active system is loaded after an algorithm change breaks old values

STORM_ALGORITHM[SIM_MODE_NORMAL].upgrade =
STORM_ALGORITHM[SIM_MODE_HYPER].upgrade =
STORM_ALGORITHM[SIM_MODE_WILD].upgrade =
STORM_ALGORITHM[SIM_MODE_MEGABLOBS].upgrade =
STORM_ALGORITHM[SIM_MODE_SPOOKY].upgrade = function(sys,data,oldVersion){
    sys.organization = data.organization || 0;
    sys.lowerWarmCore = data.lowerWarmCore || 0;
    sys.upperWarmCore = data.upperWarmCore || 0;
    sys.depth = data.depth || 0;
    if(oldVersion < 1){
        sys.genesisProgress = (sys.type === TROP || sys.type === SUBTROP || data.type === TROP || data.type === SUBTROP) ? 1 : 0;
    }
    if(oldVersion < 2){
        if(sys.type === TROP || sys.type === SUBTROP || data.type === TROP || data.type === SUBTROP)
            sys.genesisProgress = 1;
        else
            sys.genesisProgress = constrain(data.genesisProgress || 0, 0, 0.85);
    }
};

STORM_ALGORITHM[SIM_MODE_EXPERIMENTAL].upgrade = function(sys,data,oldVersion){
    if(oldVersion < 1){
        sys.organization = data.organization || 0;
        sys.lowerWarmCore = data.lowerWarmCore || 0;
        sys.upperWarmCore = data.upperWarmCore || 0;
        sys.depth = data.depth || 0;
        sys.kaboom = 0;
    }
    if(oldVersion < 2){
        sys.genesisProgress = (sys.type === TROP || sys.type === SUBTROP || data.type === TROP || data.type === SUBTROP) ? 1 : 0;
    }
    if(oldVersion < 3){
        if(sys.type === TROP || sys.type === SUBTROP || data.type === TROP || data.type === SUBTROP)
            sys.genesisProgress = 1;
        else
            sys.genesisProgress = constrain(data.genesisProgress || 0, 0, 0.85);
    }
};

// STORM_ALGORITHM[SIM_MODE_SPOOKY].upgrade = function(sys,data,oldVersion){

// };