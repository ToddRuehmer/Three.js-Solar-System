$(function() {

            var renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
            renderer.setSize( $(window).width(), $(window).height() );
            renderer.setClearColor('#000000');
            document.body.appendChild( renderer.domElement );

			//Scene
            	var scene = new THREE.Scene(),
            		speed = .005,
            		orbitalScale = 25;

			//Ground
			function Surface(name){
				if(!(this instanceof Surface)){ return new Surface(); }
				
				var self = this;
				self.name = name;
            	self.geometry = new THREE.PlaneGeometry(1000, 1000);
            	self.material = new THREE.MeshPhongMaterial( { color: 0x000000, wireframe: false, shading: THREE.FlatShading } );
	       	    self.mesh = new THREE.Mesh( self.geometry, self.material );
	       	    self.mesh.position.y = -20
	       	    self.mesh.rotation.x = Math.PI / -2;
				scene.add( self.mesh );           
			}
			var surfaces = [];
				
				//Ground
				//surfaces.push(new Surface('Ground'));

			//Bodies
			function Body({name = '', color = ff0000, size = 3, distance = 3, velocity = 3, parent = null, rings = null} = {}){
				if(!(this instanceof Body)){ return new Body(); }
				var self = this;
				self.meshes = new THREE.Object3D();
				self.orbit = new THREE.Object3D();
				self.name = name;
            	self.geometry = new THREE.SphereGeometry(size, 100, 100);
            	self.material = new THREE.MeshBasicMaterial( { color: '#' + color , wireframe: false } );
            	if(rings !== null) {
            		self.rings = new THREE.TorusGeometry(size*rings.size, size*rings.width, 2, 100);
            		console.log(self.rings);
					self.ringsMesh = new THREE.Mesh( self.rings, self.material );
            		self.ringsMesh.rotation.x = rings.rotation.x;
            		self.ringsMesh.rotation.z = rings.rotation.z;
					self.ringsMesh.position.x = distance;
					self.meshes.add( self.ringsMesh ); 
            	}
	       	    self.mesh = new THREE.Mesh( self.geometry, self.material );
		   		self.mesh.position.x = distance;
	            self.velocity = velocity;
				self.meshes.add( self.mesh );   
				
				//Path
            	self.pathMaterial = new THREE.LineDashedMaterial( { color: '#666666' } );
				self.pathGeometry = new THREE.TorusGeometry(distance, .01, 100, 100);
	       	    self.pathMesh = new THREE.Mesh( self.pathGeometry, self.pathMaterial );
            	self.pathMesh.rotation.x = Math.PI / -2;
				self.meshes.add( self.pathMesh );  
				
				scene.add( self.meshes );         
				if(parent !== null) {
					parent.mesh.add(self.orbit);
					self.orbit.add(self.meshes);
				} 
			}

			//Stars
			function Star(options){
				if(!(this instanceof Star)){ return new Star(); }
				
				var self = this;
				return new Body(options);        
			}
			var stars = [];
            	
            	//Sun
				stars.push(new Star({name:'Sun', size:3, color:'fdb813', distance: 0, velocity: .1}));

			//Planets
			function Planet(options){
				
				var self = this;
				var cons = new Body(options);
				cons.rotationVelocity = options.rotationVelocity;
				
				return cons;                   
			}
			var planets = [];
				
				//Mercury
				planets.push(new Planet({name:'Mercury', size:.383, color:'a1571e', distance: .387 * orbitalScale, velocity: 4.14937759 * speed, parent: stars[0], rotationVelocity: 1}));
				
				//Venus
				planets.push(new Planet({name:'Venus', size:.949, color:'f9c21a', distance: .723 * orbitalScale, velocity: 1.62601626016 * speed, parent: stars[0], rotationVelocity: 1}));
				
				//Earth
				planets.push(new Planet({name:'Earth', size:1, color:'0077be', distance: 1 * orbitalScale, velocity: 1 * speed, parent: stars[0], rotationVelocity: 1}));
				//Moon
				//Real distance: .00257
				planets.push(new Planet({name:'Moon', size:.3, color:'ccc', distance: .15 * orbitalScale, velocity: 13.36996337 * speed, parent: planets[2], rotationVelocity: 1}));
				
				//Mars
				planets.push(new Planet({name:'Mars', size:.75, color:'c1440e', distance: 1.524 * orbitalScale, velocity: .53129548762 * speed, parent: stars[0], rotationVelocity: 1}));
				
				//Jupiter
				planets.push(new Planet({name:'Jupiter', size:11.2, color:'c99039', distance: 5.203 * orbitalScale, velocity: .08428393294 * speed, parent: stars[0], rotationVelocity: 1}));
				
				//Saturn
				planets.push(new Planet({name:'Saturn', size:9.45, color:'e3e0c0', distance: 9.58 * orbitalScale, velocity: .0344827586 * speed, parent: stars[0], rotationVelocity: 1, rings: {size:2, width:.5, rotation:{x:1, z:1}}}));
				
				//Uranus
				planets.push(new Planet({name:'Uranus', size:4.01, color:'c6d3e3', distance: 19.2 * orbitalScale, velocity: .0119474313 * speed, parent: stars[0], rotationVelocity: 1}));
				
				//Neptune
				planets.push(new Planet({name:'Neptune', size:3.88, color:'70b7ba', distance: 30.05 * orbitalScale, velocity: .00610873549 * speed, parent: stars[0], rotationVelocity: 1}));

			//Camera
            var camera = new THREE.PerspectiveCamera(
                30,             							// Field of view
                $(window).width()/$(window).height(),      	// Aspect ratio
                0.1,            							// Near plane
                10000           							// Far plane
            );
            camera.position.set( -100,20,20 );
            camera.lookAt( scene.position );
            	
			function init() {
            	var controls = new THREE.OrbitControls( camera );
            
            }

			//Lights
            var light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.3 );
            light.position.set( 0, 500, 0 );
            scene.add( light );
            
            dirLight = new THREE.PointLight( 0xffffff, .75 );
			dirLight.color.setHSL( 0.1, 1, 0.95 );
			dirLight.position.set( 0, 0, 0 );
			dirLight.position.multiplyScalar( 50 );
			scene.add( dirLight );
			
			//Begin Render
            renderer.render( scene, camera );
            
			//Animate Render
			planetRotation = function() {
				for(var i=0; i<planets.length; i++){
	        	    planets[i].orbit.rotation.y += planets[i].velocity;
	            }
	        }
			animate =  function() {
				planetRotation();
			}
            render = function() {
		        requestAnimationFrame(render);
		        
		        animate();
	            renderer.render(scene, camera);
            }
            revolve = function() {
		        requestAnimationFrame(revolve);
            }
            revolve();
            
            //Render
            init()
            render();
            
});