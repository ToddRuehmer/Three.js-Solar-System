$(function() {

            var renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
            renderer.setSize( $(window).width(), $(window).height() );
            document.body.appendChild( renderer.domElement );

			//Scene
            	var scene = new THREE.Scene();

			//Ground
			function Surface(name){
				if(!(this instanceof Surface)){ return new Surface(); }
				
				var self = this;
				self.name = name;
            	self.geometry = new THREE.PlaneGeometry(100, 100);
            	self.material = new THREE.MeshPhongMaterial( { color: 0x000000, wireframe: false, shading: THREE.FlatShading } );
	       	    self.mesh = new THREE.Mesh( self.geometry, self.material );
	       	    self.mesh.position.y = -3
	       	    self.mesh.rotation.x = Math.PI / -2;
				scene.add( self.mesh );           
			}
			var surfaces = [];
				
				//Ground
				surfaces.push(new Surface('Ground'));

			//Bodies
			function Body(options){
				if(!(this instanceof Body)){ return new Body(); }
				
				var self = this;
				self.object = new THREE.Object3D();
				self.name = options.name;
            	self.geometry = new THREE.SphereGeometry(options.size, 100, 100);
            	self.material = new THREE.MeshBasicMaterial( { color: '#' + options.color , wireframe: false } );
	       	    self.mesh = new THREE.Mesh( self.geometry, self.material );
		   		self.mesh.position.x = options.distance;
	            self.velocity = options.velocity;
				scene.add( self.mesh );         
				if(typeof options.parent !== 'undefined') {
					options.parent.mesh.add(self.object);
					self.object.add(self.mesh);
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
				if(!(this instanceof Planet)){ return new Planet(); }
				
				var self = this;
				return new Body(options);           
			}
			var planets = [];
				
				//Earth
				planets.push(new Planet({name:'Earth', size:1, color:'0077be', distance: 20, velocity: .01, parent: stars[0]}));

			//Camera
            var camera = new THREE.PerspectiveCamera(
                30,             							// Field of view
                $(window).width()/$(window).height(),      	// Aspect ratio
                0.1,            							// Near plane
                10000           							// Far plane
            );
            camera.position.set( 30, 10, 0 );
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
				for(var i=0; i<1; i++){
	        	    planets[i].object.rotation.y += planets[i].velocity;
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