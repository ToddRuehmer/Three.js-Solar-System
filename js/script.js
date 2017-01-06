$(function () {
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize($(window).width(), $(window).height());
    renderer.setClearColor('#000000');
    document.body.appendChild(renderer.domElement);
    //Scene
    var scene = new THREE.Scene(), speed = .005, orbitalScale = 25, planetaryScale = .5; //Actual: .0000851748829
    //Ground
    function Surface(name) {
        if (!(this instanceof Surface)) {
            return new Surface();
        }
        var self = this;
        self.name = name;
        self.geometry = new THREE.PlaneGeometry(1000, 1000);
        self.material = new THREE.MeshPhongMaterial({ color: 0x000000, wireframe: false, shading: THREE.FlatShading });
        self.mesh = new THREE.Mesh(self.geometry, self.material);
        self.mesh.position.y = -20;
        self.mesh.rotation.x = Math.PI / -2;
        scene.add(self.mesh);
    }
    var surfaces = [];
    //Ground
    //surfaces.push(new Surface('Ground'));
    //Bodies
    function Body(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.name, name = _c === void 0 ? '' : _c, _d = _b.color, color = _d === void 0 ? ff0000 : _d, _e = _b.size, size = _e === void 0 ? 3 : _e, _f = _b.distance, distance = _f === void 0 ? 3 : _f, _g = _b.velocity, velocity = _g === void 0 ? 3 : _g, _h = _b.parent, parent = _h === void 0 ? null : _h, _j = _b.rings, rings = _j === void 0 ? null : _j;
        if (!(this instanceof Body)) {
            return new Body();
        }
        var self = this;
        self.meshes = new THREE.Object3D();
        self.orbit = new THREE.Object3D();
        self.name = name;
        self.geometry = new THREE.SphereGeometry(size * planetaryScale, 100, 100);
        self.material = new THREE.MeshBasicMaterial({ color: '#' + color, wireframe: false });
        self.mesh = new THREE.Mesh(self.geometry, self.material);
        //Rings
        if (rings !== null) {
            self.rings = new THREE.TorusGeometry(size * rings.size, size * rings.width, 2, 100);
            self.ringsMesh = new THREE.Mesh(self.rings, self.material);
            self.ringsMesh.rotation.x = rings.rotation.x;
            self.ringsMesh.rotation.z = rings.rotation.z;
            self.ringsMesh.position.x = distance;
            self.mesh.add(self.ringsMesh);
        }
        self.mesh.position.x = distance;
        self.velocity = velocity;
        self.meshes.add(self.mesh);
        //Path
        self.pathMaterial = new THREE.LineBasicMaterial({ color: '#666666', wireframe: true });
        self.pathGeometry = new THREE.TorusGeometry(distance, .1, 2, 100);
        self.pathMesh = new THREE.Mesh(self.pathGeometry, self.pathMaterial);
        self.pathMesh.rotation.x = Math.PI / -2;
        scene.add(self.meshes);
        if (parent !== null) {
            parent.mesh.add(self.pathMesh);
            parent.mesh.add(self.orbit);
            self.orbit.add(self.meshes);
        }
    }
    var bodies = {};
    //Stars
    function Star(options) {
        if (!(this instanceof Star)) {
            return new Star();
        }
        var self = this;
        var cons = new Body(options);
        return cons;
    }
    bodies.stars = [];
    //Sun
    //Actual Size: 109
    bodies.stars.push(new Star({ name: 'Sun', size: 10, color: 'fdb813', distance: 0, velocity: .1 }));
    //Planets
    function Planet(options) {
        var self = this;
        var cons = new Body(options);
        cons.rotationVelocity = options.rotationVelocity;
        return cons;
    }
    bodies.planets = [];
    //Mercury
    bodies.planets.push(new Planet({ name: 'Mercury', size: .383, color: 'a1571e', distance: .387 * orbitalScale, velocity: 4.14937759 * speed, parent: bodies.stars[0], rotationVelocity: 1 }));
    //Venus
    bodies.planets.push(new Planet({ name: 'Venus', size: .949, color: 'f9c21a', distance: .723 * orbitalScale, velocity: 1.62601626016 * speed, parent: bodies.stars[0], rotationVelocity: 1 }));
    //Earth
    bodies.planets.push(new Planet({ name: 'Earth', size: 1, color: '0077be', distance: 1 * orbitalScale, velocity: 1 * speed, parent: bodies.stars[0], rotationVelocity: 1 }));
    //Moon
    //Real distance: .00257
    bodies.planets.push(new Planet({ name: 'Moon', size: .3, color: 'ccc', distance: .05 * orbitalScale, velocity: 13.36996337 * speed, parent: bodies.planets[2], rotationVelocity: 1 }));
    //Mars
    bodies.planets.push(new Planet({ name: 'Mars', size: .75, color: 'c1440e', distance: 1.524 * orbitalScale, velocity: .53129548762 * speed, parent: bodies.stars[0], rotationVelocity: 1 }));
    //Jupiter
    bodies.planets.push(new Planet({ name: 'Jupiter', size: 11.2, color: 'c99039', distance: 5.203 * orbitalScale, velocity: .08428393294 * speed, parent: bodies.stars[0], rotationVelocity: 1 }));
    //Saturn
    bodies.planets.push(new Planet({ name: 'Saturn', size: 9.45, color: 'e3e0c0', distance: 9.58 * orbitalScale, velocity: .0344827586 * speed, parent: bodies.stars[0], rotationVelocity: 1, rings: { size: 2, width: .5, rotation: { x: 1, z: 1 } } }));
    //Uranus
    bodies.planets.push(new Planet({ name: 'Uranus', size: 4.01, color: 'c6d3e3', distance: 19.2 * orbitalScale, velocity: .0119474313 * speed, parent: bodies.stars[0], rotationVelocity: 1 }));
    //Neptune
    bodies.planets.push(new Planet({ name: 'Neptune', size: 3.88, color: '70b7ba', distance: 30.05 * orbitalScale, velocity: .00610873549 * speed, parent: bodies.stars[0], rotationVelocity: 1 }));
    //Camera
    function Camera() {
        if (!(this instanceof Camera)) {
            return new Camera();
        }
        var self = this;
        self.camera = new THREE.PerspectiveCamera(30, // Field of view
        $(window).width() / $(window).height(), // Aspect ratio
        0.1, // Near plane
        10000 // Far plane
        );
        self.camera.position.set(-100, 20, 100);
        self.camera.lookAt(scene.position);
    }
    Camera.prototype.follow = function () {
        var self = this;
        requestAnimationFrame(self.follow.bind(self));
        var vector = new THREE.Vector3();
        vector.setFromMatrixPosition(self.target.mesh.matrixWorld);
        pos = vector;
        self.camera.fov = 1;
        self.camera.updateProjectionMatrix();
        self.camera.lookAt(vector);
        console.log('work');
    };
    var camera = new Camera;
    //	camera.follow();
    $('.planetnav a').on('click', function (e) {
        e.preventDefault();
        camera.target = bodies.planets[2]; //Replace with something more dynamic
        camera.follow();
    });
    ;
    function init() {
        var controls = new THREE.OrbitControls(camera.camera);
    }
    //Lights
    var light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3);
    light.position.set(0, 500, 0);
    scene.add(light);
    dirLight = new THREE.PointLight(0xffffff, .75);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(0, 0, 0);
    dirLight.position.multiplyScalar(50);
    scene.add(dirLight);
    //Begin Render
    renderer.render(scene, camera.camera);
    //Animate Render
    planetRotation = function () {
        for (var i = 0; i < bodies.planets.length; i++) {
            bodies.planets[i].orbit.rotation.y += bodies.planets[i].velocity;
        }
    };
    animate = function () {
        planetRotation();
    };
    render = function () {
        requestAnimationFrame(render);
        animate();
        renderer.render(scene, camera.camera);
    };
    revolve = function () {
        requestAnimationFrame(revolve);
    };
    revolve();
    //Render
    init();
    render();
});
